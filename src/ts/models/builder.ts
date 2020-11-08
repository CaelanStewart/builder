import ContainerBlock, {ContainerBlockData} from '@/models/blocks/container';
import Block, {BlockData, BlockOptions} from '@/models/block';

export interface EditMode {
    // permissions?: {
    //     remove?: boolean;
    //     edit: boolean;
    // }
}

export interface BuilderOptions extends BlockOptions {
    // editMode?: EditMode;
}

export interface BuilderData extends BlockData {
    container?: ContainerBlockData;
    options?: BuilderOptions;
}

export default class Builder extends Block {
    public readonly data: BuilderData;

    public container: ContainerBlock|null = null;

    relations = {
        ...super.relations,
        container: this.hasOne(ContainerBlock, {
            name: 'container',
            prop: 'container'
        })
    }

    constructor(data: BuilderData) {
        super(data);

        this.data = data;
    }
}