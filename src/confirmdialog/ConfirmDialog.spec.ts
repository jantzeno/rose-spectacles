import { mount, type VueWrapper } from '@vue/test-utils';
import type { ConfirmationOptions } from 'rose-spectacles/confirmationoptions';
import { nextTick } from 'vue';
import PrimeVue from '../config/Config';
import ConfirmationEventBus from '../confirmationeventbus/ConfirmationEventBus';
import ConfirmDialog from './ConfirmDialog.vue';

describe('ConfirmDialog', () => {
    let mounted: VueWrapper<InstanceType<typeof ConfirmDialog>>;

    async function open(options: ConfirmationOptions = {}) {
        mounted = mount(ConfirmDialog, {
            props: { group: options.group },
            global: {
                plugins: [PrimeVue],
                stubs: { teleport: true, transition: false }
            }
        });

        ConfirmationEventBus.emit('confirm', {
            header: 'Confirmation',
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            ...options
        });
        await nextTick();
        return mounted;
    }

    afterEach(() => mounted?.unmount());

    it('shows the confirmation and hides it on rejection', async () => {
        const wrapper = await open();

        expect(wrapper.find('.rs-dialog-mask .rs-dialog.rs-component').exists()).toBe(true);
        expect(wrapper.get('.rs-dialog-title').text()).toBe('Confirmation');
        expect(wrapper.get('.rs-confirmdialog-message').text()).toBe('Are you sure you want to proceed?');
        expect(wrapper.get('.rs-confirmdialog-accept-button').text()).toBe('Yes');
        expect(wrapper.get('.rs-confirmdialog-reject-button').text()).toBe('No');

        await wrapper.get('.rs-confirmdialog-reject-button').trigger('click');

        expect(wrapper.find('.rs-dialog-mask .rs-dialog.rs-component').exists()).toBe(false);
    });

    it.each(['accept', 'reject'] as const)('calls the %s callback', async (action) => {
        const callback = vi.fn();
        const wrapper = await open({ [action]: callback });

        await wrapper.get(`.rs-confirmdialog-${action}-button`).trigger('click');

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('closes with the dialog close button', async () => {
        const wrapper = await open();

        await wrapper.get('.rs-dialog-header .rs-button').trigger('click');

        expect(wrapper.find('.rs-dialog-mask .rs-dialog.rs-component').exists()).toBe(false);
    });

    it('positions a grouped dialog at the bottom', async () => {
        const wrapper = await open({
            group: 'positionDialog',
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            position: 'bottom'
        });

        expect(wrapper.find('.rs-dialog-mask.rs-dialog-bottom').exists()).toBe(true);
    });
});
