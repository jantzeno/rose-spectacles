<template>
    <input
        type="text"
        :class="cx('root')"
        :value="d_value"
        :name="name"
        :disabled="disabled"
        :aria-invalid="$invalid || undefined"
        :data-p="dataP"
        @input="onInput"
        v-bind="attrs"
    />
</template>

<script lang="ts">
import { cn } from '../internal/utils/index';
import { defineComponent, mergeProps } from 'vue';
import BaseInputText from './BaseInputText.vue';

export default defineComponent({
    name: 'InputText',
    extends: BaseInputText,
    inheritAttrs: false,
    methods: {
        onInput(event: Event) {
            this.writeValue((event.target as HTMLInputElement).value, event);
        }
    },
    computed: {
        attrs() {
            return mergeProps(
                this.ptmi('root', {
                    context: {
                        filled: this.$filled,
                        disabled: this.disabled
                    }
                }),
                this.formField
            );
        },
        dataP() {
            return cn({
                invalid: this.$invalid,
                fluid: this.$fluid,
                filled: this.$variant === 'filled',
                [this.size]: this.size
            });
        }
    }
});
</script>
