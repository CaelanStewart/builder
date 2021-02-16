import {cloneDeep} from 'lodash';
import DataController from '@/lib/model/data-controller';
import Relation, {RelationOptions} from '@/lib/model/relation';
import HasOne, {HasOneRelationOptions} from '@/lib/model/relation/has-one';
import HasMany, {HasManyRelationOptions} from '@/lib/model/relation/has-many';
import MorphOne, {MorphOneRelationOptions} from '@/lib/model/relation/morph-one';
import MorphMany, {MorphManyRelationOptions} from '@/lib/model/relation/morph-many';
import Historian from '@/lib/model/historian';

export interface IModelData {
    _type?: string;
}

// This must be used in for the types of Model data object in derived Models so
// that the construct signatures are all compatible between the derived types.
export type Data<D extends IModelData> = Partial<Omit<D, keyof IModelData>> & IModelData;

export type ModelPropType<M extends typeof Model, P extends keyof InstanceType<M>> = InstanceType<M>[P];
export type ModelDataType<M extends typeof Model> = ReturnType<ModelPropType<M, 'getData'>>;
export type ModelDataPropType<M extends typeof Model, P extends keyof ModelDataType<M>> = ModelDataType<M>[P];
export type InstanceDataType<M extends Model> = ReturnType<M['getData']>;

export interface RelationsObject {
    [name: string]: Relation<typeof Model>
}

type LocalRelationOptions<T extends typeof Model, O extends RelationOptions<T>, NT, PT> =
    Omit<O, 'type' | 'parent'> & {name: NT, prop?: PT};

export {DataController, Historian, Relation};

export default class Model<MD extends IModelData = IModelData> {
    public readonly data: DataController<MD>;
    public readonly relations: RelationsObject = {};

    constructor(data: MD, history: Historian) {
        this.data = new DataController<MD>(data, history);

        this.updateTypeString();
    }

    protected updateTypeString(): void {
        // Ensure type string is always present
        this.data.set('_type', this.constructor.name);
    }

    getData() {
        return this.data.getData();
    }

    // $<T extends this, D extends T['data'], P extends keyof D>(this: T, prop: P): D[P] {
    //     return this.getProp<T, D, P>(prop);
    // }

    // $<T extends this>(this: T): T['data'] {
    //     return this.data;
    // }

    hasOne<T extends typeof Model>
    (type: T, options: LocalRelationOptions<T, HasOneRelationOptions<T>, keyof this, keyof MD>): HasOne<T> {
        return new HasOne<T>({
            ...options,
            type: type as T,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }

    hasMany<T extends typeof Model>
    (type: T, options: LocalRelationOptions<T, HasManyRelationOptions<T>, keyof this, keyof MD>): HasMany<T> {
        return new HasMany<T>({
            ...options,
            type,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }

    morphOne<T extends typeof Model>
    (options: LocalRelationOptions<T, MorphOneRelationOptions<T>, keyof this, keyof MD>): MorphOne<T> {
        return new MorphOne<T>({
            ...options,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }

    morphMany<T extends typeof Model>
    (options: LocalRelationOptions<T, MorphManyRelationOptions<T>, keyof this, keyof MD>): MorphMany<T> {
        return new MorphMany<T>({
            ...options,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }

    makeModel<M extends typeof Model>(model: M, data: ModelDataType<M>): InstanceType<M> {
        return new model(data, this.data.getHistorian()) as InstanceType<M>;
    }
}
