import Model, {IModelData, Historian, DataType} from '@/lib/model';

export interface IImageData extends IModelData {
    src: string;
}

export default class Image<MD extends DataType<IImageData> = IImageData> extends Model<MD> {
    public getSrc() {
        return this.$.src;
    }
}