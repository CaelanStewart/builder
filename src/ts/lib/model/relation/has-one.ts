import Relation, {RelationOptions} from '@/lib/model/relation';
import Model, {ModelDataType} from '@/lib/model';

export interface HasOneRelationOptions<T extends typeof Model> extends RelationOptions<T> {
    //
}

export type ValueType<T extends typeof Model> = InstanceType<T>|null;
export type DataType<T extends typeof Model> = ModelDataType<T>|null;

export default class HasOne<T extends typeof Model> extends Relation<T> {
    protected value: ValueType<T>;

    constructor(options: HasOneRelationOptions<T>) {
        super(options);

        this.value = this.buildValueFromData();
    }

    protected buildValueFromData(): ValueType<T> {
        const data = this.resolveData() as DataType<T>;

        return data
            ? this.createModel(data)
            : null;
    }

    protected buildDataFromValue(): ModelDataType<T>|null {
        if (this.value) {
            return this.value.data.getMutableReferenceToData() as ModelDataType<T>;
        }

        return null;
    }

    protected isValidData(data: any): data is DataType<T> {
        return data === null || (data && typeof data === 'object');
    }

    protected getEmptyData(): DataType<T> {
        return null;
    }

    getValue(): ValueType<T> {
        return super.getValue() as ValueType<T>;
    }

    setValue(value: ValueType<T>) {
        super.setValue(value);
    }
}