import { mount } from '@vue/test-utils';
import { h } from 'vue';
import InputText from '../../inputtext/InputText.vue';
import FormField from '../formfield/FormField.vue';
import Form from './Form.vue';

it.each([
    ['address.city', { address: { city: 'Oslo' } }],
    ['addresses[0].city', { addresses: [{ city: 'Oslo' }] }]
])('initializes and resets a registered input from the form initial values at %s', async (name, initialValues) => {
    const wrapper = mount({
        render: () =>
            h(
                Form,
                { initialValues },
                {
                    default: () =>
                        h(
                            FormField,
                            { name },
                            {
                                default: () => h(InputText, { name })
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
