import Block, {TAnyBlockData, IBlockData, Data} from '@/models/block';

export interface IBlockListData extends IBlockData {
    children?: TAnyBlockData[];
}

export default abstract class BlockList<MD extends Data<IBlockListData> = IBlockListData> extends Block<MD> {
    public static readonly defaultCapabilities = {
        ...Block.defaultCapabilities,
        haveChildren: true,
        sortChildren: true
    };

    public abstract children: Block[];
}