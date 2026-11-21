import { mount } from '@vue/test-utils';
import type { TooltipOptions, TooltipPassThroughMethodOptions } from 'rose-spectacles/tooltip';
import { defineComponent, h, withDirectives } from 'vue';
import Tooltip from './Tooltip';

beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(() => {
    vi.useRealTimers();
});

const shown = () => document.querySelector<HTMLElement>('[role="tooltip"]');

function fixture(options: string | TooltipOptions = 'Stored locally', modifiers?: Record<string, boolean>) {
    return mount(
        defineComponent({
            props: { mode: String },
            setup(props) {
                return () => {
                    const trigger = h('button', { type: 'button', 'aria-describedby': 'existing-description' }, 'Open note');
                    const arg = props.mode ? ({ event: props.mode } as unknown as string) : undefined;
                    return withDirectives(trigger, [[Tooltip, options, arg, modifiers ?? {}]]);
                };
            }
        }),
        { attachTo: document.body }
    );
}

const placementCases: { modifiers: Record<string, boolean>; top: number; direction: 'right' | 'bottom' }[] = [
    { modifiers: {}, top: 100, direction: 'right' },
    { modifiers: { top: true }, top: 10, direction: 'bottom' }
];

it.each(placementCases)('passes the resolved $direction placement to the tooltip arrow', async ({ modifiers, top, direction }) => {
    const arrowOptions = vi.fn((options: TooltipPassThroughMethodOptions) => ({
        'data-arrow-placement': options.context[direction] ? direction : undefined,
        style: { borderColor: 'red', left: '99px' }
    }));
    const host = fixture({ value: 'Stored locally', pt: { arrow: arrowOptions } }, modifiers);

    const bounds = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        const anchor = this.tagName === 'BUTTON';
        const left = anchor ? 100 : Number.parseFloat(this.style.left);
        const y = anchor ? top : Number.parseFloat(this.style.top);
        return { left, top: y, right: left + 80, bottom: y + 35, width: 80, height: 35 } as DOMRect;
    });
    const height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(35);
    const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(80);

    try {
        await host.trigger('mouseenter');
        vi.advanceTimersByTime(0);

        expect(shown()?.dataset.pPosition).toBe(direction);
        const arrow = shown()?.querySelector<HTMLElement>('[data-arrow-placement]');
        expect(arrow?.getAttribute('data-arrow-placement')).toBe(direction);
        expect(arrow?.style.borderColor).toBe('red');
        expect(arrow?.style.left).not.toBe('99px');
        expect(arrowOptions).toHaveBeenCalledWith(
            expect.objectContaining({
                context: expect.objectContaining({
                    top: false,
                    right: direction === 'right',
                    bottom: direction === 'bottom',
                    left: false
                })
            })
        );
    } finally {
        host.unmount();
        vi.advanceTimersByTime(0);
        bounds.mockRestore();
        height.mockRestore();
        width.mockRestore();
    }
});

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
