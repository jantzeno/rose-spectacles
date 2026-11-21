<template>
    <component
        v-if="!asChild"
        :is="as"
        :class="cx('root')"
        role="presentation"
        :data-p-active="active"
        :data-p-disabled="isStepDisabled"
        :data-p="dataP"
        v-bind="getPTOptions('root')"
    >
        <button
            :id="id"
            :class="cx('header')"
            role="tab"
            type="button"
            :tabindex="isStepDisabled ? -1 : undefined"
            :aria-selected="active"
            :aria-controls="ariaControls"
            :disabled="isStepDisabled"
            @click="onStepClick"
            :data-p="dataP"
            v-bind="getPTOptions('header')"
        >
            <span :class="cx('number')" :data-p="dataP" v-bind="getPTOptions('number')">{{ activeValue }}</span>
            <span :class="cx('title')" :data-p="dataP" v-bind="getPTOptions('title')">
                <slot />
            </span>
        </button>
        <StepperSeparator v-if="isSeparatorVisible" :data-p="dataP" />
    </component>
    <slot v-else :class="cx('root')" :active="active" :value="value" :a11yAttrs="a11yAttrs" :activateCallback="onStepClick" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type Stepper from '../stepper/Stepper.vue';
import { cn } from '../internal/utils/index';
import { find, findSingle } from '../internal/utils/dom/index';
import { findIndexInList } from '../internal/utils/object/index';
import StepperSeparator from '../stepper/StepperSeparator.vue';
import BaseStep from './BaseStep.vue';

type StepperContext = Pick<InstanceType<typeof Stepper>, '$el' | '$id' | 'd_value' | 'isStepActive' | 'isStepDisabled' | 'updateValue' | 'linear'>;
interface StepItemContext {
    $el: HTMLElement;
    value?: string | number;
}

export default defineComponent({
    name: 'Step',
    extends: BaseStep,
    inheritAttrs: false,
    inject: {
        $pcStepper: { default: null },
        $pcStepList: { default: null },
        $pcStepItem: { default: null }
    },
    data() {
        return {
            isSeparatorVisible: false,
            isCompleted: false
        };
    },
    mounted() {
        this.updateState();
    },
    updated() {
        this.updateState();
    },
    methods: {
        updateState() {
            if (this.$el && this.$pcStepList) {
                let index = findIndexInList(this.$el, find(this.stepper.$el, '[data-pc-name="step"]'));
                let activeIndex = findIndexInList(
                    findSingle(this.stepper.$el, '[data-pc-name="step"][data-p-active="true"]'),
                    find(this.stepper.$el, '[data-pc-name="step"]')
                );
                let stepLen = find(this.stepper.$el, '[data-pc-name="step"]').length;

                this.isSeparatorVisible = index !== stepLen - 1;
                this.isCompleted = index < activeIndex;
            }
        },
        getPTOptions(key: string) {
            const _ptm = key === 'root' ? this.ptmi : this.ptm;

            return _ptm(key, {
                context: {
                    active: this.active,
                    disabled: this.isStepDisabled
                }
            });
        },
        onStepClick() {
            this.stepper.updateValue(this.activeValue);
        }
    },
    computed: {
        stepper() {
            return this.$pcStepper as StepperContext;
        },
        stepItem() {
            return this.$pcStepItem as StepItemContext | null;
        },
        active() {
            return this.stepper.isStepActive(this.activeValue);
        },
        activeValue() {
            return !!this.stepItem ? this.stepItem?.value : this.value;
        },
        isStepDisabled() {
            return !this.active && (this.stepper.isStepDisabled() || this.disabled);
        },
        id() {
            return `${this.stepper?.$id}_step_${this.activeValue}`;
        },
        ariaControls() {
            return `${this.stepper?.$id}_steppanel_${this.activeValue}`;
        },
        a11yAttrs() {
            return {
                root: {
                    role: 'presentation',
                    'data-pc-name': 'step',
                    'data-pc-section': 'root',
                    'data-p-disabled': this.isStepDisabled,
                    'data-p-active': this.active
                },
                header: {
                    id: this.id,
                    role: 'tab',
                    tabindex: this.isStepDisabled ? -1 : undefined,
                    'aria-selected': this.active,
                    'aria-controls': this.ariaControls,
                    'data-pc-section': 'header',
                    disabled: this.isStepDisabled,
                    onClick: this.onStepClick
                }
            };
        },
        dataP() {
            return cn({
                disabled: this.isStepDisabled,
                readonly: this.stepper.linear,
                active: this.active,
                completed: this.isCompleted,
                vertical: this.stepItem != null
            });
        }
    },
    components: {
        StepperSeparator
    }
});
</script>
