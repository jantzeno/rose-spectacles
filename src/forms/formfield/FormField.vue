<template>
    <component v-if="!asChild" :is="as" :class="cx('root')" v-bind="ptmi('root')">
        <slot :props="field.props" v-bind="fieldAttrs"></slot>
    </component>
    <slot v-else :class="cx('root')" :props="field.props" v-bind="fieldAttrs"></slot>
</template>

<script lang="ts">
import type { useFormFieldInstance, useFormFieldOptions } from 'rose-spectacles/forms/useform';
import { defineComponent } from 'vue';
import BaseFormField from './BaseFormField.vue';

interface FormContext {
    register?: (name: string | undefined, control: useFormFieldOptions) => void;
    fields?: Record<string, useFormFieldInstance>;
}

export default defineComponent({
    name: 'FormField',
    extends: BaseFormField,
    inheritAttrs: false,
    inject: {
        $pcForm: {
            default: undefined
        }
    },
    watch: {
        formControl: {
            immediate: true,
            handler(newValue) {
                this.formInstance?.register?.(this.name, newValue);
            }
        }
    },
    computed: {
        formInstance(): FormContext | undefined {
            return this.$pcForm as FormContext | undefined;
        },
        formControl() {
            return {
                name: this.name,
                resolver: this.resolver,
                initialValue: this.initialValue,
                validateOnValueUpdate: this.validateOnValueUpdate,
                validateOnBlur: this.validateOnBlur,
                validateOnMount: this.validateOnMount,
                validateOnSubmit: this.validateOnSubmit
            };
        },
        field(): Partial<useFormFieldInstance> {
            return this.formInstance?.fields?.[String(this.name)] || {};
        },
        fieldAttrs() {
            return {
                ...this.field.props,
                ...this.field.states
            };
        }
    }
});
</script>
