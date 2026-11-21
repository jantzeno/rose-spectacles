<template>
    <Portal v-if="fullScreen">
        <div
            v-if="containerVisible"
            :ref="maskRef"
            :class="[cx('mask'), maskClass]"
            role="dialog"
            :aria-modal="fullScreen ? 'true' : undefined"
            v-bind="ptm('mask')"
        >
            <transition
                name="rs-galleria"
                @before-enter="onBeforeEnter"
                @enter="onEnter"
                @before-leave="onBeforeLeave"
                @leave="onLeave"
                @after-leave="onAfterLeave"
                appear
                v-bind="ptm('transition')"
            >
                <GalleriaContent
                    v-if="visible"
                    :ref="containerRef"
                    v-focustrap
                    @mask-hide="maskHide"
                    :templates="$slots"
                    @activeitem-change="onActiveItemChange"
                    :pt="pt"
                    :unstyled="unstyled"
                    v-bind="$props"
                />
            </transition>
        </div>
    </Portal>
    <GalleriaContent v-else :templates="$slots" @activeitem-change="onActiveItemChange" :pt="pt" :unstyled="unstyled" v-bind="$props" />
</template>

<script lang="ts">
import { defineComponent, type ComponentPublicInstance } from 'vue';
import { addClass, focus } from '../internal/utils/dom/index';
import { ZIndex } from '../internal/utils/zindex/index';
import FocusTrap from '../focustrap/FocusTrap';
import Portal from '../portal/Portal.vue';
import { blockBodyScroll, unblockBodyScroll } from '../utils/Utils';
import BaseGalleria from './BaseGalleria.vue';
import GalleriaContent from './GalleriaContent.vue';

export default defineComponent({
    name: 'Galleria',
    extends: BaseGalleria,
    inheritAttrs: false,
    emits: ['update:activeIndex', 'update:visible'],
    data() {
        return {
            containerVisible: this.visible,
            target: null as HTMLElement | null,
            container: null as HTMLElement | null,
            mask: null as HTMLElement | null,
            documentKeydownListener: null as ((event: KeyboardEvent) => void) | null
        };
    },
    updated() {
        if (this.fullScreen && this.visible) {
            this.containerVisible = this.visible;
        }
    },
    beforeUnmount() {
        if (this.fullScreen) {
            unblockBodyScroll();
        }

        this.mask = null;

        if (this.container) {
            ZIndex.clear(this.container);
            this.container = null;
        }
    },
    methods: {
        onBeforeEnter(el: Element) {
            if (el instanceof HTMLElement) ZIndex.set('modal', el, this.baseZIndex || this.$primevue?.config.zIndex?.modal);
        },
        onEnter(el: Element) {
            if (document.activeElement instanceof HTMLElement) this.target = document.activeElement;
            if (this.mask && el instanceof HTMLElement) this.mask.style.zIndex = String(parseInt(el.style.zIndex, 10) - 1);

            blockBodyScroll();
            this.focus();
            this.bindGlobalListeners();
        },
        onBeforeLeave() {
            if (!this.isUnstyled && this.mask) addClass(this.mask, 'rs-overlay-mask-leave-active');
        },
        onLeave() {
            if (this.target) focus(this.target);
            this.target = null;
        },
        onAfterLeave(el: Element) {
            if (el instanceof HTMLElement) ZIndex.clear(el);
            this.containerVisible = false;
            unblockBodyScroll();
            this.unbindGlobalListeners();
        },
        onActiveItemChange(index: number) {
            if (this.activeIndex !== index) {
                this.$emit('update:activeIndex', index);
            }
        },
        maskHide() {
            this.$emit('update:visible', false);
        },
        containerRef(el: Element | ComponentPublicInstance | null) {
            const root = el && !(el instanceof Element) ? el.$el : el;

            this.container = root instanceof HTMLElement ? root : null;
        },
        maskRef(el: Element | ComponentPublicInstance | null) {
            this.mask = el instanceof HTMLElement ? el : null;
        },
        onKeyDown(event: KeyboardEvent) {
            if (event.code === 'Escape') {
                this.maskHide();
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
        bindGlobalListeners() {
            if (this.fullScreen) {
                this.bindDocumentKeyDownListener();
            }
        },
        unbindGlobalListeners() {
            if (this.fullScreen) {
                this.unbindDocumentKeyDownListener();
            }
        },
        focus() {
            const focusTarget = this.container?.querySelector<HTMLElement>('[autofocus]');

            if (focusTarget) {
                focusTarget.focus();
            }
        }
    },
    components: {
        GalleriaContent: GalleriaContent,
        Portal: Portal
    },
    directives: {
        focustrap: FocusTrap
    }
});
</script>
