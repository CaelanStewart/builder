<template>
    <abstract-block :block="block">
        <block-list :children="block.children" class="container" :class="classes" />
    </abstract-block>
</template>

<script lang="ts">
    // Modules
    import {defineComponent} from 'vue';
    import useClasses from '@/composable/block/classes';

    // Models
    import ContainerBlock from '@/models/blocks/container';

    // Components
    import BlockList from '@/components/abstract-blocks/block-list.vue';
    import AbstractBlock from '@/components/abstract-blocks/abstract-block.vue';

    export default defineComponent({
        name: 'block-container',

        components: {BlockList, AbstractBlock},

        props: {
            block: {
                type: ContainerBlock,
                required: true
            }
        },

        setup(props) {
            return {
                classes: useClasses(props.block, () => ({
                    align: {
                        'ml-auto': 'start',
                        'mx-auto': 'center',
                        'mr-auto': 'end',
                    }
                }))
            }
        }
    });
</script>