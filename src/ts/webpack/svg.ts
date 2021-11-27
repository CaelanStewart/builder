export function getSvg(path: string) {
    return (import(path) as any).default;
}

export interface ISvgModule {
    default: string;
}

export type ISvgIcon = string | Promise<string | ISvgModule> | ISvgModule;

function isSvgModule(val: ISvgIcon | undefined): val is ISvgModule {
    return typeof (val as any)?.default === 'string';
}

function isPromise<T>(val: any): val is Promise<T> {
    return typeof (val as Promise<T>)?.then === 'function';
}

export async function resolveXml(xml: ISvgIcon): Promise<string> {
    if (isPromise(xml)) {
        xml = await xml;
    }

    if (isSvgModule(xml)) {
        return xml.default;
    } else {
        return xml;
    }
}