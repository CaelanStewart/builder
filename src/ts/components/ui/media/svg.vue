<template>
    <svg v-bind="attributes" v-html="html" />
</template>

<script lang="ts">
    import {defineComponent, computed, PropType, ref, onMounted} from 'vue';
    import {getAttributes, parseXml} from '@/lib/functions';

    interface SvgModule {
        default: string;
    }

    type SvgProp = string | Promise<string> | SvgModule;

    function isSvgModule(val: SvgProp | undefined): val is SvgModule {
        return typeof (val as any)?.default === 'string';
    }

    function isPromise(val: SvgProp | undefined): val is Promise<string> {
        return typeof (val as Promise<string>)?.then === 'function';
    }

    function parseSvg(xml: string): SVGElement | undefined {
        const elements = parseXml(xml);

        for (const element of elements) {
            if (element instanceof Element && element.tagName.toLowerCase() === 'svg') {
                return element as SVGElement;
            }
        }
    }

    export async function resolveXml(xml: SvgProp) {
        if (isPromise(xml)) {
            xml = await xml;
        }

        if (isSvgModule(xml)) {
            return xml.default;
        } else {
            return xml;
        }
    }

    export default defineComponent({
        name: 'media-svg',

        props: {
            xml: {
                type: [String, Promise] as PropType<SvgProp>,
                required: true
            }
        },

        setup(props) {
            const xml = ref<string>();
            const svg = computed(() => {
                if (typeof xml.value === 'string') {
                    return parseSvg(xml.value);
                }
            });
            const html = computed(() => {
                if (svg.value) {
                    return svg.value?.innerHTML;
                }

                return '';
            });
            const attributes = computed(() => {
                if (svg.value) {
                    return getAttributes(svg.value as SVGElement);
                }

                return {};
            });

            onMounted(async () => {
                xml.value = await resolveXml(props.xml);
            });

            return {
                svg,
                html,
                attributes
            }
        }
    })
</script>