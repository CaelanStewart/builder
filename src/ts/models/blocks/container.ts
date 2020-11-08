import Block, {AnyBlockData, BlockCapabilities, BlockOptions, HasChildren} from '@/models/block';
import BlockList, {BlockListData} from '@/models/block/block-list';

export interface ContainerBlockOptions extends BlockOptions {
    //
}

export interface ContainerBlockData extends BlockListData {
    children?: AnyBlockData[];
    options?: ContainerBlockOptions;
}

export default class ContainerBlock extends BlockList implements HasChildren {
    static readonly type = 'container';

    public readonly data: ContainerBlockData;
    public children: Block[] = [];

    relations = {
        ...super.relations,
        children: this.morphMany({
            name: 'children',
            prop: 'children'
        })
    }

    constructor(data: ContainerBlockData) {
        super(data);

        this.data = data;
    }
}