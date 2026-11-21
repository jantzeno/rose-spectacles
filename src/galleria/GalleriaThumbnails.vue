<template>
    <div :class="cx('thumbnails')" v-bind="ptm('thumbnails')">
        <div :class="cx('thumbnailContent')" v-bind="ptm('thumbnailContent')">
            <button
                v-if="showThumbnailNavigators"
                v-ripple
                :class="cx('thumbnailPrevButton')"
                :disabled="isNavBackwardDisabled"
                type="button"
                :aria-label="ariaPrevButtonLabel"
                @click="navBackward($event)"
                v-bind="{ ...prevButtonProps, ...ptm('thumbnailPrevButton') }"
                data-pc-group-section="thumbnailnavigator"
            >
                <component
                    :is="templates.previousthumbnailicon || (isVertical ? 'ChevronUpIcon' : 'ChevronLeftIcon')"
                    :class="cx('thumbnailPrevIcon')"
                    v-bind="ptm('thumbnailPrevIcon')"
                />
            </button>
            <div :class="cx('thumbnailsViewport')" :style="{ height: isVertical ? contentHeight : '' }" v-bind="ptm('thumbnailsViewport')">
                <div
                    ref="itemsContainer"
                    :class="cx('thumbnailItems')"
                    role="tablist"
                    @transitionend="onTransitionEnd($event)"
                    @touchstart="onTouchStart($event)"
                    @touchmove="onTouchMove($event)"
                    @touchend="onTouchEnd($event)"
                    v-bind="ptm('thumbnailItems')"
                >
                    <div
                        v-for="(item, index) of value"
                        :key="`rs-galleria-thumbnail-item-${index}`"
                        :class="cx('thumbnailItem', { index, activeIndex })"
                        role="tab"
                        :data-p-active="activeIndex === index"
                        :aria-selected="activeIndex === index"
                        :aria-controls="containerId + '_item_' + index"
                        @keydown="onThumbnailKeydown($event, index)"
                        v-bind="ptm('thumbnailItem')"
                        :data-p-galleria-thumbnail-item-current="activeIndex === index"
                        :data-p-galleria-thumbnail-item-active="isItemActive(index)"
                        :data-p-galleria-thumbnail-item-start="firstItemAciveIndex() === index"
                        :data-p-galleria-thumbnail-item-end="lastItemActiveIndex() === index"
                    >
                        <div
                            :class="cx('thumbnail')"
                            :tabindex="activeIndex === index ? '0' : '-1'"
                            :aria-label="ariaPageLabel(index + 1)"
                            :aria-current="activeIndex === index ? 'page' : undefined"
                            @click="onItemClick(index)"
                            v-bind="ptm('thumbnail')"
                        >
                            <component v-if="templates.thumbnail" :is="templates.thumbnail" :item="item" />
                        </div>
                    </div>
                </div>
            </div>
            <button
                v-if="showThumbnailNavigators"
                v-ripple
                :class="cx('thumbnailNextButton')"
                :disabled="isNavForwardDisabled"
                type="button"
                :aria-label="ariaNextButtonLabel"
                @click="navForward($event)"
                v-bind="{ ...nextButtonProps, ...ptm('thumbnailNextButton') }"
                data-pc-group-section="thumbnailnavigator"
            >
                <component
                    :is="templates.nextthumbnailicon || (isVertical ? 'ChevronDownIcon' : 'ChevronRightIcon')"
                    :class="cx('thumbnailNextIcon')"
                    v-bind="ptm('thumbnailNextIcon')"
                />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, type Slots } from 'vue';
import type { GalleriaResponsiveOptions } from 'rose-spectacles/galleria';
import { addClass, find, findSingle, getAttribute, removeClass, setAttribute } from '../internal/utils/dom/index';
import { localeComparator, sort } from '../internal/utils/object/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ChevronDownIcon from '../icons/chevrondown/ChevronDownIcon.vue';
import ChevronLeftIcon from '../icons/chevronleft/ChevronLeftIcon.vue';
import ChevronRightIcon from '../icons/chevronright/ChevronRightIcon.vue';
import ChevronUpIcon from '../icons/chevronup/ChevronUpIcon.vue';
import Ripple from '../ripple/Ripple';

export default defineComponent({
    name: 'GalleriaThumbnails',
    hostName: 'Galleria',
    extends: BaseComponent,
    emits: ['stop-slideshow', 'update:activeIndex'],
    props: {
        containerId: {
            type: String,
            default: null
        },
        value: {
            type: Array as PropType<unknown[]>,
            default: () => []
        },
        numVisible: {
            type: Number,
            default: 3
        },
        activeIndex: {
            type: Number,
            default: 0
        },
        isVertical: {
            type: Boolean,
            default: false
        },
        slideShowActive: {
            type: Boolean,
            default: false
        },
        circular: {
            type: Boolean,
            default: false
        },
        responsiveOptions: {
            type: Array as PropType<GalleriaResponsiveOptions[]>,
            default: null
        },
        contentHeight: {
            type: String,
            default: '300px'
        },
        showThumbnailNavigators: {
            type: Boolean,
            default: true
        },
        templates: {
            type: Object as PropType<Slots>,
            default: () => ({})
        },
        prevButtonProps: {
            type: null,
            default: null
        },
        nextButtonProps: {
            type: null,
            default: null
        }
    },
    data() {
        return {
            d_numVisible: this.numVisible,
            d_oldNumVisible: this.numVisible,
            d_activeIndex: this.activeIndex,
            d_oldActiveItemIndex: this.activeIndex,
            totalShiftedItems: 0,
            page: 0,
            startPos: null as { x: number; y: number } | null,
            thumbnailsStyle: null as HTMLStyleElement | null,
            sortedResponsiveOptions: null as GalleriaResponsiveOptions[] | null
        };
    },
    watch: {
        numVisible(newValue, oldValue) {
            this.d_numVisible = newValue;
            this.d_oldNumVisible = oldValue;
        },
        activeIndex(newValue, oldValue) {
            this.d_activeIndex = newValue;
            this.d_oldActiveItemIndex = oldValue;
        }
    },
    mounted() {
        this.createStyle();
        this.calculatePosition();

        if (this.responsiveOptions) {
            window.addEventListener('resize', this.calculatePosition);
        }
    },
    updated() {
        const itemsContainer = this.$refs.itemsContainer as HTMLElement;
        let totalShiftedItems = this.totalShiftedItems;

        if (this.d_oldNumVisible !== this.d_numVisible || this.d_oldActiveItemIndex !== this.d_activeIndex) {
            if (this.d_activeIndex <= this.getMedianItemIndex()) {
                totalShiftedItems = 0;
            } else if (this.value.length - this.d_numVisible + this.getMedianItemIndex() < this.d_activeIndex) {
                totalShiftedItems = this.d_numVisible - this.value.length;
            } else if (this.value.length - this.d_numVisible < this.d_activeIndex && this.d_numVisible % 2 === 0) {
                totalShiftedItems = this.d_activeIndex * -1 + this.getMedianItemIndex() + 1;
            } else {
                totalShiftedItems = this.d_activeIndex * -1 + this.getMedianItemIndex();
            }

            if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }

            itemsContainer.style.transform = this.isVertical
                ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)`
                : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;

            if (this.d_oldActiveItemIndex !== this.d_activeIndex) {
                document.body.setAttribute('data-p-items-hidden', 'false');
                !this.isUnstyled && removeClass(itemsContainer, 'rs-items-hidden');
                itemsContainer.style.transition = 'transform 500ms ease 0s';
            }

            this.d_oldActiveItemIndex = this.d_activeIndex;
            this.d_oldNumVisible = this.d_numVisible;
        }
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.calculatePosition);
        this.thumbnailsStyle?.remove();
    },
    methods: {
        step(dir: number) {
            let totalShiftedItems = this.totalShiftedItems + dir;

            if (dir < 0 && -1 * totalShiftedItems + this.d_numVisible > this.value.length - 1) {
                totalShiftedItems = this.d_numVisible - this.value.length;
            } else if (dir > 0 && totalShiftedItems > 0) {
                totalShiftedItems = 0;
            }

            if (this.circular) {
                if (dir < 0 && this.value.length - 1 === this.d_activeIndex) {
                    totalShiftedItems = 0;
                } else if (dir > 0 && this.d_activeIndex === 0) {
                    totalShiftedItems = this.d_numVisible - this.value.length;
                }
            }

            const itemsContainer = this.$refs.itemsContainer as HTMLElement | undefined;

            if (itemsContainer) {
                document.body.setAttribute('data-p-items-hidden', 'false');
                !this.isUnstyled && removeClass(itemsContainer, 'rs-items-hidden');
                itemsContainer.style.transform = this.isVertical
                    ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)`
                    : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;
                itemsContainer.style.transition = 'transform 500ms ease 0s';
            }

            this.totalShiftedItems = totalShiftedItems;
        },
        stopSlideShow() {
            if (this.slideShowActive) {
                this.$emit('stop-slideshow');
            }
        },
        getMedianItemIndex() {
            let index = Math.floor(this.d_numVisible / 2);

            return this.d_numVisible % 2 ? index : index - 1;
        },
        navBackward(e: Event) {
            this.stopSlideShow();

            let prevItemIndex = this.d_activeIndex !== 0 ? this.d_activeIndex - 1 : 0;
            let diff = prevItemIndex + this.totalShiftedItems;

            if (this.d_numVisible - diff - 1 > this.getMedianItemIndex() && (-1 * this.totalShiftedItems !== 0 || this.circular)) {
                this.step(1);
            }

            let activeIndex = this.circular && this.d_activeIndex === 0 ? this.value.length - 1 : prevItemIndex;

            this.$emit('update:activeIndex', activeIndex);

            if (e.cancelable) {
                e.preventDefault();
            }
        },
        navForward(e: Event) {
            this.stopSlideShow();

            let nextItemIndex = this.d_activeIndex === this.value.length - 1 ? this.value.length - 1 : this.d_activeIndex + 1;

            if (
                nextItemIndex + this.totalShiftedItems > this.getMedianItemIndex() &&
                (-1 * this.totalShiftedItems < this.getTotalPageNumber() - 1 || this.circular)
            ) {
                this.step(-1);
            }

            let activeIndex = this.circular && this.value.length - 1 === this.d_activeIndex ? 0 : nextItemIndex;

            this.$emit('update:activeIndex', activeIndex);

            if (e.cancelable) {
                e.preventDefault();
            }
        },
        onItemClick(index: number) {
            this.stopSlideShow();

            let selectedItemIndex = index;

            if (selectedItemIndex !== this.d_activeIndex) {
                const diff = selectedItemIndex + this.totalShiftedItems;
                let dir = 0;

                if (selectedItemIndex < this.d_activeIndex) {
                    dir = this.d_numVisible - diff - 1 - this.getMedianItemIndex();

                    if (dir > 0 && -1 * this.totalShiftedItems !== 0) {
                        this.step(dir);
                    }
                } else {
                    dir = this.getMedianItemIndex() - diff;

                    if (dir < 0 && -1 * this.totalShiftedItems < this.getTotalPageNumber() - 1) {
                        this.step(dir);
                    }
                }

                this.$emit('update:activeIndex', selectedItemIndex);
            }
        },
        onThumbnailKeydown(event: KeyboardEvent, index: number) {
            if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') {
                this.onItemClick(index);
                event.preventDefault();
            }

            switch (event.code) {
                case 'ArrowRight':
                    this.onRightKey();
                    break;

                case 'ArrowLeft':
                    this.onLeftKey();
                    break;

                case 'Home':
                    this.onHomeKey();
                    event.preventDefault();
                    break;

                case 'End':
                    this.onEndKey();
                    event.preventDefault();
                    break;

                case 'ArrowUp':
                case 'ArrowDown':
                    event.preventDefault();
                    break;

                case 'Tab':
                    this.onTabKey();
                    break;

                default:
                    break;
            }
        },
        onRightKey() {
            const indicators = this.getIndicators();
            const activeIndex = this.findFocusedIndicatorIndex();

            this.changedFocusedIndicator(activeIndex, activeIndex + 1 === indicators.length ? indicators.length - 1 : activeIndex + 1);
        },
        onLeftKey() {
            const activeIndex = this.findFocusedIndicatorIndex();

            this.changedFocusedIndicator(activeIndex, activeIndex - 1 <= 0 ? 0 : activeIndex - 1);
        },
        onHomeKey() {
            const activeIndex = this.findFocusedIndicatorIndex();

            this.changedFocusedIndicator(activeIndex, 0);
        },
        onEndKey() {
            const indicators = this.getIndicators();
            const activeIndex = this.findFocusedIndicatorIndex();

            this.changedFocusedIndicator(activeIndex, indicators.length - 1);
        },
        onTabKey() {
            const indicators = this.getIndicators();
            const highlightedIndex = indicators.findIndex((item) => getAttribute(item, 'data-p-active') === true);
            const activeIndex = this.findFocusedIndicatorIndex();
            const active = indicators[activeIndex]?.firstElementChild;
            const highlighted = indicators[highlightedIndex]?.firstElementChild;

            if (active instanceof HTMLElement && highlighted instanceof HTMLElement) {
                active.tabIndex = -1;
                highlighted.tabIndex = 0;
            }
        },
        getIndicators() {
            return find(this.$refs.itemsContainer as HTMLElement, '[data-pc-section="thumbnailitem"]');
        },
        findFocusedIndicatorIndex() {
            const active = findSingle(this.$refs.itemsContainer as HTMLElement, '[data-pc-section="thumbnailitem"] > [tabindex="0"]');

            return this.getIndicators().findIndex((item) => item === active?.parentElement);
        },
        changedFocusedIndicator(prevInd: number, nextInd: number) {
            const indicators = this.getIndicators();
            const previous = indicators[prevInd]?.firstElementChild;
            const next = indicators[nextInd]?.firstElementChild;

            if (previous instanceof HTMLElement && next instanceof HTMLElement) {
                previous.tabIndex = -1;
                next.tabIndex = 0;
                next.focus();
            }
        },
        onTransitionEnd(e: TransitionEvent) {
            const itemsContainer = this.$refs.itemsContainer as HTMLElement | undefined;

            if (itemsContainer && e.propertyName === 'transform') {
                document.body.setAttribute('data-p-items-hidden', 'true');
                !this.isUnstyled && addClass(itemsContainer, 'rs-items-hidden');
                itemsContainer.style.transition = '';
            }
        },
        onTouchStart(e: TouchEvent) {
            const touchobj = e.changedTouches[0];

            if (!touchobj) return;

            this.startPos = {
                x: touchobj.pageX,
                y: touchobj.pageY
            };
        },
        onTouchMove(e: TouchEvent) {
            if (e.cancelable) {
                e.preventDefault();
            }
        },
        onTouchEnd(e: TouchEvent) {
            const touchobj = e.changedTouches[0];

            if (!touchobj || !this.startPos) return;

            if (this.isVertical) {
                this.changePageOnTouch(e, touchobj.pageY - this.startPos.y);
            } else {
                this.changePageOnTouch(e, touchobj.pageX - this.startPos.x);
            }
        },
        changePageOnTouch(e: TouchEvent, diff: number) {
            const touchThreshold = 10;

            if (Math.abs(diff) < touchThreshold) {
                // only a click/tap
                return;
            }
            if (diff < 0) {
                // left
                this.navForward(e);
            } else {
                // right
                this.navBackward(e);
            }
        },
        getTotalPageNumber() {
            return this.value.length > this.d_numVisible ? this.value.length - this.d_numVisible + 1 : 0;
        },
        createStyle() {
            if (!this.thumbnailsStyle) {
                this.thumbnailsStyle = document.createElement('style');
                this.thumbnailsStyle.type = 'text/css';
                setAttribute(this.thumbnailsStyle, 'nonce', this.$primevue?.config?.csp?.nonce);
                document.body.appendChild(this.thumbnailsStyle);
            }

            let innerHTML = `
                #${this.containerId} [data-pc-section="thumbnailitem"] {
                    flex: 1 0 ${100 / this.d_numVisible}%
                }
            `;

            if (this.responsiveOptions && !this.isUnstyled) {
                this.sortedResponsiveOptions = [...this.responsiveOptions];
                const comparer = localeComparator();

                this.sortedResponsiveOptions.sort((data1, data2) => {
                    const value1 = data1.breakpoint;
                    const value2 = data2.breakpoint;

                    return sort(value1, value2, -1, comparer);
                });

                for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
                    let res = this.sortedResponsiveOptions[i];

                    innerHTML += `
                        @media screen and (max-width: ${res.breakpoint}) {
                            #${this.containerId} .rs-galleria-thumbnail-item {
                                flex: 1 0 ${100 / res.numVisible}%
                            }
                        }
                    `;
                }
            }

            this.thumbnailsStyle.innerHTML = innerHTML;
        },
        calculatePosition() {
            if (this.$refs.itemsContainer && this.sortedResponsiveOptions) {
                let windowWidth = window.innerWidth;
                let matchedResponsiveData = {
                    numVisible: this.numVisible
                };

                for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
                    let res = this.sortedResponsiveOptions[i];

                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }

                if (this.d_numVisible !== matchedResponsiveData.numVisible) {
                    this.d_numVisible = matchedResponsiveData.numVisible;
                }
            }
        },
        firstItemAciveIndex() {
            return this.totalShiftedItems * -1;
        },
        lastItemActiveIndex() {
            return this.firstItemAciveIndex() + this.d_numVisible - 1;
        },
        isItemActive(index: number) {
            return this.firstItemAciveIndex() <= index && this.lastItemActiveIndex() >= index;
        },
        ariaPageLabel(value: number) {
            return this.$primevue?.config.locale?.aria?.pageLabel?.replace(/{page}/g, String(value));
        }
    },
    computed: {
        ariaPrevButtonLabel() {
            return this.$primevue?.config.locale?.aria?.prevPageLabel;
        },
        ariaNextButtonLabel() {
            return this.$primevue?.config.locale?.aria?.nextPageLabel;
        },
        isNavBackwardDisabled() {
            return (!this.circular && this.d_activeIndex === 0) || this.value.length <= this.d_numVisible;
        },
        isNavForwardDisabled() {
            return (!this.circular && this.d_activeIndex === this.value.length - 1) || this.value.length <= this.d_numVisible;
        }
    },
    components: {
        ChevronLeftIcon: ChevronLeftIcon,
        ChevronRightIcon: ChevronRightIcon,
        ChevronUpIcon: ChevronUpIcon,
        ChevronDownIcon: ChevronDownIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
