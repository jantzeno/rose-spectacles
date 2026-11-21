import type { ConfirmationServiceMethods } from 'rose-spectacles/confirmationservice';
import type { App } from 'vue';
import ConfirmationEventBus from '../confirmationeventbus/ConfirmationEventBus';
import { PrimeVueConfirmSymbol } from '../useconfirm/UseConfirm';

export default {
    install: (app: App) => {
        const ConfirmationService: ConfirmationServiceMethods = {
            require: (options) => {
                ConfirmationEventBus.emit('confirm', options);
            },
            close: () => {
                ConfirmationEventBus.emit('close');
            }
        };

        app.config.globalProperties.$confirm = ConfirmationService;
        app.provide(PrimeVueConfirmSymbol, ConfirmationService);
    }
};
