<template>
    <abstract-block :block="block">

    </abstract-block>
</template>

<script lang="ts">
    // Modules
    import {defineComponent, computed, PropType} from 'vue';

    // Models
    import RowBlock from '@/models/blocks/row';

    // Components
    import AbstractBlock from '@/components/abstract-blocks/abstract-block.vue';

    export default defineComponent({
        name: 'block-row',

        components: {AbstractBlock},

        props: {
            block: RowBlock as PropType<RowBlock>
        },

        setup(props) {

        }
    });
</script>