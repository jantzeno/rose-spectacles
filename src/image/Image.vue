<template>
    <span :class="containerClass" :style="style" v-bind="ptmi('root')">
        <slot name="image" :errorCallback="onError">
            <img :style="imageStyle" :class="imageClass" @error="onError" v-bind="{ ...$attrs, ...ptm('image') }" />
        </slot>
        <button
            v-if="preview"
            ref="previewButton"
            :aria-label="zoomImageAriaLabel"
            type="button"
            :class="cx('previewMask')"
            @click="onImageClick"
            v-bind="{ ...previewButtonProps, ...ptm('previewMask') }"
        >
            <!-- TODO: indicator* deprecated since v4.0-->
            <slot :name="$slots.previewicon ? 'previewicon' : 'indicatoricon'">
                <component :is="previewIcon || indicatorIcon ? 'i' : 'EyeIcon'" :class="[cx('previewIcon'), previewIcon]" v-bind="ptm('previewIcon')" />
            </slot>
        </button>
        <Portal>
            <div
                v-if="maskVisible"
                :ref="maskRef"
                v-focustrap
                role="dialog"
                :class="cx('mask')"
                :aria-modal="maskVisible"
                @click="onMaskClick"
                @keydown="onMaskKeydown"
                v-bind="ptm('mask')"
            >
                <div :class="cx('toolbar')" v-bind="ptm('toolbar')">
                    <button
                        :class="cx('rotateRightButton')"
                        @click="rotateRight"
                        type="button"
                        :aria-label="rightAriaLabel"
                        v-bind="ptm('rotateRightButton')"
                        data-pc-group-section="action"
                    >
                        <slot name="refresh">
                            <RefreshIcon v-bind="ptm('rotateRightIcon')" />
                        </slot>
                    </button>

                    <button
                        :class="cx('rotateLeftButton')"
                        @click="rotateLeft"
                        type="button"
                        :aria-label="leftAriaLabel"
                        v-bind="ptm('rotateLeftButton')"
                        data-pc-group-section="action"
                    >
                        <slot name="undo">
                            <UndoIcon v-bind="ptm('rotateLeftIcon')" />
                        </slot>
                    </button>

                    <button
                        :class="cx('zoomOutButton')"
                        @click="zoomOut"
                        type="button"
                        :disabled="isZoomOutDisabled"
                        :aria-label="zoomOutAriaLabel"
                        v-bind="ptm('zoomOutButton')"
                        data-pc-group-section="action"
                    >
                        <slot name="zoomout">
                            <SearchMinusIcon v-bind="ptm('zoomOutIcon')" />
                        </slot>
                    </button>

                    <button
                        :class="cx('zoomInButton')"
                        @click="zoomIn"
                        type="button"
                        :disabled="isZoomInDisabled"
                        :aria-label="zoomInAriaLabel"
                        v-bind="ptm('zoomInButton')"
                        data-pc-group-section="action"
                    >
                        <slot name="zoomin">
                            <SearchPlusIcon v-bind="ptm('zoomInIcon')" />
                        </slot>
                    </button>

                    <button
                        :class="cx('closeButton')"
                        type="button"
                        @click="hidePreview"
                        :aria-label="closeAriaLabel"
                        autofocus
                        v-bind="ptm('closeButton')"
                        data-pc-group-section="action"
                    >
                        <slot name="close">
                            <TimesIcon v-bind="ptm('closeIcon')" />
                        </slot>
                    </button>
                </div>
                <transition
                    name="rs-image-original"
                    @before-enter="onBeforeEnter"
                    @enter="onEnter"
                    @leave="onLeave"
                    @before-leave="onBeforeLeave"
                    @after-leave="onAfterLeave"
                    v-bind="ptm('transition')"
                >
                    <div v-if="previewVisible" v-bind="ptm('originalContainer')">
                        <!-- TODO: preview deprecated since v4.0-->
                        <slot
                            :name="$slots.original ? 'original' : 'preview'"
                            :class="cx('original')"
                            :style="imagePreviewStyle"
                            :previewCallback="onPreviewImageClick"
                        >
                            <img
                                :src="$attrs.src as string | undefined"
                                :class="cx('original')"
                                :style="imagePreviewStyle"
                                @click="onPreviewImageClick"
                                v-bind="ptm('original')"
                            />
                        </slot>
                    </div>
                </transition>
            </div>
        </Portal>
    </span>
</template>

<script lang="ts">
import { defineComponent, type ComponentPublicInstance } from 'vue';
import { addClass, focus, isAttributeEquals } from '../internal/utils/dom/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { EyeIcon, RefreshIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, UndoIcon } from '../internal/lucide';
import FocusTrap from '../focustrap/FocusTrap';
import Portal from '../portal/Portal.vue';
import { blockBodyScroll, unblockBodyScroll } from '../utils/Utils';
import BaseImage from './BaseImage.vue';

export default defineComponent({
    name: 'Image',
    extends: BaseImage,
    inheritAttrs: false,
    emits: ['show', 'hide', 'error'],
    data() {
        return {
            maskVisible: false,
            mask: null as HTMLElement | null,
            previewClick: false,
            previewVisible: false,
            previewTimer: undefined as ReturnType<typeof setTimeout> | undefined,
            scrollLocked: false,
            rotate: 0,
            scale: 1
        };
    },
    beforeUnmount() {
        clearTimeout(this.previewTimer);
        this.releaseScrollLock();

        if (this.mask) {
            ZIndex.clear(this.mask);
        }
    },
    methods: {
        maskRef(el: Element | ComponentPublicInstance | null) {
            this.mask = el as HTMLElement | null;
        },
        onImageClick() {
            if (this.preview) {
                if (!this.scrollLocked) {
                    blockBodyScroll();
                    this.scrollLocked = true;
                }

                this.maskVisible = true;
                clearTimeout(this.previewTimer);
                this.previewTimer = setTimeout(() => {
                    this.previewTimer = undefined;
                    this.previewVisible = true;
                }, 25);
            }
        },
        onPreviewImageClick() {
            this.previewClick = true;
        },
        onMaskClick(event: MouseEvent) {
            const target = event.target as Element;
            const isBarActionsClicked = isAttributeEquals(target, 'data-pc-section-group', 'action') || target.closest('[data-pc-section-group="action"]');

            if (!this.previewClick && !isBarActionsClicked) {
                this.previewVisible = false;
                this.rotate = 0;
                this.scale = 1;
            }

            this.previewClick = false;
        },
        onMaskKeydown(event: KeyboardEvent) {
            switch (event.code) {
                case 'Escape':
                    this.hidePreview();
                    setTimeout(() => {
                        focus(this.$refs.previewButton as HTMLElement);
                    }, 200);
                    event.preventDefault();

                    break;

                default:
                    break;
            }
        },
        onError() {
            this.$emit('error');
        },
        rotateRight() {
            this.rotate += 90;
            this.previewClick = true;
        },
        rotateLeft() {
            this.rotate -= 90;
            this.previewClick = true;
        },
        zoomIn() {
            this.scale = this.scale + 0.1;
            this.previewClick = true;
        },
        zoomOut() {
            this.scale = this.scale - 0.1;
            this.previewClick = true;
        },
        onBeforeEnter() {
            ZIndex.set('modal', this.mask!, this.$primevue.config.zIndex!.modal);
        },
        onEnter() {
            this.focus();
            this.$emit('show');
        },
        onBeforeLeave() {
            !this.isUnstyled && addClass(this.mask!, 'rs-overlay-mask-leave-active');
        },
        onLeave() {
            this.releaseScrollLock();
            this.$emit('hide');
        },
        onAfterLeave(el: Element) {
            ZIndex.clear(el as HTMLElement);
            this.maskVisible = false;
        },
        focus() {
            let focusTarget = this.mask?.querySelector<HTMLElement>('[autofocus]');

            if (focusTarget) {
                focusTarget.focus();
            }
        },
        hidePreview() {
            this.previewVisible = false;
            this.rotate = 0;
            this.scale = 1;
            this.releaseScrollLock();
        },
        releaseScrollLock() {
            if (this.scrollLocked) {
                unblockBodyScroll();
                this.scrollLocked = false;
            }
        }
    },
    computed: {
        containerClass() {
            return [this.cx('root'), this.class];
        },
        rotateClass() {
            return 'rs-image-preview-rotate-' + this.rotate;
        },
        imagePreviewStyle() {
            return { transform: 'rotate(' + this.rotate + 'deg) scale(' + this.scale + ')' };
        },
        isZoomInDisabled() {
            return this.zoomInDisabled || this.scale >= 1.5;
        },
        isZoomOutDisabled() {
            return this.zoomOutDisabled || this.scale <= 0.5;
        },
        rightAriaLabel() {
            return this.$primevue.config.locale?.aria?.rotateRight;
        },
        leftAriaLabel() {
            return this.$primevue.config.locale?.aria?.rotateLeft;
        },
        zoomInAriaLabel() {
            return this.$primevue.config.locale?.aria?.zoomIn;
        },
        zoomOutAriaLabel() {
            return this.$primevue.config.locale?.aria?.zoomOut;
        },
        zoomImageAriaLabel() {
            return this.$primevue.config.locale?.aria?.zoomImage;
        },
        closeAriaLabel() {
            return this.$primevue.config.locale?.aria?.close;
        }
    },
    components: {
        Portal: Portal,
        EyeIcon: EyeIcon,
        RefreshIcon: RefreshIcon,
        UndoIcon: UndoIcon,
        SearchMinusIcon: SearchMinusIcon,
        SearchPlusIcon: SearchPlusIcon,
        TimesIcon: TimesIcon
    },
    directives: {
        focustrap: FocusTrap
    }
});
</script>
