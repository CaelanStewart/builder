import Historian from '@/lib/model/historian';
import createProxy, {PROXY, shouldProxyValue} from '@/lib/model/historian/data-proxy';

export function createArrayProxy<A extends any[]>(historian: Historian, array: A): A {
    let noProxyGet = false;
    let ignoreSet = false;
    const children = new Map<A[number], A[number]>();
    const traps = {
        push: (...items: any[]): number => {
            const index = array.length;

            // Ignore all sets resulting from the push, as we'll
            // capture that in a single historian event so we
            // can avoid unnecessary repeated set actions.
            ignoreSet = true;
            const length = array.push(...items);
            ignoreSet = false;

            historian.record('splice', {
                array,
                index,
                deleted: [],
                items
            });

            return length;
        },
        splice: (index: number, deleteCount: number, ...items: any[]) => {
            ignoreSet = true;
            // If an element is being removed, don't proxy those removed
            // items we're about to return, since if they have been
            // removed it is reasonable to assume they will be
            // used for another model or some other case.
            noProxyGet = true;
            const deleted = array.splice(index, deleteCount, ...items);
            ignoreSet = false;
            noProxyGet = false;

            historian.record('splice', {
                array,
                index,
                deleted,
                items
            });

            return deleted;
        },
        pop: () => {
            ignoreSet = true;
            noProxyGet = true;
            const value = array.pop();
            ignoreSet = false;
            noProxyGet = false;

            historian.record('splice', {
                array,
                // After the pop the length will be equal to the old length minus 1
                index: array.length,
                deleted: [value],
                items: []
            });

            return value;
        },
        shift: () => {
            ignoreSet = true;
            noProxyGet = true;
            const value = array.shift();
            ignoreSet = false;
            noProxyGet = false;

            historian.record('splice', {
                array,
                index: 0,
                deleted: [value],
                items: []
            });

            return value;
        },
        unshift: (...items: any[]) => {
            ignoreSet = true;
            const length = array.unshift(...items);
            ignoreSet = false;

            historian.record('splice', {
                array,
                index: 0,
                deleted: [],
                items
            });

            return length;
        },
        sort: (comparator: (a: any, b: any) => number) => {
            // The Proxy will capture the sort operation as a series of
            // set operations, so capture them in a transaction, so
            // that when an undo occurs, the opposite series of
            // sets is applied, leaving the original array.
            return historian.transaction(() => {
                return array.sort(comparator);
            });
        }
    };

    return new Proxy(array, {
        get: (target: A, prop: string | symbol): any => {
            if (prop === PROXY) {
                return true;
            }

            if (typeof prop === 'string') {
                const value = target[prop as keyof A];

                // Ignored props
                if (prop !== 'length' && prop !== 'constructor' && prop !== '__proto__') {
                    if (prop in traps) {
                        return traps[prop as keyof typeof traps];
                    } else if (! noProxyGet && shouldProxyValue(value)) {
                        let proxy = children.get(value);

                        if (! proxy) {
                            children.set(value, proxy = createProxy(historian, value));
                        }

                        return proxy;
                    }
                }

                return value;
            }
        },
        set: (target: A, prop: string | symbol, value: any): boolean => {
            if (prop === PROXY) {
                return false;
            }

            if (ignoreSet || prop === 'length' || typeof prop === 'symbol') {
                return Reflect.set(target, prop, value);
            }

            if (target.hasOwnProperty(prop)) {
                historian.do('set', {
                    prop,
                    object: target,
                    oldValue: target[prop as keyof A],
                    newValue: value
                });
            } else {
                historian.do('create', {
                    prop,
                    object: target,
                    newValue: value
                });
            }

            return true;
        }
    })
}