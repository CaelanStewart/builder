<template>
    <button class="button" @click="$emit('click')">
        <ui-svg v-if="svg" :xml="svg" class="icon" />
        <slot />
    </button>
</template>

<script lang="ts">
    import {defineComponent, PropType} from 'vue';
    import UiSvg from '@/components/ui/media/svg.vue';

    export default defineComponent({
        name: 'ui-control-button',

        components: {
            UiSvg
        },

        props: {
            svg: [String, Promise] as PropType<string | Promise<string>>,
            icon: String
        }
    })
</script>