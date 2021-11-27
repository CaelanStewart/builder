import {shallowReactive} from 'vue';

export * from '@/composable/block/events';

import Block from '@/models/block';
import {ComponentMap} from '@/types/vue/component-map';

export function getBlockClasses(block?: Block) {
    return [
        'block',
        `block-${block?.getType()}`
    ];
}

export function getComponentMap(merge: ComponentMap = {}) {
    return {
        ...Block.getComponentMap(),
        ...merge
    };
}