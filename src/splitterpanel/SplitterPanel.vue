<template>
    <div ref="container" :class="cx('root')" v-bind="ptmi('root', getPTOptions)">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseSplitterPanel from './BaseSplitterPanel.vue';

export default defineComponent({
    name: 'SplitterPanel',
    extends: BaseSplitterPanel,
    inheritAttrs: false,
    data() {
        return {
            nestedState: null as true | null
        };
    },
    computed: {
        isNested() {
            return this.$slots.default!().some((child) => {
                this.nestedState = (child.type as { name?: string }).name === 'Splitter' ? true : null;

                return this.nestedState;
            });
        },
        getPTOptions() {
            return {
                context: {
                    nested: this.isNested
                }
            };
        }
    }
});
</script>
