import Block, {
    TAnyBlockData,
    IBlockOptions,
    IHasChildren,
    Arg
} from '@/models/block';
import BlockList, {IBlockListCapabilities, IBlockListData} from '@/models/block/block-list';

export interface IContainerBlockCapabilities extends IBlockListCapabilities {
    //
}

export interface IContainerBlockOptions extends IBlockOptions {
    //
}

export interface IContainerBlockData extends IBlockListData {
    children?: TAnyBlockData[];
    options?: IContainerBlockOptions;
}

export default class ContainerBlock<MD extends Arg<IContainerBlockData> = IContainerBlockData, O extends Arg<IContainerBlockOptions> = Arg<IContainerBlockOptions>> extends BlockList<MD, O> implements IHasChildren {
    static readonly type = 'container';

    public children: Block[] = [];

    readonly relations = {
        ...super.relations,
        children: this.morphMany({
            name: 'children',
            prop: 'children'
        })
    }

    public test() {
        this.can('editChildren');
    }
}