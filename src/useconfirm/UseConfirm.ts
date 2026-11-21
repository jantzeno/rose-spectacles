import type { ConfirmationServiceMethods } from 'rose-spectacles/confirmationservice';
import { inject, type InjectionKey } from 'vue';

export const PrimeVueConfirmSymbol: InjectionKey<ConfirmationServiceMethods> = Symbol();

export function useConfirm() {
    const PrimeVueConfirm = inject(PrimeVueConfirmSymbol);

    if (!PrimeVueConfirm) {
        throw new Error('No PrimeVue Confirmation provided!');
    }

    return PrimeVueConfirm;
}
