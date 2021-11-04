import DataController from '@/lib/model/data-controller';
import Relation, {RelationOptions} from '@/lib/model/relation';
import HasOne, {HasOneRelationOptions} from '@/lib/model/relation/has-one';
import HasMany, {HasManyRelationOptions} from '@/lib/model/relation/has-many';
import MorphOne, {MorphOneRelationOptions} from '@/lib/model/relation/morph-one';
import MorphMany, {MorphManyRelationOptions} from '@/lib/model/relation/morph-many';
import Historian from '@/lib/model/historian';
import {tap} from '@/lib/functions';

export interface IModelData {
    _type?: string;
}

// This must be used in for the types of Model data object in derived Models so
// that the construct signatures are all compatible between the derived types.
export type Arg<D> = Partial<Omit<D, keyof IModelData>> & IModelData;

export type DataObject = {[prop: string]: any};

export type ModelPropType<M extends typeof Model, P extends keyof InstanceType<M>> = InstanceType<M>[P];
export type ModelDataType<M extends typeof Model> = ReturnType<ModelPropType<M, 'getData'>>;
export type ModelDataPropType<M extends typeof Model, P extends keyof ModelDataType<M>> = ModelDataType<M>[P];
export type InstanceDataType<M extends Model> = ReturnType<M['getData']>;

export interface RelationsObject {
    [name: string]: Relation<typeof Model>
}

type LocalRelationOptions<T extends typeof Model, O extends RelationOptions<T>, SELF extends Model, MD extends IModelData> =
    Omit<O, 'type' | 'parent'> & {name: keyof SELF, prop?: keyof MD};

export {DataController, Historian, Relation};

/**
 * Base Model class, used for hierarchical organisation of data models. Contains logic specific to handling of the
 * directly relevant data.
 */
export default class Model<MD extends IModelData = IModelData> {
    public readonly data: DataController<MD>;
    public readonly relations: RelationsObject = {};

    public readonly $: MD;

    constructor(data: DataObject, history: Historian) {
        this.data = new DataController<MD>(data as MD, history);

        this.$ = this.data.getData();

        this.updateTypeString();
    }

    protected updateTypeString(): void {
        // Ensure type string is always present
        this.$._type = this.constructor.name;
    }

    getHistorian() {
        return this.data.getHistorian();
    }

    /**
     * Get the Model data.
     */
    getData() {
        return this.data.getData();
    }

    /**
     * Use this to do bulk assignment to data.
     *
     * @param values
     */
    updateData(values: Partial<MD>): this {
        this.data.setMany(values);

        return this;
    }

    assign(values: Partial<this>): this {
        Object.assign(this, values);

        return this;
    }

    tap(callback: (model: this) => any): this {
        return tap(this, callback);
    }

    protected createRelation<T extends typeof Model, R extends typeof Relation, O extends RelationOptions<T>>
    (relation: R, type: T, options: LocalRelationOptions<T, O, this, MD>): InstanceType<R> {
        return new relation({
            type,
            parent: this,
            name: options.name,
            prop: options.prop
        }) as InstanceType<R>
    }

    hasOne<T extends typeof Model>
    (type: T, options: LocalRelationOptions<T, HasOneRelationOptions<T>, this, MD>): HasOne<T> {
        return new HasOne<T>({
            ...options,
            type,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }

    hasMany<T extends typeof Model>
    (type: T, options: LocalRelationOptions<T, HasManyRelationOptions<T>, this, MD>): HasMany<T> {
        return new HasMany<T>({
            ...options,
            type,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }

    morphOne<T extends typeof Model>
    (options: LocalRelationOptions<T, MorphOneRelationOptions<T>, this, MD>): MorphOne<T> {
        return new MorphOne<T>({
            ...options,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }

    morphMany<T extends typeof Model>
    (options: LocalRelationOptions<T, MorphManyRelationOptions<T>, this, MD>): MorphMany<T> {
        return new MorphMany<T>({
            ...options,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }

    makeModel<M extends typeof Model>(model: M, data: ModelDataType<M>): InstanceType<M> {
        return new model(data, this.getHistorian()) as InstanceType<M>;
    }
}
