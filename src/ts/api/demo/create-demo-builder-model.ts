import Historian from '@/lib/model/historian';
import Builder from '@/models/builder';
import ContainerBlock from '@/models/blocks/container';
import ImageBlock from '@/models/blocks/image';
import RowBlock from '@/models/blocks/layout/row';
import ColumnBlock from '@/models/blocks/layout/row/column';
import TextBlock from '@/models/blocks/content/text';
import {getDefaultBlockComponentMap} from '@/builder';

export function createDemoBuilderModel(): Builder {
    const size = 50;
    const epochTime = 20000;
    const historian = new Historian(size, epochTime);

    console.log(`Created Historian (size: ${size}, epochTime: ${epochTime})`);

    const builder = Builder.makeBuilder({
        data: {
            //
        },
        history: historian,
        components: getDefaultBlockComponentMap()
    });

    builder.container = builder.new(ContainerBlock, {
        //
    });

    builder.container.children = [
        builder.new(RowBlock, {}).tap(row => {
            row.columns = [
                builder.new(ColumnBlock, {}).tap(col => {
                    col.child = builder.new(TextBlock, {
                        text: 'Test text',
                        test: ['1', '2']
                    })
                }),
                builder.new(ColumnBlock, {

                })
            ]
        }),
        builder.new(ImageBlock, {
            image: {
                src: './src/images/demo.png'
            }
        })
    ];

    return builder;
}