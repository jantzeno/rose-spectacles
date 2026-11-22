import { mount } from '@vue/test-utils';
import { h, nextTick, type Component } from 'vue';
import InputText from '../../inputtext/InputText.vue';
import FormField from '../formfield/FormField.vue';
import Form from './Form.vue';

it('sets nested form values without clearing omitted fields and accepts literal paths', async () => {
    const wrapper = mount(Form, {
        props: { initialValues: { emails: [{ title: 'Work', address: 'first@example.test' }] } },
        slots: {
            default: () => [h(InputText, { name: 'emails[0].title' }), h(InputText, { name: 'emails[0].address' })]
        }
    });

    try {
        const title = wrapper.get<HTMLInputElement>('input[name="emails[0].title"]');
        const address = wrapper.get<HTMLInputElement>('input[name="emails[0].address"]');
        expect(title.element.value).toBe('Work');

        wrapper.vm.setValues({ emails: [{ title: 'Personal' }] });
        await nextTick();
        expect(title.element.value).toBe('Personal');
        expect(address.element.value).toBe('first@example.test');

        wrapper.vm.setValues({ emails: [{ address: undefined }], 'emails[0].title': null });
        await nextTick();
        expect(wrapper.vm.getFieldState('emails[0].title')?.value).toBeNull();
        expect(wrapper.vm.getFieldState('emails[0].address')?.value).toBeUndefined();
        expect(title.element.value).toBe('');
        expect(address.element.value).toBe('');
    } finally {
        wrapper.unmount();
    }
});

it.each([
    ['address.city', { address: { city: 'Oslo' } }],
    ['addresses[0].city', { addresses: [{ city: 'Oslo' }] }]
])('initializes and resets a registered input from the form initial values at %s', async (name, initialValues) => {
    const wrapper = mount({
        render: () =>
            h(
                Form as Component,
                { initialValues },
                {
                    default: () =>
                        h(
                            FormField as Component,
                            { name },
                            {
                                default: () => h(InputText as Component, { name })
                            }
                        )
                }
            )
    });

    try {
        expect(wrapper.get('input').element.value).toBe('Oslo');
        await wrapper.get('input').setValue('Lima');
        await wrapper.get('form').trigger('reset');
        expect(wrapper.get('input').element.value).toBe('Oslo');
    } finally {
        wrapper.unmount();
    }
});
