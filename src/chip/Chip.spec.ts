import { mount, type VueWrapper } from '@vue/test-utils';
import Chip from './Chip.vue';

it('offers a named and focusable remove button for a standalone chip', async () => {
    const wrapper = mount(Chip, { props: { label: 'Field notes', removable: true }, attachTo: document.body });

    try {
        const remove = wrapper.get<HTMLButtonElement>('button[aria-label="Remove Field notes"]');

        expect(remove.element.tabIndex).toBe(0);
        remove.element.focus();
        expect(document.activeElement).toBe(remove.element);
        expect(remove.get('svg').attributes('aria-hidden')).toBe('true');

        await remove.trigger('click');
        expect(wrapper.emitted('remove')).toHaveLength(1);
        expect(wrapper.find('button').exists()).toBe(false);
    } finally {
        wrapper.unmount();
    }
});

describe('Chip.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(Chip, {
            props: {
                label: 'PrimeVue',
                icon: 'pi pi-primevue',
                removable: true
            }
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should exists', () => {
        expect(wrapper.find('.rs-chip.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-chip-icon').classes()).toContain('pi-primevue');
        expect(wrapper.find('.rs-chip-label').text()).toBe('PrimeVue');
        expect(wrapper.find('.rs-chip-remove-icon').exists()).toBe(true);
    });

    it('should close icon work', async () => {
        await wrapper.find('.rs-chip-remove-icon').trigger('click');

        expect(wrapper.find('.rs-chip.rs-component').exists()).toBe(false);
    });

    it('When removable is true and keydown triggered OnKeydown method should be called', async () => {
        const closeSpy = vi.spyOn(wrapper.vm, 'onKeydown');

        wrapper.vm.onKeydown({ key: 'Enter' });

        expect(closeSpy).toHaveBeenCalled();
    });
    it('When onKeyDown method triggered close method should be called', async () => {
        const closeSpy = vi.spyOn(wrapper.vm, 'close');

        await wrapper.vm.onKeydown({ key: 'Enter' });

        expect(closeSpy).toHaveBeenCalled();
    });
});
