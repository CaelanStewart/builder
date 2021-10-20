import DataController from '@/lib/model/data-controller';
import {flatten} from 'lodash';

interface AnyObject {
    [key: string]: any;
}

export type ActionTypeMap = {
    set: ActionSet;
    delete: ActionDelete;
    splice: ActionSplice;
    transaction: ActionTransaction;
}

export type ActionTypeName = keyof ActionTypeMap;

export interface Action {
    type: ActionTypeName;
}

export interface ActionDelete extends Action {
    type: 'delete';
    object: AnyObject;
    prop: string;
    oldValue: any;
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
    array: any[];
    index: number;
    deleted: any[];
    items: any[];
}

export interface ActionTransaction extends Action {
    type: 'transaction';
    actions: Action[];
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

    public commit(entry: Action): void {
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

type Transaction = Action[];
type Transactions = Transaction[];

export default class Historian {
    private readonly almanac: Almanac;

    private readonly transactions: Transactions = [];

    private transactionIndex: number = -1;

    constructor(size: number = 50) {
        this.almanac = new Almanac(size);
    }

    public record<TypeName extends Action['type'], ActionType extends ActionTypeMap[TypeName]>(type: TypeName, entry: Omit<ActionType, 'type'>): void {
        const action = {
            type,
            ...entry
        };

        if (this.transactionIndex === -1) {
            this.transactions[this.transactionIndex].push(action)
        } else {
            this.almanac.commit(action);
        }
    }

    public transaction(executor: () => any) {
        const transaction: Transaction = [];

        this.transactions.push(transaction);
        ++this.transactionIndex;

        try {
            executor();

            // If we're at the top (given the above increment) then we need to
            // commit this transaction which has executed without exceptions.
            if (this.transactionIndex === 1) {
                this.record('transaction', {
                    actions: flatten(transaction)
                })
            }
        } catch (error) {
            // Undo this current level of transaction here, allowing the rethrown
            // error to be caught, and a higher-order transaction to continue.
            this.undoTransaction(transaction);

            // Allow error to be dealt with or to propagate up to any parent transactions
            throw error;
        } finally {
            // Always decrement the counter
            --this.transactionIndex;
        }
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
        action.array.splice(action.index, action.items.length, ...action.deleted);
    }

    protected redoSet(action: ActionSet): void {
        action.object[action.prop] = action.newValue;
    }

    protected redoSplice(action: ActionSplice): void {
        action.array.splice(action.index, action.deleted.length, ...action.items);
    }

    protected undoTransaction(transaction: Transaction): void {
        for (const action of transaction) {
            this.undoAction(action);
        }
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