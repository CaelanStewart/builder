import Block, {BlockData, BlockOptions} from '@/models/block';
import Image, {ImageModelData} from '@/models/media/image';

export interface ImageBlockOptions extends BlockOptions {

}

export interface ImageBlockData extends BlockData {
    image: ImageModelData|null;
    options?: ImageBlockOptions;
    lazy?: boolean;
    alt?: string;
}

export default class ImageBlock extends Block {
    static readonly type = 'image';

    public readonly data: ImageBlockData;
    public image: Image|null = null;

    public readonly relations = {
        ...super.relations,
        image: this.hasOne(Image, {
            name: 'image',
            prop: 'image'
        })
    }

    constructor(data: ImageBlockData) {
        super(data);

        this.data = data;
    }

    public getDefaultOptions(): ImageBlockOptions {
        return {
            ...super.getDefaultOptions(),
            lazy: true
        };
    }

    getSrc(): string {
        return this.image?.getSrc() ?? '';
    }
}
