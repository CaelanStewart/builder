import Block, {IBlockData, IBlockOptions, Historian, Arg} from '@/models/block';

export interface IHtmlBlockOptions extends IBlockOptions {
    //
}

export interface IHtmlBlockData extends IBlockData {
    options?: IHtmlBlockOptions;
    html: string;
}

export default class HtmlBlock<MD extends Arg<IHtmlBlockData> = IHtmlBlockData, O extends Arg<IHtmlBlockOptions> = Arg<IHtmlBlockOptions>> extends Block<MD, O> {
    static readonly type: string = 'html';

    getHtml() {
        return this.$.html;
    }
}
