import Relation, {RelationOptions} from '@/lib/model/relation';
import Model, {ModelDataType} from '@/lib/model';
import {arrayRemove} from '@/lib/functions/array';
import {createArrayProxy} from '@/lib/model/historian/data-proxy/array';

export interface HasManyRelationOptions<T extends typeof Model> extends RelationOptions<T> {
    defaultData?(): Data<T>;
}

export type Value<T extends typeof Model> = InstanceType<T>[];
export type Data<T extends typeof Model> = ModelDataType<T>[];

export default class HasMany<T extends typeof Model> extends Relation<T> {
    protected value: Value<T>;

    constructor(options: HasManyRelationOptions<T>) {
        super(options);

        this.value = createArrayProxy(this.historian, this.buildValueFromData());
    }

    protected buildValueFromData(): Value<T> {
        const dataArray = this.resolveData() as Data<T>;

        return dataArray.map(data => this.createModel(data));
    }

    protected buildDataFromValue(): Data<T> {
        return this.value.map(model => model.data.getUntrackedData()) as Data<T>;
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
        this.historian.transaction(() => {
            this.assignRelationsFromParentToMany(value);

            super.setValue(
                createArrayProxy(this.historian, value)
            );
        });
    }

    contains(item: InstanceType<T>): boolean {
        return this.value.indexOf(item) !== -1;
    }

    push(item: InstanceType<T>) {
        if (this.contains(item)) {
            throw this.error(Error, 'Data integrity error: duplicate value encountered.', item);
        }

        this.historian.transaction(() => {
            this.assignRelationsFromParent(item);

            this.value.push(item);

            const data = this.getDataFromParent() as Data<T>;

            data.push(item.data.getUntrackedData() as ModelDataType<T>);
        })
    }

    remove(item: InstanceType<T>) {
        this.historian.transaction(() => {
            if (arrayRemove(this.value, item)) {
                const parentData = this.getDataFromParent() as Data<T>;

                arrayRemove(parentData, item.getData());
            } else {
                this.warn('Data integrity warning: tried to remove an item that does not exist in the value', item);
            }
        })
    }
}