import {ref} from 'vue';

export function useDetectMouseOver() {
    const element = ref<HTMLElement|null>(null);
    const isMouseOver = ref(false);

    const onMouseEvent = (event: MouseEvent) => {
        isMouseOver.value = event.type === 'mouseenter';
    };

    return {
        element,
        isMouseOver,
        onMouseEnter: onMouseEvent,
        onMouseLeave: onMouseEvent
    }
}