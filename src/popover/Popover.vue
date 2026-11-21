<template>
    <Portal :appendTo="appendTo">
        <transition name="rs-anchored-overlay" @enter="onEnter" @leave="onLeave" @after-leave="onAfterLeave" v-bind="ptm('transition')">
            <div
                v-if="visible"
                :ref="containerRef"
                v-focustrap
                role="dialog"
                :aria-modal="visible"
                @click="onOverlayClick"
                :class="cx('root')"
                v-bind="ptmi('root')"
            >
                <slot v-if="$slots.container" name="container" :closeCallback="hide" :keydownCallback="onButtonKeydown"></slot>
                <template v-else>
                    <div :class="cx('content')" @click="onContentClick" @mousedown="onContentClick" @keydown="onContentKeydown" v-bind="ptm('content')">
                        <slot></slot>
                    </div>
                </template>
            </div>
        </transition>
    </Portal>
</template>

<script lang="ts">
import { defineComponent, markRaw, type ComponentPublicInstance } from 'vue';
import { $dt } from '../internal/styled/index';
import { absolutePosition, addClass, addStyle, focus, getOffset, isClient, isTouchDevice, setAttribute } from '../internal/utils/dom/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { ConnectedOverlayScrollHandler } from '../core/utils/Utils';
import FocusTrap from '../focustrap/FocusTrap';
import OverlayEventBus from '../overlayeventbus/OverlayEventBus';
import Portal from '../portal/Portal.vue';
import Ripple from '../ripple/Ripple';
import BasePopover from './BasePopover.vue';

export default defineComponent({
    name: 'Popover',
    extends: BasePopover,
    inheritAttrs: false,
    emits: ['show', 'hide'],
    data() {
        return {
            visible: false,
            selfClick: false,
            target: null as HTMLElement | null,
            eventTarget: null as EventTarget | null,
            outsideClickListener: null as ((event: MouseEvent) => void) | null,
            scrollHandler: null as ConnectedOverlayScrollHandler | null,
            resizeListener: null as (() => void) | null,
            container: null as HTMLElement | null,
            styleElement: null as HTMLStyleElement | null,
            overlayEventListener: null as ((event: unknown) => void) | null,
            documentKeydownListener: null as ((event: KeyboardEvent) => void) | null,
            contentResizeObserver: null as ResizeObserver | null
        };
    },
    watch: {
        dismissable: {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.bindOutsideClickListener();
                } else {
                    this.unbindOutsideClickListener();
                }
            }
        }
    },
    beforeUnmount() {
        if (this.dismissable) {
            this.unbindOutsideClickListener();
        }

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        this.destroyStyle();
        this.unbindResizeListener();
        this.unbindContentResizeListener();
        this.target = null;

        if (this.container && this.autoZIndex) {
            ZIndex.clear(this.container);
        }

        if (this.overlayEventListener) {
            OverlayEventBus.off('overlay-click', this.overlayEventListener);
            this.overlayEventListener = null;
        }

        this.container = null;
    },
    mounted() {
        if (this.breakpoints) {
            this.createStyle();
        }
    },
    methods: {
        toggle(event: Event, target?: HTMLElement) {
            if (this.visible) this.hide();
            else this.show(event, target);
        },
        show(event: Event, target?: HTMLElement) {
            this.visible = true;
            this.eventTarget = event.currentTarget;
            this.target = target || (event.currentTarget as HTMLElement | null);
        },
        hide() {
            this.visible = false;
        },
        onContentClick() {
            this.selfClick = true;
        },
        onEnter(element: Element) {
            const el = element as HTMLElement;
            addStyle(el, { position: 'absolute', top: '0' });
            this.alignOverlay();

            if (this.dismissable) {
                this.bindOutsideClickListener();
            }

            this.bindScrollListener();
            this.bindResizeListener();

            if (this.autoZIndex) {
                ZIndex.set('overlay', el, this.baseZIndex || this.$primevue.config.zIndex!.overlay);
            }

            this.overlayEventListener = (e) => {
                if (this.container!.contains((e as { target: Node | null }).target)) {
                    this.selfClick = true;
                }
            };

            this.bindContentResizeListener();
            this.focus();
            OverlayEventBus.on('overlay-click', this.overlayEventListener);
            this.$emit('show');

            if (this.closeOnEscape) {
                this.bindDocumentKeyDownListener();
            }
        },
        onLeave() {
            this.unbindOutsideClickListener();
            this.unbindScrollListener();
            this.unbindResizeListener();
            this.unbindDocumentKeyDownListener();
            this.unbindContentResizeListener();
            if (this.overlayEventListener) {
                OverlayEventBus.off('overlay-click', this.overlayEventListener);
                this.overlayEventListener = null;
            }
            this.$emit('hide');
        },
        onAfterLeave(el: Element) {
            if (this.autoZIndex) {
                ZIndex.clear(el as HTMLElement);
            }
        },
        alignOverlay() {
            const container = this.container!;
            const target = this.target!;
            absolutePosition(container, target, false);

            const containerOffset = getOffset(container);
            const targetOffset = getOffset(target);
            let arrowLeft = 0;

            if (containerOffset.left < targetOffset.left) {
                arrowLeft = targetOffset.left - containerOffset.left;
            }

            container.style.setProperty($dt('popover.arrow.left').name, `${arrowLeft}px`);

            if (containerOffset.top < targetOffset.top) {
                container.setAttribute('data-p-popover-flipped', 'true');
                !this.isUnstyled && addClass(container, 'rs-popover-flipped');
            }
        },
        onContentKeydown(event: KeyboardEvent) {
            if (event.code === 'Escape' && this.closeOnEscape) {
                this.hide();
                focus(this.target!);
            }
        },
        onButtonKeydown(event: KeyboardEvent) {
            switch (event.code) {
                case 'ArrowDown':
                case 'ArrowUp':
                case 'ArrowLeft':
                case 'ArrowRight':
                    event.preventDefault();

                default:
                    break;
            }
        },
        focus() {
            let focusTarget = this.container!.querySelector<HTMLElement>('[autofocus]');

            if (focusTarget) {
                focusTarget.focus();
            }
        },
        onKeyDown(event: KeyboardEvent) {
            if (event.code === 'Escape' && this.closeOnEscape) {
                this.visible = false;
            }
        },
        bindDocumentKeyDownListener() {
            if (!this.documentKeydownListener) {
                this.documentKeydownListener = this.onKeyDown.bind(this);
                window.document.addEventListener('keydown', this.documentKeydownListener);
            }
        },
        unbindDocumentKeyDownListener() {
            if (this.documentKeydownListener) {
                window.document.removeEventListener('keydown', this.documentKeydownListener);
                this.documentKeydownListener = null;
            }
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener && isClient()) {
                this.outsideClickListener = (event) => {
                    if (this.visible && !this.selfClick && !this.isTargetClicked(event)) {
                        this.visible = false;
                    }

                    this.selfClick = false;
                };

                document.addEventListener('click', this.outsideClickListener);
            }
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener);
                this.outsideClickListener = null;
                this.selfClick = false;
            }
        },
        bindScrollListener() {
            if (!this.scrollHandler) {
                this.scrollHandler = markRaw(
                    new ConnectedOverlayScrollHandler(this.target!, () => {
                        if (this.visible) {
                            this.visible = false;
                        }
                    })
                );
            }

            this.scrollHandler.bindScrollListener();
        },
        unbindScrollListener() {
            if (this.scrollHandler) {
                this.scrollHandler.unbindScrollListener();
            }
        },
        bindResizeListener() {
            if (!this.resizeListener) {
                this.resizeListener = () => {
                    if (this.visible && !isTouchDevice()) {
                        this.visible = false;
                    }
                };

                window.addEventListener('resize', this.resizeListener);
            }
        },
        unbindResizeListener() {
            if (this.resizeListener) {
                window.removeEventListener('resize', this.resizeListener);
                this.resizeListener = null;
            }
        },
        bindContentResizeListener() {
            if (!this.contentResizeObserver) {
                this.contentResizeObserver = new ResizeObserver(() => {
                    if (this.visible) {
                        this.alignOverlay();
                    }
                });

                this.contentResizeObserver.observe(this.container!);
            }
        },
        unbindContentResizeListener() {
            if (this.contentResizeObserver) {
                this.contentResizeObserver.disconnect();
                this.contentResizeObserver = null;
            }
        },
        isTargetClicked(event: MouseEvent) {
            const origin = this.eventTarget as Node | null;
            const clicked = event.target as Node | null;
            return origin && (origin === clicked || origin.contains(clicked));
        },
        containerRef(el: Element | ComponentPublicInstance | null) {
            this.container = el as HTMLElement | null;
        },
        createStyle() {
            if (!this.styleElement && !this.isUnstyled) {
                this.styleElement = document.createElement('style');
                this.styleElement.type = 'text/css';
                setAttribute(this.styleElement, 'nonce', this.$primevue?.config?.csp?.nonce);
                document.head.appendChild(this.styleElement);

                let innerHTML = '';

                for (let breakpoint in this.breakpoints) {
                    innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .rs-popover[${this.$attrSelector}] {
                                width: ${this.breakpoints[breakpoint]} !important;
                            }
                        }
                    `;
                }

                this.styleElement.innerHTML = innerHTML;
            }
        },
        destroyStyle() {
            if (this.styleElement) {
                document.head.removeChild(this.styleElement);
                this.styleElement = null;
            }
        },
        onOverlayClick(event: MouseEvent) {
            OverlayEventBus.emit('overlay-click', {
                originalEvent: event,
                target: this.target
            });
        }
    },
    directives: {
        focustrap: FocusTrap,
        ripple: Ripple
    },
    components: {
        Portal
    }
});
</script>
