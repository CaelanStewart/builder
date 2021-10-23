export function tap<T>(value: T, operator: (value: T) => any): T {
    operator(value);

    return value;
}