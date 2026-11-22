<template>
    <Checkbox
        :modelValue="checked"
        :binary="true"
        :disabled="disabled"
        :aria-label="headerCheckboxAriaLabel"
        @change="onChange"
        :unstyled="unstyled"
        :pt="getColumnPT('pcHeaderCheckbox')"
    >
        <template #icon="slotProps">
            <component v-if="headerCheckboxIconTemplate" :is="headerCheckboxIconTemplate" :checked="slotProps.checked" :class="slotProps.class" />
            <!-- <CheckIcon v-else-if="!headerCheckboxIconTemplate && slotProps.checked" :class="slotProps.class" v-bind="getColumnPT('pcHeaderCheckbox')['icon']" /> -->
        </template>
    </Checkbox>
</template>

<script lang="ts">
import { getColumnPassThroughProps } from '../internal/column-pass-through';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { CheckIcon } from '../internal/lucide';
import Checkbox from '../checkbox/Checkbox.vue';
import { defineComponent, mergeProps } from 'vue';

export default defineComponent({
    name: 'HeaderCheckbox',
    hostName: 'DataTable',
    extends: BaseComponent,
    emits: ['change'],
    props: {
        checked: null,
        disabled: null,
        column: null,
        headerCheckboxIconTemplate: {
            type: Function,
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
                    checked: this.checked,
                    disabled: this.disabled
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
            this.$emit('change', {
                originalEvent: event,
                checked: !this.checked
            });
        }
    },
    computed: {
        headerCheckboxAriaLabel() {
            const aria = this.$primevue.config.locale?.aria;
            return this.checked ? aria?.selectAll : aria?.unselectAll;
        }
    },
    components: {
        CheckIcon,
        Checkbox
    }
});
</script>
