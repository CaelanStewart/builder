import {IModelData} from '@/lib/model';
import {cloneDeep} from 'lodash';
import Historian from '@/lib/model/historian';

const shouldProxyValue = (value: any) => typeof value === 'object' && value !== null;

export default class DataController<T extends IModelData = IModelData> {
    private readonly data: T;
    private readonly proxy: T;
    private readonly historian: Historian;

    constructor(data: T, historian: Historian) {
        this.data = data;
        this.proxy = this.createProxy(data);
        this.historian = historian;
    }

    private createArrayProxy<A extends any[]>(array: A): A {
        let noProxyGet = false;
        let ignoreSet = false;
        const children = new Map<A[number], A[number]>();
        const traps = {
            push: (...items: any[]): number => {
                // Ignore all sets resulting from the push, as we'll
                // capture that in a single historian event so we
                // can avoid unnecessary repeated set actions.
                ignoreSet = true;
                const length = array.push(items);
                ignoreSet = false;

                this.historian.record('splice', {
                    array,
                    index: array.length - items.length - 1,
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

                this.historian.record('splice', {
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

                this.historian.record('splice', {
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

                this.historian.record('splice', {
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

                this.historian.record('splice', {
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
                return this.historian.transaction(() => {
                    return array.sort(comparator);
                });
            }
        };

        return new Proxy(array, {
            get: (target: A, prop: string | symbol): any => {
                if (typeof prop === 'string') {
                    const value = target[prop as keyof A];

                    // Ignored props
                    if (prop !== 'length' && prop !== '__proto__') {
                        if (prop in traps) {
                            return traps[prop as keyof typeof traps];
                        } else if (! noProxyGet && shouldProxyValue(value)) {
                            let proxy = children.get(value);

                            if (! proxy) {
                                children.set(value, proxy = this.createProxy(value));
                            }

                            return proxy;
                        }
                    }

                    return value;
                }
            },
            set: (target: A, prop: string | symbol, value: any): boolean => {
                if (prop === 'length' || ignoreSet || typeof prop === 'symbol') {
                    return Reflect.set(target, prop, value);
                }

                if (target.hasOwnProperty(prop)) {
                    this.historian.do('set', {
                        prop,
                        object: target,
                        oldValue: target[prop as keyof A],
                        newValue: value
                    });
                } else {
                    this.historian.do('create', {
                        prop,
                        object: target,
                        newValue: value
                    });
                }

                return true;
            }
        })
    }

    private createProxy<V extends {} | []>(value: V): V {
        if (Array.isArray(value)) {
            return this.createArrayProxy(value);
        } else {
            return this.createObjectProxy(value);
        }
    }

    private createObjectProxy<O extends { }>(object: O): O {
        const children: Partial<O> = {};

        return new Proxy(object, {
            get: (target: O, prop: string | symbol): any => {
                if (typeof prop === 'string') {
                    const value = target[prop as keyof O];

                    // We don't want to make Proxies to other types of value
                    if (! shouldProxyValue(value)) {
                        return value;
                    }

                    if (! children.hasOwnProperty(prop)) {
                        if (Array.isArray(value)) {

                        }
                        children[prop as keyof O] = this.createProxy(target[prop as keyof O]);
                    }

                    return children[prop as keyof O];
                }
            },
            set: (target: O, prop: string | symbol, value: any): boolean => {
                if (typeof prop === 'string') {
                    if (target.hasOwnProperty(prop)) {
                        this.historian.do('set', {
                            prop,
                            object: target,
                            oldValue: target[prop as keyof O],
                            newValue: value
                        });
                    } else {
                        this.historian.do('create', {
                            prop,
                            object: target,
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
                if (typeof prop === 'string') {
                    // Only track deletion if there is a property to delete, so that we don't
                    // undo and leave a property with a value of undefined behind, so that
                    // state transitions always perfectly preserve the object's props.
                    if (target.hasOwnProperty(prop)) {
                        this.historian.do('delete', {
                            prop,
                            object: target,
                            oldValue: target[prop as keyof O]
                        });
                    }

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

    getHistorian() {
        return this.historian;
    }

    /**
     * Get the data – returns a deep Proxy to the data, so that all changes are tracked
     *
     * @see {DataController.prototype.getMutableReferenceToData} – If this is too slow, use this method.
     */
    getData() {
        return this.proxy;
    }

    /**
     * Only use this if you only ever intend to read the data.
     */
    getMutableReferenceToData() {
        return this.data;
    }

    getCloneOfData(): T {
        return cloneDeep(this.data);
    }

    get<P extends keyof T>(prop: P): T[P] {
        return this.data[prop];
    }

    set<P extends keyof T>(prop: P, newValue: T[P]): void {
        if (prop in this.data) {
            const oldValue = this.data[prop];

            this.data[prop] = newValue;

            this.historian.record('set', {
                object: this.data,
                prop: prop as string,
                oldValue,
                newValue
            });
        } else {
            // Differentiate between setting the value of a property and creating one so
            // that the keys that exist in an object after an undo match the original.
            this.historian.record('create', {
                object: this.data,
                prop: prop as string,
                newValue
            })
        }
    }

    setMany(data: Partial<T>): void {
        this.historian.transaction(() => {
            for (const prop in data) {
                this.set(prop, data[prop] as any);
            }
        });
    }

    delete(prop: keyof T): void {
        this.historian.do('delete', {
            object: this.data,
            prop: prop as string,
            oldValue: this.data[prop]
        });
    }
}