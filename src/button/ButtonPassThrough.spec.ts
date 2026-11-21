import { config, mount } from '@vue/test-utils';
import type { ButtonPassThroughMethodOptions } from 'rose-spectacles/button';
import PrimeVue from '../config/Config';
import Button from './Button.vue';

it('updates the Button root pass-through callback when its severity changes', async () => {
    const mock = config.global.mocks.$primevue;
    delete config.global.mocks.$primevue;

    try {
        const wrapper = mount(Button, {
            props: { severity: 'secondary' },
            global: {
                plugins: [
                    [
                        PrimeVue,
                        {
                            pt: {
                                button: {
                                    root: ({ props }: ButtonPassThroughMethodOptions<unknown>) => ({
                                        'data-button-severity': props.severity ?? 'default'
                                    })
                                }
                            }
                        }
                    ]
                ]
            }
        });

        try {
            expect(wrapper.attributes('data-button-severity')).toBe('secondary');
            await wrapper.setProps({ severity: 'danger' });
            expect(wrapper.attributes('data-button-severity')).toBe('danger');
        } finally {
            wrapper.unmount();
        }
    } finally {
        config.global.mocks.$primevue = mock;
    }
});
