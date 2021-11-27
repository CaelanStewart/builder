import Block, {IBlockData, IBlockOptions, DataType} from '@/models/block';

export interface ITextBlockOptions extends IBlockOptions {
    tag?: string;
}

export interface ITextBlockData extends IBlockData {
    options: ITextBlockOptions;
    text: string;
    test: string[];
}

export default class TextBlock<MD extends DataType<ITextBlockData> = DataType<ITextBlockData>, O extends DataType<ITextBlockOptions> = DataType<ITextBlockOptions>> extends Block<MD, O> {
    static readonly type: string = 'text';

    getText() {
        return this.$.text;
    }
}
