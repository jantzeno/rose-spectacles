<template>
    <div :id="$id" :class="cx('root')" @focusout="onFocusout" :data-p="containerDataP" v-bind="ptmi('root')">
        <span
            ref="firstHiddenFocusableElement"
            role="presentation"
            aria-hidden="true"
            class="rs-hidden-accessible rs-hidden-focusable"
            :tabindex="!disabled ? tabindex : -1"
            @focus="onFirstHiddenFocus"
            v-bind="ptm('hiddenFirstFocusableEl')"
            :data-p-hidden-accessible="true"
            :data-p-hidden-focusable="true"
        ></span>
        <div v-if="$slots.header" :class="cx('header')" v-bind="ptm('header')">
            <slot name="header" :value="d_value" :options="visibleOptions"></slot>
        </div>
        <div v-if="filter" :class="cx('header')" v-bind="ptm('header')">
            <IconField :unstyled="unstyled" :pt="ptm('pcFilterContainer')">
                <InputText
                    v-model="filterValue"
                    type="text"
                    :class="cx('pcFilter')"
                    :placeholder="filterPlaceholder"
                    role="searchbox"
                    autocomplete="off"
                    :disabled="disabled"
                    :unstyled="unstyled"
                    :aria-owns="$id + '_list'"
                    :aria-activedescendant="focusedOptionId"
                    :tabindex="!disabled && !focused ? tabindex : -1"
                    @input="onFilterChange"
                    @keydown="onFilterKeyDown"
                    :pt="ptm('pcFilter')"
                />
                <InputIcon :unstyled="unstyled" :pt="ptm('pcFilterIconContainer')">
                    <slot name="filtericon">
                        <span v-if="filterIcon" :class="filterIcon" v-bind="ptm('filterIcon')" />
                        <SearchIcon v-else v-bind="ptm('filterIcon')" />
                    </slot>
                </InputIcon>
            </IconField>
            <span role="status" aria-live="polite" class="rs-hidden-accessible" v-bind="ptm('hiddenFilterResult')" :data-p-hidden-accessible="true">
                {{ filterResultMessageText }}
            </span>
        </div>
        <div :class="cx('listContainer')" :style="[{ 'max-height': virtualScrollerDisabled ? scrollHeight : '' }, listStyle]" v-bind="ptm('listContainer')">
            <VirtualScroller
                :ref="virtualScrollerRef"
                v-bind="virtualScrollerOptions"
                :items="visibleOptions"
                :style="[{ height: scrollHeight }, listStyle]"
                :tabindex="-1"
                :disabled="virtualScrollerDisabled"
                :pt="ptm('virtualScroller')"
            >
                <template v-slot:content="{ styleClass, contentRef, items, getItemOptions, contentStyle, itemSize }">
                    <ul
                        :ref="(el) => listRef(el, contentRef)"
                        :id="$id + '_list'"
                        :class="[cx('list'), styleClass]"
                        :style="contentStyle"
                        :tabindex="-1"
                        role="listbox"
                        :aria-multiselectable="multiple"
                        :aria-label="ariaLabel"
                        :aria-labelledby="ariaLabelledby"
                        :aria-activedescendant="focused ? focusedOptionId : undefined"
                        :aria-disabled="disabled"
                        @focus="onListFocus"
                        @blur="onListBlur"
                        @keydown="onListKeyDown"
                        v-bind="ptm('list')"
                    >
                        <ListboxOptionGroup
                            v-for="group of renderedGroups(items, getItemOptions)"
                            :key="group.heading?.index ?? group.firstIndex"
                            :grouped="!!group.heading && group.options.length > 0"
                            :groupClass="cx('group')"
                            :labelledby="group.heading && group.showHeading ? $id + '_' + group.heading.index : undefined"
                            :label="group.heading && !group.showHeading ? getOptionGroupLabel(group.heading.option.optionGroup)?.toString() : undefined"
                        >
                            <li
                                v-if="group.heading && group.showHeading"
                                :id="$id + '_' + group.heading.index"
                                :style="{ height: itemSize ? itemSize + 'px' : undefined }"
                                :class="cx('optionGroup')"
                                role="presentation"
                                v-bind="ptm('optionGroup')"
                            >
                                <slot name="optiongroup" :option="group.heading.option.optionGroup" :index="group.heading.index">{{
                                    getOptionGroupLabel(group.heading.option.optionGroup)
                                }}</slot>
                            </li>
                            <li
                                v-for="{ option, slotIndex: i, index, position } of group.options"
                                :key="getOptionRenderKey(option, index)"
                                :id="$id + '_' + index"
                                v-ripple
                                :style="{ height: itemSize ? itemSize + 'px' : undefined }"
                                :class="cx('option', { option, index: i, getItemOptions })"
                                role="option"
                                :aria-label="getOptionLabel(option)?.toString()"
                                :aria-selected="isSelected(option)"
                                :aria-disabled="isOptionDisabled(option)"
                                :aria-setsize="ariaSetSize"
                                :aria-posinset="position"
                                @click="onOptionSelect($event, option, index)"
                                @mousedown="onOptionMouseDown($event, index)"
                                @mousemove="onOptionMouseMove($event, index)"
                                @touchend="onOptionTouchEnd()"
                                @dblclick="onOptionDblClick($event, option)"
                                v-bind="getPTOptions(option, getItemOptions, i, 'option')"
                                :data-p-even-option="position % 2 === 0"
                                :data-p-selected="!checkmark && isSelected(option)"
                                :data-p-focused="focusedOptionIndex === index"
                                :data-p-disabled="isOptionDisabled(option)"
                            >
                                <template v-if="checkmark">
                                    <CheckIcon v-if="isSelected(option)" :class="cx('optionCheckIcon')" v-bind="ptm('optionCheckIcon')" />
                                    <span v-else :class="cx('optionBlankIcon')" aria-hidden="true" v-bind="ptm('optionBlankIcon')" />
                                </template>
                                <slot name="option" :option="option" :selected="isSelected(option)" :index="index">{{ getOptionLabel(option) }}</slot>
                            </li>
                        </ListboxOptionGroup>
                        <li
                            v-if="filterValue && (!items || (items && items.length === 0))"
                            :class="cx('emptyMessage')"
                            role="option"
                            v-bind="ptm('emptyMessage')"
                        >
                            <slot name="emptyfilter">{{ emptyFilterMessageText }}</slot>
                        </li>
                        <li v-else-if="!options || (options && options.length === 0)" :class="cx('emptyMessage')" role="option" v-bind="ptm('emptyMessage')">
                            <slot name="empty">{{ emptyMessageText }}</slot>
                        </li>
                    </ul>
                </template>
                <template v-if="$slots.loader" v-slot:loader="{ options }">
                    <slot name="loader" :options="options"></slot>
                </template>
            </VirtualScroller>
        </div>
        <slot name="footer" :value="d_value" :options="visibleOptions"></slot>
        <span
            v-if="!options || (options && options.length === 0)"
            role="status"
            aria-live="polite"
            class="rs-hidden-accessible"
            v-bind="ptm('hiddenEmptyMessage')"
            :data-p-hidden-accessible="true"
        >
            {{ emptyMessageText }}
        </span>
        <span role="status" aria-live="polite" class="rs-hidden-accessible" v-bind="ptm('hiddenSelectedMessage')" :data-p-hidden-accessible="true">
            {{ selectedMessageText }}
        </span>
        <span
            ref="lastHiddenFocusableElement"
            role="presentation"
            aria-hidden="true"
            class="rs-hidden-accessible rs-hidden-focusable"
            :tabindex="!disabled ? tabindex : -1"
            @focus="onLastHiddenFocus"
            v-bind="ptm('hiddenLastFocusableEl')"
            :data-p-hidden-accessible="true"
            :data-p-hidden-focusable="true"
        ></span>
    </div>
</template>

<script lang="ts">
import { cn } from '../internal/utils/index';
import { findSingle, focus, getFirstFocusableElement } from '../internal/utils/dom/index';
import { equals, findLastIndex, isNotEmpty, isPrintableCharacter, resolveFieldData } from '../internal/utils/object/index';
import { FilterService } from '../core/api/Api';
import { CheckIcon, SearchIcon } from '../internal/lucide';
import IconField from '../iconfield/IconField.vue';
import InputIcon from '../inputicon/InputIcon.vue';
import InputText from '../inputtext/InputText.vue';
import Ripple from '../ripple/Ripple';
import VirtualScroller from '../virtualscroller/VirtualScroller.vue';
import type { VirtualScrollerItemOptions, VirtualScrollerMethods } from '../virtualscroller/VirtualScroller';
import type { ChoiceOptionGroup } from '../internal/choice-options';
import { defineComponent, toRaw, type ComponentPublicInstance } from 'vue';
import BaseListbox from './BaseListbox.vue';
import ListboxOptionGroup from './ListboxOptionGroup.vue';

type ElementRef = Element | ComponentPublicInstance | null;
type ItemOptionsGetter = (index: number) => VirtualScrollerItemOptions;
type OptionEvent = MouseEvent | KeyboardEvent;

interface GroupHeading {
    index: number;
    option: ChoiceOptionGroup<unknown>;
}

interface RenderedGroup {
    firstIndex: number;
    heading?: GroupHeading;
    showHeading: boolean;
    options: { option: unknown; index: number; slotIndex: number; position: number }[];
}

// Named so usesCustomEquality can tell whether a component that extends Listbox replaced it.
function isEquals(this: { equalityKey?: string }, value1: unknown, value2: unknown) {
    return equals(value1, value2, this.equalityKey);
}

export default defineComponent({
    name: 'Listbox',
    extends: BaseListbox,
    inheritAttrs: false,
    emits: ['change', 'focus', 'blur', 'filter', 'item-dblclick', 'option-dblclick'],
    data() {
        return {
            list: null as HTMLUListElement | null,
            virtualScroller: null as VirtualScrollerMethods | null,
            optionTouched: false,
            startRangeIndex: -1,
            searchTimeout: null as ReturnType<typeof setTimeout> | null,
            searchValue: '',
            filterValue: null as string | null,
            focused: false,
            focusedOptionIndex: -1
        };
    },
    watch: {
        options() {
            this.autoUpdateModel();
        }
    },
    mounted() {
        this.autoUpdateModel();
    },
    beforeUnmount() {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
    },
    methods: {
        getOptionIndex(index: number, getItemOptions?: ItemOptionsGetter) {
            return this.virtualScrollerDisabled ? index : (getItemOptions?.(index).index ?? index);
        },
        getOptionLabel(option: unknown): string | number | boolean | null {
            return this.optionLabel
                ? resolveFieldData(option, this.optionLabel)
                : typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean'
                  ? option
                  : null;
        },
        getOptionValue(option: unknown) {
            return this.optionValue ? resolveFieldData(option, this.optionValue) : option;
        },
        getOptionRenderKey(option: unknown, index: number) {
            return (this.dataKey ? resolveFieldData(option, this.dataKey) : this.getOptionLabel(option)) + '_' + index;
        },
        getPTOptions(option: unknown, itemOptions: ItemOptionsGetter | undefined, index: number, key: string) {
            return this.ptm(key, {
                context: {
                    selected: this.isSelected(option),
                    focused: this.focusedOptionIndex === this.getOptionIndex(index, itemOptions),
                    disabled: this.isOptionDisabled(option)
                }
            });
        },
        isOptionDisabled(option: unknown) {
            return this.optionDisabled ? resolveFieldData(option, this.optionDisabled) : false;
        },
        isOptionGroup(option: unknown): option is ChoiceOptionGroup<unknown> {
            return !!(
                this.optionGroupLabel &&
                option &&
                typeof option === 'object' &&
                'optionGroup' in option &&
                option.optionGroup &&
                'group' in option &&
                option.group
            );
        },
        getOptionGroupLabel(optionGroup: unknown) {
            return resolveFieldData(optionGroup, this.optionGroupLabel);
        },
        getOptionGroupChildren(optionGroup: unknown): unknown[] | undefined {
            return resolveFieldData(optionGroup, this.optionGroupChildren);
        },
        renderedGroups(items: unknown[] | undefined, getItemOptions?: ItemOptionsGetter): RenderedGroup[] {
            const groups: RenderedGroup[] = [];
            let group: RenderedGroup | undefined;

            items?.forEach((option, slotIndex) => {
                const index = this.getOptionIndex(slotIndex, getItemOptions);
                const heading = this.optionGroupLabel ? this.groupedOptions.headings.get(index) : undefined;

                if (!group || group.heading !== heading) {
                    group = { firstIndex: index, heading, showHeading: false, options: [] };
                    groups.push(group);
                }

                if (heading?.index === index) group.showHeading = true;
                else group.options.push({ option, index, slotIndex, position: this.getAriaPosInset(index) });
            });

            return groups;
        },
        getAriaPosInset(index: number) {
            return (this.optionGroupLabel ? index - (this.groupedOptions.headingsBefore[index] ?? 0) : index) + 1;
        },
        onFirstHiddenFocus() {
            focus(this.list);

            const firstFocusableEl = getFirstFocusableElement(this.$el, ':not([data-p-hidden-focusable="true"])');

            const last = this.$refs.lastHiddenFocusableElement as HTMLElement;
            const first = this.$refs.firstHiddenFocusableElement as HTMLElement;

            last.tabIndex = firstFocusableEl ? 0 : -1;
            first.tabIndex = -1;
        },
        onLastHiddenFocus(event: FocusEvent) {
            const relatedTarget = event.relatedTarget;
            const first = this.$refs.firstHiddenFocusableElement as HTMLElement;
            const last = this.$refs.lastHiddenFocusableElement as HTMLElement;

            if (relatedTarget === this.list) {
                const firstFocusableEl = getFirstFocusableElement(this.$el, ':not([data-p-hidden-focusable="true"])');

                if (firstFocusableEl instanceof HTMLElement) focus(firstFocusableEl);
                first.tabIndex = 0;
            } else {
                focus(first);
            }

            last.tabIndex = -1;
        },
        onFocusout(event: FocusEvent) {
            const first = this.$refs.firstHiddenFocusableElement as HTMLElement | undefined;
            const last = this.$refs.lastHiddenFocusableElement as HTMLElement | undefined;

            if (first && last && !(event.relatedTarget instanceof Node && this.$el.contains(event.relatedTarget))) {
                last.tabIndex = first.tabIndex = 0;
            }
        },
        onListFocus(event: FocusEvent) {
            this.focused = true;
            this.focusedOptionIndex =
                this.focusedOptionIndex !== -1
                    ? this.focusedOptionIndex
                    : this.autoOptionFocus
                      ? this.findFirstFocusedOptionIndex()
                      : this.findSelectedOptionIndex();
            this.autoUpdateModel();
            this.scrollInView(this.focusedOptionIndex);
            this.$emit('focus', event);
        },
        onListBlur(event: FocusEvent) {
            this.focused = false;
            this.focusedOptionIndex = this.startRangeIndex = -1;
            this.searchValue = '';
            this.$emit('blur', event);
        },
        onListKeyDown(event: KeyboardEvent) {
            const metaKey = event.metaKey || event.ctrlKey;

            switch (event.code) {
                case 'ArrowDown':
                    this.onArrowDownKey(event);
                    break;

                case 'ArrowUp':
                    this.onArrowUpKey(event);
                    break;

                case 'Home':
                    this.onHomeKey(event);
                    break;

                case 'End':
                    this.onEndKey(event);
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
                    this.onSpaceKey(event);
                    break;

                case 'Tab':
                    //NOOP
                    break;

                case 'ShiftLeft':
                case 'ShiftRight':
                    this.onShiftKey();
                    break;

                default:
                    if (this.multiple && event.code === 'KeyA' && metaKey) {
                        const value = this.visibleOptions.filter((option) => this.isValidOption(option)).map((option) => this.getOptionValue(option));

                        this.updateModel(event, value);

                        event.preventDefault();
                        break;
                    }

                    if (!metaKey && isPrintableCharacter(event.key)) {
                        this.searchOptions(event, event.key);
                        event.preventDefault();
                    }

                    break;
            }
        },
        onOptionSelect(event: OptionEvent | null, option: unknown, index = -1) {
            if (this.disabled || this.isOptionDisabled(option)) {
                return;
            }

            this.multiple ? this.onOptionSelectMultiple(event, option) : this.onOptionSelectSingle(event, option);
            this.optionTouched = false;
            index !== -1 && (this.focusedOptionIndex = index);
        },
        onOptionMouseDown(event: MouseEvent, index: number) {
            this.changeFocusedOptionIndex(event, index);
        },
        onOptionMouseMove(event: MouseEvent, index: number) {
            if (this.focusOnHover && this.focused) {
                this.changeFocusedOptionIndex(event, index);
            }
        },
        onOptionTouchEnd() {
            if (this.disabled) {
                return;
            }

            this.optionTouched = true;
        },
        onOptionDblClick(event: MouseEvent, item: unknown) {
            this.$emit('item-dblclick', {
                originalEvent: event,
                value: item
            });
            this.$emit('option-dblclick', {
                originalEvent: event,
                value: item
            });
        },
        onOptionSelectSingle(event: OptionEvent | null, option: unknown) {
            let selected = this.isSelected(option);
            let valueChanged = false;
            let value: unknown = null;
            let metaSelection = this.optionTouched ? false : this.metaKeySelection;

            if (metaSelection) {
                let metaKey = event && (event.metaKey || event.ctrlKey);

                if (selected) {
                    if (metaKey) {
                        value = null;
                        valueChanged = true;
                    }
                } else {
                    value = this.getOptionValue(option);
                    valueChanged = true;
                }
            } else {
                value = selected ? null : this.getOptionValue(option);
                valueChanged = true;
            }

            if (valueChanged) {
                this.updateModel(event, value);
            }
        },
        onOptionSelectMultiple(event: OptionEvent | null, option: unknown) {
            let selected = this.isSelected(option);
            let value: unknown[];
            let metaSelection = this.optionTouched ? false : this.metaKeySelection;

            if (metaSelection) {
                const metaKey = event?.metaKey || event?.ctrlKey;

                if (selected) {
                    value = metaKey ? this.removeOption(option) : [this.getOptionValue(option)];
                } else {
                    const selection = metaKey ? this.selectedValues : [];

                    value = [...selection, this.getOptionValue(option)];
                }
            } else {
                value = selected ? this.removeOption(option) : [...this.selectedValues, this.getOptionValue(option)];
            }

            this.updateModel(event, value);
        },
        onOptionSelectRange(event: OptionEvent, start = -1, end = -1) {
            start === -1 && (start = this.findNearestSelectedOptionIndex(end, true));
            end === -1 && (end = this.findNearestSelectedOptionIndex(start));

            if (start !== -1 && end !== -1) {
                const rangeStart = Math.min(start, end);
                const rangeEnd = Math.max(start, end);
                const value = this.visibleOptions
                    .slice(rangeStart, rangeEnd + 1)
                    .filter((option) => this.isValidOption(option))
                    .map((option) => this.getOptionValue(option));

                this.updateModel(event, value);
            }
        },
        onFilterChange(event: Event) {
            if (!(event.target instanceof HTMLInputElement)) return;

            this.$emit('filter', { originalEvent: event, value: event.target.value, filterValue: this.visibleOptions });
            this.focusedOptionIndex = this.startRangeIndex = -1;
        },
        onFilterKeyDown(event: KeyboardEvent) {
            switch (event.code) {
                case 'ArrowDown':
                    this.onArrowDownKey(event);
                    break;

                case 'ArrowUp':
                    this.onArrowUpKey(event);
                    break;

                case 'ArrowLeft':
                case 'ArrowRight':
                    this.onArrowLeftKey(event, true);
                    break;

                case 'Home':
                    this.onHomeKey(event, true);
                    break;

                case 'End':
                    this.onEndKey(event, true);
                    break;

                case 'Enter':
                case 'NumpadEnter':
                    this.onEnterKey(event);
                    break;

                case 'ShiftLeft':
                case 'ShiftRight':
                    this.onShiftKey();
                    break;

                default:
                    break;
            }
        },
        onArrowDownKey(event: KeyboardEvent) {
            const optionIndex = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.findFirstFocusedOptionIndex();

            if (this.multiple && event.shiftKey) {
                this.onOptionSelectRange(event, this.startRangeIndex, optionIndex);
            }

            this.changeFocusedOptionIndex(event, optionIndex);
            event.preventDefault();
        },
        onArrowUpKey(event: KeyboardEvent) {
            const optionIndex = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.findLastFocusedOptionIndex();

            if (this.multiple && event.shiftKey) {
                this.onOptionSelectRange(event, optionIndex, this.startRangeIndex);
            }

            this.changeFocusedOptionIndex(event, optionIndex);
            event.preventDefault();
        },
        onArrowLeftKey(_event: KeyboardEvent, pressedInInputText = false) {
            pressedInInputText && (this.focusedOptionIndex = -1);
        },
        onHomeKey(event: KeyboardEvent, pressedInInputText = false) {
            if (pressedInInputText) {
                const target = event.currentTarget;

                if (!(target instanceof HTMLInputElement)) return;

                if (event.shiftKey) {
                    target.setSelectionRange(0, target.selectionStart ?? 0);
                } else {
                    target.setSelectionRange(0, 0);
                    this.focusedOptionIndex = -1;
                }
            } else {
                let metaKey = event.metaKey || event.ctrlKey;
                let optionIndex = this.findFirstOptionIndex();

                if (this.multiple && event.shiftKey && metaKey) {
                    this.onOptionSelectRange(event, optionIndex, this.startRangeIndex);
                }

                this.changeFocusedOptionIndex(event, optionIndex);
            }

            event.preventDefault();
        },
        onEndKey(event: KeyboardEvent, pressedInInputText = false) {
            if (pressedInInputText) {
                const target = event.currentTarget;

                if (!(target instanceof HTMLInputElement)) return;

                if (event.shiftKey) {
                    target.setSelectionRange(target.selectionStart ?? 0, target.value.length);
                } else {
                    const len = target.value.length;

                    target.setSelectionRange(len, len);
                    this.focusedOptionIndex = -1;
                }
            } else {
                let metaKey = event.metaKey || event.ctrlKey;
                let optionIndex = this.findLastOptionIndex();

                if (this.multiple && event.shiftKey && metaKey) {
                    this.onOptionSelectRange(event, this.startRangeIndex, optionIndex);
                }

                this.changeFocusedOptionIndex(event, optionIndex);
            }

            event.preventDefault();
        },
        onPageUpKey(event: KeyboardEvent) {
            this.scrollInView(0);
            event.preventDefault();
        },
        onPageDownKey(event: KeyboardEvent) {
            this.scrollInView(this.visibleOptions.length - 1);
            event.preventDefault();
        },
        onEnterKey(event: KeyboardEvent) {
            if (this.focusedOptionIndex !== -1) {
                if (this.multiple && event.shiftKey) this.onOptionSelectRange(event, this.focusedOptionIndex);
                else this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
            }
        },
        onSpaceKey(event: KeyboardEvent) {
            event.preventDefault();
            this.onEnterKey(event);
        },
        onShiftKey() {
            this.startRangeIndex = this.focusedOptionIndex;
        },
        isOptionMatched(option: unknown) {
            const label = this.getOptionLabel(option);

            return (
                this.isValidOption(option) &&
                typeof label === 'string' &&
                label.toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale))
            );
        },
        isValidOption(option: unknown) {
            return isNotEmpty(option) && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
        },
        isValidSelectedOption(option: unknown) {
            return this.isValidOption(option) && this.isSelected(option);
        },
        isEquals,
        // Values with the same key are always equal for isEquals: same dataKey field, or the same value or object.
        // toRaw gives a reactive proxy the same key as its original object.
        getSelectionKey(value: unknown): unknown {
            return this.equalityKey ? resolveFieldData(value, this.equalityKey) : toRaw(value);
        },
        isSelected(option: unknown) {
            const optionValue = this.getOptionValue(option);

            if (!this.multiple) return this.isEquals(this.d_value, optionValue);

            if (this.selectedKeys.has(this.getSelectionKey(optionValue))) return true;

            // Without an equalityKey, objects are compared by deep equality. An equal copy of the option has a different
            // key, so it can only be found by comparing against each selected value. The same goes for any value when
            // a component extending Listbox overrides isEquals with its own rule.
            const mayMatchEqualCopy = this.usesCustomEquality || (!this.equalityKey && typeof optionValue === 'object' && optionValue !== null);

            return mayMatchEqualCopy && this.selectedValues.some((value) => this.isEquals(value, optionValue));
        },
        findFirstOptionIndex() {
            return this.visibleOptions.findIndex((option) => this.isValidOption(option));
        },
        findLastOptionIndex() {
            return findLastIndex(this.visibleOptions, (option) => this.isValidOption(option));
        },
        findNextOptionIndex(index: number) {
            const matchedOptionIndex =
                index < this.visibleOptions.length - 1 ? this.visibleOptions.slice(index + 1).findIndex((option) => this.isValidOption(option)) : -1;

            return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
        },
        findPrevOptionIndex(index: number) {
            const matchedOptionIndex = index > 0 ? findLastIndex(this.visibleOptions.slice(0, index), (option) => this.isValidOption(option)) : -1;

            return matchedOptionIndex > -1 ? matchedOptionIndex : index;
        },
        findSelectedOptionIndex() {
            if (this.$filled) {
                if (this.multiple) {
                    // Index the options by selection key once, so each selected value is found without scanning every option.
                    // The first option wins for a repeated key, the same option findIndex would return.
                    const optionIndexes = new Map<unknown, number>();

                    this.visibleOptions.forEach((option, index) => {
                        if (!this.isValidOption(option)) return;

                        const key = this.getSelectionKey(this.getOptionValue(option));

                        !optionIndexes.has(key) && optionIndexes.set(key, index);
                    });

                    // Newest selected value first.
                    for (let index = this.selectedValues.length - 1; index >= 0; index--) {
                        const value = this.selectedValues[index];
                        const matchedOptionIndex = optionIndexes.get(this.getSelectionKey(value));

                        if (matchedOptionIndex !== undefined) return matchedOptionIndex;

                        // Same fallback as isSelected: an equal copy of an option object, or a value only an overridden
                        // isEquals matches, has a different key.
                        if (this.usesCustomEquality || (!this.equalityKey && typeof value === 'object' && value !== null)) {
                            const copyIndex = this.visibleOptions.findIndex(
                                (option) => this.isValidOption(option) && this.isEquals(value, this.getOptionValue(option))
                            );

                            if (copyIndex > -1) return copyIndex;
                        }
                    }
                } else {
                    return this.visibleOptions.findIndex((option) => this.isValidSelectedOption(option));
                }
            }

            return -1;
        },
        findFirstSelectedOptionIndex() {
            return this.$filled ? this.visibleOptions.findIndex((option) => this.isValidSelectedOption(option)) : -1;
        },
        findLastSelectedOptionIndex() {
            return this.$filled ? findLastIndex(this.visibleOptions, (option) => this.isValidSelectedOption(option)) : -1;
        },
        findNextSelectedOptionIndex(index: number) {
            const matchedOptionIndex =
                this.$filled && index < this.visibleOptions.length - 1
                    ? this.visibleOptions.slice(index + 1).findIndex((option) => this.isValidSelectedOption(option))
                    : -1;

            return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : -1;
        },
        findPrevSelectedOptionIndex(index: number) {
            const matchedOptionIndex =
                this.$filled && index > 0 ? findLastIndex(this.visibleOptions.slice(0, index), (option) => this.isValidSelectedOption(option)) : -1;

            return matchedOptionIndex > -1 ? matchedOptionIndex : -1;
        },
        findNearestSelectedOptionIndex(index: number, firstCheckUp = false) {
            let matchedOptionIndex = -1;

            if (this.$filled) {
                if (firstCheckUp) {
                    matchedOptionIndex = this.findPrevSelectedOptionIndex(index);
                    matchedOptionIndex = matchedOptionIndex === -1 ? this.findNextSelectedOptionIndex(index) : matchedOptionIndex;
                } else {
                    matchedOptionIndex = this.findNextSelectedOptionIndex(index);
                    matchedOptionIndex = matchedOptionIndex === -1 ? this.findPrevSelectedOptionIndex(index) : matchedOptionIndex;
                }
            }

            return matchedOptionIndex > -1 ? matchedOptionIndex : index;
        },
        findFirstFocusedOptionIndex() {
            const selectedIndex = this.findFirstSelectedOptionIndex();

            return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
        },
        findLastFocusedOptionIndex() {
            const selectedIndex = this.findLastSelectedOptionIndex();

            return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
        },
        searchOptions(event: KeyboardEvent, char: string) {
            this.searchValue = (this.searchValue || '') + char;

            let optionIndex = -1;

            if (isNotEmpty(this.searchValue)) {
                if (this.focusedOptionIndex !== -1) {
                    optionIndex = this.visibleOptions.slice(this.focusedOptionIndex).findIndex((option) => this.isOptionMatched(option));
                    optionIndex =
                        optionIndex === -1
                            ? this.visibleOptions.slice(0, this.focusedOptionIndex).findIndex((option) => this.isOptionMatched(option))
                            : optionIndex + this.focusedOptionIndex;
                } else {
                    optionIndex = this.visibleOptions.findIndex((option) => this.isOptionMatched(option));
                }

                if (optionIndex === -1 && this.focusedOptionIndex === -1) {
                    optionIndex = this.findFirstFocusedOptionIndex();
                }

                if (optionIndex !== -1) {
                    this.changeFocusedOptionIndex(event, optionIndex);
                }
            }

            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                this.searchValue = '';
                this.searchTimeout = null;
            }, 500);
        },
        removeOption(option: unknown) {
            return this.selectedValues.filter((val) => !equals(val, this.getOptionValue(option), this.equalityKey));
        },
        changeFocusedOptionIndex(event: OptionEvent, index: number) {
            if (this.focusedOptionIndex !== index) {
                this.focusedOptionIndex = index;
                this.scrollInView();

                if (this.selectOnFocus && !this.multiple) {
                    this.onOptionSelect(event, this.visibleOptions[index]);
                }
            }
        },
        scrollInView(index = -1) {
            this.$nextTick(() => {
                const id = index !== -1 ? `${this.$id}_${index}` : this.focusedOptionId;
                const element = findSingle(this.list, `li[id="${id}"]`);

                if (element) {
                    element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
                } else if (!this.virtualScrollerDisabled) {
                    this.virtualScroller && this.virtualScroller.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex);
                }
            });
        },
        autoUpdateModel() {
            if (this.selectOnFocus && this.autoOptionFocus && !this.$filled && !this.multiple && this.focused) {
                this.focusedOptionIndex = this.findFirstFocusedOptionIndex();
                this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex]);
            }
        },
        updateModel(event: OptionEvent | null, value: unknown) {
            this.writeValue(value, event ?? undefined);
            this.$emit('change', { originalEvent: event, value });
        },
        listRef(el: ElementRef, contentRef?: (el: ElementRef) => void) {
            this.list = el instanceof HTMLUListElement ? el : null;
            contentRef?.(el);
        },
        virtualScrollerRef(el: ElementRef) {
            this.virtualScroller = el as VirtualScrollerMethods | null;
        }
    },
    computed: {
        optionsListFlat(): unknown[] {
            return this.filterValue
                ? FilterService.filter(this.options, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale)
                : (this.options ?? []);
        },
        groupedOptions() {
            const items: unknown[] = [];
            const headings = new Map<number, GroupHeading>();
            const headingsBefore: number[] = [];
            let headingCount = 0;
            const applyFilter = (options: unknown[]) =>
                this.filterValue ? FilterService.filter(options, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale) : options;

            for (const option of this.options ?? []) {
                const children = this.getOptionGroupChildren(option);

                if (!Array.isArray(children)) {
                    if (applyFilter([option]).length) {
                        items.push(option);
                        headingsBefore.push(headingCount);
                    }
                    continue;
                }

                const visibleChildren = applyFilter(children);

                if (visibleChildren.length) {
                    const heading: GroupHeading = { index: items.length, option: { optionGroup: option, group: true } };

                    headings.set(items.length, heading);
                    items.push(heading.option);
                    headingsBefore.push(headingCount++);

                    for (const child of visibleChildren) {
                        headings.set(items.length, heading);
                        items.push(child);
                        headingsBefore.push(headingCount);
                    }
                }
            }

            return { items, headings, headingsBefore };
        },
        visibleOptions(): unknown[] {
            return this.optionGroupLabel ? this.groupedOptions.items : this.optionsListFlat;
        },
        // @deprecated use $filled instead
        hasSelectedOption() {
            return isNotEmpty(this.d_value);
        },
        equalityKey() {
            return this.optionValue ? undefined : this.dataKey;
        },
        // True when a component extending Listbox overrides isEquals. Selection keys can't follow its rule, so lookups
        // that miss the keys fall back to calling isEquals.
        usesCustomEquality() {
            return this.$options.methods?.isEquals !== isEquals;
        },
        // The selection keys of the selected values in multiple mode, so isSelected doesn't have to compare each option
        // against every selected value. Reading d_value through its reactive proxy makes in-place changes to the array
        // (push, splice) rebuild the set.
        selectedKeys() {
            return new Set(this.selectedValues.map((value) => this.getSelectionKey(value)));
        },
        selectedValues(): unknown[] {
            return Array.isArray(this.d_value) ? this.d_value : [];
        },
        searchFields() {
            return this.filterFields || [this.optionLabel];
        },
        filterResultMessageText() {
            return isNotEmpty(this.visibleOptions) ? this.filterMessageText.replaceAll('{0}', String(this.visibleOptions.length)) : this.emptyFilterMessageText;
        },
        filterMessageText() {
            return this.filterMessage || this.$primevue?.config.locale?.searchMessage || '';
        },
        emptyFilterMessageText() {
            return this.emptyFilterMessage || this.$primevue?.config.locale?.emptySearchMessage || this.$primevue?.config.locale?.emptyFilterMessage || '';
        },
        emptyMessageText() {
            return this.emptyMessage || this.$primevue?.config.locale?.emptyMessage || '';
        },
        selectionMessageText() {
            return this.selectionMessage || this.$primevue?.config.locale?.selectionMessage || '';
        },
        emptySelectionMessageText() {
            return this.emptySelectionMessage || this.$primevue?.config.locale?.emptySelectionMessage || '';
        },
        selectedMessageText() {
            return this.$filled
                ? this.selectionMessageText.replaceAll('{0}', this.multiple ? String(this.selectedValues.length) : '1')
                : this.emptySelectionMessageText;
        },
        focusedOptionId() {
            return this.focusedOptionIndex !== -1 ? `${this.$id}_${this.focusedOptionIndex}` : undefined;
        },
        ariaSetSize() {
            return this.visibleOptions.filter((option) => !this.isOptionGroup(option)).length;
        },
        virtualScrollerDisabled() {
            return !this.virtualScrollerOptions;
        },
        containerDataP() {
            return cn({
                invalid: this.$invalid,
                disabled: this.disabled
            });
        }
    },
    directives: {
        ripple: Ripple
    },
    components: {
        ListboxOptionGroup,
        InputText,
        VirtualScroller,
        InputIcon,
        IconField,
        SearchIcon,
        CheckIcon
    }
});
</script>
