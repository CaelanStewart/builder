import Historian from '@/lib/model/historian';
import Builder from '@/models/builder';
import ContainerBlock from '@/models/blocks/container';
import ImageBlock from '@/models/blocks/image';

export function createDemoBuilderModel(): Builder {
    const builder = Builder.makeBuilder({
        //
    });

    builder.container = builder.makeBlock(ContainerBlock, {
        //
    });

    builder.container.children = [
        builder.makeBlock(ImageBlock, {
            image: {
                src: './src/images/demo.png'
            }
        })
    ];

    return builder;
}