<template>
    <svg v-bind="attributes" v-html="html" />
</template>

<script lang="ts">
    import {defineComponent, computed, PropType, ref, onMounted} from 'vue';
    import {getAttributes, log, parseXml} from '@/lib/functions';

    type ISvg = string | Promise<string>;

    function parseSvg(xml: string): SVGElement | undefined {
        const elements = parseXml(xml);

        for (const element of elements) {
            if (element instanceof Element && element.tagName.toLowerCase() === 'svg') {
                return element as SVGElement;
            }
        }
    }

    export default defineComponent({
        name: 'media-svg',

        props: {
            xml: {
                type: [String, Promise] as PropType<ISvg>,
                required: true
            }
        },

        setup(props) {
            const xml = ref<string>();

            const svg = computed(() => typeof xml.value === 'string'
                ? parseSvg(xml.value)
                : null);
            const html = computed(() => svg.value
                ? svg.value?.innerHTML
                : '');
            const attributes = computed(() => svg.value
                ? getAttributes(svg.value as SVGElement)
                : {});

            onMounted(async () => {
                xml.value = await props.xml;
            });

            return {
                svg,
                html,
                attributes
            }
        }
    })
</script>