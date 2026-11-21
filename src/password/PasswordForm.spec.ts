import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import Form from '../forms/form/Form.vue';
import Password from './Password.vue';

it('marks the Password field touched and validates it on blur', async () => {
    const resolver = vi.fn(() => ({ errors: { password: [{ message: 'Enter a longer password' }] } }));
    const wrapper = mount({
        render: () =>
            h(
                Form,
                { resolver, validateOnBlur: true, validateOnValueUpdate: false },
                {
                    default: () => h(Password, { name: 'password', feedback: false })
                }
            )
    });

    try {
        const form = wrapper.getComponent(Form);
        const input = wrapper.get('input');

        await input.trigger('focus');
        await input.setValue('short');
        expect(form.vm.getFieldState('password')?.touched).toBe(false);
        expect(resolver).not.toHaveBeenCalled();

        await input.trigger('blur');
        await flushPromises();

        expect(resolver).toHaveBeenCalled();
        expect(form.vm.getFieldState('password')).toMatchObject({ touched: true, invalid: true });
    } finally {
        wrapper.unmount();
    }
});
