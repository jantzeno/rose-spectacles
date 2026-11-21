import { mount } from '@vue/test-utils';
import Tag from './Tag.vue';

describe('Tag.vue', () => {
    it('is Tag element exist', () => {
        const wrapper = mount(Tag);

        expect(wrapper.find('.rs-tag.rs-component').exists()).toBe(true);
    });
});

describe('Tag.vue', () => {
    it('renders props severity when passed', () => {
        const severity = 'info';
        const wrapper = mount(Tag, {
            props: { severity }
        });

        expect(wrapper.find('.rs-tag-' + severity).exists()).toBe(true);
    });
});

describe('Tag.vue', () => {
    it('renders props value when passed', () => {
        const value = 'submit';
        const wrapper = mount(Tag, {
            props: { value }
        });

        expect(wrapper.find('span').text()).toBe(value);
    });
});

describe('Tag.vue', () => {
    it('renders props icon when passed', () => {
        const icon = 'pi pi-discord';
        const wrapper = mount(Tag, {
            props: { icon }
        });
        const array = icon.split(' ');
        const lastIcon = '.' + array.join('.');

        expect(wrapper.find('.rs-tag-icon').isVisible()).toBe(true);
        expect(wrapper.find('.rs-tag-icon' + lastIcon).exists()).toBe(true);
    });
});

describe('Tag.vue', () => {
    it('should be rounded', () => {
        const wrapper = mount(Tag, {
            props: { rounded: true }
        });

        expect(wrapper.find('.rs-tag-rounded').exists()).toBe(true);
    });
});
