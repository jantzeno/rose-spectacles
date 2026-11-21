import type { DirectiveBinding } from 'vue';
import { isAttributeEquals } from '../internal/utils/dom/index';
import BaseKeyFilter from './BaseKeyFilter';

type InputElement = HTMLTextAreaElement | HTMLInputElement;
type KeyFilterElement = InputElement & {
    $_pkeyfilterModifier?: string;
    $_pkeyfilterPattern?: RegExp | '';
    $_pkeyfilterValidateOnly?: boolean;
    $_pkeyfilterComposing?: boolean;
    $_keyfilterKeydownEvent?: EventListener | null;
    $_keyfilterPasteEvent?: EventListener | null;
    $_keyfilterInputEvent?: EventListener | null;
    $_keyfilterCompositionStartEvent?: EventListener | null;
    $_keyfilterCompositionEndEvent?: EventListener | null;
};

const KeyFilter = BaseKeyFilter.extend('keyfilter', {
    beforeMount(el, options) {
        let target = this.getTarget(el) as KeyFilterElement | null;

        if (!target) return;

        target.$_pkeyfilterModifier = this.getModifiers(options);

        if (options.value !== undefined) {
            target.$_pkeyfilterPattern = options.value?.pattern || options.value;
            target.$_pkeyfilterValidateOnly = options.value?.validateOnly || false;
        }

        this.bindEvents(target);

        target.setAttribute('data-pd-keyfilter', 'true');
    },
    updated(el, options) {
        let target = this.getTarget(el) as KeyFilterElement | null;

        if (!target) return;

        target.$_pkeyfilterModifier = this.getModifiers(options);
        this.unbindEvents(el, options);

        if (options.value !== undefined) {
            target.$_pkeyfilterPattern = options.value?.pattern || options.value;
            target.$_pkeyfilterValidateOnly = options.value?.validateOnly || false;
        }

        this.bindEvents(target);
    },
    unmounted(el, options) {
        this.unbindEvents(el, options);
    },
    DEFAULT_PATTERNS: {
        pint: /[\d]/,
        int: /[\d-]/,
        pnum: /[\d.]/,
        money: /[\d.\s,]/,
        num: /[\d-.]/,
        hex: /[0-9a-f]/i,
        email: /[a-z0-9_.-@]/i,
        alpha: /[a-z_]/i,
        alphanum: /[a-z0-9_]/
    },
    methods: {
        getTarget(el: HTMLElement) {
            return isAttributeEquals(el, 'data-pc-name', 'inputtext') || isAttributeEquals(el, 'data-pc-name', 'textarea') ? (el as KeyFilterElement) : null;
        },
        getModifiers(options: DirectiveBinding) {
            if (options.modifiers && Object.keys(options.modifiers).length) {
                return Object.keys(options.modifiers)[Object.keys(options.modifiers).length - 1];
            }

            return '';
        },
        getRegex(target: KeyFilterElement): RegExp | '' {
            return target.$_pkeyfilterPattern
                ? target.$_pkeyfilterPattern
                : target.$_pkeyfilterModifier
                  ? this.DEFAULT_PATTERNS[target.$_pkeyfilterModifier]
                  : /./;
        },
        bindEvents(el: KeyFilterElement) {
            el.$_keyfilterKeydownEvent = (event) => this.onKeydown(event as KeyboardEvent, el);
            el.$_keyfilterPasteEvent = (event) => this.onPaste(event as ClipboardEvent, el);
            el.$_keyfilterInputEvent = (event) => this.onInput(event, el);
            el.$_keyfilterCompositionStartEvent = (event) => this.onCompositionStart(event as CompositionEvent, el);
            el.$_keyfilterCompositionEndEvent = (event) => this.onCompositionEnd(event as CompositionEvent, el);

            el.addEventListener('keypress', el.$_keyfilterKeydownEvent);
            el.addEventListener('paste', el.$_keyfilterPasteEvent);
            el.addEventListener('input', el.$_keyfilterInputEvent);
            el.addEventListener('compositionstart', el.$_keyfilterCompositionStartEvent);
            el.addEventListener('compositionend', el.$_keyfilterCompositionEndEvent);
        },
        unbindEvents(el: KeyFilterElement) {
            if (el.$_keyfilterKeydownEvent) el.removeEventListener('keypress', el.$_keyfilterKeydownEvent);
            if (el.$_keyfilterPasteEvent) el.removeEventListener('paste', el.$_keyfilterPasteEvent);
            if (el.$_keyfilterInputEvent) el.removeEventListener('input', el.$_keyfilterInputEvent);
            if (el.$_keyfilterCompositionStartEvent) el.removeEventListener('compositionstart', el.$_keyfilterCompositionStartEvent);
            if (el.$_keyfilterCompositionEndEvent) el.removeEventListener('compositionend', el.$_keyfilterCompositionEndEvent);

            el.$_keyfilterKeydownEvent = null;
            el.$_keyfilterPasteEvent = null;
            el.$_keyfilterInputEvent = null;
            el.$_keyfilterCompositionStartEvent = null;
            el.$_keyfilterCompositionEndEvent = null;
        },
        onCompositionStart(event: CompositionEvent, target: KeyFilterElement) {
            target.$_pkeyfilterComposing = true;
        },
        onCompositionEnd(event: CompositionEvent, target: KeyFilterElement) {
            target.$_pkeyfilterComposing = false;
            this.onInput(event, target);
        },
        onInput(event: Event, target: KeyFilterElement) {
            if (target.$_pkeyfilterComposing) return;

            const regex = this.getRegex(target);

            if (regex && !regex.test(target.value)) {
                // remove invalid character e.g. ~ "
                target.value = target.value.slice(0, -1);
            }
        },
        onKeydown(event: KeyboardEvent, target: KeyFilterElement) {
            if (event.ctrlKey || event.altKey || event.metaKey || event.key === 'Tab') {
                return;
            }

            let regex = this.getRegex(target) as RegExp | '';

            if (regex === '') {
                return;
            }

            let testKey = `${event.key}`;

            if (target.$_pkeyfilterValidateOnly) {
                testKey = `${target.value.substring(0, target.selectionStart!)}${event.key}${target.value.substring(target.selectionEnd!)}`;
            }

            if (!regex.test(testKey)) {
                // runs before @update:modelValue emit
                event.preventDefault();
            }
        },
        onPaste(event: ClipboardEvent, target: KeyFilterElement) {
            let regex = this.getRegex(target) as RegExp | '';

            if (regex === '') {
                return;
            }

            const clipboard = event.clipboardData!.getData('text');

            if (target.$_pkeyfilterValidateOnly) {
                const newValue = `${target.value.substring(0, target.selectionStart!)}${clipboard}${target.value.substring(target.selectionEnd!)}`;

                if (!regex.test(newValue)) {
                    event.preventDefault();
                }
            } else {
                for (let i = 0; i < clipboard.length; i++) {
                    if (!regex.test(clipboard[i])) {
                        event.preventDefault();

                        return;
                    }
                }
            }
        }
    }
});

export default KeyFilter;
