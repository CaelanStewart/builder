import Historian from '@/lib/model/historian';
import Builder from '@/models/builder';
import ContainerBlock from '@/models/blocks/container';
import ImageBlock from '@/models/blocks/image';
import RowBlock from '@/models/blocks/layout/row';
import ColumnBlock from '@/models/blocks/layout/row/column';

export function createDemoBuilderModel(): Builder {
    const historian = new Historian;
    const builder = Builder.makeBuilder({
        //
    }, historian);

    builder.container = builder.new(ContainerBlock, {
        //
    });

    builder.container.children = [
        builder.new(ImageBlock, {
            image: {
                src: './src/images/demo.png'
            }
        }),
        builder.new(RowBlock, {}).tap(row => {
            row.columns = [
                builder.new(ColumnBlock, {

                })
            ]
        })
    ];

    return builder;
}