export function isSubtype<T extends { new(...args: any): any }>(type: T, sub: T): sub is T {
    return sub === type || sub.prototype instanceof type;
}