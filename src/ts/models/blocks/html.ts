import Block, {BlockData, BlockOptions} from '@/models/block';

export interface HtmlBlockOptions extends BlockOptions {
    //
}

export interface HtmlBlockData extends BlockData {
    options?: HtmlBlockOptions;
    html: string;
}

export default class Html extends Block {
    public readonly data: HtmlBlockData;

    constructor(data: HtmlBlockData) {
        super(data);

        this.data = data;
    }

    getHtml(): string {
        return this.data.html;
    }
}
