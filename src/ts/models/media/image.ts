import Model, {IModelData, Historian, Arg} from '@/lib/model';

export interface IImageData extends IModelData {
    src: string;
}

export default class Image<MD extends Arg<IImageData> = IImageData> extends Model<MD> {
    public getSrc() {
        return this.$.src;
    }
}