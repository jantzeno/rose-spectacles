<template>
    <Portal :appendTo="appendTo">
        <div
            v-if="containerVisible"
            :ref="maskRef"
            :class="cx('mask')"
            :style="sx('mask', true, { position, modal })"
            @mousedown="onMaskMouseDown"
            @mouseup="onMaskMouseUp"
            :data-p="dataP"
            v-bind="ptm('mask')"
        >
            <transition
                name="rs-dialog"
                @enter="onEnter"
                @after-enter="onAfterEnter"
                @before-leave="onBeforeLeave"
                @leave="onLeave"
                @after-leave="onAfterLeave"
                appear
                v-bind="ptm('transition')"
            >
                <div
                    v-if="visible"
                    :ref="containerRef"
                    v-focustrap="{ disabled: !modal }"
                    :class="cx('root')"
                    :style="sx('root')"
                    role="dialog"
                    :aria-labelledby="ariaLabelledById"
                    :aria-modal="modal"
                    :data-p="dataP"
                    v-bind="ptmi('root')"
                >
                    <slot v-if="$slots.container" name="container" :closeCallback="close" :maximizeCallback="maximize" :initDragCallback="initDrag"></slot>
                    <template v-else>
                        <div v-if="showHeader" :ref="headerContainerRef" :class="cx('header')" @mousedown="initDrag" v-bind="ptm('header')">
                            <slot name="header" :class="cx('title')">
                                <span v-if="header" :id="ariaLabelledById" :class="cx('title')" v-bind="ptm('title')">{{ header }}</span>
                            </slot>
                            <div :class="cx('headerActions')" v-bind="ptm('headerActions')">
                                <slot v-if="maximizable" name="maximizebutton" :maximized="maximized" :maximizeCallback="maximize">
                                    <Button
                                        :ref="maximizableRef"
                                        :autofocus="focusableMax"
                                        :class="cx('pcMaximizeButton')"
                                        @click="maximize"
                                        :tabindex="maximizable ? '0' : '-1'"
                                        :unstyled="unstyled"
                                        v-bind="maximizeButtonProps"
                                        :pt="ptm('pcMaximizeButton')"
                                        data-pc-group-section="headericon"
                                    >
                                        <template #icon="slotProps">
                                            <slot name="maximizeicon" :maximized="maximized">
                                                <component
                                                    :is="maximizeIconComponent"
                                                    :class="[slotProps.class, maximized ? minimizeIcon : maximizeIcon]"
                                                    v-bind="ptm('pcMaximizeButton')['icon']"
                                                />
                                            </slot>
                                        </template>
                                    </Button>
                                </slot>
                                <slot v-if="closable" name="closebutton" :closeCallback="close">
                                    <Button
                                        :ref="closeButtonRef"
                                        :autofocus="focusableClose"
                                        :class="cx('pcCloseButton')"
                                        @click="close"
                                        :aria-label="closeAriaLabel"
                                        :unstyled="unstyled"
                                        v-bind="closeButtonProps"
                                        :pt="ptm('pcCloseButton')"
                                        data-pc-group-section="headericon"
                                    >
                                        <template #icon="slotProps">
                                            <slot name="closeicon">
                                                <component
                                                    :is="closeIcon ? 'span' : 'TimesIcon'"
                                                    :class="[closeIcon, slotProps.class]"
                                                    v-bind="ptm('pcCloseButton')['icon']"
                                                ></component>
                                            </slot>
                                        </template>
                                    </Button>
                                </slot>
                            </div>
                        </div>
                        <div
                            :ref="contentRef"
                            :class="[cx('content'), contentClass]"
                            :style="contentStyle"
                            :data-p="dataP"
                            v-bind="{ ...contentProps, ...ptm('content') }"
                        >
                            <slot></slot>
                        </div>
                        <div v-if="footer || $slots.footer" :ref="footerContainerRef" :class="cx('footer')" v-bind="ptm('footer')">
                            <slot name="footer">{{ footer }}</slot>
                        </div>
                    </template>
                </div>
            </transition>
        </div>
    </Portal>
</template>

<script lang="ts">
import { cn } from '../internal/utils/index';
import { addClass, addStyle, focus, getOuterHeight, getOuterWidth, getViewport, setAttribute } from '../internal/utils/dom/index';
import { ZIndex } from '../internal/utils/zindex/index';
import TimesIcon from '../icons/times/TimesIcon.vue';
import WindowMaximizeIcon from '../icons/windowmaximize/WindowMaximizeIcon.vue';
import WindowMinimizeIcon from '../icons/windowminimize/WindowMinimizeIcon.vue';
import Button from '../button/Button.vue';
import FocusTrap from '../focustrap/FocusTrap';
import Portal from '../portal/Portal.vue';
import Ripple from '../ripple/Ripple';
import { lockBodyScroll } from '../utils/BodyScrollLock';
import { computed, defineComponent, type ComponentPublicInstance } from 'vue';
import BaseDialog from './BaseDialog.vue';

type DialogRef = Element | ComponentPublicInstance | null;

const activeDialogs = new Set<() => void>();

function onDocumentKeyDown(event: KeyboardEvent) {
    if (event.code === 'Escape' && !event.defaultPrevented && !event.isComposing) {
        Array.from(activeDialogs).at(-1)?.();
    }
}

export default defineComponent({
    name: 'Dialog',
    extends: BaseDialog,
    inheritAttrs: false,
    emits: ['update:visible', 'show', 'hide', 'after-hide', 'maximize', 'unmaximize', 'dragstart', 'dragend'],
    provide() {
        return {
            dialogRef: computed(() => this._instance)
        };
    },
    data() {
        return {
            containerVisible: this.visible,
            maximized: false,
            focusableMax: undefined as boolean | undefined,
            focusableClose: undefined as boolean | undefined,
            target: null as HTMLElement | null,
            releaseBodyScroll: null as (() => void) | null,
            container: null as HTMLElement | null,
            mask: null as HTMLElement | null,
            content: null as HTMLElement | null,
            headerContainer: null as HTMLElement | null,
            footerContainer: null as HTMLElement | null,
            maximizableButton: null as HTMLElement | null,
            closeButton: null as HTMLElement | null,
            styleElement: null as HTMLStyleElement | null,
            dragging: false,
            documentDragListener: null as ((event: MouseEvent) => void) | null,
            documentDragEndListener: null as ((event: MouseEvent) => void) | null,
            lastPageX: 0,
            lastPageY: 0,
            maskMouseDownTarget: null as EventTarget | null
        };
    },
    updated() {
        if (this.visible) {
            this.containerVisible = this.visible;
        }
    },
    beforeUnmount() {
        this.endDrag();
        this.unbindDocumentState();
        this.unbindGlobalListeners();
        this.destroyStyle();

        if (this.mask && this.autoZIndex) {
            ZIndex.clear(this.mask);
        }

        this.container = null;
        this.mask = null;
    },
    mounted() {
        if (this.breakpoints) {
            this.createStyle();
        }
    },
    methods: {
        close() {
            this.$emit('update:visible', false);
        },
        onEnter() {
            this.$emit('show');
            this.target = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            this.enableDocumentSettings();
            this.bindGlobalListeners();

            if (this.autoZIndex && this.mask) {
                ZIndex.set('modal', this.mask, this.baseZIndex || this.$primevue.config.zIndex?.modal);
            }
        },
        onAfterEnter() {
            this.focus();
        },
        onBeforeLeave() {
            if (this.modal && this.mask) {
                !this.isUnstyled && addClass(this.mask, 'rs-overlay-mask-leave-active');
            }

            this.endDrag();
        },
        onLeave() {
            this.$emit('hide');
            if (this.target) focus(this.target);
            this.target = null;
            this.focusableClose = undefined;
            this.focusableMax = undefined;
        },
        onAfterLeave() {
            if (this.autoZIndex && this.mask) {
                ZIndex.clear(this.mask);
            }

            this.containerVisible = false;
            this.unbindDocumentState();
            this.unbindGlobalListeners();
            this.$emit('after-hide');
        },
        onMaskMouseDown(event: MouseEvent) {
            this.maskMouseDownTarget = event.target;
        },
        onMaskMouseUp() {
            if (this.dismissableMask && this.modal && this.mask === this.maskMouseDownTarget) {
                this.close();
            }
        },
        focus() {
            const findFocusableElement = (container: HTMLElement | null) => container?.querySelector<HTMLElement>('[autofocus]');

            let focusTarget = this.$slots.footer && findFocusableElement(this.footerContainer);

            if (!focusTarget) {
                focusTarget = this.$slots.header && findFocusableElement(this.headerContainer);

                if (!focusTarget) {
                    focusTarget = this.$slots.default && findFocusableElement(this.content);

                    if (!focusTarget) {
                        if (this.maximizable) {
                            this.focusableMax = true;
                            focusTarget = this.maximizableButton;
                        } else {
                            this.focusableClose = true;
                            focusTarget = this.closeButton;
                        }
                    }
                }
            }

            if (focusTarget) {
                focus(focusTarget, { focusVisible: true } as FocusOptions);
            }
        },
        maximize(event?: MouseEvent) {
            if (this.maximized) {
                this.maximized = false;
                this.$emit('unmaximize', event);
            } else {
                this.maximized = true;
                this.$emit('maximize', event);
            }

            if (!this.modal) {
                this.enableDocumentSettings();
            }
        },
        enableDocumentSettings() {
            if (this.modal || this.blockScroll || (this.maximizable && this.maximized)) {
                this.releaseBodyScroll ??= lockBodyScroll();
            } else {
                this.unbindDocumentState();
            }
        },
        unbindDocumentState() {
            this.releaseBodyScroll?.();
            this.releaseBodyScroll = null;
        },
        onEscape() {
            if (this.visible && this.closeOnEscape) {
                this.close();
            }
        },
        bindDocumentKeyDownListener() {
            if (!activeDialogs.size) {
                document.addEventListener('keydown', onDocumentKeyDown);
            }

            activeDialogs.add(this.onEscape);
        },
        unbindDocumentKeyDownListener() {
            if (activeDialogs.delete(this.onEscape) && !activeDialogs.size) {
                document.removeEventListener('keydown', onDocumentKeyDown);
            }
        },
        containerRef(el: DialogRef) {
            this.container = el instanceof HTMLElement ? el : null;
        },
        maskRef(el: DialogRef) {
            this.mask = el instanceof HTMLElement ? el : null;
        },
        contentRef(el: DialogRef) {
            this.content = el instanceof HTMLElement ? el : null;
        },
        headerContainerRef(el: DialogRef) {
            this.headerContainer = el instanceof HTMLElement ? el : null;
        },
        footerContainerRef(el: DialogRef) {
            this.footerContainer = el instanceof HTMLElement ? el : null;
        },
        maximizableRef(el: DialogRef) {
            const root = el && !(el instanceof Element) ? el.$el : el;
            this.maximizableButton = root instanceof HTMLElement ? root : null;
        },
        closeButtonRef(el: DialogRef) {
            const root = el && !(el instanceof Element) ? el.$el : el;
            this.closeButton = root instanceof HTMLElement ? root : null;
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
                            .rs-dialog[${this.$attrSelector}] {
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
        initDrag(event: MouseEvent) {
            if (event.target instanceof Element && event.target.closest('div')?.getAttribute('data-pc-section') === 'headeractions') {
                return;
            }

            if (this.draggable && this.container) {
                this.dragging = true;
                this.lastPageX = event.pageX;
                this.lastPageY = event.pageY;

                this.container.style.margin = '0';
                document.body.setAttribute('data-p-unselectable-text', 'true');
                !this.isUnstyled && addStyle(document.body, { 'user-select': 'none' });

                this.$emit('dragstart', event);
            }
        },
        bindGlobalListeners() {
            if (this.draggable) {
                this.bindDocumentDragListener();
                this.bindDocumentDragEndListener();
            }

            this.bindDocumentKeyDownListener();
        },
        unbindGlobalListeners() {
            this.unbindDocumentDragListener();
            this.unbindDocumentDragEndListener();
            this.unbindDocumentKeyDownListener();
        },
        bindDocumentDragListener() {
            this.documentDragListener = (event) => {
                if (this.dragging && this.container) {
                    let width = getOuterWidth(this.container);
                    let height = getOuterHeight(this.container);
                    let deltaX = event.pageX - this.lastPageX;
                    let deltaY = event.pageY - this.lastPageY;
                    let offset = this.container.getBoundingClientRect();
                    let leftPos = offset.left + deltaX;
                    let topPos = offset.top + deltaY;
                    let viewport = getViewport();
                    let containerComputedStyle = getComputedStyle(this.container);
                    let marginLeft = parseFloat(containerComputedStyle.marginLeft);
                    let marginTop = parseFloat(containerComputedStyle.marginTop);

                    this.container.style.position = 'fixed';

                    if (this.keepInViewport) {
                        if (leftPos >= this.minX && leftPos + width < viewport.width) {
                            this.lastPageX = event.pageX;
                            this.container.style.left = leftPos - marginLeft + 'px';
                        }

                        if (topPos >= this.minY && topPos + height < viewport.height) {
                            this.lastPageY = event.pageY;
                            this.container.style.top = topPos - marginTop + 'px';
                        }
                    } else {
                        this.lastPageX = event.pageX;
                        this.container.style.left = leftPos - marginLeft + 'px';
                        this.lastPageY = event.pageY;
                        this.container.style.top = topPos - marginTop + 'px';
                    }
                }
            };

            window.document.addEventListener('mousemove', this.documentDragListener);
        },
        unbindDocumentDragListener() {
            if (this.documentDragListener) {
                window.document.removeEventListener('mousemove', this.documentDragListener);
                this.documentDragListener = null;
            }
        },
        bindDocumentDragEndListener() {
            this.documentDragEndListener = this.endDrag;
            window.document.addEventListener('mouseup', this.documentDragEndListener);
        },
        endDrag(event?: MouseEvent) {
            if (this.dragging) {
                this.dragging = false;
                document.body.removeAttribute('data-p-unselectable-text');
                if (!this.isUnstyled) document.body.style.userSelect = '';

                this.$emit('dragend', event);
            }
        },
        unbindDocumentDragEndListener() {
            if (this.documentDragEndListener) {
                window.document.removeEventListener('mouseup', this.documentDragEndListener);
                this.documentDragEndListener = null;
            }
        }
    },
    computed: {
        maximizeIconComponent() {
            return this.maximized ? (this.minimizeIcon ? 'span' : 'WindowMinimizeIcon') : this.maximizeIcon ? 'span' : 'WindowMaximizeIcon';
        },
        ariaLabelledById() {
            return this.header != null || this.$attrs['aria-labelledby'] !== null ? this.$id + '_header' : undefined;
        },
        closeAriaLabel() {
            return this.$primevue?.config.locale?.aria?.close;
        },
        dataP() {
            return cn({
                maximized: this.maximized,
                modal: this.modal
            });
        }
    },
    directives: {
        ripple: Ripple,
        focustrap: FocusTrap
    },
    components: {
        Button,
        Portal,
        WindowMinimizeIcon,
        WindowMaximizeIcon,
        TimesIcon
    }
});
</script>
