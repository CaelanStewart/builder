import Block, {IBlockData, IBlockOptions, Historian, DataType} from '@/models/block';

export interface ISpacerBlockOptions extends IBlockOptions {
    size: ''
}

export interface ISpacerBlockData extends IBlockData {
    options?: ISpacerBlockOptions;
}

export default class SpacerBlock<MD extends DataType<ISpacerBlockData> = ISpacerBlockData, O extends DataType<ISpacerBlockOptions> = DataType<ISpacerBlockOptions>> extends Block<MD, O> {
    static readonly type: string = 'spacer';
}
