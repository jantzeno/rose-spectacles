import { mount, type VueWrapper } from '@vue/test-utils';
import PrimeVue from '../config/Config';
import { h } from 'vue';
import ScrollPanel from '../scrollpanel/ScrollPanel.vue';
import Select from './Select.vue';

it('dismisses a Select overlay when its containing ScrollPanel scrolls', async () => {
    const wrapper = mount(
        {
            render: () =>
                h(
                    ScrollPanel,
                    { pt: { content: { style: { overflow: 'auto' } } } },
                    { default: () => h(Select, { appendTo: 'self', options: ['Berlin', 'Oslo'] }) }
                )
        },
        { attachTo: document.body, global: { plugins: [PrimeVue] } }
    );

    try {
        const select = wrapper.getComponent(Select);
        const region = wrapper.get<HTMLDivElement>('.rs-scrollpanel-content');

        region.element.style.overflow = 'auto';

        await select.trigger('click');
        expect(select.find('.rs-select-overlay').exists()).toBe(true);

        select.vm.onOverlayAfterEnter();
        await region.trigger('scroll');
        await new Promise<void>((resolve) => setTimeout(resolve, 0));

        expect(select.find('.rs-select-overlay').exists()).toBe(false);
    } finally {
        wrapper.unmount();
    }
});

describe('Select.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            }
        });

        await wrapper.trigger('click');
    });

    it('should Select exist', () => {
        expect(wrapper.find('.rs-select.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-select-overlay').exists()).toBe(true);
        expect(wrapper.find('.rs-select-empty-message').exists()).toBe(true);
        expect(wrapper.find('.rs-inputwrapper-filled').exists()).toBe(false);
        expect(wrapper.find('.rs-inputwrapper-focus').exists()).toBe(true);
    });
});

describe('option checks', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                options: [
                    { name: 'New York', code: 'NY' },
                    { name: 'Rome', code: 'RM' },
                    { name: 'London', code: 'LDN' },
                    { name: 'Istanbul', code: 'IST' },
                    { name: 'Paris', code: 'PRS' }
                ],
                optionLabel: 'name',
                optionValue: 'code',
                placeholder: 'Select a City'
            }
        });

        await wrapper.trigger('click');
    });

    it('should show the options', () => {
        expect(wrapper.find('.rs-select-label.rs-placeholder').text()).toBe('Select a City');
        expect(wrapper.find('.rs-select-list-container > .rs-select-list').exists()).toBe(true);
        expect(wrapper.find('.rs-select-option').exists()).toBe(true);
        expect(wrapper.findAll('.rs-select-option').length).toBe(5);
        expect(wrapper.findAll('.rs-select-option')[0].text()).toBe('New York');
    });
});

describe('clear checks', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                clearIcon: 'pi pi-discord',
                modelValue: { name: 'New York', code: 'NY' },
                showClear: true,
                options: [
                    { name: 'New York', code: 'NY' },
                    { name: 'Rome', code: 'RM' },
                    { name: 'London', code: 'LDN' },
                    { name: 'Istanbul', code: 'IST' },
                    { name: 'Paris', code: 'PRS' }
                ]
            }
        });

        await wrapper.trigger('click');
    });

    it('should have correct icon', () => {
        expect(wrapper.find('.rs-select-clear-icon').classes()).toContain('pi-discord');
    });
});

describe('editable checks', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                options: [
                    { name: 'New York', code: 'NY' },
                    { name: 'Rome', code: 'RM' },
                    { name: 'London', code: 'LDN' },
                    { name: 'Istanbul', code: 'IST' },
                    { name: 'Paris', code: 'PRS' }
                ],
                optionLabel: 'name',
                optionValue: 'code',
                placeholder: 'Select a City',
                editable: true
            }
        });

        await wrapper.trigger('click');
    });

    it('should show the options', () => {
        expect(wrapper.find('.rs-select-label.rs-placeholder').exists()).toBe(false);
        expect(wrapper.find('.rs-select-label[type="text"]').exists()).toBe(true);
    });
});

describe('option groups checks', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                options: [
                    {
                        label: 'Germany',
                        code: 'DE',
                        items: [
                            { label: 'Berlin', value: 'Berlin' },
                            { label: 'Frankfurt', value: 'Frankfurt' },
                            { label: 'Hamburg', value: 'Hamburg' },
                            { label: 'Munich', value: 'Munich' }
                        ]
                    },
                    {
                        label: 'USA',
                        code: 'US',
                        items: [
                            { label: 'Chicago', value: 'Chicago' },
                            { label: 'Los Angeles', value: 'Los Angeles' },
                            { label: 'New York', value: 'New York' },
                            { label: 'San Francisco', value: 'San Francisco' }
                        ]
                    },
                    {
                        label: 'Japan',
                        code: 'JP',
                        items: [
                            { label: 'Kyoto', value: 'Kyoto' },
                            { label: 'Osaka', value: 'Osaka' },
                            { label: 'Tokyo', value: 'Tokyo' },
                            { label: 'Yokohama', value: 'Yokohama' }
                        ]
                    }
                ],
                optionLabel: 'label',
                optionGroupLabel: 'label',
                optionGroupChildren: 'items'
            }
        });

        await wrapper.trigger('click');
    });

    it('should show the option groups', () => {
        expect(wrapper.findAll('.rs-select-option-group').length).toBe(3);
        expect(wrapper.findAll('.rs-select-option-group')[0].text()).toBe('Germany');
    });
});

describe('templating checks', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            slots: {
                header: h('span', { class: 'header-slot' }, 'Header slot'),
                footer: h('span', { class: 'footer-slot' }, 'Footer slot'),
                option: h('span', { class: 'option-slot' }, 'Option slot'),
                optiongroup: h('span', { class: 'optiongroup-slot' }, 'OptionGroup slot'),
                emptyfilter: h('span', { class: 'emptyfilter-slot' }, 'Empty filter slot')
            },
            props: {
                options: [
                    {
                        label: 'Germany',
                        code: 'DE',
                        items: [
                            { label: 'Berlin', value: 'Berlin' },
                            { label: 'Frankfurt', value: 'Frankfurt' },
                            { label: 'Hamburg', value: 'Hamburg' },
                            { label: 'Munich', value: 'Munich' }
                        ]
                    }
                ],
                optionLabel: 'label',
                optionGroupLabel: 'label',
                optionGroupChildren: 'items'
            }
        });

        await wrapper.trigger('click');
    });

    it('should see header and footer slots', () => {
        expect(wrapper.find('.header-slot').exists()).toBe(true);
        expect(wrapper.find('.header-slot').text()).toBe('Header slot');
        expect(wrapper.find('.footer-slot').exists()).toBe(true);
        expect(wrapper.find('.footer-slot').text()).toBe('Footer slot');
        expect(wrapper.find('.option-slot').exists()).toBe(true);
        expect(wrapper.find('.option-slot').text()).toBe('Option slot');
        expect(wrapper.find('.optiongroup-slot').exists()).toBe(true);
        expect(wrapper.find('.optiongroup-slot').text()).toBe('OptionGroup slot');
    });
});

describe('empty templating checks', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                options: [],
                optionLabel: 'label',
                optionGroupLabel: 'label',
                optionGroupChildren: 'items',
                emptyMessage: 'Need options prop',
                filterValue: 'xd'
            }
        });

        await wrapper.trigger('click');
    });

    it('should see empty slots', () => {
        expect(wrapper.find('.rs-select-empty-message').exists()).toBe(true);
        expect(wrapper.find('.rs-select-empty-message').text()).toBe('Need options prop');
    });
});

describe('loader checks', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                loading: true,
                loadingIcon: 'pi pi-discord',
                options: [
                    { name: 'New York', code: 'NY' },
                    { name: 'Rome', code: 'RM' },
                    { name: 'London', code: 'LDN' },
                    { name: 'Istanbul', code: 'IST' },
                    { name: 'Paris', code: 'PRS' }
                ],
                optionLabel: 'name',
                optionValue: 'code',
                placeholder: 'Select a City'
            }
        });

        await wrapper.trigger('click');
    });

    it('should show the loader', async () => {
        expect(wrapper.find('.rs-select-loading-icon').classes()).toContain('pi-discord');

        await wrapper.setProps({ loading: false });

        expect(wrapper.find('.rs-select-loading-icon').exists()).toBe(false);
    });
});

describe('filter checks', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                filter: true,
                filterIcon: 'pi pi-discord',
                options: [
                    { name: 'Australia', code: 'AU' },
                    { name: 'Brazil', code: 'BR' },
                    { name: 'China', code: 'CN' },
                    { name: 'Egypt', code: 'EG' },
                    { name: 'France', code: 'FR' },
                    { name: 'Germany', code: 'DE' },
                    { name: 'India', code: 'IN' },
                    { name: 'Japan', code: 'JP' },
                    { name: 'Spain', code: 'ES' },
                    { name: 'United States', code: 'US' }
                ],
                optionLabel: 'name'
            }
        });

        await wrapper.trigger('click');
    });

    it('should make filtering', async () => {
        const filterInput = wrapper.find('.rs-select-filter');
        const filterIcon = wrapper.find('[data-pc-section="filtericon"]');

        expect(filterInput.exists()).toBe(true);
        expect(filterIcon.classes()).toContain('pi-discord');

        const event = { target: { value: 'c' } };
        const onFilterChange = vi.spyOn(wrapper.vm, 'onFilterChange');

        wrapper.vm.onFilterChange(event);
        await wrapper.vm.$nextTick();

        expect(onFilterChange).toHaveBeenCalled();

        await wrapper.setData({ filterValue: 'c' });

        expect(wrapper.findAll('.rs-select-option').length).toBe(2);
    });
});
