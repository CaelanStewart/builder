<template>
    <block-list :class="classes" :children="block.children"></block-list>
</template>

<script lang="ts">
    // Modules
    import {defineComponent, computed} from 'vue';
    import {getBlockClasses} from '@/api/components/block';

    // Models
    import ContainerBlock from '@/models/blocks/container';

    // Components
    import BlockList from '@/components/block-list.vue';

    export default defineComponent({
        name: 'block-container',

        components: {BlockList},

        props: {
            block: ContainerBlock
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