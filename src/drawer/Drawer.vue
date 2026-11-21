<template>
    <Portal>
        <div
            v-if="containerVisible"
            :ref="maskRef"
            @mousedown="onMaskClick"
            :class="cx('mask')"
            :style="sx('mask', true, { position, modal })"
            :data-p="dataP"
            v-bind="ptm('mask')"
        >
            <transition
                name="rs-drawer"
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
                    v-focustrap
                    :class="cx('root')"
                    :style="sx('root')"
                    :role="modal ? 'dialog' : 'complementary'"
                    :aria-modal="modal ? true : undefined"
                    :data-p="dataP"
                    :data-p-headless="$slots.container ? true : undefined"
                    v-bind="ptmi('root')"
                >
                    <slot v-if="$slots.container" name="container" :closeCallback="hide"></slot>
                    <template v-else>
                        <div :ref="headerContainerRef" :class="cx('header')" v-bind="ptm('header')">
                            <slot name="header" :class="cx('title')">
                                <div v-if="header" :class="cx('title')" v-bind="ptm('title')">{{ header }}</div>
                            </slot>
                            <slot v-if="showCloseIcon" name="closebutton" :closeCallback="hide">
                                <Button
                                    :ref="closeButtonRef"
                                    type="button"
                                    :class="cx('pcCloseButton')"
                                    :aria-label="closeAriaLabel"
                                    :unstyled="unstyled"
                                    @click="hide"
                                    v-bind="closeButtonProps"
                                    :pt="ptm('pcCloseButton')"
                                    data-pc-group-section="iconcontainer"
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
                        <div :ref="contentRef" :class="cx('content')" v-bind="ptm('content')">
                            <slot></slot>
                        </div>
                        <div v-if="$slots.footer" :ref="footerContainerRef" :class="cx('footer')" v-bind="ptm('footer')">
                            <slot name="footer"> </slot>
                        </div>
                    </template>
                </div>
            </transition>
        </div>
    </Portal>
</template>

<script lang="ts">
import { defineComponent, type ComponentPublicInstance } from 'vue';
import { cn } from '../internal/utils/index';
import { addClass, focus } from '../internal/utils/dom/index';
import { ZIndex } from '../internal/utils/zindex/index';
import TimesIcon from '../icons/times/TimesIcon.vue';
import Button from '../button/Button.vue';
import FocusTrap from '../focustrap/FocusTrap';
import Portal from '../portal/Portal.vue';
import { blockBodyScroll, unblockBodyScroll } from '../utils/Utils';
import BaseDrawer from './BaseDrawer.vue';

type DrawerRef = Element | ComponentPublicInstance | null;

export default defineComponent({
    name: 'Drawer',
    extends: BaseDrawer,
    inheritAttrs: false,
    emits: ['update:visible', 'show', 'after-show', 'hide', 'after-hide', 'before-hide'],
    data() {
        return {
            containerVisible: this.visible,
            container: null as HTMLElement | null,
            mask: null as HTMLElement | null,
            content: null as HTMLElement | null,
            headerContainer: null as HTMLElement | null,
            footerContainer: null as HTMLElement | null,
            closeButton: null as HTMLElement | null,
            outsideClickListener: null as ((event: MouseEvent) => void) | null,
            documentKeydownListener: null as ((event: KeyboardEvent) => void) | null
        };
    },
    watch: {
        dismissable(newValue) {
            if (newValue && !this.modal) {
                this.bindOutsideClickListener();
            } else {
                this.unbindOutsideClickListener();
            }
        }
    },
    updated() {
        if (this.visible) {
            this.containerVisible = this.visible;
        }
    },
    beforeUnmount() {
        this.unbindDocumentKeyDownListener();
        this.disableDocumentSettings();

        if (this.mask && this.autoZIndex) {
            ZIndex.clear(this.mask);
        }

        this.container = null;
        this.mask = null;
    },
    methods: {
        hide() {
            this.$emit('update:visible', false);
        },
        onEnter() {
            this.$emit('show');
            this.focus();
            this.bindDocumentKeyDownListener();

            if (this.autoZIndex && this.mask) {
                ZIndex.set('modal', this.mask, this.baseZIndex || this.$primevue?.config.zIndex?.modal);
            }
        },
        onAfterEnter() {
            this.enableDocumentSettings();
            this.$emit('after-show');
        },
        onBeforeLeave() {
            if (this.modal && !this.isUnstyled && this.mask) {
                addClass(this.mask, 'rs-overlay-mask-leave-active');
            }

            this.$emit('before-hide');
        },
        onLeave() {
            this.$emit('hide');
        },
        onAfterLeave() {
            if (this.autoZIndex && this.mask) {
                ZIndex.clear(this.mask);
            }

            this.unbindDocumentKeyDownListener();
            this.containerVisible = false;
            this.disableDocumentSettings();
            this.$emit('after-hide');
        },
        onMaskClick(event: MouseEvent) {
            if (this.dismissable && this.modal && this.mask === event.target) {
                this.hide();
            }
        },
        focus() {
            const autofocus = (container: HTMLElement | null) => container?.querySelector<HTMLElement>('[autofocus]');
            const focusTarget =
                (this.$slots.header && autofocus(this.headerContainer)) ||
                (this.$slots.default && autofocus(this.container)) ||
                (this.$slots.footer && autofocus(this.footerContainer)) ||
                this.closeButton;

            focusTarget && focus(focusTarget);
        },
        enableDocumentSettings() {
            if (this.dismissable && !this.modal) {
                this.bindOutsideClickListener();
            }

            if (this.blockScroll) {
                blockBodyScroll();
            }
        },
        disableDocumentSettings() {
            this.unbindOutsideClickListener();

            if (this.blockScroll) {
                unblockBodyScroll();
            }
        },
        onKeydown(event: KeyboardEvent) {
            if (event.code === 'Escape' && this.closeOnEscape) {
                this.hide();
            }
        },
        containerRef(el: DrawerRef) {
            this.container = el instanceof HTMLElement ? el : null;
        },
        maskRef(el: DrawerRef) {
            this.mask = el instanceof HTMLElement ? el : null;
        },
        contentRef(el: DrawerRef) {
            this.content = el instanceof HTMLElement ? el : null;
        },
        headerContainerRef(el: DrawerRef) {
            this.headerContainer = el instanceof HTMLElement ? el : null;
        },
        footerContainerRef(el: DrawerRef) {
            this.footerContainer = el instanceof HTMLElement ? el : null;
        },
        closeButtonRef(el: DrawerRef) {
            const button = el && !(el instanceof Element) ? el.$el : el;

            this.closeButton = button instanceof HTMLElement ? button : null;
        },
        bindDocumentKeyDownListener() {
            if (!this.documentKeydownListener) {
                this.documentKeydownListener = this.onKeydown;
                document.addEventListener('keydown', this.documentKeydownListener);
            }
        },
        unbindDocumentKeyDownListener() {
            if (this.documentKeydownListener) {
                document.removeEventListener('keydown', this.documentKeydownListener);
                this.documentKeydownListener = null;
            }
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hide();
                    }
                };

                document.addEventListener('click', this.outsideClickListener, true);
            }
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener, true);
                this.outsideClickListener = null;
            }
        },
        isOutsideClicked(event: MouseEvent) {
            return this.container && event.target instanceof Node && !this.container.contains(event.target);
        }
    },
    computed: {
        fullScreen() {
            return this.position === 'full';
        },
        closeAriaLabel() {
            return this.$primevue?.config.locale?.aria?.close;
        },
        dataP() {
            return cn({
                'full-screen': this.position === 'full',
                [this.position]: this.position,
                open: this.containerVisible,
                modal: this.modal
            });
        }
    },
    directives: {
        focustrap: FocusTrap
    },
    components: {
        Button,
        Portal,
        TimesIcon
    }
});
</script>
