import Block, {IBlockData, IBlockOptions, Historian, DataType, IBlockCapabilities} from '@/models/block';
import Image, {IImageData} from '@/models/media/image';

export interface IImageBlockOptions extends IBlockOptions {
    lazy?: boolean;
    alt?: string;
}

export interface IImageBlockData extends IBlockData {
    image: IImageData|null;
    options?: IImageBlockOptions;
}

export default class ImageBlock<MD extends DataType<IImageBlockData> = IImageBlockData, O extends DataType<IImageBlockOptions> = DataType<IImageBlockOptions>> extends Block<MD, O> {
    static readonly type = 'image';

    public image: Image|null = null;

    public readonly relations = {
        ...super.relations,
        image: this.hasOne(Image, {
            name: 'image',
            prop: 'image'
        })
    }

    public getDefaultOptions(): IImageBlockOptions {
        return {
            ...super.getDefaultOptions(),
            lazy: true
        };
    }

    getSrc() {
        return this.image?.getSrc();
    }
}

