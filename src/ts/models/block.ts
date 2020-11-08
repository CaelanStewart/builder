import Model, {ModelData} from '@/lib/model';
import {ImageBlockData} from '@/models/blocks/image';
import {ContainerBlockData} from '@/models/blocks/container';
import {ComponentMap} from '@/types/vue/component';

export interface BlockOptions {

}

export interface BlockData extends ModelData {
    class?: string[];
    options?: BlockOptions;
}

export type AnyBlockData = ContainerBlockData | ImageBlockData;

export default class Block extends Model {
    protected static componentMap: ComponentMap = {};

    static readonly type: string = 'block';

    public readonly data: BlockData;

    public parent: Block|null = null;

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
    }

    public getDefaultOptions(): BlockOptions {
        return {};
    }

    public getOptions<O extends Required<this['data']>['options']>(): O {
        return this.data.options as O;
    }

    public getOption<O extends Required<this['data']>['options'], K extends keyof O>(name: K): O[K]|undefined {
        if (name in this.getOptions()) {
            return (this.getOptions() as O)[name];
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