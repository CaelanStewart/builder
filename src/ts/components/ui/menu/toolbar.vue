<template>
    <div class="level">
        <slot />
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'ui-menu-toolbar'
    })
</script>