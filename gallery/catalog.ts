import { defineComponent, h } from 'vue';
import * as Rose from 'rose-spectacles';
import { data } from './examples/data';
import { display } from './examples/display';
import { inputs } from './examples/inputs';
import { layout } from './examples/layout';
import { overlays } from './examples/overlays';
import { component, example, sample, type ComponentName, type Example } from './examples/shared';

const icons = Object.entries(Rose)
    .filter(([name, value]) => name.endsWith('Icon') && !['InputIcon', 'BaseIcon'].includes(name) && typeof value === 'object' && value !== null)
    .map(([name]) => sample(name as ComponentName, { 'aria-label': name }));

const DiamondIcon = defineComponent({
    extends: component('BaseIcon') as import('vue').ComponentOptions,
    render() {
        const instance = this as unknown as { pti: () => Record<string, unknown> };
        return h('svg', { ...instance.pti(), viewBox: '0 0 14 14', width: 14, height: 14 }, [h('path', { d: 'M7 1 13 7 7 13 1 7Z', fill: 'currentColor' })]);
    }
});

export const catalog: Readonly<Record<string, Example[]>> = {
    Inputs: inputs,
    Layout: layout,
    Data: data,
    Overlays: overlays,
    Display: display,
    Icons: [example('Base icon', ['BaseIcon'], () => () => h(DiamondIcon, { label: 'Diamond' })), ...icons]
};

export const legacy = new Set<ComponentName>([
    'AccordionTab',
    'Calendar',
    'Chips',
    'Dropdown',
    'InlineMessage',
    'InputSwitch',
    'OverlayPanel',
    'Sidebar',
    'Steps',
    'TabMenu',
    'TabView'
]);
export const idFor = (name: string) => name.toLowerCase().replaceAll(' ', '-');
