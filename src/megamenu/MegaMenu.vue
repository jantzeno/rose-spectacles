<template>
    <div :ref="containerRef" :id="$id" :class="cx('root')" v-bind="ptmi('root')">
        <div v-if="$slots.start" :class="cx('start')" v-bind="ptm('start')">
            <slot name="start"></slot>
        </div>
        <!--TODO: menubutton deprecated since v4.0. Use button-->
        <slot :id="$id" :name="$slots.button ? 'button' : 'menubutton'" :class="cx('button')" :toggleCallback="menuButtonClick">
            <a
                v-if="model && model.length > 0"
                ref="menubutton"
                role="button"
                tabindex="0"
                :class="cx('button')"
                :aria-haspopup="model.length && model.length > 0 ? true : false"
                :aria-expanded="mobileActive"
                :aria-controls="$id"
                :aria-label="$primevue?.config.locale?.aria?.navigation"
                @click="menuButtonClick($event)"
                @keydown="menuButtonKeydown($event)"
                v-bind="ptm('button')"
            >
                <!--TODO: menubuttonicon deprecated since v4.0. Use buttonicon-->
                <slot :name="$slots.buttonicon ? 'buttonicon' : 'menubuttonicon'">
                    <BarsIcon v-bind="ptm('buttonIcon')" />
                </slot>
            </a>
        </slot>
        <MegaMenuSub
            :ref="menubarRef"
            :id="$id + '_list'"
            :tabindex="!disabled ? tabindex : -1"
            role="menubar"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            :aria-disabled="disabled || undefined"
            :aria-orientation="horizontal ? 'horizontal' : 'vertical'"
            :aria-activedescendant="focused ? focusedItemId : undefined"
            :menuId="$id"
            :focusedItemId="focused ? focusedItemId : undefined"
            :items="processedItems"
            :horizontal="horizontal"
            :templates="$slots"
            :activeItem="activeItem ?? undefined"
            :mobileActive="mobileActive"
            :level="0"
            :style="sx('rootList')"
            :pt="pt"
            :unstyled="unstyled"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeyDown"
            @item-click="onItemClick"
            @item-mouseenter="onItemMouseEnter"
        />
        <div v-if="$slots.end" :class="cx('end')" v-bind="ptm('end')">
            <slot name="end"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { findSingle, focus, isTouchDevice } from '../internal/utils/dom/index';
import { findLastIndex, isEmpty, isNotEmpty, isPrintableCharacter, resolve } from '../internal/utils/object/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { SafeTriangle } from '../core/utils/Utils';
import { BarsIcon } from '../internal/lucide';
import { defineComponent, type ComponentPublicInstance } from 'vue';
import type { MenuItem } from '../menuitem/MenuItem';
import { getMegaMenuColumns, getMegaMenuItems, type MegaMenuNode } from '../internal/processed-menu-item';
import BaseMegaMenu from './BaseMegaMenu.vue';
import MegaMenuSub from './MegaMenuSub.vue';

type MegaMenuItemEvent<E extends Event = MouseEvent | KeyboardEvent> = { originalEvent: E; processedItem: MegaMenuNode; isFocus?: boolean };

export default defineComponent({
    name: 'MegaMenu',
    extends: BaseMegaMenu,
    inheritAttrs: false,
    emits: ['focus', 'blur'],
    data() {
        return {
            mobileActive: false,
            focused: false,
            focusedItemInfo: { index: -1, key: '', parentKey: '' },
            activeItem: null as MegaMenuNode | null,
            dirty: false,
            query: null as MediaQueryList | null,
            queryMatches: false,
            outsideClickListener: null as ((event: MouseEvent) => void) | null,
            resizeListener: null as ((event: Event) => void) | null,
            matchMediaListener: null as (() => void) | null,
            safeTriangle: null as SafeTriangle | null,
            container: null as HTMLElement | null,
            menubar: null as HTMLElement | null,
            searchTimeout: null as ReturnType<typeof setTimeout> | null,
            searchValue: ''
        };
    },
    watch: {
        activeItem(newItem) {
            if (isNotEmpty(newItem)) {
                this.bindOutsideClickListener();
                this.bindResizeListener();
                this.bindSafeTriangle();
            } else {
                this.unbindOutsideClickListener();
                this.unbindResizeListener();
                this.unbindSafeTriangle();
            }
        }
    },
    mounted() {
        this.bindMatchMediaListener();
    },
    beforeUnmount() {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.mobileActive = false;
        this.unbindOutsideClickListener();
        this.unbindResizeListener();
        this.unbindMatchMediaListener();
        this.unbindSafeTriangle();
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
        getProccessedItemLabel(processedItem: MegaMenuNode | undefined) {
            return processedItem ? this.getItemLabel(processedItem.item) : undefined;
        },
        isProccessedItemGroup(processedItem: MegaMenuNode | undefined) {
            return processedItem && isNotEmpty(processedItem.items);
        },
        toggle(event: MouseEvent | KeyboardEvent) {
            if (this.mobileActive) {
                this.mobileActive = false;
                if (this.menubar) ZIndex.clear(this.menubar);
                this.hide();
            } else {
                this.mobileActive = true;
                if (this.menubar) ZIndex.set('menu', this.menubar, this.$primevue?.config.zIndex?.menu);
                setTimeout(() => {
                    this.show();
                }, 1);
            }

            this.bindOutsideClickListener();
            event.preventDefault();
        },
        show() {
            this.focusedItemInfo = { index: this.findFirstFocusedItemIndex(), key: '', parentKey: '' };

            focus(this.menubar);
        },
        hide(_event?: Event, isFocus = false) {
            if (this.mobileActive) {
                this.mobileActive = false;
                setTimeout(() => {
                    focus(this.$refs.menubutton as HTMLElement, { preventScroll: true });
                }, 1);
            }

            this.activeItem = null;
            this.focusedItemInfo = { index: -1, key: '', parentKey: '' };

            isFocus && focus(this.menubar);
            this.dirty = false;
        },
        onFocus(event: FocusEvent) {
            this.focused = true;

            if (this.focusedItemInfo.index === -1) {
                const index = this.findFirstFocusedItemIndex();
                const processedItem = this.findVisibleItem(index);

                if (processedItem) this.focusedItemInfo = { index, key: processedItem.key, parentKey: processedItem.parentKey };
            }

            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            this.focused = false;
            this.focusedItemInfo = { index: -1, key: '', parentKey: '' };
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
        onItemChange(event: MegaMenuItemEvent) {
            const { processedItem, isFocus } = event;

            if (isEmpty(processedItem)) return;

            const { index, key, parentKey, items } = processedItem;
            const grouped = isNotEmpty(items);

            grouped && (this.activeItem = processedItem);
            this.focusedItemInfo = { index, key, parentKey };

            grouped && (this.dirty = true);
            isFocus && focus(this.menubar);
        },
        onItemClick(event: MegaMenuItemEvent<MouseEvent>) {
            this.safeTriangle && this.safeTriangle.cancel();

            const { originalEvent, processedItem } = event;
            const grouped = this.isProccessedItemGroup(processedItem);
            const root = isEmpty(processedItem.parent);
            const selected = this.isSelected(processedItem);

            if (selected) {
                const { index, key, parentKey } = processedItem;

                this.activeItem = null;
                this.focusedItemInfo = { index, key, parentKey };

                this.dirty = !root;

                if (!this.mobileActive) {
                    focus(this.menubar, { preventScroll: true });
                }
            } else {
                if (grouped) {
                    this.onItemChange(event);
                } else {
                    this.hide(originalEvent);
                }
            }
        },
        onItemMouseEnter(event: MegaMenuItemEvent<MouseEvent>) {
            if (!this.mobileActive && this.dirty && !this.deferItemChange(event)) {
                this.onItemChange(event);
            }
        },
        deferItemChange(event: MegaMenuItemEvent<MouseEvent>) {
            const { originalEvent, processedItem } = event;
            const activeItem = this.activeItem;
            const overlay =
                activeItem && activeItem.parentKey === processedItem.parentKey && activeItem.key !== processedItem.key
                    ? findSingle(this.menubar, `[id="${this.$id}_${activeItem.key}"] > [data-pc-section="overlay"]`)
                    : null;

            return !!this.safeTriangle && this.safeTriangle.defer(originalEvent, overlay, () => this.onItemChange(event));
        },
        menuButtonClick(event: MouseEvent | KeyboardEvent) {
            this.toggle(event);
        },
        menuButtonKeydown(event: KeyboardEvent) {
            (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') && this.menuButtonClick(event);
        },
        onArrowDownKey(event: KeyboardEvent) {
            if (this.horizontal) {
                if (this.activeItem && this.activeItem.key === this.focusedItemInfo.key) {
                    this.focusedItemInfo = { index: -1, key: '', parentKey: this.activeItem.key };
                } else {
                    const processedItem = this.findVisibleItem(this.focusedItemInfo.index);
                    const grouped = this.isProccessedItemGroup(processedItem);

                    if (processedItem && grouped) {
                        this.onItemChange({ originalEvent: event, processedItem });
                        this.focusedItemInfo = { index: -1, key: processedItem.key, parentKey: processedItem.parentKey };
                        this.searchValue = '';
                    }
                }
            }

            const itemIndex = this.focusedItemInfo.index !== -1 ? this.findNextItemIndex(this.focusedItemInfo.index) : this.findFirstFocusedItemIndex();

            this.changeFocusedItemInfo(event, itemIndex);
            event.preventDefault();
        },
        onArrowUpKey(event: KeyboardEvent) {
            if (event.altKey && this.horizontal) {
                if (this.focusedItemInfo.index !== -1) {
                    const processedItem = this.findVisibleItem(this.focusedItemInfo.index);
                    const grouped = this.isProccessedItemGroup(processedItem);

                    if (!grouped && this.activeItem) {
                        if (this.focusedItemInfo.index === 0) {
                            this.focusedItemInfo = { index: this.activeItem.index, key: this.activeItem.key, parentKey: this.activeItem.parentKey };
                            this.activeItem = null;
                        } else {
                            this.changeFocusedItemInfo(event, this.findFirstItemIndex());
                        }
                    }
                }

                event.preventDefault();
            } else {
                const itemIndex = this.focusedItemInfo.index !== -1 ? this.findPrevItemIndex(this.focusedItemInfo.index) : this.findLastFocusedItemIndex();

                this.changeFocusedItemInfo(event, itemIndex);
                event.preventDefault();
            }
        },
        onArrowLeftKey(event: KeyboardEvent) {
            const processedItem = this.findVisibleItem(this.focusedItemInfo.index);
            if (!processedItem) return;

            const grouped = this.isProccessedItemGroup(processedItem);

            if (grouped) {
                if (this.horizontal) {
                    const itemIndex = this.focusedItemInfo.index !== -1 ? this.findPrevItemIndex(this.focusedItemInfo.index) : this.findLastFocusedItemIndex();

                    this.changeFocusedItemInfo(event, itemIndex);
                }
            } else {
                if (this.vertical && this.activeItem) {
                    if (processedItem.columnIndex === 0) {
                        this.focusedItemInfo = { index: this.activeItem.index, key: this.activeItem.key, parentKey: this.activeItem.parentKey };
                        this.activeItem = null;
                    }
                }

                const columnIndex = processedItem.columnIndex - 1;
                const itemIndex = this.visibleItems.findIndex((item) => item.columnIndex === columnIndex);

                itemIndex !== -1 && this.changeFocusedItemInfo(event, itemIndex);
            }

            event.preventDefault();
        },
        onArrowRightKey(event: KeyboardEvent) {
            const processedItem = this.findVisibleItem(this.focusedItemInfo.index);
            if (!processedItem) return;

            const grouped = this.isProccessedItemGroup(processedItem);

            if (grouped) {
                if (this.vertical) {
                    if (this.activeItem && this.activeItem.key === processedItem.key) {
                        this.focusedItemInfo = { index: -1, key: '', parentKey: this.activeItem.key };
                    } else {
                        const processedItem = this.findVisibleItem(this.focusedItemInfo.index);
                        const grouped = this.isProccessedItemGroup(processedItem);

                        if (processedItem && grouped) {
                            this.onItemChange({ originalEvent: event, processedItem });
                            this.focusedItemInfo = { index: -1, key: processedItem.key, parentKey: processedItem.parentKey };
                            this.searchValue = '';
                        }
                    }
                }

                const itemIndex = this.focusedItemInfo.index !== -1 ? this.findNextItemIndex(this.focusedItemInfo.index) : this.findFirstFocusedItemIndex();

                this.changeFocusedItemInfo(event, itemIndex);
            } else {
                const columnIndex = processedItem.columnIndex + 1;
                const itemIndex = this.visibleItems.findIndex((item) => item.columnIndex === columnIndex);

                itemIndex !== -1 && this.changeFocusedItemInfo(event, itemIndex);
            }

            event.preventDefault();
        },
        onHomeKey(event: KeyboardEvent) {
            this.changeFocusedItemInfo(event, this.findFirstItemIndex());
            event.preventDefault();
        },
        onEndKey(event: KeyboardEvent) {
            this.changeFocusedItemInfo(event, this.findLastItemIndex());
            event.preventDefault();
        },
        onEnterKey(event: KeyboardEvent) {
            if (this.focusedItemInfo.index !== -1) {
                const element = this.menubar?.querySelector<HTMLElement>(`li[id="${`${this.focusedItemId}`}"]`);
                const anchorElement = element && element.querySelector<HTMLElement>('a[data-pc-section="itemlink"]');

                anchorElement ? anchorElement.click() : element && element.click();

                const processedItem = this.visibleItems[this.focusedItemInfo.index];
                const grouped = this.isProccessedItemGroup(processedItem);

                !grouped && this.changeFocusedItemInfo(event, this.findFirstFocusedItemIndex());
            }

            event.preventDefault();
        },
        onSpaceKey(event: KeyboardEvent) {
            this.onEnterKey(event);
        },
        onEscapeKey(event: KeyboardEvent) {
            if (this.activeItem) {
                this.focusedItemInfo = { index: this.activeItem.index, key: this.activeItem.key, parentKey: this.activeItem.parentKey };
                this.activeItem = null;
            }

            event.preventDefault();
        },
        onTabKey(event: KeyboardEvent) {
            if (this.focusedItemInfo.index !== -1) {
                const processedItem = this.findVisibleItem(this.focusedItemInfo.index);
                const grouped = this.isProccessedItemGroup(processedItem);

                if (processedItem && !grouped) this.onItemChange({ originalEvent: event, processedItem });
            }

            this.hide();
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
                this.resizeListener = (event) => {
                    if (!isTouchDevice()) {
                        this.hide(event, true);
                    }

                    this.mobileActive = false;
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
                    this.mobileActive = false;
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
        isItemMatched(processedItem: MegaMenuNode) {
            return (
                this.isValidItem(processedItem) &&
                this.getProccessedItemLabel(processedItem)?.toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase())
            );
        },
        isValidItem(processedItem: MegaMenuNode) {
            return (
                !!processedItem &&
                !this.isItemDisabled(processedItem.item) &&
                !this.isItemSeparator(processedItem.item) &&
                this.isItemVisible(processedItem.item)
            );
        },
        isValidSelectedItem(processedItem: MegaMenuNode) {
            return this.isValidItem(processedItem) && this.isSelected(processedItem);
        },
        isSelected(processedItem: MegaMenuNode) {
            return this.activeItem?.key === processedItem.key;
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
        findVisibleItem(index: number): MegaMenuNode | undefined {
            return this.visibleItems[index];
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
                this.changeFocusedItemInfo(event, itemIndex);
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
        changeFocusedItemInfo(_event: Event, index: number) {
            const processedItem = this.findVisibleItem(index);

            this.focusedItemInfo.index = index;
            this.focusedItemInfo.key = processedItem?.key ?? '';
            this.scrollInView();
        },
        scrollInView(index = -1) {
            const id = index !== -1 ? `${this.$id}_${index}` : this.focusedItemId;
            let element;

            if (id === undefined && this.queryMatches) {
                element = this.$refs.menubutton as HTMLElement | undefined;
            } else {
                element = findSingle(this.menubar, `li[id="${id}"]`);
            }

            if (element) {
                element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
            }
        },
        createProcessedItems(items: MenuItem[] | null | undefined, level = 0, parent?: MegaMenuNode, parentKey = '', columnIndex?: number): MegaMenuNode[] {
            const processedItems: MegaMenuNode[] = [];

            items &&
                items.forEach((item, index) => {
                    const key = (parentKey !== '' ? parentKey + '_' : '') + (columnIndex !== undefined ? columnIndex + '_' : '') + index;
                    const newItem: MegaMenuNode = {
                        item,
                        index,
                        level,
                        key,
                        parent,
                        parentKey,
                        columnIndex: columnIndex ?? parent?.columnIndex ?? index,
                        items: []
                    };

                    newItem.items =
                        level === 0 && item.items && item.items.length > 0
                            ? item.items.map((column, index) => this.createProcessedItems(Array.isArray(column) ? column : [], level + 1, newItem, key, index))
                            : this.createProcessedItems(item.items, level + 1, newItem, key);
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
            return this.createProcessedItems(this.model as MenuItem[] | undefined);
        },
        visibleItems() {
            const processedItem = this.activeItem;

            return processedItem && processedItem.key === this.focusedItemInfo.parentKey
                ? getMegaMenuColumns(processedItem.items).flatMap((column) => column.flatMap((section) => getMegaMenuItems(section.items)))
                : this.processedItems;
        },
        horizontal() {
            return this.orientation === 'horizontal';
        },
        vertical() {
            return this.orientation === 'vertical';
        },
        focusedItemId() {
            return isNotEmpty(this.focusedItemInfo.key) ? `${this.$id}_${this.focusedItemInfo.key}` : undefined;
        }
    },
    components: {
        MegaMenuSub: MegaMenuSub,
        BarsIcon: BarsIcon
    }
});
</script>
