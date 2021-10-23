<template>
    <abstract-block :block="block">

    </abstract-block>
</template>

<script lang="ts">
    // Modules
    import {defineComponent, computed, PropType} from 'vue';

    // Components
    import AbstractBlock from '@/components/abstract-blocks/abstract-block.vue';
    import ColumnBlock from '@/models/blocks/layout/row/column';

    export default defineComponent({
        name: 'block-row',

        components: {AbstractBlock},

        props: {
            block: ColumnBlock as PropType<ColumnBlock>
        },

        setup(props) {

        }
    });
</script>