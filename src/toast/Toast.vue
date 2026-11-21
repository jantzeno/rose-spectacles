<template>
    <Portal>
        <div ref="container" :class="cx('root')" :style="sx('root', true, { position })" :data-p="dataP" v-bind="ptmi('root')">
            <transition-group name="rs-toast-message" tag="div" @enter="onEnter" @leave="onLeave" v-bind="{ ...ptm('transition') }">
                <ToastMessage
                    v-for="msg of messages"
                    :key="msg.id"
                    :message="msg"
                    :templates="$slots"
                    :closeIcon="closeIcon"
                    :infoIcon="infoIcon"
                    :warnIcon="warnIcon"
                    :errorIcon="errorIcon"
                    :successIcon="successIcon"
                    :closeButtonProps="closeButtonProps"
                    :onMouseEnter="onMouseEnter"
                    :onMouseLeave="onMouseLeave"
                    :onClick="onClick"
                    :unstyled="unstyled"
                    @close="remove($event)"
                    :pt="pt"
                />
            </transition-group>
        </div>
    </Portal>
</template>

<script lang="ts">
import type { ToastMessageOptions } from 'rose-spectacles/toast';
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import { setAttribute } from '../internal/utils/dom/index';
import { isEmpty } from '../internal/utils/object/index';
import { ZIndex } from '../internal/utils/zindex/index';
import Portal from '../portal/Portal.vue';
import ToastEventBus from '../toasteventbus/ToastEventBus';
import BaseToast from './BaseToast.vue';
import ToastMessage from './ToastMessage.vue';

var messageIdx = 0;

type ToastRemoval = { message: ToastMessageOptions; type: 'close' | 'life-end' };

export default defineComponent({
    name: 'Toast',
    extends: BaseToast,
    inheritAttrs: false,
    emits: ['close', 'life-end'],
    data() {
        return {
            messages: [] as ToastMessageOptions[],
            styleElement: null as HTMLStyleElement | null,
            zIndexClearTimer: undefined as ReturnType<typeof setTimeout> | undefined
        };
    },
    mounted() {
        ToastEventBus.on('add', this.onAdd);
        ToastEventBus.on('remove', this.onRemove);
        ToastEventBus.on('remove-group', this.onRemoveGroup);
        ToastEventBus.on('remove-all-groups', this.onRemoveAllGroups);

        if (this.breakpoints) {
            this.createStyle();
        }
    },
    beforeUnmount() {
        this.destroyStyle();
        this.cancelZIndexClear();

        if (this.$refs.container && this.autoZIndex) {
            ZIndex.clear(this.$refs.container as HTMLElement);
        }

        ToastEventBus.off('add', this.onAdd);
        ToastEventBus.off('remove', this.onRemove);
        ToastEventBus.off('remove-group', this.onRemoveGroup);
        ToastEventBus.off('remove-all-groups', this.onRemoveAllGroups);
    },
    methods: {
        add(message: ToastMessageOptions) {
            this.cancelZIndexClear();

            if (message.id == null) {
                message.id = messageIdx++;
            }

            this.messages = [...this.messages, message];
        },
        remove(params: ToastRemoval) {
            const index = this.messages.findIndex((m) => m.id === params.message.id);

            if (index !== -1) {
                this.messages.splice(index, 1);
                this.$emit(params.type, { message: params.message });
            }
        },
        onAdd(message: unknown) {
            const toast = message as ToastMessageOptions;
            if (this.group == toast.group) {
                this.add(toast);
            }
        },
        onRemove(message: unknown) {
            this.remove({ message: message as ToastMessageOptions, type: 'close' });
        },
        onRemoveGroup(group: unknown) {
            if (this.group === group) {
                this.messages = [];
            }
        },
        onRemoveAllGroups() {
            this.messages.forEach((message) => this.$emit('close', { message }));
            this.messages = [];
        },
        onEnter() {
            if (this.autoZIndex) {
                const container = this.$refs.container as HTMLElement;

                if (ZIndex.get(container)) ZIndex.clear(container);
                ZIndex.set('modal', container, this.baseZIndex || this.$primevue.config.zIndex!.modal);
            }
        },
        onLeave() {
            const container = this.$refs.container as HTMLElement | undefined;

            if (container && this.autoZIndex && isEmpty(this.messages)) {
                this.cancelZIndexClear();
                this.zIndexClearTimer = setTimeout(() => {
                    this.zIndexClearTimer = undefined;
                    if (isEmpty(this.messages)) ZIndex.clear(container);
                }, 200);
            }
        },
        cancelZIndexClear() {
            clearTimeout(this.zIndexClearTimer);
            this.zIndexClearTimer = undefined;
        },
        createStyle() {
            if (!this.styleElement && !this.isUnstyled) {
                this.styleElement = document.createElement('style');
                this.styleElement.type = 'text/css';
                setAttribute(this.styleElement, 'nonce', this.$primevue?.config?.csp?.nonce);
                document.head.appendChild(this.styleElement);

                let innerHTML = '';

                for (let breakpoint in this.breakpoints) {
                    let breakpointStyle = '';

                    for (let styleProp in this.breakpoints[breakpoint]) {
                        breakpointStyle += styleProp + ':' + this.breakpoints[breakpoint][styleProp] + '!important;';
                    }

                    innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .rs-toast[${this.$attrSelector}] {
                                ${breakpointStyle}
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
        }
    },
    computed: {
        dataP() {
            return cn({
                [this.position]: this.position
            });
        }
    },
    components: {
        ToastMessage: ToastMessage,
        Portal: Portal
    }
});
</script>
