import Relation, {RelationOptions} from '@/lib/model/relation';
import Model, {ModelDataType} from '@/lib/model';

export interface HasOneRelationOptions<T extends typeof Model> extends RelationOptions<T> {
    //
}

export type Value<T extends typeof Model> = InstanceType<T>|null;
export type Data<T extends typeof Model> = ModelDataType<T>|null;

export default class HasOne<T extends typeof Model> extends Relation<T> {
    protected value: Value<T>;

    constructor(options: HasOneRelationOptions<T>) {
        super(options);

        this.value = this.buildValueFromData();
    }

    protected buildValueFromData(): Value<T> {
        const data = this.resolveData() as Data<T>;

        return data
            ? this.createModel(data)
            : null;
    }

    protected buildDataFromValue(): ModelDataType<T>|null {
        if (this.value) {
            return this.value.getData();
        }

        return null;
    }

    protected isValidData(data: unknown): data is Data<T> {
        return data === null || (data && typeof data === 'object');
    }

    protected getEmptyData(): Data<T> {
        return null;
    }

    getValue(): Value<T> {
        return super.getValue() as Value<T>;
    }

    setValue(value: Value<T>) {
        super.setValue(value);
    }
}