<template>
    <ol :class="cx('labelList')" :data-p="dataP" v-bind="ptm('labelList')">
        <li v-for="(val, index) in value" :key="index + '_label'" :class="cx('label')" v-bind="ptm('label')">
            <slot name="icon" :value="val" :class="cx('labelIcon')">
                <i v-if="val.icon" :class="[val.icon, cx('labelIcon')]" :style="{ color: val.color }" v-bind="ptm('labelIcon')" />
                <span v-else :class="cx('labelMarker')" :style="{ backgroundColor: val.color }" v-bind="ptm('labelMarker')" />
            </slot>
            <span :class="cx('labelText')" v-bind="ptm('labelText')">{{ val.label }} ({{ meterGroup.percentValue(val.value) }})</span>
        </li>
    </ol>
</template>

<script lang="ts">
import type { MeterItem } from 'rose-spectacles/metergroup';
import { defineComponent, type PropType } from 'vue';
import { cn } from '../internal/utils/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';

export default defineComponent({
    name: 'MeterGroupLabel',
    hostName: 'MeterGroup',
    extends: BaseComponent,
    inheritAttrs: false,
    inject: ['$pcMeterGroup'],
    props: {
        value: {
            type: Array as PropType<MeterItem[]>,
            default: null
        },
        labelPosition: {
            type: String,
            default: 'end'
        },
        labelOrientation: {
            type: String,
            default: 'horizontal'
        }
    },
    computed: {
        meterGroup() {
            return this.$pcMeterGroup as { percentValue: (value: number) => string; labelOrientation: string };
        },
        dataP() {
            return cn({
                [this.meterGroup.labelOrientation]: this.meterGroup.labelOrientation
            });
        }
    }
});
</script>
