import { mount, type VueWrapper } from '@vue/test-utils';
import Button from './Button.vue';

describe('Button.vue', () => {
    it('is Button element exist', () => {
        const wrapper = mount(Button, {
            props: {
                label: 'Submit'
            }
        });

        expect(wrapper.find('.rs-button.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-button-label').exists()).toBe(true);
    });
});

describe('Button.vue', () => {
    it('is icon exist and right position', () => {
        const icon = 'pi pi-discord';
        const iconPos = 'right';
        const label = 'Save';
        const props = { icon, iconPos };
        let wrapper: VueWrapper<any>;

        wrapper = mount(Button, {
            props
        });

        expect(wrapper.find('.rs-button-icon-only').exists()).toBe(true);

        wrapper = mount(Button, {
            props: { ...props, label }
        });

        expect(wrapper.find('.rs-button-icon.rs-button-icon-' + iconPos).exists()).toBe(true);
    });
});

describe('Button.vue', () => {
    it('is badge working', () => {
        const badge = '5';
        const badgeClass = 'rs-badge-danger';
        const wrapper = mount(Button, {
            props: { badge, badgeClass }
        });

        expect(wrapper.find('.rs-badge').text()).toEqual(badge);
        expect(wrapper.find('.' + badgeClass).exists()).toBe(true);
    });
});

describe('Button.vue', () => {
    it('is loading working', async () => {
        const loadingIcon = 'pi pi-discord';
        const wrapper = mount(Button, {
            props: {
                loading: false,
                loadingIcon
            }
        });

        expect(wrapper.find('.rs-disabled').exists()).toBe(false);

        await wrapper.setProps({ loading: true });
        const array = loadingIcon.split(' ');
        const lastIcon = '.' + array.join('.');

        expect(wrapper.find('.rs-button-loading').exists()).toBe(true);
        expect(wrapper.find('.rs-button-loading-icon' + lastIcon).exists()).toBe(true);

        await wrapper.setProps({ loading: false });

        expect(wrapper.find('.rs-button-loading').exists()).toBe(false);
    });
});
