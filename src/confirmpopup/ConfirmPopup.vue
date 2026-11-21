<template>
    <Portal>
        <transition
            name="rs-anchored-overlay"
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @leave="onLeave"
            @after-leave="onAfterLeave"
            v-bind="ptm('transition')"
        >
            <div
                v-if="visible"
                :ref="containerRef"
                v-focustrap
                role="alertdialog"
                :class="cx('root')"
                :aria-modal="visible"
                @click="onOverlayClick"
                @keydown="onOverlayKeydown"
                v-bind="ptmi('root')"
            >
                <slot v-if="$slots.container" name="container" :message="confirmation" :acceptCallback="accept" :rejectCallback="reject"></slot>
                <template v-else>
                    <template v-if="!$slots.message">
                        <div :class="cx('content')" v-bind="ptm('content')">
                            <slot name="icon">
                                <component v-if="$slots.icon" :is="$slots.icon" :class="cx('icon')" />
                                <span v-else-if="confirmation?.icon" :class="[confirmation?.icon, cx('icon')]" v-bind="ptm('icon')" />
                            </slot>
                            <span :class="cx('message')" v-bind="ptm('message')">{{ confirmation?.message }}</span>
                        </div>
                    </template>
                    <component v-else :is="$slots.message" :message="confirmation"></component>
                    <div :class="cx('footer')" v-bind="ptm('footer')">
                        <Button
                            :class="[cx('pcRejectButton'), confirmation?.rejectClass]"
                            :autofocus="autoFocusReject ?? undefined"
                            :unstyled="unstyled"
                            :size="confirmation?.rejectProps?.size || 'small'"
                            :text="confirmation?.rejectProps?.text || false"
                            @click="reject()"
                            @keydown="onRejectKeydown"
                            v-bind="confirmation?.rejectProps"
                            :label="rejectLabel"
                            :pt="ptm('pcRejectButton')"
                        >
                            <template v-if="rejectIcon || $slots.rejecticon" #icon="iconProps">
                                <slot name="rejecticon">
                                    <span :class="[rejectIcon, iconProps.class]" v-bind="ptm('pcRejectButton')['icon']" data-pc-section="rejectbuttonicon" />
                                </slot>
                            </template>
                        </Button>
                        <Button
                            :class="[cx('pcAcceptButton'), confirmation?.acceptClass]"
                            :autofocus="autoFocusAccept ?? undefined"
                            :unstyled="unstyled"
                            :size="confirmation?.acceptProps?.size || 'small'"
                            @click="accept()"
                            @keydown="onAcceptKeydown"
                            v-bind="confirmation?.acceptProps"
                            :label="acceptLabel"
                            :pt="ptm('pcAcceptButton')"
                        >
                            <template v-if="acceptIcon || $slots.accepticon" #icon="iconProps">
                                <slot name="accepticon">
                                    <span :class="[acceptIcon, iconProps.class]" v-bind="ptm('pcAcceptButton')['icon']" data-pc-section="acceptbuttonicon" />
                                </slot>
                            </template>
                        </Button>
                    </div>
                </template>
            </div>
        </transition>
    </Portal>
</template>

<script lang="ts">
import type { ConfirmationRenderOptions } from '../confirmationoptions/render-options';
import { defineComponent, markRaw, type ComponentPublicInstance } from 'vue';
import { $dt } from '../internal/styled/index';
import { absolutePosition, addClass, focus, getOffset, isTouchDevice } from '../internal/utils/dom/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { ConnectedOverlayScrollHandler } from '../core/utils/Utils';
import Button from '../button/Button.vue';
import ConfirmationEventBus from '../confirmationeventbus/ConfirmationEventBus';
import FocusTrap from '../focustrap/FocusTrap';
import OverlayEventBus from '../overlayeventbus/OverlayEventBus';
import Portal from '../portal/Portal.vue';
import BaseConfirmPopup from './BaseConfirmPopup.vue';

export default defineComponent({
    name: 'ConfirmPopup',
    extends: BaseConfirmPopup,
    inheritAttrs: false,
    data() {
        return {
            visible: false,
            confirmation: null as ConfirmationRenderOptions | null,
            autoFocusAccept: null as boolean | null,
            autoFocusReject: null as boolean | null,
            target: null as HTMLElement | null | undefined,
            outsideClickListener: null as ((event: MouseEvent) => void) | null,
            scrollHandler: null as ConnectedOverlayScrollHandler | null,
            resizeListener: null as (() => void) | null,
            container: null as HTMLElement | null
        };
    },
    mounted() {
        ConfirmationEventBus.on('confirm', this.onConfirm);
        ConfirmationEventBus.on('close', this.closeConfirmation);
    },
    beforeUnmount() {
        ConfirmationEventBus.off('confirm', this.onConfirm);
        ConfirmationEventBus.off('close', this.closeConfirmation);

        this.unbindOutsideClickListener();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        this.unbindResizeListener();

        if (this.container) {
            ZIndex.clear(this.container);
            this.container = null;
        }

        this.target = null;
        this.confirmation = null;
    },
    methods: {
        onConfirm(event: unknown) {
            const options = event as ConfirmationRenderOptions | undefined;

            if (options && options.group === this.group) {
                this.confirmation = options;
                this.target = options.target;
                this.confirmation.onShow?.();
                this.visible = true;
            }
        },
        closeConfirmation() {
            this.visible = false;
            this.confirmation = null;
        },
        accept() {
            this.confirmation?.accept?.();

            this.visible = false;
        },
        reject() {
            this.confirmation?.reject?.();

            this.visible = false;
        },
        onHide() {
            this.confirmation?.onHide?.();

            this.visible = false;
        },
        onAcceptKeydown(event: KeyboardEvent) {
            if (event.code === 'Space' || event.code === 'Enter' || event.code === 'NumpadEnter') {
                this.accept();
                focus(this.target!);
                event.preventDefault();
            }
        },
        onRejectKeydown(event: KeyboardEvent) {
            if (event.code === 'Space' || event.code === 'Enter' || event.code === 'NumpadEnter') {
                this.reject();
                focus(this.target!);
                event.preventDefault();
            }
        },
        onEnter(el: Element) {
            this.autoFocusAccept = this.confirmation?.defaultFocus === undefined || this.confirmation?.defaultFocus === 'accept' ? true : false;
            this.autoFocusReject = this.confirmation?.defaultFocus === 'reject' ? true : false;

            this.target = this.target || (document.activeElement as HTMLElement | null);

            this.bindOutsideClickListener();
            this.bindScrollListener();
            this.bindResizeListener();

            ZIndex.set('overlay', el as HTMLElement, this.$primevue.config.zIndex!.overlay);
        },
        onAfterEnter() {
            this.focus();
        },
        onLeave() {
            this.autoFocusAccept = null;
            this.autoFocusReject = null;

            focus(this.target!);
            this.target = null;

            this.unbindOutsideClickListener();
            this.unbindScrollListener();
            this.unbindResizeListener();
        },
        onAfterLeave(el: Element) {
            ZIndex.clear(el as HTMLElement);
        },
        alignOverlay() {
            const { container, target } = this;
            if (!container || !target) return;

            absolutePosition(container, target, false);

            const containerOffset = getOffset(container);
            const targetOffset = getOffset(target);
            let arrowLeft = 0;

            if (containerOffset.left < targetOffset.left) {
                arrowLeft = targetOffset.left - containerOffset.left;
            }

            container.style.setProperty($dt('confirmpopup.arrow.left').name, `${arrowLeft}px`);

            if (containerOffset.top < targetOffset.top) {
                container.setAttribute('data-p-confirmpopup-flipped', 'true');
                !this.isUnstyled && addClass(container, 'rs-confirmpopup-flipped');
            }
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.visible && this.container && !this.container.contains(event.target as Node | null) && !this.isTargetClicked(event)) {
                        this.confirmation?.onHide?.();

                        this.visible = false;
                    } else {
                        this.alignOverlay();
                    }
                };

                document.addEventListener('click', this.outsideClickListener);
            }
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener);
                this.outsideClickListener = null;
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
        focus() {
            let focusTarget = this.container?.querySelector<HTMLElement>('[autofocus]');

            if (focusTarget) {
                focusTarget.focus({ preventScroll: true }); // Firefox requires preventScroll
            }
        },
        isTargetClicked(event: MouseEvent) {
            return this.target && (this.target === event.target || this.target.contains(event.target as Node | null));
        },
        containerRef(el: Element | ComponentPublicInstance | null) {
            this.container = el as HTMLElement | null;
        },
        onOverlayClick(event: MouseEvent) {
            OverlayEventBus.emit('overlay-click', {
                originalEvent: event,
                target: this.target
            });
        },
        onOverlayKeydown(event: KeyboardEvent) {
            if (event.code === 'Escape') {
                ConfirmationEventBus.emit('close', this.closeConfirmation);
                focus(this.target!);
            }
        }
    },
    computed: {
        message() {
            return this.confirmation ? this.confirmation.message : null;
        },
        acceptLabel() {
            if (this.confirmation) {
                const confirmation = this.confirmation;

                return confirmation.acceptLabel || confirmation.acceptProps?.label || this.$primevue.config.locale?.accept;
            }

            return this.$primevue.config.locale?.accept;
        },
        rejectLabel() {
            if (this.confirmation) {
                const confirmation = this.confirmation;

                return confirmation.rejectLabel || confirmation.rejectProps?.label || this.$primevue.config.locale?.reject;
            }

            return this.$primevue.config.locale?.reject;
        },
        acceptIcon() {
            return this.confirmation ? this.confirmation.acceptIcon : null;
        },
        rejectIcon() {
            return this.confirmation ? this.confirmation.rejectIcon : null;
        }
    },
    components: {
        Button,
        Portal
    },
    directives: {
        focustrap: FocusTrap
    }
});
</script>
