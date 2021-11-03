import Model, {IModelData, DataController, Historian, InstanceDataType, Data, ModelDataType} from '@/lib/model';
import {IImageBlockData} from '@/models/blocks/image';
import {IContainerBlockData} from '@/models/blocks/container';
import {ComponentMap} from '@/types/vue/component';
import Builder from '@/models/builder';

type BlockOptionsType<M extends Block> = Required<InstanceDataType<M>['options']>;
type BlockOptionType<M extends Block, K extends keyof BlockOptionsType<M>> = BlockOptionsType<M>[K];

export interface IHasChildren<T extends Block = Block> {
    children: T[];
}

export interface IBlockOptions {
    disabled?: boolean;
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

export {DataController, Historian, Data};

export default class Block<MD extends Data<IBlockData> = IBlockData> extends Model<MD> {
    protected static componentMap: ComponentMap = {};

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

    private readonly options: MD['options'];

    constructor(data: MD, history: Historian) {
        super(data, history);

        this.options = {
            ...this.getDefaultOptions(),
            ...data.options
        }
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

    public getOption<K extends keyof Required<MD>['options']>(name: K, defaultValue?: MD['options'][K]): MD['options'][K] | undefined {
        return (this.options as MD['options'])[name] ?? defaultValue;
    }

    public setOption<O extends MD['options'] & IBlockOptions, K extends keyof O>(name: K, value: O[K]): void {
        (this.options as O)[name] = value;
    }

    public setManyOptions(options: Partial<MD['options']>): void {
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                this.setOption(key, options[key]);
            }
        }
    }

    public getType(): string {
        return (this.constructor as typeof Block).type;
    }

    public static setComponentMap(map: ComponentMap): void {
        this.componentMap = map;
    }

    public static getComponentMap(): ComponentMap {
        return this.componentMap;
    }

    public new<M extends typeof Block, D extends ModelDataType<M>>(model: M, data: D, options: Partial<D['options']> = {}): InstanceType<M> {
        const block = this.makeModel(model, data);

        block.setManyOptions(options);

        return block;
    }
}