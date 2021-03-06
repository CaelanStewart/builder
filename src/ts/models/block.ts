import Model, {IModelData, DataController, Historian, InstanceDataType, Data, ModelDataType} from '@/lib/model';
import {IImageBlockData} from '@/models/blocks/image';
import {IContainerBlockData} from '@/models/blocks/container';
import {ComponentMap} from '@/types/vue/component';

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
    haveChildren: boolean;
    sortChildren: boolean;

    move: boolean;
    edit: true;
}

export type TAnyBlockData = IContainerBlockData | IImageBlockData;

export {DataController, Historian, Data};

export default class Block<MD extends Data<IBlockData> = IBlockData> extends Model<MD> {
    protected static componentMap: ComponentMap = {};

    static readonly type: string = 'block';

    public parent: Block | null = null;

    //
    public readonly capabilities: IBlockCapabilities;

    public static readonly defaultCapabilities: IBlockCapabilities = {
        haveChildren: false,

        sortChildren: false,
        move: true,
        edit: true
    };

    public readonly relations = {
        ...super.relations,
        parent: this.morphOne({
            name: 'parent'
        })
    }

    constructor(data: MD, history: Historian) {
        super(data, history);

        data.options = {
            ...this.getDefaultOptions(),
            ...data.options
        }

        this.capabilities = this.resolveBlockCapabilities();
    }

    protected resolveBlockCapabilities(): this['capabilities'] {
        return {
            ...this.resolveBlockCapabilities()
        }
    }

    public getDefaultOptions(): MD['options'] {
        return {};
    }

    public getOptions(): MD['options'] {
        return this.data.get('options');
    }

    public getOption<O extends MD['options'] & IBlockOptions, K extends keyof O>(name: K): O[K] | undefined {
        const options = this.getOptions() as O;

        if (options && (name in options)) {
            return options[name];
        }
    }

    public setOption<O extends MD['options'] & IBlockOptions, K extends keyof O>(name: K, value: O[K]): void {
        (this.getOptions() as O)[name] = value;
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

    public makeBlock<M extends typeof Block, D extends ModelDataType<M>>(model: M, data: D, options: Partial<D['options']> = {}): InstanceType<M> {
        const block = this.makeModel(model, data);

        block.setManyOptions(options);

        return block;
    }
}