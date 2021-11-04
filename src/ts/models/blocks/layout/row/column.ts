import Block, {IBlockData, IBlockOptions, Historian, Arg, IBlockCapabilities} from '@/models/block';

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

export default class ColumnBlock<MD extends Arg<IColumnBlockData> = Arg<IColumnBlockData>, O extends Arg<IColumnBlockOptions> = Arg<IColumnBlockOptions>> extends Block<MD, O> {
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

