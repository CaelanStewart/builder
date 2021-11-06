import Historian from '@/lib/model/historian';
import {createArrayProxy} from '@/lib/model/historian/data-proxy/array';
import {createObjectProxy} from '@/lib/model/historian/data-proxy/object';

export type Value = {[name: string]: any, [index: number]: any} | any[];

// Symbol to check if an Object is a Proxy to a Model data
// object, will return original if used as a property key.
export const PROXY: string = '____BuilderSymbolVueBugfix____';
// Todo: there seems to be a bug in Vue 3 where this symbol is implicitly cast to a number by their reactivity code
// export const PROXY: symbol = Symbol('proxy');

/**
 * Check if the given object or array is a Proxy to a Model data object.
 *
 * @param value
 */
export function isProxy<T extends any[] | {}>(value: T): boolean {
    return !! (value as any)[PROXY];
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

/**
 * Get the original source value of a given proxy.

 * Returns the given proxy value if it is not a
 * proxy object created with this function set.
 *
 * Uses a hidden proxy trap to get the value.
 *
 * @param proxy
 */
export function getOriginal<T>(proxy: T): T {
    const original = (proxy as any)[PROXY];

    if (original) {
        return original;
    }

    // Not a proxy created with this function set
    return proxy;
}

/**
 * Compare a value with the original source object/array of a given proxy.
 *
 * Can only test for proxies made by this function set.
 *
 * Uses a hidden proxy trap to get the original value.
 *
 * @param value
 * @param proxy
 */
export function compareOriginal<T>(value: T, proxy: T): boolean {
    return value === getOriginal(proxy);
}

export default function createProxy<V extends Value>(historian: Historian, value: V): V {
    if (Array.isArray(value)) {
        return createArrayProxy(historian, value);
    } else {
        return createObjectProxy(historian, value);
    }
}