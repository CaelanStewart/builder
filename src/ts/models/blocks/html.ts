import Block, {IBlockData, IBlockOptions, Historian, DataType} from '@/models/block';

export interface IHtmlBlockOptions extends IBlockOptions {
    //
}

export interface IHtmlBlockData extends IBlockData {
    options?: IHtmlBlockOptions;
    html: string;
}

export default class HtmlBlock<MD extends DataType<IHtmlBlockData> = IHtmlBlockData, O extends DataType<IHtmlBlockOptions> = DataType<IHtmlBlockOptions>> extends Block<MD, O> {
    static readonly type: string = 'html';

    getHtml() {
        return this.$.html;
    }
}
