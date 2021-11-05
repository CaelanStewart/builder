export function classError(object: object, message: string): Error {
    return new Error(`[${object.constructor.name}]: ${message}`);
}

export function classAssert(condition: any, object: object, message: string): void {
    if (! condition) {
        throw classError(object, message);
    }
}