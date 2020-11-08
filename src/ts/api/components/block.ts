import {ComponentPublicInstance} from 'vue';
import Block from '@/models/block';
import {ComponentMap} from '@/types/vue/component';

export function getBlockClasses(block?: Block) {
    return [
        'block',
        `block-${block?.getType()}`
    ];
}

export function getBlockProps<T extends typeof Block>(type: T) {
    return {
        block: {
            type: type,
            required: true
        }
    }
}

export function getComponentMap(merge: ComponentMap = {}) {
    return {
        ...Block.getComponentMap(),
        ...merge
    };
}