import Model, {ModelData} from '@/lib/model';
import {ImageBlockData} from '@/models/blocks/image';
import {ContainerBlockData} from '@/models/blocks/container';
import {ComponentMap} from '@/types/vue/component';

export interface HasChildren {
    children: Block[];
}

export interface BlockOptions {
    //
}

export interface BlockData extends ModelData {
    class?: string[];
    options?: BlockOptions;
}

export interface BlockCapabilities {
    haveChildren: boolean;
    sortChildren: boolean;

    move: boolean;
    edit: true;
}

export type AnyBlockData = ContainerBlockData | ImageBlockData;

export default class Block extends Model {
    protected static componentMap: ComponentMap = {};

    static readonly type: string = 'block';

    public readonly data: BlockData;

    public parent: Block | null = null;

    //
    public readonly capabilities: BlockCapabilities;

    public static readonly defaultCapabilities: BlockCapabilities = {
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

    constructor(data: BlockData) {
        super(data);

        data.options = {
            ...this.getDefaultOptions()
        }

        this.data = data;
        this.capabilities = this.resolveBlockCapabilities();
    }

    protected resolveBlockCapabilities(): this['capabilities'] {
        return {
            ...this.resolveBlockCapabilities()
        }
    }

    public getDefaultOptions(): BlockOptions {
        return {};
    }

    public getOptions<O extends Required<this['data']>['options']>(): O {
        return this.data.options as O;
    }

    public getOption<O extends Required<this['data']>['options'], K extends keyof O>(name: K): O[K] | undefined {
        if (name in this.getOptions()) {
            return (this.getOptions() as O)[name];
        }
    }

    public setOption<O extends Required<this['data']>['options'], K extends keyof O>(name: K, value: O[K]): void {
        (this.getOptions() as O)[name] = value;
    }

    public setManyOptions(options: Partial<this['data']>): void {
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
}