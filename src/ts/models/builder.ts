import ContainerBlock, {IContainerBlockData} from '@/models/blocks/container';
import Block, {IBlockData, IBlockOptions, DataType, Historian} from '@/models/block';
import {ComponentMap} from '@/types/vue/component-map';

export interface EditMode {
    // permissions?: {
    //     remove?: boolean;
    //     edit: boolean;
    // }
}

export interface IBuilderOptions extends IBlockOptions {
    // editMode?: EditMode;
}

export interface IBuilderData extends IBlockData {
    container?: IContainerBlockData;
    options?: IBuilderOptions;
}

export default class Builder<MD extends DataType<IBuilderData> = IBuilderData, O extends DataType<IBuilderOptions> = DataType<IBuilderOptions>> extends Block<MD, O> {
    public container: ContainerBlock|null = null;

    static readonly type: string = 'builder';

    relations = {
        ...super.relations,
        container: this.hasOne(ContainerBlock, {
            name: 'container',
            prop: 'container'
        })
    }

    static makeBuilder<D extends IBuilderData>(options: {data: D, history?: Historian, components?: ComponentMap}): Builder<D> {
        return new Builder<D>(options.data, options.history ?? new Historian).tap(builder => {
            if (options.components) {
                builder.defineComponents(options.components);
            }
        });
    }
}