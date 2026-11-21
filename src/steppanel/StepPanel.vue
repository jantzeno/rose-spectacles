<template>
    <template v-if="isVertical">
        <template v-if="!asChild">
            <transition name="rs-collapsible" v-bind="ptm('transition')">
                <component
                    v-show="active"
                    :is="as"
                    :id="id"
                    :class="cx('root')"
                    role="tabpanel"
                    :aria-labelledby="ariaLabelledby"
                    :data-p="dataP"
                    v-bind="getPTOptions('root')"
                >
                    <div :class="cx('contentWrapper')" v-bind="ptm('contentWrapper', ptParams)">
                        <StepperSeparator v-if="isSeparatorVisible" :data-p="dataP" />
                        <div :class="cx('content')" :data-p="dataP" v-bind="getPTOptions('content')">
                            <slot :active="active" :activateCallback="updateValue" />
                        </div>
                    </div>
                </component>
            </transition>
        </template>
        <slot v-else :active="active" :a11yAttrs="a11yAttrs" :activateCallback="updateValue" />
    </template>
    <template v-else>
        <template v-if="!asChild">
            <component v-show="active" :is="as" :id="id" :class="cx('root')" role="tabpanel" :aria-labelledby="ariaLabelledby" v-bind="getPTOptions('root')">
                <slot :active="active" :activateCallback="updateValue" />
            </component>
        </template>
        <slot v-else-if="asChild && active" :active="active" :a11yAttrs="a11yAttrs" :activateCallback="updateValue" />
    </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type Stepper from '../stepper/Stepper.vue';
import { cn } from '../internal/utils/index';
import { find, findSingle } from '../internal/utils/dom/index';
import { findIndexInList } from '../internal/utils/object/index';
import StepperSeparator from '../stepper/StepperSeparator.vue';
import BaseStepPanel from './BaseStepPanel.vue';

type StepperContext = Pick<InstanceType<typeof Stepper>, '$el' | '$id' | 'd_value' | 'isStepActive' | 'isStepDisabled' | 'updateValue' | 'linear'>;
interface StepItemContext {
    $el: HTMLElement;
    value?: string | number;
}

export default defineComponent({
    name: 'StepPanel',
    extends: BaseStepPanel,
    inheritAttrs: false,
    inject: {
        $pcStepper: { default: null },
        $pcStepItem: { default: null },
        $pcStepList: { default: null }
    },
    data() {
        return {
            isSeparatorVisible: false
        };
    },
    mounted() {
        this.updateSeparator();
    },
    updated() {
        this.updateSeparator();
    },
    methods: {
        updateSeparator() {
            if (this.$el) {
                let stepElements = find(this.stepper.$el, '[data-pc-name="step"]');
                let stepPanelEl = findSingle(
                    (this.isVertical ? this.stepItem?.$el : (this.$pcStepList as { $el?: HTMLElement } | null)?.$el)!,
                    '[data-pc-name="step"]'
                );
                let stepPanelIndex = findIndexInList(stepPanelEl, stepElements);

                this.isSeparatorVisible = this.isVertical && stepPanelIndex !== stepElements.length - 1;
            }
        },
        getPTOptions(key: string) {
            const _ptm = key === 'root' ? this.ptmi : this.ptm;

            return _ptm(key, {
                context: {
                    active: this.active
                }
            });
        },
        updateValue(val?: string | number) {
            this.stepper.updateValue(val);
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
            let activeValue = !!this.stepItem ? this.stepItem?.value : this.value;

            return activeValue === this.stepper?.d_value;
        },
        isVertical() {
            return !!this.stepItem;
        },
        activeValue() {
            return this.isVertical ? this.stepItem?.value : this.value;
        },
        id() {
            return `${this.stepper?.$id}_steppanel_${this.activeValue}`;
        },
        ariaLabelledby() {
            return `${this.stepper?.$id}_step_${this.activeValue}`;
        },
        a11yAttrs() {
            return {
                id: this.id,
                role: 'tabpanel',
                'aria-labelledby': this.ariaLabelledby,
                'data-pc-name': 'steppanel',
                'data-p-active': this.active
            };
        },
        ptParams() {
            return {
                context: {
                    active: this.active
                }
            };
        },
        dataP() {
            return cn({
                vertical: this.stepItem != null
            });
        }
    },
    components: {
        StepperSeparator
    }
});
</script>
