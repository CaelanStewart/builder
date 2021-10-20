import Block, {TAnyBlockData, IBlockData, Data, IBlockCapabilities} from '@/models/block';

export interface IBlockListCapabilities extends IBlockCapabilities {
    haveChildren: boolean;
    editChildren: boolean;
}

export interface IBlockListData extends IBlockData {
    children?: TAnyBlockData[];
}

export default abstract class BlockList<MD extends Data<IBlockListData> = IBlockListData> extends Block<MD> {
    public readonly capabilities: IBlockListCapabilities = {
        ...super.capabilities,
        haveChildren: true,
        editChildren: true
    };

    public abstract children: Block[];
}