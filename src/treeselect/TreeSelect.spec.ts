import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TreeSelect from './TreeSelect.vue';

it('dismisses on the first outside click after an interaction in its header', async () => {
    const host = mount(TreeSelect, {
        attachTo: document.body,
        props: { appendTo: 'self', options: [{ key: 'oak', label: 'Oak' }] },
        slots: { header: '<button type="button">Header action</button>' }
    });

    try {
        await host.get('.rs-treeselect-label-container').trigger('click');
        // Vue Test Utils stubs the transition, so finish entering the panel explicitly.
        host.vm.onOverlayAfterEnter();
        const trigger = host.get('[role="combobox"]');
        expect(trigger.attributes('aria-expanded')).toBe('true');

        await host.get('button').trigger('click');
        expect(trigger.attributes('aria-expanded')).toBe('true');

        document.body.click();
        await nextTick();
        expect(trigger.attributes('aria-expanded')).toBe('false');
    } finally {
        host.unmount();
    }
});

it('renders its empty slot when its tree filter matches no records', async () => {
    const host = mount(TreeSelect, {
        attachTo: document.body,
        props: { appendTo: 'self', filter: true, options: [{ key: 'oak', label: 'Oak' }] },
        slots: { empty: '<p>No matching trees</p>' }
    });

    try {
        await host.get('.rs-treeselect-label-container').trigger('click');
        const filter = host.get('input[autocomplete="off"]');

        expect(host.get('[role="tree"]').text()).toContain('Oak');
        await filter.setValue('maple');
        expect(host.find('[role="tree"]').exists()).toBe(false);
        expect(host.text()).toContain('No matching trees');

        await filter.setValue('');
        expect(host.text()).not.toContain('No matching trees');
        expect(host.get('[role="tree"]').text()).toContain('Oak');
    } finally {
        host.unmount();
    }
});
