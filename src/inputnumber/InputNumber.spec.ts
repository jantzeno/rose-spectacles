import Form from '../forms/form/Form.vue';
import { mount, type VueWrapper } from '@vue/test-utils';
import type { InputNumberInputEvent } from 'rose-spectacles/inputnumber';
import { h, nextTick, type Component } from 'vue';
import InputNumber from './InputNumber.vue';

describe('InputNumber.vue', () => {
    let wrapper: VueWrapper<InstanceType<typeof InputNumber>>;

    const pressKey = (code: string, value?: string | number) => {
        const input = wrapper.get('input');

        if (value !== undefined) input.element.value = String(value);

        return input.trigger('keydown', { code, key: code });
    };

    beforeEach(() => {
        wrapper = mount(InputNumber, {
            props: {
                modelValue: 1
            }
        });
    });

    it('is exist', () => {
        expect(wrapper.find('.rs-inputnumber.rs-component').exists()).toBe(true);
        expect(wrapper.find('input.rs-inputnumber-input').exists()).toBe(true);
    });

    it('is keydown called when down and up keys pressed', async () => {
        await pressKey('ArrowUp');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([2]);

        await pressKey('ArrowDown');

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([1]);
    });

    it('is keydown called when tab key pressed', async () => {
        await pressKey('Tab', '12');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([12]);
        expect(wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').attributes()['aria-valuenow']).toBe('12');
    });

    it('is keydown called when enter key pressed', async () => {
        await pressKey('Enter', '12');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([12]);
        expect(wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').attributes()['aria-valuenow']).toBe('12');
    });

    it('is keypress called when pressed a number', async () => {
        wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element.setSelectionRange(2, 2);

        await wrapper.get('input').trigger('keypress', { key: '1' });

        expect(wrapper.emitted<[InputNumberInputEvent]>('input')?.[0][0].value).toBe(11);
    });

    it('is keypress called when pressed a number in the locale numbering system', async () => {
        await wrapper.setProps({ locale: 'fa-IR' });
        wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element.setSelectionRange(1, 1);

        await wrapper.get('input').trigger('keypress', { key: '۲' });

        expect(wrapper.emitted<[InputNumberInputEvent]>('input')?.[0][0].value).toBe(12);
    });

    it('is keypress called when pressed minus', async () => {
        wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element.setSelectionRange(0, 0);

        await wrapper.get('input').trigger('keypress', { key: '-' });

        expect(wrapper.emitted<[InputNumberInputEvent]>('input')?.[0][0].value).toBe(-1);
    });

    it('should have min boundary', async () => {
        await wrapper.setProps({ modelValue: 95, min: 95 });

        await pressKey('ArrowDown');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([95]);

        await pressKey('ArrowDown');

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([95]);
    });

    it('should have max boundary', async () => {
        await wrapper.setProps({ modelValue: 99, max: 100 });

        await pressKey('ArrowUp');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([100]);

        await pressKey('ArrowUp');

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([100]);
    });

    it('should have currency', async () => {
        await wrapper.setProps({ modelValue: 12345, mode: 'currency', currency: 'USD', locale: 'en-US' });

        expect(wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element.value).toBe('$12,345.00');
    });

    it('requests a decimal input mode when the formatter permits fractions', async () => {
        await wrapper.setProps({ minFractionDigits: 0, maxFractionDigits: 2 });

        const input = wrapper.get('input');

        expect(input.attributes('inputmode')).toBe('decimal');
        await wrapper.setProps({ maxFractionDigits: 0 });
        expect(input.attributes('inputmode')).toBe('numeric');
    });

    it('accepts three fractional digits by default', async () => {
        await wrapper.setProps({ locale: 'en-US' });

        const input = wrapper.get('input');

        input.element.setSelectionRange(1, 1);
        for (const key of ['.', '2', '3', '4']) await input.trigger('keypress', { key });
        await input.trigger('keydown', { key: 'Enter', code: 'Enter' });

        expect(input.element.value).toBe('1.234');
        expect(wrapper.emitted('update:modelValue')).toEqual([[1.234]]);
    });

    it('does not emit another model update on blur after a spinner or Enter commit', async () => {
        await wrapper.setProps({ showButtons: true });

        const input = wrapper.get('input');
        const increment = wrapper.get('.rs-inputnumber-increment-button');

        await increment.trigger('mousedown');
        await increment.trigger('mouseup');
        await input.trigger('blur');

        input.element.value = '12';
        await input.trigger('keydown', { key: 'Enter', code: 'Enter' });
        await input.trigger('blur');

        expect(wrapper.emitted('update:modelValue')).toEqual([[2], [12]]);
    });

    it('should have prefix', async () => {
        await wrapper.setProps({ modelValue: 20, prefix: '%' });

        expect(wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element.value).toBe('%20');
    });

    it('should step 0.1 without floating point drift', async () => {
        await wrapper.setProps({ modelValue: 0, step: 0.1, minFractionDigits: 1 });

        for (let i = 0; i < 10; i++) {
            await pressKey('ArrowUp');
        }

        const emitted = wrapper.emitted<[string | number | null]>('update:modelValue')?.map(([value]) => value);

        // as doubles this drifts to 0.30000000000000004 and ends on 0.9999999999999999
        expect(emitted).toEqual([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
    });

    it('should step by a step written in exponent notation', async () => {
        await wrapper.setProps({ modelValue: 0, step: 1e-7, maxFractionDigits: 7 });

        await pressKey('ArrowUp');
        await pressKey('ArrowUp');

        expect(wrapper.emitted()['update:modelValue']).toEqual([[1e-7], [2e-7]]);
    });

    it('should round the value to the fraction digits the field shows', async () => {
        await wrapper.setProps({ locale: 'en-US', maxFractionDigits: 2 });

        await pressKey('Enter', '1.005');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([1.01]);

        await wrapper.setProps({ roundingMode: 'floor' });

        await pressKey('Enter', '1.009');

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([1]);
    });

    it('should round a bound finer than the format towards the inside', async () => {
        await wrapper.setProps({ locale: 'en-US', maxFractionDigits: 3, min: '0.0004', max: '1.2345' });

        await pressKey('Enter', '5');
        await pressKey('Enter', '-5');

        expect(wrapper.emitted()['update:modelValue']).toEqual([[1.234], [0.001]]);
    });

    it('should not round when the field is not formatted', async () => {
        await wrapper.setProps({ locale: 'en-US', format: false, modelValue: 0, step: 0.0001 });

        await pressKey('ArrowUp');
        await pressKey('ArrowUp');

        expect(wrapper.emitted()['update:modelValue']).toEqual([[0.0001], [0.0002]]);
    });

    it('should keep a bound past Number.MAX_VALUE within what the format can show', async () => {
        await wrapper.setProps({ max: '1' + '0'.repeat(400) });

        await pressKey('Enter', '9'.repeat(401));

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([Number.MAX_VALUE]);
    });

    it('should keep the value within what the format can show', async () => {
        await pressKey('Enter', '1' + '0'.repeat(309));

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([Number.MAX_VALUE]);
        expect(wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element.value).not.toContain('∞');
    });

    it('should not report a change for a lone minus sign', () => {
        expect(wrapper.vm.isValueChanged('-', '-')).toBe(false);
    });

    it('should emit a number whenever it holds the value exactly', async () => {
        await wrapper.setProps({ locale: 'en-US', maxFractionDigits: 2 });

        await pressKey('Enter', '12');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([12]);

        await pressKey('Enter', '0.1');

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([0.1]);
    });

    it('should preserve digits beyond Number.MAX_SAFE_INTEGER', async () => {
        await pressKey('Enter', '123456789012345678');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['123456789012345678']);

        await pressKey('Enter', '999999999999999999');

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['999999999999999999']);
    });

    it('should step exactly beyond Number.MAX_SAFE_INTEGER', async () => {
        await wrapper.setProps({ modelValue: '123456789012345678' });

        await pressKey('ArrowUp');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['123456789012345679']);
    });

    it('should accept a string modelValue and render it exactly', async () => {
        await wrapper.setProps({ modelValue: '123456789012345678', locale: 'en-US' });

        expect(wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element.value).toBe('123,456,789,012,345,678');
    });

    it('should clamp against string boundaries exactly', async () => {
        await wrapper.setProps({ modelValue: '999999999999999998', max: '999999999999999999' });

        await pressKey('ArrowUp');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['999999999999999999']);

        await pressKey('ArrowUp');

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['999999999999999999']);
    });

    it('should keep the minus sign after typing a negative zero', async () => {
        await wrapper.setProps({ modelValue: null });

        const input = wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element;

        input.setSelectionRange(0, 0);

        await wrapper.get('input').trigger('keypress', { key: '-' });
        await wrapper.get('input').trigger('keypress', { key: '0' });

        expect(input.value).toBe('-0');
    });

    it('should emit a canonical zero for a typed negative zero', async () => {
        await pressKey('Enter', '-0');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([0]);
    });

    it('should not report a spurious change when spinning in a group-separator locale', async () => {
        // the locale groups with '.', so re-parsing '10.5' would read it as 105
        await wrapper.setProps({ modelValue: 10.5, locale: 'de-DE', max: 10.5, step: 1, minFractionDigits: 1 });

        await pressKey('ArrowUp');

        expect(wrapper.emitted().input).toBeUndefined();
    });

    it('should step down across zero by 0.1 without floating point drift', async () => {
        await wrapper.setProps({ modelValue: 0.3, step: 0.1, minFractionDigits: 1 });

        for (let i = 0; i < 5; i++) {
            await pressKey('ArrowDown');
        }

        const emitted = wrapper.emitted<[string | number | null]>('update:modelValue')?.map(([value]) => value);

        // as doubles 0.3 - 0.1 is 0.19999999999999998
        expect(emitted).toEqual([0.2, 0.1, 0, -0.1, -0.2]);
    });

    it('should invert a negative string step when spinning', async () => {
        await wrapper.setProps({ modelValue: 5, step: '-2' });

        await pressKey('ArrowDown');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([7]);

        await pressKey('ArrowUp');

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([5]);
    });

    it('should switch between a number and a string as the value crosses what a number holds', async () => {
        await wrapper.setProps({ modelValue: 9007199254740991 });

        await pressKey('ArrowUp');
        await pressKey('ArrowUp');
        await pressKey('ArrowDown');

        expect(wrapper.emitted()['update:modelValue']).toEqual([[9007199254740992], ['9007199254740993'], [9007199254740992]]);
    });

    it('should compare a non-string current value exactly', () => {
        expect(wrapper.vm.isValueChanged(10.5, '10.50')).toBe(false);
        expect(wrapper.vm.isValueChanged(10.5, '10.6')).toBe(true);
        expect(wrapper.vm.isValueChanged(null, '1')).toBe(true);
    });

    describe('typing over initial zero', () => {
        const type = async (input: HTMLInputElement, key: string) => {
            await wrapper.get('input').trigger('keypress', { key });

            return { value: input.value, caret: input.selectionStart };
        };

        it('should keep multi char suffix when typing digits after zero', async () => {
            await wrapper.setProps({ modelValue: 0, suffix: ' kg' });

            const input = wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element;

            expect(input.value).toBe('0 kg');

            input.setSelectionRange(1, 1);

            expect(await type(input, '1')).toEqual({ value: '1 kg', caret: 1 });
            expect(await type(input, '2')).toEqual({ value: '12 kg', caret: 2 });
            expect(await type(input, '3')).toEqual({ value: '123 kg', caret: 3 });
            expect(wrapper.emitted<[InputNumberInputEvent]>('input')?.map(([event]) => event.value)).toEqual([1, 12, 123]);
        });

        it('should keep multi char prefix and suffix when typing digits after zero', async () => {
            await wrapper.setProps({ modelValue: 0, prefix: '$ ', suffix: ' kg' });

            const input = wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element;

            expect(input.value).toBe('$ 0 kg');

            input.setSelectionRange(3, 3);

            expect(await type(input, '1')).toEqual({ value: '$ 1 kg', caret: 3 });
            expect(await type(input, '2')).toEqual({ value: '$ 12 kg', caret: 4 });
            expect(wrapper.emitted<[InputNumberInputEvent]>('input')?.map(([event]) => event.value)).toEqual([1, 12]);
        });

        it('should keep typing into the integer part of a currency value', async () => {
            await wrapper.setProps({ modelValue: 0, mode: 'currency', currency: 'USD', locale: 'en-US' });

            const input = wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element;

            expect(input.value).toBe('$0.00');

            input.setSelectionRange(2, 2);

            expect(await type(input, '1')).toEqual({ value: '$1.00', caret: 2 });
            expect(await type(input, '2')).toEqual({ value: '$12.00', caret: 3 });
            expect(await type(input, '5')).toEqual({ value: '$125.00', caret: 4 });
            expect(await type(input, '0')).toEqual({ value: '$1,250.00', caret: 6 });
            expect(wrapper.emitted<[InputNumberInputEvent]>('input')?.map(([event]) => event.value)).toEqual([1, 12, 125, 1250]);
        });

        it('should place caret after typed digit with single char suffix', async () => {
            await wrapper.setProps({ modelValue: 0, suffix: '%' });

            const input = wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element;

            input.setSelectionRange(1, 1);

            expect(await type(input, '1')).toEqual({ value: '1%', caret: 1 });
            expect(await type(input, '2')).toEqual({ value: '12%', caret: 2 });
        });

        it('should still advance caret when overwriting fraction digits', async () => {
            await wrapper.setProps({ modelValue: 1, minFractionDigits: 2, maxFractionDigits: 2, locale: 'en-US', suffix: ' kg' });

            const input = wrapper.get<HTMLInputElement>('input.rs-inputnumber-input').element;

            expect(input.value).toBe('1.00 kg');

            input.setSelectionRange(2, 2);

            expect(await type(input, '5')).toEqual({ value: '1.50 kg', caret: 3 });
            expect(await type(input, '7')).toEqual({ value: '1.57 kg', caret: 4 });
        });
    });

    describe('inside Form with initialValues', () => {
        let formWrapper: VueWrapper;

        beforeEach(() => {
            formWrapper = mount(
                { render: () => h(Form as Component, { initialValues: { amount: 555 } }, () => h(InputNumber as Component, { name: 'amount' })) },
                { attachTo: document.body }
            );
        });

        afterEach(() => {
            formWrapper.unmount();
        });

        it('should stay empty after deleting the last character', async () => {
            const field = formWrapper.get('input.rs-inputnumber-input');
            const input = field.element as HTMLInputElement;

            expect(input.value).toBe('555');

            for (const expected of ['55', '5', '']) {
                input.setSelectionRange(input.value.length, input.value.length);
                await field.trigger('keydown', { code: 'Backspace' });
                await nextTick();

                expect(input.value).toBe(expected);
            }

            await field.trigger('blur');
            await nextTick();

            expect(input.value).toBe('');
        });

        it('should match standalone v-model behavior when deleting the last character', async () => {
            const standalone = mount(InputNumber, { props: { modelValue: 555 }, attachTo: document.body });
            const input = standalone.get<HTMLInputElement>('input.rs-inputnumber-input').element;

            for (let i = 0; i < 3; i++) {
                input.setSelectionRange(input.value.length, input.value.length);
                await standalone.get('input').trigger('keydown', { code: 'Backspace' });
                await nextTick();
            }

            expect(input.value).toBe('');

            standalone.unmount();
        });
    });
});
