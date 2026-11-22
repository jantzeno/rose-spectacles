<template>
    <transition name="rs-message" appear v-bind="ptmi('transition')">
        <div v-if="visible" :class="cx('root')" role="alert" aria-live="assertive" aria-atomic="true" :data-p="dataP" v-bind="ptm('root')">
            <div :class="cx('contentWrapper')" v-bind="ptm('contentWrapper')">
                <slot v-if="$slots.container" name="container" :closeCallback="close"></slot>
                <div v-else :class="cx('content')" :data-p="dataP" v-bind="ptm('content')">
                    <slot name="icon" :class="cx('icon')">
                        <component :is="icon ? 'span' : null" :class="[cx('icon'), icon]" :data-p="dataP" v-bind="ptm('icon')"></component>
                    </slot>
                    <div v-if="$slots.default" :class="cx('text')" :data-p="dataP" v-bind="ptm('text')">
                        <slot></slot>
                    </div>
                    <button
                        v-if="closable"
                        v-ripple
                        :class="cx('closeButton')"
                        :aria-label="closeAriaLabel"
                        type="button"
                        @click="close($event)"
                        :data-p="dataP"
                        v-bind="{ ...closeButtonProps, ...ptm('closeButton') }"
                    >
                        <slot name="closeicon">
                            <i v-if="closeIcon" :class="[cx('closeIcon'), closeIcon]" :data-p="dataP" v-bind="ptm('closeIcon')" />
                            <TimesIcon v-else :class="[cx('closeIcon'), closeIcon]" :data-p="dataP" v-bind="ptm('closeIcon')" />
                        </slot>
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import { TimesIcon } from '../internal/lucide';
import Ripple from '../ripple/Ripple';
import BaseMessage from './BaseMessage.vue';

export default defineComponent({
    name: 'Message',
    extends: BaseMessage,
    inheritAttrs: false,
    emits: ['close', 'life-end'],
    timeout: null,
    data() {
        return {
            visible: true
        };
    },
    mounted() {
        if (this.life) {
            setTimeout(() => {
                this.visible = false;
                this.$emit('life-end');
            }, this.life);
        }
    },
    methods: {
        close(event: Event) {
            this.visible = false;
            this.$emit('close', event);
        }
    },
    computed: {
        closeAriaLabel() {
            return this.$primevue.config.locale?.aria?.close;
        },
        dataP() {
            return cn({
                outlined: this.variant === 'outlined',
                simple: this.variant === 'simple',
                [this.severity]: this.severity,
                [this.size]: this.size
            });
        }
    },
    directives: {
        ripple: Ripple
    },
    components: {
        TimesIcon
    }
});
</script>
