import {IModelData} from '@/lib/model';
import {cloneDeep} from 'lodash';
import Historian from '@/lib/model/historian';

export default class DataController<T extends IModelData = IModelData> {
    private readonly data: T;
    private readonly historian: Historian;

    constructor(data: T, historian: Historian) {
        this.data = data;
        this.historian = historian;
    }

    getHistorian() {
        return this.historian;
    }

    getData() {
        return this.getCloneOfData();
    }

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
        const oldValue = this.data[prop];

        this.data[prop] = newValue;

        this.historian.recordSet({
            object: this.data,
            prop: prop as string,
            oldValue,
            newValue
        });
    }

    push<AT extends any, P extends keyof T, V extends T[P] & AT[]>(prop: P, ...items: V[number][]): void {
        const array = this.data[prop];

        if (Array.isArray(array)) {
            array.push(...items);
        } else {
            console.log(this);
            throw new TypeError('Cannot push to a value in data that is not an array. Values logged: this');
        }
    }

    splice<AT extends any, P extends keyof T, V extends T[P] & AT[]>(prop: P, index: number, deleteCount: number, ...items: V[number][]): void {
        const array = this.data[prop];

        if (Array.isArray(array)) {
            array.splice(index, deleteCount, ...items);
        } else {
            console.log(this);
            throw new TypeError('Cannot splice a value in data that is not an array. Values logged: this');
        }
    }

    deleteIndex<AT extends any, P extends keyof T, V extends T[P] & AT[]>(prop: P, index: number, deleteCount: number = 1): void {
        this.splice(prop, index, deleteCount);
    }
}