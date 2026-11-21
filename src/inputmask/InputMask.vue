<template>
    <InputText
        :id="id"
        :value="currentVal"
        :class="inputClass"
        :readonly="readonly"
        :disabled="disabled"
        :invalid="invalid"
        :size="size"
        :name="name"
        :variant="variant"
        :placeholder="placeholder"
        :fluid="$fluid"
        :unstyled="unstyled"
        @input="onInput"
        @compositionend="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeyDown"
        @keypress="onKeyPress"
        @paste="onPaste"
        :pt="rootPTOptions"
    />
</template>

<script lang="ts">
import { getUserAgent } from '../internal/utils/dom/index';
import InputText from '../inputtext/InputText.vue';
import { defineComponent, mergeProps } from 'vue';
import BaseInputMask from './BaseInputMask.vue';

interface LegacyTextRange {
    collapse(toStart: boolean): void;
    duplicate(): LegacyTextRange;
    moveStart(unit: string, count: number): number;
    moveEnd(unit: string, count: number): number;
    select(): void;
    text: string;
}

type MaskInput = Omit<HTMLInputElement, 'setSelectionRange'> & {
    setSelectionRange?: HTMLInputElement['setSelectionRange'];
    createTextRange?: () => LegacyTextRange;
};
type SelectionDocument = Document & { selection?: { createRange(): LegacyTextRange } };

const maskDefinitions: Readonly<Record<string, string>> = { '9': '[0-9]', a: '[A-Za-z]', '*': '[A-Za-z0-9]' };

export default defineComponent({
    name: 'InputMask',
    extends: BaseInputMask,
    inheritAttrs: false,
    emits: ['focus', 'blur', 'keydown', 'complete', 'keypress', 'paste'],
    inject: {
        $pcFluid: { default: null }
    },
    data() {
        return {
            currentVal: '',
            focusText: '',
            oldVal: '',
            androidChrome: false,
            tests: [] as (RegExp | null)[],
            buffer: [] as string[],
            partialPosition: 0,
            len: 0,
            firstNonMaskPos: null as number | null,
            lastRequiredNonMaskPos: -1,
            defaultBuffer: ''
        };
    },
    watch: {
        mask(newMask, oldMask) {
            if (oldMask !== newMask) {
                this.initMask();
            }
        },
        disabled(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.updateValue();
            }
        }
    },
    mounted() {
        this.initMask();
    },
    updated() {
        if (this.isValueUpdated()) {
            this.updateValue();
        }
    },
    methods: {
        onInput(event: Event) {
            // Check if the event is part of a text composition process (e.g., for Asian languages).
            // If event.isComposing is true, it means the user is still composing text and the input is not finalized.
            if (!('isComposing' in event) || !event.isComposing) {
                if (this.androidChrome) this.handleAndroidInput(event);
                else this.handleInputChange(event);

                this.updateModelValue(this.inputElement.value);
            }
        },
        onFocus(event: FocusEvent) {
            if (this.readonly) {
                return;
            }

            this.focusText = this.inputElement.value;

            if (!this.inputElement.value || this.inputElement.value === this.defaultBuffer) {
                requestAnimationFrame(() => {
                    if (this.inputElement === document.activeElement) {
                        this.caret(0, 0);
                    }
                });
            } else {
                let pos = this.checkVal();

                setTimeout(() => {
                    if (this.inputElement !== document.activeElement) {
                        return;
                    }

                    this.writeBuffer();

                    if (pos === this.mask.replace('?', '').length) {
                        this.caret(0, pos);
                    } else {
                        this.caret(pos);
                    }
                }, 10);
            }

            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            this.checkVal();
            this.updateModelValue(this.inputElement.value);

            if (this.inputElement.value !== this.focusText) {
                let e = document.createEvent('HTMLEvents');

                e.initEvent('change', true, false);
                this.inputElement.dispatchEvent(e);
            }

            this.$emit('blur', event);
            this.formField.onBlur?.(event);
        },
        onKeyDown(event: KeyboardEvent) {
            if (this.readonly) {
                return;
            }

            let k = event.code,
                pos,
                begin,
                end;
            let iPhone = /iphone/i.test(getUserAgent());

            this.oldVal = this.inputElement.value;

            //backspace, delete, and escape get special treatment
            if (k === 'Backspace' || k === 'Delete' || (iPhone && k === 'Escape')) {
                pos = this.caret();
                if (!pos) return;

                begin = pos.begin;
                end = pos.end;

                if (end - begin === 0) {
                    begin = k !== 'Delete' ? this.seekPrev(begin) : (end = this.seekNext(begin - 1));
                    end = k === 'Delete' ? this.seekNext(end) : end;
                }

                this.clearBuffer(begin, end);
                this.shiftL(begin, end - 1);
                this.updateModelValue(this.inputElement.value);

                event.preventDefault();
            } else if (k === 'Enter') {
                // enter
                this.inputElement.blur();
                this.updateModelValue(this.inputElement.value);
            } else if (k === 'Escape') {
                // escape
                this.inputElement.value = this.focusText;
                this.caret(0, this.checkVal());
                this.updateModelValue(this.inputElement.value);
                event.preventDefault();
            }

            this.$emit('keydown', event);
        },
        onKeyPress(event: KeyboardEvent) {
            if (this.readonly) {
                return;
            }

            var k = event.code,
                pos = this.caret(),
                p,
                c,
                completed;

            if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey || event.key === 'CapsLock' || event.key === 'Escape' || event.key === 'Tab') {
                //Ignore
                return;
            } else if (pos && k && k !== 'Enter') {
                if (pos.end - pos.begin !== 0) {
                    this.clearBuffer(pos.begin, pos.end);
                    this.shiftL(pos.begin, pos.end - 1);
                }

                p = this.seekNext(pos.begin - 1);

                if (p < this.len) {
                    c = event.key;

                    if (this.tests[p]?.test(c)) {
                        this.shiftR(p);

                        this.buffer[p] = c;
                        this.writeBuffer();
                        const next = this.seekNext(p);

                        if (/android/i.test(getUserAgent())) {
                            //Path for CSP Violation on FireFox OS 1.1
                            let proxy = () => {
                                this.caret(next);
                            };

                            setTimeout(proxy, 0);
                        } else {
                            this.caret(next);
                        }

                        if (pos.begin <= this.lastRequiredNonMaskPos) {
                            completed = this.isCompleted();
                        }
                    }
                }

                event.preventDefault();
            }

            this.updateModelValue(this.inputElement.value);

            if (completed) {
                this.$emit('complete', event);
            }

            this.$emit('keypress', event);
        },
        onPaste(event: ClipboardEvent) {
            this.handleInputChange(event);

            this.$emit('paste', event);
        },
        caret(first?: number, last?: number) {
            let range, begin, end;

            if (!this.inputElement.offsetParent || this.inputElement !== document.activeElement) {
                return;
            }

            if (typeof first === 'number') {
                begin = first;
                end = typeof last === 'number' ? last : begin;

                if (this.inputElement.setSelectionRange) {
                    this.inputElement.setSelectionRange(begin, end);
                } else if (this.inputElement.createTextRange) {
                    range = this.inputElement.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', begin);
                    range.select();
                }
            } else {
                if (this.inputElement.setSelectionRange) {
                    begin = this.inputElement.selectionStart ?? 0;
                    end = this.inputElement.selectionEnd ?? begin;
                } else {
                    range = (document as SelectionDocument).selection?.createRange();
                    if (!range) return;

                    begin = 0 - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }

                return { begin: begin, end: end };
            }
        },
        isCompleted() {
            for (let i = this.firstNonMaskPos ?? 0; i <= this.lastRequiredNonMaskPos; i++) {
                if (this.tests[i] && this.buffer[i] === this.getPlaceholder(i)) {
                    return false;
                }
            }

            return true;
        },
        getPlaceholder(i: number) {
            if (i < this.slotChar.length) {
                return this.slotChar.charAt(i);
            }

            return this.slotChar.charAt(0);
        },
        seekNext(pos: number) {
            while (++pos < this.len && !this.tests[pos]);

            return pos;
        },
        seekPrev(pos: number) {
            while (--pos >= 0 && !this.tests[pos]);

            return pos;
        },
        shiftL(begin: number, end: number) {
            let i, j;

            if (begin < 0) {
                return;
            }

            for (i = begin, j = this.seekNext(end); i < this.len; i++) {
                if (this.tests[i]) {
                    if (j < this.len && this.tests[i]?.test(this.buffer[j])) {
                        this.buffer[i] = this.buffer[j];
                        this.buffer[j] = this.getPlaceholder(j);
                    } else {
                        break;
                    }

                    j = this.seekNext(j);
                }
            }

            this.writeBuffer();
            this.caret(Math.max(this.firstNonMaskPos ?? 0, begin));
        },
        shiftR(pos: number) {
            let i, c, j, t;

            for (i = pos, c = this.getPlaceholder(pos); i < this.len; i++) {
                if (this.tests[i]) {
                    j = this.seekNext(i);
                    t = this.buffer[i];
                    this.buffer[i] = c;

                    if (j < this.len && this.tests[j]?.test(t)) {
                        c = t;
                    } else {
                        break;
                    }
                }
            }
        },
        handleAndroidInput(event: Event) {
            var curVal = this.inputElement.value;
            var pos = this.caret() ?? { begin: 0, end: 0 };

            if (this.oldVal && this.oldVal.length && this.oldVal.length > curVal.length) {
                // a deletion or backspace happened
                this.checkVal(true);
                while (pos.begin > 0 && !this.tests[pos.begin - 1]) pos.begin--;

                if (pos.begin === 0) {
                    while (pos.begin < (this.firstNonMaskPos ?? 0) && !this.tests[pos.begin]) pos.begin++;
                }

                this.caret(pos.begin, pos.begin);
            } else {
                this.checkVal(true);
                while (pos.begin < this.len && !this.tests[pos.begin]) pos.begin++;

                this.caret(pos.begin, pos.begin);
            }

            if (this.isCompleted()) {
                this.$emit('complete', event);
            }
        },
        clearBuffer(start: number, end: number) {
            let i;

            for (i = start; i < end && i < this.len; i++) {
                if (this.tests[i]) {
                    this.buffer[i] = this.getPlaceholder(i);
                }
            }
        },
        writeBuffer() {
            this.inputElement.value = this.buffer.join('');
        },
        checkVal(allow = false) {
            //try to place characters where they belong
            let test = this.inputElement.value,
                lastMatch = -1,
                i,
                c,
                pos;

            for (i = 0, pos = 0; i < this.len; i++) {
                if (this.tests[i]) {
                    this.buffer[i] = this.getPlaceholder(i);

                    while (pos++ < test.length) {
                        c = test.charAt(pos - 1);

                        if (this.tests[i]?.test(c)) {
                            this.buffer[i] = c;
                            lastMatch = i;
                            break;
                        }
                    }

                    if (pos > test.length) {
                        this.clearBuffer(i + 1, this.len);
                        break;
                    }
                } else {
                    if (this.buffer[i] === test.charAt(pos)) {
                        pos++;
                    }

                    if (i < this.partialPosition) {
                        lastMatch = i;
                    }
                }
            }

            if (allow) {
                this.writeBuffer();
            } else if (lastMatch + 1 < this.partialPosition) {
                if (this.autoClear || this.buffer.join('') === this.defaultBuffer) {
                    // Invalid value. Remove it and replace it with the
                    // mask, which is the default behavior.
                    if (this.inputElement.value) this.inputElement.value = '';
                    this.clearBuffer(0, this.len);
                } else {
                    // Invalid value, but we opt to show the value to the
                    // user and allow them to correct their mistake.
                    this.writeBuffer();
                }
            } else {
                this.writeBuffer();
                this.inputElement.value = this.inputElement.value.substring(0, lastMatch + 1);
            }

            return this.partialPosition ? i : (this.firstNonMaskPos ?? 0);
        },
        handleInputChange(event: Event) {
            const isPasteEvent = event.type === 'paste';

            if (this.readonly || isPasteEvent) {
                return;
            }

            var pos = this.checkVal(true);

            this.caret(pos);
            this.updateModelValue(this.inputElement.value);

            if (this.isCompleted()) {
                this.$emit('complete', event);
            }
        },
        getUnmaskedValue() {
            let unmaskedBuffer = [];

            for (let i = 0; i < this.buffer.length; i++) {
                let c = this.buffer[i];

                if (this.tests[i] && c !== this.getPlaceholder(i)) {
                    unmaskedBuffer.push(c);
                }
            }

            return unmaskedBuffer.join('');
        },
        unmaskValue(value: string) {
            let unmaskedBuffer = [];
            let thisbuffer = value.split('');

            for (let i = 0; i < thisbuffer.length; i++) {
                let c = thisbuffer[i];

                if (this.tests[i] && c !== this.getPlaceholder(i)) {
                    unmaskedBuffer.push(c);
                }
            }

            return unmaskedBuffer.join('');
        },
        updateModelValue(value: string) {
            if (this.currentVal === value) return;
            const val = this.unmask ? this.getUnmaskedValue() : value;

            this.currentVal = value;

            this.writeValue(this.defaultBuffer !== val ? val : '');
        },
        updateValue(updateModel = true) {
            if (this.inputElement) {
                if (this.d_value == null) {
                    this.inputElement.value = '';
                    this.clearBuffer(0, this.len);
                    updateModel && this.updateModelValue('');
                } else {
                    this.inputElement.value = String(this.d_value);
                    this.checkVal();

                    setTimeout(() => {
                        if (this.inputElement) {
                            this.writeBuffer();
                            this.checkVal();

                            if (updateModel) this.updateModelValue(this.inputElement.value);
                        }
                    }, 10);
                }

                this.focusText = this.inputElement.value;
            }
        },
        initMask() {
            this.tests = [];
            this.partialPosition = this.mask ? this.mask.length : 0;
            this.len = this.mask ? this.mask.length : 0;
            this.firstNonMaskPos = null;

            let ua = getUserAgent();

            this.androidChrome = /chrome/i.test(ua) && /android/i.test(ua);

            let maskTokens = this.mask ? this.mask.split('') : '';

            for (let i = 0; i < maskTokens.length; i++) {
                let c = maskTokens[i];

                if (c === '?') {
                    this.len--;
                    this.partialPosition = i;
                } else if (maskDefinitions[c]) {
                    this.tests.push(new RegExp(maskDefinitions[c]));

                    if (this.firstNonMaskPos === null) {
                        this.firstNonMaskPos = this.tests.length - 1;
                    }

                    if (i < this.partialPosition) {
                        this.lastRequiredNonMaskPos = this.tests.length - 1;
                    }
                } else {
                    this.tests.push(null);
                }
            }

            this.buffer = [];

            for (let i = 0; i < maskTokens.length; i++) {
                let c = maskTokens[i];

                if (c !== '?') {
                    if (maskDefinitions[c]) this.buffer.push(this.getPlaceholder(i));
                    else this.buffer.push(c);
                }
            }

            this.defaultBuffer = this.buffer.join('');
            this.updateValue(false);
        },
        isValueUpdated() {
            return this.unmask
                ? this.d_value != this.getUnmaskedValue()
                : this.defaultBuffer !== this.inputElement.value && this.inputElement.value !== this.d_value;
        }
    },
    computed: {
        inputElement(): MaskInput {
            return this.$el as MaskInput;
        },
        inputClass() {
            return [this.cx('root'), this.class];
        },
        rootPTOptions() {
            return {
                root: mergeProps(this.ptm('pcInputText', this.ptmParams)['root'], this.ptmi('root', this.ptmParams))
            };
        },
        ptmParams() {
            return {
                context: {
                    filled: this.$filled
                }
            };
        }
    },
    components: {
        InputText
    }
});
</script>
