<template>
    <abstract-block :block="block">
        <img :src="block.image.getSrc()" :loading="block.getOption('lazy')" :alt="alt" />
    </abstract-block>
</template>

<script lang="ts">
    // Modules
    import {defineComponent, computed, PropType} from 'vue';

    // Models
    import ImageBlock from '@/models/blocks/image';

    // Components
    import AbstractBlock from '@/components/abstract-blocks/abstract-block.vue';

    export default defineComponent({
        name: 'block-image',

        components: {AbstractBlock},

        props: {
            block: ImageBlock as PropType<ImageBlock>
        },

        setup(props) {
            const alt = computed(() => props.block?.getOption('alt') ?? '');

            return {
                alt
            }
        }
    });
</script>