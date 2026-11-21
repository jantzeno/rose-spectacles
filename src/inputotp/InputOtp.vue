<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <template v-for="i in length" :key="i">
            <slot :events="getTemplateEvents(i - 1)" :attrs="getTemplateAttrs(i - 1)" :index="i">
                <OtpInputText
                    :value="tokens[i - 1]"
                    :type="inputType"
                    :class="cx('pcInputText')"
                    :name="$formName ? $formName + '_' + (i - 1) : undefined"
                    :inputmode="inputMode"
                    :maxlength="1"
                    :variant="variant"
                    :readonly="readonly"
                    :disabled="disabled"
                    :size="size"
                    :invalid="invalid"
                    :tabindex="tabindex"
                    :unstyled="unstyled"
                    @input="onInput($event, i - 1)"
                    @focus="onFocus($event)"
                    @blur="onBlur($event)"
                    @paste="onPaste($event)"
                    @keydown="onKeyDown($event)"
                    @click="onClick($event)"
                    :pt="ptm('pcInputText')"
                />
            </slot>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { InputOtpTemplateEvents } from 'rose-spectacles/inputotp';
import { isTouchDevice } from '../internal/utils/dom/index';
import InputText from '../inputtext/InputText.vue';
import BaseInputOtp from './BaseInputOtp.vue';

export default defineComponent({
    name: 'InputOtp',
    extends: BaseInputOtp,
    inheritAttrs: false,
    emits: ['change', 'focus', 'blur'],
    data() {
        return {
            tokens: [] as Array<string | undefined>
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(newValue: unknown) {
                this.tokens = typeof newValue === 'string' && newValue ? newValue.split('') : new Array<string | undefined>(this.length);
            }
        }
    },
    methods: {
        getTemplateAttrs(index: number) {
            return {
                value: this.tokens[index]
            };
        },
        getTemplateEvents(index: number): InputOtpTemplateEvents {
            return {
                input: (event) => this.onInput(event, index),
                keydown: (event) => this.onKeyDown(event),
                focus: (event) => this.onFocus(event),
                blur: (event) => this.onBlur(event),
                paste: (event) => this.onPaste(event)
            };
        },
        onInput(event: Event, index: number) {
            const target = event.target;

            if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

            const inputType = (event as InputEvent).inputType;

            this.tokens[index] = target.value;
            this.updateModel(event);

            if (inputType === 'deleteContentBackward') {
                this.moveToPrev(target);
            } else if (inputType === 'deleteContentForward') {
                this.$nextTick(() => target.select());
            } else if (inputType === 'insertText' || (isTouchDevice() && event instanceof CustomEvent)) {
                this.moveToNext(target);
            }
        },
        updateModel(event: Event) {
            const newValue = this.tokens.join('');

            this.writeValue(newValue, event);
            this.$emit('change', {
                originalEvent: event,
                value: newValue
            });
        },
        moveToPrev(target: Element) {
            const prevInput = this.findPrevInput(target);

            if (prevInput) {
                prevInput.focus();
                prevInput.select();
            }
        },
        moveToNext(target: Element) {
            const nextInput = this.findNextInput(target);

            if (nextInput) {
                nextInput.focus();
                nextInput.select();
            }
        },
        findNextInput(element: Element): HTMLInputElement | undefined {
            const nextElement = element.nextElementSibling;

            if (!nextElement) return;

            return nextElement instanceof HTMLInputElement ? nextElement : this.findNextInput(nextElement);
        },
        findPrevInput(element: Element): HTMLInputElement | undefined {
            const prevElement = element.previousElementSibling;

            if (!prevElement) return;

            return prevElement instanceof HTMLInputElement ? prevElement : this.findPrevInput(prevElement);
        },
        onFocus(event: Event) {
            const target = event.target;

            if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) target.select();

            this.$emit('focus', event);
        },
        onBlur(event: Event) {
            this.$emit('blur', event);
        },
        onClick(event: MouseEvent) {
            const target = event.target;

            if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) setTimeout(() => target.select(), 1);
        },
        onKeyDown(event: Event) {
            const target = event.target;

            if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

            const { key, ctrlKey, metaKey } = event as KeyboardEvent;

            if (ctrlKey || metaKey) {
                return;
            }

            switch (key) {
                case 'ArrowLeft':
                    this.moveToPrev(target);
                    event.preventDefault();

                    break;

                case 'ArrowUp':
                case 'ArrowDown':
                    event.preventDefault();

                    break;

                case 'Backspace':
                    if (target.value.length === 0) {
                        this.moveToPrev(target);
                        event.preventDefault();
                    }

                    break;

                case 'ArrowRight':
                    this.moveToNext(target);
                    event.preventDefault();

                    break;

                case 'Enter':
                case 'Tab':
                    break;

                default: {
                    const hasSelection = target.selectionStart !== target.selectionEnd;
                    const isAtMaxLength = target.value.length >= 1 || this.tokens.join('').length >= this.length;
                    const isValidKey = this.integerOnly ? /^[0-9]$/.test(key) : true;

                    if (!isValidKey || (isAtMaxLength && key !== 'Delete' && !hasSelection)) {
                        event.preventDefault();
                    }

                    break;
                }
            }
        },
        onPaste(event: Event) {
            if (this.readonly || this.disabled) {
                return;
            }

            const paste = (event as ClipboardEvent).clipboardData?.getData('text');

            if (paste) {
                const pastedCode = paste.substring(0, this.length);

                if (!this.integerOnly || !isNaN(Number(pastedCode))) {
                    this.tokens = pastedCode.split('');
                    this.updateModel(event);
                }
            }

            event.preventDefault();
        }
    },
    computed: {
        inputMode() {
            return this.integerOnly ? 'numeric' : 'text';
        },
        inputType() {
            return this.mask ? 'password' : 'text';
        }
    },
    components: {
        OtpInputText: InputText
    }
});
</script>
