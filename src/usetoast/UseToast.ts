import type { ToastServiceMethods } from 'rose-spectacles/toastservice';
import { inject, type InjectionKey } from 'vue';

export const PrimeVueToastSymbol: InjectionKey<ToastServiceMethods> = Symbol();

export function useToast() {
    const PrimeVueToast = inject(PrimeVueToastSymbol);

    if (!PrimeVueToast) {
        throw new Error('No PrimeVue Toast provided!');
    }

    return PrimeVueToast;
}
