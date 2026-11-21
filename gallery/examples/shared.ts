import { h, type Component, type VNode, type VNodeChild } from 'vue';
import * as Rose from 'rose-spectacles';
import Chart from 'rose-spectacles/chart';
import Editor from 'rose-spectacles/editor';

const components = { ...Rose, Chart, Editor };

export type ComponentName = keyof typeof components;

export interface Example {
    name: string;
    names: readonly ComponentName[];
    setup: () => () => VNodeChild;
}

export function component(name: ComponentName) {
    return components[name] as Component;
}

export function demo(
    name: ComponentName,
    props: Record<string, unknown> = {},
    content?: (() => VNodeChild) | Record<string, (scope: never) => VNodeChild>
): VNode {
    return h(component(name), props, typeof content === 'function' ? { default: content } : content);
}

export function example(name: string, names: readonly ComponentName[], setup: Example['setup']): Example {
    return { name, names, setup };
}

export function sample(name: ComponentName, props: Record<string, unknown> = {}, content?: string): Example {
    return example(name, [name], () => () => demo(name, props, content === undefined ? undefined : () => content));
}

export const locations = [
    { name: 'Oslo', country: 'Norway' },
    { name: 'Kyoto', country: 'Japan' },
    { name: 'Lima', country: 'Peru' },
    { name: 'Accra', country: 'Ghana' }
];

export const tree = [
    {
        key: 'field-notes',
        label: 'Field notes',
        data: { title: 'Field notes', type: 'Folder' },
        children: [{ key: 'january', label: 'January', data: { title: 'January', type: 'Document' } }]
    }
];

export const menu = [{ label: 'Overview' }, { label: 'Activity' }, { label: 'Settings' }];
export const onePixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
