import Historian from '@/lib/model/historian';
import {createArrayProxy} from '@/lib/model/historian/data-proxy/array';
import {createObjectProxy} from '@/lib/model/historian/data-proxy/object';

export type Value = {[name: string]: any, [index: number]: any} | any[];

// Symbol to check if an Object is a Proxy to a Model data
// object, will return true if used as a property key.
export const PROXY: string = '____BuilderSymbolVueBugfix____';
// Todo: there seems to be a bug in Vue 3 where this symbol is implicitly cast to a number by their reactivity code
// export const PROXY: symbol = Symbol('proxy');

/**
 * Check if the given object or array is a Proxy to a Model data object.
 *
 * @param value
 */
export function isProxy<T extends any[] | {}>(value: T): boolean {
    return (value as any)[PROXY] === true;
}

/**
 * Check if the given value should be proxied.
 *
 * @param value
 */
export function shouldProxyValue(value: any): boolean {
    return typeof value === 'object'
        && value !== null
        // Make sure it's not already been proxied, otherwise
        // we'll end up recording duplicate history states.
        && ! isProxy(value);
}

export default function createProxy<V extends Value>(historian: Historian, value: V): V {
    if (Array.isArray(value)) {
        return createArrayProxy(historian, value);
    } else {
        return createObjectProxy(historian, value);
    }
}