import {IModelData} from '@/lib/model';
import {cloneDeep} from 'lodash';
import Historian from '@/lib/model/historian';
import createProxy from '@/lib/model/historian/data-proxy';

export default class DataController<T extends IModelData = IModelData> {
    private readonly data: T;
    private readonly proxy: T;
    private readonly historian: Historian;

    constructor(data: T, historian: Historian) {
        this.data = data;
        this.historian = historian;
        this.proxy = createProxy(historian, data);
    }

    createProxy() {
        return createProxy(this.historian, this.data);
    }

    getHistorian() {
        return this.historian;
    }

    /**
     * Get the data – returns a deep Proxy to the data, so that all changes are tracked.
     */
    getData() {
        return this.proxy;
    }

    /**
     * Only use this if you only ever intend to read the data or use it in a child
     * model instance.
     */
    getUntrackedData() {
        return this.data;
    }

    getCloneOfData(): T {
        return cloneDeep(this.data);
    }

    get<P extends keyof T>(prop: P): T[P] {
        return this.proxy[prop];
    }

    set<P extends keyof T>(prop: P, value: T[P]): void {
        this.proxy[prop] = value;
    }

    setMany(data: Partial<T>): void {
        this.historian.transaction(() => {
            Object.assign(this.proxy, data);
        });
    }

    delete(prop: keyof T): void {
        delete this.proxy[prop];
    }
}