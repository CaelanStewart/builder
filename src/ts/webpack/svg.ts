export function getSvg(path: string) {
    return (import(path) as any).default;
}