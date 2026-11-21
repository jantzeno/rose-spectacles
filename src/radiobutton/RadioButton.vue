<template>
    <div :class="cx('root')" v-bind="getPTOptions('root')" :data-p-checked="checked" :data-p-disabled="disabled" :data-p="dataP">
        <input
            :id="inputId"
            type="radio"
            :class="[cx('input'), inputClass]"
            :style="inputStyle"
            :value="value"
            :name="groupName"
            :checked="checked"
            :tabindex="tabindex"
            :disabled="disabled"
            :readonly="readonly"
            :aria-labelledby="ariaLabelledby"
            :aria-label="ariaLabel"
            :aria-invalid="invalid || undefined"
            @focus="onFocus"
            @blur="onBlur"
            @change="onChange"
            v-bind="getPTOptions('input')"
        />
        <div :class="cx('box')" v-bind="getPTOptions('box')" :data-p="dataP">
            <div :class="cx('icon')" v-bind="getPTOptions('icon')" :data-p="dataP"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import { equals } from '../internal/utils/object/index';
import BaseRadioButton from './BaseRadioButton.vue';
import type RadioButtonGroup from '../radiobuttongroup/RadioButtonGroup.vue';

type Group = Pick<InstanceType<typeof RadioButtonGroup>, 'd_value' | 'writeValue' | 'groupName'>;

export default defineComponent({
    name: 'RadioButton',
    extends: BaseRadioButton,
    inheritAttrs: false,
    emits: ['change', 'focus', 'blur'],
    inject: {
        $pcRadioButtonGroup: {
            default: undefined
        }
    },
    methods: {
        getPTOptions(key: string) {
            const _ptm = key === 'root' ? this.ptmi : this.ptm;

            return _ptm(key, {
                context: {
                    checked: this.checked,
                    disabled: this.disabled
                }
            });
        },
        onChange(event: Event) {
            if (!this.disabled && !this.readonly) {
                const newModelValue = this.binary ? !this.checked : this.value;

                this.radioButtonGroup ? this.radioButtonGroup.writeValue(newModelValue, event) : this.writeValue(newModelValue, event);
                this.$emit('change', event);
            }
        },
        onFocus(event: FocusEvent) {
            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            this.$emit('blur', event);
            this.formField.onBlur?.(event);
        }
    },
    computed: {
        radioButtonGroup() {
            return this.$pcRadioButtonGroup as Group | undefined;
        },
        groupName() {
            return this.radioButtonGroup ? this.radioButtonGroup.groupName : this.$formName;
        },
        checked() {
            const value = this.radioButtonGroup ? this.radioButtonGroup.d_value : this.d_value;

            return value != null && (this.binary ? !!value : equals(value, this.value));
        },
        dataP() {
            return cn({
                invalid: this.$invalid,
                checked: this.checked,
                disabled: this.disabled,
                filled: this.$variant === 'filled',
                [this.size]: this.size
            });
        }
    }
});
</script>
