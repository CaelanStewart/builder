import Block, {IBlockData, IBlockOptions, Historian, DataType, IBlockCapabilities} from '@/models/block';

export interface IColumnBlockCapabilities extends IBlockCapabilities {

}

export interface IColumnBlockOptions extends IBlockOptions {
    //
}

export interface IColumnBlockData extends IBlockData {
    options?: IColumnBlockOptions;
    child?: IBlockData;
    test: string;
}

export default class ColumnBlock<MD extends DataType<IColumnBlockData> = DataType<IColumnBlockData>, O extends DataType<IColumnBlockOptions> = DataType<IColumnBlockOptions>> extends Block<MD, O> {
    static readonly type = 'column';

    child: Block | null = null;

    readonly relations = {
        ...super.relations,
        child: this.morphOne({
            name: 'child',
            prop: 'child'
        })
    }

    public getDefaultOptions(): IColumnBlockOptions {
        return {
            ...super.getDefaultOptions() || {}
        };
    }
}

