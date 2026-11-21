import { mount, type VueWrapper } from '@vue/test-utils';
import SpeedDial from './SpeedDial.vue';

describe('SpeedDial.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(SpeedDial, {
            props: {
                model: [
                    {
                        label: 'Add',
                        icon: 'pi pi-pencil'
                    },
                    {
                        label: 'Update',
                        icon: 'pi pi-refresh'
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-trash'
                    },
                    {
                        label: 'Upload',
                        icon: 'pi pi-upload',
                        command: () => {
                            window.location.hash = '/fileupload';
                        }
                    },
                    {
                        label: 'Vue Website',
                        icon: 'pi pi-external-link',
                        command: () => {
                            window.location.href = 'https://vuejs.org/';
                        }
                    }
                ],
                direction: 'down'
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-speeddial.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-speeddial').classes()).toContain('rs-speeddial-direction-down');
        expect(wrapper.findAll('li.rs-speeddial-item').length).toEqual(5);
    });

    it('should show the list', async () => {
        await wrapper.vm.onClick({});

        expect(wrapper.emitted()['click'][0]).toEqual([{}]);
        expect(wrapper.emitted()['show'][0]).toEqual([]);
        expect(wrapper.find('.rs-speeddial').classes()).toContain('rs-speeddial-open');
        expect(wrapper.findAll('li.rs-speeddial-item')[0].attributes().style).toBe('transition-delay: 0ms;');
    });

    it('should hide the list', async () => {
        await wrapper.setProps({ visible: true });

        await wrapper.vm.onClick({});

        expect(wrapper.find('.rs-speeddial').classes()).not.toContain('rs-speeddial-open');
        expect(wrapper.findAll('li.rs-speeddial-item')[wrapper.findAll('li.rs-speeddial-item').length - 1].attributes().style).toBe('transition-delay: 0ms;');
    });

    it('should have radius and type', async () => {
        await wrapper.setProps({ radius: 80, direction: 'left', type: 'semi-circle' });

        expect(wrapper.find('.rs-speeddial').classes()).toContain('rs-speeddial-semi-circle');
        expect(wrapper.find('.rs-speeddial').classes()).toContain('rs-speeddial-direction-left');
    });

    it('should transition delay', async () => {
        await wrapper.setProps({ transitionDelay: 80 });

        expect(wrapper.findAll('li.rs-speeddial-item')[wrapper.findAll('li.rs-speeddial-item').length - 2].attributes().style).toBe('transition-delay: 80ms;');
    });

    it('should have hide icon', async () => {
        await wrapper.setProps({ showIcon: 'pi pi-bars', hideIcon: 'pi pi-times' });

        const button = wrapper.find('.rs-speeddial-button');

        expect(button.find('span').classes()).toContain('pi-bars');

        expect(button.find('span').classes()).not.toContain('pi-times');
    });

    it('should have mask', async () => {
        await wrapper.setProps({ mask: true });
        await wrapper.vm.onClick({});

        expect(wrapper.find('.rs-speeddial-mask').exists()).toBe(true);
    });
});

it('runs the focused action when earlier actions are hidden', async () => {
    const hidden = vi.fn();
    const visible = vi.fn();
    const wrapper = mount(SpeedDial, {
        props: {
            model: [
                { label: 'Hidden', visible: false, command: hidden },
                { label: 'Visible', command: visible }
            ]
        }
    });

    try {
        await wrapper.get('.rs-speeddial-button').trigger('keydown', { code: 'ArrowDown' });
        await wrapper.get('[role="menuitem"]').trigger('keydown', { code: 'Enter' });

        expect(visible).toHaveBeenCalledOnce();
        expect(hidden).not.toHaveBeenCalled();
    } finally {
        wrapper.unmount();
    }
});

it('can navigate an empty list without throwing', () => {
    const wrapper = mount(SpeedDial, { props: { model: [] } });

    try {
        expect(() => wrapper.vm.onTogglerKeydown(new KeyboardEvent('keydown', { code: 'ArrowDown' }))).not.toThrow();
    } finally {
        wrapper.unmount();
    }
});
