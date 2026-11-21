<template>
    <div :class="cx('root')" :data-p-resizing="false" :data-p="dataP" v-bind="ptmi('root', getPTOptions)">
        <template v-for="(panel, i) of panels" :key="i">
            <component :is="panel" tabindex="-1"></component>
            <div
                v-if="i !== panels.length - 1"
                ref="gutter"
                :class="cx('gutter')"
                tabindex="-1"
                @mousedown="onGutterMouseDown($event, i)"
                @touchstart="onGutterTouchStart($event, i)"
                :data-p-gutter-resizing="false"
                :data-p="dataP"
                v-bind="ptm('gutter')"
            >
                <div
                    :class="cx('gutterHandle')"
                    role="separator"
                    tabindex="0"
                    :style="[gutterStyle]"
                    :aria-orientation="layout"
                    :aria-valuenow="prevSize"
                    @keyup="onGutterKeyUp"
                    @keydown="onGutterKeyDown($event, i)"
                    :data-p="dataP"
                    v-bind="ptm('gutterHandle')"
                ></div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { cn } from '../internal/utils/index';
import { getHeight, getOuterHeight, getOuterWidth, getWidth, isRTL } from '../internal/utils/dom/index';
import { isArray, isNotEmpty } from '../internal/utils/object/index';
import { getVNodeProp } from '../core/utils/Utils';
import { defineComponent, inject, isVNode, type ComponentOptions, type VNode } from 'vue';
import BaseSplitter from './BaseSplitter.vue';

export default defineComponent({
    name: 'Splitter',
    extends: BaseSplitter,
    inheritAttrs: false,
    emits: ['resizestart', 'resizeend', 'resize'],
    setup() {
        return {
            splitterParent: inject<{ nestedState?: true | null }>('$parentInstance', {})
        };
    },
    data() {
        return {
            mouseMoveListener: null as ((event: MouseEvent) => void) | null,
            mouseUpListener: null as ((event: MouseEvent) => void) | null,
            touchMoveListener: null as ((event: TouchEvent) => void) | null,
            touchEndListener: null as ((event: TouchEvent) => void) | null,
            size: 0,
            startPos: 0,
            prevPanelElement: null as HTMLElement | null,
            nextPanelElement: null as HTMLElement | null,
            nextPanelSize: 0,
            prevPanelSize: 0,
            panelSizes: [] as number[],
            prevPanelIndex: -1,
            prevSize: undefined as string | undefined,
            timer: null as ReturnType<typeof setInterval> | null
        };
    },
    mounted() {
        this.initializePanels();
    },
    watch: {
        panelSizeConfig: {
            flush: 'post',
            handler() {
                this.initializePanels();
            }
        }
    },
    beforeUnmount() {
        this.clear();
        this.clearTimer();
        this.unbindMouseListeners();
        this.unbindTouchListeners();
    },
    methods: {
        isSplitterPanel(child: VNode) {
            return (child.type as ComponentOptions).name === 'SplitterPanel';
        },
        getPanelSize(panel: VNode): number {
            const size = panel.props && isNotEmpty(panel.props.size) ? panel.props.size : null;

            return size ?? 100 / this.panels.length;
        },
        initializePanels() {
            if (this.panels && this.panels.length) {
                let initialized = false;

                if (this.isStateful()) {
                    initialized = this.restoreState();
                }

                if (!initialized) {
                    let children = [...(this.$el as HTMLElement).children].filter(
                        (child): child is HTMLElement => child instanceof HTMLElement && child.dataset.pcName === 'splitterpanel'
                    );
                    const panelSizes: number[] = [];

                    this.panels.map((panel, i) => {
                        let panelSize = this.getPanelSize(panel);

                        panelSizes[i] = panelSize;
                        children[i].style.flexBasis = 'calc(' + panelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
                    });

                    this.panelSizes = panelSizes;
                    this.prevSize = Number(panelSizes[0]).toFixed(4);
                }
            }
        },
        onResizeStart(event: MouseEvent | TouchEvent | KeyboardEvent, index: number, isKeyDown = false) {
            const gutter = event.currentTarget ?? (event.target as HTMLElement | null)?.parentElement;

            if (!(gutter instanceof HTMLElement)) return;

            const previous = gutter.previousElementSibling;
            const next = gutter.nextElementSibling;

            if (!(previous instanceof HTMLElement) || !(next instanceof HTMLElement)) return;

            this.size = this.horizontal ? getWidth(this.$el) : getHeight(this.$el);

            if (!isKeyDown) {
                const pointer = 'changedTouches' in event ? event.changedTouches[0] : event;
                if ('pageX' in pointer) this.startPos = this.horizontal ? pointer.pageX : pointer.pageY;
            }

            this.prevPanelElement = previous;
            this.nextPanelElement = next;

            if (isKeyDown) {
                this.prevPanelSize = this.horizontal ? getOuterWidth(previous, true) : getOuterHeight(previous, true);
                this.nextPanelSize = this.horizontal ? getOuterWidth(next, true) : getOuterHeight(next, true);
            } else {
                this.prevPanelSize = (100 * (this.horizontal ? getOuterWidth(previous, true) : getOuterHeight(previous, true))) / this.size;
                this.nextPanelSize = (100 * (this.horizontal ? getOuterWidth(next, true) : getOuterHeight(next, true))) / this.size;
            }

            this.prevPanelIndex = index;
            this.$emit('resizestart', { originalEvent: event, sizes: this.panelSizes });
            (this.$refs.gutter as HTMLElement[])[index].setAttribute('data-p-gutter-resizing', 'true');
            this.$el.setAttribute('data-p-resizing', 'true');
        },
        onResize(event: MouseEvent | Touch | KeyboardEvent, step = 0, isKeyDown = false) {
            if (!this.prevPanelElement || !this.nextPanelElement) return;

            let newPos, newPrevPanelSize, newNextPanelSize;

            if (isKeyDown) {
                if (this.horizontal) {
                    newPrevPanelSize = (100 * (this.prevPanelSize + step)) / this.size;
                    newNextPanelSize = (100 * (this.nextPanelSize - step)) / this.size;
                } else {
                    newPrevPanelSize = (100 * (this.prevPanelSize - step)) / this.size;
                    newNextPanelSize = (100 * (this.nextPanelSize + step)) / this.size;
                }
            } else {
                if (!('pageX' in event)) return;

                if (this.horizontal) {
                    if (isRTL(this.$el)) {
                        newPos = ((this.startPos - event.pageX) * 100) / this.size;
                    } else {
                        newPos = ((event.pageX - this.startPos) * 100) / this.size;
                    }
                } else {
                    newPos = ((event.pageY - this.startPos) * 100) / this.size;
                }

                newPrevPanelSize = this.prevPanelSize + newPos;
                newNextPanelSize = this.nextPanelSize - newPos;
            }

            if (!this.validateResize(newPrevPanelSize, newNextPanelSize)) {
                newPrevPanelSize = Math.min(Math.max(this.prevPanelMinSize, newPrevPanelSize), 100 - this.nextPanelMinSize);
                newNextPanelSize = Math.min(Math.max(this.nextPanelMinSize, newNextPanelSize), 100 - this.prevPanelMinSize);
            }

            this.prevPanelElement.style.flexBasis = 'calc(' + newPrevPanelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
            this.nextPanelElement.style.flexBasis = 'calc(' + newNextPanelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
            this.panelSizes[this.prevPanelIndex] = newPrevPanelSize;
            this.panelSizes[this.prevPanelIndex + 1] = newNextPanelSize;
            this.prevSize = newPrevPanelSize.toFixed(4);

            this.$emit('resize', { originalEvent: event, sizes: this.panelSizes });
        },
        onResizeEnd(event?: Event) {
            if (this.isStateful()) {
                this.saveState();
            }

            this.$emit('resizeend', { originalEvent: event, sizes: this.panelSizes });
            (this.$refs.gutter as HTMLElement[] | undefined)?.forEach((gutter) => gutter.setAttribute('data-p-gutter-resizing', 'false'));
            this.$el.setAttribute('data-p-resizing', 'false');
            this.clear();
        },
        repeat(event: KeyboardEvent, index: number, step: number) {
            this.onResizeStart(event, index, true);
            this.onResize(event, step, true);
        },
        setTimer(event: KeyboardEvent, index: number, step: number) {
            if (!this.timer) {
                this.timer = setInterval(() => {
                    this.repeat(event, index, step);
                }, 40);
            }
        },
        clearTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        onGutterKeyUp() {
            this.clearTimer();
            this.onResizeEnd();
        },
        onGutterKeyDown(event: KeyboardEvent, index: number) {
            switch (event.code) {
                case 'ArrowLeft': {
                    if (this.layout === 'horizontal') {
                        this.setTimer(event, index, this.step * -1);
                    }

                    event.preventDefault();
                    break;
                }

                case 'ArrowRight': {
                    if (this.layout === 'horizontal') {
                        this.setTimer(event, index, this.step);
                    }

                    event.preventDefault();
                    break;
                }

                case 'ArrowDown': {
                    if (this.layout === 'vertical') {
                        this.setTimer(event, index, this.step * -1);
                    }

                    event.preventDefault();
                    break;
                }

                case 'ArrowUp': {
                    if (this.layout === 'vertical') {
                        this.setTimer(event, index, this.step);
                    }

                    event.preventDefault();
                    break;
                }

                default:
                    //no op
                    break;
            }
        },
        onGutterMouseDown(event: MouseEvent, index: number) {
            this.onResizeStart(event, index);
            this.bindMouseListeners();
        },
        onGutterTouchStart(event: TouchEvent, index: number) {
            this.onResizeStart(event, index);
            this.bindTouchListeners();
            event.preventDefault();
        },
        onGutterTouchEnd(event: TouchEvent) {
            this.unbindTouchListeners();
            this.onResizeEnd(event);
            event.preventDefault();
        },
        bindMouseListeners() {
            if (!this.mouseMoveListener) {
                this.mouseMoveListener = (event) => this.onResize(event);
                document.addEventListener('mousemove', this.mouseMoveListener);
            }

            if (!this.mouseUpListener) {
                this.mouseUpListener = (event) => {
                    this.onResizeEnd(event);
                    this.unbindMouseListeners();
                };

                document.addEventListener('mouseup', this.mouseUpListener);
            }
        },
        bindTouchListeners() {
            if (!this.touchMoveListener) {
                this.touchMoveListener = (event) => {
                    this.onResize(event.changedTouches[0]);
                    event.preventDefault();
                };
                document.addEventListener('touchmove', this.touchMoveListener, { passive: false });
            }

            if (!this.touchEndListener) {
                this.touchEndListener = this.onGutterTouchEnd;
                document.addEventListener('touchend', this.touchEndListener);
                document.addEventListener('touchcancel', this.touchEndListener);
            }
        },
        validateResize(newPrevPanelSize: number, newNextPanelSize: number) {
            if (newPrevPanelSize > 100 || newPrevPanelSize < 0) return false;
            if (newNextPanelSize > 100 || newNextPanelSize < 0) return false;

            if (this.prevPanelMinSize > newPrevPanelSize) {
                return false;
            }

            if (this.nextPanelMinSize > newNextPanelSize) {
                return false;
            }

            return true;
        },
        unbindMouseListeners() {
            if (this.mouseMoveListener) {
                document.removeEventListener('mousemove', this.mouseMoveListener);
                this.mouseMoveListener = null;
            }

            if (this.mouseUpListener) {
                document.removeEventListener('mouseup', this.mouseUpListener);
                this.mouseUpListener = null;
            }
        },
        unbindTouchListeners() {
            if (this.touchMoveListener) {
                document.removeEventListener('touchmove', this.touchMoveListener);
                this.touchMoveListener = null;
            }

            if (this.touchEndListener) {
                document.removeEventListener('touchend', this.touchEndListener);
                document.removeEventListener('touchcancel', this.touchEndListener);
                this.touchEndListener = null;
            }
        },
        clear() {
            this.size = 0;
            this.startPos = 0;
            this.prevPanelElement = null;
            this.nextPanelElement = null;
            this.prevPanelSize = 0;
            this.nextPanelSize = 0;
            this.prevPanelIndex = -1;
        },
        isStateful() {
            return this.stateKey != null;
        },
        getStorage() {
            switch (this.stateStorage) {
                case 'local':
                    return window.localStorage;

                case 'session':
                    return window.sessionStorage;

                default:
                    throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
            }
        },
        saveState() {
            if (this.stateKey != null && isArray(this.panelSizes)) {
                this.getStorage().setItem(this.stateKey, JSON.stringify(this.panelSizes));
            }
        },
        restoreState() {
            if (this.stateKey == null) return false;

            const stateString = this.getStorage().getItem(this.stateKey);

            if (stateString) {
                this.panelSizes = JSON.parse(stateString);
                let children = [...(this.$el as HTMLElement).children].filter(
                    (child): child is HTMLElement => child instanceof HTMLElement && child.dataset.pcName === 'splitterpanel'
                );

                children.forEach((child, i) => {
                    child.style.flexBasis = 'calc(' + this.panelSizes[i] + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
                });

                return true;
            }

            return false;
        },
        resetState() {
            this.initializePanels();
        }
    },
    computed: {
        panels(): VNode[] {
            const panels: VNode[] = [];

            this.$slots.default?.().forEach((child) => {
                if (this.isSplitterPanel(child)) {
                    panels.push(child);
                } else if (child.children instanceof Array) {
                    child.children.forEach((nestedChild) => {
                        if (isVNode(nestedChild) && this.isSplitterPanel(nestedChild)) {
                            panels.push(nestedChild);
                        }
                    });
                }
            });

            return panels;
        },
        panelSizeConfig() {
            // programmatic changes
            return this.panels.map((panel) => this.getPanelSize(panel)).join(',');
        },
        gutterStyle() {
            if (this.horizontal) return { width: this.gutterSize + 'px' };
            else return { height: this.gutterSize + 'px' };
        },
        horizontal() {
            return this.layout === 'horizontal';
        },
        getPTOptions() {
            return {
                context: {
                    nested: this.splitterParent?.nestedState
                }
            };
        },
        prevPanelMinSize() {
            const prevPanelMinSize = getVNodeProp(this.panels[this.prevPanelIndex], 'minSize');

            return Number(prevPanelMinSize ?? 0);
        },
        nextPanelMinSize() {
            const nextPanelMinSize = getVNodeProp(this.panels[this.prevPanelIndex + 1], 'minSize');

            return Number(nextPanelMinSize ?? 0);
        },
        dataP() {
            return cn({
                [this.layout]: this.layout,
                nested: this.splitterParent?.nestedState != null
            });
        }
    }
});
</script>
