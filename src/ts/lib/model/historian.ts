import {arrayRemoveAll} from '@/lib/functions/array';
import Almanac from '@/lib/model/historian/almanac';
import createProxy, {Value as ProxyValue} from '@/lib/model/historian/data-proxy';

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

    private readonly transformers: DirectionTransformerMap = {
        [UNDO]: {
            set(action) {
                action.object[action.prop] = action.oldValue;
            },
            create(action) {
                delete action.object[action.prop];
            },
            splice(action) {
                console.log('UNDO splice', [action.array.splice, action, action.items, action.items.length]);
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

    constructor(size: number = 50) {
        this.almanac = new Almanac(size);
    }

    public push(action: Action): void {
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

    public transaction(executor: () => any) {
        const transaction: Transaction = [];

        this.transactions.push(transaction);
        ++this.transactionIndex;

        try {
            const ret = executor();

            --this.transactionIndex;

            // If we're at the top (given the above increment) then we need to
            // commit this transaction which has executed without exceptions.
            if (this.transactionIndex === 0) {
                this.record('transaction', {
                    stack: arrayRemoveAll(this.transactions)
                })
            }

            return ret;
        } catch (error) {
            // Undo this current level of transaction here, allowing the rethrown
            // error to be caught, and a higher-order transaction to continue.
            this.applyTransaction(UNDO, transaction);

            --this.transactionIndex;

            // Allow error to be dealt with or to propagate up to any parent transactions
            throw error;
        }
    }

    public undo(): boolean {
        const action = this.almanac.back();

        if (action) {
            this.applyAction(UNDO, action);

            return true;
        }

        return false;
    }

    public redo(): boolean {
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