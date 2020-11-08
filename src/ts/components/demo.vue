<template>
    <div>
        <builder :builder="builder" />
    </div>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';
    import {Builder} from '@/builder';
    import {createDemoBuilderModel} from '@/api/demo/create-demo-builder-model';

    export default defineComponent({
        name: 'demo',

        components: {
            Builder: Builder
        },

        setup() {
            const builder = ref(createDemoBuilderModel());

            console.log(builder.value);

            return {
                builder: builder
            }
        }
    })
</script>