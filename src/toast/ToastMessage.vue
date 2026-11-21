<template>
    <div
        :class="[cx('message'), message.styleClass]"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        :data-p="dataP"
        v-bind="ptm('message')"
        @click="onMessageClick"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
        <component v-if="templates.container" :is="templates.container" :message="message" :closeCallback="onCloseClick" />
        <div v-else :class="[cx('messageContent'), message.contentStyleClass]" v-bind="ptm('messageContent')">
            <template v-if="!templates.message">
                <component
                    :is="templates.messageicon ? templates.messageicon : templates.icon ? templates.icon : iconComponent || 'span'"
                    :class="cx('messageIcon')"
                    v-bind="ptm('messageIcon')"
                />
                <div :class="cx('messageText')" :data-p="dataP" v-bind="ptm('messageText')">
                    <span :class="cx('summary')" :data-p="dataP" v-bind="ptm('summary')">{{ message.summary }}</span>
                    <div v-if="message.detail" :class="cx('detail')" :data-p="dataP" v-bind="ptm('detail')">{{ message.detail }}</div>
                </div>
            </template>
            <component v-else :is="templates.message" :message="message"></component>
            <div v-if="message.closable !== false" v-bind="ptm('buttonContainer')">
                <button
                    v-ripple
                    :class="cx('closeButton')"
                    type="button"
                    :aria-label="closeAriaLabel"
                    @click="onCloseClick"
                    autofocus
                    :data-p="dataP"
                    v-bind="{ ...closeButtonProps, ...ptm('closeButton') }"
                >
                    <component :is="templates.closeicon || 'TimesIcon'" :class="[cx('closeIcon'), closeIcon]" v-bind="ptm('closeIcon')" />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type Component, type PropType, type Slots } from 'vue';
import type { ToastMessageOptions } from 'rose-spectacles/toast';
import { cn } from '../internal/utils/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import CheckIcon from '../icons/check/CheckIcon.vue';
import ExclamationTriangleIcon from '../icons/exclamationtriangle/ExclamationTriangleIcon.vue';
import InfoCircleIcon from '../icons/infocircle/InfoCircleIcon.vue';
import TimesIcon from '../icons/times/TimesIcon.vue';
import TimesCircleIcon from '../icons/timescircle/TimesCircleIcon.vue';
import Ripple from '../ripple/Ripple';

export type ToastRemoval = { message: ToastMessageOptions; type: 'close' | 'life-end' };
export type ToastInteraction = (event: { originalEvent: MouseEvent; message: ToastMessageOptions }) => void;

export default defineComponent({
    name: 'ToastMessage',
    hostName: 'Toast',
    extends: BaseComponent,
    emits: ['close'],
    data() {
        return {
            closeTimeout: null as ReturnType<typeof setTimeout> | null,
            createdAt: null as number | null,
            lifeRemaining: 0
        };
    },
    props: {
        message: {
            type: Object as PropType<ToastMessageOptions>,
            required: true
        },
        templates: {
            type: Object as PropType<Slots>,
            default: () => ({})
        },
        closeIcon: {
            type: String,
            default: null
        },
        infoIcon: {
            type: String,
            default: null
        },
        warnIcon: {
            type: String,
            default: null
        },
        errorIcon: {
            type: String,
            default: null
        },
        successIcon: {
            type: String,
            default: null
        },
        closeButtonProps: {
            type: null,
            default: null
        },
        onMouseEnter: {
            type: Function as PropType<ToastInteraction>,
            default: undefined
        },
        onMouseLeave: {
            type: Function as PropType<ToastInteraction>,
            default: undefined
        },
        onClick: {
            type: Function as PropType<ToastInteraction>,
            default: undefined
        }
    },
    mounted() {
        if (this.message.life) {
            this.lifeRemaining = this.message.life;
            this.startTimeout();
        }
    },
    beforeUnmount() {
        this.clearCloseTimeout();
    },
    methods: {
        startTimeout() {
            this.createdAt = new Date().valueOf();
            this.closeTimeout = setTimeout(() => {
                this.close({ message: this.message, type: 'life-end' });
            }, this.lifeRemaining);
        },
        close(params: ToastRemoval) {
            this.$emit('close', params);
        },
        onCloseClick() {
            this.clearCloseTimeout();
            this.close({ message: this.message, type: 'close' });
        },
        clearCloseTimeout() {
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
                this.closeTimeout = null;
            }
        },
        onMessageClick(event: MouseEvent) {
            this.onClick?.({ originalEvent: event, message: this.message });
        },
        handleMouseEnter(event: MouseEvent) {
            if (this.onMouseEnter) {
                this.onMouseEnter({ originalEvent: event, message: this.message });

                if (event.defaultPrevented) {
                    return;
                }

                if (this.message.life && this.createdAt !== null) {
                    this.lifeRemaining = this.createdAt + this.lifeRemaining - new Date().valueOf();
                    this.createdAt = null;
                    this.clearCloseTimeout();
                }
            }
        },
        handleMouseLeave(event: MouseEvent) {
            if (this.onMouseLeave) {
                this.onMouseLeave({ originalEvent: event, message: this.message });

                if (event.defaultPrevented) {
                    return;
                }

                if (this.message.life) {
                    this.startTimeout();
                }
            }
        }
    },
    computed: {
        iconComponent() {
            const icons: Record<string, Component | false> = {
                info: !this.infoIcon && InfoCircleIcon,
                success: !this.successIcon && CheckIcon,
                warn: !this.warnIcon && ExclamationTriangleIcon,
                error: !this.errorIcon && TimesCircleIcon
            };
            const severity = this.message.severity;

            return severity && Object.hasOwn(icons, severity) ? icons[severity] : undefined;
        },
        closeAriaLabel() {
            return this.$primevue?.config.locale?.aria?.close;
        },
        dataP() {
            const severity = this.message.severity;

            return cn({
                [severity ?? '']: severity
            });
        }
    },
    components: {
        TimesIcon: TimesIcon,
        InfoCircleIcon: InfoCircleIcon,
        CheckIcon: CheckIcon,
        ExclamationTriangleIcon: ExclamationTriangleIcon,
        TimesCircleIcon: TimesCircleIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
