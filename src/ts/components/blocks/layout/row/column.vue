<template>
    <abstract-block :block="block" class="flex-1">
        <block-list
            v-if="block.child"
            :children="[block.child]"
            :component-map="block.getComponentMap()" />
    </abstract-block>
</template>

<script lang="ts">
    // Modules
    import {defineComponent, PropType} from 'vue';

    // Components
    import AbstractBlock from '@/components/abstract-blocks/abstract-block.vue';
    import ColumnBlock from '@/models/blocks/layout/row/column';
    import BlockList from '@/components/abstract-blocks/block-list.vue';

    export default defineComponent({
        name: 'block-row',

        components: {BlockList, AbstractBlock},

        props: {
            block: ColumnBlock as PropType<ColumnBlock>
        }
    });
</script>