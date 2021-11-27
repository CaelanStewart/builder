import {resolveXml} from '@/webpack/svg';

const icons = {
    'chevron-right': import('@svg/solid/chevron-right.svg')
}

export default function getIcon(name: keyof typeof icons): Promise<string> {
    return resolveXml(icons[name]);
}
