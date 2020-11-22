import Data from '@/lib/model/data';

interface AnyObject {
    [key: string]: any;
}

interface AnyArray extends Array<any> {

}

export interface Action {
    type: 'set' | 'splice';
}

export interface ActionSet extends Action {
    type: 'set';
    object: AnyObject;
    prop: string;
    oldValue: any;
    newValue: any;
}

export interface ActionSplice extends Action {
    type: 'splice';
    array: AnyArray;
    index: number;
    deleted: any[];
    inserted: any[];
}

export const isSetAction = (action: Action): action is ActionSet => action.type === 'set';
export const isSpliceAction = (action: Action): action is ActionSplice => action.type === 'splice';

export type ActionList = (Action|undefined)[];

export class Almanac {
    private readonly size: number;
    private entries: ActionList;
    private pointer: number;

    constructor(size: number) {
        this.size = size;
        this.entries = Almanac.makeEntries(size);
        this.pointer = size - 1;
    }

    public isPast(): boolean {
        return this.pointer === this.size - 1;
    }

    private static makeEntries(size: number): ActionList {
        return Array(size).fill(undefined);
    }

    private normalizeHistory(): void {
        // Save all entries up to the current pointer index
        const slice = this.entries.slice(0, this.pointer + 1);

        // Create the remainder to preserve the history size
        const remainder = Almanac.makeEntries(this.size - slice.length);

        this.entries = remainder.concat(slice);
        this.pointer = this.size - 1;
    }

    public commit<A extends Action>(entry: A): void {
        this.sanityCheck();

        if (this.isPast()) {
            this.normalizeHistory();
        }

        this.pushEntry(entry);
    }

    private pushEntry(entry: Action) {
        this.entries.push(entry);

        // Remove the first element to keep the history length constant
        this.entries.shift();
    }

    public back(): Action|undefined {
        if (this.pointer > 0) {
            --this.pointer;

            return this.getCurrent();
        }
    }

    public forward(): Action|undefined {
        if (this.pointer < this.size - 1) {
            ++this.pointer;

            return this.getCurrent();
        }
    }

    public getCurrent(): Action|undefined {
        return this.entries[this.pointer];
    }

    public get(): Action|undefined {
        return this.entries[this.pointer];
    }

    public getSize(): number {
        return this.size;
    }

    public sanityCheck(): void {
        if (this.size !== this.entries.length) {
            throw new Error('[Almanac]: Sanity check failed - actual Alamanac size does not equal configured size');
        }
    }
}

export default class Historian {
    private readonly almanac: Almanac;

    constructor(size: number) {
        this.almanac = new Almanac(size);
    }

    public recordSet(entry: Omit<ActionSet, 'type'>): void {
        this.almanac.commit<ActionSet>({
            type: 'set',
            ...entry
        });
    }

    public recordSplice(entry: Omit<ActionSplice, 'type'>): void {
        this.almanac.commit<ActionSplice>({
            type: 'splice',
            ...entry
        });
    }

    public undo(): boolean {
        const action = this.almanac.back();

        if (action) {
            this.undoAction(action);

            return true;
        }

        return false;
    }

    public redo(): boolean {
        const action = this.almanac.forward();

        if (action) {
            this.redoAction(action);

            return true;
        }

        return false;
    }

    protected undoSet(action: ActionSet): void {
        action.object[action.prop] = action.oldValue;
    }

    protected undoSplice(action: ActionSplice): void {
        action.array.splice(action.index, action.inserted.length, ...action.deleted);
    }

    protected redoSet(action: ActionSet): void {
        action.object[action.prop] = action.newValue;
    }

    protected redoSplice(action: ActionSplice): void {
        action.array.splice(action.index, action.deleted.length, ...action.inserted);
    }

    protected undoAction(action: Action): void {
        if (isSetAction(action)) {
            this.undoSet(action);
        } else if (isSpliceAction(action)) {
            this.undoSplice(action);
        }
    }

    protected redoAction(action: Action): void {
        if (isSetAction(action)) {
            this.redoSet(action);
        } else if (isSpliceAction(action)) {
            this.redoSplice(action);
        }
    }
}