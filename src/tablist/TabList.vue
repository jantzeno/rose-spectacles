<template>
    <div ref="list" :class="cx('root')" :data-p="dataP" v-bind="ptmi('root')">
        <button
            v-if="showNavigators && isPrevButtonEnabled"
            ref="prevButton"
            type="button"
            v-ripple
            :class="cx('prevButton')"
            :aria-label="prevButtonAriaLabel"
            :tabindex="tabsContext.tabindex"
            @click="onPrevButtonClick"
            v-bind="ptm('prevButton')"
            data-pc-group-section="navigator"
        >
            <component :is="templates.previcon || 'ChevronLeftIcon'" aria-hidden="true" v-bind="ptm('prevIcon')" />
        </button>
        <div ref="content" :class="cx('content')" @scroll="onScroll" :data-p="dataP" v-bind="ptm('content')">
            <div ref="tabs" :class="cx('tabList')" role="tablist" :aria-orientation="tabsContext.orientation || 'horizontal'" v-bind="ptm('tabList')">
                <slot></slot>
                <span ref="inkbar" :class="cx('activeBar')" role="presentation" aria-hidden="true" v-bind="ptm('activeBar')"></span>
            </div>
        </div>
        <button
            v-if="showNavigators && isNextButtonEnabled"
            ref="nextButton"
            type="button"
            v-ripple
            :class="cx('nextButton')"
            :aria-label="nextButtonAriaLabel"
            :tabindex="tabsContext.tabindex"
            @click="onNextButtonClick"
            v-bind="ptm('nextButton')"
            data-pc-group-section="navigator"
        >
            <component :is="templates.nexticon || 'ChevronRightIcon'" aria-hidden="true" v-bind="ptm('nextIcon')" />
        </button>
    </div>
</template>

<script lang="ts">
import type { TabsContext } from '../tabs/context';
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import { findSingle, getHeight, getOffset, getOuterHeight, getOuterWidth, getWidth, isRTL } from '../internal/utils/dom/index';
import ChevronLeftIcon from '../icons/chevronleft/ChevronLeftIcon.vue';
import ChevronRightIcon from '../icons/chevronright/ChevronRightIcon.vue';
import Ripple from '../ripple/Ripple';
import BaseTabList from './BaseTabList.vue';

interface TabListRefs {
    content?: HTMLElement;
    list?: HTMLElement;
    tabs?: HTMLElement;
    inkbar?: HTMLElement;
    prevButton?: HTMLButtonElement;
    nextButton?: HTMLButtonElement;
}

export default defineComponent({
    name: 'TabList',
    extends: BaseTabList,
    inheritAttrs: false,
    inject: ['$pcTabs'],
    data() {
        return {
            isPrevButtonEnabled: false,
            isNextButtonEnabled: true,
            resizeObserver: undefined as ResizeObserver | undefined,
            inkBarObserver: undefined as ResizeObserver | undefined
        };
    },
    watch: {
        showNavigators(newValue) {
            newValue ? this.bindResizeObserver() : this.unbindResizeObserver();
        },
        activeValue: {
            flush: 'post',
            handler() {
                this.updateInkBar();
                this.bindInkBarObserver();
            }
        }
    },
    mounted() {
        setTimeout(() => {
            this.updateInkBar();
            this.bindInkBarObserver();
        }, 150);

        if (this.showNavigators) {
            this.updateButtonState();
            this.bindResizeObserver();
        }
    },
    updated() {
        this.showNavigators && this.updateButtonState();
    },
    beforeUnmount() {
        this.unbindResizeObserver();
        this.unbindInkBarObserver();
    },
    methods: {
        onScroll(event: Event) {
            this.showNavigators && this.updateButtonState();

            event.preventDefault();
        },
        onPrevButtonClick() {
            const content = this.$refs.content as HTMLElement;
            const buttonWidths = this.getVisibleButtonWidths();
            const width = getWidth(content) - buttonWidths;
            const currentScrollLeft = Math.abs(content.scrollLeft);
            const scrollStep = width * 0.8;
            const targetScrollLeft = currentScrollLeft - scrollStep;
            const scrollLeft = Math.max(targetScrollLeft, 0);

            content.scrollLeft = isRTL(content) ? -1 * scrollLeft : scrollLeft;
        },
        onNextButtonClick() {
            const content = this.$refs.content as HTMLElement;
            const buttonWidths = this.getVisibleButtonWidths();
            const width = getWidth(content) - buttonWidths;
            const currentScrollLeft = Math.abs(content.scrollLeft);
            const scrollStep = width * 0.8;
            const targetScrollLeft = currentScrollLeft + scrollStep;
            const maxScrollLeft = content.scrollWidth - width;
            const scrollLeft = Math.min(targetScrollLeft, maxScrollLeft);

            content.scrollLeft = isRTL(content) ? -1 * scrollLeft : scrollLeft;
        },
        bindResizeObserver() {
            this.resizeObserver = new ResizeObserver(() => this.updateButtonState());
            this.resizeObserver.observe(this.$refs.list as HTMLElement);
        },
        unbindResizeObserver() {
            this.resizeObserver?.unobserve(this.$refs.list as HTMLElement);
            this.resizeObserver = undefined;
        },
        bindInkBarObserver() {
            this.unbindInkBarObserver();

            const { content } = this.$refs as TabListRefs;
            const activeTab = findSingle(content!, '[data-pc-name="tab"][data-p-active="true"]');

            if (activeTab) {
                this.inkBarObserver = new ResizeObserver(() => this.updateInkBar());
                this.inkBarObserver.observe(activeTab);
            }
        },
        unbindInkBarObserver() {
            this.inkBarObserver?.disconnect();
            this.inkBarObserver = undefined;
        },
        updateInkBar() {
            const { content, inkbar, tabs } = this.$refs as TabListRefs;

            if (!inkbar) return;

            const activeTab = findSingle(content!, '[data-pc-name="tab"][data-p-active="true"]');

            if (this.tabsContext.isVertical()) {
                inkbar.style.height = getOuterHeight(activeTab as HTMLElement) + 'px';
                inkbar.style.top = Number(getOffset(activeTab).top) - Number(getOffset(tabs).top) + 'px';
            } else {
                inkbar.style.width = getOuterWidth(activeTab) + 'px';
                inkbar.style.left = Number(getOffset(activeTab).left) - Number(getOffset(tabs).left) + 'px';
            }
        },
        updateButtonState() {
            const { list, content } = this.$refs as TabListRefs;

            if (!list || !content) return;

            const { scrollTop, scrollWidth, scrollHeight, offsetWidth, offsetHeight } = content;
            const scrollLeft = Math.abs(content.scrollLeft);
            const [width, height] = [getWidth(content), getHeight(content)];

            if (this.tabsContext.isVertical()) {
                this.isPrevButtonEnabled = scrollTop !== 0;
                this.isNextButtonEnabled = list.offsetHeight >= offsetHeight && parseInt(String(scrollTop)) !== scrollHeight - height;
            } else {
                this.isPrevButtonEnabled = scrollLeft !== 0;
                this.isNextButtonEnabled = list.offsetWidth >= offsetWidth && parseInt(String(scrollLeft)) !== scrollWidth - width;
            }
        },
        getVisibleButtonWidths() {
            const { prevButton, nextButton } = this.$refs as TabListRefs;
            let width = 0;

            if (this.showNavigators) {
                width = (prevButton?.offsetWidth || 0) + (nextButton?.offsetWidth || 0);
            }

            return width;
        }
    },
    computed: {
        tabsContext() {
            return this.$pcTabs as TabsContext;
        },
        templates() {
            return this.tabsContext.$slots;
        },
        activeValue() {
            return this.tabsContext.d_value;
        },
        showNavigators() {
            return this.tabsContext.showNavigators;
        },
        prevButtonAriaLabel() {
            return this.$primevue.config.locale!.aria ? this.$primevue.config.locale!.aria.previous : undefined;
        },
        nextButtonAriaLabel() {
            return this.$primevue.config.locale!.aria ? this.$primevue.config.locale!.aria.next : undefined;
        },
        dataP() {
            return cn({
                scrollable: this.tabsContext.scrollable
            });
        }
    },
    components: {
        ChevronLeftIcon,
        ChevronRightIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
