<template>
    <div v-if="visible" :class="cx('root')" :aria-label="label == null ? undefined : String(label)" v-bind="ptmi('root')" :data-p="dataP">
        <slot>
            <img v-if="image" :src="image" v-bind="ptm('image')" :class="cx('image')" />
            <component v-else-if="$slots.icon" :is="$slots.icon" :class="cx('icon')" v-bind="ptm('icon')" />
            <span v-else-if="icon" :class="[cx('icon'), icon]" v-bind="ptm('icon')" />
            <div v-if="label !== null" :class="cx('label')" v-bind="ptm('label')">{{ label }}</div>
        </slot>
        <slot v-if="removable" name="removeicon" :removeCallback="close" :keydownCallback="onKeydown">
            <component
                :is="removeIcon ? 'span' : 'TimesCircleIcon'"
                :class="[cx('removeIcon'), removeIcon]"
                @click="close"
                @keydown="onKeydown"
                v-bind="ptm('removeIcon')"
            ></component>
        </slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import TimesCircleIcon from '../icons/timescircle/TimesCircleIcon.vue';
import BaseChip from './BaseChip.vue';

export default defineComponent({
    name: 'Chip',
    extends: BaseChip,
    inheritAttrs: false,
    emits: ['remove'],
    data() {
        return {
            visible: true
        };
    },
    methods: {
        onKeydown(event: KeyboardEvent) {
            if (event.key === 'Enter' || event.key === 'Backspace') {
                this.close(event);
            }
        },
        close(event: Event) {
            this.visible = false;
            this.$emit('remove', event);
        }
    },
    computed: {
        dataP() {
            return cn({
                removable: this.removable
            });
        }
    },
    components: {
        TimesCircleIcon
    }
});
</script>
