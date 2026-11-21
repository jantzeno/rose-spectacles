<template>
    <div ref="container" :class="cx('root')" :aria-busy="isBlocked" v-bind="ptmi('root')">
        <slot></slot>
    </div>
</template>

<script>
import { addClass, createElement, hasCSSAnimation, remove } from '../internal/utils/dom/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { blockBodyScroll, unblockBodyScroll } from '../utils/Utils';
import BaseBlockUI from './BaseBlockUI.vue';

export default {
    name: 'BlockUI',
    extends: BaseBlockUI,
    inheritAttrs: false,
    emits: ['block', 'unblock'],
    mask: null,
    data() {
        return {
            isBlocked: false
        };
    },
    watch: {
        blocked(newValue) {
            if (newValue === true) this.block();
            else this.unblock();
        }
    },
    mounted() {
        if (this.blocked) {
            this.block();
        }
    },
    beforeUnmount() {
        if (this.mask) {
            ZIndex.clear(this.mask);
            remove(this.mask);

            if (this.fullScreen) {
                unblockBodyScroll();
            }

            this.mask = null;
        }
    },
    methods: {
        block() {
            if (this.mask) {
                ZIndex.clear(this.mask);
                remove(this.mask);
                this.mask = null;
            }

            let styleClass = 'rs-blockui-mask rs-overlay-mask rs-overlay-mask-enter-active';

            if (this.fullScreen) {
                styleClass += ' rs-blockui-mask-document';

                this.mask = createElement('div', {
                    style: {
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%'
                    },
                    class: !this.isUnstyled && styleClass,
                    'rs-bind': this.ptm('mask')
                });

                document.body.appendChild(this.mask);
                blockBodyScroll();
                document.activeElement.blur();
            } else {
                this.mask = createElement('div', {
                    style: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%'
                    },
                    class: !this.isUnstyled && styleClass,
                    'rs-bind': this.ptm('mask')
                });
                this.$refs.container.appendChild(this.mask);
            }

            if (this.autoZIndex) {
                ZIndex.set('modal', this.mask, this.baseZIndex || this.$primevue.config.zIndex.modal);
            }

            this.isBlocked = true;
            this.$emit('block');
        },
        unblock() {
            const mask = this.mask;

            this.isBlocked = false;

            if (mask) {
                mask.style.pointerEvents = 'none';
                !this.isUnstyled && addClass(mask, 'rs-overlay-mask-leave-active');

                const handleAnimationEnd = () => {
                    clearTimeout(fallbackTimer);
                    mask.removeEventListener('animationend', handleAnimationEnd);
                    mask.removeEventListener('webkitAnimationEnd', handleAnimationEnd);
                    this.removeMask(mask);
                };

                const fallbackTimer = setTimeout(() => {
                    this.removeMask(mask);
                }, 300);

                if (hasCSSAnimation(mask) > 0) {
                    mask.addEventListener('animationend', handleAnimationEnd);
                    mask.addEventListener('webkitAnimationEnd', handleAnimationEnd);
                }
            } else {
                this.removeMask();
            }
        },
        removeMask(mask = this.mask) {
            if (mask && mask !== this.mask) return;

            if (mask) {
                ZIndex.clear(mask);
                remove(mask);

                if (this.fullScreen) {
                    unblockBodyScroll();
                }

                this.mask = null;
            }

            this.isBlocked = false;
            this.$emit('unblock');
        }
    }
};
</script>
