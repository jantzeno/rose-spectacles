<template>
    <div role="alert" aria-live="assertive" aria-atomic="true" :class="cx('root')" v-bind="ptmi('root')">
        <slot name="icon">
            <component :is="icon ? 'span' : iconComponent" :class="cx('icon')" v-bind="ptm('icon')"></component>
        </slot>
        <div v-if="$slots.default" :class="cx('text')" v-bind="ptm('text')">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CheckIcon from '../icons/check/CheckIcon.vue';
import ExclamationTriangleIcon from '../icons/exclamationtriangle/ExclamationTriangleIcon.vue';
import InfoCircleIcon from '../icons/infocircle/InfoCircleIcon.vue';
import TimesCircleIcon from '../icons/timescircle/TimesCircleIcon.vue';
import BaseInlineMessage from './BaseInlineMessage.vue';

export default defineComponent({
    name: 'InlineMessage',
    extends: BaseInlineMessage,
    inheritAttrs: false,
    timeout: null,
    data() {
        return {
            visible: true
        };
    },
    mounted() {
        const options = this as typeof this & { sticky?: boolean; life?: number };
        if (!options.sticky) {
            setTimeout(() => {
                this.visible = false;
            }, options.life);
        }
    },
    computed: {
        iconComponent() {
            const icons = {
                info: InfoCircleIcon,
                success: CheckIcon,
                warn: ExclamationTriangleIcon,
                error: TimesCircleIcon
            };
            return icons[this.severity as keyof typeof icons];
        }
    }
});
</script>
