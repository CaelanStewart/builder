<template>
    <abstract-block :block="block">

    </abstract-block>
</template>

<script lang="ts">
    // Modules
    import {defineComponent, computed, PropType} from 'vue';

    // Models
    import SpacerBlock from '@/models/blocks/layout/spacer';

    // Components
    import AbstractBlock from '@/components/abstract-blocks/abstract-block.vue';

    export default defineComponent({
        name: 'block-spacer',

        components: {AbstractBlock},

        props: {
            block: SpacerBlock as PropType<SpacerBlock>
        },

        setup(props) {

        }
    });
</script>