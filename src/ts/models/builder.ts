import Model, {ModelData} from '@/lib/model';
import ContainerBlock, {ContainerBlockData} from '@/models/blocks/container';

export interface BuilderData extends ModelData {
    container?: ContainerBlockData;
}

export default class Builder extends Model {
    public readonly data: BuilderData;

    public container: ContainerBlock|null = null;

    relations = {
        ...super.relations,
        container: this.hasOne(ContainerBlock, {
            name: 'container',
            prop: 'container'
        })
    }

    constructor(data: BuilderData) {
        super(data);

        this.data = data;
    }
}