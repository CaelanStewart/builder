<template>
    <abstract-block :block="block">
        <block-list :children="block.columns" :component-map="{}" />
    </abstract-block>
</template>

<script lang="ts">
    // Modules
    import {defineComponent, computed, PropType} from 'vue';

    // Models
    import RowBlock from '@/models/blocks/layout/row';

    // Components
    import AbstractBlock from '@/components/abstract-blocks/abstract-block.vue';
    import BlockList from '@/components/abstract-blocks/block-list.vue';

    export default defineComponent({
        name: 'block-row',

        components: {BlockList, AbstractBlock},

        props: {
            block: RowBlock as PropType<RowBlock>
        },

        setup(props) {

        }
    });
</script>