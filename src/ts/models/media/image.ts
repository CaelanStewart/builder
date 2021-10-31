import Model, {IModelData, Historian, Data} from '@/lib/model';

export interface IImageData extends IModelData {
    src: string;
}

export default class Image<MD extends Data<IImageData> = IImageData> extends Model<MD> {
    public getSrc() {
        return this.$.src;
    }
}