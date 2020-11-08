<template>
    <abstract-block :block="block">
        <block-list :children="block.children" />
    </abstract-block>
</template>

<script lang="ts">
    // Modules
    import {defineComponent, computed} from 'vue';

    // Models
    import ContainerBlock from '@/models/blocks/container';

    // Components
    import BlockList from '@/components/block-list.vue';
    import AbstractBlock from '@/components/abstract-block.vue';

    export default defineComponent({
        name: 'block-container',

        components: {BlockList, AbstractBlock},

        props: {
            block: ContainerBlock
        },

        setup(props) {

        }
    });
</script>