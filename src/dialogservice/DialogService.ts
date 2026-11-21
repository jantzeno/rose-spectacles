import type { DynamicDialogInstance } from 'rose-spectacles/dynamicdialogoptions';
import type { DialogServiceMethods } from 'rose-spectacles/dialogservice';
import type { App } from 'vue';
import DynamicDialogEventBus from '../dynamicdialogeventbus/DynamicDialogEventBus';
import { PrimeVueDialogSymbol } from '../usedialog/UseDialog';
import { markRaw } from 'vue';

export default {
    install: (app: App) => {
        const DialogService: DialogServiceMethods = {
            open: (content, options) => {
                const instance: DynamicDialogInstance = {
                    content: content && markRaw(content),
                    options: options || {},
                    data: options && options.data,
                    close: (params) => {
                        DynamicDialogEventBus.emit('close', { instance, params });
                    }
                };

                DynamicDialogEventBus.emit('open', { instance });

                return instance;
            }
        };

        app.config.globalProperties.$dialog = DialogService;
        app.provide(PrimeVueDialogSymbol, DialogService);
    }
};
