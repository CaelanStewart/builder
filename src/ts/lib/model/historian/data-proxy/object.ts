import Historian from '@/lib/model/historian';
import createProxy, {shouldProxyValue} from '@/lib/model/historian/data-proxy';
import {PROXY} from '@/lib/model/historian/data-proxy';

export function createObjectProxy<O extends { }>(historian: Historian, object: O): O {
    const children: Partial<O> = {};

    return new Proxy(object, {
        get: (target: O, prop: string | symbol): any => {
            if (prop === PROXY) {
                return true;
            }

            if (typeof prop === 'string') {
                const value = target[prop as keyof O];

                // We don't want to make Proxies to other types of value
                if (! shouldProxyValue(value)) {
                    return value;
                }

                if (! children.hasOwnProperty(prop)) {
                    children[prop as keyof O] = createProxy(historian, target[prop as keyof O]);
                }

                return children[prop as keyof O];
            }
        },
        set: (target: O, prop: string | symbol, value: any): boolean => {
            if (prop === PROXY) {
                return false;
            }

            if (typeof prop === 'string') {
                if (target.hasOwnProperty(prop)) {
                    historian.do('set', {
                        prop,
                        object,
                        oldValue: target[prop as keyof O],
                        newValue: value
                    });
                } else {
                    historian.do('create', {
                        prop,
                        object,
                        newValue: value
                    });
                }

                // Remove any stored Proxy so when the property is next
                // accessed from this property a new Proxy is made.
                delete children[prop as keyof O];

                return true;
            } else {
                // Don't track Symbol properties (probably added by frameworks and libraries)
                return Reflect.set(target, prop, value);
            }
        },
        defineProperty(): boolean {
            console.warn('defineProperty is forbidden on Proxy to Model data object');

            return false;
        },
        deleteProperty: (target: O, prop: string | symbol): boolean => {
            if (prop === PROXY) {
                return false;
            }

            if (typeof prop === 'string') {
                // Only track deletion if there is a property to delete, so that we don't
                // undo and leave a property with a value of undefined behind, so that
                // state transitions always perfectly preserve the object's props.
                if (target.hasOwnProperty(prop)) {
                    historian.do('delete', {
                        prop,
                        object,
                        oldValue: target[prop as keyof O]
                    });
                }

                // Tidy up
                delete children[prop as keyof O];

                return true;
            } else {
                // Don't track Symbol properties (probably added by frameworks and libraries)
                return Reflect.deleteProperty(target, prop);
            }
        },
        preventExtensions(): boolean {
            console.warn('defineProperty is forbidden on Proxy to Model data object');

            return false;
        }
    })
}