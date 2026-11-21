import { mount, type VueWrapper } from '@vue/test-utils';
import type { ConfirmationOptions } from 'rose-spectacles/confirmationoptions';
import { nextTick } from 'vue';
import PrimeVue from '../config/Config';
import ConfirmationEventBus from '../confirmationeventbus/ConfirmationEventBus';
import ConfirmPopup from './ConfirmPopup.vue';

describe('ConfirmPopup', () => {
    let mounted: VueWrapper<InstanceType<typeof ConfirmPopup>>;
    let trigger: HTMLButtonElement;

    async function open(options: ConfirmationOptions = {}) {
        trigger = document.createElement('button');
        document.body.append(trigger);
        mounted = mount(ConfirmPopup, {
            global: {
                plugins: [PrimeVue],
                stubs: { teleport: true, transition: false }
            }
        });

        ConfirmationEventBus.emit('confirm', {
            target: trigger,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            ...options
        });
        await nextTick();
        return mounted;
    }

    afterEach(() => {
        mounted?.unmount();
        trigger?.remove();
    });

    it('shows the confirmation and both actions', async () => {
        const wrapper = await open();

        expect(wrapper.get('[role="alertdialog"]').isVisible()).toBe(true);
        expect(wrapper.get('.rs-confirmpopup-message').text()).toBe('Are you sure you want to proceed?');
        expect(wrapper.get('.rs-confirmpopup-accept-button').text()).toBe('Yes');
        expect(wrapper.get('.rs-confirmpopup-reject-button').text()).toBe('No');
    });

    it.each(['accept', 'reject'] as const)('calls the %s callback', async (action) => {
        const callback = vi.fn();
        const wrapper = await open({ [action]: callback });

        await wrapper.get(`.rs-confirmpopup-${action}-button`).trigger('click');

        expect(callback).toHaveBeenCalledTimes(1);
    });
});
