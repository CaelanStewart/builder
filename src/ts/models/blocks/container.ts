import Block, {
    TAnyBlockData,
    IBlockOptions,
    IHasChildren,
    Data
} from '@/models/block';
import BlockList, {IBlockListData} from '@/models/block/block-list';

export interface IContainerBlockOptions extends IBlockOptions {
    //
}

export interface IContainerBlockData extends IBlockListData {
    children?: TAnyBlockData[];
    options?: IContainerBlockOptions;
}

export default class ContainerBlock<MD extends Data<IContainerBlockData> = IContainerBlockData> extends BlockList<MD> implements IHasChildren {
    static readonly type = 'container';

    public children: Block[] = [];

    relations = {
        ...super.relations,
        children: this.morphMany({
            name: 'children',
            prop: 'children'
        })
    }
}