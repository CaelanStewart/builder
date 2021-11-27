// Models
import * as Models from '@/models';
import Block from '@/models/block';

// Modules
import Morph, {TypeMap} from '@/lib/model/relation/morph';

// Components
import Builder from '@/components/builder.vue';
import ContainerBlock from '@/components/blocks/container.vue';
import ImageBlock from '@/components/blocks/image.vue';
import {ComponentMap} from '@/types/vue/component-map';
import RowBlock from '@/components/blocks/layout/row.vue';
import ColumnBlock from '@/components/blocks/layout/row/column.vue';
import TextBlock from '@/components/blocks/content/text.vue';

export {
    Models,
    Builder
}

Morph.setDefaultTypeMap({
    ...Models
});

export function getDefaultBlockComponentMap(): ComponentMap {
    return {
        'block-container': ContainerBlock,
        'block-image': ImageBlock,
        'block-row': RowBlock,
        'block-column': ColumnBlock,
        'block-text': TextBlock
    }
}