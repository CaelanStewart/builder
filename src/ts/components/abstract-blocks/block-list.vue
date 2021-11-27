<template>
    <div class="block-list">
        <component v-for="child of childrenToRender" :is="`block-${child.getType()}`" :block="child" />
    </div>
</template>

<script lang="ts">
    import {defineComponent, ref, PropType, computed} from 'vue';
    import {getComponentMap} from '@/composable/block';
    import Block from '@/models/block';
    import {ComponentMap} from '@/types/vue/component-map';

    export default defineComponent({
        name: 'block-list',

        components: {},

        props: {
            children: {
                type: Array as PropType<Block[]>,
                required: true
            },
            componentMap: {
                type: Object as PropType<ComponentMap>
            }
        },

        beforeCreate() {
            this.$options.components = {
                ...this.$options.components,
                ...getComponentMap(this.$props.componentMap)
            }
        },

        computed: {
            childrenToRender(): Block[] {
                return this.children.filter(child => child || console.warn('Falsy child passed to BlockList', this));
            }
        }
    })
</script>