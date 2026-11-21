<template>
    <Portal :appendTo="appendTo">
        <transition
            name="rs-anchored-overlay"
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @leave="onLeave"
            @after-leave="onAfterLeave"
            v-bind="ptm('transition')"
        >
            <div v-if="visible" :ref="containerRef" :class="cx('root')" v-bind="ptmi('root')">
                <ContextMenuSub
                    :ref="listRef"
                    :id="$id + '_list'"
                    :class="cx('rootList')"
                    role="menubar"
                    :root="true"
                    :tabindex="tabindex"
                    aria-orientation="vertical"
                    :aria-activedescendant="focused ? focusedItemIdx : undefined"
                    :menuId="$id"
                    :focusedItemId="focused ? focusedItemIdx : undefined"
                    :items="processedItems"
                    :templates="$slots"
                    :activeItemPath="activeItemPath"
                    :aria-labelledby="ariaLabelledby"
                    :aria-label="ariaLabel"
                    :level="0"
                    :visible="submenuVisible"
                    :pt="pt"
                    :unstyled="unstyled"
                    @focus="onFocus"
                    @blur="onBlur"
                    @keydown="onKeyDown"
                    @item-click="onItemClick"
                    @item-mouseenter="onItemMouseEnter"
                    @item-mousemove="onItemMouseMove"
                />
            </div>
        </transition>
    </Portal>
</template>

<script lang="ts">
import { addStyle, findSingle, focus, getHiddenElementOuterHeight, getHiddenElementOuterWidth, getViewport, isTouchDevice } from '../internal/utils/dom/index';
import { findLastIndex, isEmpty, isNotEmpty, isPrintableCharacter, resolve } from '../internal/utils/object/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { SafeTriangle } from '../core/utils/Utils';
import Portal from '../portal/Portal.vue';
import { defineComponent, type ComponentPublicInstance } from 'vue';
import type { MenuItem } from '../menuitem/MenuItem';
import type { MenuItemEvent, MenuNavigationItem } from '../internal/processed-menu-item';
import BaseContextMenu from './BaseContextMenu.vue';
import ContextMenuSub from './ContextMenuSub.vue';

export default defineComponent({
    name: 'ContextMenu',
    extends: BaseContextMenu,
    inheritAttrs: false,
    emits: ['focus', 'blur', 'show', 'hide', 'before-show', 'before-hide'],
    data() {
        return {
            focused: false,
            focusedItemInfo: { index: -1, level: 0, parentKey: '' },
            activeItemPath: [] as MenuNavigationItem[],
            visible: false,
            submenuVisible: false,
            query: null as MediaQueryList | null,
            queryMatches: false,
            matchMediaListener: null as (() => void) | null,
            safeTriangle: null as SafeTriangle | null,
            outsideClickListener: null as ((event: MouseEvent) => void) | null,
            resizeListener: null as ((event: Event) => void) | null,
            searchValue: '',
            searchTimeout: null as ReturnType<typeof setTimeout> | null,
            container: null as HTMLElement | null,
            list: null as HTMLElement | null,
            pageX: 0,
            pageY: 0,
            documentContextMenuListener: null as ((event: MouseEvent) => void) | null
        };
    },
    watch: {
        activeItemPath(newPath) {
            if (isNotEmpty(newPath)) {
                this.bindOutsideClickListener();
                this.bindResizeListener();
            } else if (!this.visible) {
                this.unbindOutsideClickListener();
                this.unbindResizeListener();
            }

            if (isNotEmpty(newPath)) {
                this.bindSafeTriangle();
            } else {
                this.unbindSafeTriangle();
            }
        }
    },
    mounted() {
        this.bindMatchMediaListener();

        if (this.global) {
            this.bindDocumentContextMenuListener();
        }
    },
    beforeUnmount() {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.unbindResizeListener();
        this.unbindOutsideClickListener();
        this.unbindDocumentContextMenuListener();
        this.unbindMatchMediaListener();
        this.unbindSafeTriangle();

        if (this.container && this.autoZIndex) {
            ZIndex.clear(this.container);
        }

        this.container = null;
    },
    methods: {
        getItemProp(item: MenuItem | undefined, name: string) {
            return item ? resolve(item[name]) : undefined;
        },
        getItemLabel(item: MenuItem) {
            return this.getItemProp(item, 'label');
        },
        isItemDisabled(item: MenuItem) {
            return this.getItemProp(item, 'disabled');
        },
        isItemVisible(item: MenuItem) {
            return this.getItemProp(item, 'visible') !== false;
        },
        isItemGroup(item: MenuItem) {
            return isNotEmpty(this.getItemProp(item, 'items'));
        },
        isItemSeparator(item: MenuItem) {
            return this.getItemProp(item, 'separator');
        },
        getProccessedItemLabel(processedItem: MenuNavigationItem) {
            return processedItem ? this.getItemLabel(processedItem.item) : undefined;
        },
        isProccessedItemGroup(processedItem: MenuNavigationItem) {
            return processedItem && isNotEmpty(processedItem.items);
        },
        toggle(event: Event) {
            this.visible ? this.hide() : this.show(event);
        },
        show(event: Event) {
            this.$emit('before-show');
            this.activeItemPath = [];
            this.focusedItemInfo = { index: -1, level: 0, parentKey: '' };
            focus(this.list);

            const pointer = event as MouseEvent;
            this.pageX = pointer.pageX ?? pointer.clientX ?? 0;
            this.pageY = pointer.pageY ?? pointer.clientY ?? 0;
            this.visible ? this.position() : (this.visible = true);

            event.stopPropagation();
            event.preventDefault();
        },
        hide() {
            this.$emit('before-hide');
            this.visible = false;
            this.activeItemPath = [];
            this.focusedItemInfo = { index: -1, level: 0, parentKey: '' };
        },
        onFocus(event: FocusEvent) {
            this.focused = true;
            this.focusedItemInfo = this.focusedItemInfo.index !== -1 ? this.focusedItemInfo : { index: -1, level: 0, parentKey: '' };
            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            this.focused = false;
            this.focusedItemInfo = { index: -1, level: 0, parentKey: '' };
            this.searchValue = '';
            this.$emit('blur', event);
        },
        onKeyDown(event: KeyboardEvent) {
            const metaKey = event.metaKey || event.ctrlKey;

            this.safeTriangle && this.safeTriangle.cancel();

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
                    this.onEscapeKey(event);
                    break;

                case 'Tab':
                    this.onTabKey(event);
                    break;

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
        onItemChange(event: MenuItemEvent, type?: 'hover') {
            const { processedItem, isFocus } = event;

            if (isEmpty(processedItem)) return;

            const { index, key, level, parentKey, items } = processedItem;
            const grouped = isNotEmpty(items);
            const activeItemPath = this.activeItemPath.filter((p) => p.parentKey !== parentKey && p.parentKey !== key);

            if (grouped) {
                activeItemPath.push(processedItem);
                this.submenuVisible = true;
            }

            this.focusedItemInfo = { index, level, parentKey };

            isFocus && focus(this.list);

            if (type === 'hover' && this.queryMatches) {
                return;
            }

            this.activeItemPath = activeItemPath;
        },
        onItemClick(event: MenuItemEvent<MouseEvent>) {
            this.safeTriangle && this.safeTriangle.cancel();

            const { processedItem } = event;
            const grouped = this.isProccessedItemGroup(processedItem);
            const selected = this.isSelected(processedItem);

            if (selected) {
                const { index, key, level, parentKey } = processedItem;

                this.activeItemPath = this.activeItemPath.filter((p) => key !== p.key && key.startsWith(p.key));
                this.focusedItemInfo = { index, level, parentKey };

                focus(this.list);
            } else {
                grouped ? this.onItemChange(event) : this.hide();
            }
        },
        onItemMouseEnter(event: MenuItemEvent<MouseEvent>) {
            if (!this.deferItemChange(event)) {
                this.onItemChange(event, 'hover');
            }
        },
        onItemMouseMove(event: MenuItemEvent<MouseEvent>) {
            if (this.focused && !(this.safeTriangle && this.safeTriangle.isPending())) {
                this.changeFocusedItemIndex(event, event.processedItem.index);
            }
        },
        deferItemChange(event: MenuItemEvent<MouseEvent>) {
            const { originalEvent, processedItem } = event;
            const activeItem = this.activeItemPath.find((p) => p.parentKey === processedItem.parentKey);
            const submenu = activeItem && activeItem.key !== processedItem.key ? findSingle(this.list, `[id="${this.$id}_${activeItem.key}_list"]`) : null;

            return !!this.safeTriangle && this.safeTriangle.defer(originalEvent, submenu, () => this.onItemChange(event, 'hover'));
        },
        onArrowDownKey(event: KeyboardEvent) {
            const itemIndex = this.focusedItemInfo.index !== -1 ? this.findNextItemIndex(this.focusedItemInfo.index) : this.findFirstFocusedItemIndex();

            this.changeFocusedItemIndex(event, itemIndex);
            event.preventDefault();
        },
        onArrowUpKey(event: KeyboardEvent) {
            if (event.altKey) {
                if (this.focusedItemInfo.index !== -1) {
                    const processedItem = this.visibleItems[this.focusedItemInfo.index];
                    const grouped = this.isProccessedItemGroup(processedItem);

                    !grouped && this.onItemChange({ originalEvent: event, processedItem });
                }

                event.preventDefault();
            } else {
                const itemIndex = this.focusedItemInfo.index !== -1 ? this.findPrevItemIndex(this.focusedItemInfo.index) : this.findLastFocusedItemIndex();

                this.changeFocusedItemIndex(event, itemIndex);
                event.preventDefault();
            }
        },
        onArrowLeftKey(event: KeyboardEvent) {
            const processedItem = this.visibleItems[this.focusedItemInfo.index];
            const parentItem = this.activeItemPath.find((p) => p.key === processedItem.parentKey);
            const root = isEmpty(processedItem.parent);

            if (!root) {
                this.focusedItemInfo = { index: -1, level: parentItem?.level ?? 0, parentKey: parentItem?.parentKey ?? '' };
                this.searchValue = '';
                this.onArrowDownKey(event);
            }

            this.activeItemPath = this.activeItemPath.filter((p) => p.parentKey !== this.focusedItemInfo.parentKey);

            event.preventDefault();
        },
        onArrowRightKey(event: KeyboardEvent) {
            const processedItem = this.visibleItems[this.focusedItemInfo.index];
            const grouped = this.isProccessedItemGroup(processedItem);

            if (grouped) {
                this.onItemChange({ originalEvent: event, processedItem });
                this.focusedItemInfo = { index: -1, level: processedItem.level + 1, parentKey: processedItem.key };
                this.searchValue = '';
                this.onArrowDownKey(event);
            }

            event.preventDefault();
        },
        onHomeKey(event: KeyboardEvent) {
            this.changeFocusedItemIndex(event, this.findFirstItemIndex());
            event.preventDefault();
        },
        onEndKey(event: KeyboardEvent) {
            this.changeFocusedItemIndex(event, this.findLastItemIndex());
            event.preventDefault();
        },
        onEnterKey(event: KeyboardEvent) {
            if (this.focusedItemInfo.index !== -1) {
                const element = this.list?.querySelector<HTMLElement>(`li[id="${`${this.focusedItemIdx}`}"]`);
                const anchorElement = element && element.querySelector<HTMLElement>('[data-pc-section="itemlink"]');

                anchorElement ? anchorElement.click() : element && element.click();
                const processedItem = this.visibleItems[this.focusedItemInfo.index];
                const grouped = this.isProccessedItemGroup(processedItem);

                !grouped && (this.focusedItemInfo.index = this.findFirstFocusedItemIndex());
            }

            event.preventDefault();
        },
        onSpaceKey(event: KeyboardEvent) {
            this.onEnterKey(event);
        },
        onEscapeKey(event: KeyboardEvent) {
            this.hide();
            this.focusedItemInfo.index = this.findFirstFocusedItemIndex();

            event.preventDefault();
        },
        onTabKey(event: KeyboardEvent) {
            if (this.focusedItemInfo.index !== -1) {
                const processedItem = this.visibleItems[this.focusedItemInfo.index];
                const grouped = this.isProccessedItemGroup(processedItem);

                !grouped && this.onItemChange({ originalEvent: event, processedItem });
            }

            this.hide();
        },
        onEnter(el: Element) {
            if (!(el instanceof HTMLElement)) return;

            addStyle(el, { position: 'absolute' });
            this.position();

            if (this.autoZIndex) {
                ZIndex.set('menu', el, this.baseZIndex || this.$primevue?.config.zIndex?.menu);
            }
        },
        onAfterEnter() {
            this.bindOutsideClickListener();
            this.bindResizeListener();

            this.$emit('show');
            focus(this.list);
        },
        onLeave() {
            this.$emit('hide');
            this.container = null;
        },
        onAfterLeave(el: Element) {
            if (this.autoZIndex && el instanceof HTMLElement) {
                ZIndex.clear(el);
            }

            this.unbindOutsideClickListener();
            this.unbindResizeListener();
        },
        position() {
            if (!this.container) return;

            let left = this.pageX + 1;
            let top = this.pageY + 1;
            let width = this.container.offsetParent ? this.container.offsetWidth : getHiddenElementOuterWidth(this.container);
            let height = this.container.offsetParent ? this.container.offsetHeight : getHiddenElementOuterHeight(this.container);
            let viewport = getViewport();
            let scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            let scrollLeft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

            //flip
            if (left + width - scrollLeft > viewport.width) {
                left -= width;
            }

            //flip
            if (top + height - scrollTop > viewport.height) {
                top -= height;
            }

            //fit
            if (left < scrollLeft) {
                left = scrollLeft;
            }

            //fit
            if (top < scrollTop) {
                top = scrollTop;
            }

            this.container.style.left = left + 'px';
            this.container.style.top = top + 'px';
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.container && event.target instanceof Node && !this.container.contains(event.target)) {
                        this.hide();
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
        bindResizeListener() {
            if (!this.resizeListener) {
                this.resizeListener = () => {
                    if (this.visible && !isTouchDevice()) {
                        this.hide();
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
        bindDocumentContextMenuListener() {
            if (!this.documentContextMenuListener) {
                this.documentContextMenuListener = (event) => {
                    event.button === 2 && this.show(event);
                };

                document.addEventListener('contextmenu', this.documentContextMenuListener);
            }
        },
        unbindDocumentContextMenuListener() {
            if (this.documentContextMenuListener) {
                document.removeEventListener('contextmenu', this.documentContextMenuListener);
                this.documentContextMenuListener = null;
            }
        },
        bindSafeTriangle() {
            if (!this.safeTriangle) {
                this.safeTriangle = new SafeTriangle();
            }

            this.safeTriangle.bind();
        },
        unbindSafeTriangle() {
            if (this.safeTriangle) {
                this.safeTriangle.unbind();
            }
        },
        bindMatchMediaListener() {
            if (!this.matchMediaListener) {
                const query = matchMedia(`(max-width: ${this.breakpoint})`);

                this.query = query;
                this.queryMatches = query.matches;

                this.matchMediaListener = () => {
                    this.queryMatches = query.matches;
                };

                this.query.addEventListener('change', this.matchMediaListener);
            }
        },
        unbindMatchMediaListener() {
            if (this.matchMediaListener) {
                this.query?.removeEventListener('change', this.matchMediaListener);
                this.matchMediaListener = null;
            }
        },
        isItemMatched(processedItem: MenuNavigationItem) {
            return (
                this.isValidItem(processedItem) &&
                this.getProccessedItemLabel(processedItem)?.toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase())
            );
        },
        isValidItem(processedItem: MenuNavigationItem) {
            return (
                !!processedItem &&
                !this.isItemDisabled(processedItem.item) &&
                !this.isItemSeparator(processedItem.item) &&
                this.isItemVisible(processedItem.item)
            );
        },
        isValidSelectedItem(processedItem: MenuNavigationItem) {
            return this.isValidItem(processedItem) && this.isSelected(processedItem);
        },
        isSelected(processedItem: MenuNavigationItem) {
            return this.activeItemPath.some((p) => p.key === processedItem.key);
        },
        findFirstItemIndex() {
            return this.visibleItems.findIndex((processedItem) => this.isValidItem(processedItem));
        },
        findLastItemIndex() {
            return findLastIndex(this.visibleItems, (processedItem) => this.isValidItem(processedItem));
        },
        findNextItemIndex(index: number) {
            const matchedItemIndex =
                index < this.visibleItems.length - 1 ? this.visibleItems.slice(index + 1).findIndex((processedItem) => this.isValidItem(processedItem)) : -1;

            return matchedItemIndex > -1 ? matchedItemIndex + index + 1 : index;
        },
        findPrevItemIndex(index: number) {
            const matchedItemIndex = index > 0 ? findLastIndex(this.visibleItems.slice(0, index), (processedItem) => this.isValidItem(processedItem)) : -1;

            return matchedItemIndex > -1 ? matchedItemIndex : index;
        },
        findSelectedItemIndex() {
            return this.visibleItems.findIndex((processedItem) => this.isValidSelectedItem(processedItem));
        },
        findFirstFocusedItemIndex() {
            const selectedIndex = this.findSelectedItemIndex();

            return selectedIndex < 0 ? this.findFirstItemIndex() : selectedIndex;
        },
        findLastFocusedItemIndex() {
            const selectedIndex = this.findSelectedItemIndex();

            return selectedIndex < 0 ? this.findLastItemIndex() : selectedIndex;
        },
        searchItems(event: KeyboardEvent, char: string) {
            this.searchValue = (this.searchValue || '') + char;

            let itemIndex = -1;
            let matched = false;

            if (this.focusedItemInfo.index !== -1) {
                itemIndex = this.visibleItems.slice(this.focusedItemInfo.index).findIndex((processedItem) => this.isItemMatched(processedItem));
                itemIndex =
                    itemIndex === -1
                        ? this.visibleItems.slice(0, this.focusedItemInfo.index).findIndex((processedItem) => this.isItemMatched(processedItem))
                        : itemIndex + this.focusedItemInfo.index;
            } else {
                itemIndex = this.visibleItems.findIndex((processedItem) => this.isItemMatched(processedItem));
            }

            if (itemIndex !== -1) {
                matched = true;
            }

            if (itemIndex === -1 && this.focusedItemInfo.index === -1) {
                itemIndex = this.findFirstFocusedItemIndex();
            }

            if (itemIndex !== -1) {
                this.changeFocusedItemIndex(event, itemIndex);
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
        changeFocusedItemIndex(_event: Event | MenuItemEvent, index: number) {
            if (this.focusedItemInfo.index !== index) {
                this.focusedItemInfo.index = index;
                this.scrollInView();
            }
        },
        scrollInView(index = -1) {
            const id = index !== -1 ? `${this.$id}_${index}` : this.focusedItemIdx;
            const element = this.list?.querySelector<HTMLElement>(`li[id="${id}"]`);

            if (element) {
                element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' });
            }
        },
        createProcessedItems(items: MenuItem[] | undefined | null, level = 0, parent?: MenuNavigationItem, parentKey = ''): MenuNavigationItem[] {
            const processedItems: MenuNavigationItem[] = [];

            items &&
                items.forEach((item, index) => {
                    const key = (parentKey !== '' ? parentKey + '_' : '') + index;
                    const newItem: MenuNavigationItem = {
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
        containerRef(el: Element | ComponentPublicInstance | null) {
            this.container = el instanceof HTMLElement ? el : null;
        },
        listRef(el: Element | ComponentPublicInstance | null) {
            const root = el && !(el instanceof Element) ? el.$el : el;
            this.list = root instanceof HTMLElement ? root : null;
        }
    },
    computed: {
        processedItems() {
            return this.createProcessedItems(this.model || []);
        },
        visibleItems() {
            const processedItem = this.activeItemPath.find((p) => p.key === this.focusedItemInfo.parentKey);

            return processedItem ? processedItem.items : this.processedItems;
        },
        focusedItemIdx() {
            return this.focusedItemInfo.index !== -1
                ? `${this.$id}${isNotEmpty(this.focusedItemInfo.parentKey) ? '_' + this.focusedItemInfo.parentKey : ''}_${this.focusedItemInfo.index}`
                : undefined;
        }
    },
    components: {
        ContextMenuSub,
        Portal
    }
});
</script>
