<template>
    <div ref="container" :class="cx('root')" v-bind="ptmi('root')">
        <input
            v-if="!inline"
            ref="input"
            :id="inputId"
            type="text"
            :class="cx('preview')"
            readonly
            :tabindex="tabindex"
            :disabled="disabled"
            @click="onInputClick"
            @keydown="onInputKeydown"
            @blur="onInputBlur"
            v-bind="ptm('preview')"
        />
        <Portal :appendTo="appendTo" :disabled="inline">
            <transition
                name="rs-anchored-overlay"
                @enter="onOverlayEnter"
                @leave="onOverlayLeave"
                @after-leave="onOverlayAfterLeave"
                v-bind="ptm('transition')"
            >
                <div
                    v-if="inline ? true : overlayVisible"
                    :ref="pickerRef"
                    :class="[cx('panel'), panelClass, overlayClass]"
                    @click="onOverlayClick"
                    v-bind="{ ...ptm('panel'), ...ptm('overlay') }"
                >
                    <div :class="cx('content')" v-bind="ptm('content')">
                        <div
                            :ref="colorSelectorRef"
                            :class="cx('colorSelector')"
                            @mousedown="onColorMousedown($event)"
                            @touchstart="onColorDragStart($event)"
                            @touchmove="onDrag($event)"
                            @touchend="onDragEnd()"
                            v-bind="ptm('colorSelector')"
                        >
                            <div :class="cx('colorBackground')" v-bind="ptm('colorBackground')">
                                <div :ref="colorHandleRef" :class="cx('colorHandle')" v-bind="ptm('colorHandle')"></div>
                            </div>
                        </div>
                        <div
                            :ref="hueViewRef"
                            :class="cx('hue')"
                            @mousedown="onHueMousedown($event)"
                            @touchstart="onHueDragStart($event)"
                            @touchmove="onDrag($event)"
                            @touchend="onDragEnd()"
                            v-bind="ptm('hue')"
                        >
                            <div :ref="hueHandleRef" :class="cx('hueHandle')" v-bind="ptm('hueHandle')"></div>
                        </div>
                    </div>
                </div>
            </transition>
        </Portal>
    </div>
</template>

<script lang="ts">
import { absolutePosition, addClass, isTouchDevice, relativePosition, removeClass } from '../internal/utils/dom/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { ConnectedOverlayScrollHandler } from '../core/utils/Utils';
import OverlayEventBus from '../overlayeventbus/OverlayEventBus';
import Portal from '../portal/Portal.vue';
import { defineComponent, type ComponentPublicInstance } from 'vue';
import BaseColorPicker from './BaseColorPicker.vue';

interface HSB {
    h: number;
    s: number;
    b: number;
}

interface RGB {
    r: number;
    g: number;
    b: number;
}

type PickerRef = Element | ComponentPublicInstance | null;
type DragEvent = MouseEvent | TouchEvent;

export default defineComponent({
    name: 'ColorPicker',
    extends: BaseColorPicker,
    inheritAttrs: false,
    emits: ['change', 'show', 'hide'],
    data() {
        return {
            overlayVisible: false,
            hsbValue: { h: 0, s: 100, b: 100 } as HSB,
            localHue: 0,
            outsideClickListener: null as ((event: MouseEvent) => void) | null,
            documentMouseMoveListener: null as ((event: MouseEvent) => void) | null,
            documentMouseUpListener: null as (() => void) | null,
            scrollHandler: null as ConnectedOverlayScrollHandler | null,
            resizeListener: null as (() => void) | null,
            hueDragging: false,
            colorDragging: false,
            selfUpdate: false,
            picker: null as HTMLElement | null,
            colorSelector: null as HTMLElement | null,
            colorHandle: null as HTMLElement | null,
            hueView: null as HTMLElement | null,
            hueHandle: null as HTMLElement | null
        };
    },
    watch: {
        d_value: {
            immediate: true,
            deep: true,
            handler(newValue: unknown) {
                this.hsbValue = this.toHSB(newValue);
                if (this.selfUpdate) this.selfUpdate = false;
                else this.updateUI();
            }
        }
    },
    beforeUnmount() {
        this.unbindOutsideClickListener();
        this.unbindDragListeners();
        this.unbindResizeListener();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        if (this.picker && this.autoZIndex) {
            ZIndex.clear(this.picker);
        }

        this.clearRefs();
    },
    mounted() {
        this.updateUI();
    },
    methods: {
        pickColor(event: DragEvent) {
            const pointer = 'changedTouches' in event ? event.changedTouches[0] : event;
            if (!pointer || !this.colorSelector) return;

            const { left, top } = this.colorSelector.getBoundingClientRect();
            const saturation = Math.floor((100 * Math.max(0, Math.min(150, pointer.clientX - left))) / 150);
            const brightness = Math.floor((100 * (150 - Math.max(0, Math.min(150, pointer.clientY - top)))) / 150);

            this.hsbValue = this.validateHSB({
                h: this.localHue,
                s: saturation,
                b: brightness
            });

            this.selfUpdate = true;
            this.updateColorHandle();
            this.updateInput();
            this.updateModel(event);
        },
        pickHue(event: DragEvent) {
            const pointer = 'changedTouches' in event ? event.changedTouches[0] : event;
            if (!pointer || !this.hueView) return;

            const { top } = this.hueView.getBoundingClientRect();
            this.localHue = Math.floor((360 * (150 - Math.max(0, Math.min(150, pointer.clientY - top)))) / 150);

            this.hsbValue = this.validateHSB({
                h: this.localHue,
                s: this.hsbValue.s,
                b: this.hsbValue.b
            });

            this.selfUpdate = true;
            this.updateColorSelector();
            this.updateHue();
            this.updateModel(event);
            this.updateInput();
        },
        updateModel(event: DragEvent) {
            let value = this.d_value;

            switch (this.format) {
                case 'hex':
                    value = this.HSBtoHEX(this.hsbValue);
                    break;

                case 'rgb':
                    value = this.HSBtoRGB(this.hsbValue);
                    break;

                case 'hsb':
                    value = this.hsbValue;
                    break;

                default:
                    //NoOp
                    break;
            }

            this.writeValue(value, event);
            this.$emit('change', { event, value });
        },
        updateColorSelector() {
            if (this.colorSelector) {
                let hsbValue = this.validateHSB({
                    h: this.hsbValue.h,
                    s: 100,
                    b: 100
                });

                this.colorSelector.style.backgroundColor = '#' + this.HSBtoHEX(hsbValue);
            }
        },
        updateColorHandle() {
            if (this.colorHandle) {
                this.colorHandle.style.left = Math.floor((150 * this.hsbValue.s) / 100) + 'px';
                this.colorHandle.style.top = Math.floor((150 * (100 - this.hsbValue.b)) / 100) + 'px';
            }
        },
        updateHue() {
            if (this.hueHandle) {
                this.hueHandle.style.top = Math.floor(150 - (150 * this.hsbValue.h) / 360) + 'px';
            }
        },
        updateInput() {
            const input = this.$refs.input;
            if (input instanceof HTMLElement) input.style.backgroundColor = '#' + this.HSBtoHEX(this.hsbValue);
        },
        updateUI() {
            this.updateHue();
            this.updateColorHandle();
            this.updateInput();
            this.updateColorSelector();
        },
        validateHSB(hsb: HSB): HSB {
            return {
                h: Math.min(360, Math.max(0, hsb.h)),
                s: Math.min(100, Math.max(0, hsb.s)),
                b: Math.min(100, Math.max(0, hsb.b))
            };
        },
        validateRGB(rgb: RGB): RGB {
            return {
                r: Math.min(255, Math.max(0, rgb.r)),
                g: Math.min(255, Math.max(0, rgb.g)),
                b: Math.min(255, Math.max(0, rgb.b))
            };
        },
        validateHEX(hex: string): string {
            var len = 6 - hex.length;

            if (len > 0) {
                var o = [];

                for (var i = 0; i < len; i++) {
                    o.push('0');
                }

                o.push(hex);
                hex = o.join('');
            }

            return hex;
        },
        HEXtoRGB(hex: string): RGB {
            const digits = hex.startsWith('#') ? hex.slice(1) : hex;
            const expanded = digits.length === 3 ? [...digits].map((digit) => digit.repeat(2)).join('') : digits;
            const hexValue = parseInt(expanded, 16);

            return { r: hexValue >> 16, g: (hexValue & 0x00ff00) >> 8, b: hexValue & 0x0000ff };
        },
        HEXtoHSB(hex: string): HSB {
            return this.RGBtoHSB(this.HEXtoRGB(hex));
        },
        RGBtoHSB(rgb: RGB): HSB {
            var hsb = {
                h: 0,
                s: 0,
                b: 0
            };
            var min = Math.min(rgb.r, rgb.g, rgb.b);
            var max = Math.max(rgb.r, rgb.g, rgb.b);
            var delta = max - min;

            hsb.b = max;
            hsb.s = max !== 0 ? (255 * delta) / max : 0;

            if (hsb.s !== 0) {
                if (rgb.r === max) {
                    hsb.h = (rgb.g - rgb.b) / delta;
                } else if (rgb.g === max) {
                    hsb.h = 2 + (rgb.b - rgb.r) / delta;
                } else {
                    hsb.h = 4 + (rgb.r - rgb.g) / delta;
                }
            } else {
                hsb.h = -1;
            }

            hsb.h *= 60;

            if (hsb.h < 0) {
                hsb.h += 360;
            }

            hsb.s *= 100 / 255;
            hsb.b *= 100 / 255;

            return hsb;
        },
        HSBtoRGB(hsb: HSB): RGB {
            let rgb: RGB = {
                r: 0,
                g: 0,
                b: 0
            };
            var h = Math.round(hsb.h);
            var s = Math.round((hsb.s * 255) / 100);
            var v = Math.round((hsb.b * 255) / 100);

            if (s === 0) {
                rgb = {
                    r: v,
                    g: v,
                    b: v
                };
            } else {
                var t1 = v;
                var t2 = ((255 - s) * v) / 255;
                var t3 = ((t1 - t2) * (h % 60)) / 60;

                if (h === 360) h = 0;

                if (h < 60) {
                    rgb.r = t1;
                    rgb.b = t2;
                    rgb.g = t2 + t3;
                } else if (h < 120) {
                    rgb.g = t1;
                    rgb.b = t2;
                    rgb.r = t1 - t3;
                } else if (h < 180) {
                    rgb.g = t1;
                    rgb.r = t2;
                    rgb.b = t2 + t3;
                } else if (h < 240) {
                    rgb.b = t1;
                    rgb.r = t2;
                    rgb.g = t1 - t3;
                } else if (h < 300) {
                    rgb.b = t1;
                    rgb.g = t2;
                    rgb.r = t2 + t3;
                } else if (h < 360) {
                    rgb.r = t1;
                    rgb.g = t2;
                    rgb.b = t1 - t3;
                } else {
                    rgb.r = 0;
                    rgb.g = 0;
                    rgb.b = 0;
                }
            }

            return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
        },
        RGBtoHEX(rgb: RGB): string {
            var hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];

            for (var key in hex) {
                if (hex[key].length === 1) {
                    hex[key] = '0' + hex[key];
                }
            }

            return hex.join('');
        },
        HSBtoHEX(hsb: HSB): string {
            return this.RGBtoHEX(this.HSBtoRGB(hsb));
        },
        toHSB(value: unknown): HSB {
            let hsb: HSB;

            if (this.format === 'hex' && typeof value === 'string' && value) {
                hsb = this.HEXtoHSB(value);
            } else if (this.format === 'rgb' && value && typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
                hsb = this.RGBtoHSB(value as RGB);
            } else if (this.format === 'hsb' && value && typeof value === 'object' && 'h' in value && 's' in value && 'b' in value) {
                hsb = { ...(value as HSB) };
            } else {
                hsb = this.HEXtoHSB(typeof this.defaultColor === 'string' ? this.defaultColor : 'ff0000');
            }

            if (hsb.s === 0 || hsb.b === 0) {
                hsb.h = this.localHue;
            } else {
                this.localHue = hsb.h;
            }

            return hsb;
        },
        onOverlayEnter(el: Element) {
            if (!(el instanceof HTMLElement)) return;

            this.updateUI();
            this.alignOverlay();
            this.bindOutsideClickListener();
            this.bindScrollListener();
            this.bindResizeListener();

            if (this.autoZIndex) {
                ZIndex.set('overlay', el, this.baseZIndex || this.$primevue?.config.zIndex?.overlay);
            }

            // Issue: #7508
            this.$attrSelector && el.setAttribute(this.$attrSelector, '');

            this.$emit('show');
        },
        onOverlayLeave() {
            this.unbindOutsideClickListener();
            this.unbindScrollListener();
            this.unbindResizeListener();
            this.clearRefs();
            this.$emit('hide');
        },
        onOverlayAfterLeave(el: Element) {
            if (this.autoZIndex && el instanceof HTMLElement) {
                ZIndex.clear(el);
            }
        },
        alignOverlay() {
            const input = this.$refs.input;
            if (!this.picker || !(input instanceof HTMLElement)) return;

            if (this.appendTo === 'self') relativePosition(this.picker, input);
            else absolutePosition(this.picker, input);
        },
        onInputClick() {
            if (this.disabled) {
                return;
            }

            this.overlayVisible = !this.overlayVisible;
        },
        onInputKeydown(event: KeyboardEvent) {
            switch (event.code) {
                case 'Space':
                case 'Enter':
                case 'NumpadEnter':
                    this.onInputClick();
                    event.preventDefault();
                    break;

                case 'Escape':
                    if (this.overlayVisible) {
                        this.overlayVisible = false;
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    break;

                case 'Tab':
                    this.overlayVisible = false;
                    break;

                default:
                    //NoOp
                    break;
            }
        },
        onInputBlur() {
            this.formField.onBlur?.();
        },
        onColorMousedown(event: MouseEvent) {
            if (this.disabled) {
                return;
            }

            this.bindDragListeners();
            this.onColorDragStart(event);
        },
        onColorDragStart(event: DragEvent) {
            if (this.disabled) {
                return;
            }

            this.colorDragging = true;
            this.pickColor(event);
            this.$el.setAttribute('rs-colorpicker-dragging', 'true');
            !this.isUnstyled && addClass(this.$el, 'rs-colorpicker-dragging');
            event.preventDefault();
        },
        onDrag(event: DragEvent) {
            if (this.colorDragging) {
                this.pickColor(event);
                event.preventDefault();
            }

            if (this.hueDragging) {
                this.pickHue(event);
                event.preventDefault();
            }
        },
        onDragEnd() {
            this.colorDragging = false;
            this.hueDragging = false;
            this.$el.setAttribute('rs-colorpicker-dragging', 'false');
            !this.isUnstyled && removeClass(this.$el, 'rs-colorpicker-dragging');
            this.unbindDragListeners();
        },
        onHueMousedown(event: MouseEvent) {
            if (this.disabled) {
                return;
            }

            this.bindDragListeners();
            this.onHueDragStart(event);
        },
        onHueDragStart(event: DragEvent) {
            if (this.disabled) {
                return;
            }

            this.hueDragging = true;
            this.pickHue(event);
            !this.isUnstyled && addClass(this.$el, 'rs-colorpicker-dragging');
            event.preventDefault();
        },
        isInputClicked(event: MouseEvent) {
            return this.$refs.input === event.target;
        },
        bindDragListeners() {
            this.bindDocumentMouseMoveListener();
            this.bindDocumentMouseUpListener();
        },
        unbindDragListeners() {
            this.unbindDocumentMouseMoveListener();
            this.unbindDocumentMouseUpListener();
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (
                        this.overlayVisible &&
                        this.picker &&
                        event.target instanceof Node &&
                        !this.picker.contains(event.target) &&
                        !this.isInputClicked(event)
                    ) {
                        this.overlayVisible = false;
                    }
                };

                document.addEventListener('click', this.outsideClickListener, true);
            }
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener, true);
                this.outsideClickListener = null;
            }
        },
        bindScrollListener() {
            if (!this.scrollHandler) {
                this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container as HTMLElement, () => {
                    if (this.overlayVisible) {
                        this.overlayVisible = false;
                    }
                });
            }

            this.scrollHandler.bindScrollListener();
        },
        unbindScrollListener() {
            if (this.scrollHandler) {
                this.scrollHandler.unbindScrollListener();
            }
        },
        bindResizeListener() {
            if (!this.resizeListener) {
                this.resizeListener = () => {
                    if (this.overlayVisible && !isTouchDevice()) {
                        this.overlayVisible = false;
                    }
                };

                window.addEventListener('resize', this.resizeListener);
            }
        },
        unbindResizeListener() {
            if (this.resizeListener) {
                window.removeEventListener('resize', this.resizeListener);
                this.resizeListener = null;
            }
        },
        bindDocumentMouseMoveListener() {
            if (!this.documentMouseMoveListener) {
                this.documentMouseMoveListener = this.onDrag.bind(this);
                document.addEventListener('mousemove', this.documentMouseMoveListener);
            }
        },
        unbindDocumentMouseMoveListener() {
            if (this.documentMouseMoveListener) {
                document.removeEventListener('mousemove', this.documentMouseMoveListener);
                this.documentMouseMoveListener = null;
            }
        },
        bindDocumentMouseUpListener() {
            if (!this.documentMouseUpListener) {
                this.documentMouseUpListener = this.onDragEnd.bind(this);
                document.addEventListener('mouseup', this.documentMouseUpListener);
            }
        },
        unbindDocumentMouseUpListener() {
            if (this.documentMouseUpListener) {
                document.removeEventListener('mouseup', this.documentMouseUpListener);
                this.documentMouseUpListener = null;
            }
        },
        pickerRef(el: PickerRef) {
            this.picker = el instanceof HTMLElement ? el : null;
        },
        colorSelectorRef(el: PickerRef) {
            this.colorSelector = el instanceof HTMLElement ? el : null;
        },
        colorHandleRef(el: PickerRef) {
            this.colorHandle = el instanceof HTMLElement ? el : null;
        },
        hueViewRef(el: PickerRef) {
            this.hueView = el instanceof HTMLElement ? el : null;
        },
        hueHandleRef(el: PickerRef) {
            this.hueHandle = el instanceof HTMLElement ? el : null;
        },
        clearRefs() {
            this.picker = null;
            this.colorSelector = null;
            this.colorHandle = null;
            this.hueView = null;
            this.hueHandle = null;
        },
        onOverlayClick(event: MouseEvent) {
            OverlayEventBus.emit('overlay-click', {
                originalEvent: event,
                target: this.$el
            });
        }
    },
    components: {
        Portal: Portal
    }
});
</script>
