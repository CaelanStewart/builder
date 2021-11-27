<template>
    <div class="builder-block-ui-toolbar">
        <ui-toolbar>
            <ui-button :svg="getIcon('chevron-right')" />
        </ui-toolbar>
    </div>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';
    import Block from '@/models/block';
    import getIcon from '@/media/icons';

    import UiToolbar from '@/components/ui/menu/toolbar.vue';
    import UiButton from '@/components/ui/control/button.vue';

    export default defineComponent({
        name: 'builder-block-ui-toolbar',

        components: {
            UiToolbar,
            UiButton
        },

        props: {
            block: Block
        },

        setup() {
            return {
                getIcon
            }
        }
    })
</script>