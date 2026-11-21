import type { TooltipOptions } from 'rose-spectacles/tooltip';
import type { DirectiveBinding } from 'vue';
import {
    addClass,
    createElement,
    fadeIn,
    findSingle,
    getOuterHeight,
    getOuterWidth,
    getViewport,
    getWindowScrollLeft,
    getWindowScrollTop,
    hasClass,
    isExist,
    isTouchDevice,
    removeClass,
    setAttributes
} from '../internal/utils/dom/index';
import { isEmpty } from '../internal/utils/object/index';
import { uuid } from '../internal/utils/uuid/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { ConnectedOverlayScrollHandler } from '../core/utils/Utils';
import BaseTooltip from './BaseTooltip';

type Binding = Omit<DirectiveBinding<string | TooltipOptions | undefined>, 'arg'> & {
    arg?: string | Record<string, string>;
};
type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

interface TooltipTarget extends HTMLElement {
    $_ptooltipModifiers: Record<string, boolean>;
    $_ptooltipValue?: string;
    $_ptooltipDisabled?: boolean;
    $_ptooltipEscape?: boolean;
    $_ptooltipFitContent?: boolean;
    $_ptooltipAutoHide?: boolean;
    $_ptooltipPendingShow?: boolean;
    $_ptooltipClass?: string | null;
    $_ptooltipId?: string | null;
    $_ptooltipIdAttr?: string;
    $_ptooltipOwnDescription?: string | null;
    $_ptooltipShowDelay?: number;
    $_ptooltipHideDelay?: number;
    $_ptooltipZIndex?: number;
    $_ptooltipShowTimer?: ReturnType<typeof setTimeout>;
    $_ptooltipHideTimer?: ReturnType<typeof setTimeout>;
    $_ptooltipScrollHandler?: ConnectedOverlayScrollHandler | null;
    $_ptooltipFocusEvent?: ((event: FocusEvent) => void) | null;
    $_ptooltipBlurEvent?: ((event: FocusEvent) => void) | null;
    $_ptooltipMouseEnterEvent?: ((event: MouseEvent) => void) | null;
    $_ptooltipMouseLeaveEvent?: ((event: MouseEvent) => void) | null;
    $_ptooltipClickEvent?: ((event: MouseEvent) => void) | null;
    $_ptooltipKeydownEvent?: (event: KeyboardEvent) => void;
    $_ptooltipDocumentEscape?: ((event: KeyboardEvent) => void) | null;
    $_pWindowResizeEvent?: () => void;
}

const Tooltip = BaseTooltip.extend('tooltip', {
    beforeMount(el, options) {
        let target = this.getTarget(el) as TooltipTarget;

        target.$_ptooltipModifiers = this.getModifiers(options);

        if (!options.value) return;
        else if (typeof options.value === 'string') {
            target.$_ptooltipValue = options.value;
            target.$_ptooltipDisabled = false;
            target.$_ptooltipEscape = true;
            target.$_ptooltipClass = null;
            target.$_ptooltipFitContent = true;
            target.$_ptooltipIdAttr = uuid('pv_id') + '_tooltip';
            target.$_ptooltipShowDelay = 0;
            target.$_ptooltipHideDelay = 0;
            target.$_ptooltipAutoHide = false;
        } else if (typeof options.value === 'object' && options.value) {
            if (isEmpty(options.value.value) || options.value.value.trim() === '') return;
            else {
                target.$_ptooltipValue = options.value.value;
                target.$_ptooltipDisabled = !!options.value.disabled === options.value.disabled ? options.value.disabled : false;
                target.$_ptooltipEscape = !!options.value.escape === options.value.escape ? options.value.escape : true;
                target.$_ptooltipClass = options.value.class || '';
                target.$_ptooltipFitContent = !!options.value.fitContent === options.value.fitContent ? options.value.fitContent : true;
                target.$_ptooltipIdAttr = options.value.id || uuid('pv_id') + '_tooltip';
                target.$_ptooltipShowDelay = options.value.showDelay || 0;
                target.$_ptooltipHideDelay = options.value.hideDelay || 0;
                target.$_ptooltipAutoHide = !!options.value.autoHide === options.value.autoHide ? options.value.autoHide : false;
            }
        }

        target.$_ptooltipZIndex = options.instance!.$primevue?.config?.zIndex?.tooltip;

        this.bindEvents(target, options);

        el.setAttribute('data-pd-tooltip', 'true');
    },
    updated(el, options) {
        let target = this.getTarget(el) as TooltipTarget;

        this.hide(target);
        this.unbindEvents(target);
        target.$_ptooltipModifiers = this.getModifiers(options);

        if (!options.value) {
            return;
        }

        if (typeof options.value === 'string') {
            target.$_ptooltipValue = options.value;
            target.$_ptooltipDisabled = false;
            target.$_ptooltipEscape = true;
            target.$_ptooltipClass = null;
            target.$_ptooltipIdAttr = target.$_ptooltipIdAttr || uuid('pv_id') + '_tooltip';
            target.$_ptooltipShowDelay = 0;
            target.$_ptooltipHideDelay = 0;
            target.$_ptooltipAutoHide = false;

            this.bindEvents(target, options);
        } else if (typeof options.value === 'object' && options.value) {
            if (isEmpty(options.value.value) || options.value.value.trim() === '') {
                this.unbindEvents(target, options);

                return;
            } else {
                target.$_ptooltipValue = options.value.value;
                target.$_ptooltipDisabled = !!options.value.disabled === options.value.disabled ? options.value.disabled : false;
                target.$_ptooltipEscape = !!options.value.escape === options.value.escape ? options.value.escape : true;
                target.$_ptooltipClass = options.value.class || '';
                target.$_ptooltipFitContent = !!options.value.fitContent === options.value.fitContent ? options.value.fitContent : true;
                target.$_ptooltipIdAttr = options.value.id || target.$_ptooltipIdAttr || uuid('pv_id') + '_tooltip';
                target.$_ptooltipShowDelay = options.value.showDelay || 0;
                target.$_ptooltipHideDelay = options.value.hideDelay || 0;
                target.$_ptooltipAutoHide = !!options.value.autoHide === options.value.autoHide ? options.value.autoHide : false;

                this.bindEvents(target, options);
            }
        }
    },
    unmounted(el, options) {
        let target = this.getTarget(el) as TooltipTarget;

        this.hide(el, 0);
        this.remove(target);
        this.unbindEvents(target, options);

        if (target.$_ptooltipScrollHandler) {
            target.$_ptooltipScrollHandler.destroy();
            target.$_ptooltipScrollHandler = null;
        }
    },
    methods: {
        bindEvents(el: TooltipTarget, options: Binding) {
            const modifiers = el.$_ptooltipModifiers;

            if (!modifiers.hover) {
                el.$_ptooltipFocusEvent = (event) => this.onFocus(event, options);
                el.$_ptooltipBlurEvent = (event) => this.onBlur(event);

                el.addEventListener('focus', el.$_ptooltipFocusEvent);
                el.addEventListener('blur', el.$_ptooltipBlurEvent);
            }

            if (!modifiers.focus) {
                el.$_ptooltipMouseEnterEvent = (event) => this.onMouseEnter(event, options);
                el.$_ptooltipMouseLeaveEvent = (event) => this.onMouseLeave(event);
                el.$_ptooltipClickEvent = (event) => this.onClick(event);

                el.addEventListener('mouseenter', el.$_ptooltipMouseEnterEvent);
                el.addEventListener('mouseleave', el.$_ptooltipMouseLeaveEvent);
                el.addEventListener('click', el.$_ptooltipClickEvent);
            }

            el.$_ptooltipKeydownEvent = (event) => this.onKeydown(event);
            el.addEventListener('keydown', el.$_ptooltipKeydownEvent);

            el.$_pWindowResizeEvent = () => this.onWindowResize(el);
        },
        unbindEvents(el: TooltipTarget) {
            const modifiers = el.$_ptooltipModifiers;

            if (!modifiers.hover) {
                el.removeEventListener('focus', el.$_ptooltipFocusEvent!);
                el.$_ptooltipFocusEvent = null;

                el.removeEventListener('blur', el.$_ptooltipBlurEvent!);
                el.$_ptooltipBlurEvent = null;
            }

            if (!modifiers.focus) {
                el.removeEventListener('mouseenter', el.$_ptooltipMouseEnterEvent!);
                el.$_ptooltipMouseEnterEvent = null;

                el.removeEventListener('mouseleave', el.$_ptooltipMouseLeaveEvent!);
                el.$_ptooltipMouseLeaveEvent = null;

                el.removeEventListener('click', el.$_ptooltipClickEvent!);
                el.$_ptooltipClickEvent = null;
            }

            el.removeEventListener('keydown', el.$_ptooltipKeydownEvent!);
            window.removeEventListener('resize', el.$_pWindowResizeEvent!);

            if (el.$_ptooltipId) {
                this.remove(el);
            }
        },
        bindScrollListener(el: TooltipTarget) {
            if (!el.$_ptooltipScrollHandler) {
                el.$_ptooltipScrollHandler = new ConnectedOverlayScrollHandler(el, () => {
                    this.hide(el);
                });
            }

            el.$_ptooltipScrollHandler.bindScrollListener();
        },
        unbindScrollListener(el: TooltipTarget) {
            if (el.$_ptooltipScrollHandler) {
                el.$_ptooltipScrollHandler.unbindScrollListener();
            }
        },
        onMouseEnter(event: MouseEvent, options: Binding) {
            const el = event.currentTarget as TooltipTarget;
            const showDelay = el.$_ptooltipShowDelay;

            this.show(el, options, showDelay);
        },
        onMouseLeave(event: MouseEvent) {
            const el = event.currentTarget as TooltipTarget;
            const hideDelay = el.$_ptooltipHideDelay;
            const autoHide = el.$_ptooltipAutoHide;

            const tooltip = this.getTooltipElement(el);
            const enteredTooltip = event.relatedTarget && tooltip?.contains(event.relatedTarget as Node);

            if (autoHide || (!enteredTooltip && el.ownerDocument.activeElement !== el)) {
                this.hide(el, hideDelay);
            }
        },
        onFocus(event: FocusEvent, options: Binding) {
            const el = event.currentTarget as TooltipTarget;
            const showDelay = el.$_ptooltipShowDelay;

            this.show(el, options, showDelay);
        },
        onBlur(event: FocusEvent) {
            const el = event.currentTarget as TooltipTarget;
            const hideDelay = el.$_ptooltipHideDelay;

            this.hide(el, hideDelay);
        },
        onClick(event: MouseEvent) {
            const el = event.currentTarget as TooltipTarget;
            const hideDelay = el.$_ptooltipHideDelay;

            this.hide(el, hideDelay);
        },
        onKeydown(event: KeyboardEvent) {
            const el = event.currentTarget as TooltipTarget;
            const hideDelay = el.$_ptooltipHideDelay;

            event.code === 'Escape' && this.hide(el, hideDelay);
        },
        onWindowResize(el: TooltipTarget) {
            if (!isTouchDevice()) {
                this.hide(el);
            }

            window.removeEventListener('resize', el.$_pWindowResizeEvent!);
        },
        tooltipActions(el: TooltipTarget, options: Binding) {
            if (el.$_ptooltipDisabled || !isExist(el) || !el.$_ptooltipPendingShow) {
                return;
            }

            el.$_ptooltipPendingShow = false;
            this.remove(el);
            let tooltipElement = this.create(el, options) as HTMLElement;

            this.align(el);
            this.applyArrowPassThrough(el, tooltipElement);
            !this.isUnstyled() && fadeIn(tooltipElement, 250);

            window.addEventListener('resize', el.$_pWindowResizeEvent!);

            el.$_ptooltipDocumentEscape = (event) => {
                if (event.code === 'Escape' && event.target !== el) {
                    this.hide(el, el.$_ptooltipHideDelay);
                }
            };
            el.ownerDocument.addEventListener('keydown', el.$_ptooltipDocumentEscape, true);
            tooltipElement.addEventListener('mouseleave', (event) => {
                if (!event.relatedTarget || !el.contains(event.relatedTarget as Node)) {
                    this.hide(el, el.$_ptooltipHideDelay);
                }
            });

            this.bindScrollListener(el);
            ZIndex.set('tooltip', tooltipElement, el.$_ptooltipZIndex);
        },
        applyArrowPassThrough(el: TooltipTarget, tooltip: HTMLElement) {
            const arrow = this.getArrowElement(el) as HTMLElement;
            const position = tooltip.dataset.pPosition;
            const { top, right, bottom, left } = arrow.style;

            setAttributes(
                arrow,
                this.ptm('arrow', {
                    context: {
                        ...el.$_ptooltipModifiers,
                        top: position === 'top',
                        right: position === 'right',
                        bottom: position === 'bottom',
                        left: position === 'left'
                    }
                })
            );
            Object.assign(arrow.style, { top, right, bottom, left });
        },
        show(el: TooltipTarget, options: Binding, showDelay?: number) {
            clearTimeout(el.$_ptooltipShowTimer);
            clearTimeout(el.$_ptooltipHideTimer);

            if (showDelay !== undefined) {
                el.$_ptooltipShowTimer = setTimeout(() => this.tooltipActions(el, options), showDelay);
                el.$_ptooltipPendingShow = true;
            } else {
                this.tooltipActions(el, options);
                el.$_ptooltipPendingShow = false;
            }
        },
        tooltipRemoval(el: TooltipTarget) {
            this.remove(el);
            this.unbindScrollListener(el);
            window.removeEventListener('resize', el.$_pWindowResizeEvent!);
        },
        hide(el: TooltipTarget, hideDelay?: number) {
            clearTimeout(el.$_ptooltipShowTimer);
            clearTimeout(el.$_ptooltipHideTimer);
            el.$_ptooltipPendingShow = false;

            if (hideDelay !== undefined) {
                el.$_ptooltipHideTimer = setTimeout(() => this.tooltipRemoval(el), hideDelay);
            } else {
                this.tooltipRemoval(el);
            }
        },
        getTooltipElement(el: TooltipTarget) {
            return document.getElementById(el.$_ptooltipId as string);
        },
        getArrowElement(el: TooltipTarget) {
            let tooltipElement = this.getTooltipElement(el);

            return findSingle(tooltipElement, '[data-pc-section="arrow"]');
        },
        create(el: TooltipTarget) {
            const modifiers = el.$_ptooltipModifiers;

            const tooltipArrow = createElement('div', {
                class: !this.isUnstyled() && this.cx('arrow'),
                'data-pc-section': 'arrow'
            });

            const tooltipText = createElement('div', {
                class: !this.isUnstyled() && this.cx('text'),
                'rs-bind': this.ptm('text', {
                    context: modifiers
                })
            });

            if (!el.$_ptooltipEscape) {
                tooltipText.innerHTML = el.$_ptooltipValue!;
            } else {
                tooltipText.innerHTML = '';
                tooltipText.appendChild(document.createTextNode(el.$_ptooltipValue!));
            }

            const container = createElement(
                'div',
                {
                    id: el.$_ptooltipIdAttr,
                    role: 'tooltip',
                    style: {
                        display: 'inline-block',
                        width: el.$_ptooltipFitContent ? 'fit-content' : undefined,
                        pointerEvents: !this.isUnstyled() && el.$_ptooltipAutoHide && 'none'
                    },
                    class: [!this.isUnstyled() && this.cx('root'), el.$_ptooltipClass],
                    [this.$attrSelector]: '',
                    'rs-bind': this.ptm('root', {
                        context: modifiers
                    })
                },
                tooltipArrow,
                tooltipText
            );

            document.body.appendChild(container);

            const descriptions = (el.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);

            if (!descriptions.includes(container.id)) {
                el.setAttribute('aria-describedby', [...descriptions, container.id].join(' '));
                el.$_ptooltipOwnDescription = container.id;
            }

            el.$_ptooltipId = container.id;
            this.$el = container;

            return container;
        },
        remove(el: TooltipTarget | null) {
            if (el) {
                let tooltipElement = this.getTooltipElement(el);

                if (tooltipElement && tooltipElement.parentElement) {
                    ZIndex.clear(tooltipElement);
                    document.body.removeChild(tooltipElement);
                }

                const description = el.$_ptooltipOwnDescription;

                if (description) {
                    const remaining = (el.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((id) => id && id !== description);
                    if (remaining.length) el.setAttribute('aria-describedby', remaining.join(' '));
                    else el.removeAttribute('aria-describedby');
                    el.$_ptooltipOwnDescription = null;
                }

                if (el.$_ptooltipDocumentEscape) {
                    el.ownerDocument.removeEventListener('keydown', el.$_ptooltipDocumentEscape, true);
                    el.$_ptooltipDocumentEscape = null;
                }

                el.$_ptooltipId = null;
            }
        },
        align(el: TooltipTarget) {
            const modifiers = el.$_ptooltipModifiers;

            if (modifiers.top) {
                this.alignTop(el);

                if (this.isOutOfBounds(el)) {
                    this.alignBottom(el);

                    if (this.isOutOfBounds(el)) {
                        this.alignTop(el);
                    }
                }
            } else if (modifiers.left) {
                this.alignLeft(el);

                if (this.isOutOfBounds(el)) {
                    this.alignRight(el);

                    if (this.isOutOfBounds(el)) {
                        this.alignTop(el);

                        if (this.isOutOfBounds(el)) {
                            this.alignBottom(el);

                            if (this.isOutOfBounds(el)) {
                                this.alignLeft(el);
                            }
                        }
                    }
                }
            } else if (modifiers.bottom) {
                this.alignBottom(el);

                if (this.isOutOfBounds(el)) {
                    this.alignTop(el);

                    if (this.isOutOfBounds(el)) {
                        this.alignBottom(el);
                    }
                }
            } else {
                this.alignRight(el);

                if (this.isOutOfBounds(el)) {
                    this.alignLeft(el);

                    if (this.isOutOfBounds(el)) {
                        this.alignTop(el);

                        if (this.isOutOfBounds(el)) {
                            this.alignBottom(el);

                            if (this.isOutOfBounds(el)) {
                                this.alignRight(el);
                            }
                        }
                    }
                }
            }
        },
        getHostOffset(el: HTMLElement) {
            let offset = el.getBoundingClientRect();
            let targetLeft = offset.left + getWindowScrollLeft();
            let targetTop = offset.top + getWindowScrollTop();

            return { left: targetLeft, top: targetTop };
        },
        alignRight(el: TooltipTarget) {
            this.preAlign(el, 'right');
            let tooltipElement = this.getTooltipElement(el);
            let arrowElement = this.getArrowElement(el);
            let hostOffset = this.getHostOffset(el);
            let left = hostOffset.left + getOuterWidth(el);
            let top = hostOffset.top + (getOuterHeight(el) - getOuterHeight(tooltipElement)) / 2;

            tooltipElement.style.left = left + 'px';
            tooltipElement.style.top = top + 'px';

            arrowElement.style.top = '50%';
            arrowElement.style.right = null;
            arrowElement.style.bottom = null;
            arrowElement.style.left = '0';
        },
        alignLeft(el: TooltipTarget) {
            this.preAlign(el, 'left');
            let tooltipElement = this.getTooltipElement(el);
            let arrowElement = this.getArrowElement(el);
            let hostOffset = this.getHostOffset(el);
            let left = hostOffset.left - getOuterWidth(tooltipElement);
            let top = hostOffset.top + (getOuterHeight(el) - getOuterHeight(tooltipElement)) / 2;

            tooltipElement.style.left = left + 'px';
            tooltipElement.style.top = top + 'px';

            arrowElement.style.top = '50%';
            arrowElement.style.right = '0';
            arrowElement.style.bottom = null;
            arrowElement.style.left = null;
        },
        alignTop(el: TooltipTarget) {
            this.preAlign(el, 'top');
            let tooltipElement = this.getTooltipElement(el);
            let arrowElement = this.getArrowElement(el);
            let tooltipWidth = getOuterWidth(tooltipElement);
            let elementWidth = getOuterWidth(el);
            let { width: viewportWidth } = getViewport();
            let hostOffset = this.getHostOffset(el);
            let left = hostOffset.left + (elementWidth - tooltipWidth) / 2;
            let top = hostOffset.top - getOuterHeight(tooltipElement);

            if (left < 0) {
                left = 0;
            } else if (left + tooltipWidth > viewportWidth) {
                left = Math.floor(hostOffset.left + elementWidth - tooltipWidth);
            }

            tooltipElement.style.left = left + 'px';
            tooltipElement.style.top = top + 'px';

            // The center of the target relative to the tooltip
            let elementRelativeCenter = hostOffset.left - this.getHostOffset(tooltipElement).left + elementWidth / 2;

            arrowElement.style.top = null;
            arrowElement.style.right = null;
            arrowElement.style.bottom = '0';
            arrowElement.style.left = elementRelativeCenter + 'px';
        },
        alignBottom(el: TooltipTarget) {
            this.preAlign(el, 'bottom');
            let tooltipElement = this.getTooltipElement(el);
            let arrowElement = this.getArrowElement(el);
            let tooltipWidth = getOuterWidth(tooltipElement);
            let elementWidth = getOuterWidth(el);
            let { width: viewportWidth } = getViewport();
            let hostOffset = this.getHostOffset(el);

            let left = hostOffset.left + (elementWidth - tooltipWidth) / 2;
            let top = hostOffset.top + getOuterHeight(el);

            if (left < 0) {
                left = 0;
            } else if (left + tooltipWidth > viewportWidth) {
                left = Math.floor(hostOffset.left + elementWidth - tooltipWidth);
            }

            tooltipElement.style.left = left + 'px';
            tooltipElement.style.top = top + 'px';

            // The center of the target relative to the tooltip
            let elementRelativeCenter = hostOffset.left - this.getHostOffset(tooltipElement).left + elementWidth / 2;

            arrowElement.style.top = '0';
            arrowElement.style.right = null;
            arrowElement.style.bottom = null;
            arrowElement.style.left = elementRelativeCenter + 'px';
        },
        preAlign(el: TooltipTarget, position: TooltipPosition) {
            let tooltipElement = this.getTooltipElement(el);

            tooltipElement.style.left = -999 + 'px';
            tooltipElement.style.top = -999 + 'px';
            removeClass(tooltipElement, `rs-tooltip-${tooltipElement.$_ptooltipPosition}`);
            !this.isUnstyled() && addClass(tooltipElement, `rs-tooltip-${position}`);
            tooltipElement.$_ptooltipPosition = position;
            tooltipElement.setAttribute('data-p-position', position);
        },
        isOutOfBounds(el: TooltipTarget) {
            let tooltipElement = this.getTooltipElement(el);
            let offset = tooltipElement.getBoundingClientRect();
            let targetTop = offset.top;
            let targetLeft = offset.left;
            let width = getOuterWidth(tooltipElement);
            let height = getOuterHeight(tooltipElement);
            let viewport = getViewport();

            return targetLeft + width > viewport.width || targetLeft < 0 || targetTop < 0 || targetTop + height > viewport.height;
        },
        getTarget(el: HTMLElement): TooltipTarget {
            return (hasClass(el, 'rs-inputwrapper') ? (findSingle(el, 'input') ?? el) : el) as TooltipTarget;
        },
        getModifiers(options: Binding) {
            // modifiers
            if (options.modifiers && Object.keys(options.modifiers).length) {
                return options.modifiers;
            }

            // arg
            if (options.arg && typeof options.arg === 'object') {
                return Object.entries(options.arg).reduce<Record<string, boolean>>((acc, [key, val]) => {
                    if (key === 'event' || key === 'position') acc[val] = true;

                    return acc;
                }, {});
            }

            return {};
        }
    }
});

export default Tooltip;
