import Model, {ModelDataType} from '@/lib/model';
import HasOne, {HasOneRelationOptions} from '@/lib/model/relation/has-one';
import {TypeMap} from '@/lib/model/relation/morph';

export interface MorphOneRelationOptions<T extends typeof Model> extends HasOneRelationOptions<T> {
    types?: TypeMap;
}

export default class MorphOne<T extends typeof Model> extends HasOne<T> {
    constructor(options: Omit<MorphOneRelationOptions<T>, 'type'>) {
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