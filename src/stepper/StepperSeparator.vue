<template>
    <span :class="cx('separator')" v-bind="separatorPassThrough" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';

export default defineComponent({
    name: 'StepperSeparator',
    hostName: 'Stepper',
    extends: BaseComponent,
    inject: {
        $pcStepper: { default: null }
    },
    computed: {
        separatorPassThrough() {
            const stepper = this.$pcStepper as { pt?: object };
            return this.ptmo(stepper.pt, 'separator');
        }
    }
});
</script>
