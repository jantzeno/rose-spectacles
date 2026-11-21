<template>
    <Portal :appendTo="appendTo" :disabled="!popup">
        <transition
            name="rs-anchored-overlay"
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @leave="onLeave"
            @after-leave="onAfterLeave"
            v-bind="ptm('transition')"
        >
            <div v-if="visible" :ref="containerRef" :id="$id" :class="cx('root')" @click="onOverlayClick" v-bind="ptmi('root')">
                <div v-if="$slots.start" :class="cx('start')" v-bind="ptm('start')">
                    <slot name="start"></slot>
                </div>
                <TieredMenuSub
                    :ref="menubarRef"
                    :id="$id + '_list'"
                    :class="cx('rootList')"
                    :tabindex="!disabled ? tabindex : -1"
                    role="menubar"
                    :aria-label="ariaLabel"
                    :aria-labelledby="ariaLabelledby"
                    :aria-disabled="disabled || undefined"
                    aria-orientation="vertical"
                    :aria-activedescendant="focused ? focusedItemId : undefined"
                    :menuId="$id"
                    :focusedItemId="focused ? focusedItemId : undefined"
                    :items="processedItems"
                    :templates="$slots"
                    :activeItemPath="activeItemPath"
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
                    v-bind="ptm('rootList')"
                />
                <div v-if="$slots.end" :class="cx('end')" v-bind="ptm('end')">
                    <slot name="end"></slot>
                </div>
            </div>
        </transition>
    </Portal>
</template>

<script lang="ts">
import { absolutePosition, addStyle, findSingle, focus, getOuterWidth, isTouchDevice } from '../internal/utils/dom/index';
import { findLastIndex, isEmpty, isNotEmpty, isPrintableCharacter, resolve } from '../internal/utils/object/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { ConnectedOverlayScrollHandler, SafeTriangle } from '../core/utils/Utils';
import OverlayEventBus from '../overlayeventbus/OverlayEventBus';
import Portal from '../portal/Portal.vue';
import { defineComponent, type ComponentPublicInstance } from 'vue';
import type { MenuItem } from '../menuitem/MenuItem';
import type { MenuItemEvent, MenuNavigationItem } from '../internal/processed-menu-item';
import BaseTieredMenu from './BaseTieredMenu.vue';
import TieredMenuSub from './TieredMenuSub.vue';

export default defineComponent({
    name: 'TieredMenu',
    extends: BaseTieredMenu,
    inheritAttrs: false,
    emits: ['focus', 'blur', 'before-show', 'before-hide', 'hide', 'show'],
    data() {
        return {
            focused: false,
            focusedItemInfo: { index: -1, level: 0, parentKey: '' },
            activeItemPath: [] as MenuNavigationItem[],
            visible: !this.popup,
            submenuVisible: false,
            dirty: false,
            query: null as MediaQueryList | null,
            queryMatches: false,
            matchMediaListener: null as (() => void) | null,
            safeTriangle: null as SafeTriangle | null,
            outsideClickListener: null as ((event: MouseEvent) => void) | null,
            resizeListener: null as ((event: Event) => void) | null,
            searchValue: '',
            searchTimeout: null as ReturnType<typeof setTimeout> | null,
            container: null as HTMLElement | null,
            menubar: null as HTMLElement | null,
            target: null as HTMLElement | null,
            relatedTarget: null as HTMLElement | null,
            scrollHandler: null as ConnectedOverlayScrollHandler | null
        };
    },
    watch: {
        activeItemPath(newPath) {
            if (!this.popup) {
                if (isNotEmpty(newPath)) {
                    this.bindOutsideClickListener();
                    this.bindResizeListener();
                } else {
                    this.unbindOutsideClickListener();
                    this.unbindResizeListener();
                }
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
    },
    beforeUnmount() {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.unbindOutsideClickListener();
        this.unbindResizeListener();
        this.unbindMatchMediaListener();
        this.unbindSafeTriangle();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        if (this.container && this.autoZIndex) {
            ZIndex.clear(this.container);
        }

        this.target = null;
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
            this.visible ? this.hide(event, true) : this.show(event);
        },
        show(event: Event, isFocus = false) {
            if (this.popup) {
                this.$emit('before-show');
                this.visible = true;
                this.target = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
                this.relatedTarget = 'relatedTarget' in event && event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null;
            }

            isFocus && focus(this.menubar);
        },
        hide(_event?: Event, isFocus = false) {
            if (this.popup) {
                this.$emit('before-hide');
                this.visible = false;
            }

            this.activeItemPath = [];
            this.focusedItemInfo = { index: -1, level: 0, parentKey: '' };

            isFocus && focus(this.relatedTarget || this.target || this.menubar);
            this.dirty = false;
            this.target = null;
        },
        onFocus(event: FocusEvent) {
            this.focused = true;

            if (!this.popup) {
                this.focusedItemInfo =
                    this.focusedItemInfo.index !== -1 ? this.focusedItemInfo : { index: this.findFirstFocusedItemIndex(), level: 0, parentKey: '' };
            }

            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            this.focused = false;
            this.focusedItemInfo = { index: -1, level: 0, parentKey: '' };
            this.searchValue = '';
            this.dirty = false;
            this.$emit('blur', event);
        },
        onKeyDown(event: KeyboardEvent) {
            if (this.disabled) {
                event.preventDefault();

                return;
            }

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

            grouped && (this.dirty = true);
            isFocus && focus(this.menubar);

            if (type === 'hover' && this.queryMatches) {
                return;
            }

            this.activeItemPath = activeItemPath;
        },
        onOverlayClick(event: MouseEvent) {
            OverlayEventBus.emit('overlay-click', {
                originalEvent: event,
                target: this.target
            });
        },
        onItemClick(event: MenuItemEvent<MouseEvent>) {
            this.safeTriangle && this.safeTriangle.cancel();

            const { originalEvent, processedItem } = event;
            const grouped = this.isProccessedItemGroup(processedItem);
            const root = isEmpty(processedItem.parent);
            const selected = this.isSelected(processedItem);

            if (selected) {
                const { index, key, level, parentKey } = processedItem;

                this.activeItemPath = this.activeItemPath.filter((p) => key !== p.key && key.startsWith(p.key));
                this.focusedItemInfo = { index, level, parentKey };

                this.dirty = !root;
                focus(this.menubar);
            } else {
                if (grouped) {
                    this.onItemChange(event);
                } else {
                    const rootProcessedItem = root ? processedItem : this.activeItemPath.find((p) => p.parentKey === '');

                    this.hide(originalEvent);
                    this.changeFocusedItemIndex(originalEvent, rootProcessedItem ? rootProcessedItem.index : -1);

                    focus(this.menubar);
                }
            }
        },
        onItemMouseEnter(event: MenuItemEvent<MouseEvent>) {
            if (this.dirty && !this.deferItemChange(event)) {
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
            const submenu = activeItem && activeItem.key !== processedItem.key ? findSingle(this.menubar, `[id="${this.$id}_${activeItem.key}_list"]`) : null;

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

                this.popup && this.hide(event, true);
                event.preventDefault();
            } else {
                const itemIndex = this.focusedItemInfo.index !== -1 ? this.findPrevItemIndex(this.focusedItemInfo.index) : this.findLastFocusedItemIndex();

                this.changeFocusedItemIndex(event, itemIndex);
                event.preventDefault();
            }
        },
        onArrowLeftKey(event: KeyboardEvent) {
            const processedItem = this.visibleItems[this.focusedItemInfo.index];
            if (!processedItem) return;

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
                const element = this.menubar?.querySelector<HTMLElement>(`li[id="${`${this.focusedItemId}`}"]`);
                const anchorElement = element && element.querySelector<HTMLElement>('[data-pc-section="itemlink"]');

                anchorElement ? anchorElement.click() : element && element.click();

                if (!this.popup) {
                    const processedItem = this.visibleItems[this.focusedItemInfo.index];
                    const grouped = this.isProccessedItemGroup(processedItem);

                    !grouped && (this.focusedItemInfo.index = this.findFirstFocusedItemIndex());
                }
            }

            event.preventDefault();
        },
        onSpaceKey(event: KeyboardEvent) {
            this.onEnterKey(event);
        },
        onEscapeKey(event: KeyboardEvent) {
            if (this.popup || this.focusedItemInfo.level !== 0) {
                const _focusedItemInfo = this.focusedItemInfo;

                this.hide(event, false);
                this.focusedItemInfo = { index: Number(_focusedItemInfo.parentKey.split('_')[0]), level: 0, parentKey: '' };
                this.popup && focus(this.target);
            }

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

            if (this.autoZIndex) {
                ZIndex.set('menu', el, this.baseZIndex || this.$primevue?.config.zIndex?.menu);
            }

            addStyle(el, { position: 'absolute', top: '0' });
            this.alignOverlay();
            focus(this.menubar);
            this.scrollInView();
        },
        onAfterEnter() {
            this.bindOutsideClickListener();
            this.bindScrollListener();
            this.bindResizeListener();

            this.$emit('show');
        },
        onLeave() {
            this.unbindOutsideClickListener();
            this.unbindScrollListener();
            this.unbindResizeListener();

            this.$emit('hide');
            this.container = null;
            this.dirty = false;
        },
        onAfterLeave(el: Element) {
            if (this.autoZIndex && el instanceof HTMLElement) {
                ZIndex.clear(el);
            }
        },
        alignOverlay() {
            if (!this.container || !this.target) return;

            absolutePosition(this.container, this.target);
            const targetWidth = getOuterWidth(this.target);

            if (targetWidth > getOuterWidth(this.container)) {
                this.container.style.minWidth = getOuterWidth(this.target) + 'px';
            }
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    const target = event.target;
                    if (!(target instanceof Node)) return;

                    const isOutsideContainer = this.container && !this.container.contains(target);
                    const isOutsideTarget = !this.popup || !this.target?.contains(target);

                    if (isOutsideContainer && isOutsideTarget) {
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
        bindScrollListener() {
            if (!this.scrollHandler && this.target) {
                this.scrollHandler = new ConnectedOverlayScrollHandler(this.target, (event) => {
                    this.hide(event, true);
                });
            }

            this.scrollHandler?.bindScrollListener();
        },
        unbindScrollListener() {
            if (this.scrollHandler) {
                this.scrollHandler.unbindScrollListener();
            }
        },
        bindResizeListener() {
            if (!this.resizeListener) {
                this.resizeListener = (event) => {
                    if (!isTouchDevice()) {
                        this.hide(event, true);
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
            const id = index !== -1 ? `${this.$id}_${index}` : this.focusedItemId;
            const element = this.menubar?.querySelector<HTMLElement>(`li[id="${id}"]`);

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
        menubarRef(el: Element | ComponentPublicInstance | null) {
            const root = el && !(el instanceof Element) ? el.$el : el;
            this.menubar = root instanceof HTMLElement ? root : null;
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
        focusedItemId() {
            return this.focusedItemInfo.index !== -1
                ? `${this.$id}${isNotEmpty(this.focusedItemInfo.parentKey) ? '_' + this.focusedItemInfo.parentKey : ''}_${this.focusedItemInfo.index}`
                : undefined;
        }
    },
    components: {
        TieredMenuSub: TieredMenuSub,
        Portal: Portal
    }
});
</script>
