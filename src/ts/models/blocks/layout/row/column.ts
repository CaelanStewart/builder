import Block, {IBlockData, IBlockOptions, Historian, Data, IBlockCapabilities} from '@/models/block';

export interface IColumnBlockOptions extends IBlockOptions {
    //
}

export interface IColumnBlockData extends IBlockData {
    options?: IColumnBlockOptions;
    child?: IBlockData;
}

export default class ColumnBlock<MD extends Data<IColumnBlockData> = Data<IColumnBlockData>> extends Block<MD> {
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

