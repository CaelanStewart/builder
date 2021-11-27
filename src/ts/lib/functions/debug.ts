export function log<T>(val: T, ...args: any[]): T {
    console.log(val, ...args);

    return val;
}
