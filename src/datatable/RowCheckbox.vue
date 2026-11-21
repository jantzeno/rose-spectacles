<template>
    <Checkbox
        :modelValue="checked"
        :binary="true"
        :disabled="$attrs.disabled as boolean | undefined"
        :aria-label="checkboxAriaLabel"
        @change="onChange"
        :unstyled="unstyled"
        :pt="getColumnPT('pcRowCheckbox')"
    >
        <template #icon="slotProps">
            <component v-if="rowCheckboxIconTemplate" :is="rowCheckboxIconTemplate" :checked="slotProps.checked" :class="slotProps.class" />
            <CheckIcon v-else-if="!rowCheckboxIconTemplate && slotProps.checked" :class="slotProps.class" v-bind="getColumnPT('pcRowCheckbox.icon')" />
        </template>
    </Checkbox>
</template>

<script lang="ts">
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import CheckIcon from '../icons/check/CheckIcon.vue';
import Checkbox from '../checkbox/Checkbox.vue';
import { defineComponent, mergeProps } from 'vue';

export default defineComponent({
    name: 'RowCheckbox',
    hostName: 'DataTable',
    extends: BaseComponent,
    emits: ['change'],
    props: {
        value: null,
        checked: null,
        column: null,
        rowCheckboxIconTemplate: {
            type: Function,
            default: null
        },
        index: {
            type: Number,
            default: null
        }
    },
    methods: {
        getColumnPT(key: string) {
            const columnMetaData = {
                props: this.column.props,
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
    computed: {
        checkboxAriaLabel() {
            const aria = this.$primevue.config.locale?.aria;
            return this.checked ? aria?.selectRow : aria?.unselectRow;
        }
    },
    components: {
        CheckIcon,
        Checkbox
    }
});
</script>
