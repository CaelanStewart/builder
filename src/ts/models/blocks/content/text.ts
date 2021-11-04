import Block, {IBlockData, IBlockOptions, Historian, Arg} from '@/models/block';

export interface ITextBlockOptions extends IBlockOptions {
    tag?: string;
}

export interface ITextBlockData extends IBlockData {
    options?: ITextBlockOptions;
    text?: string;
}

export default class TextBlock<MD extends Arg<ITextBlockData> = Arg<ITextBlockData>, O extends Arg<ITextBlockOptions> = Arg<ITextBlockOptions>> extends Block<MD, O> {
    static readonly type: string = 'text';

    getText() {
        return this.$.text;
    }
}
