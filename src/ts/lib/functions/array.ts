export function arrayRemove<I extends any, A extends I[]>(array: A, item: I): I|undefined {
    const index = array.indexOf(item);

    if (index !== -1) {
        return array.splice(index, 1)[0];
    }
}

export function arrayRemoveAll<T>(array: T[], ...items: T[]): T[] {
    return array.splice(0, array.length, ...items);
}