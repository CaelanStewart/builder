import Block, {IBlockData, IBlockOptions, Historian, Arg, IBlockCapabilities} from '@/models/block';
import ColumnBlock, {IColumnBlockData} from '@/models/blocks/layout/row/column';
import HasMany from '@/lib/model/relation/has-many';

export interface IRowBlockOptions extends IBlockOptions {
    //
}

export interface IRowBlockData extends IBlockData {
    columns?: IColumnBlockData[];
    options?: IRowBlockOptions;
}

export default class RowBlock<MD extends Arg<IRowBlockData> = IRowBlockData, O extends Arg<IRowBlockOptions> = Arg<IRowBlockOptions>> extends Block<MD, O> {
    static readonly type = 'row';

    public columns: ColumnBlock[] = [];

    public readonly relations = {
        ...super.relations,
        columns: this.hasMany(ColumnBlock, {
            name: 'columns',
            prop: 'columns'
        })
    }

    public test() {

    }
}

