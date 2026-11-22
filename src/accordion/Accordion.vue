<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseAccordion from './BaseAccordion.vue';
import type { AccordionKey } from './context';

type AccordionValue = AccordionKey | AccordionKey[] | null | undefined;

export default defineComponent({
    name: 'Accordion',
    extends: BaseAccordion,
    inheritAttrs: false,
    emits: ['update:value', 'update:activeIndex', 'tab-open', 'tab-close'],
    data() {
        return {
            d_value: this.value as AccordionValue
        };
    },
    watch: {
        value(newValue) {
            this.d_value = newValue;
        }
    },
    methods: {
        isItemActive(value?: AccordionKey) {
            return this.multiple ? (this.d_value as AccordionKey[] | null | undefined)?.includes(value!) : this.d_value === value;
        },
        updateValue(newValue?: AccordionKey) {
            const active = this.isItemActive(newValue);

            if (this.multiple) {
                const current = this.d_value as AccordionKey[] | null | undefined;

                if (active) {
                    this.d_value = current!.filter((v) => v !== newValue);
                } else {
                    if (current) current.push(newValue!);
                    else this.d_value = [newValue!];
                }
            } else {
                this.d_value = active ? null : newValue;
            }

            this.$emit('update:value', this.d_value);

            // @deprecated since v4.
            this.$emit('update:activeIndex', this.multiple ? (this.d_value as AccordionKey[] | null | undefined)?.map(Number) : Number(this.d_value));
            this.$emit(active ? 'tab-close' : 'tab-open', { originalEvent: undefined, index: Number(newValue) });
        }
    }
});
</script>
