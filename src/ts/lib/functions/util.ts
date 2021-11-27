export interface Box<T> {
    get(): T;
    set(value: T): void;
}

export function box<T>(value: T): Box<T> {
    return {
        get(): T {
            return value;
        },
        set(newValue: T): void {
            value = newValue;
        }
    }
}
