import Block, {AnyBlockData, BlockData} from '@/models/block';

export interface BlockListData extends BlockData {
    children?: AnyBlockData[];
}

export default abstract class BlockList extends Block {
    public readonly abstract data: BlockListData;

    public abstract children: Block[];
}