import { mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach } from 'vitest';
import Avatar from './Avatar.vue';

let wrapper: VueWrapper<InstanceType<typeof Avatar>>;

beforeEach(() => {
    wrapper = mount(Avatar, {
        props: {
            label: 'T',
            size: 'large',
            shape: 'circle',
            image: 'test'
        }
    });
});

describe('Avatar.vue', () => {
    it('should exist', () => {
        expect(wrapper.find('.rs-avatar.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-avatar-lg').exists()).toBe(true);
        expect(wrapper.find('.rs-avatar-circle').exists()).toBe(true);
        expect(wrapper.find('.rs-avatar-label').exists()).toBe(true);
        expect(wrapper.find('.rs-avatar-label').text()).toBe('T');
    });

    it('should exist', async () => {
        await wrapper.setProps({ image: 'imageTest' });
        const image = wrapper.find('.rs-avatar-image');

        await wrapper.vm.onError();

        expect(image.exists()).toBe(true);
        expect(wrapper.emitted().error.length).toBe(1);
    });
});
