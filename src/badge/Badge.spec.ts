import { mount } from '@vue/test-utils';
import { expect } from 'vitest';
import Badge from './Badge.vue';

let wrapper: ReturnType<typeof mount<typeof Badge>>;

describe('Badge.vue', () => {
    beforeEach(() => {
        wrapper = mount(Badge, {
            props: {
                value: '29',
                severity: 'warn',
                size: 'large'
            }
        });
    });
    it('should exist', () => {
        expect(wrapper.find('.rs-badge.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-badge-warn').exists()).toBe(true);
        expect(wrapper.find('.rs-badge-lg').exists()).toBe(true);
        expect(wrapper.find('.rs-badge-no-gutter').exists()).toBe(false);

        expect(wrapper.classes()).not.toContain('rs-overlay-badge');
    });
});
