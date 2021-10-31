import Historian from '@/lib/model/historian';
import {createArrayProxy} from '@/lib/model/historian/data-proxy/array';
import {createObjectProxy} from '@/lib/model/historian/data-proxy/object';

export const shouldProxyValue = (value: any) => typeof value === 'object' && value !== null;

export default function createProxy<V extends {} | []>(historian: Historian, value: V): V {
    if (Array.isArray(value)) {
        return createArrayProxy(historian, value);
    } else {
        return createObjectProxy(historian, value);
    }
}