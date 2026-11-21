import type { DialogServiceMethods } from 'rose-spectacles/dialogservice';
import { inject, type InjectionKey } from 'vue';

export const PrimeVueDialogSymbol: InjectionKey<DialogServiceMethods> = Symbol();

export function useDialog() {
    const PrimeVueDialog = inject(PrimeVueDialogSymbol);

    if (!PrimeVueDialog) {
        throw new Error('No PrimeVue Dialog provided!');
    }

    return PrimeVueDialog;
}
