<template>
    <div class="v-builder">
        <container-block :block="builder.container" />
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import Builder from '@/models/builder';
    import ContainerBlock from '@/components/blocks/container';

    export default defineComponent({
        name: 'builder',

        components: {ContainerBlock},

        props: {
            builder: Builder
        }
    })
</script>