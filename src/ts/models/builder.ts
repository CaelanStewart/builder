import ContainerBlock, {IContainerBlockData} from '@/models/blocks/container';
import Block, {IBlockData, IBlockOptions, Data, Historian} from '@/models/block';

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

export default class Builder<MD extends Data<IBuilderData> = IBuilderData> extends Block<MD> {
    public container: ContainerBlock|null = null;

    relations = {
        ...super.relations,
        container: this.hasOne(ContainerBlock, {
            name: 'container',
            prop: 'container'
        })
    }

    static makeBuilder<D extends IBuilderData>(data: D, history: Historian = new Historian): Builder<D> {
        return new Builder<D>(data, history);
    }
}