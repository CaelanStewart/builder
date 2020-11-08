<template>
    <div ref="element" class="block" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <teleport v-if="isMouseOver" to="body">
            <ui-toolbar :block="block" />
        </teleport>

        <slot></slot>
    </div>
</template>

<script lang="ts">
    // Modules
    import {defineComponent, computed} from 'vue';

    // Composable
    import {getBlockClasses, detectMouseOver} from '@/composable/block';

    // Models
    import Block from '@/models/block';

    // Components
    import UiToolbar from './block/toolbar.vue';

    export default defineComponent({
        name: 'abstract-block',

        components: {UiToolbar},

        props: {
            block: Block
        },

        setup(props) {
            const classes = computed(() => [
                ...getBlockClasses(props.block)
            ]);

            return {
                ...detectMouseOver(),
                classes
            }
        }
    });
</script>