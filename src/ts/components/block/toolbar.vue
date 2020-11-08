<template>
    <div class="builder-block-ui-toolbar">

    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import Block from '../../models/block';

    export default defineComponent({
        name: 'builder-block-ui-toolbar',

        props: {
            block: Block
        }
    })
</script>