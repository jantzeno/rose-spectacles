<template>
    <PanelMenuSub
        :id="panelId + '_list'"
        :class="cx('rootList')"
        role="tree"
        :tabindex="-1"
        :aria-activedescendant="focused ? focusedItemId : undefined"
        :panelId="panelId"
        :focusedItemId="focused ? focusedItemId : undefined"
        :items="processedItems"
        :templates="templates"
        :activeItemPath="activeItemPath"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeyDown"
        @item-toggle="onItemToggle"
        @item-mousemove="onItemMouseMove"
        :pt="pt"
        :unstyled="unstyled"
        v-bind="ptm('rootList')"
    />
</template>

<script lang="ts">
import { defineComponent, type PropType, type Slots } from 'vue';
import type { MenuItem } from 'rose-spectacles/menuitem';
import type { PanelMenuExpandedKeys } from 'rose-spectacles/panelmenu';
import type { ProcessedMenuItem } from '../internal/processed-menu-item';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { findSingle, focus } from '../internal/utils/dom/index';
import { resolve, isNotEmpty, isPrintableCharacter, findLast, isEmpty } from '../internal/utils/object/index';
import PanelMenuSub from './PanelMenuSub.vue';

interface PanelListItem extends ProcessedMenuItem {
    level: number;
    index: number;
    parent?: PanelListItem;
    parentKey: string;
    items: PanelListItem[];
}

interface FocusedItemChange {
    originalEvent: KeyboardEvent;
    processedItem?: PanelListItem;
    focusOnNext?: boolean;
    selfCheck?: boolean;
    allowHeaderFocus?: boolean;
}

export default defineComponent({
    name: 'PanelMenuList',
    hostName: 'PanelMenu',
    extends: BaseComponent,
    emits: ['item-toggle', 'header-focus'],
    props: {
        panelId: {
            type: String,
            default: null
        },
        items: {
            type: Array as PropType<MenuItem[]>,
            default: () => []
        },
        templates: {
            type: Object as PropType<Slots>,
            default: () => ({})
        },
        expandedKeys: {
            type: Object as PropType<PanelMenuExpandedKeys>,
            default: null
        }
    },
    data() {
        return {
            focused: false,
            focusedItem: null as PanelListItem | null,
            activeItemPath: [] as PanelListItem[],
            searchTimeout: null as ReturnType<typeof setTimeout> | null,
            searchValue: ''
        };
    },
    watch: {
        expandedKeys(newValue) {
            this.autoUpdateActiveItemPath(newValue);
        }
    },
    created() {
        this.autoUpdateActiveItemPath(this.expandedKeys);
    },
    beforeUnmount() {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
    },
    methods: {
        getItemProp(processedItem: PanelListItem, name: string) {
            return processedItem && processedItem.item ? resolve(processedItem.item[name]) : undefined;
        },
        getItemLabel(processedItem: PanelListItem) {
            return this.getItemProp(processedItem, 'label');
        },
        isItemVisible(processedItem: PanelListItem) {
            return this.getItemProp(processedItem, 'visible') !== false;
        },
        isItemDisabled(processedItem: PanelListItem) {
            return this.getItemProp(processedItem, 'disabled');
        },
        isItemActive(processedItem: PanelListItem) {
            return this.activeItemPath.some((path) => path.key === processedItem.parentKey);
        },
        isItemGroup(processedItem: PanelListItem) {
            return isNotEmpty(processedItem.items);
        },
        onFocus(event: FocusEvent) {
            this.focused = true;
            this.focusedItem = this.focusedItem ?? (this.isElementInPanel(event, event.relatedTarget) ? this.findFirstItem() : this.findLastItem()) ?? null;
        },
        onBlur() {
            this.focused = false;
            this.focusedItem = null;
            this.searchValue = '';
        },
        onKeyDown(event: KeyboardEvent) {
            const metaKey = event.metaKey || event.ctrlKey;

            switch (event.code) {
                case 'ArrowDown':
                    this.onArrowDownKey(event);
                    break;

                case 'ArrowUp':
                    this.onArrowUpKey(event);
                    break;

                case 'ArrowLeft':
                    this.onArrowLeftKey(event);
                    break;

                case 'ArrowRight':
                    this.onArrowRightKey(event);
                    break;

                case 'Home':
                    this.onHomeKey(event);
                    break;

                case 'End':
                    this.onEndKey(event);
                    break;

                case 'Space':
                    this.onSpaceKey(event);
                    break;

                case 'Enter':
                case 'NumpadEnter':
                    this.onEnterKey(event);
                    break;

                case 'Escape':
                case 'Tab':
                case 'PageDown':
                case 'PageUp':
                case 'Backspace':
                case 'ShiftLeft':
                case 'ShiftRight':
                    //NOOP
                    break;

                default:
                    if (!metaKey && isPrintableCharacter(event.key)) {
                        this.searchItems(event, event.key);
                    }

                    break;
            }
        },
        onArrowDownKey(event: KeyboardEvent) {
            const processedItem = this.focusedItem ? this.findNextItem(this.focusedItem) : this.findFirstItem();

            this.changeFocusedItem({ originalEvent: event, processedItem, focusOnNext: true });
            event.preventDefault();
        },
        onArrowUpKey(event: KeyboardEvent) {
            const processedItem = this.focusedItem ? this.findPrevItem(this.focusedItem) : this.findLastItem();

            this.changeFocusedItem({ originalEvent: event, processedItem, selfCheck: true });
            event.preventDefault();
        },
        onArrowLeftKey(event: KeyboardEvent) {
            const focused = this.focusedItem;

            if (focused) {
                const matched = this.activeItemPath.some((p) => p.key === focused.key);

                if (matched) {
                    this.activeItemPath = this.activeItemPath.filter((p) => p.key !== focused.key);
                } else {
                    this.focusedItem = focused.parent ?? focused;
                }

                event.preventDefault();
            }
        },
        onArrowRightKey(event: KeyboardEvent) {
            const focused = this.focusedItem;

            if (focused) {
                const grouped = this.isItemGroup(focused);

                if (grouped) {
                    const matched = this.activeItemPath.some((p) => p.key === focused.key);

                    if (matched) {
                        this.onArrowDownKey(event);
                    } else {
                        this.activeItemPath = this.activeItemPath.filter((p) => p.parentKey !== focused.parentKey);
                        this.activeItemPath.push(focused);
                    }
                }

                event.preventDefault();
            }
        },
        onHomeKey(event: KeyboardEvent) {
            this.changeFocusedItem({ originalEvent: event, processedItem: this.findFirstItem(), allowHeaderFocus: false });
            event.preventDefault();
        },
        onEndKey(event: KeyboardEvent) {
            this.changeFocusedItem({ originalEvent: event, processedItem: this.findLastItem(), focusOnNext: true, allowHeaderFocus: false });
            event.preventDefault();
        },
        onEnterKey(event: KeyboardEvent) {
            if (isNotEmpty(this.focusedItem)) {
                const element = findSingle(this.$el, `li[id="${`${this.focusedItemId}`}"]`);
                const anchorElement = element && (findSingle(element, '[data-pc-section="itemlink"]') || findSingle(element, 'a,button'));

                const target = anchorElement ?? element;

                if (target instanceof HTMLElement) target.click();
            }

            event.preventDefault();
        },
        onSpaceKey(event: KeyboardEvent) {
            this.onEnterKey(event);
        },
        onItemToggle(event: { processedItem: PanelListItem; expanded: boolean }) {
            const { processedItem, expanded } = event;

            if (this.expandedKeys) {
                this.$emit('item-toggle', { item: processedItem.item, expanded });
            } else {
                this.activeItemPath = this.activeItemPath.filter((p) => p.parentKey !== processedItem.parentKey);
                expanded && this.activeItemPath.push(processedItem);
            }

            this.focusedItem = processedItem;
            focus(this.$el);
        },
        onItemMouseMove(event: { processedItem: PanelListItem }) {
            if (this.focused) {
                this.focusedItem = event.processedItem;
            }
        },
        isElementInPanel(event: FocusEvent, element: EventTarget | null) {
            const panel = (event.currentTarget as HTMLElement).closest('[data-pc-section="panel"]');

            return panel && element instanceof Node && panel.contains(element);
        },
        isItemMatched(processedItem: PanelListItem) {
            return this.isValidItem(processedItem) && this.getItemLabel(processedItem)?.toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase());
        },
        isVisibleItem(processedItem: PanelListItem) {
            return !!processedItem && (processedItem.level === 0 || this.isItemActive(processedItem)) && this.isItemVisible(processedItem);
        },
        isValidItem(processedItem: PanelListItem) {
            return !!processedItem && !this.isItemDisabled(processedItem) && !this.getItemProp(processedItem, 'separator');
        },
        findFirstItem() {
            return this.visibleItems.find((processedItem) => this.isValidItem(processedItem));
        },
        findLastItem() {
            return findLast(this.visibleItems, (processedItem) => this.isValidItem(processedItem));
        },
        findNextItem(processedItem: PanelListItem) {
            const index = this.visibleItems.findIndex((item) => item.key === processedItem.key);
            const matchedItem = index < this.visibleItems.length - 1 ? this.visibleItems.slice(index + 1).find((pItem) => this.isValidItem(pItem)) : undefined;

            return matchedItem || processedItem;
        },
        findPrevItem(processedItem: PanelListItem) {
            const index = this.visibleItems.findIndex((item) => item.key === processedItem.key);
            const matchedItem = index > 0 ? findLast(this.visibleItems.slice(0, index), (pItem) => this.isValidItem(pItem)) : undefined;

            return matchedItem || processedItem;
        },
        searchItems(event: KeyboardEvent, char: string) {
            const focused = this.focusedItem;

            this.searchValue = (this.searchValue || '') + char;

            let matchedItem: PanelListItem | undefined;
            let matched = false;

            if (focused) {
                const focusedItemIndex = this.visibleItems.findIndex((processedItem) => processedItem.key === focused.key);

                matchedItem = this.visibleItems.slice(focusedItemIndex).find((processedItem) => this.isItemMatched(processedItem));
                matchedItem = isEmpty(matchedItem)
                    ? this.visibleItems.slice(0, focusedItemIndex).find((processedItem) => this.isItemMatched(processedItem))
                    : matchedItem;
            } else {
                matchedItem = this.visibleItems.find((processedItem) => this.isItemMatched(processedItem));
            }

            if (isNotEmpty(matchedItem)) {
                matched = true;
            }

            if (isEmpty(matchedItem) && isEmpty(this.focusedItem)) {
                matchedItem = this.findFirstItem();
            }

            if (isNotEmpty(matchedItem)) {
                this.changeFocusedItem({
                    originalEvent: event,
                    processedItem: matchedItem,
                    allowHeaderFocus: false
                });
            }

            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                this.searchValue = '';
                this.searchTimeout = null;
            }, 500);

            return matched;
        },
        changeFocusedItem(event: FocusedItemChange) {
            const { originalEvent, processedItem, focusOnNext, selfCheck, allowHeaderFocus = true } = event;

            if (this.focusedItem && processedItem && this.focusedItem.key !== processedItem.key) {
                this.focusedItem = processedItem;
                this.scrollInView();
            } else if (allowHeaderFocus) {
                this.$emit('header-focus', { originalEvent, focusOnNext, selfCheck });
            }
        },
        scrollInView() {
            const element = findSingle(this.$el, `li[id="${`${this.focusedItemId}`}"]`);

            if (element) {
                element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' });
            }
        },
        autoUpdateActiveItemPath(expandedKeys?: PanelMenuExpandedKeys | null) {
            this.activeItemPath = Object.entries(expandedKeys || {}).reduce<PanelListItem[]>((acc, [key, val]) => {
                if (val) {
                    const processedItem = this.findProcessedItemByItemKey(key);

                    processedItem && acc.push(processedItem);
                }

                return acc;
            }, []);
        },
        findProcessedItemByItemKey(key: string, processedItems?: PanelListItem[], level = 0): PanelListItem | undefined | null {
            processedItems = processedItems ?? (level === 0 ? this.processedItems : undefined);

            if (!processedItems) return null;

            for (let i = 0; i < processedItems.length; i++) {
                const processedItem = processedItems[i];

                if (this.getItemProp(processedItem, 'key') === key) return processedItem;

                const matchedItem = this.findProcessedItemByItemKey(key, processedItem.items, level + 1);

                if (matchedItem) return matchedItem;
            }
        },
        createProcessedItems(items: MenuItem[] | null | undefined, level = 0, parent?: PanelListItem, parentKey = ''): PanelListItem[] {
            const processedItems: PanelListItem[] = [];

            items &&
                items.forEach((item, index) => {
                    const key = (parentKey !== '' ? parentKey + '_' : '') + index;
                    const newItem: PanelListItem = {
                        item,
                        index,
                        level,
                        key,
                        parent,
                        parentKey,
                        items: []
                    };

                    newItem.items = this.createProcessedItems(item.items, level + 1, newItem, key);
                    processedItems.push(newItem);
                });

            return processedItems;
        },
        flatItems(processedItems: PanelListItem[] | undefined, processedFlattenItems: PanelListItem[] = []): PanelListItem[] {
            processedItems &&
                processedItems.forEach((processedItem) => {
                    if (this.isVisibleItem(processedItem)) {
                        processedFlattenItems.push(processedItem);
                        this.flatItems(processedItem.items, processedFlattenItems);
                    }
                });

            return processedFlattenItems;
        }
    },
    computed: {
        processedItems() {
            return this.createProcessedItems(this.items || []);
        },
        visibleItems() {
            return this.flatItems(this.processedItems);
        },
        focusedItemId() {
            return this.focusedItem ? `${this.panelId}_${this.focusedItem.key}` : undefined;
        }
    },
    components: {
        PanelMenuSub: PanelMenuSub
    }
});
</script>
