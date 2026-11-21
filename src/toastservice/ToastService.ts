import type { ToastServiceMethods } from 'rose-spectacles/toastservice';
import type { App } from 'vue';
import ToastEventBus from '../toasteventbus/ToastEventBus';
import { PrimeVueToastSymbol } from '../usetoast/UseToast';

let messageIdx = 0;

export default {
    install: (app: App) => {
        const ToastService: ToastServiceMethods = {
            add: (message) => {
                if (message.id == null) {
                    message.id = messageIdx++;
                }

                ToastEventBus.emit('add', message);

                return message.id;
            },
            remove: (message) => {
                ToastEventBus.emit('remove', message);
            },
            removeGroup: (group) => {
                ToastEventBus.emit('remove-group', group);
            },
            removeAllGroups: () => {
                ToastEventBus.emit('remove-all-groups');
            }
        };

        app.config.globalProperties.$toast = ToastService;
        app.provide(PrimeVueToastSymbol, ToastService);
    }
};
