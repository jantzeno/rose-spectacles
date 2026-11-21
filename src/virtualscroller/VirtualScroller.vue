<template>
    <template v-if="!disabled">
        <div :ref="elementRef" :class="containerClass" :tabindex="tabindex" :style="style" @scroll="onScroll" v-bind="ptmi('root')">
            <slot
                name="content"
                :styleClass="contentClass"
                :items="loadedItems"
                :getItemOptions="getOptions"
                :loading="d_loading"
                :getLoaderOptions="getLoaderOptions"
                :itemSize="itemSize"
                :rows="loadedRows"
                :columns="loadedColumns"
                :contentRef="contentRef"
                :spacerStyle="spacerStyle"
                :contentStyle="contentStyle"
                :vertical="isVertical()"
                :horizontal="isHorizontal()"
                :both="isBoth()"
            >
                <div :ref="contentRef" :class="contentClass" :style="contentStyle" v-bind="ptm('content')">
                    <template v-for="(item, index) of loadedItems" :key="index">
                        <slot name="item" :item="item" :options="getOptions(index)"></slot>
                    </template>
                </div>
            </slot>
            <div v-if="showSpacer" class="rs-virtualscroller-spacer" :style="spacerStyle" v-bind="ptm('spacer')"></div>
            <div v-if="!loaderDisabled && showLoader && d_loading" :class="loaderClass" v-bind="ptm('loader')">
                <template v-if="$slots && $slots.loader">
                    <template v-for="(_, index) of loaderArr" :key="index">
                        <slot name="loader" :options="getLoaderOptions(index, isBoth() && { numCols: viewportColumns })"></slot>
                    </template>
                </template>
                <slot name="loadingicon">
                    <SpinnerIcon spin class="rs-virtualscroller-loading-icon" v-bind="ptm('loadingIcon')" />
                </slot>
            </div>
        </div>
    </template>
    <template v-else>
        <slot></slot>
        <slot name="content" :items="items" :rows="items" :columns="loadedColumns"></slot>
    </template>
</template>

<script lang="ts">
import { getHeight, getWidth, isVisible } from '../internal/utils/dom/index';
import SpinnerIcon from '../icons/spinner/SpinnerIcon.vue';
import { defineComponent, type ComponentPublicInstance, type CSSProperties } from 'vue';
import BaseVirtualScroller from './BaseVirtualScroller.vue';

interface GridIndex {
    rows: number;
    cols: number;
}

interface GridScrollPosition {
    top: number;
    left: number;
}

type ItemIndex = number | GridIndex;
type ScrollRange = { first: ItemIndex; last: ItemIndex };
type Size = number | number[] | null;
type ScrollerRef = Element | ComponentPublicInstance | null;

function rowIndex(index: ItemIndex): number {
    return typeof index === 'number' ? index : index.rows;
}

function gridIndex(index: ItemIndex): GridIndex {
    return typeof index === 'number' ? { rows: index, cols: 0 } : index;
}

function sizeAt(size: Size, axis = 0): number {
    return Array.isArray(size) ? (size[axis] ?? 0) : (size ?? 0);
}

export default defineComponent({
    name: 'VirtualScroller',
    extends: BaseVirtualScroller,
    inheritAttrs: false,
    emits: ['update:numToleratedItems', 'scroll', 'scroll-index-change', 'lazy-load'],
    data() {
        const both = this.isBoth();

        return {
            first: both ? { rows: 0, cols: 0 } : 0,
            last: both ? { rows: 0, cols: 0 } : 0,
            page: 0,
            numItemsInViewport: both ? { rows: 0, cols: 0 } : 0,
            lastScrollPos: both ? ({ top: 0, left: 0 } as GridScrollPosition) : 0,
            d_numToleratedItems: this.numToleratedItems as Size,
            d_loading: this.loading,
            loaderArr: [] as unknown[],
            spacerStyle: {} as CSSProperties,
            contentStyle: {} as CSSProperties,
            cumulativeSizes: null as number[] | null,
            element: null as HTMLElement | null,
            content: null as HTMLElement | null,
            scrollTimeout: null as ReturnType<typeof setTimeout> | null,
            resizeTimeout: null as ReturnType<typeof setTimeout> | null,
            defaultWidth: 0,
            defaultHeight: 0,
            isRangeChanged: false,
            lazyLoadState: {} as Partial<ScrollRange>,
            resizeListener: null as (() => void) | null,
            resizeObserver: null as ResizeObserver | null,
            initialized: false
        };
    },
    watch: {
        numToleratedItems(newValue) {
            this.d_numToleratedItems = newValue;
        },
        loading(newValue, oldValue) {
            if (this.lazy && newValue !== oldValue && newValue !== this.d_loading) {
                this.d_loading = newValue;
            }
        },
        items: {
            handler(newValue: unknown[] | null, oldValue: unknown[] | null) {
                if (!oldValue || oldValue.length !== (newValue || []).length || typeof this.getItemSize === 'function') {
                    this.init();
                    this.calculateAutoSize();
                }
            },
            deep: true
        },
        itemSize() {
            this.init();
            this.calculateAutoSize();
        },
        getItemSize() {
            this.init();
            this.calculateAutoSize();
        },
        orientation() {
            this.lastScrollPos = this.isBoth() ? { top: 0, left: 0 } : 0;
        },
        scrollHeight() {
            this.init();
            this.calculateAutoSize();
        },
        scrollWidth() {
            this.init();
            this.calculateAutoSize();
        }
    },
    mounted() {
        this.viewInit();

        this.lastScrollPos = this.isBoth() ? { top: 0, left: 0 } : 0;
        this.lazyLoadState = this.lazyLoadState || {};
    },
    updated() {
        !this.initialized && this.viewInit();
    },
    unmounted() {
        this.unbindResizeListener();
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);

        this.initialized = false;
    },
    methods: {
        viewInit() {
            if (this.element && isVisible(this.element)) {
                this.setContentEl(this.content);
                this.init();
                this.calculateAutoSize();

                this.defaultWidth = getWidth(this.element);
                this.defaultHeight = getHeight(this.element);
                this.initialized = true;
            }

            if (this.element) {
                this.bindResizeListener();
            }
        },
        init() {
            if (!this.disabled) {
                this.setSize();
                this.buildCumulativeSizes();
                this.calculateOptions();
                this.setSpacerSize();
                this.cumulativeSizes && this.setContentPosition();
            }
        },
        buildCumulativeSizes() {
            if (typeof this.getItemSize !== 'function' || this.isBoth() || this.isHorizontal()) {
                this.cumulativeSizes = null;

                return;
            }

            const items = this.items || [];
            const sizes = new Array(items.length + 1);

            sizes[0] = 0;

            for (let i = 0; i < items.length; i++) {
                sizes[i + 1] = sizes[i] + this.getItemSize(i);
            }

            this.cumulativeSizes = sizes;
        },
        getItemOffset(index: number) {
            if (this.cumulativeSizes) {
                const i = Math.max(0, Math.min(index, this.cumulativeSizes.length - 1));

                return this.cumulativeSizes[i];
            }

            return index * sizeAt(this.itemSize);
        },
        getIndexAtOffset(offset: number) {
            if (!this.cumulativeSizes) {
                return Math.floor(offset / (sizeAt(this.itemSize) || offset || 1));
            }

            const sizes = this.cumulativeSizes;

            if (offset <= 0) return 0;

            const last = sizes.length - 1;

            if (offset >= sizes[last]) return Math.max(0, last - 1);

            let lo = 0;
            let hi = last;

            while (lo < hi) {
                const mid = (lo + hi) >>> 1;

                if (sizes[mid + 1] <= offset) lo = mid + 1;
                else hi = mid;
            }

            return lo;
        },
        getLastByCumulative(first: number, numToleratedItems: number, numItemsInViewport: number) {
            if (!this.cumulativeSizes) return this.getLast(first);

            const sizes = this.cumulativeSizes;
            const contentPos = this.getContentPosition();
            const contentHeight = this.element ? this.element.offsetHeight - contentPos.top : 0;
            const startOffset = sizes[Math.min(first, sizes.length - 1)];
            const target = startOffset + contentHeight + 2 * numToleratedItems * sizeAt(this.itemSize);

            if (sizes[sizes.length - 1] === startOffset) {
                return this.getLast(first + numItemsInViewport + (first < numToleratedItems ? 2 : 3) * numToleratedItems);
            }

            let lo = first;
            let hi = sizes.length - 1;

            while (lo < hi) {
                const mid = (lo + hi) >>> 1;

                if (sizes[mid] < target) lo = mid + 1;
                else hi = mid;
            }

            return lo;
        },
        isVertical() {
            return this.orientation === 'vertical';
        },
        isHorizontal() {
            return this.orientation === 'horizontal';
        },
        isBoth() {
            return this.orientation === 'both';
        },
        scrollTo(options: ScrollToOptions) {
            this.element?.scrollTo(options);
        },
        scrollToIndex(index: number | number[], behavior: ScrollBehavior = 'auto') {
            const element = this.element;
            if (!element) return;

            const { scrollTop, scrollLeft } = element;
            const { numToleratedItems } = this.calculateNumItems();
            const contentPos = this.getContentPosition();
            const calculateFirst = (index: number, tolerated: number) => (index <= tolerated ? 0 : index);
            const scrollTo = (left: number, top: number) => this.scrollTo({ left, top, behavior });

            if (this.isBoth()) {
                if (!Array.isArray(index) || index.length < 2 || index.some((axisIndex) => axisIndex < 0)) return;

                const rows = calculateFirst(index[0], sizeAt(numToleratedItems));
                const cols = calculateFirst(index[1], sizeAt(numToleratedItems, 1));
                const first = gridIndex(this.first);
                const position = this.lastScrollPos;

                scrollTo(cols * sizeAt(this.itemSize, 1) + contentPos.left, rows * sizeAt(this.itemSize) + contentPos.top);
                this.isRangeChanged = rows !== first.rows || cols !== first.cols;

                if (typeof position === 'number' || position.top !== scrollTop || position.left !== scrollLeft) {
                    this.first = { rows, cols };
                }
            } else {
                if (typeof index !== 'number' || index < 0) return;

                const first = calculateFirst(index, sizeAt(numToleratedItems));
                const horizontal = this.isHorizontal();
                const offset = first * sizeAt(this.itemSize);

                if (horizontal) scrollTo(offset + contentPos.left, scrollTop);
                else scrollTo(scrollLeft, (this.cumulativeSizes ? this.getItemOffset(first) : offset) + contentPos.top);

                this.isRangeChanged = first !== this.first;
                if (this.lastScrollPos !== (horizontal ? scrollLeft : scrollTop)) this.first = first;
            }
        },
        scrollInView(index: number | number[], to?: 'to-start' | 'to-end', behavior: ScrollBehavior = 'auto') {
            if (!to) {
                this.scrollToIndex(index, behavior);
                return;
            }

            const { first, viewport } = this.getRenderedRange();
            const scrollTo = (left: number, top: number) => this.scrollTo({ left, top, behavior });

            if (this.isBoth()) {
                if (!Array.isArray(index) || index.length < 2 || index.some((axisIndex) => axisIndex < 0)) return;

                const start = gridIndex(first);
                const viewportStart = gridIndex(viewport.first);
                const viewportEnd = gridIndex(viewport.last);
                const height = sizeAt(this.itemSize);
                const width = sizeAt(this.itemSize, 1);

                if (to === 'to-start') {
                    if (viewportStart.rows - start.rows > index[0]) scrollTo(viewportStart.cols * width, (viewportStart.rows - 1) * height);
                    else if (viewportStart.cols - start.cols > index[1]) scrollTo((viewportStart.cols - 1) * width, viewportStart.rows * height);
                } else if (to === 'to-end') {
                    if (viewportEnd.rows - start.rows <= index[0] + 1) scrollTo(viewportStart.cols * width, (viewportStart.rows + 1) * height);
                    else if (viewportEnd.cols - start.cols <= index[1] + 1) scrollTo((viewportStart.cols + 1) * width, viewportStart.rows * height);
                }
            } else {
                if (typeof index !== 'number' || index < 0) return;

                const start = rowIndex(first);
                const viewportStart = rowIndex(viewport.first);
                const viewportEnd = rowIndex(viewport.last);
                const horizontal = this.isHorizontal();
                const target =
                    to === 'to-start' && viewportStart - start > index
                        ? viewportStart - 1
                        : to === 'to-end' && viewportEnd - start <= index + 1
                          ? viewportStart + 1
                          : undefined;

                if (target !== undefined) {
                    const offset = !horizontal && this.cumulativeSizes ? this.getItemOffset(target) : target * sizeAt(this.itemSize);
                    horizontal ? scrollTo(offset, 0) : scrollTo(0, offset);
                }
            }
        },
        getRenderedRange() {
            const calculateFirstInViewport = (position: number, size: number) => Math.floor(position / (size || position || 1));
            let firstInViewport = this.first;
            let lastInViewport: ItemIndex = 0;

            if (this.element) {
                const { scrollTop, scrollLeft } = this.element;

                if (this.isBoth()) {
                    const viewport = gridIndex(this.numItemsInViewport);
                    firstInViewport = {
                        rows: calculateFirstInViewport(scrollTop, sizeAt(this.itemSize)),
                        cols: calculateFirstInViewport(scrollLeft, sizeAt(this.itemSize, 1))
                    };
                    lastInViewport = { rows: firstInViewport.rows + viewport.rows, cols: firstInViewport.cols + viewport.cols };
                } else {
                    const horizontal = this.isHorizontal();
                    const scrollPos = horizontal ? scrollLeft : scrollTop;

                    firstInViewport =
                        !horizontal && this.cumulativeSizes ? this.getIndexAtOffset(scrollPos) : calculateFirstInViewport(scrollPos, sizeAt(this.itemSize));
                    lastInViewport = firstInViewport + rowIndex(this.numItemsInViewport);
                }
            }

            return { first: this.first, last: this.last, viewport: { first: firstInViewport, last: lastInViewport } };
        },
        calculateNumItems() {
            const contentPos = this.getContentPosition();
            const contentWidth = this.element ? this.element.offsetWidth - contentPos.left : 0;
            const contentHeight = this.element ? this.element.offsetHeight - contentPos.top : 0;
            const numItems = (contentSize: number, itemSize: number) => Math.ceil(contentSize / (itemSize || contentSize || 1));
            const configured = this.d_numToleratedItems;

            if (this.isBoth()) {
                const rows = numItems(contentHeight, sizeAt(this.itemSize));
                const cols = numItems(contentWidth, sizeAt(this.itemSize, 1));
                const numToleratedItems = configured ? [sizeAt(configured), sizeAt(configured, 1)] : [Math.ceil(rows / 2), Math.ceil(cols / 2)];

                return { numItemsInViewport: { rows, cols }, numToleratedItems };
            }

            const numItemsInViewport = numItems(this.isHorizontal() ? contentWidth : contentHeight, sizeAt(this.itemSize));
            const numToleratedItems = sizeAt(configured) || Math.ceil(numItemsInViewport / 2);

            return { numItemsInViewport, numToleratedItems };
        },
        calculateOptions() {
            const first = this.first;
            const { numItemsInViewport, numToleratedItems } = this.calculateNumItems();
            const calculateLast = (first: number, visible: number, tolerated: number, isCols = false) =>
                this.getLast(first + visible + (first < tolerated ? 2 : 3) * tolerated, isCols);
            let last: ItemIndex;

            if (this.isBoth()) {
                const start = gridIndex(first);
                const viewport = gridIndex(numItemsInViewport);
                last = {
                    rows: calculateLast(start.rows, viewport.rows, sizeAt(numToleratedItems)),
                    cols: calculateLast(start.cols, viewport.cols, sizeAt(numToleratedItems, 1), true)
                };

                if (this.showLoader) this.loaderArr = Array.from({ length: viewport.rows }, () => Array.from({ length: viewport.cols }));
            } else {
                const start = rowIndex(first);
                const viewport = rowIndex(numItemsInViewport);
                const tolerated = sizeAt(numToleratedItems);
                last =
                    !this.isHorizontal() && this.cumulativeSizes
                        ? this.getLastByCumulative(start, tolerated, viewport)
                        : calculateLast(start, viewport, tolerated);

                if (this.showLoader) this.loaderArr = Array.from({ length: viewport });
            }

            this.last = last;
            this.numItemsInViewport = numItemsInViewport;
            this.d_numToleratedItems = numToleratedItems;
            this.$emit('update:numToleratedItems', this.d_numToleratedItems);

            if (this.lazy) {
                Promise.resolve().then(() => {
                    this.lazyLoadState = this.getLazyRange(first, last, true);
                    this.$emit('lazy-load', this.lazyLoadState);
                });
            }
        },
        calculateAutoSize() {
            if (this.autoSize && !this.d_loading) {
                Promise.resolve().then(() => {
                    if (this.content && this.element) {
                        const both = this.isBoth();
                        const horizontal = this.isHorizontal();
                        const vertical = this.isVertical();

                        this.content.style.minHeight = this.content.style.minWidth = 'auto';
                        this.content.style.position = 'relative';
                        this.element.style.contain = 'none';

                        const [width, height] = [getWidth(this.element), getHeight(this.element)];

                        (both || horizontal) &&
                            (this.element.style.width = width < this.defaultWidth ? width + 'px' : this.scrollWidth || this.defaultWidth + 'px');
                        (both || vertical) &&
                            (this.element.style.height = height < this.defaultHeight ? height + 'px' : this.scrollHeight || this.defaultHeight + 'px');

                        this.content.style.minHeight = this.content.style.minWidth = '';
                        this.content.style.position = '';
                        this.element.style.contain = '';
                    }
                });
            }
        },
        getLast(last = 0, isCols = false) {
            const firstRow = this.items?.[0];
            const columns = this.columns ?? (Array.isArray(firstRow) ? firstRow : []);

            return this.items ? Math.min(isCols ? columns.length : this.items.length, last) : 0;
        },
        getContentPosition() {
            if (this.content) {
                const style = getComputedStyle(this.content);
                const left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
                const right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
                const top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
                const bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);

                return { left, right, top, bottom, x: left + right, y: top + bottom };
            }

            return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
        },
        setSize() {
            if (this.element) {
                const both = this.isBoth();
                const horizontal = this.isHorizontal();
                const element = this.element;
                const parent = element.parentElement;
                const width = this.scrollWidth || `${element.offsetWidth || parent?.offsetWidth || 0}px`;
                const height = this.scrollHeight || `${element.offsetHeight || parent?.offsetHeight || 0}px`;
                const setProp = (name: 'width' | 'height', value: string) => (element.style[name] = value);

                if (both || horizontal) {
                    setProp('height', height);
                    setProp('width', width);
                } else {
                    setProp('height', height);
                }
            }
        },
        setSpacerSize() {
            const items = this.items;

            if (items) {
                const both = this.isBoth();
                const horizontal = this.isHorizontal();
                const contentPos = this.getContentPosition();
                const setProp = (name: 'width' | 'height', length: number, size: number, contentSize: number) =>
                    (this.spacerStyle = { ...this.spacerStyle, [name]: length * size + contentSize + 'px' });

                if (both) {
                    const firstRow = items[0];
                    const columns = this.columns ?? (Array.isArray(firstRow) ? firstRow : []);
                    setProp('height', items.length, sizeAt(this.itemSize), contentPos.y);
                    setProp('width', columns.length, sizeAt(this.itemSize, 1), contentPos.x);
                } else if (horizontal) {
                    setProp('width', (this.columns ?? items).length, sizeAt(this.itemSize), contentPos.x);
                } else if (this.cumulativeSizes) {
                    this.spacerStyle = { ...this.spacerStyle, height: this.cumulativeSizes[this.cumulativeSizes.length - 1] + contentPos.y + 'px' };
                } else {
                    setProp('height', items.length, sizeAt(this.itemSize), contentPos.y);
                }
            }
        },
        setContentPosition(pos?: ScrollRange) {
            if (this.content && !this.appendOnly) {
                const both = this.isBoth();
                const horizontal = this.isHorizontal();
                const first = pos ? pos.first : this.first;
                const calculateTranslateVal = (first: number, size: number) => first * size;
                const setTransform = (_x = 0, _y = 0) => (this.contentStyle = { ...this.contentStyle, ...{ transform: `translate3d(${_x}px, ${_y}px, 0)` } });

                if (both) {
                    setTransform(
                        calculateTranslateVal(gridIndex(first).cols, sizeAt(this.itemSize, 1)),
                        calculateTranslateVal(gridIndex(first).rows, sizeAt(this.itemSize))
                    );
                } else if (horizontal) {
                    setTransform(calculateTranslateVal(rowIndex(first), sizeAt(this.itemSize)), 0);
                } else {
                    setTransform(0, this.cumulativeSizes ? this.getItemOffset(rowIndex(first)) : calculateTranslateVal(rowIndex(first), sizeAt(this.itemSize)));
                }
            }
        },
        onScrollPositionChange(event: Event) {
            const target = event.target;
            if (!(target instanceof HTMLElement)) {
                return { first: this.first, last: this.last, isRangeChanged: false, scrollPos: this.lastScrollPos };
            }
            const both = this.isBoth();
            const horizontal = this.isHorizontal();
            const contentPos = this.getContentPosition();
            const calculateScrollPos = (_pos: number, _cpos: number) => (_pos ? (_pos > _cpos ? _pos - _cpos : _pos) : 0);
            const calculateCurrentIndex = (_pos: number, _size: number) => Math.floor(_pos / (_size || _pos));

            const calculateTriggerIndex = (
                _currentIndex: number,
                _first: number,
                _last: number,
                _num: number,
                _numT: number,
                _isScrollDownOrRight: boolean
            ) => {
                return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
            };

            const calculateFirst = (
                _currentIndex: number,
                _triggerIndex: number,
                _first: number,
                _num: number,
                _numT: number,
                _isScrollDownOrRight: boolean,
                _isCols = false
            ) => {
                if (_currentIndex <= _numT) return 0;
                const firstValue = Math.max(
                    0,
                    _isScrollDownOrRight
                        ? _currentIndex < _triggerIndex
                            ? _first
                            : _currentIndex - _numT
                        : _currentIndex > _triggerIndex
                          ? _first
                          : _currentIndex - 2 * _numT
                );
                const maxFirst = this.getLast(firstValue, _isCols);
                if (firstValue > maxFirst) return maxFirst - _num;
                else return firstValue;
            };

            const calculateLast = (_currentIndex: number, _first: number, _num: number, _numT: number, _isCols = false) => {
                let lastValue = _first + _num + 2 * _numT;

                if (_currentIndex >= _numT) {
                    lastValue += _numT + 1;
                }

                return this.getLast(lastValue, _isCols);
            };

            const scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
            const scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);

            let newFirst = both ? { rows: 0, cols: 0 } : 0;
            let newLast = this.last;
            let isRangeChanged = false;
            let newScrollPos = this.lastScrollPos;

            if (both) {
                const position = this.lastScrollPos;
                const isScrollDown = (typeof position === 'number' ? position : position.top) <= scrollTop;
                const isScrollRight = (typeof position === 'number' ? 0 : position.left) <= scrollLeft;

                if (!this.appendOnly || (this.appendOnly && (isScrollDown || isScrollRight))) {
                    const currentIndex = {
                        rows: calculateCurrentIndex(scrollTop, sizeAt(this.itemSize)),
                        cols: calculateCurrentIndex(scrollLeft, sizeAt(this.itemSize, 1))
                    };
                    const triggerIndex = {
                        rows: calculateTriggerIndex(
                            currentIndex.rows,
                            gridIndex(this.first).rows,
                            gridIndex(this.last).rows,
                            gridIndex(this.numItemsInViewport).rows,
                            sizeAt(this.d_numToleratedItems),
                            isScrollDown
                        ),
                        cols: calculateTriggerIndex(
                            currentIndex.cols,
                            gridIndex(this.first).cols,
                            gridIndex(this.last).cols,
                            gridIndex(this.numItemsInViewport).cols,
                            sizeAt(this.d_numToleratedItems, 1),
                            isScrollRight
                        )
                    };

                    newFirst = {
                        rows: calculateFirst(
                            currentIndex.rows,
                            triggerIndex.rows,
                            gridIndex(this.first).rows,
                            gridIndex(this.numItemsInViewport).rows,
                            sizeAt(this.d_numToleratedItems),
                            isScrollDown
                        ),
                        cols: calculateFirst(
                            currentIndex.cols,
                            triggerIndex.cols,
                            gridIndex(this.first).cols,
                            gridIndex(this.numItemsInViewport).cols,
                            sizeAt(this.d_numToleratedItems, 1),
                            isScrollRight,
                            true
                        )
                    };
                    newLast = {
                        rows: calculateLast(currentIndex.rows, newFirst.rows, gridIndex(this.numItemsInViewport).rows, sizeAt(this.d_numToleratedItems)),
                        cols: calculateLast(
                            currentIndex.cols,
                            newFirst.cols,
                            gridIndex(this.numItemsInViewport).cols,
                            sizeAt(this.d_numToleratedItems, 1),
                            true
                        )
                    };

                    isRangeChanged =
                        newFirst.rows !== gridIndex(this.first).rows ||
                        newLast.rows !== gridIndex(this.last).rows ||
                        newFirst.cols !== gridIndex(this.first).cols ||
                        newLast.cols !== gridIndex(this.last).cols ||
                        this.isRangeChanged;
                    newScrollPos = { top: scrollTop, left: scrollLeft };
                }
            } else {
                const scrollPos = horizontal ? scrollLeft : scrollTop;
                const isScrollDownOrRight = (typeof this.lastScrollPos === 'number' ? this.lastScrollPos : this.lastScrollPos.top) <= scrollPos;

                if (!this.appendOnly || (this.appendOnly && isScrollDownOrRight)) {
                    const currentIndex =
                        !horizontal && this.cumulativeSizes ? this.getIndexAtOffset(scrollPos) : calculateCurrentIndex(scrollPos, sizeAt(this.itemSize));
                    const triggerIndex = calculateTriggerIndex(
                        currentIndex,
                        rowIndex(this.first),
                        rowIndex(this.last),
                        rowIndex(this.numItemsInViewport),
                        sizeAt(this.d_numToleratedItems),
                        isScrollDownOrRight
                    );

                    newFirst = calculateFirst(
                        currentIndex,
                        triggerIndex,
                        rowIndex(this.first),
                        rowIndex(this.numItemsInViewport),
                        sizeAt(this.d_numToleratedItems),
                        isScrollDownOrRight
                    );
                    newLast =
                        !horizontal && this.cumulativeSizes
                            ? this.getLastByCumulative(newFirst, sizeAt(this.d_numToleratedItems), rowIndex(this.numItemsInViewport))
                            : calculateLast(currentIndex, newFirst, rowIndex(this.numItemsInViewport), sizeAt(this.d_numToleratedItems));
                    isRangeChanged = newFirst !== this.first || newLast !== this.last || this.isRangeChanged;
                    newScrollPos = scrollPos;
                }
            }

            return {
                first: newFirst,
                last: newLast,
                isRangeChanged,
                scrollPos: newScrollPos
            };
        },
        onScrollChange(event: Event) {
            const { first, last, isRangeChanged, scrollPos } = this.onScrollPositionChange(event);

            if (isRangeChanged) {
                const newState = { first, last };

                this.setContentPosition(newState);

                this.first = first;
                this.last = last;
                this.lastScrollPos = scrollPos;

                this.$emit('scroll-index-change', newState);

                if (this.lazy && this.isPageChanged(first)) {
                    const lazyLoadState = this.getLazyRange(first, last);
                    const isLazyStateChanged = this.lazyLoadState.first !== lazyLoadState.first || this.lazyLoadState.last !== lazyLoadState.last;

                    isLazyStateChanged && this.$emit('lazy-load', lazyLoadState);
                    this.lazyLoadState = lazyLoadState;
                }
            }
        },
        onScroll(event: Event) {
            this.$emit('scroll', event);

            if (this.delay) {
                if (this.scrollTimeout) {
                    clearTimeout(this.scrollTimeout);
                }

                if (this.isPageChanged()) {
                    if (!this.d_loading && this.showLoader) {
                        const { isRangeChanged } = this.onScrollPositionChange(event);
                        const changed = isRangeChanged || (this.step ? this.isPageChanged() : false);

                        changed && (this.d_loading = true);
                    }

                    this.scrollTimeout = setTimeout(() => {
                        this.onScrollChange(event);

                        if (this.d_loading && this.showLoader && (!this.lazy || this.loading === undefined)) {
                            this.d_loading = false;
                            this.page = this.getPageByFirst();
                        }
                    }, this.delay);
                }
            } else {
                this.onScrollChange(event);
            }
        },
        onResize() {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }

            this.resizeTimeout = setTimeout(() => {
                if (this.element && isVisible(this.element)) {
                    const both = this.isBoth();
                    const vertical = this.isVertical();
                    const horizontal = this.isHorizontal();
                    const [width, height] = [getWidth(this.element), getHeight(this.element)];
                    const [isDiffWidth, isDiffHeight] = [width !== this.defaultWidth, height !== this.defaultHeight];
                    const reinit = both ? isDiffWidth || isDiffHeight : horizontal ? isDiffWidth : vertical ? isDiffHeight : false;

                    if (reinit) {
                        this.d_numToleratedItems = this.numToleratedItems;
                        this.defaultWidth = width;
                        this.defaultHeight = height;

                        this.init();
                    }
                }
            }, this.resizeDelay);
        },
        bindResizeListener() {
            if (!this.resizeListener) {
                this.resizeListener = this.onResize.bind(this);

                window.addEventListener('resize', this.resizeListener);
                window.addEventListener('orientationchange', this.resizeListener);

                if (this.element && typeof ResizeObserver !== 'undefined') {
                    this.resizeObserver = new ResizeObserver(() => this.onResize());
                    this.resizeObserver.observe(this.element);
                }
            }
        },
        unbindResizeListener() {
            if (this.resizeListener) {
                window.removeEventListener('resize', this.resizeListener);
                window.removeEventListener('orientationchange', this.resizeListener);
                this.resizeListener = null;
            }

            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
                this.resizeObserver = null;
            }
        },
        getOptions(renderedIndex: number) {
            const count = (this.items || []).length;
            let index = this.isBoth() ? gridIndex(this.first).rows + renderedIndex : rowIndex(this.first) + renderedIndex;

            if (!this.isBoth() && this.variableLoadedRange) {
                index = this.variableLoadedRange.indexes[renderedIndex];
            }

            return {
                index,
                count,
                first: index === 0,
                last: index === count - 1,
                even: index % 2 === 0,
                odd: index % 2 !== 0
            };
        },
        getLoaderOptions(index: number, extOptions?: object | false) {
            let count = this.loaderArr.length;

            return {
                index,
                count,
                first: index === 0,
                last: index === count - 1,
                even: index % 2 === 0,
                odd: index % 2 !== 0,
                ...extOptions
            };
        },
        getPageByFirst(first?: ItemIndex) {
            const index = first ?? this.first;
            return Math.floor((rowIndex(index) + sizeAt(this.d_numToleratedItems) * 4) / (this.step || 1));
        },
        getLazyRange(first: ItemIndex, last: ItemIndex, initial = false): ScrollRange {
            if (!this.step) return { first, last };

            const page = initial ? 0 : this.getPageByFirst(first);
            const count = this.items?.length ?? 0;
            const firstRow = Math.min(page * this.step, Math.max(0, count - this.step));
            const lastRow = Math.min((page + 1) * this.step, count);

            return this.isBoth()
                ? { first: { rows: firstRow, cols: gridIndex(first).cols }, last: { rows: lastRow, cols: gridIndex(last).cols } }
                : { first: firstRow, last: lastRow };
        },
        isPageChanged(first?: ItemIndex) {
            return this.step && !this.lazy ? this.page !== this.getPageByFirst(first ?? this.first) : true;
        },
        setContentEl(el: HTMLElement | null) {
            this.content = el ?? this.content ?? this.element?.querySelector<HTMLElement>('[data-pc-section="content"]') ?? null;
        },
        elementRef(el: ScrollerRef) {
            this.element = el instanceof HTMLElement ? el : null;
        },
        contentRef(el: ScrollerRef) {
            const root = el && !(el instanceof Element) ? el.$el : el;
            this.content = root instanceof HTMLElement ? root : null;
        }
    },
    computed: {
        viewportColumns() {
            return gridIndex(this.numItemsInViewport).cols;
        },
        containerClass() {
            return [
                'rs-virtualscroller',
                this.class,
                {
                    'rs-virtualscroller-inline': this.inline,
                    'rs-virtualscroller-both rs-both-scroll': this.isBoth(),
                    'rs-virtualscroller-horizontal rs-horizontal-scroll': this.isHorizontal()
                }
            ];
        },
        contentClass() {
            return [
                'rs-virtualscroller-content',
                {
                    'rs-virtualscroller-loading': this.d_loading
                }
            ];
        },
        loaderClass() {
            return [
                'rs-virtualscroller-loader',
                {
                    'rs-virtualscroller-loader-mask': !this.$slots.loader
                }
            ];
        },
        variableLoadedRange() {
            if (!this.items || this.d_loading || !this.cumulativeSizes) {
                return null;
            }

            const start = this.appendOnly ? 0 : rowIndex(this.first);
            const items = [];
            const indexes = [];

            for (let index = start; index < rowIndex(this.last); index++) {
                if (this.cumulativeSizes[index + 1] > this.cumulativeSizes[index]) {
                    items.push(this.items[index]);
                    indexes.push(index);
                }
            }

            return { items, indexes };
        },
        loadedItems() {
            if (this.items && !this.d_loading) {
                if (this.isBoth())
                    return this.items
                        .slice(this.appendOnly ? 0 : gridIndex(this.first).rows, gridIndex(this.last).rows)
                        .map((item) =>
                            this.columns || !Array.isArray(item)
                                ? item
                                : item.slice(this.appendOnly ? 0 : gridIndex(this.first).cols, gridIndex(this.last).cols)
                        );
                else if (this.isHorizontal() && this.columns) return this.items;
                else if (this.variableLoadedRange) return this.variableLoadedRange.items;
                else return this.items.slice(this.appendOnly ? 0 : rowIndex(this.first), rowIndex(this.last));
            }

            return [];
        },
        loadedRows() {
            return this.d_loading ? (this.loaderDisabled ? this.loaderArr : []) : this.loadedItems;
        },
        loadedColumns() {
            if (this.columns) {
                const both = this.isBoth();
                const horizontal = this.isHorizontal();

                if (both || horizontal) {
                    return this.d_loading && this.loaderDisabled
                        ? both
                            ? this.loaderArr[0]
                            : this.loaderArr
                        : this.columns.slice(both ? gridIndex(this.first).cols : rowIndex(this.first), both ? gridIndex(this.last).cols : rowIndex(this.last));
                }
            }

            return this.columns;
        }
    },
    components: {
        SpinnerIcon: SpinnerIcon
    }
});
</script>
