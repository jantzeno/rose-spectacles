<template>
    <div :class="cx('root')" role="tablist" v-bind="ptmi('root')">
        <div :class="cx('navContainer')" v-bind="ptm('navContainer')">
            <button
                v-if="scrollable && !isPrevButtonDisabled"
                ref="prevBtn"
                v-ripple
                type="button"
                :class="cx('prevButton')"
                :tabindex="tabindex"
                :aria-label="prevButtonAriaLabel"
                @click="onPrevButtonClick"
                v-bind="{ ...prevButtonProps, ...ptm('prevButton') }"
                data-pc-group-section="navbutton"
            >
                <slot name="previcon">
                    <component :is="prevIcon ? 'span' : 'ChevronLeftIcon'" aria-hidden="true" :class="prevIcon" v-bind="ptm('prevIcon')" />
                </slot>
            </button>
            <div ref="content" :class="cx('navContent')" @scroll="onScroll" v-bind="ptm('navContent')">
                <ul ref="nav" :class="cx('nav')" v-bind="ptm('nav')">
                    <li
                        v-for="(tab, index) of tabs"
                        :key="getKey(tab, index)"
                        :style="getTabProp(tab, 'headerStyle')"
                        :class="cx('tab.header', { tab, index })"
                        role="presentation"
                        v-bind="{ ...getTabProp(tab, 'headerProps'), ...getTabPT(tab, 'root', index), ...getTabPT(tab, 'header', index) }"
                        data-pc-name="tabpanel"
                        :data-p-active="d_activeIndex === index"
                        :data-p-disabled="getTabProp(tab, 'disabled')"
                        :data-pc-index="index"
                    >
                        <a
                            :id="getTabHeaderActionId(index)"
                            v-ripple
                            :class="cx('tab.headerAction')"
                            :tabindex="getTabProp(tab, 'disabled') || !isTabActive(index) ? -1 : tabindex"
                            role="tab"
                            :aria-disabled="getTabProp(tab, 'disabled')"
                            :aria-selected="isTabActive(index)"
                            :aria-controls="getTabContentId(index)"
                            @click="onTabClick($event, tab, index)"
                            @keydown="onTabKeyDown($event, tab, index)"
                            v-bind="{ ...getTabProp(tab, 'headerActionProps'), ...getTabPT(tab, 'headerAction', index) }"
                        >
                            <span v-if="tab.props && tab.props.header" :class="cx('tab.headerTitle')" v-bind="getTabPT(tab, 'headerTitle', index)">{{
                                tab.props.header
                            }}</span>
                            <component v-if="getTabHeader(tab)" :is="getTabHeader(tab)"></component>
                        </a>
                    </li>
                    <li ref="inkbar" :class="cx('inkbar')" role="presentation" aria-hidden="true" v-bind="ptm('inkbar')"></li>
                </ul>
            </div>
            <button
                v-if="scrollable && !isNextButtonDisabled"
                ref="nextBtn"
                v-ripple
                type="button"
                :class="cx('nextButton')"
                :tabindex="tabindex"
                :aria-label="nextButtonAriaLabel"
                @click="onNextButtonClick"
                v-bind="{ ...nextButtonProps, ...ptm('nextButton') }"
                data-pc-group-section="navbutton"
            >
                <slot name="nexticon">
                    <component :is="nextIcon ? 'span' : 'ChevronRightIcon'" aria-hidden="true" :class="nextIcon" v-bind="ptm('nextIcon')" />
                </slot>
            </button>
        </div>
        <div :class="cx('panelContainer')" v-bind="ptm('panelContainer')">
            <template v-for="(tab, index) of tabs" :key="getKey(tab, index)">
                <div
                    v-if="lazy ? isTabActive(index) : true"
                    v-show="lazy ? true : isTabActive(index)"
                    :id="getTabContentId(index)"
                    :style="getTabProp(tab, 'contentStyle')"
                    :class="cx('tab.content', { tab })"
                    role="tabpanel"
                    :aria-labelledby="getTabHeaderActionId(index)"
                    v-bind="{ ...getTabProp(tab, 'contentProps'), ...getTabPT(tab, 'root', index), ...getTabPT(tab, 'content', index) }"
                    data-pc-name="tabpanel"
                    :data-pc-index="index"
                    :data-p-active="d_activeIndex === index"
                >
                    <component :is="tab"></component>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { findSingle, focus, getAttribute, getOffset, getWidth } from '../internal/utils/dom/index';
import ChevronLeftIcon from '../icons/chevronleft/ChevronLeftIcon.vue';
import ChevronRightIcon from '../icons/chevronright/ChevronRightIcon.vue';
import Ripple from '../ripple/Ripple';
import { defineComponent, isVNode, mergeProps, type ComponentOptions, type Slots, type VNode } from 'vue';
import BaseTabView from './BaseTabView.vue';

export default defineComponent({
    name: 'TabView',
    extends: BaseTabView,
    inheritAttrs: false,
    emits: ['update:activeIndex', 'tab-change', 'tab-click'],
    data() {
        return {
            d_activeIndex: this.activeIndex,
            isPrevButtonDisabled: true,
            isNextButtonDisabled: false
        };
    },
    watch: {
        activeIndex(newValue) {
            this.d_activeIndex = newValue;

            this.scrollInView({ index: newValue });
        }
    },
    mounted() {
        console.warn('Deprecated since v4. Use Tabs component instead.');

        this.updateInkBar();
        this.scrollable && this.updateButtonState();
    },
    updated() {
        this.updateInkBar();
        this.scrollable && this.updateButtonState();
    },
    methods: {
        isTabPanel(child: VNode): boolean {
            return (child.type as ComponentOptions)?.name === 'TabPanel';
        },
        isTabActive(index: number) {
            return this.d_activeIndex === index;
        },
        getTabProp(tab: VNode, name: string) {
            return tab.props ? tab.props[name] : undefined;
        },
        getTabHeader(tab: VNode) {
            return (tab.children as Slots | null)?.header;
        },
        getKey(tab: VNode, index: number) {
            return this.getTabProp(tab, 'header') || index;
        },
        getTabHeaderActionId(index: number) {
            return `${this.$id}_${index}_header_action`;
        },
        getTabContentId(index: number) {
            return `${this.$id}_${index}_content`;
        },
        getTabPT(tab: VNode, key: string, index: number) {
            const count = this.tabs.length;
            const tabMetaData = {
                props: tab.props,
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    index,
                    count,
                    first: index === 0,
                    last: index === count - 1,
                    active: this.isTabActive(index)
                }
            };

            return mergeProps(
                this.ptm(`tabpanel.${key}`, { tabpanel: tabMetaData }),
                this.ptm(`tabpanel.${key}`, tabMetaData),
                this.ptmo(this.getTabProp(tab, 'pt'), key, tabMetaData)
            );
        },
        onScroll(event: Event) {
            this.scrollable && this.updateButtonState();

            event.preventDefault();
        },
        onPrevButtonClick() {
            const content = this.$refs.content as HTMLElement;
            const width = getWidth(content);
            const pos = content.scrollLeft - width;

            content.scrollLeft = pos <= 0 ? 0 : pos;
        },
        onNextButtonClick() {
            const content = this.$refs.content as HTMLElement;
            const width = getWidth(content) - this.getVisibleButtonWidths();
            const pos = content.scrollLeft + width;
            const lastPos = content.scrollWidth - width;

            content.scrollLeft = pos >= lastPos ? lastPos : pos;
        },
        onTabClick(event: MouseEvent, tab: VNode, index: number) {
            this.changeActiveIndex(event, tab, index);
            this.$emit('tab-click', { originalEvent: event, index });
        },
        onTabKeyDown(event: KeyboardEvent, tab: VNode, index: number) {
            switch (event.code) {
                case 'ArrowLeft':
                    this.onTabArrowLeftKey(event);
                    break;

                case 'ArrowRight':
                    this.onTabArrowRightKey(event);
                    break;

                case 'Home':
                    this.onTabHomeKey(event);
                    break;

                case 'End':
                    this.onTabEndKey(event);
                    break;

                case 'PageDown':
                    this.onPageDownKey(event);
                    break;

                case 'PageUp':
                    this.onPageUpKey(event);
                    break;

                case 'Enter':
                case 'NumpadEnter':
                case 'Space':
                    this.onTabEnterKey(event, tab, index);
                    break;

                default:
                    break;
            }
        },
        onTabArrowRightKey(event: KeyboardEvent) {
            const nextHeaderAction = this.findNextHeaderAction((event.target as Element | null)?.parentElement ?? null);

            nextHeaderAction ? this.changeFocusedTab(event, nextHeaderAction) : this.onTabHomeKey(event);
            event.preventDefault();
        },
        onTabArrowLeftKey(event: KeyboardEvent) {
            const prevHeaderAction = this.findPrevHeaderAction((event.target as Element | null)?.parentElement ?? null);

            prevHeaderAction ? this.changeFocusedTab(event, prevHeaderAction) : this.onTabEndKey(event);
            event.preventDefault();
        },
        onTabHomeKey(event: KeyboardEvent) {
            const firstHeaderAction = this.findFirstHeaderAction();

            this.changeFocusedTab(event, firstHeaderAction);
            event.preventDefault();
        },
        onTabEndKey(event: KeyboardEvent) {
            const lastHeaderAction = this.findLastHeaderAction();

            this.changeFocusedTab(event, lastHeaderAction);
            event.preventDefault();
        },
        onPageDownKey(event: KeyboardEvent) {
            this.scrollInView({ index: (this.$refs.nav as HTMLElement).children.length - 2 });
            event.preventDefault();
        },
        onPageUpKey(event: KeyboardEvent) {
            this.scrollInView({ index: 0 });
            event.preventDefault();
        },
        onTabEnterKey(event: KeyboardEvent, tab: VNode, index: number) {
            this.changeActiveIndex(event, tab, index);

            event.preventDefault();
        },
        findNextHeaderAction(tabElement: Element | null, selfCheck = false): Element | null {
            const headerElement = selfCheck ? tabElement : tabElement?.nextElementSibling;

            return headerElement
                ? getAttribute(headerElement, 'data-p-disabled') || getAttribute(headerElement, 'data-pc-section') === 'inkbar'
                    ? this.findNextHeaderAction(headerElement)
                    : findSingle(headerElement, '[data-pc-section="headeraction"]')
                : null;
        },
        findPrevHeaderAction(tabElement: Element | null, selfCheck = false): Element | null {
            const headerElement = selfCheck ? tabElement : tabElement?.previousElementSibling;

            return headerElement
                ? getAttribute(headerElement, 'data-p-disabled') || getAttribute(headerElement, 'data-pc-section') === 'inkbar'
                    ? this.findPrevHeaderAction(headerElement)
                    : findSingle(headerElement, '[data-pc-section="headeraction"]')
                : null;
        },
        findFirstHeaderAction() {
            return this.findNextHeaderAction((this.$refs.nav as HTMLElement).firstElementChild, true);
        },
        findLastHeaderAction() {
            return this.findPrevHeaderAction((this.$refs.nav as HTMLElement).lastElementChild, true);
        },
        changeActiveIndex(event: Event, tab: VNode, index: number) {
            if (!this.getTabProp(tab, 'disabled') && this.d_activeIndex !== index) {
                this.d_activeIndex = index;

                this.$emit('update:activeIndex', index);
                this.$emit('tab-change', { originalEvent: event, index });

                this.scrollInView({ index });
            }
        },
        changeFocusedTab(event: KeyboardEvent, element: Element | null) {
            if (element instanceof HTMLElement) {
                focus(element);
                this.scrollInView({ element });

                if (this.selectOnFocus) {
                    const index = parseInt(element.parentElement?.dataset.pcIndex ?? '', 10);
                    const tab = this.tabs[index];

                    if (tab) this.changeActiveIndex(event, tab, index);
                }
            }
        },
        scrollInView({ element, index = -1 }: { element?: Element; index?: number }) {
            const currentElement = element || (this.$refs.nav as HTMLElement).children[index];

            if (currentElement) {
                currentElement.scrollIntoView && currentElement.scrollIntoView({ block: 'nearest' });
            }
        },
        updateInkBar() {
            const nav = this.$refs.nav as HTMLElement;
            const inkbar = this.$refs.inkbar as HTMLElement;
            const tabHeader = nav.children[this.d_activeIndex];

            if (!(tabHeader instanceof HTMLElement)) return;

            inkbar.style.width = getWidth(tabHeader) + 'px';
            inkbar.style.left = getOffset(tabHeader).left - getOffset(nav).left + 'px';
        },
        updateButtonState() {
            const content = this.$refs.content as HTMLElement;
            const { scrollLeft, scrollWidth } = content;
            const width = getWidth(content);

            this.isPrevButtonDisabled = scrollLeft === 0;
            this.isNextButtonDisabled = Math.trunc(scrollLeft) === scrollWidth - width;
        },
        getVisibleButtonWidths() {
            const { prevBtn, nextBtn } = this.$refs as { prevBtn?: HTMLElement; nextBtn?: HTMLElement };

            return [prevBtn, nextBtn].reduce((acc, el) => (el ? acc + getWidth(el) : acc), 0);
        }
    },
    computed: {
        tabs(): VNode[] {
            return (this.$slots.default?.() ?? []).reduce<VNode[]>((tabs, child) => {
                if (this.isTabPanel(child)) {
                    tabs.push(child);
                } else if (child.children && child.children instanceof Array) {
                    child.children.forEach((nestedChild) => {
                        if (isVNode(nestedChild) && this.isTabPanel(nestedChild)) {
                            tabs.push(nestedChild);
                        }
                    });
                }

                return tabs;
            }, []);
        },
        prevButtonAriaLabel() {
            return this.$primevue?.config.locale?.aria?.previous;
        },
        nextButtonAriaLabel() {
            return this.$primevue?.config.locale?.aria?.next;
        }
    },
    directives: {
        ripple: Ripple
    },
    components: {
        ChevronLeftIcon,
        ChevronRightIcon
    }
});
</script>
