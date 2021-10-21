import {Action, ActionList} from '@/lib/model/historian';

export default class Almanac {
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

    public back(): Action | undefined {
        if (this.pointer > 0) {
            --this.pointer;

            return this.getCurrent();
        }
    }

    public forward(): Action | undefined {
        if (this.pointer < this.size - 1) {
            ++this.pointer;

            return this.getCurrent();
        }
    }

    public getCurrent(): Action | undefined {
        return this.entries[this.pointer];
    }

    public get(): Action | undefined {
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