import Model from '@/lib/model';

export interface TypeMap {
    [type: string]: typeof Model;
}

export default class Morph {
    protected static defaultTypeMap: TypeMap = {};

    public static resolveType(map: TypeMap, type: string): typeof Model|null {
        if (type in map) {
            return map[type];
        }

        if (type in Morph.defaultTypeMap) {
            return Morph.defaultTypeMap[type];
        }

        return null;
    }

    public static setDefaultTypeMap(map: TypeMap) {
        Morph.defaultTypeMap = map;
    }
}