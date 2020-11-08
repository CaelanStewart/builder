import Builder from '@/models/builder';
import ContainerBlock from '@/models/blocks/container';
import ImageBlock from '@/models/blocks/image';

export function createDemoBuilderModel(): Builder {
    const builder = new Builder({});

    builder.container = new ContainerBlock({});

    builder.container.children = [
        new ImageBlock({
            image: {
                src: './src/images/demo.png'
            }
        })
    ];

    return builder;
}