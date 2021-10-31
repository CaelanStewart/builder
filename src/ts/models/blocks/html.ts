import Block, {IBlockData, IBlockOptions, Historian, Data} from '@/models/block';

export interface IHtmlBlockOptions extends IBlockOptions {
    //
}

export interface IHtmlBlockData extends IBlockData {
    options?: IHtmlBlockOptions;
    html: string;
}

export default class HtmlBlock<MD extends Data<IHtmlBlockData> = IHtmlBlockData> extends Block<MD> {
    getHtml() {
        return this.$.html;
    }
}
