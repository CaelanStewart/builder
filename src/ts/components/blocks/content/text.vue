<template>
    <abstract-block :block="block">
        <component :is="block.getOption('tag', 'p')">{{ block.$.text }}</component>
    </abstract-block>
</template>

<script lang="ts">
    // Modules
    import {defineComponent, computed, PropType} from 'vue';

    // Models
    import TextBlock from '@/models/blocks/content/text';

    // Components
    import AbstractBlock from '@/components/abstract-blocks/abstract-block.vue';

    export default defineComponent({
        name: 'block-text',

        components: {AbstractBlock},

        props: {
            block: TextBlock as PropType<TextBlock>
        },

        setup(props) {


            return {

            }
        }
    });
</script>