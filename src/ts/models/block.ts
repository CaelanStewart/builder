import Model, {IModelData, DataController, Historian, InstanceDataType, DataType, ModelDataType} from '@/lib/model';
import {IImageBlockData} from '@/models/blocks/image';
import {IContainerBlockData} from '@/models/blocks/container';
import {ComponentMap} from '@/types/vue/component-map';
import {Box, box} from '@/lib/functions/util';

// This must be used in for the types of Model data object in derived Models so
// that the construct signatures are all compatible between the derived types.
export type BDataType<D extends IBlockData> = Partial<Omit<D, keyof IBlockData>> & Omit<IBlockData, 'options'> & {options?: Partial<IBlockData['options']>};

export type BlockOptionsType<M extends Block> = ReturnType<M['getOptions']>;
export type BlockOptionType<M extends Block, K extends keyof BlockOptionsType<M>> = BlockOptionsType<M>[K];
export type BlockOptionKey<M extends Block> = keyof BlockOptionsType<M>;

export interface IHasChildren<T extends Block = Block> {
    children: T[];
}

export interface IBlockOptions {
    disabled?: boolean;
    inheritComponents?: boolean;
}

export interface IBlockData extends IModelData {
    class?: string[];
    options?: IBlockOptions;
}

export interface IBlockCapabilities {
    move: boolean;
    edit: boolean;
}

export type TAnyBlockData = IContainerBlockData | IImageBlockData;

export {DataController, Historian, DataType};

export default class Block<MD extends DataType<IBlockData> = DataType<IBlockData>, O extends DataType<IBlockOptions> = DataType<IBlockOptions>> extends Model<MD> {
    protected static componentMap: Box<ComponentMap> = box({});

    protected componentMap: Box<ComponentMap>;

    static readonly type: string = 'block';

    public parent: Block | null = null;

    public readonly capabilities: IBlockCapabilities = {
        move: true,
        edit: true
    };

    public readonly relations = {
        ...super.relations,
        parent: this.morphOne({
            name: 'parent'
        })
    }

    public readonly options: O;

    constructor(data: {[prop: string]: any}, history: Historian) {
        super(data as MD, history);

        this.options = {
            ...this.getDefaultOptions(),
            ...data.options
        }

        this.componentMap = box(this.resolveComponentMap());
    }

    public can<K extends keyof this['capabilities']>(capability: K): this['capabilities'][K] {
        return this['capabilities'][capability as keyof IBlockCapabilities] as unknown as this['capabilities'][K];
    }

    public getDefaultOptions(): MD['options'] {
        return {};
    }

    public getOptions(): MD['options'] {
        return this.options;
    }

    public getOption<K extends keyof O>(name: K, defaultValue?: O[K]): O[K] | undefined {
        return (this.options as O)[name] ?? defaultValue;
    }

    public setOption<K extends keyof O>(name: K, value: O[K]): void {
        (this.options as O)[name] = value;
    }

    public setManyOptions(options: Partial<O>): void {
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                this.setOption(key, options[key] as O[keyof O]);
            }
        }
    }

    public getType(): string {
        return (this.constructor as typeof Block).type;
    }

    /**
     * Get the initial component map from the static component map.
     *
     * @protected
     */
    protected resolveComponentMap(): ComponentMap {
        return (this.constructor as typeof Block).getComponentMap();
    }

    public getComponentMap(): ComponentMap {
        return this.componentMap.get();
    }

    public setComponentMap(map: ComponentMap): void {
        this.componentMap.set(map);
    }

    public defineComponents(map: ComponentMap): void {
        Object.assign(this.componentMap.get(), map);
    }

    public static getComponentMap(): ComponentMap {
        return this.componentMap.get();
    }

    public static setComponentMap(map: ComponentMap): void {
        this.componentMap.set(map);
    }

    public static defineComponents(map: ComponentMap): void {
        Object.assign(this.componentMap.get(), map);
    }

    public new<M extends typeof Block, D extends ModelDataType<M>>(model: M, data: D, options: Partial<D['options']> = {}): InstanceType<M> {
        return this.makeModel(model, data).tap(block => {
            block.setManyOptions(options);

            if (this.getOption('inheritComponents')) {
                block.defineComponents(this.getComponentMap());
            }
        })
    }
}