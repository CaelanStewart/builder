<template>
    <div class="builder-block-ui-toolbar">
        <ui-toolbar>
            <ui-button :svg="chevronRight" />
        </ui-toolbar>
    </div>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';
    import Block from '@/models/block';

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
            const chevronRight = ref(import('@svg/solid/chevron-right.svg'));

            return {
                chevronRight
            }
        }
    })
</script>