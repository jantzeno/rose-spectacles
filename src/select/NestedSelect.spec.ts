import { mount, type VueWrapper } from '@vue/test-utils';
import { h, nextTick, type Component } from 'vue';
import CascadeSelect from '../cascadeselect/CascadeSelect.vue';
import TreeSelect from '../treeselect/TreeSelect.vue';
import Select from './Select.vue';

beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(() => {
    vi.useRealTimers();
});

async function finishPointerSequence() {
    vi.runAllTimers();
    await nextTick();
}

function finishEnter(host: VueWrapper, refName: string) {
    const instance = host.getComponent({ ref: refName }).vm as unknown as { onOverlayAfterEnter: () => void };
    instance.onOverlayAfterEnter();
}

const cases = [
    { name: 'Select', outer: Select, options: ['Outer option'] },
    { name: 'CascadeSelect', outer: CascadeSelect, options: [{ name: 'Outer option' }], optionLabel: 'name', optionGroupChildren: [] },
    { name: 'TreeSelect', outer: TreeSelect, options: [{ key: 'outer', label: 'Outer option' }] }
];

for (const { name, outer, ...props } of cases) {
    function fixture() {
        const host = mount(
            {
                render: () =>
                    h(
                        outer as Component,
                        { ...props, appendTo: 'self', inputId: 'outer-select', ref: 'outer' },
                        {
                            footer: () => h(Select, { inputId: 'inner-select', ref: 'inner', options: ['Inner option'] })
                        }
                    )
            },
            { attachTo: document.body }
        );

        return { host, trigger: host.get('#outer-select') };
    }

    it(`keeps ${name} open when a nested Select handles a pointer selection`, async () => {
        const { host, trigger } = fixture();

        try {
            await trigger.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
            // The transition is stubbed in jsdom. The outside-click handler is attached after enter.
            finishEnter(host, 'outer');
            const inner = host.get('#inner-select');
            await inner.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
            expect(inner.attributes('aria-expanded')).toBe('true');
            const listId = inner.attributes('aria-controls');
            expect(listId).toBeTruthy();
            const list = document.getElementById(listId ?? '');
            const option = list?.querySelector<HTMLElement>('[role="option"]');
            expect(option?.textContent).toContain('Inner option');

            vi.advanceTimersByTime(1);
            option?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            await finishPointerSequence();
            expect(inner.attributes('aria-expanded')).toBe('false');
            expect(host.text()).toContain('Inner option');

            // The option is gone by mouseup. The resulting click can land outside both panels.
            document.body.click();
            await finishPointerSequence();
            expect(trigger.attributes('aria-expanded')).toBe('true');

            document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            document.body.click();
            await finishPointerSequence();
            expect(trigger.attributes('aria-expanded')).toBe('false');
        } finally {
            host.unmount();
        }
    });

    it(`dismisses the nested Select before ${name} on consecutive outside clicks`, async () => {
        const { host, trigger } = fixture();

        try {
            await trigger.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
            finishEnter(host, 'outer');
            const inner = host.get('#inner-select');
            await inner.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
            finishEnter(host, 'inner');

            document.body.click();
            await finishPointerSequence();
            expect(inner.attributes('aria-expanded')).toBe('false');
            expect(trigger.attributes('aria-expanded')).toBe('true');

            document.body.click();
            await finishPointerSequence();
            expect(trigger.attributes('aria-expanded')).toBe('false');
        } finally {
            host.unmount();
        }
    });
}
