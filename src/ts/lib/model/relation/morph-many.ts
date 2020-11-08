import Model, {ModelDataType} from '@/lib/model';
import HasMany, {HasManyRelationOptions} from '@/lib/model/relation/has-many';
import {TypeMap} from '@/lib/model/relation/morph';

export interface MorphManyRelationOptions<T extends typeof Model> extends HasManyRelationOptions<T> {
    types?: TypeMap;
}

export default class MorphMany<T extends typeof Model = typeof Model> extends HasMany<T> {
    constructor(options: Omit<MorphManyRelationOptions<T>, 'type'>) {
        super({
            type: Model as T,
            ...options
        });

        if (options.types) {
            this.types = options.types
        }
    }

    /**
     * Override base method to resolve the type as a morph type.
     *
     * @param data
     * @protected
     */
    protected resolveType(data: ModelDataType<T>): T {
        return this.resolveMorphType(data);
    }
}