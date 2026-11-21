import { vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import PrimeVue from '../config/Config';
import Menu from './Menu.vue';

describe('Menu.vue', () => {
    const toast = { add: vi.fn() };
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(Menu, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    'router-link': true,
                    teleport: true
                }
            },
            props: {
                model: [
                    {
                        label: 'Options',
                        items: [
                            {
                                label: 'Update',
                                icon: 'pi pi-refresh',
                                command: () => {
                                    toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
                                }
                            },
                            {
                                label: 'Delete',
                                icon: 'pi pi-times',
                                command: () => {
                                    toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
                                }
                            }
                        ]
                    },
                    {
                        label: 'Navigate',
                        items: [
                            {
                                label: 'Vue Website',
                                icon: 'pi pi-external-link',
                                url: 'https://vuejs.org/'
                            },
                            {
                                label: 'Router',
                                icon: 'pi pi-upload',
                                to: '/fileupload'
                            }
                        ]
                    }
                ]
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-menu.rs-component').exists()).toBe(true);
        expect(wrapper.findAll('.rs-menu-submenu-label').length).toBe(2);
        expect(wrapper.findAll('.rs-menu-submenu-label')[0].text()).toBe('Options');
        expect(wrapper.findAll('.rs-menu-item').length).toBe(4);
        expect(wrapper.findAll('.rs-menu-item')[0].find('span.rs-menu-item-label').text()).toBe('Update');
        expect(wrapper.findAll('.rs-menu-item')[2].find('a').attributes().href).toBe('https://vuejs.org/');
    });

    it('should popup work', async () => {
        await wrapper.setProps({ popup: true });

        await wrapper.vm.toggle({});

        expect(wrapper.find('.rs-menu.rs-component').exists()).toBe(true);
    });
});
