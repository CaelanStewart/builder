import {cloneDeep} from 'lodash';
import Data from '@/lib/model/data';
import Relation, {RelationOptions} from '@/lib/model/relation';
import HasOne, {HasOneRelationOptions} from '@/lib/model/relation/has-one';
import HasMany, {HasManyRelationOptions} from '@/lib/model/relation/has-many';
import MorphOne, {MorphOneRelationOptions} from '@/lib/model/relation/morph-one';
import MorphMany, {MorphManyRelationOptions} from '@/lib/model/relation/morph-many';
import Historian from '@/lib/model/historian';

export interface ModelData {
    _type?: string;
}

export type ModelPropType<M extends typeof Model, P extends keyof InstanceType<M>> = InstanceType<M>[P];
export type ModelDataType<M extends typeof Model> = ModelPropType<M, 'data'>;
export type ModelDataPropType<M extends typeof Model, P extends keyof ModelDataType<M>> = ModelDataType<M>[P];

export interface RelationsObject {
    [name: string]: Relation<typeof Model>
}

type LocalRelationOptions<T extends typeof Model, O extends RelationOptions<T>, NT, PT> =
    Omit<O, 'type' | 'parent'> & {name: NT, prop?: PT};

export default class Model {
    public readonly data: Data<ModelData>;
    public readonly relations: RelationsObject = {};

    constructor(data: ModelData, historian: Historian) {
        this.data = new Data<ModelData>(data, historian);

        this.updateTypeString();
    }

    protected updateTypeString(): void {
        // Ensure type string is always present
        this.data.set('_type', this.constructor.name);
    }

    setProp<T extends this, D extends T['data'], P extends keyof D>(this: T, prop: P, value: D[P]) {
        (this.data as D)[prop] = value;
    }

    getProp<T extends this, D extends T['data'], P extends keyof D>(this: T, prop: P): D[P] {
        return (this.data as D)[prop];
    }

    // $<T extends this, D extends T['data'], P extends keyof D>(this: T, prop: P): D[P] {
    //     return this.getProp<T, D, P>(prop);
    // }

    // $<T extends this>(this: T): T['data'] {
    //     return this.data;
    // }

    getData(): this['data'] {
        return cloneDeep(this.data);
    }

    hasOne<T extends typeof Model,
        O extends LocalRelationOptions<T, HasOneRelationOptions<T>, keyof this, keyof this['data']>>
    (type: T, options: O): HasOne<T> {
        return new HasOne<T>({
            ...options,
            type,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }

    hasMany<T extends typeof Model,
        O extends LocalRelationOptions<T, HasManyRelationOptions<T>, keyof this, keyof this['data']>>
    (type: T, options: O): HasMany<T> {
        return new HasMany<T>({
            ...options,
            type,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }

    morphOne<
        SELF extends this,
        T extends typeof Model,
        O extends LocalRelationOptions<T, MorphOneRelationOptions<T>, keyof SELF, keyof SELF['data']>>
    (this: SELF, options: O): MorphOne<T> {
        return new MorphOne<T>({
            ...options,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }

    morphMany<T extends typeof Model,
        O extends LocalRelationOptions<T, MorphManyRelationOptions<T>, keyof this, keyof this['data']>>
    (options: O): MorphMany<T> {
        return new MorphMany<T>({
            ...options,
            parent: this,
            name: options.name,
            prop: options.prop
        });
    }
}
