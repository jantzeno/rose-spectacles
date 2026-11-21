<template>
    <div
        :class="cx('root')"
        v-bind="getPTOptions('root')"
        :data-p-checked="checked"
        :data-p-indeterminate="d_indeterminate || undefined"
        :data-p-disabled="disabled"
        :data-p="dataP"
    >
        <input
            ref="input"
            :id="inputId"
            type="checkbox"
            :class="[cx('input'), inputClass]"
            :style="inputStyle"
            :value="value"
            :name="groupName"
            :checked="checked"
            :tabindex="tabindex"
            :disabled="disabled"
            :readonly="readonly"
            :required="required"
            :aria-labelledby="ariaLabelledby"
            :aria-label="ariaLabel"
            :aria-invalid="invalid || undefined"
            @focus="onFocus"
            @blur="onBlur"
            @change="onChange"
            v-bind="getPTOptions('input')"
        />
        <div :class="cx('box')" v-bind="getPTOptions('box')" :data-p="dataP">
            <slot name="icon" :checked="checked" :indeterminate="d_indeterminate" :class="cx('icon')" :data-p="dataP">
                <CheckIcon v-if="checked" :class="cx('icon')" v-bind="getPTOptions('icon')" :data-p="dataP" />
                <MinusIcon v-else-if="d_indeterminate" :class="cx('icon')" v-bind="getPTOptions('icon')" :data-p="dataP" />
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import { contains, equals } from '../internal/utils/object/index';
import CheckIcon from '../icons/check/CheckIcon.vue';
import MinusIcon from '../icons/minus/MinusIcon.vue';
import BaseCheckbox from './BaseCheckbox.vue';
import type CheckboxGroup from '../checkboxgroup/CheckboxGroup.vue';

type Group = Pick<InstanceType<typeof CheckboxGroup>, 'd_value' | 'writeValue' | 'groupName'>;

export default defineComponent({
    name: 'Checkbox',
    extends: BaseCheckbox,
    inheritAttrs: false,
    emits: ['change', 'focus', 'blur', 'update:indeterminate'],
    inject: {
        $pcCheckboxGroup: {
            default: undefined
        }
    },
    data() {
        return {
            d_indeterminate: this.indeterminate
        };
    },
    watch: {
        indeterminate(newValue) {
            this.d_indeterminate = newValue;

            this.updateIndeterminate();
        }
    },
    mounted() {
        this.updateIndeterminate();
    },
    updated() {
        this.updateIndeterminate();
    },
    methods: {
        getPTOptions(key: string) {
            const _ptm = key === 'root' ? this.ptmi : this.ptm;

            return _ptm(key, {
                context: {
                    checked: this.checked,
                    indeterminate: this.d_indeterminate,
                    disabled: this.disabled
                }
            });
        },
        onChange(event: Event) {
            if (!this.disabled && !this.readonly) {
                const value = this.checkboxGroup ? this.checkboxGroup.d_value : this.d_value;
                let newModelValue;

                if (this.binary) {
                    newModelValue = this.d_indeterminate ? this.trueValue : this.checked ? this.falseValue : this.trueValue;
                } else {
                    const selectedValues = value as unknown[] | null | undefined;
                    if (this.checked || this.d_indeterminate) newModelValue = selectedValues!.filter((val) => !equals(val, this.value));
                    else newModelValue = selectedValues ? [...selectedValues, this.value] : [this.value];
                }

                if (this.d_indeterminate) {
                    this.d_indeterminate = false;
                    this.$emit('update:indeterminate', this.d_indeterminate);
                }

                this.checkboxGroup ? this.checkboxGroup.writeValue(newModelValue, event) : this.writeValue(newModelValue, event);
                this.$emit('change', event);
            }
        },
        onFocus(event: FocusEvent) {
            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            this.$emit('blur', event);
            this.formField.onBlur?.(event);
        },
        updateIndeterminate() {
            const input = this.$refs.input as HTMLInputElement | undefined;
            if (input) {
                input.indeterminate = this.d_indeterminate;
            }
        }
    },
    computed: {
        checkboxGroup() {
            return this.$pcCheckboxGroup as Group | undefined;
        },
        groupName() {
            return this.checkboxGroup ? this.checkboxGroup.groupName : this.$formName;
        },
        checked() {
            const value = this.checkboxGroup ? this.checkboxGroup.d_value : this.d_value;

            return this.d_indeterminate ? false : this.binary ? value === this.trueValue : contains(this.value, value as unknown[]);
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
    },
    components: {
        CheckIcon,
        MinusIcon
    }
});
</script>
