import { mount, type VueWrapper } from '@vue/test-utils';
import PanelMenu from './PanelMenu.vue';

it('omits unsafe protocols from default PanelMenu links and keeps ordinary destinations', () => {
    const wrapper = mount(PanelMenu, {
        props: {
            expandedKeys: { group: true },
            model: [
                { key: 'header', label: 'Blocked header link', url: 'data:text/plain,preview' },
                {
                    key: 'group',
                    label: 'Documentation',
                    url: '#documentation',
                    items: [
                        { key: 'blocked', label: 'Blocked child link', url: 'data:text/plain,preview' },
                        { key: 'docs', label: 'Overview', url: '/docs/overview' },
                        { key: 'contact', label: 'Contact', url: 'mailto:docs@example.test' }
                    ]
                }
            ]
        }
    });

    try {
        const headers = wrapper.findAll('.rs-panelmenu-header-link');
        const children = wrapper.findAll('.rs-panelmenu-item-link');

        expect(headers.map((link) => link.attributes('href'))).toEqual([undefined, '#documentation']);
        expect(children.map((link) => link.attributes('href'))).toEqual([undefined, '/docs/overview', 'mailto:docs@example.test']);
    } finally {
        wrapper.unmount();
    }
});

describe('PanelMenu', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(PanelMenu, {
            global: {
                stubs: {
                    'router-link': true
                }
            },
            props: {
                model: [
                    {
                        key: '2',
                        label: 'Users',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                key: '2_0',
                                label: 'New',
                                icon: 'pi pi-fw pi-user-plus'
                            },
                            {
                                key: '2_1',
                                label: 'Delete',
                                icon: 'pi pi-fw pi-user-minus'
                            },
                            {
                                key: '2_2',
                                label: 'Search',
                                icon: 'pi pi-fw pi-users',
                                items: [
                                    {
                                        key: '2_2_0',
                                        label: 'Filter',
                                        icon: 'pi pi-fw pi-filter',
                                        items: [
                                            {
                                                key: '2_2_0_0',
                                                label: 'Print',
                                                icon: 'pi pi-fw pi-print'
                                            }
                                        ]
                                    },
                                    {
                                        key: '2_2_1',
                                        icon: 'pi pi-fw pi-bars',
                                        label: 'List'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-panelmenu.rs-component').exists()).toBe(true);
        expect(wrapper.findAll('.rs-panelmenu-item').length).toBe(6);
        expect(wrapper.findAll('.rs-panelmenu-item-content').length).toBe(6);
        expect(wrapper.findAll('.rs-panelmenu-submenu').length).toBe(3);
    });

    it('should update expandedKeys', async () => {
        await wrapper.setProps({ expandedKeys: { 2: true } });

        await wrapper.vm.onHeaderClick({}, wrapper.vm.model[0].items[2]);

        expect(wrapper.emitted()['update:expandedKeys'][0]).toEqual([{ 2: true, '2_2': true }]);
    });
});
