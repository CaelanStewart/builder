import {ModelData} from '@/lib/model';
import {cloneDeep} from 'lodash';
import Historian from '@/lib/model/historian';

export default class Data<T extends ModelData = ModelData> {
    private readonly data: T;
    protected historian: Historian;

    constructor(data: T, historian: Historian) {
        this.data = data;
        this.historian = historian;
    }

    getCloneOfData(): T {
        return cloneDeep(this.data);
    }

    get<P extends keyof T>(prop: P): T[P] {
        return this.data[prop];
    }

    set<P extends keyof T>(prop: P, value: T[P]): void {
        this.data[prop] = value;

        this.historian.recordSet();
    }
}