<template>
    <div :class="cx('root')" @click="onBarClick" v-bind="ptmi('root')" :data-p-sliding="false" :data-p="dataP">
        <span :class="cx('range')" :style="[sx('range'), rangeStyle()]" v-bind="ptm('range')" :data-p="dataP"></span>
        <span
            v-if="!range"
            :class="cx('handle')"
            :style="[sx('handle'), handleStyle()]"
            @touchstart.passive="onDragStart($event)"
            @touchmove.passive="onDrag($event)"
            @touchend="onDragEnd($event)"
            @mousedown="onMouseDown($event)"
            @keydown="onKeyDown($event)"
            @blur="onBlur($event)"
            :tabindex="tabindex"
            role="slider"
            :aria-valuemin="min"
            :aria-valuenow="d_value"
            :aria-valuemax="max"
            :aria-labelledby="ariaLabelledby"
            :aria-label="ariaLabel"
            :aria-orientation="horizontal ? 'horizontal' : 'vertical'"
            v-bind="ptm('handle')"
            :data-p="dataP"
        ></span>
        <span
            v-if="range"
            :class="cx('handle')"
            :style="[sx('handle'), rangeStartHandleStyle()]"
            @touchstart.passive="onDragStart($event, 0)"
            @touchmove.passive="onDrag($event)"
            @touchend="onDragEnd($event)"
            @mousedown="onMouseDown($event, 0)"
            @keydown="onKeyDown($event, 0)"
            @blur="onBlur($event, 0)"
            :tabindex="tabindex"
            role="slider"
            :aria-valuemin="min"
            :aria-valuenow="d_value?.[0]"
            :aria-valuemax="max"
            :aria-labelledby="ariaLabelledby"
            :aria-label="ariaLabel"
            :aria-orientation="horizontal ? 'horizontal' : 'vertical'"
            v-bind="ptm('startHandler')"
            :data-p="dataP"
        ></span>
        <span
            v-if="range"
            :class="cx('handle')"
            :style="[sx('handle'), rangeEndHandleStyle()]"
            @touchstart.passive="onDragStart($event, 1)"
            @touchmove.passive="onDrag($event)"
            @touchend="onDragEnd($event)"
            @mousedown="onMouseDown($event, 1)"
            @keydown="onKeyDown($event, 1)"
            @blur="onBlur($event, 1)"
            :tabindex="tabindex"
            role="slider"
            :aria-valuemin="min"
            :aria-valuenow="d_value?.[1]"
            :aria-valuemax="max"
            :aria-labelledby="ariaLabelledby"
            :aria-label="ariaLabel"
            :aria-orientation="horizontal ? 'horizontal' : 'vertical'"
            v-bind="ptm('endHandler')"
            :data-p="dataP"
        ></span>
    </div>
</template>

<script lang="ts">
import { defineComponent, type CSSProperties } from 'vue';
import { cn } from '../internal/utils/index';
import { getAttribute, getWindowScrollLeft, getWindowScrollTop, isRTL } from '../internal/utils/dom/index';
import BaseSlider from './BaseSlider.vue';

type SliderRange = [number, number];
type PointerInput = MouseEvent | TouchEvent;
type HandleIndex = 0 | 1;

export default defineComponent({
    name: 'Slider',
    extends: BaseSlider,
    inheritAttrs: false,
    emits: ['change', 'slideend'],
    data() {
        return {
            dragging: false,
            handleIndex: null as HandleIndex | null,
            initX: 0,
            initY: 0,
            barWidth: 0,
            barHeight: 0,
            dragListener: null as ((event: MouseEvent) => void) | null,
            dragEndListener: null as ((event: MouseEvent) => void) | null
        };
    },
    beforeUnmount() {
        this.unbindDragListeners();
    },
    methods: {
        updateDomData() {
            let rect = this.$el.getBoundingClientRect();

            this.initX = rect.left + getWindowScrollLeft();
            this.initY = rect.top + getWindowScrollTop();
            this.barWidth = this.$el.offsetWidth;
            this.barHeight = this.$el.offsetHeight;
        },
        setValue(event: PointerInput) {
            const point = 'touches' in event ? event.touches[0] : event;

            if (!point) return;

            const { pageX, pageY } = point;
            let handleValue;

            if (this.orientation === 'horizontal') {
                // @todo: Check this
                if (isRTL(this.$el)) {
                    handleValue = ((this.initX + this.barWidth - pageX) * 100) / this.barWidth;
                } else {
                    handleValue = ((pageX - this.initX) * 100) / this.barWidth;
                }
            } else {
                handleValue = ((this.initY + this.barHeight - pageY) * 100) / this.barHeight;
            }

            const newValue = (this.max - this.min) * (handleValue / 100) + this.min;

            this.updateModel(event, this.snapToStep(newValue));
        },
        snapToStep(value: number) {
            const clamped = Math.min(Math.max(value, this.min), this.max);
            const snapped = this.min + Math.round((clamped - this.min) / this.stepSize) * this.stepSize;

            return Math.min(this.roundToPrecision(snapped), this.max);
        },
        roundToPrecision(value: number) {
            const factor = 10 ** this.precision;

            return Math.round(value * factor) / factor;
        },
        stepBy(event: KeyboardEvent, count: number) {
            const value = this.range ? this.rangeValue[this.handleIndex === 0 ? 0 : 1] : this.singleValue;
            const position = (value - this.min) / this.stepSize;
            const nearest = Math.round(position);
            let current;

            if (Math.abs(position - nearest) < 1e-9) current = nearest;
            else current = count > 0 ? Math.floor(position) : Math.ceil(position);

            const newValue = this.snapToStep(this.min + (current + count) * this.stepSize);

            if ((newValue - value) * count >= 0) {
                this.updateModel(event, newValue);
            }
        },
        updateModel(event: Event, value: number) {
            let modelValue: number | SliderRange;

            if (this.range) {
                const index = this.handleIndex === 0 ? 0 : 1;

                if (this.d_value?.[index] === value) return;

                modelValue = [...this.rangeValue];
                modelValue[index] = value;
            } else {
                if (this.d_value === value) return;

                modelValue = value;
            }

            this.writeValue(modelValue, event);
            this.$emit('change', modelValue);
        },
        onDragStart(event: PointerInput, index?: HandleIndex) {
            if (this.disabled) {
                return;
            }

            this.$el.setAttribute('data-p-sliding', 'true');
            this.dragging = true;
            this.updateDomData();

            if (this.range && this.rangeValue[0] === this.snapToStep(this.max)) {
                this.handleIndex = 0;
            } else {
                this.handleIndex = index ?? null;
            }

            (event.currentTarget as HTMLElement | null)?.focus();
        },
        onDrag(event: PointerInput) {
            if (this.dragging) {
                this.setValue(event);
            }
        },
        onDragEnd(event?: PointerInput) {
            if (this.dragging) {
                this.dragging = false;
                this.$el.setAttribute('data-p-sliding', 'false');
                this.$emit('slideend', { originalEvent: event, value: this.value });
            }
        },
        onBarClick(event: MouseEvent) {
            if (this.disabled) {
                return;
            }

            if (!(event.target instanceof Element) || getAttribute(event.target, 'data-pc-section') !== 'handle') {
                this.updateDomData();
                this.setValue(event);
            }
        },
        onMouseDown(event: MouseEvent, index?: HandleIndex) {
            this.bindDragListeners();
            this.onDragStart(event, index);
        },
        onKeyDown(event: KeyboardEvent, index?: HandleIndex) {
            this.handleIndex = index ?? null;

            switch (event.code) {
                case 'ArrowDown':
                case 'ArrowLeft':
                    this.stepBy(event, -1);
                    break;

                case 'ArrowUp':
                case 'ArrowRight':
                    this.stepBy(event, 1);
                    break;

                case 'PageDown':
                    this.stepBy(event, -10);
                    break;

                case 'PageUp':
                    this.stepBy(event, 10);
                    break;

                case 'Home':
                    this.updateModel(event, this.min);
                    break;

                case 'End':
                    this.updateModel(event, this.snapToStep(this.max));
                    break;

                default:
                    return;
            }

            event.preventDefault();
        },
        onBlur(event: FocusEvent, _index?: HandleIndex) {
            this.formField.onBlur?.(event);
        },
        bindDragListeners() {
            if (!this.dragListener) {
                this.dragListener = this.onDrag.bind(this);
                document.addEventListener('mousemove', this.dragListener);
            }

            if (!this.dragEndListener) {
                this.dragEndListener = this.onDragEnd.bind(this);
                document.addEventListener('mouseup', this.dragEndListener);
            }
        },
        unbindDragListeners() {
            if (this.dragListener) {
                document.removeEventListener('mousemove', this.dragListener);
                this.dragListener = null;
            }

            if (this.dragEndListener) {
                document.removeEventListener('mouseup', this.dragEndListener);
                this.dragEndListener = null;
            }
        },
        rangeStyle(): CSSProperties {
            if (this.range) {
                const rangeSliderWidth =
                    this.rangeEndPosition > this.rangeStartPosition
                        ? this.rangeEndPosition - this.rangeStartPosition
                        : this.rangeStartPosition - this.rangeEndPosition;
                const rangeSliderPosition = this.rangeEndPosition > this.rangeStartPosition ? this.rangeStartPosition : this.rangeEndPosition;

                if (this.horizontal) {
                    return { insetInlineStart: rangeSliderPosition + '%', width: rangeSliderWidth + '%' };
                } else {
                    return { bottom: rangeSliderPosition + '%', height: rangeSliderWidth + '%' };
                }
            } else {
                if (this.horizontal) {
                    return { width: this.handlePosition + '%' };
                } else {
                    return { height: this.handlePosition + '%' };
                }
            }
        },
        handleStyle(): CSSProperties {
            if (this.horizontal) {
                return { insetInlineStart: this.handlePosition + '%' };
            } else {
                return { bottom: this.handlePosition + '%' };
            }
        },
        rangeStartHandleStyle(): CSSProperties {
            if (this.horizontal) {
                return { insetInlineStart: this.rangeStartPosition + '%' };
            } else {
                return { bottom: this.rangeStartPosition + '%' };
            }
        },
        rangeEndHandleStyle(): CSSProperties {
            if (this.horizontal) {
                return { insetInlineStart: this.rangeEndPosition + '%' };
            } else {
                return { bottom: this.rangeEndPosition + '%' };
            }
        }
    },
    computed: {
        value(): number | SliderRange {
            return this.range ? this.rangeValue : this.singleValue;
        },
        rangeValue(): SliderRange {
            return [this.d_value?.[0] ?? this.min, this.d_value?.[1] ?? this.max];
        },
        singleValue(): number {
            return this.d_value ?? this.min;
        },
        stepSize() {
            return this.step || 1;
        },
        precision() {
            const decimals = (number: number) => String(number).split('.')[1]?.length ?? 0;

            return Math.max(decimals(this.stepSize), decimals(this.min));
        },
        horizontal() {
            return this.orientation === 'horizontal';
        },
        vertical() {
            return this.orientation === 'vertical';
        },
        handlePosition() {
            if (this.singleValue < this.min) return 0;
            if (this.singleValue > this.max) return 100;

            return ((this.singleValue - this.min) * 100) / (this.max - this.min);
        },
        rangeStartPosition() {
            const [start] = this.rangeValue;

            return start < this.min ? 0 : ((start - this.min) * 100) / (this.max - this.min);
        },
        rangeEndPosition() {
            const [, end] = this.rangeValue;

            return end > this.max ? 100 : ((end - this.min) * 100) / (this.max - this.min);
        },
        dataP() {
            return cn({
                [this.orientation]: this.orientation
            });
        }
    }
});
</script>
