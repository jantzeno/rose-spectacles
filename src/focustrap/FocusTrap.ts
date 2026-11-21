import type { FocusTrapOptions } from 'rose-spectacles/focustrap';
import { createElement, focus, getFirstFocusableElement, getLastFocusableElement, isElement, isFocusableElement } from '../internal/utils/dom/index';
import { isNotEmpty } from '../internal/utils/object/index';
import BaseFocusTrap from './BaseFocusTrap';

type FocusTrapBinding = {
    value?: FocusTrapOptions & {
        autoFocusSelector?: string;
        firstFocusableSelector?: string;
        lastFocusableSelector?: string;
        tabIndex?: number;
        onFocusIn?: (event: FocusEvent) => void;
        onFocusOut?: (event: FocusEvent) => void;
    };
};

interface FocusTrapElement extends HTMLElement {
    $_pfocustrap_mutationobserver?: MutationObserver;
    $_pfocustrap_focusinlistener?: (event: FocusEvent) => void;
    $_pfocustrap_focusoutlistener?: (event: FocusEvent) => void;
    $_pfocustrap_focusableselector?: string;
}

interface FocusSentinel extends HTMLElement {
    $_pfocustrap_firsthiddenfocusableelement?: FocusSentinel;
    $_pfocustrap_lasthiddenfocusableelement?: FocusSentinel;
    $_pfocustrap_focusableselector: string;
}

const FocusTrap = BaseFocusTrap.extend('focustrap', {
    mounted(el, binding) {
        const { disabled } = binding.value || {};

        if (!disabled) {
            this.createHiddenFocusableElements(el, binding);
            this.bind(el, binding);
            this.autoElementFocus(el, binding);
        }

        el.setAttribute('data-pd-focustrap', 'true');

        this.$el = el;
    },
    updated(el, binding) {
        const { disabled } = binding.value || {};

        disabled && this.unbind(el);
    },
    unmounted(el) {
        this.unbind(el);
    },
    methods: {
        getComputedSelector(selector?: string) {
            return `:not(.rs-hidden-focusable):not([data-p-hidden-focusable="true"])${selector ?? ''}`;
        },
        bind(el: FocusTrapElement, binding: FocusTrapBinding) {
            const { onFocusIn, onFocusOut } = binding.value || {};

            el.$_pfocustrap_mutationobserver = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation) => {
                    if (mutation.type === 'childList' && !el.contains(document.activeElement)) {
                        const findNextFocusableElement = (_el: Node | null): Element | null => {
                            if (!isElement(_el)) return _el ? findNextFocusableElement(_el.nextSibling) : null;

                            const focusableElement = isFocusableElement(_el)
                                ? isFocusableElement(_el, this.getComputedSelector(el.$_pfocustrap_focusableselector))
                                    ? _el
                                    : getFirstFocusableElement(el, this.getComputedSelector(el.$_pfocustrap_focusableselector))
                                : getFirstFocusableElement(_el);

                            return isNotEmpty(focusableElement) ? focusableElement : _el.nextSibling && findNextFocusableElement(_el.nextSibling);
                        };

                        focus(findNextFocusableElement(mutation.nextSibling) as HTMLElement);
                    }
                });
            });

            el.$_pfocustrap_mutationobserver.disconnect();
            el.$_pfocustrap_mutationobserver.observe(el, {
                childList: true
            });

            el.$_pfocustrap_focusinlistener = (event) => onFocusIn && onFocusIn(event);
            el.$_pfocustrap_focusoutlistener = (event) => onFocusOut && onFocusOut(event);

            el.addEventListener('focusin', el.$_pfocustrap_focusinlistener);
            el.addEventListener('focusout', el.$_pfocustrap_focusoutlistener);
        },
        unbind(el: FocusTrapElement) {
            el.$_pfocustrap_mutationobserver?.disconnect();
            if (el.$_pfocustrap_focusinlistener) el.removeEventListener('focusin', el.$_pfocustrap_focusinlistener);
            if (el.$_pfocustrap_focusoutlistener) el.removeEventListener('focusout', el.$_pfocustrap_focusoutlistener);
        },
        autoFocus(options?: FocusTrapBinding['value']) {
            this.autoElementFocus(this.$el, { value: { ...options, autoFocus: true } });
        },
        autoElementFocus(el: HTMLElement, binding: FocusTrapBinding) {
            const { autoFocusSelector = '', firstFocusableSelector = '', autoFocus = false } = binding.value || {};
            let focusableElement = getFirstFocusableElement(el, `[autofocus]${this.getComputedSelector(autoFocusSelector)}`);

            autoFocus && !focusableElement && (focusableElement = getFirstFocusableElement(el, this.getComputedSelector(firstFocusableSelector)));
            focus(focusableElement as HTMLElement);
        },
        onFirstHiddenElementFocus(event: FocusEvent) {
            const currentTarget = event.currentTarget as FocusSentinel;
            const relatedTarget = event.relatedTarget as Node | null;
            const focusableElement =
                relatedTarget === currentTarget.$_pfocustrap_lasthiddenfocusableelement || !this.$el?.contains(relatedTarget)
                    ? getFirstFocusableElement(currentTarget.parentElement!, this.getComputedSelector(currentTarget.$_pfocustrap_focusableselector))
                    : currentTarget.$_pfocustrap_lasthiddenfocusableelement;

            focus(focusableElement as HTMLElement);
        },
        onLastHiddenElementFocus(event: FocusEvent) {
            const currentTarget = event.currentTarget as FocusSentinel;
            const relatedTarget = event.relatedTarget as Node | null;
            const focusableElement =
                relatedTarget === currentTarget.$_pfocustrap_firsthiddenfocusableelement || !this.$el?.contains(relatedTarget)
                    ? getLastFocusableElement(currentTarget.parentElement!, this.getComputedSelector(currentTarget.$_pfocustrap_focusableselector))
                    : currentTarget.$_pfocustrap_firsthiddenfocusableelement;

            focus(focusableElement as HTMLElement);
        },
        createHiddenFocusableElements(el: HTMLElement, binding: FocusTrapBinding) {
            const { tabIndex = 0, firstFocusableSelector = '', lastFocusableSelector = '' } = binding.value || {};

            const createFocusableElement = (onFocus: (event: FocusEvent) => void) => {
                return createElement('span', {
                    class: 'rs-hidden-accessible rs-hidden-focusable',
                    tabIndex,
                    role: 'presentation',
                    'aria-hidden': true,
                    'data-p-hidden-accessible': true,
                    'data-p-hidden-focusable': true,
                    onFocus: onFocus?.bind(this)
                }) as FocusSentinel;
            };

            const firstFocusableElement = createFocusableElement(this.onFirstHiddenElementFocus);
            const lastFocusableElement = createFocusableElement(this.onLastHiddenElementFocus);

            firstFocusableElement.$_pfocustrap_lasthiddenfocusableelement = lastFocusableElement;
            firstFocusableElement.$_pfocustrap_focusableselector = firstFocusableSelector;
            firstFocusableElement.setAttribute('data-pc-section', 'firstfocusableelement');

            lastFocusableElement.$_pfocustrap_firsthiddenfocusableelement = firstFocusableElement;
            lastFocusableElement.$_pfocustrap_focusableselector = lastFocusableSelector;
            lastFocusableElement.setAttribute('data-pc-section', 'lastfocusableelement');

            el.prepend(firstFocusableElement);
            el.append(lastFocusableElement);
        }
    }
});

export default FocusTrap;
