import Relation, {RelationOptions} from '@/lib/model/relation';
import Model, {ModelDataType} from '@/lib/model';
import {arrayRemove} from '@/lib/functions/array';

export interface HasManyRelationOptions<T extends typeof Model> extends RelationOptions<T> {
    defaultData?(): Data<T>;
}

export type Value<T extends typeof Model> = InstanceType<T>[];
export type Data<T extends typeof Model> = ModelDataType<T>[];

export default class HasMany<T extends typeof Model> extends Relation<T> {
    protected value: Value<T>;
    protected defaultData?: () => Data<T>;

    constructor(options: HasManyRelationOptions<T>) {
        super(options);

        this.value = this.buildValueFromData();
    }

    protected buildValueFromData(): Value<T> {
        const dataArray = this.resolveData() as Data<T>;

        return dataArray.map(data => this.createModel(data));
    }

    protected buildDataFromValue(): Data<T> {
        return this.value.map(model => model.getData());
    }

    protected isValidData(data: unknown): data is Data<T> {
        return Array.isArray(data);
    }

    protected getEmptyData(): Data<T> {
        return [];
    }

    getValue(): Value<T> {
        return super.getValue() as Value<T>;
    }

    setValue(value: Value<T>) {
        this.assignRelationsFromParentToMany(value);

        super.setValue(value);
    }

    contains(item: InstanceType<T>): boolean {
        return this.value.indexOf(item) !== -1;
    }

    push(item: InstanceType<T>) {
        if (this.contains(item)) {
            throw this.error(Error, 'Data integrity error: duplicate value encountered.', item);
        }

        this.assignRelationsFromParent(item);

        this.value.push(item);

        const data = this.getDataFromParent() as Data<T>;

        data.push(item.getData());
    }

    remove(item: InstanceType<T>) {
        if (arrayRemove(this.value, item)) {
            const parentData = this.getDataFromParent() as Data<T>;

            arrayRemove(parentData, item.getData());
        } else {
            this.warn('Data integrity warning: tried to remove an item that does not exist in the value', item);
        }
    }
}