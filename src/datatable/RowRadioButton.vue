<template>
    <RadioButton
        :modelValue="checked"
        :binary="true"
        :disabled="$attrs.disabled as boolean | undefined"
        :name="name"
        @change="onChange"
        :unstyled="unstyled"
        :pt="getColumnPT('pcRowRadiobutton')"
    />
</template>

<script lang="ts">
import { getColumnPassThroughProps } from '../internal/column-pass-through';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import RadioButton from '../radiobutton/RadioButton.vue';
import { defineComponent, mergeProps } from 'vue';

export default defineComponent({
    name: 'RowRadioButton',
    hostName: 'DataTable',
    extends: BaseComponent,
    emits: ['change'],
    props: {
        value: null,
        checked: null,
        name: null,
        column: null,
        index: {
            type: Number,
            default: null
        }
    },
    methods: {
        getColumnPT(key: string) {
            const columnMetaData = {
                props: getColumnPassThroughProps(this.column),
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    index: this.index,
                    checked: this.checked,
                    disabled: this.$attrs.disabled
                }
            };

            return mergeProps(
                this.ptm(`column.${key}`, { column: columnMetaData }),
                this.ptm(`column.${key}`, columnMetaData),
                this.ptmo(this.getColumnProp(), key, columnMetaData)
            );
        },
        getColumnProp() {
            return this.column.props && this.column.props.pt ? this.column.props.pt : undefined; //@todo:
        },
        onChange(event: Event) {
            if (!this.$attrs.disabled) {
                this.$emit('change', {
                    originalEvent: event,
                    data: this.value
                });
            }
        }
    },
    components: {
        RadioButton
    }
});
</script>
