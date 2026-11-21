<template>
    <form ref="formRef" @submit.prevent="onSubmit" @reset.prevent="onReset" :class="cx('root')" v-bind="ptmi('root')">
        <slot :register :valid :reset v-bind="states" />
    </form>
</template>

<script lang="ts">
import type { useFormFieldOptions } from 'rose-spectacles/forms/useform';
import { useForm } from '../useform/index';
import { defineComponent, ref } from 'vue';
import BaseForm from './BaseForm.vue';

export default defineComponent({
    name: 'Form',
    extends: BaseForm,
    inheritAttrs: false,
    emits: ['submit', 'reset'],
    setup(props, { emit }) {
        const formRef = ref<HTMLFormElement | null>(null);
        const { handleSubmit, handleReset, ...form } = useForm(props);

        const submit = () => {
            formRef.value?.requestSubmit();
        };

        const register = (field?: string, options?: useFormFieldOptions) => {
            if (!options?.novalidate) {
                const [, fieldProps] = form.defineField(field, options);

                return fieldProps;
            }

            return {};
        };

        const onSubmit = handleSubmit((e) => {
            emit('submit', e);
        });

        const onReset = handleReset((e) => {
            emit('reset', e);
        });

        return {
            formRef,
            submit,
            register,
            onSubmit,
            onReset,
            ...form
        };
    }
});
</script>
