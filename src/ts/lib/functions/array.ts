export function array_remove<I extends any, A extends I[]>(array: A, item: I): I|undefined {
    const index = array.indexOf(item);

    if (index !== -1) {
        return array.splice(index, 1)[0];
    }
}