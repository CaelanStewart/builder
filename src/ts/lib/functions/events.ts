type EventMap = GlobalEventHandlersEventMap;
type EventName = keyof GlobalEventHandlersEventMap;

interface onEventReturnType {
    remove(): void;
    removeOn(hook: (callback: () => any) => any): onEventReturnType;
    on<K extends EventName>(event: K, listener: (event: EventMap[K]) => any, options?: boolean | AddEventListenerOptions): onEventReturnType;
}

/**
 * Set an event on an element.
 *
 * If either the event and listener are omitted, it will still return an object allowing the chaining of more calls to
 * add events to the same element, to finally pass some lifecycle hook or whatever callback to then remove the events.
 *
 * For example:
 * onEvent(getElement())
 *     .on('mouseenter', onMouseEvent)
 *     .on('mouseleave', onMouseEvent)
 *     .removeOn(onBeforeUnmount);
 *
 * @param element
 * @param [event]
 * @param [listener]
 * @param [options]
 * @param [onRemove]
 */
export function onEvent<K extends EventName>(element: Node, event?: K, listener?: (event: EventMap[K]) => any, options?: boolean | AddEventListenerOptions, onRemove?: () => any) {
    const remove = () => {
        event && listener && element.removeEventListener(event, listener as EventListener);

        onRemove && onRemove();
    };

    event && listener && element.addEventListener(event, listener as EventListener);

    return {
        remove,
        removeOn(hook: (callback: () => any) => any): onEventReturnType {
            hook(remove);

            return this;
        },
        on<K extends EventName>(event: K, listener: (event: EventMap[K]) => any, options?: boolean | AddEventListenerOptions): onEventReturnType {
            return onEvent(element, event, listener, options, remove) as onEventReturnType;
        }
    };
}