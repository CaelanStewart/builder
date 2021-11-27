import Block, {
    TAnyBlockData,
    IBlockOptions,
    IHasChildren,
    DataType, BDataType
} from '@/models/block';
import BlockList, {IBlockListCapabilities, IBlockListData} from '@/models/block/block-list';

export interface IContainerBlockCapabilities extends IBlockListCapabilities {
    //
}

export interface IContainerBlockOptions extends IBlockOptions {
    align: 'start' | 'center' | 'end';
}

export interface IContainerBlockData extends IBlockListData {
    children?: TAnyBlockData[];
    options?: IContainerBlockOptions;
}

export default class ContainerBlock<MD extends BDataType<IContainerBlockData> = BDataType<IContainerBlockData>, O extends DataType<IContainerBlockOptions> = DataType<IContainerBlockOptions>> extends BlockList<MD, O> implements IHasChildren {
    static readonly type = 'container';

    public children: Block[] = [];

    readonly relations = {
        ...super.relations,
        children: this.morphMany({
            name: 'children',
            prop: 'children'
        })
    }

    getDefaultOptions(): IContainerBlockOptions {
        return {
            ...super.getDefaultOptions(),
            align: 'center'
        };
    }
}