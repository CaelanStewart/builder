<template>
    <div :class="classes">
        <img :src="block.image.getSrc()" :loading="block.getOption('lazy')" />
    </div>
</template>

<script lang="ts">
    import {defineComponent, computed} from 'vue';
    import {getBlockClasses} from '@/api/components/block';
    import ImageBlock from '@/models/blocks/image';

    export default defineComponent({
        name: 'block-image',

        props: {
            block: ImageBlock
        },

        setup(props) {
            const classes = computed(() => [
                ...getBlockClasses(props.block)
            ]);

            return {
                classes
            }
        }
    });
</script>