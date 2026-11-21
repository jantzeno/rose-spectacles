<template>
    <div :class="cx('root')" v-bind="ptmi('root')" :data-p="dataP">
        <template v-for="value in stars" :key="value">
            <div
                :class="cx('option', { value })"
                @click="onOptionClick($event, value)"
                v-bind="getPTOptions('option', value)"
                :data-p-active="value <= d_value"
                :data-p-focused="value === focusedOptionIndex"
                :data-p="dataOption(value)"
            >
                <span class="rs-hidden-accessible" v-bind="ptm('hiddenOptionInputContainer')" :data-p-hidden-accessible="true">
                    <input
                        type="radio"
                        :value="value"
                        :name="namex"
                        :checked="d_value === value"
                        :disabled="disabled"
                        :readonly="readonly"
                        :aria-label="starAriaLabel(value)"
                        @focus="onFocus($event, value)"
                        @blur="onBlur"
                        @change="onChange($event, value)"
                        v-bind="ptm('hiddenOptionInput')"
                    />
                </span>
                <slot v-if="value <= d_value" name="onicon" :value="value" :toggleCallback="(event: Event) => onChange(event, value)" :class="cx('onIcon')">
                    <component :is="onIcon ? 'span' : 'StarFillIcon'" :class="[cx('onIcon'), onIcon]" v-bind="ptm('onIcon')" />
                </slot>
                <slot v-else name="officon" :value="value" :class="cx('offIcon')" :toggleCallback="(event: Event) => onChange(event, value)">
                    <component :is="offIcon ? 'span' : 'StarIcon'" :class="[cx('offIcon'), offIcon]" v-bind="ptm('offIcon')" />
                </slot>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import { focus, getFirstFocusableElement } from '../internal/utils/dom/index';
import BanIcon from '../icons/ban/BanIcon.vue';
import StarIcon from '../icons/star/StarIcon.vue';
import StarFillIcon from '../icons/starfill/StarFillIcon.vue';
import BaseRating from './BaseRating.vue';

type RatingFocusEvent = FocusEvent & { sourceCapabilities?: { firesTouchEvents?: boolean } };

export default defineComponent({
    name: 'Rating',
    extends: BaseRating,
    inheritAttrs: false,
    emits: ['change', 'focus', 'blur'],
    data() {
        return {
            focusedOptionIndex: -1,
            isFocusVisibleItem: true
        };
    },
    methods: {
        getPTOptions(key: string, value: number) {
            return this.ptm(key, {
                context: {
                    active: value <= this.d_value,
                    focused: value === this.focusedOptionIndex
                }
            });
        },
        onOptionClick(event: MouseEvent, value: number) {
            if (!this.readonly && !this.disabled) {
                this.onOptionSelect(event, value);
                this.isFocusVisibleItem = false;
                const firstFocusableEl = getFirstFocusableElement(event.currentTarget as HTMLElement);

                firstFocusableEl && focus(firstFocusableEl as HTMLElement);
            }
        },
        onFocus(event: RatingFocusEvent, value: number) {
            this.focusedOptionIndex = value;
            this.isFocusVisibleItem = event.sourceCapabilities?.firesTouchEvents === false;

            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            this.focusedOptionIndex = -1;
            this.$emit('blur', event);
            this.formField.onBlur?.();
        },
        onChange(event: Event, value: number) {
            this.onOptionSelect(event, value);
            this.isFocusVisibleItem = true;
        },
        onOptionSelect(event: Event, value: number) {
            if (this.focusedOptionIndex === value || this.d_value === value) {
                this.focusedOptionIndex = -1;
                this.updateModel(event, null);
            } else {
                this.focusedOptionIndex = value;
                this.updateModel(event, value || null);
            }
        },
        updateModel(event: Event, value: number | null) {
            this.writeValue(value, event);
            this.$emit('change', { originalEvent: event, value });
        },
        starAriaLabel(value: number) {
            const aria = this.$primevue.config.locale?.aria;
            return value === 1 ? aria?.star : aria?.stars?.replace(/{star}/g, String(value));
        },
        dataOption(value: number) {
            return cn({
                readonly: this.readonly,
                disabled: this.disabled,
                active: value <= this.d_value,
                'focus-visible': value === this.focusedOptionIndex && this.isFocusVisibleItem
            });
        }
    },
    computed: {
        namex() {
            return this.name || `${this.$attrSelector}_name`;
        },
        dataP() {
            return cn({
                readonly: this.readonly,
                disabled: this.disabled
            });
        }
    },
    components: {
        StarFillIcon,
        StarIcon,
        BanIcon
    }
});
</script>
