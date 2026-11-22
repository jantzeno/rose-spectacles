import { commerce } from './examples/commerce';
import { data } from './examples/data';
import { display } from './examples/display';
import { inputs } from './examples/inputs';
import { layout } from './examples/layout';
import { overlays } from './examples/overlays';
import type { Example } from './examples/shared';

export const catalog: Readonly<Record<string, Example[]>> = {
    Inputs: inputs,
    Layout: layout,
    Data: data,
    Overlays: overlays,
    Display: display,
    Commerce: commerce
};

export const idFor = (name: string) => name.toLowerCase().replaceAll(' ', '-');
