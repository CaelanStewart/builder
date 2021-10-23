import Block, {IBlockData, IBlockOptions, Historian, Data, IBlockCapabilities} from '@/models/block';

export interface IColumnBlockOptions extends IBlockOptions {
    //
}

export interface IColumnBlockData extends IBlockData {
    options?: IColumnBlockOptions;
}

export default class ColumnBlock<MD extends Data<IColumnBlockData> = IColumnBlockData> extends Block<MD> {
    static readonly type = 'column';

    public getDefaultOptions(): IColumnBlockOptions {
        return {
            ...super.getDefaultOptions(),
            lazy: true
        };
    }
}

