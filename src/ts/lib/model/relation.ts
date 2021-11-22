import Model, {
    ModelPropType,
    RelationsObject,
    ModelDataType, IModelData
} from '@/lib/model';
import {isSubtype} from '@/lib/functions/type';
import Morph, {TypeMap} from '@/lib/model/relation/morph';
import Historian from '@/lib/model/historian';
import {error} from '@/lib/functions/error';

export type RelationValueType<T extends typeof Model,
    K extends keyof RelationTypes<T>, R extends RelationTypes<T> = RelationTypes<T>> = ReturnType<R[K]['getValue']>;

export type RelationTypes<T extends typeof Model> = ModelPropType<T, 'relations'>;

export type RelationValueTypes<T extends typeof Model, R extends RelationsObject = RelationTypes<T>> = {
    [P in keyof R]: ReturnType<R[P]['getValue']>;
};

// Base Value and Data types
type ValueType<T extends typeof Model> = InstanceType<T> | InstanceType<T>[] | null;
type DataType<T extends typeof Model> = ModelDataType<T> | ModelDataType<T>[] | null;

export interface RelationOptions<T extends typeof Model> {
    parent: Model;
    type: T;
    name: string;
    prop?: string;
    relations?: Partial<RelationValueTypes<T>>;
    defaultData?(): DataType<T>;
}

export default class Relation<T extends typeof Model> {
    protected parent: Model;
    protected type: T;
    protected name: string;
    protected prop?: string;
    protected relations?: Partial<RelationValueTypes<T>>;
    protected value: ValueType<T>;
    protected types: TypeMap = { };
    protected defaultData?: () => DataType<T>;
    protected historian: Historian;

    constructor({parent, type, name, prop, relations}: RelationOptions<T>) {
        this.parent = parent;
        this.type = type;
        this.name = name;
        this.prop = prop;
        this.relations = relations;
        this.value = null;
        this.historian = parent.getHistorian();

        this.defineAccessor();
    }

    protected buildValueFromData(): ValueType<T> {
        throw new Error('This method must be overridden on derived classes');
    }

    protected buildDataFromValue(): DataType<T> {
        throw new Error('This method must be overridden in derived classes');
    }

    protected isValidData(data: unknown): data is DataType<T> {
        throw new Error('This method must be overridden on derived classes');
    }

    protected getEmptyData(): DataType<T> {
        throw new Error('This method must be overridden on derived classes');
    }

    protected getDefaultData(): DataType<T> {
        if (this.defaultData) {
            return this.defaultData();
        }

        return this.getEmptyData();
    }

    protected message(type: string, message: string) {
        return `[${this.constructor.name}]: ${type}: "${message}"`;
    }

    protected error<E extends typeof Error>(error: E, message: string, ...log: any[]) {
        console.log(this, ...log);

        return new error(this.message(error.constructor.name, message));
    }

    protected warn(message: string, ...log: any[]) {
        console.warn(this.message('Warning', message), ...log);
    }

    public buildData(): DataType<T> {
        // Cast to any because the base getDataFromValue method's return type is the union of all derivatives.
        // The type checking when specifying the prop should catch any misnomers.
        return this.buildDataFromValue();
    }

    public getProp() {
        return this.prop;
    }

    public getValue(): ValueType<T> {
        return this.value;
    }

    public setValue(value: ValueType<T>) {
        this.historian.transaction(() => {
            this.historian.do('set', {
                object: this,
                prop: 'value',
                oldValue: this.value,
                newValue: value
            })

            this.updateParentData();
        });
    }

    protected updateParentData(): void {
        if (this.prop) {
            (this.parent.$ as any)[this.prop] = this.buildData();
        }
    }

    protected getDataFromParent(): unknown {
        if (this.prop) {
            return (this.parent.data.getUntrackedData() as any)[this.prop];
        }

        return undefined;
    }

    protected resolveData(): DataType<T> {
        let data = this.getDataFromParent();

        if (data === undefined) {
            data = this.getDefaultData();
        }

        return this.validateData(data);
    }

    protected validateData(data: unknown): DataType<T> {
        if (this.isValidData(data)) {
            return data;
        }

        throw error(TypeError).on(this).log(data)
            .msg(`Data integrity error: invalid data encountered on parent for prop ${this.prop}`)
            .get();
    }

    public validateType(type: any): type is T {
        return isSubtype(this.type, type);
    }

    protected defineAccessor() {
        Object.defineProperty(this.parent, this.name, {
            set: (value: ValueType<T>) => this.setValue(value),
            get: () => this.getValue()
        });
    }

    protected createModel(data: ModelDataType<T>): InstanceType<T> {
        const type = this.resolveType(data);
        const model = new type(data, this.parent.data.getHistorian()) as InstanceType<T>;

        this.assignRelationsFromParent(model);

        return model;
    }

    protected assignRelationsFromParent(model: InstanceType<T>) {
        if (this.relations) {
            Object.assign(model, this.relations);
        }
    }

    protected assignRelationsFromParentToMany(models: InstanceType<T>[]) {
        for (const model of models) {
            this.assignRelationsFromParent(model);
        }
    }

    /**
     * Resolve the type.
     *
     * Overridden in derived Morph classes to use this.resolveMorphType().
     *
     * @param data
     * @protected
     */
    protected resolveType(data: ModelDataType<T>): T {
        return this.type;
    }

    public getTypeMap(): TypeMap {
        return this.types;
    }

    protected resolveMorphType(data: ModelDataType<T>): T {
        const type = data._type && Morph.resolveType(this.getTypeMap(), data._type);

        if (! type) {
            console.log(this);
            throw new Error(`Could not resolve type ${data._type} - Relation instance logged above`);
        }

        if (! this.validateType(type)) {
            console.log(this);
            throw new Error(`Invalid type encountered ${data._type} - Relation instance logged above`);
        }

        return type;
    }
}