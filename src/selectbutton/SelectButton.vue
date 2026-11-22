<template>
    <div :class="cx('root')" role="group" :aria-labelledby="ariaLabelledby" v-bind="ptmi('root')" :data-p="dataP">
        <template v-for="(option, index) of options" :key="getOptionRenderKey(option)">
            <ToggleButton
                :modelValue="isSelected(option)"
                :onLabel="getOptionLabel(option)"
                :offLabel="getOptionLabel(option)"
                :disabled="disabled || isOptionDisabled(option)"
                :unstyled="unstyled"
                :size="size"
                :readonly="isOptionReadonly(option)"
                :formControl="{ novalidate: true }"
                @change="onOptionSelect($event, option, index)"
                :pt="ptm('pcToggleButton')"
            >
                <template v-if="$slots.option" #default>
                    <slot name="option" :option="option" :index="index">
                        <span v-bind="ptm('pcToggleButton')['label']">{{ getOptionLabel(option) }}</span>
                    </slot>
                </template>
            </ToggleButton>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import { equals, resolveFieldData } from '../internal/utils/object/index';
import Ripple from '../ripple/Ripple';
import ToggleButton from '../togglebutton/ToggleButton.vue';
import BaseSelectButton from './BaseSelectButton.vue';

export default defineComponent({
    name: 'SelectButton',
    extends: BaseSelectButton,
    inheritAttrs: false,
    emits: ['change'],
    methods: {
        getOptionLabel(option: unknown) {
            return this.optionLabel ? resolveFieldData(option, this.optionLabel) : option;
        },
        getOptionValue(option: unknown) {
            return this.optionValue ? resolveFieldData(option, this.optionValue) : option;
        },
        getOptionRenderKey(option: unknown) {
            return this.dataKey ? resolveFieldData(option, this.dataKey) : this.getOptionLabel(option);
        },
        isOptionDisabled(option: unknown) {
            return this.optionDisabled ? resolveFieldData(option, this.optionDisabled) : false;
        },
        isOptionReadonly(option: unknown) {
            if (this.allowEmpty) return false;

            let selected = this.isSelected(option);

            if (this.multiple) {
                return selected && (this.d_value as unknown[]).length === 1;
            } else {
                return selected;
            }
        },
        onOptionSelect(event: Event, option: unknown, index: number) {
            if (this.disabled || this.isOptionDisabled(option) || this.isOptionReadonly(option)) {
                return;
            }

            let selected = this.isSelected(option);
            let optionValue = this.getOptionValue(option);
            let newValue;

            if (this.multiple) {
                if (selected) {
                    newValue = (this.d_value as unknown[]).filter((val) => !equals(val, optionValue, this.equalityKey));
                    if (!this.allowEmpty && newValue.length === 0) return;
                } else {
                    newValue = this.d_value ? [...this.d_value, optionValue] : [optionValue];
                }
            } else {
                if (selected && !this.allowEmpty) return;
                newValue = selected ? null : optionValue;
            }

            this.writeValue(newValue, event);
            this.$emit('change', { originalEvent: event, value: newValue });
        },
        isSelected(option: unknown) {
            let selected = false;
            let optionValue = this.getOptionValue(option);

            if (this.multiple) {
                if (this.d_value) {
                    for (let val of this.d_value) {
                        if (equals(val, optionValue, this.equalityKey)) {
                            selected = true;
                            break;
                        }
                    }
                }
            } else {
                selected = equals(this.d_value, optionValue, this.equalityKey);
            }

            return selected;
        }
    },
    computed: {
        equalityKey() {
            return this.optionValue ? null : this.dataKey;
        },
        dataP() {
            return cn({
                invalid: this.$invalid
            });
        }
    },
    directives: {
        ripple: Ripple
    },
    components: {
        ToggleButton
    }
});
</script>
