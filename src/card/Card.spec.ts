import { mount } from '@vue/test-utils';
import Card from './Card.vue';

describe('Card.vue', () => {
    it('should exist', () => {
        const wrapper = mount(Card, {
            slots: {
                header: 'Advanced Card Header',
                title: 'Advanced Card',
                subtitle: 'Advanced subtitle',
                content: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>',
                footer: 'Advanced Card Footer'
            }
        });

        expect(wrapper.find('.rs-card.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-card-header').text()).toBe('Advanced Card Header');
        expect(wrapper.find('.rs-card-title').text()).toBe('Advanced Card');
        expect(wrapper.find('.rs-card-subtitle').text()).toBe('Advanced subtitle');
        expect(wrapper.find('.rs-card-content').text()).toBe('Lorem ipsum dolor sit amet, consectetur adipisicing elit.');
        expect(wrapper.find('.rs-card-footer').text()).toBe('Advanced Card Footer');
    });
});
