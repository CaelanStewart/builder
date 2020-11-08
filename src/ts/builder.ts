import {App} from 'vue';

// Models
import * as Models from '@/models';
import Block from '@/models/block';

// Modules
import Morph from '@/lib/model/relation/morph';

// Components
import Builder from '@/components/builder.vue';
import ContainerBlock from '@/components/blocks/container.vue';
import ImageBlock from '@/components/blocks/image.vue';
import {ComponentMap} from '@/types/vue/component';

export {
    Models,
    Builder
}

Morph.setDefaultTypeMap(Models);

Block.setComponentMap(getDefaultBlockComponentMap());

export function getDefaultBlockComponentMap(): ComponentMap {
    return {
        'block-container': ContainerBlock,
        'block-image': ImageBlock
    }
}