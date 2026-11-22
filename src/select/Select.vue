<template>
    <div
        ref="container"
        :id="$id"
        :class="cx('root')"
        @click="onContainerClick"
        :data-p="containerDataP"
        v-bind="ptmi('root', { context: ptSelectionContext })"
    >
        <input
            v-if="editable"
            ref="focusInput"
            :name="name"
            :id="labelId || inputId"
            type="text"
            :class="[cx('label'), inputClass, labelClass]"
            :style="[inputStyle, labelStyle]"
            :value="editableInputValue"
            :placeholder="placeholder"
            :tabindex="!disabled ? tabindex : -1"
            :disabled="disabled"
            autocomplete="off"
            role="combobox"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            aria-haspopup="listbox"
            :aria-expanded="overlayVisible"
            :aria-controls="overlayVisible ? $id + '_list' : undefined"
            :aria-activedescendant="focused ? focusedOptionId : undefined"
            :aria-invalid="invalid || undefined"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeyDown"
            @input="onEditableInput"
            :data-p="labelDataP"
            v-bind="getPTOptions('label')"
        />
        <span
            v-else
            ref="focusInput"
            :name="name"
            :id="labelId || inputId"
            :class="[cx('label'), inputClass, labelClass]"
            :style="[inputStyle, labelStyle]"
            :tabindex="!disabled ? tabindex : -1"
            role="combobox"
            :aria-label="ariaLabel || (label === 'rs-emptylabel' ? undefined : label?.toString())"
            :aria-labelledby="ariaLabelledby"
            aria-haspopup="listbox"
            :aria-expanded="overlayVisible"
            :aria-controls="$id + '_list'"
            :aria-activedescendant="focused ? focusedOptionId : undefined"
            :aria-invalid="invalid || undefined"
            :aria-disabled="disabled"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeyDown"
            :data-p="labelDataP"
            v-bind="getPTOptions('label')"
        >
            <slot name="value" :value="d_value" :placeholder="placeholder">{{ label === 'rs-emptylabel' ? '&nbsp;' : (label ?? 'empty') }}</slot>
        </span>
        <slot v-if="isClearIconVisible" name="clearicon" :class="cx('clearIcon')" :clearCallback="onClearClick">
            <button type="button" :class="cx('clearButton')" :tabindex="tabindex < 0 ? -1 : 0" :aria-label="clearButtonLabel" @click.stop="onClearClick">
                <component
                    :is="clearIcon ? 'i' : 'TimesIcon'"
                    ref="clearIcon"
                    :class="[cx('clearIcon'), clearIcon]"
                    aria-hidden="true"
                    v-bind="getPTOptions('clearIcon')"
                    data-pc-section="clearicon"
                />
            </button>
        </slot>
        <div :class="cx('dropdown')" v-bind="getPTOptions('dropdown')">
            <slot v-if="loading" name="loadingicon" :class="cx('loadingIcon')">
                <span v-if="loadingIcon" :class="[cx('loadingIcon'), 'pi-spin', loadingIcon]" aria-hidden="true" v-bind="getPTOptions('loadingIcon')" />
                <SpinnerIcon v-else :class="cx('loadingIcon')" spin aria-hidden="true" v-bind="getPTOptions('loadingIcon')" />
            </slot>
            <slot v-else name="dropdownicon" :class="cx('dropdownIcon')">
                <component
                    :is="dropdownIcon ? 'span' : 'ChevronDownIcon'"
                    :class="[cx('dropdownIcon'), dropdownIcon]"
                    aria-hidden="true"
                    :data-p="dropdownIconDataP"
                    v-bind="getPTOptions('dropdownIcon')"
                />
            </slot>
        </div>
        <Portal :appendTo="appendTo">
            <transition
                name="rs-anchored-overlay"
                @enter="onOverlayEnter"
                @after-enter="onOverlayAfterEnter"
                @leave="onOverlayLeave"
                @after-leave="onOverlayAfterLeave"
                v-bind="getPTOptions('transition')"
            >
                <div
                    v-if="overlayVisible"
                    :ref="overlayRef"
                    :class="[cx('overlay'), panelClass, overlayClass]"
                    :style="[panelStyle, overlayStyle]"
                    @click="onOverlayClick"
                    @mousedown="onOverlayMouseDown"
                    @keydown="onOverlayKeyDown"
                    :data-p="overlayDataP"
                    v-bind="getPTOptions('overlay')"
                >
                    <span
                        ref="firstHiddenFocusableElementOnOverlay"
                        role="presentation"
                        aria-hidden="true"
                        class="rs-hidden-accessible rs-hidden-focusable"
                        :tabindex="0"
                        @focus="onFirstHiddenFocus"
                        v-bind="getPTOptions('hiddenFirstFocusableEl')"
                        :data-p-hidden-accessible="true"
                        :data-p-hidden-focusable="true"
                    ></span>
                    <slot name="header" :value="d_value" :options="visibleOptions"></slot>
                    <div v-if="filter" :class="cx('header')" v-bind="getPTOptions('header')">
                        <IconField :unstyled="unstyled" :pt="getPTOptions('pcFilterContainer')">
                            <InputText
                                ref="filterInput"
                                type="text"
                                :value="filterValue"
                                @vue:mounted="onFilterUpdated"
                                @vue:updated="onFilterUpdated"
                                :class="cx('pcFilter')"
                                :placeholder="filterPlaceholder"
                                :variant="variant"
                                :unstyled="unstyled"
                                role="searchbox"
                                autocomplete="off"
                                :aria-owns="$id + '_list'"
                                :aria-activedescendant="focusedOptionId"
                                @keydown="onFilterKeyDown"
                                @blur="onFilterBlur"
                                @input="onFilterChange"
                                :pt="getPTOptions('pcFilter')"
                                :formControl="{ novalidate: true }"
                            />
                            <InputIcon :unstyled="unstyled" :pt="getPTOptions('pcFilterIconContainer')">
                                <slot name="filtericon">
                                    <span v-if="filterIcon" :class="filterIcon" v-bind="getPTOptions('filterIcon')" />
                                    <SearchIcon v-else v-bind="getPTOptions('filterIcon')" />
                                </slot>
                            </InputIcon>
                        </IconField>
                        <span
                            role="status"
                            aria-live="polite"
                            class="rs-hidden-accessible"
                            v-bind="getPTOptions('hiddenFilterResult')"
                            :data-p-hidden-accessible="true"
                        >
                            {{ filterResultMessageText }}
                        </span>
                    </div>
                    <div
                        :class="cx('listContainer')"
                        :style="{ 'max-height': virtualScrollerDisabled ? scrollHeight : '' }"
                        v-bind="getPTOptions('listContainer')"
                    >
                        <VirtualScroller
                            :ref="virtualScrollerRef"
                            v-bind="virtualScrollerOptions"
                            :items="visibleOptions"
                            :style="{ height: scrollHeight }"
                            :tabindex="-1"
                            :disabled="virtualScrollerDisabled"
                            :pt="getPTOptions('virtualScroller')"
                        >
                            <template v-slot:content="{ styleClass, contentRef, items, getItemOptions, contentStyle, itemSize }">
                                <ul
                                    :ref="(el) => listRef(el, contentRef)"
                                    :id="$id + '_list'"
                                    :class="[cx('list'), styleClass]"
                                    :style="contentStyle"
                                    role="listbox"
                                    v-bind="getPTOptions('list')"
                                >
                                    <template v-for="(option, i) of items" :key="getOptionRenderKey(option, getOptionIndex(i, getItemOptions))">
                                        <li
                                            v-if="isOptionGroup(option)"
                                            :id="$id + '_' + getOptionIndex(i, getItemOptions)"
                                            :style="{ height: itemSize ? itemSize + 'px' : undefined }"
                                            :class="cx('optionGroup')"
                                            role="option"
                                            v-bind="getPTItemOptions(option, getItemOptions, i, 'optionGroup')"
                                        >
                                            <slot name="optiongroup" :option="option.optionGroup" :index="getOptionIndex(i, getItemOptions)">
                                                <span
                                                    :class="cx('optionGroupLabel')"
                                                    v-bind="getPTItemOptions(option, getItemOptions, i, 'optionGroupLabel')"
                                                    >{{ getOptionGroupLabel(option.optionGroup) }}</span
                                                >
                                            </slot>
                                        </li>
                                        <li
                                            v-else
                                            :id="$id + '_' + getOptionIndex(i, getItemOptions)"
                                            v-ripple
                                            :class="cx('option', { option, focusedOption: getOptionIndex(i, getItemOptions) })"
                                            :style="{ height: itemSize ? itemSize + 'px' : undefined }"
                                            role="option"
                                            :aria-label="getOptionLabel(option)?.toString()"
                                            :aria-selected="isSelected(option)"
                                            :aria-disabled="isOptionDisabled(option)"
                                            :aria-setsize="ariaSetSize"
                                            :aria-posinset="getAriaPosInset(getOptionIndex(i, getItemOptions))"
                                            @mousedown="onOptionSelect($event, option)"
                                            @mousemove="onOptionMouseMove($event, getOptionIndex(i, getItemOptions))"
                                            @click.stop
                                            :data-p-selected="!checkmark && isSelected(option)"
                                            :data-p-focused="focusedOptionIndex === getOptionIndex(i, getItemOptions)"
                                            :data-p-disabled="isOptionDisabled(option)"
                                            v-bind="getPTItemOptions(option, getItemOptions, i, 'option')"
                                        >
                                            <template v-if="checkmark">
                                                <CheckIcon
                                                    v-if="isSelected(option)"
                                                    :class="cx('optionCheckIcon')"
                                                    v-bind="getPTItemOptions(option, getItemOptions, i, 'optionCheckIcon')"
                                                />
                                                <BlankIcon
                                                    v-else
                                                    :class="cx('optionBlankIcon')"
                                                    v-bind="getPTItemOptions(option, getItemOptions, i, 'optionBlankIcon')"
                                                />
                                            </template>
                                            <slot name="option" :option="option" :selected="isSelected(option)" :index="getOptionIndex(i, getItemOptions)">
                                                <span :class="cx('optionLabel')" v-bind="getPTItemOptions(option, getItemOptions, i, 'optionLabel')">{{
                                                    getOptionLabel(option)
                                                }}</span>
                                            </slot>
                                        </li>
                                    </template>
                                    <li
                                        v-if="filterValue && (!items || (items && items.length === 0))"
                                        :class="cx('emptyMessage')"
                                        role="option"
                                        v-bind="getPTOptions('emptyMessage')"
                                        :data-p-hidden-accessible="true"
                                    >
                                        <slot name="emptyfilter">{{ emptyFilterMessageText }}</slot>
                                    </li>
                                    <li
                                        v-else-if="!options || (options && options.length === 0)"
                                        :class="cx('emptyMessage')"
                                        role="option"
                                        v-bind="getPTOptions('emptyMessage')"
                                        :data-p-hidden-accessible="true"
                                    >
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
                        v-bind="getPTOptions('hiddenEmptyMessage')"
                        :data-p-hidden-accessible="true"
                    >
                        {{ emptyMessageText }}
                    </span>
                    <span
                        role="status"
                        aria-live="polite"
                        class="rs-hidden-accessible"
                        v-bind="getPTOptions('hiddenSelectedMessage')"
                        :data-p-hidden-accessible="true"
                    >
                        {{ selectedMessageText }}
                    </span>
                    <span
                        ref="lastHiddenFocusableElementOnOverlay"
                        role="presentation"
                        aria-hidden="true"
                        class="rs-hidden-accessible rs-hidden-focusable"
                        :tabindex="0"
                        @focus="onLastHiddenFocus"
                        v-bind="getPTOptions('hiddenLastFocusableEl')"
                        :data-p-hidden-accessible="true"
                        :data-p-hidden-focusable="true"
                    ></span>
                </div>
            </transition>
        </Portal>
    </div>
</template>

<script lang="ts">
import { defineComponent, type ComponentPublicInstance } from 'vue';
import { cn } from '../internal/utils/index';
import {
    absolutePosition,
    addStyle,
    findSingle,
    focus,
    getFirstFocusableElement,
    getFocusableElements,
    getLastFocusableElement,
    getOuterWidth,
    isAndroid,
    isTouchDevice,
    isVisible,
    relativePosition
} from '../internal/utils/dom/index';
import { equals, findLastIndex, isNotEmpty, isPrintableCharacter, resolveFieldData } from '../internal/utils/object/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { FilterService } from '../core/api/Api';
import { ConnectedOverlayScrollHandler } from '../core/utils/Utils';
import BlankIcon from '../icons/blank/BlankIcon.vue';
import CheckIcon from '../icons/check/CheckIcon.vue';
import ChevronDownIcon from '../icons/chevrondown/ChevronDownIcon.vue';
import SearchIcon from '../icons/search/SearchIcon.vue';
import SpinnerIcon from '../icons/spinner/SpinnerIcon.vue';
import TimesIcon from '../icons/times/TimesIcon.vue';
import IconField from '../iconfield/IconField.vue';
import InputIcon from '../inputicon/InputIcon.vue';
import InputText from '../inputtext/InputText.vue';
import OverlayEventBus from '../overlayeventbus/OverlayEventBus';
import { listenForOutsideOverlayClick } from '../internal/overlay-dismissal';
import Portal from '../portal/Portal.vue';
import Ripple from '../ripple/Ripple';
import VirtualScroller from '../virtualscroller/VirtualScroller.vue';
import type { VirtualScrollerItemOptions, VirtualScrollerMethods } from '../virtualscroller/VirtualScroller';
import type { ChoiceOptionGroup } from '../internal/choice-options';
import BaseSelect from './BaseSelect.vue';

type ElementRef = Element | ComponentPublicInstance | null;
type ItemOptionsGetter = (index: number) => VirtualScrollerItemOptions;

export default defineComponent({
    name: 'Select',
    extends: BaseSelect,
    inheritAttrs: false,
    emits: ['change', 'focus', 'blur', 'before-show', 'before-hide', 'show', 'hide', 'filter'],
    data() {
        return {
            clicked: false,
            focused: false,
            focusedOptionIndex: -1,
            filterValue: null as string | null,
            stopOutsideClickListener: null as (() => void) | null,
            scrollHandler: null as ConnectedOverlayScrollHandler | null,
            resizeListener: null as (() => void) | null,
            labelClickListener: null as (() => void) | null,
            labelClickTarget: null as HTMLLabelElement | null,
            matchMediaOrientationListener: null as (() => void) | null,
            overlay: null as HTMLElement | null,
            list: null as HTMLUListElement | null,
            virtualScroller: null as VirtualScrollerMethods | null,
            searchTimeout: null as ReturnType<typeof setTimeout> | null,
            searchValue: '',
            isModelValueChanged: false,
            overlayVisible: false,
            queryOrientation: null as MediaQueryList | null
        };
    },
    watch: {
        modelValue() {
            this.isModelValueChanged = true;
        },
        options() {
            this.autoUpdateModel();
        }
    },
    mounted() {
        this.autoUpdateModel();
        this.bindLabelClickListener();
        this.bindMatchMediaOrientationListener();
    },
    updated() {
        if (this.overlayVisible && this.isModelValueChanged) {
            this.scrollInView(this.findSelectedOptionIndex());
        }

        this.isModelValueChanged = false;
    },
    beforeUnmount() {
        this.unbindOutsideClickListener();
        this.unbindResizeListener();
        this.unbindLabelClickListener();
        this.unbindMatchMediaOrientationListener();

        if (this.searchTimeout) clearTimeout(this.searchTimeout);

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        if (this.overlay) {
            ZIndex.clear(this.overlay);
            this.overlay = null;
        }
    },
    methods: {
        filterInputElement(): HTMLInputElement | undefined {
            return (this.$refs.filterInput as { $el: HTMLInputElement } | undefined)?.$el;
        },
        getOptionIndex(index: number, getItemOptions?: ItemOptionsGetter) {
            return this.virtualScrollerDisabled ? index : (getItemOptions?.(index).index ?? index);
        },
        getOptionLabel(option: unknown) {
            return this.optionLabel ? resolveFieldData(option, this.optionLabel) : option;
        },
        getOptionValue(option: unknown) {
            return this.optionValue ? resolveFieldData(option, this.optionValue) : option;
        },
        getOptionRenderKey(option: unknown, index: number) {
            return String(this.dataKey ? resolveFieldData(option, this.dataKey) : this.getOptionLabel(option)) + '_' + index;
        },
        getPTOptions(key: string) {
            return this.ptm(key, { context: this.ptSelectionContext });
        },
        getPTItemOptions(option: unknown, itemOptions: ItemOptionsGetter | undefined, index: number, key: string) {
            const optionIndex = this.getOptionIndex(index, itemOptions);
            return this.ptm(key, {
                context: {
                    option,
                    index: optionIndex,
                    selected: this.isSelected(option),
                    focused: this.focusedOptionIndex === optionIndex,
                    disabled: !!this.isOptionDisabled(option)
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
        getAriaPosInset(index: number) {
            return (this.optionGroupLabel ? index - this.visibleOptions.slice(0, index).filter((option) => this.isOptionGroup(option)).length : index) + 1;
        },
        show(isFocus?: boolean) {
            this.$emit('before-show');
            this.overlayVisible = true;
            this.focusedOptionIndex =
                this.focusedOptionIndex !== -1
                    ? this.focusedOptionIndex
                    : this.autoOptionFocus
                      ? this.findFirstFocusedOptionIndex()
                      : this.editable
                        ? -1
                        : this.findSelectedOptionIndex();

            isFocus && focus(this.$refs.focusInput as HTMLElement | undefined);
        },
        hide(isFocus?: boolean) {
            const _hide = () => {
                this.$emit('before-hide');
                this.overlayVisible = false;
                this.clicked = false;
                this.focusedOptionIndex = -1;
                this.searchValue = '';

                this.resetFilterOnHide && (this.filterValue = null);
                isFocus && focus(this.$refs.focusInput as HTMLElement | undefined);
            };

            setTimeout(() => {
                _hide();
            }, 0); // For ScreenReaders
        },
        onFocus(event: FocusEvent) {
            if (this.disabled) {
                // For ScreenReaders
                return;
            }

            this.focused = true;

            if (this.overlayVisible) {
                this.focusedOptionIndex =
                    this.focusedOptionIndex !== -1
                        ? this.focusedOptionIndex
                        : this.autoOptionFocus
                          ? this.findFirstFocusedOptionIndex()
                          : this.editable
                            ? -1
                            : this.findSelectedOptionIndex();
                this.scrollInView(this.focusedOptionIndex);
            }

            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            setTimeout(() => {
                this.focused = false;
                this.focusedOptionIndex = -1;
                this.searchValue = '';
                this.$emit('blur', event);
                this.formField.onBlur?.(event);
            }, 100);
        },
        onKeyDown(event: KeyboardEvent) {
            if (this.disabled) {
                event.preventDefault();

                return;
            }

            if (isAndroid()) {
                switch (event.code) {
                    case 'Backspace':
                        this.onBackspaceKey(event, this.editable);
                        break;
                    case 'Enter':
                    case 'NumpadDecimal':
                        this.onEnterKey(event);
                        break;
                    default:
                        event.preventDefault();
                        return;
                }
            }

            const metaKey = event.metaKey || event.ctrlKey;

            switch (event.code) {
                case 'ArrowDown':
                    this.onArrowDownKey(event);
                    break;

                case 'ArrowUp':
                    this.onArrowUpKey(event, this.editable);
                    break;

                case 'ArrowLeft':
                case 'ArrowRight':
                    this.onArrowLeftKey(event, this.editable);
                    break;

                case 'Home':
                    this.onHomeKey(event, this.editable);
                    break;

                case 'End':
                    this.onEndKey(event, this.editable);
                    break;

                case 'PageDown':
                    this.onPageDownKey(event);
                    break;

                case 'PageUp':
                    this.onPageUpKey(event);
                    break;

                case 'Space':
                    this.onSpaceKey(event, this.editable);
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

                case 'Backspace':
                    this.onBackspaceKey(event, this.editable);
                    break;

                case 'ShiftLeft':
                case 'ShiftRight':
                    //NOOP
                    break;

                default:
                    if (!metaKey && isPrintableCharacter(event.key)) {
                        !this.overlayVisible && this.show();
                        !this.editable && this.searchOptions(event, event.key);

                        if (this.filter) {
                            this.$nextTick(() => {
                                if (this.$refs.filterInput) {
                                    focus(this.filterInputElement());
                                }
                            });
                        }
                    }

                    break;
            }

            this.clicked = false;
        },
        onEditableInput(event: Event) {
            if (!(event.target instanceof HTMLInputElement)) return;

            const value = event.target.value;

            this.searchValue = '';
            const matched = this.searchOptions(event, value);

            !matched && (this.focusedOptionIndex = -1);

            this.updateModel(event, value);

            !this.overlayVisible && isNotEmpty(value) && this.show();
        },
        onContainerClick(event: MouseEvent) {
            if (this.disabled || this.loading) {
                return;
            }

            const target = event.target;

            if (
                !(target instanceof Element) ||
                target.tagName === 'INPUT' ||
                target.getAttribute('data-pc-section') === 'clearicon' ||
                target.closest('[data-pc-section="clearicon"]')
            ) {
                return;
            } else if (!this.overlay || !this.overlay.contains(target)) {
                this.overlayVisible ? this.hide(true) : this.show(true);
            }

            this.clicked = true;
        },
        onClearClick(event: Event) {
            this.updateModel(event, null);
            this.resetFilterOnClear && (this.filterValue = null);
            focus(this.$refs.focusInput as HTMLElement | undefined);
        },
        onFirstHiddenFocus(event: FocusEvent) {
            const focusableEl =
                event.relatedTarget === this.$refs.focusInput && this.overlay
                    ? getFirstFocusableElement(this.overlay, ':not([data-p-hidden-focusable="true"])')
                    : this.$refs.focusInput;

            if (focusableEl instanceof HTMLElement) focus(focusableEl);
        },
        onLastHiddenFocus(event: FocusEvent) {
            const focusableEl =
                event.relatedTarget === this.$refs.focusInput && this.overlay
                    ? getLastFocusableElement(this.overlay, ':not([data-p-hidden-focusable="true"])')
                    : this.$refs.focusInput;

            if (focusableEl instanceof HTMLElement) focus(focusableEl);
        },
        onOptionSelect(event: Event | null, option: unknown, isHide = true) {
            if (!this.overlayVisible) return;

            const value = this.getOptionValue(option);
            this.updateModel(event, value);
            isHide && this.hide(true);
        },
        onOptionMouseMove(event: MouseEvent, index: number) {
            if (this.focusOnHover) {
                this.changeFocusedOptionIndex(event, index);
            }
        },
        onFilterChange(event: Event) {
            if (!(event.target instanceof HTMLInputElement)) return;

            const value = event.target.value;

            this.filterValue = value;
            this.focusedOptionIndex = -1;
            this.$emit('filter', { originalEvent: event, value });

            if (!this.virtualScrollerDisabled) this.virtualScroller?.scrollToIndex(0);
        },
        onFilterKeyDown(event: KeyboardEvent) {
            // Check if the event is part of a text composition process (e.g., for Asian languages).
            // If event.isComposing is true, it means the user is still composing text and the input is not finalized.
            if (event.isComposing) return;

            switch (event.code) {
                case 'ArrowDown':
                    this.onArrowDownKey(event);
                    break;

                case 'ArrowUp':
                    this.onArrowUpKey(event, true);
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

                case 'Escape':
                    this.onEscapeKey(event);
                    break;

                case 'Tab':
                    this.onTabKey(event);
                    break;

                default:
                    break;
            }
        },
        onFilterBlur() {
            this.focusedOptionIndex = -1;
        },
        onFilterUpdated() {
            if (this.overlayVisible) {
                this.alignOverlay();
            }
        },
        onOverlayClick(event: MouseEvent) {
            OverlayEventBus.emit('overlay-click', {
                originalEvent: event,
                target: this.$el
            });
        },
        onOverlayMouseDown(event: MouseEvent) {
            this.onOverlayClick(event);
        },
        onOverlayKeyDown(event: KeyboardEvent) {
            switch (event.code) {
                case 'Escape':
                    this.onEscapeKey(event);
                    break;

                default:
                    break;
            }
        },
        onArrowDownKey(event: KeyboardEvent) {
            if (!this.overlayVisible) {
                this.show();
                this.editable && this.changeFocusedOptionIndex(event, this.findSelectedOptionIndex());
            } else {
                const optionIndex =
                    this.focusedOptionIndex !== -1
                        ? this.findNextOptionIndex(this.focusedOptionIndex)
                        : this.clicked
                          ? this.findFirstOptionIndex()
                          : this.findFirstFocusedOptionIndex();

                this.changeFocusedOptionIndex(event, optionIndex);
            }

            event.preventDefault();
        },
        onArrowUpKey(event: KeyboardEvent, pressedInInputText = false) {
            if (event.altKey && !pressedInInputText) {
                if (this.focusedOptionIndex !== -1) {
                    this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
                }

                this.overlayVisible && this.hide();
                event.preventDefault();
            } else {
                const optionIndex =
                    this.focusedOptionIndex !== -1
                        ? this.findPrevOptionIndex(this.focusedOptionIndex)
                        : this.clicked
                          ? this.findLastOptionIndex()
                          : this.findLastFocusedOptionIndex();

                this.changeFocusedOptionIndex(event, optionIndex);

                !this.overlayVisible && this.show();
                event.preventDefault();
            }
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
                this.changeFocusedOptionIndex(event, this.findFirstOptionIndex());

                !this.overlayVisible && this.show();
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
                this.changeFocusedOptionIndex(event, this.findLastOptionIndex());

                !this.overlayVisible && this.show();
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
            if (!this.overlayVisible) {
                this.focusedOptionIndex = -1; // reset
                this.onArrowDownKey(event);
            } else {
                if (this.focusedOptionIndex !== -1) {
                    this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
                }

                this.hide(true);
            }

            event.preventDefault();
        },
        onSpaceKey(event: KeyboardEvent, pressedInInputText = false) {
            !pressedInInputText && this.onEnterKey(event);
        },
        onEscapeKey(event: KeyboardEvent) {
            this.overlayVisible && this.hide(true);
            event.preventDefault();
            event.stopPropagation(); //@todo will be changed next versionss
        },
        onTabKey(event: KeyboardEvent, pressedInInputText = false) {
            if (!pressedInInputText) {
                if (this.overlayVisible && this.hasFocusableElements()) {
                    focus(this.$refs.firstHiddenFocusableElementOnOverlay as HTMLElement | undefined);

                    event.preventDefault();
                } else {
                    if (this.focusedOptionIndex !== -1) {
                        this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex], false);
                    }

                    this.overlayVisible && this.hide();
                }
            }
        },
        onBackspaceKey(_event: KeyboardEvent, pressedInInputText = false) {
            if (pressedInInputText) {
                !this.overlayVisible && this.show();
            }
        },
        onOverlayEnter(el: Element) {
            if (!(el instanceof HTMLElement)) return;

            ZIndex.set('overlay', el, this.$primevue?.config.zIndex?.overlay);

            addStyle(el, { position: 'absolute', top: '0' });
            this.alignOverlay();
            this.scrollInView();

            // Issue: #7508
            this.$attrSelector && el.setAttribute(this.$attrSelector, '');

            setTimeout(() => {
                this.autoFilterFocus && this.filter && focus(this.filterInputElement());
                this.autoUpdateModel();
            }, 1);
        },
        onOverlayAfterEnter() {
            this.bindOutsideClickListener();
            this.bindScrollListener();
            this.bindResizeListener();

            this.$emit('show');
        },
        onOverlayLeave(el: Element) {
            if (!(el instanceof HTMLElement)) return;

            el.style.pointerEvents = 'none';
            this.unbindOutsideClickListener();
            this.unbindScrollListener();
            this.unbindResizeListener();

            if (this.autoFilterFocus && this.filter && !this.editable) {
                this.$nextTick(() => {
                    if (this.$refs.filterInput) {
                        focus(this.filterInputElement());
                    }
                });
            }

            this.$emit('hide');
            this.overlay = null;
        },
        onOverlayAfterLeave(el: Element) {
            if (!(el instanceof HTMLElement)) return;

            ZIndex.clear(el);
        },
        alignOverlay() {
            if (!this.overlay) return;

            if (this.appendTo === 'self') {
                relativePosition(this.overlay, this.$el);
            } else {
                this.overlay.style.minWidth = getOuterWidth(this.$el) + 'px';
                absolutePosition(this.overlay, this.$el);
            }
        },
        bindOutsideClickListener() {
            if (!this.stopOutsideClickListener && this.overlay) {
                this.stopOutsideClickListener = listenForOutsideOverlayClick(this.$el, this.overlay, () => {
                    if (this.overlayVisible) this.hide();
                });
            }
        },
        unbindOutsideClickListener() {
            this.stopOutsideClickListener?.();
            this.stopOutsideClickListener = null;
        },
        bindScrollListener() {
            if (!this.scrollHandler) {
                this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container as HTMLElement, () => {
                    if (this.overlayVisible) {
                        this.hide();
                    }
                });
            }

            this.scrollHandler.bindScrollListener();
        },
        unbindScrollListener() {
            if (this.scrollHandler) {
                this.scrollHandler.unbindScrollListener();
            }
        },
        bindResizeListener() {
            if (!this.resizeListener) {
                this.resizeListener = () => {
                    if (this.overlayVisible && !isTouchDevice()) {
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
        bindLabelClickListener() {
            if (!this.editable && !this.labelClickListener) {
                const label = document.querySelector(`label[for="${this.labelId}"]`);

                if (label instanceof HTMLLabelElement && isVisible(label)) {
                    this.labelClickListener = () => {
                        focus(this.$refs.focusInput as HTMLElement | undefined);
                    };

                    this.labelClickTarget = label;
                    label.addEventListener('click', this.labelClickListener);
                }
            }
        },
        unbindLabelClickListener() {
            if (this.labelClickListener) {
                this.labelClickTarget?.removeEventListener('click', this.labelClickListener);
                this.labelClickTarget = null;
                this.labelClickListener = null;
            }
        },
        bindMatchMediaOrientationListener() {
            if (!this.matchMediaOrientationListener) {
                const query = matchMedia(`(orientation: portrait)`);

                this.queryOrientation = query;

                this.matchMediaOrientationListener = () => {
                    this.alignOverlay();
                };

                this.queryOrientation.addEventListener('change', this.matchMediaOrientationListener);
            }
        },
        unbindMatchMediaOrientationListener() {
            if (this.matchMediaOrientationListener) {
                this.queryOrientation?.removeEventListener('change', this.matchMediaOrientationListener);
                this.queryOrientation = null;
                this.matchMediaOrientationListener = null;
            }
        },
        hasFocusableElements() {
            return !!this.overlay && getFocusableElements(this.overlay, ':not([data-p-hidden-focusable="true"])').length > 0;
        },
        isOptionExactMatched(option: unknown) {
            const label = this.getOptionLabel(option);

            return (
                this.isValidOption(option) &&
                typeof label === 'string' &&
                label.toLocaleLowerCase(this.filterLocale) === this.searchValue.toLocaleLowerCase(this.filterLocale)
            );
        },
        isOptionStartsWith(option: unknown) {
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
        isSelected(option: unknown) {
            return equals(this.d_value, this.getOptionValue(option), this.equalityKey);
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
            return this.visibleOptions.findIndex((option) => this.isValidSelectedOption(option));
        },
        findFirstFocusedOptionIndex() {
            const selectedIndex = this.findSelectedOptionIndex();

            return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
        },
        findLastFocusedOptionIndex() {
            const selectedIndex = this.findSelectedOptionIndex();

            return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
        },
        searchOptions(event: Event, char: string) {
            this.searchValue = (this.searchValue || '') + char;

            let optionIndex = -1;
            let matched = false;

            if (isNotEmpty(this.searchValue)) {
                optionIndex = this.visibleOptions.findIndex((option) => this.isOptionExactMatched(option));

                if (optionIndex === -1) {
                    optionIndex = this.visibleOptions.findIndex((option) => this.isOptionStartsWith(option));
                }

                if (optionIndex !== -1) {
                    matched = true;
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

            return matched;
        },
        changeFocusedOptionIndex(event: Event, index: number) {
            if (this.focusedOptionIndex !== index) {
                this.focusedOptionIndex = index;
                this.scrollInView();

                if (this.selectOnFocus) {
                    this.onOptionSelect(event, this.visibleOptions[index], false);
                }
            }
        },
        scrollInView(index = -1) {
            this.$nextTick(() => {
                const id = index !== -1 ? `${this.$id}_${index}` : this.focusedOptionId;
                const element = findSingle(this.list, `li[id="${id}"]`);

                if (element) {
                    element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                } else if (!this.virtualScrollerDisabled) {
                    this.virtualScroller && this.virtualScroller.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex);
                }
            });
        },
        autoUpdateModel() {
            if (this.autoOptionFocus) {
                this.focusedOptionIndex = this.findFirstFocusedOptionIndex();
            }

            if (this.selectOnFocus && this.autoOptionFocus && !this.$filled) {
                this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex], false);
            }
        },
        updateModel(event: Event | null, value: unknown) {
            this.writeValue(value, event ?? undefined);
            this.$emit('change', { originalEvent: event, value });
        },
        flatOptions(options: unknown[] | undefined): unknown[] {
            return (options || []).reduce<unknown[]>((result, option, index) => {
                result.push({ optionGroup: option, group: true, index });

                const optionGroupChildren = this.getOptionGroupChildren(option);

                optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o));

                return result;
            }, []);
        },
        overlayRef(el: ElementRef) {
            this.overlay = el instanceof HTMLElement ? el : null;
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
        ptSelectionContext() {
            const index = this.findSelectedOptionIndex();
            const option = this.visibleOptions[index];

            return {
                option,
                index,
                selected: index !== -1,
                focused: index !== -1 && this.focusedOptionIndex === index,
                disabled: this.disabled
            };
        },
        visibleOptions(): unknown[] {
            const options = this.optionGroupLabel ? this.flatOptions(this.options) : this.options || [];

            if (this.filterValue) {
                const filteredOptions = FilterService.filter(options, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);

                if (this.optionGroupLabel) {
                    const optionGroups = this.options || [];
                    const filtered: object[] = [];

                    optionGroups.forEach((group) => {
                        const groupChildren = this.getOptionGroupChildren(group) ?? [];
                        const filteredItems = groupChildren.filter((item) => filteredOptions.includes(item));

                        if (filteredItems.length > 0)
                            filtered.push({
                                ...(group && typeof group === 'object' ? group : {}),
                                [typeof this.optionGroupChildren === 'string' ? this.optionGroupChildren : 'items']: [...filteredItems]
                            });
                    });

                    return this.flatOptions(filtered);
                }

                return filteredOptions;
            }

            return options;
        },
        // @deprecated use $filled instead
        hasSelectedOption() {
            return this.$filled;
        },
        label() {
            const selectedOptionIndex = this.findSelectedOptionIndex();

            return selectedOptionIndex !== -1 ? this.getOptionLabel(this.visibleOptions[selectedOptionIndex]) : this.placeholder || 'rs-emptylabel';
        },
        editableInputValue() {
            const selectedOptionIndex = this.findSelectedOptionIndex();

            return selectedOptionIndex !== -1 ? this.getOptionLabel(this.visibleOptions[selectedOptionIndex]) : this.d_value || '';
        },
        equalityKey() {
            return this.optionValue ? undefined : this.dataKey;
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
            return this.$filled ? this.selectionMessageText.replaceAll('{0}', '1') : this.emptySelectionMessageText;
        },
        focusedOptionId() {
            return this.focusedOptionIndex !== -1 ? `${this.$id}_${this.focusedOptionIndex}` : undefined;
        },
        ariaSetSize() {
            return this.visibleOptions.filter((option) => !this.isOptionGroup(option)).length;
        },
        isClearIconVisible() {
            return this.showClear && this.d_value != null && !this.disabled && !this.loading;
        },
        clearButtonLabel() {
            return this.$primevue?.config.locale?.clear || 'Clear';
        },
        virtualScrollerDisabled() {
            return !this.virtualScrollerOptions;
        },
        containerDataP() {
            return cn({
                invalid: this.$invalid,
                disabled: this.disabled,
                focus: this.focused,
                fluid: this.$fluid,
                filled: this.$variant === 'filled',
                [this.size]: this.size
            });
        },
        labelDataP() {
            return cn({
                placeholder: !this.editable && this.label === this.placeholder,
                clearable: this.showClear,
                disabled: this.disabled,
                editable: this.editable,
                [this.size]: this.size,
                empty:
                    !this.editable && !this.$slots['value'] && (this.label === 'rs-emptylabel' || (typeof this.label === 'string' && this.label.length === 0))
            });
        },
        dropdownIconDataP() {
            return cn({
                [this.size]: this.size
            });
        },
        overlayDataP() {
            return cn({
                ['portal-' + this.appendTo]: 'portal-' + this.appendTo
            });
        }
    },
    directives: {
        ripple: Ripple
    },
    components: {
        InputText,
        VirtualScroller,
        Portal,
        InputIcon,
        IconField,
        TimesIcon,
        ChevronDownIcon,
        SpinnerIcon,
        SearchIcon,
        CheckIcon,
        BlankIcon
    }
});
</script>
