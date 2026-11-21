<template>
    <ol :class="cx('root')" v-bind="ptmi('root')" :data-p="dataP">
        <li v-for="(item, index) of value" :key="getKey(item, index)" :class="cx('event')" v-bind="getPTOptions('event', index)" :data-p="dataP">
            <div :class="cx('eventOpposite', { index })" v-bind="getPTOptions('eventOpposite', index)" :data-p="dataP">
                <slot name="opposite" :item="item" :index="index"></slot>
            </div>
            <div :class="cx('eventSeparator')" v-bind="getPTOptions('eventSeparator', index)" :data-p="dataP">
                <slot name="marker" :item="item" :index="index">
                    <div :class="cx('eventMarker')" v-bind="getPTOptions('eventMarker', index)" :data-p="dataP"></div>
                </slot>
                <slot v-if="index !== value.length - 1" name="connector" :item="item" :index="index">
                    <div :class="cx('eventConnector')" v-bind="getPTOptions('eventConnector', index)" :data-p="dataP"></div>
                </slot>
            </div>
            <div :class="cx('eventContent')" v-bind="getPTOptions('eventContent', index)" :data-p="dataP">
                <slot name="content" :item="item" :index="index"></slot>
            </div>
        </li>
    </ol>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import { resolveFieldData } from '../internal/utils/object/index';
import BaseTimeline from './BaseTimeline.vue';

export default defineComponent({
    name: 'Timeline',
    extends: BaseTimeline,
    inheritAttrs: false,
    methods: {
        getKey(item: unknown, index: number) {
            return this.dataKey ? resolveFieldData(item, this.dataKey) : index;
        },
        getPTOptions(key: string, index: number) {
            return this.ptm(key, {
                context: {
                    index,
                    count: this.value?.length
                }
            });
        }
    },
    computed: {
        dataP() {
            return cn({
                [this.layout]: this.layout,
                [this.align]: this.align
            });
        }
    }
});
</script>
