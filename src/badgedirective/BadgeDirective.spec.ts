import { mount } from '@vue/test-utils';
import BadgeDirective from './BadgeDirective';

describe('directive badge should exist', () => {
    it('positioned badge', () => {
        const wrapper = mount({
            template: '<i class="pi pi-bell mr-4" style="font-size: 2rem" v-badge="2"></i>',
            directives: {
                badge: BadgeDirective
            }
        });

        expect(wrapper.find('.rs-overlay-badge').exists()).toBe(true);
        expect(wrapper.find('.rs-badge.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-badge.rs-component').text()).toBe('2');
    });
});
