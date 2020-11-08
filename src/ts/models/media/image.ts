import Model, {ModelData} from '@/lib/model';

export interface ImageModelData extends ModelData {
    src: string;
}

export default class Image extends Model {
    public readonly data: ImageModelData;

    constructor(data: ImageModelData) {
        super(data);

        this.data = data;
    }

    public getSrc(): string {
        return this.$.src;
    }
}