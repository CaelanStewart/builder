import Block, {TAnyBlockData, IBlockData, DataType, IBlockCapabilities, IBlockOptions} from '@/models/block';

export interface IBlockListCapabilities extends IBlockCapabilities {
    haveChildren: boolean;
    editChildren: boolean;
}

export interface IBlockListData extends IBlockData {
    children?: TAnyBlockData[];
}

export default abstract class BlockList<MD extends DataType<IBlockListData> = IBlockListData, O extends DataType<IBlockOptions> = DataType<IBlockOptions>> extends Block<MD, O> {
    public readonly capabilities: IBlockListCapabilities = {
        ...super.capabilities,
        haveChildren: true,
        editChildren: true
    };

    public abstract children: Block[];
}