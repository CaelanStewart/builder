import ContainerBlock, {IContainerBlockData} from '@/models/blocks/container';
import Block, {IBlockData, IBlockOptions, Data} from '@/models/block';

export interface EditMode {
    // permissions?: {
    //     remove?: boolean;
    //     edit: boolean;
    // }
}

export interface BuilderOptions extends IBlockOptions {
    // editMode?: EditMode;
}

export interface BuilderData extends IBlockData {
    container?: IContainerBlockData;
    options?: BuilderOptions;
}

export default class Builder<MD extends Data<BuilderData> = BuilderData> extends Block<MD> {
    public container: ContainerBlock|null = null;

    relations = {
        ...super.relations,
        container: this.hasOne(ContainerBlock, {
            name: 'container',
            prop: 'container'
        })
    }
}