<template>
    <JTPInput
        ref="jtpInput"
        :modelValue="d_page"
        :class="cx('pcJumpToPageInputText')"
        :aria-label="inputArialabel"
        :disabled="disabled"
        @update:modelValue="onChange"
        :unstyled="unstyled"
        :pt="ptm('pcJumpToPageInputText')"
    ></JTPInput>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import InputNumber from '../inputnumber/InputNumber.vue';

export default defineComponent({
    name: 'JumpToPageInput',
    hostName: 'Paginator',
    extends: BaseComponent,
    inheritAttrs: false,
    emits: ['page-change'],
    props: {
        page: Number,
        pageCount: Number,
        disabled: Boolean
    },
    data() {
        return {
            d_page: this.page
        };
    },
    watch: {
        page(newValue) {
            this.d_page = newValue;
        }
    },
    methods: {
        onChange(value: number) {
            if (value !== this.page) {
                this.d_page = value;
                this.$emit('page-change', value - 1);
            }
        }
    },
    computed: {
        inputArialabel() {
            return this.$primevue.config.locale?.aria?.jumpToPageInputLabel;
        }
    },
    components: {
        JTPInput: InputNumber
    }
});
</script>
