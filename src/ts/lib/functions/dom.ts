import {arrayEach} from '@/lib/functions/array';

/**
 * Copy attributes from one element to another.
 *
 * @param source
 * @param dest
 * @param exclude
 */
export function copyAttributes(source: Element, dest: Element, exclude: string[] = []) {
    for (const attr of Array.from(source.attributes)) {
        if (exclude.indexOf(attr.name) === -1) {
            dest.setAttribute(attr.name, attr.value);
        }
    }
}

/**
 * Get the attributes of an element in an object.
 *
 * @param source
 * @param exclude
 */
export function getAttributes(source: Element, exclude: string[] = []): {[name: string]: string} {
    const map: {[name: string]: string} = {};

    for (const name of source.getAttributeNames()) {
        map[name] = source.getAttribute(name) as string;
    }

    return map;
}

/**
 * Generate the parser function with the guinea pig element inside the closure.
 */
function _createParseXmlFunction() {
    const PARSER = document.createElement('div');

    return function (xml: string) {
        // Use browser's XML parser
        PARSER.innerHTML = xml;

        const elements = Array.from(PARSER.childNodes);

        // Remove the children from the PARSER, don't just do PARSER.innerHTML = '' as that causes the nodes in the
        // reference to a parsed SVG to be destroyed and removed from the returned array of child nodes.
        arrayEach(elements, element => PARSER.removeChild(element));

        return elements;
    }
}

export const parseXml = _createParseXmlFunction();