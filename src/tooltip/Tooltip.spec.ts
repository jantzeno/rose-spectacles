import { mount } from '@vue/test-utils';
import { defineComponent, h, withDirectives } from 'vue';
import Tooltip from './Tooltip';

beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(() => {
    vi.useRealTimers();
});

const shown = () => document.querySelector<HTMLElement>('[role="tooltip"]');

function fixture() {
    return mount(
        defineComponent({
            props: { mode: String },
            setup(props) {
                return () => {
                    const trigger = h('button', { type: 'button', 'aria-describedby': 'existing-description' }, 'Open note');
                    const arg = props.mode ? ({ event: props.mode } as unknown as string) : undefined;
                    return withDirectives(trigger, [[Tooltip, 'Stored locally', arg]]);
                };
            }
        }),
        { attachTo: document.body }
    );
}

it('names a focus-triggered tooltip and preserves descriptions owned by the caller', async () => {
    const host = fixture();

    try {
        await host.trigger('focus');
        vi.advanceTimersByTime(0);
        expect(shown()?.textContent).toBe('Stored locally');
        expect(host.attributes('aria-describedby')?.split(' ')).toEqual(['existing-description', shown()?.id]);

        await host.trigger('blur');
        vi.advanceTimersByTime(0);
        expect(shown()).toBeNull();
        expect(host.attributes('aria-describedby')).toBe('existing-description');
    } finally {
        host.unmount();
        vi.advanceTimersByTime(0);
    }
});

it('keeps a hovered tooltip open on pointer entry and dismisses it on Escape outside the trigger', async () => {
    const host = fixture();

    try {
        await host.trigger('mouseenter');
        vi.advanceTimersByTime(0);
        const tooltip = shown();
        expect(tooltip?.textContent).toBe('Stored locally');

        await host.trigger('mouseleave', { relatedTarget: tooltip });
        vi.advanceTimersByTime(0);
        expect(shown()).toBe(tooltip);

        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
        vi.advanceTimersByTime(0);
        expect(shown()).toBeNull();
    } finally {
        host.unmount();
        vi.advanceTimersByTime(0);
    }
});

it('removes hover listeners when the binding changes to focus', async () => {
    const host = fixture();

    try {
        await host.setProps({ mode: 'hover' });
        await host.trigger('mouseenter');
        vi.advanceTimersByTime(0);
        expect(shown()).toBeTruthy();

        await host.setProps({ mode: 'focus' });
        await host.trigger('mouseenter');
        vi.advanceTimersByTime(0);
        expect(shown()).toBeNull();

        await host.trigger('focus');
        vi.advanceTimersByTime(0);
        expect(shown()?.textContent).toBe('Stored locally');
        await host.trigger('blur');
        vi.advanceTimersByTime(0);
        expect(shown()).toBeNull();
    } finally {
        host.unmount();
        vi.advanceTimersByTime(0);
    }
});
