import {IModelData} from '@/lib/model';
import {cloneDeep} from 'lodash';
import Historian from '@/lib/model/historian';
import createProxy from '@/lib/model/historian/data-proxy';
import {ref} from 'vue';
import {box, Box} from '@/lib/functions/util';

export default class DataController<T extends IModelData = IModelData> {
    private readonly data: Box<T>;
    private readonly proxy: Box<T>;
    private readonly historian: Box<Historian>;

    constructor(data: T, historian: Historian) {
        // We must make the data reactive otherwise Vue will not respond to
        // changes made to properties on the raw un-proxied data object.
        const reactive = ref<T>(data);

        // Box these values so Vue cannot see them and they aren't made reactive
        this.historian = box(historian);
        this.data = box(reactive.value);
        this.proxy = box(createProxy(this.historian.get(), this.data.get()));
    }

    getHistorian() {
        return this.historian.get();
    }

    /**
     * Get the data – returns a deep Proxy to the data, so that all changes are tracked.
     */
    getData() {
        return this.proxy.get();
    }

    /**
     * Only use this if you only ever intend to read the data or use it in a child
     * model instance.
     */
    getUntrackedData() {
        return this.data.get();
    }

    getCloneOfData(): T {
        return cloneDeep(this.data.get());
    }

    get<P extends keyof T>(prop: P): T[P] {
        return this.proxy.get()[prop];
    }

    set<P extends keyof T>(prop: P, value: T[P]): void {
        this.proxy.get()[prop] = value;
    }

    setMany(data: Partial<T>): void {
        this.historian.get().transaction(() => {
            Object.assign(this.proxy.get(), data);
        });
    }

    delete(prop: keyof T): void {
        const object = this.proxy.get();

        delete object[prop];
    }
}