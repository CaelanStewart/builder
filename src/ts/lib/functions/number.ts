export function cmp(a: number, b: number) {
    if (a < b) {
        return -1;
    } else if (a === b) {
        return 0;
    } else {
        return 1;
    }
}

export function diff(a: number, b: number) {
    return Math.max(a, b) - Math.min(a, b);
}

export function randomInt(min = 0, max = Number.MAX_SAFE_INTEGER): number {
    return ~~(randomFloat(min, max));
}

export function randomFloat(min = 0, max = 1): number {
    return Math.random() * (max - min) + min;
}

export function randomBiased(min: number, max: number, bias = (max - min) / 2, degree = 1) {
    const value = randomFloat(min, max);
    const factor = Math.random() * degree;

    return value * (1 - factor) + bias * factor;
}