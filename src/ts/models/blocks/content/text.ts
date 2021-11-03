import Block, {IBlockData, IBlockOptions, Historian, Data} from '@/models/block';

export interface ITextBlockOptions extends IBlockOptions {
    tag: string;
}

export interface ITextBlockData extends IBlockData {
    options?: ITextBlockOptions;
    text: string;
}

export default class TextBlock<MD extends Data<ITextBlockData> = ITextBlockData> extends Block<MD> {
    getText() {
        return this.$.text;
    }
}
