<template>
    <div :class="containerClass" :style="style" v-bind="ptmi('root')">
        <DockSub
            :model="model"
            :templates="$slots"
            :tooltipOptions="tooltipOptions"
            :position="position"
            :menuId="menuId"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            :tabindex="tabindex"
            :pt="pt"
            :unstyled="unstyled"
        ></DockSub>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseDock from './BaseDock.vue';
import DockSub from './DockSub.vue';

export default defineComponent({
    name: 'Dock',
    extends: BaseDock,
    inheritAttrs: false,
    data() {
        return {
            query: null as MediaQueryList | null,
            matchMediaListener: null as (() => void) | null,
            queryMatches: false
        };
    },
    mounted() {
        this.bindMatchMediaListener();
    },
    beforeUnmount() {
        this.unbindMatchMediaListener();
    },
    methods: {
        bindMatchMediaListener() {
            if (!this.matchMediaListener) {
                const query = matchMedia(`(max-width: ${this.breakpoint})`);

                this.query = query;
                this.queryMatches = query.matches;

                this.matchMediaListener = () => {
                    this.queryMatches = query.matches;
                };

                query.addEventListener('change', this.matchMediaListener);
            }
        },
        unbindMatchMediaListener() {
            if (this.matchMediaListener) {
                this.query?.removeEventListener('change', this.matchMediaListener);
                this.matchMediaListener = null;
                this.query = null;
            }
        }
    },
    computed: {
        containerClass() {
            return [this.class, this.cx('root')];
        }
    },
    components: {
        DockSub
    }
});
</script>
