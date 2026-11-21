<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <div :class="cx('contentContainer')" v-bind="ptm('contentContainer')">
            <div ref="content" :id="contentId" :class="cx('content')" @scroll="onScroll" @mouseenter="moveBar" v-bind="ptm('content')">
                <slot></slot>
            </div>
        </div>
        <div
            ref="xBar"
            :class="cx('barx')"
            tabindex="0"
            role="scrollbar"
            aria-orientation="horizontal"
            :aria-controls="contentId"
            :aria-valuenow="lastScrollLeft"
            @mousedown="onXBarMouseDown"
            @keydown="onKeyDown($event)"
            @keyup="onKeyUp"
            @focus="onFocus"
            @blur="onBlur"
            v-bind="ptm('barx')"
            data-pc-group-section="bar"
        ></div>
        <div
            ref="yBar"
            :class="cx('bary')"
            tabindex="0"
            role="scrollbar"
            aria-orientation="vertical"
            :aria-controls="contentId"
            :aria-valuenow="lastScrollTop"
            @mousedown="onYBarMouseDown"
            @keydown="onKeyDown($event)"
            @keyup="onKeyUp"
            @focus="onFocus"
            v-bind="ptm('bary')"
            data-pc-group-section="bar"
        ></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { addClass, getHeight, removeClass } from '../internal/utils/dom/index';
import BaseScrollPanel from './BaseScrollPanel.vue';

type ScrollElements = { content: HTMLDivElement; xBar: HTMLDivElement; yBar: HTMLDivElement };
type ScrollAxis = 'scrollTop' | 'scrollLeft';

export default defineComponent({
    name: 'ScrollPanel',
    extends: BaseScrollPanel,
    inheritAttrs: false,
    data() {
        return {
            initialized: false,
            documentResizeListener: null as (() => void) | null,
            documentMouseMoveListener: null as ((event: MouseEvent) => void) | null,
            documentMouseUpListener: null as (() => void) | null,
            frame: null as number | null,
            scrollXRatio: 0,
            scrollYRatio: 0,
            isXBarClicked: false,
            isYBarClicked: false,
            lastPageX: 0,
            lastPageY: 0,
            timer: null as ReturnType<typeof setTimeout> | null,
            orientation: 'vertical' as 'vertical' | 'horizontal',
            lastScrollTop: 0,
            lastScrollLeft: 0
        };
    },
    mounted() {
        if ((this.$el as HTMLElement).offsetParent) {
            this.initialize();
        }
    },
    updated() {
        if (!this.initialized && (this.$el as HTMLElement).offsetParent) {
            this.initialize();
        }
    },
    beforeUnmount() {
        if (this.isXBarClicked || this.isYBarClicked) {
            this.onDocumentMouseUp();
        }

        this.clearTimer();
        this.unbindDocumentResizeListener();

        if (this.frame !== null) {
            if (window.cancelAnimationFrame) window.cancelAnimationFrame(this.frame);
            else window.clearTimeout(this.frame);
        }
    },
    methods: {
        initialize() {
            this.moveBar();
            this.bindDocumentResizeListener();
            this.calculateContainerHeight();
        },
        calculateContainerHeight() {
            const root = this.$el as HTMLElement;
            const { content, xBar } = this.$refs as ScrollElements;

            let containerStyles = getComputedStyle(root),
                xBarStyles = getComputedStyle(xBar),
                pureContainerHeight = getHeight(root) - parseInt(xBarStyles['height'], 10);

            if (containerStyles.maxHeight !== 'none' && pureContainerHeight === 0) {
                if (content.offsetHeight + parseInt(xBarStyles.height, 10) > parseInt(containerStyles.maxHeight, 10)) {
                    root.style.height = containerStyles.maxHeight;
                } else {
                    root.style.height =
                        content.offsetHeight +
                        parseFloat(containerStyles.paddingTop) +
                        parseFloat(containerStyles.paddingBottom) +
                        parseFloat(containerStyles.borderTopWidth) +
                        parseFloat(containerStyles.borderBottomWidth) +
                        'px';
                }
            }
        },
        moveBar() {
            const root = this.$el as HTMLElement;
            const { content, xBar, yBar } = this.$refs as ScrollElements;

            if (content) {
                /* horizontal scroll */
                let totalWidth = content.scrollWidth;
                let ownWidth = content.clientWidth;
                let bottom = (root.clientHeight - xBar.clientHeight) * -1;

                this.scrollXRatio = ownWidth / totalWidth;

                /* vertical scroll */
                let totalHeight = content.scrollHeight;
                let ownHeight = content.clientHeight;
                let right = (root.clientWidth - yBar.clientWidth) * -1;

                this.scrollYRatio = ownHeight / totalHeight;

                const scrollBarWidth = Math.max(this.scrollXRatio * 100, 10);
                const scrollBarHeight = Math.max(this.scrollYRatio * 100, 10);

                this.frame = this.requestAnimationFrame(() => {
                    if (xBar) {
                        if (this.scrollXRatio >= 1) {
                            xBar.setAttribute('data-p-scrollpanel-hidden', 'true');
                            !this.isUnstyled && addClass(xBar, 'rs-scrollpanel-hidden');
                        } else {
                            xBar.setAttribute('data-p-scrollpanel-hidden', 'false');
                            !this.isUnstyled && removeClass(xBar, 'rs-scrollpanel-hidden');

                            xBar.style.cssText =
                                'width:' +
                                scrollBarWidth +
                                '%; inset-inline-start:' +
                                (Math.abs(content.scrollLeft) / (totalWidth - ownWidth)) * (100 - scrollBarWidth) +
                                '%;bottom:' +
                                bottom +
                                'px;';
                        }
                    }

                    if (yBar) {
                        if (this.scrollYRatio >= 1) {
                            yBar.setAttribute('data-p-scrollpanel-hidden', 'true');
                            !this.isUnstyled && addClass(yBar, 'rs-scrollpanel-hidden');
                        } else {
                            yBar.setAttribute('data-p-scrollpanel-hidden', 'false');
                            !this.isUnstyled && removeClass(yBar, 'rs-scrollpanel-hidden');

                            yBar.style.cssText =
                                'height:' +
                                scrollBarHeight +
                                '%; top: calc(' +
                                (content.scrollTop / (totalHeight - ownHeight)) * (100 - scrollBarHeight) +
                                '% - ' +
                                xBar.clientHeight +
                                'px); inset-inline-end:' +
                                right +
                                'px;';
                        }
                    }
                });
            }
        },
        onYBarMouseDown(e: MouseEvent) {
            const { yBar } = this.$refs as ScrollElements;

            this.isYBarClicked = true;
            yBar.focus();
            this.lastPageY = e.pageY;
            yBar.setAttribute('data-p-scrollpanel-grabbed', 'true');
            !this.isUnstyled && addClass(yBar, 'rs-scrollpanel-grabbed');
            document.body.setAttribute('data-p-scrollpanel-grabbed', 'true');
            !this.isUnstyled && addClass(document.body, 'rs-scrollpanel-grabbed');

            this.bindDocumentMouseListeners();
            e.preventDefault();
        },
        onXBarMouseDown(e: MouseEvent) {
            const { xBar, yBar } = this.$refs as ScrollElements;

            this.isXBarClicked = true;
            xBar.focus();
            this.lastPageX = e.pageX;
            yBar.setAttribute('data-p-scrollpanel-grabbed', 'false');
            !this.isUnstyled && addClass(xBar, 'rs-scrollpanel-grabbed');
            document.body.setAttribute('data-p-scrollpanel-grabbed', 'false');
            !this.isUnstyled && addClass(document.body, 'rs-scrollpanel-grabbed');

            this.bindDocumentMouseListeners();
            e.preventDefault();
        },
        onScroll(event: Event) {
            const target = event.target as HTMLElement;

            if (this.lastScrollLeft !== target.scrollLeft) {
                this.lastScrollLeft = target.scrollLeft;
                this.orientation = 'horizontal';
            } else if (this.lastScrollTop !== target.scrollTop) {
                this.lastScrollTop = target.scrollTop;
                this.orientation = 'vertical';
            }

            this.moveBar();
        },
        onKeyDown(event: KeyboardEvent) {
            if (this.orientation === 'vertical') {
                switch (event.code) {
                    case 'ArrowDown': {
                        this.setTimer('scrollTop', this.step);
                        event.preventDefault();
                        break;
                    }

                    case 'ArrowUp': {
                        this.setTimer('scrollTop', this.step * -1);
                        event.preventDefault();
                        break;
                    }

                    case 'ArrowLeft':

                    case 'ArrowRight': {
                        event.preventDefault();
                        break;
                    }

                    default:
                        //no op
                        break;
                }
            } else if (this.orientation === 'horizontal') {
                switch (event.code) {
                    case 'ArrowRight': {
                        this.setTimer('scrollLeft', this.step);
                        event.preventDefault();
                        break;
                    }

                    case 'ArrowLeft': {
                        this.setTimer('scrollLeft', this.step * -1);
                        event.preventDefault();
                        break;
                    }

                    case 'ArrowDown':

                    case 'ArrowUp': {
                        event.preventDefault();
                        break;
                    }

                    default:
                        //no op
                        break;
                }
            }
        },
        onKeyUp() {
            this.clearTimer();
        },
        repeat(bar: ScrollAxis, step: number) {
            const { content } = this.$refs as ScrollElements;

            content[bar] += step;
            this.moveBar();
        },
        setTimer(bar: ScrollAxis, step: number) {
            this.clearTimer();
            this.timer = setTimeout(() => {
                this.repeat(bar, step);
            }, 40);
        },
        clearTimer() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        },
        onDocumentMouseMove(e: MouseEvent) {
            if (this.isXBarClicked) {
                this.onMouseMoveForXBar(e);
            } else if (this.isYBarClicked) {
                this.onMouseMoveForYBar(e);
            } else {
                this.onMouseMoveForXBar(e);
                this.onMouseMoveForYBar(e);
            }
        },
        onMouseMoveForXBar(e: MouseEvent) {
            const { content } = this.$refs as ScrollElements;

            let deltaX = e.pageX - this.lastPageX;

            this.lastPageX = e.pageX;

            this.frame = this.requestAnimationFrame(() => {
                content.scrollLeft += deltaX / this.scrollXRatio;
            });
        },
        onMouseMoveForYBar(e: MouseEvent) {
            const { content } = this.$refs as ScrollElements;

            let deltaY = e.pageY - this.lastPageY;

            this.lastPageY = e.pageY;

            this.frame = this.requestAnimationFrame(() => {
                content.scrollTop += deltaY / this.scrollYRatio;
            });
        },
        onFocus(event: FocusEvent) {
            const { xBar, yBar } = this.$refs as ScrollElements;

            if (xBar === event.target) {
                this.orientation = 'horizontal';
            } else if (yBar === event.target) {
                this.orientation = 'vertical';
            }
        },
        onBlur() {
            if (this.orientation === 'horizontal') {
                this.orientation = 'vertical';
            }
        },
        onDocumentMouseUp() {
            const { xBar, yBar } = this.$refs as ScrollElements;

            yBar.setAttribute('data-p-scrollpanel-grabbed', 'false');
            !this.isUnstyled && removeClass(yBar, 'rs-scrollpanel-grabbed');
            xBar.setAttribute('data-p-scrollpanel-grabbed', 'false');
            !this.isUnstyled && removeClass(xBar, 'rs-scrollpanel-grabbed');
            document.body.setAttribute('data-p-scrollpanel-grabbed', 'false');
            !this.isUnstyled && removeClass(document.body, 'rs-scrollpanel-grabbed');

            this.unbindDocumentMouseListeners();
            this.isXBarClicked = false;
            this.isYBarClicked = false;
        },
        requestAnimationFrame(callback: FrameRequestCallback) {
            return window.requestAnimationFrame ? window.requestAnimationFrame(callback) : window.setTimeout(() => callback(performance.now()), 0);
        },
        refresh() {
            this.moveBar();
        },
        scrollTop(scrollTop: number) {
            const { content } = this.$refs as ScrollElements;

            let scrollableHeight = content.scrollHeight - content.clientHeight;

            scrollTop = scrollTop > scrollableHeight ? scrollableHeight : scrollTop > 0 ? scrollTop : 0;
            content.scrollTop = scrollTop;
        },
        bindDocumentMouseListeners() {
            if (!this.documentMouseMoveListener) {
                this.documentMouseMoveListener = (e) => {
                    this.onDocumentMouseMove(e);
                };

                document.addEventListener('mousemove', this.documentMouseMoveListener);
            }

            if (!this.documentMouseUpListener) {
                this.documentMouseUpListener = this.onDocumentMouseUp;

                document.addEventListener('mouseup', this.documentMouseUpListener);
            }
        },
        unbindDocumentMouseListeners() {
            if (this.documentMouseMoveListener) {
                document.removeEventListener('mousemove', this.documentMouseMoveListener);
                this.documentMouseMoveListener = null;
            }

            if (this.documentMouseUpListener) {
                document.removeEventListener('mouseup', this.documentMouseUpListener);
                this.documentMouseUpListener = null;
            }
        },
        bindDocumentResizeListener() {
            if (!this.documentResizeListener) {
                this.documentResizeListener = () => {
                    this.moveBar();
                };

                window.addEventListener('resize', this.documentResizeListener);
            }
        },
        unbindDocumentResizeListener() {
            if (this.documentResizeListener) {
                window.removeEventListener('resize', this.documentResizeListener);
                this.documentResizeListener = null;
            }
        }
    },
    computed: {
        contentId() {
            return this.$id + '_content';
        }
    }
});
</script>
