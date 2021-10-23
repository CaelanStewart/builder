import {IModelData} from '@/lib/model';
import {cloneDeep} from 'lodash';
import Historian from '@/lib/model/historian';

export default class DataController<T extends IModelData = IModelData> {
    private readonly data: T;
    private readonly proxy: T;
    private readonly historian: Historian;

    constructor(data: T, historian: Historian) {
        this.data = data;
        this.proxy = this.createProxy();
        this.historian = historian;
    }

    createProxy() {
        return new Proxy(this.data, {
            set: (target: T, p: string | symbol, value: any): boolean => {
                this.set(p as keyof T, value);

                return true;
            },
            defineProperty(): boolean {
                console.warn('defineProperty is forbidden on Proxy to Model data object');

                return false;
            },
            deleteProperty: (target: T, p: string | symbol): boolean => {
                this.delete(p as keyof T);

                return true;
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
     * Get the data – returns a deep-copy of the data.
     *
     * @see {DataController.prototype.getMutableReferenceToData} – If this is too slow, use this method.
     */
    getData() {
        return this.getCloneOfData();
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
        const oldValue = this.data[prop];

        delete this.data[prop];

        this.historian.record('delete', {
            object: this.data,
            prop: prop as string,
            oldValue
        });
    }

    /**
     * Splice an array in data under the given prop.
     *
     * @param prop
     * @param index - If null, the array length will be used, to essentially mediate a "push" operation
     * @param deleteCount
     * @param items
     */
    splice<AT extends any, P extends keyof T, V extends T[P] & AT[]>(prop: P, index: number | null, deleteCount: number, ...items: V[number][]): V[number][] {
        const array = this.data[prop];

        if (Array.isArray(array)) {
            index = index ?? array.length;

            const deleted = array.splice(index, deleteCount, ...items);

            this.historian.record('splice', {
                array,
                index,
                deleted,
                items
            });

            return deleted;
        } else {
            console.log(this);
            throw new TypeError('Cannot splice a value in data that is not an array. Values logged: this');
        }
    }

    push<AT extends any, P extends keyof T, V extends T[P] & AT[]>(prop: P, ...items: V[number][]): void {
        this.splice(prop, null, 0, ...items);
    }

    deleteIndex<AT extends any, P extends keyof T, V extends T[P] & AT[]>(prop: P, index: number, deleteCount: number = 1): void {
        this.splice(prop, index, deleteCount);
    }
}