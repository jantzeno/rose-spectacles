<template>
    <button
        v-ripple
        type="button"
        :class="cx('root')"
        :tabindex="tabindex"
        :disabled="disabled"
        :aria-pressed="active"
        @click="onChange"
        @blur="onBlur"
        v-bind="getPTOptions('root')"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
        :data-p-checked="active"
        :data-p-disabled="disabled"
        :data-p="dataP"
    >
        <span :class="cx('content')" v-bind="getPTOptions('content')" :data-p="dataP">
            <slot>
                <slot name="icon" :value="toggleValue" :class="cx('icon')">
                    <span v-if="onIcon || offIcon" :class="[cx('icon'), active ? onIcon : offIcon]" v-bind="getPTOptions('icon')" />
                </slot>
                <span :class="cx('label')" v-bind="getPTOptions('label')">{{ label }}</span>
            </slot>
        </span>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import { isNotEmpty } from '../internal/utils/object/index';
import Ripple from '../ripple/Ripple';
import BaseToggleButton from './BaseToggleButton.vue';

export default defineComponent({
    name: 'ToggleButton',
    extends: BaseToggleButton,
    inheritAttrs: false,
    emits: ['change'],
    methods: {
        getPTOptions(key: string) {
            const _ptm = key === 'root' ? this.ptmi : this.ptm;

            return _ptm(key, {
                context: {
                    active: this.active,
                    disabled: this.disabled
                }
            });
        },
        onChange(event: Event) {
            if (!this.disabled && !this.readonly) {
                this.writeValue(!this.active, event, !this.hasModelValue);
                this.$emit('change', event);
            }
        },
        onBlur(event: FocusEvent) {
            this.formField.onBlur?.(event);
        }
    },
    computed: {
        toggleValue() {
            return this.hasModelValue ? this.modelValue : this.d_value;
        },
        active() {
            return this.toggleValue === true;
        },
        hasLabel() {
            return isNotEmpty(this.onLabel) && isNotEmpty(this.offLabel);
        },
        label() {
            return this.hasLabel ? (this.active ? this.onLabel : this.offLabel) : '\u00A0';
        },
        dataP() {
            return cn({
                checked: this.active,
                invalid: this.$invalid,
                [this.size]: this.size
            });
        }
    },
    directives: {
        ripple: Ripple
    }
});
</script>
