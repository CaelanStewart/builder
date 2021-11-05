import {arrayRemoveAll} from '@/lib/functions/array';
import Almanac from '@/lib/model/historian/almanac';
import createProxy, {Value as ProxyValue} from '@/lib/model/historian/data-proxy';
import {classError} from '@/lib/functions/error';
import createPublicPromise, {IPublicPromise} from '@/lib/async/public-promise';

interface AnyObject {
    [key: string]: any;
}

export type ActionTypeMap = {
    set: ActionSet;
    create: ActionCreate;
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

export interface ActionCreate extends Action {
    type: 'create';
    object: AnyObject;
    prop: string;
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
    stack: TransactionStack;
}

export type ActionList = (Action | undefined)[];

type Executor<T> = () => Promise<T>;

type Transaction = Action[];
type TransactionStack = Transaction[];

type ActionTransformer<ActionType extends Action> = (this: Historian, action: ActionType) => any;

type ActionTransformerMap = {
    [TypeName in ActionTypeName]: ActionTransformer<ActionTypeMap[TypeName]>;
};

type Undo = -1;
type Redo = 1;

type Direction = Undo | Redo;

type DirectionTransformerMap = {
    [K in Direction]: ActionTransformerMap;
};

/**
 * Type predicate for an action.
 *
 * @param type
 * @param entry
 */
export const isAction = <TypeName extends Action['type'], ActionType extends ActionTypeMap[TypeName]>
    (type: TypeName, entry: Action): entry is ActionType => entry.type === type;

const UNDO: Undo = -1;
const REDO: Redo = 1;

export default class Historian {
    private readonly almanac: Almanac;

    private readonly transactions: TransactionStack = [];

    private transactionIndex: number = -1;

    private epochId: number|null = null;

    private readonly transformers: DirectionTransformerMap = {
        [UNDO]: {
            set(action) {
                action.object[action.prop] = action.oldValue;
            },
            create(action) {
                delete action.object[action.prop];
            },
            splice(action) {
                action.array.splice(action.index, action.items.length, ...action.deleted);
            },
            delete(action) {
                action.object[action.prop] = action.oldValue;
            },
            transaction(action) {
                for (const transaction of action.stack) {
                    this.applyTransaction(UNDO, transaction);
                }
            }
        },
        [REDO]: {
            set(action) {
                action.object[action.prop] = action.newValue;
            },
            create(action) {
                action.object[action.prop] = action.newValue;
            },
            splice(action) {
                action.array.splice(action.index, action.deleted.length, ...action.items);
            },
            delete(action) {
                delete action.object[action.prop];
            },
            transaction(action) {
                for (const transaction of action.stack) {
                    this.applyTransaction(REDO, transaction);
                }
            }
        }
    }

    constructor(size: number = 50, private epochTime?: number) {
        this.almanac = new Almanac(size);

        // if (this.batchInterval) {
        //     this.startBatchInterval(this.batchInterval);
        // }
    }

    // startBatchInterval(interval: number): void {
    //     if (this.batchTimerId) {
    //         throw classError(this, 'A batch interval has already been started');
    //     }
    //
    //     this.batchTimerId = setInterval(() => {
    //
    //     }, this.batchInterval ?? interval);
    // }

    private newEpoch() {
        this.newTransaction();

        this.epochId = setTimeout(() => {
            this.endTransaction();

            this.epochId = null;
        }, this.epochTime);
    }

    private endEpoch() {
        if (this.epochId) {
            clearTimeout(this.epochId);

            this.endTransaction();
        }
    }

    public push(action: Action): void {
        if (this.epochTime && this.transactionIndex === -1) {
            this.newEpoch();
        }

        if (this.transactionIndex === -1) {
            this.almanac.commit(action);
        } else {
            this.transactions[this.transactionIndex].push(action);
        }
    }

    public createAction<TypeName extends Action['type'], ActionType extends ActionTypeMap[TypeName]>(type: TypeName, entry: Omit<ActionType, 'type'>): ActionType {
        (entry as Omit<ActionType, 'type'> & Partial<Pick<ActionType, 'type'>>).type = type;

        return entry as ActionType;
    }

    /**
     * Record an action.
     *
     * This does not perform the action, it only records the action.
     *
     * @param type
     * @param entry
     * @see {Historian.prototype.do} – The do() method will perform the action as well as record it.
     */
    public record<TypeName extends Action['type'], ActionType extends ActionTypeMap[TypeName]>(type: TypeName, entry: Omit<ActionType, 'type'>): void {
        this.push(this.createAction(type, entry));
    }

    /**
     * Simultaneously perform and record an action.
     *
     * @param type
     * @param entry
     */
    public do<TypeName extends Action['type'], ActionType extends ActionTypeMap[TypeName]>(type: TypeName, entry: Omit<ActionType, 'type'>): void {
        const action = this.createAction(type, entry);

        this.applyAction(REDO, action);

        this.push(action);
    }

    public handleTransactionError(transaction: Transaction, error: unknown) {
        // Undo this current level of transaction here, allowing the rethrown
        // error to be caught, and a higher-order transaction to continue.
        this.applyTransaction(UNDO, transaction);

        --this.transactionIndex;
    }

    private newTransaction() {
        const transaction: Transaction = [];

        this.transactions.push(transaction);
        ++this.transactionIndex;

        return transaction;
    }

    /**
     * Slightly hacky approach to get sync and async types using the same function with async/await.
     *
     * @param executor
     * @private
     */
    public async asyncTransaction<T>(executor: Executor<T>): Promise<T> {
        const transaction = this.newTransaction();

        try {
            const ret = await executor();

            this.endTransaction();

            return ret;
        } catch (error) {
            this.handleTransactionError(transaction, error);

            // Allow error to be dealt with or to propagate up to any parent transactions
            throw error;
        }
    }

    private endTransaction() {
        --this.transactionIndex;

        // If we're at the top (given the above increment) then we need to
        // commit this transaction which has executed without exceptions.
        if (this.transactionIndex === -1) {
            // Commit directly to the almanac so we don't start a new
            // epoch, getting stuck in a loop and never committing.
            this.almanac.commit(this.createAction('transaction', {
                stack: arrayRemoveAll(this.transactions)
            }));
        }
    }

    public transaction<T>(executor: () => T): T {
        const transaction = this.newTransaction();

        try {
            const ret = executor();

            this.endTransaction();

            return ret;
        } catch (error) {
            this.handleTransactionError(transaction, error);

            // Allow error to be dealt with or to propagate up to any parent transactions
            throw error;
        }
    }

    public undo(): boolean {
        this.endEpoch();

        const action = this.almanac.back();

        if (action) {
            this.applyAction(UNDO, action);

            return true;
        }

        return false;
    }

    public redo(): boolean {
        this.endEpoch();

        const action = this.almanac.forward();

        if (action) {
            this.applyAction(REDO, action);

            return true;
        }

        return false;
    }

    private applyAction(direction: Direction, action: Action) {
        (this.transformers[direction][action.type] as ActionTransformer<Action>)
            .call(this, action);
    }

    private applyTransaction(direction: Direction, transaction: Transaction) {
        for (const action of transaction) {
            this.applyAction(direction, action);
        }
    }
}