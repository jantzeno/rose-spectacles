<template>
    <div ref="container" :class="cx('root')" :style="sx('root')" @click="onContainerClick" :data-p="containerDataP" v-bind="ptmi('root')">
        <InputText
            v-if="!multiple"
            ref="focusInput"
            :id="inputId"
            type="text"
            :name="name || $formName"
            :class="[cx('pcInputText'), inputClass]"
            :style="inputStyle"
            :defaultValue="inputValue"
            :placeholder="placeholder"
            :tabindex="!disabled ? tabindex : -1"
            :fluid="$fluid"
            :disabled="disabled"
            :size="size"
            :invalid="$invalid"
            :variant="variant"
            autocomplete="off"
            role="combobox"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            :aria-expanded="overlayVisible"
            :aria-controls="overlayVisible ? $id + '_list' : undefined"
            :aria-activedescendant="focused ? focusedOptionId : undefined"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeyDown"
            @input="onInput"
            @change="onChange"
            :formControl="{ novalidate: true }"
            :unstyled="unstyled"
            :data-p-has-dropdown="dropdown"
            :pt="ptm('pcInputText')"
        />
        <slot v-if="isClearIconVisible" name="clearicon" :class="cx('clearIcon')" :clearCallback="onClearClick">
            <TimesIcon :class="[cx('clearIcon')]" @click="onClearClick" v-bind="ptm('clearIcon')" />
        </slot>
        <ul
            v-if="multiple"
            ref="multiContainer"
            :class="cx('inputMultiple')"
            tabindex="-1"
            role="listbox"
            aria-orientation="horizontal"
            :aria-activedescendant="focused ? focusedMultipleOptionId : undefined"
            @focus="onMultipleContainerFocus"
            @blur="onMultipleContainerBlur"
            @keydown="onMultipleContainerKeyDown"
            :data-p-has-dropdown="dropdown"
            :data-p="inputMultipleDataP"
            v-bind="ptm('inputMultiple')"
        >
            <li
                v-for="(option, i) of modelValues"
                :key="`${i}_${getOptionLabel(option)}`"
                :id="$id + '_multiple_option_' + i"
                :class="cx('chipItem', { i })"
                role="option"
                :aria-label="getOptionLabel(option)?.toString()"
                :aria-selected="true"
                :aria-setsize="modelValues.length"
                :aria-posinset="i + 1"
                v-bind="ptm('chipItem')"
            >
                <slot
                    name="chip"
                    :class="cx('pcChip')"
                    :value="option"
                    :index="i"
                    :removeCallback="(event: Event) => removeOption(event, i)"
                    v-bind="ptm('pcChip')"
                >
                    <!-- TODO: removetokenicon and removeTokenIcon  deprecated since v4.0. Use chipicon slot and chipIcon prop-->
                    <Chip
                        :class="cx('pcChip')"
                        :label="getOptionLabel(option)?.toString()"
                        :removeIcon="chipIcon || removeTokenIcon"
                        :removeTabindex="-1"
                        removable
                        :unstyled="unstyled"
                        @remove="removeOption($event, i)"
                        :data-p-focused="focusedMultipleOptionIndex === i"
                        :pt="ptm('pcChip')"
                    >
                        <template #removeicon>
                            <slot
                                :name="$slots.chipicon ? 'chipicon' : 'removetokenicon'"
                                :class="cx('chipIcon')"
                                :index="i"
                                :removeCallback="(event: Event) => removeOption(event, i)"
                            />
                        </template>
                    </Chip>
                </slot>
            </li>
            <li :class="cx('inputChip')" role="option" v-bind="ptm('inputChip')">
                <input
                    ref="focusInput"
                    :id="inputId"
                    type="text"
                    :style="inputStyle"
                    :class="inputClass"
                    :placeholder="placeholder"
                    :tabindex="!disabled ? tabindex : -1"
                    :disabled="disabled"
                    autocomplete="off"
                    role="combobox"
                    :aria-label="ariaLabel"
                    :aria-labelledby="ariaLabelledby"
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                    :aria-expanded="overlayVisible"
                    :aria-controls="$id + '_list'"
                    :aria-activedescendant="focused ? focusedOptionId : undefined"
                    :aria-invalid="$invalid || undefined"
                    @focus="onFocus"
                    @blur="onBlur"
                    @keydown="onKeyDown"
                    @input="onInput"
                    @change="onChange"
                    v-bind="ptm('input')"
                />
            </li>
        </ul>
        <slot v-if="searching || loading" :class="cx('loader')" :name="$slots.loader ? 'loader' : 'loadingicon'">
            <i
                v-if="loader || loadingIcon"
                :class="['pi-spin', cx('loader'), loader, loadingIcon]"
                aria-hidden="true"
                :data-p-has-dropdown="dropdown"
                v-bind="ptm('loader')"
            />
            <SpinnerIcon v-else-if="loading" :class="cx('loader')" spin aria-hidden="true" :data-p-has-dropdown="dropdown" v-bind="ptm('loader')" />
        </slot>
        <slot :name="$slots.dropdown ? 'dropdown' : 'dropdownbutton'" :toggleCallback="(event: MouseEvent) => onDropdownClick(event)">
            <button
                v-if="dropdown"
                ref="dropdownButton"
                type="button"
                :class="[cx('dropdown'), dropdownClass]"
                :disabled="disabled"
                aria-haspopup="listbox"
                :aria-expanded="overlayVisible"
                :aria-controls="panelId"
                @click="onDropdownClick"
                v-bind="ptm('dropdown')"
            >
                <slot name="dropdownicon" :class="dropdownIcon">
                    <component :is="dropdownIcon ? 'span' : 'ChevronDownIcon'" :class="dropdownIcon" v-bind="ptm('dropdownIcon')" />
                </slot>
            </button>
        </slot>
        <span
            v-if="typeahead"
            role="status"
            aria-live="polite"
            class="rs-hidden-accessible"
            v-bind="ptm('hiddenSearchResult')"
            :data-p-hidden-accessible="true"
        >
            {{ searchResultMessageText }}
        </span>
        <Portal :appendTo="appendTo">
            <transition
                name="rs-anchored-overlay"
                @enter="onOverlayEnter"
                @after-enter="onOverlayAfterEnter"
                @leave="onOverlayLeave"
                @after-leave="onOverlayAfterLeave"
                v-bind="ptm('transition')"
            >
                <div
                    v-if="overlayVisible"
                    :ref="overlayRef"
                    :id="panelId"
                    :class="[cx('overlay'), panelClass, overlayClass]"
                    :style="{ ...panelStyle, ...overlayStyle }"
                    @click="onOverlayClick"
                    @keydown="onOverlayKeyDown"
                    :data-p="overlayDataP"
                    v-bind="ptm('overlay')"
                >
                    <slot name="header" :value="d_value" :suggestions="visibleOptions"></slot>
                    <div :class="cx('listContainer')" :style="{ 'max-height': virtualScrollerDisabled ? scrollHeight : '' }" v-bind="ptm('listContainer')">
                        <VirtualScroller
                            :ref="virtualScrollerRef"
                            v-bind="virtualScrollerOptions"
                            :style="{ height: scrollHeight }"
                            :items="visibleOptions"
                            :tabindex="-1"
                            :disabled="virtualScrollerDisabled"
                            :pt="ptm('virtualScroller')"
                        >
                            <template v-slot:content="{ styleClass, contentRef, items, getItemOptions, contentStyle, itemSize }">
                                <slot
                                    name="content"
                                    :id="$id + '_list'"
                                    :items="items ?? []"
                                    :styleClass="styleClass"
                                    :contentRef="(el: ElementRef) => listRef(el, contentRef)"
                                    :getItemOptions="getItemOptions"
                                    :contentStyle="contentStyle"
                                    :itemSize="itemSize"
                                >
                                    <ul
                                        :ref="(el) => listRef(el, contentRef)"
                                        :id="$id + '_list'"
                                        :class="[cx('list'), styleClass]"
                                        :style="contentStyle"
                                        role="listbox"
                                        :aria-label="listAriaLabel"
                                        v-bind="ptm('list')"
                                    >
                                        <template v-for="(option, i) of items" :key="getOptionRenderKey(option, getOptionIndex(i, getItemOptions))">
                                            <li
                                                v-if="isOptionGroup(option)"
                                                :id="$id + '_' + getOptionIndex(i, getItemOptions)"
                                                :style="{ height: itemSize ? itemSize + 'px' : undefined }"
                                                :class="cx('optionGroup')"
                                                role="option"
                                                v-bind="ptm('optionGroup')"
                                            >
                                                <slot name="optiongroup" :option="option.optionGroup" :index="getOptionIndex(i, getItemOptions)">{{
                                                    getOptionGroupLabel(option.optionGroup)
                                                }}</slot>
                                            </li>
                                            <li
                                                v-else
                                                :id="$id + '_' + getOptionIndex(i, getItemOptions)"
                                                v-ripple
                                                :style="{ height: itemSize ? itemSize + 'px' : undefined }"
                                                :class="cx('option', { option, i, getItemOptions })"
                                                role="option"
                                                :aria-label="getOptionLabel(option)?.toString()"
                                                :aria-selected="isSelected(option)"
                                                :aria-disabled="isOptionDisabled(option)"
                                                :aria-setsize="ariaSetSize"
                                                :aria-posinset="getAriaPosInset(getOptionIndex(i, getItemOptions))"
                                                @mousedown="onOptionMouseDown"
                                                @click="onOptionSelect($event, option)"
                                                @mousemove="onOptionMouseMove($event, getOptionIndex(i, getItemOptions))"
                                                :data-p-selected="isSelected(option)"
                                                :data-p-focused="focusedOptionIndex === getOptionIndex(i, getItemOptions)"
                                                :data-p-disabled="isOptionDisabled(option)"
                                                v-bind="getPTOptions(option, getItemOptions, i, 'option')"
                                            >
                                                <slot name="option" :option="option" :index="getOptionIndex(i, getItemOptions)">{{
                                                    getOptionLabel(option)
                                                }}</slot>
                                            </li>
                                        </template>
                                        <li
                                            v-if="showEmptyMessage && (!items || (items && items.length === 0))"
                                            :class="cx('emptyMessage')"
                                            role="option"
                                            v-bind="ptm('emptyMessage')"
                                        >
                                            <slot name="empty">{{ searchResultMessageText }}</slot>
                                        </li>
                                    </ul>
                                </slot>
                            </template>
                            <template v-if="$slots.loader" v-slot:loader="{ options }">
                                <slot name="loader" :options="options"></slot>
                            </template>
                        </VirtualScroller>
                    </div>
                    <slot name="footer" :value="d_value" :suggestions="visibleOptions"></slot>
                    <span role="status" aria-live="polite" class="rs-hidden-accessible" v-bind="ptm('hiddenSelectedMessage')" :data-p-hidden-accessible="true">
                        {{ selectedMessageText }}
                    </span>
                </div>
            </transition>
        </Portal>
    </div>
</template>

<script lang="ts">
import { cn } from '../internal/utils/index';
import { absolutePosition, addStyle, findSingle, focus, getOuterWidth, isTouchDevice, relativePosition } from '../internal/utils/dom/index';
import { equals, findLastIndex, isEmpty, isNotEmpty, resolveFieldData } from '../internal/utils/object/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { ConnectedOverlayScrollHandler } from '../core/utils/Utils';
import ChevronDownIcon from '../icons/chevrondown/ChevronDownIcon.vue';
import SpinnerIcon from '../icons/spinner/SpinnerIcon.vue';
import TimesIcon from '../icons/times/TimesIcon.vue';
import Chip from '../chip/Chip.vue';
import InputText from '../inputtext/InputText.vue';
import OverlayEventBus from '../overlayeventbus/OverlayEventBus';
import Portal from '../portal/Portal.vue';
import Ripple from '../ripple/Ripple';
import VirtualScroller from '../virtualscroller/VirtualScroller.vue';
import type { VirtualScrollerItemOptions, VirtualScrollerMethods } from '../virtualscroller/VirtualScroller';
import type { ChoiceOptionGroup } from '../internal/choice-options';
import type { Handler } from '../internal/utils/eventbus/index';
import { defineComponent, toRaw, type ComponentPublicInstance } from 'vue';
import BaseAutoComplete from './BaseAutoComplete.vue';

type ElementRef = Element | ComponentPublicInstance | null;
type ItemOptionsGetter = (index: number) => VirtualScrollerItemOptions;

// Named so usesCustomEquality can tell whether a component that extends AutoComplete replaced it.
function isEquals(this: { equalityKey?: string }, value1: unknown, value2: unknown) {
    return equals(value1, value2, this.equalityKey);
}

export default defineComponent({
    name: 'AutoComplete',
    extends: BaseAutoComplete,
    inheritAttrs: false,
    emits: [
        'change',
        'focus',
        'blur',
        'item-select',
        'item-unselect',
        'option-select',
        'option-unselect',
        'dropdown-click',
        'clear',
        'complete',
        'before-show',
        'before-hide',
        'show',
        'hide'
    ],
    inject: {
        $pcFluid: { default: null }
    },
    data() {
        return {
            clicked: false,
            focused: false,
            focusedOptionIndex: -1,
            focusedMultipleOptionIndex: -1,
            overlayVisible: false,
            searching: false,
            outsideClickListener: null as ((event: MouseEvent) => void) | null,
            resizeListener: null as (() => void) | null,
            scrollHandler: null as ConnectedOverlayScrollHandler | null,
            overlay: null as HTMLElement | null,
            list: null as HTMLElement | null,
            selfClick: false,
            overlayEventListener: null as Handler | null,
            virtualScroller: null as VirtualScrollerMethods | null,
            searchTimeout: null as ReturnType<typeof setTimeout> | null,
            dirty: false,
            startRangeIndex: -1
        };
    },
    watch: {
        suggestions() {
            if (this.searching) {
                this.show();
                this.focusedOptionIndex = this.overlayVisible && this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
                this.searching = false;
                !this.showEmptyMessage && this.visibleOptions.length === 0 && this.hide();
            }

            this.autoUpdateModel();
        }
    },
    mounted() {
        this.autoUpdateModel();
    },
    updated() {
        if (this.overlayVisible) {
            this.alignOverlay();
        }
    },
    beforeUnmount() {
        this.unbindOutsideClickListener();
        this.unbindResizeListener();

        if (this.searchTimeout) clearTimeout(this.searchTimeout);

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        if (this.overlay) {
            ZIndex.clear(this.overlay);
            this.overlay = null;
        }

        if (this.overlayEventListener) {
            OverlayEventBus.off('overlay-click', this.overlayEventListener);
            this.overlayEventListener = null;
        }
    },
    methods: {
        focusInputElement(): HTMLInputElement | undefined {
            const input = this.$refs.focusInput;

            return input instanceof HTMLInputElement ? input : (input as { $el: HTMLInputElement } | undefined)?.$el;
        },
        getOptionIndex(index: number, getItemOptions?: ItemOptionsGetter) {
            return this.virtualScrollerDisabled ? index : (getItemOptions?.(index).index ?? index);
        },
        getOptionLabel(option: unknown) {
            return this.optionLabel ? resolveFieldData(option, this.optionLabel) : option;
        },
        getOptionValue(option: unknown) {
            return option; // TODO: The 'optionValue' properties can be added.
        },
        getOptionRenderKey(option: unknown, index: number) {
            return `${String(this.dataKey ? resolveFieldData(option, this.dataKey) : this.getOptionLabel(option))}_${index}`;
        },
        getPTOptions(option: unknown, itemOptions: ItemOptionsGetter | undefined, index: number, key: string) {
            return this.ptm(key, {
                context: {
                    option,
                    index,
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
        getAriaPosInset(index: number) {
            return (this.optionGroupLabel ? index - this.visibleOptions.slice(0, index).filter((option) => this.isOptionGroup(option)).length : index) + 1;
        },
        show(isFocus?: boolean) {
            this.$emit('before-show');
            this.dirty = true;
            this.overlayVisible = true;
            this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
            isFocus && focus(this.focusInputElement());
        },
        hide(isFocus?: boolean) {
            const _hide = () => {
                this.$emit('before-hide');
                this.dirty = !!isFocus;
                this.overlayVisible = false;
                this.clicked = false;
                this.focusedOptionIndex = -1;

                isFocus && focus(this.focusInputElement());
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

            if (!this.dirty && this.completeOnFocus) {
                this.search(event, this.focusInputElement()?.value, 'focus');
            }

            this.dirty = true;
            this.focused = true;

            if (this.overlayVisible) {
                this.focusedOptionIndex =
                    this.focusedOptionIndex !== -1
                        ? this.focusedOptionIndex
                        : this.overlayVisible && this.autoOptionFocus
                          ? this.findFirstFocusedOptionIndex()
                          : -1;
                this.scrollInView(this.focusedOptionIndex);
            }

            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            this.dirty = false;
            this.focused = false;
            this.focusedOptionIndex = -1;
            this.$emit('blur', event);
            this.formField.onBlur?.();
        },
        onKeyDown(event: KeyboardEvent) {
            if (this.disabled) {
                event.preventDefault();

                return;
            }

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

                case 'PageDown':
                    this.onPageDownKey(event);
                    break;

                case 'PageUp':
                    this.onPageUpKey(event);
                    break;

                case 'Enter':
                case 'NumpadEnter':
                    this.onEnterKey(event);
                    break;

                case 'Space':
                    this.onSpaceKey(event);
                    break;

                case 'Escape':
                    this.onEscapeKey(event);
                    break;

                case 'Tab':
                    this.onTabKey(event);
                    break;

                case 'ShiftLeft':
                case 'ShiftRight':
                    this.onShiftKey();
                    break;

                case 'Backspace':
                    this.onBackspaceKey(event);
                    break;

                default:
                    break;
            }

            this.clicked = false;
        },
        onInput(event: Event) {
            if (this.typeahead && event.target instanceof HTMLInputElement) {
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }

                let query = event.target.value;

                if (!this.multiple) {
                    this.updateModel(event, query);
                }

                if (query.length === 0) {
                    this.searching = false;
                    this.hide();
                    this.$emit('clear');
                } else {
                    if (query.length >= this.minLength) {
                        this.focusedOptionIndex = -1;

                        this.searchTimeout = setTimeout(() => {
                            this.search(event, query, 'input');
                        }, this.delay);
                    } else {
                        this.searching = false;
                        this.hide();
                    }
                }
            }
        },
        onChange(event: Event) {
            if (this.forceSelection) {
                let valid = false;

                // when forceSelection is on, prevent called twice onOptionSelect()
                if (this.visibleOptions && !this.multiple) {
                    const value = this.focusInputElement()?.value;
                    const matchedValue = this.visibleOptions.find((option) => this.isOptionMatched(option, value || ''));

                    if (matchedValue !== undefined) {
                        valid = true;
                        !this.isSelected(matchedValue) && this.onOptionSelect(event, matchedValue);
                    }
                }

                if (!valid) {
                    const input = this.focusInputElement();

                    if (input) input.value = '';
                    this.$emit('clear');
                    !this.multiple && this.updateModel(event, null);
                }
            }
        },
        onMultipleContainerFocus() {
            if (this.disabled) {
                // For ScreenReaders
                return;
            }

            this.focused = true;
        },
        onMultipleContainerBlur() {
            this.focusedMultipleOptionIndex = -1;
            this.focused = false;
        },
        onMultipleContainerKeyDown(event: KeyboardEvent) {
            if (this.disabled) {
                event.preventDefault();

                return;
            }

            switch (event.code) {
                case 'ArrowLeft':
                    this.onArrowLeftKeyOnMultiple();
                    break;

                case 'ArrowRight':
                    this.onArrowRightKeyOnMultiple();
                    break;

                case 'Backspace':
                    this.onBackspaceKeyOnMultiple(event);
                    break;

                default:
                    break;
            }
        },
        onContainerClick(event: MouseEvent) {
            this.clicked = true;

            if (this.disabled || this.searching || this.loading || this.isDropdownClicked(event)) {
                return;
            }

            if (event.target instanceof Node && !this.overlay?.contains(event.target)) {
                focus(this.focusInputElement());
            }
        },
        onDropdownClick(event: MouseEvent) {
            let query: string | undefined;

            if (this.overlayVisible) {
                this.hide(true);
            } else {
                const target = this.focusInputElement();

                focus(target);
                query = target?.value;

                if (this.dropdownMode === 'blank') this.search(event, '', 'dropdown');
                else if (this.dropdownMode === 'current') this.search(event, query, 'dropdown');
            }

            this.$emit('dropdown-click', { originalEvent: event, query });
        },
        onOptionMouseDown(event: MouseEvent) {
            if (this.forceSelection && event.button === 0) event.preventDefault();
        },
        onOptionSelect(event: Event | null, option: unknown, isHide = true) {
            const value = this.getOptionValue(option);

            if (this.multiple) {
                const input = this.focusInputElement();

                if (input) input.value = '';

                if (!this.isSelected(option)) {
                    this.updateModel(event, [...this.modelValues, value]);
                }
            } else {
                this.updateModel(event, value);
            }

            this.$emit('item-select', { originalEvent: event, value: option });
            this.$emit('option-select', { originalEvent: event, value: option });

            isHide && this.hide(true);
        },
        onOptionMouseMove(event: MouseEvent, index: number) {
            if (this.focusOnHover) {
                this.changeFocusedOptionIndex(event, index);
            }
        },
        onOptionSelectRange(event: KeyboardEvent, start = -1, end = -1) {
            start === -1 && (start = this.findNearestSelectedOptionIndex(end, true));
            end === -1 && (end = this.findNearestSelectedOptionIndex(start));

            if (start !== -1 && end !== -1) {
                const rangeStart = Math.min(start, end);
                const rangeEnd = Math.max(start, end);
                const value = this.visibleOptions
                    .slice(rangeStart, rangeEnd + 1)
                    .filter((option) => this.isValidOption(option))
                    .filter((option) => !this.isSelected(option))
                    .map((option) => this.getOptionValue(option));

                this.updateModel(event, [...this.modelValues, ...value]);
            }
        },
        onClearClick(event: Event) {
            this.updateModel(event, null);
            this.$emit('clear');
        },
        onOverlayClick(event: MouseEvent) {
            OverlayEventBus.emit('overlay-click', {
                originalEvent: event,
                target: this.$el
            });
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
                return;
            }

            const optionIndex =
                this.focusedOptionIndex !== -1
                    ? this.findNextOptionIndex(this.focusedOptionIndex)
                    : this.clicked
                      ? this.findFirstOptionIndex()
                      : this.findFirstFocusedOptionIndex();

            if (this.multiple && event.shiftKey) {
                this.onOptionSelectRange(event, this.startRangeIndex, optionIndex);
            }

            this.changeFocusedOptionIndex(event, optionIndex);

            event.preventDefault();
        },
        onArrowUpKey(event: KeyboardEvent) {
            if (!this.overlayVisible) {
                return;
            }

            if (event.altKey) {
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

                if (this.multiple && event.shiftKey) {
                    this.onOptionSelectRange(event, optionIndex, this.startRangeIndex);
                }

                this.changeFocusedOptionIndex(event, optionIndex);

                event.preventDefault();
            }
        },
        onArrowLeftKey(event: KeyboardEvent) {
            const target = this.focusInputElement();

            this.focusedOptionIndex = -1;

            if (this.multiple) {
                if (isEmpty(target?.value) && this.$filled) {
                    focus(this.$refs.multiContainer as HTMLElement | undefined);
                    this.focusedMultipleOptionIndex = this.modelValues.length;
                } else {
                    event.stopPropagation(); // To prevent onArrowLeftKeyOnMultiple method
                }
            }
        },
        onArrowRightKey(event: KeyboardEvent) {
            this.focusedOptionIndex = -1;

            this.multiple && event.stopPropagation(); // To prevent onArrowRightKeyOnMultiple method
        },
        onHomeKey(event: KeyboardEvent) {
            const { currentTarget } = event;

            if (!(currentTarget instanceof HTMLInputElement)) return;

            const metaKey = event.metaKey || event.ctrlKey;
            const optionIndex = this.findFirstOptionIndex();

            if (this.multiple && event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, optionIndex, this.startRangeIndex);
            }

            const anchor = this.selectionAnchor(currentTarget);

            currentTarget.setSelectionRange(0, event.shiftKey ? anchor : 0, event.shiftKey ? 'backward' : 'none');
            this.focusedOptionIndex = -1;

            event.preventDefault();
        },
        onEndKey(event: KeyboardEvent) {
            const { currentTarget } = event;

            if (!(currentTarget instanceof HTMLInputElement)) return;

            const len = currentTarget.value.length;
            const metaKey = event.metaKey || event.ctrlKey;
            const optionIndex = this.findLastOptionIndex();

            if (this.multiple && event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, this.startRangeIndex, optionIndex);
            }

            const anchor = this.selectionAnchor(currentTarget);

            currentTarget.setSelectionRange(event.shiftKey ? anchor : len, len, event.shiftKey ? 'forward' : 'none');
            this.focusedOptionIndex = -1;

            event.preventDefault();
        },
        selectionAnchor(input: HTMLInputElement) {
            return (input.selectionDirection === 'backward' ? input.selectionEnd : input.selectionStart) ?? 0;
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
            if (!this.typeahead) {
                if (this.multiple) {
                    const input = this.focusInputElement();
                    const query = input?.value.trim();

                    if (input && query) {
                        this.updateModel(event, [...this.modelValues, query]);
                        input.value = '';
                        event.preventDefault();
                    }
                }
            } else {
                if (!this.overlayVisible) {
                    this.focusedOptionIndex = -1; // reset
                    this.onArrowDownKey(event);
                } else {
                    if (this.focusedOptionIndex !== -1) {
                        if (this.multiple && event.shiftKey) {
                            this.onOptionSelectRange(event, this.focusedOptionIndex);
                        } else {
                            this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
                        }

                        event.preventDefault();
                    }

                    this.hide();
                }
            }
        },
        onSpaceKey(event: KeyboardEvent) {
            if (!this.autoOptionFocus && this.focusedOptionIndex !== -1) {
                this.onEnterKey(event);
            }
        },
        onEscapeKey(event: KeyboardEvent) {
            this.overlayVisible && this.hide(true);
            event.preventDefault();
        },
        onTabKey(event: KeyboardEvent) {
            if (this.focusedOptionIndex !== -1) {
                this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex], false);
            }

            this.overlayVisible && this.hide();
        },
        onShiftKey() {
            this.startRangeIndex = this.focusedOptionIndex;
        },
        onBackspaceKey(event: KeyboardEvent) {
            if (this.multiple) {
                if (this.modelValues.length && !this.focusInputElement()?.value) {
                    const removedValue = this.modelValues[this.modelValues.length - 1];
                    const newValue = this.modelValues.slice(0, -1);

                    this.writeValue(newValue, event);
                    this.$emit('item-unselect', { originalEvent: event, value: removedValue });
                    this.$emit('option-unselect', { originalEvent: event, value: removedValue });
                }

                event.stopPropagation(); // To prevent onBackspaceKeyOnMultiple method
            }
        },
        onArrowLeftKeyOnMultiple() {
            this.focusedMultipleOptionIndex = this.focusedMultipleOptionIndex < 1 ? 0 : this.focusedMultipleOptionIndex - 1;
        },
        onArrowRightKeyOnMultiple() {
            this.focusedMultipleOptionIndex++;

            if (this.focusedMultipleOptionIndex > this.modelValues.length - 1) {
                this.focusedMultipleOptionIndex = -1;
                focus(this.focusInputElement());
            }
        },
        onBackspaceKeyOnMultiple(event: KeyboardEvent) {
            if (this.focusedMultipleOptionIndex !== -1) {
                this.removeOption(event, this.focusedMultipleOptionIndex);
            }
        },
        onOverlayEnter(el: Element) {
            if (!(el instanceof HTMLElement)) return;

            ZIndex.set('overlay', el, this.$primevue?.config.zIndex?.overlay);

            addStyle(el, { position: 'absolute', top: '0' });
            this.alignOverlay();

            // Issue: #7508
            this.$attrSelector && el.setAttribute(this.$attrSelector, '');

            this.overlayEventListener = (e) => {
                if (e && typeof e === 'object' && 'target' in e && e.target instanceof Node && this.overlay?.contains(e.target)) {
                    this.selfClick = true;
                }
            };

            OverlayEventBus.on('overlay-click', this.overlayEventListener);
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
            if (this.overlayEventListener) {
                OverlayEventBus.off('overlay-click', this.overlayEventListener);
                this.overlayEventListener = null;
            }

            this.$emit('hide');
            this.overlay = null;
        },
        onOverlayAfterLeave(el: Element) {
            if (!(el instanceof HTMLElement)) return;

            ZIndex.clear(el);
        },
        alignOverlay() {
            const target = this.multiple ? (this.$refs.multiContainer as HTMLElement | undefined) : this.focusInputElement();

            if (!target || !this.overlay) return;

            if (this.appendTo === 'self') {
                relativePosition(this.overlay, target);
            } else {
                this.overlay.style.minWidth = getOuterWidth(target) + 'px';
                absolutePosition(this.overlay, target);
            }
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.overlayVisible && this.overlay && !this.selfClick && !this.isNestedOverlayVisible() && this.isOutsideClicked(event)) {
                        this.hide();
                    }

                    this.selfClick = false;
                };

                document.addEventListener('click', this.outsideClickListener, true);
            }
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener, true);
                this.outsideClickListener = null;
                this.selfClick = false;
            }
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
        isOutsideClicked(event: MouseEvent) {
            return event.target instanceof Node && !this.overlay?.contains(event.target) && !this.isInputClicked(event) && !this.isDropdownClicked(event);
        },
        isNestedOverlayVisible() {
            return !!this.overlay?.querySelector('[aria-expanded="true"]');
        },
        isInputClicked(event: MouseEvent) {
            if (!this.multiple) return event.target === this.focusInputElement();

            const container = this.$refs.multiContainer;

            return event.target instanceof Node && container instanceof HTMLElement && container.contains(event.target);
        },
        isDropdownClicked(event: MouseEvent) {
            const dropdown = this.$refs.dropdownButton;

            return event.target instanceof Node && dropdown instanceof HTMLElement && dropdown.contains(event.target);
        },
        isOptionMatched(option: unknown, value: string) {
            if (!this.isValidOption(option)) return false;

            const label = this.getOptionLabel(option);

            return label != null && String(label).toLocaleLowerCase(this.searchLocale) === value.toLocaleLowerCase(this.searchLocale);
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

            // Without an equalityKey, objects are compared by deep equality. An equal copy of the suggestion, such as the
            // same item returned by a new search, has a different key, so it can only be found by comparing against each
            // selected value. The same goes for any value when a component extending AutoComplete overrides isEquals.
            const mayMatchEqualCopy = this.usesCustomEquality || (!this.equalityKey && typeof optionValue === 'object' && optionValue !== null);

            return mayMatchEqualCopy && this.modelValues.some((value) => this.isEquals(value, optionValue));
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
            return this.$filled ? this.visibleOptions.findIndex((option) => this.isValidSelectedOption(option)) : -1;
        },
        findFirstFocusedOptionIndex() {
            const selectedIndex = this.findSelectedOptionIndex();

            return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
        },
        findLastFocusedOptionIndex() {
            const selectedIndex = this.findSelectedOptionIndex();

            return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
        },
        search(event: Event, query: string | null | undefined, source: 'input' | 'focus' | 'dropdown') {
            //allow empty string but not undefined or null
            if (query === undefined || query === null) {
                return;
            }

            //do not search blank values on input change
            if (source === 'input' && query.trim().length === 0) {
                return;
            }

            this.searching = true;
            this.$emit('complete', { originalEvent: event, query });
        },
        removeOption(event: Event, index: number) {
            const removedOption = this.modelValues[index];
            const value = this.modelValues.filter((_, i) => i !== index).map((option) => this.getOptionValue(option));

            this.updateModel(event, value);
            this.$emit('item-unselect', { originalEvent: event, value: removedOption });
            this.$emit('option-unselect', { originalEvent: event, value: removedOption });
            this.dirty = true;
            focus(this.focusInputElement());
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
                    element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' });
                } else if (!this.virtualScrollerDisabled) {
                    this.virtualScroller && this.virtualScroller.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex);
                }
            });
        },
        autoUpdateModel() {
            if (this.selectOnFocus && this.autoOptionFocus && !this.$filled) {
                this.focusedOptionIndex = this.findFirstFocusedOptionIndex();
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
            this.list = el instanceof HTMLElement ? el : null;
            contentRef?.(el);
        },
        virtualScrollerRef(el: ElementRef) {
            this.virtualScroller = el as VirtualScrollerMethods | null;
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
        }
    },
    computed: {
        modelValues(): unknown[] {
            return Array.isArray(this.d_value) ? this.d_value : [];
        },
        visibleOptions(): unknown[] {
            return this.optionGroupLabel ? this.flatOptions(this.suggestions) : this.suggestions || [];
        },
        inputValue() {
            if (this.$filled) {
                if (typeof this.d_value === 'object') {
                    const label = this.getOptionLabel(this.d_value);

                    return label != null ? label : this.d_value;
                } else {
                    return this.d_value;
                }
            } else {
                return '';
            }
        },
        // @deprecated use $filled instead.
        hasSelectedOption() {
            return this.$filled;
        },
        equalityKey() {
            // @todo: The 'optionValue' properties can be added.
            return this.dataKey;
        },
        // True when a component extending AutoComplete overrides isEquals. Selection keys can't follow its rule, so
        // lookups that miss the keys fall back to calling isEquals.
        usesCustomEquality() {
            return this.$options.methods?.isEquals !== isEquals;
        },
        // The selection keys of the selected values in multiple mode, so isSelected doesn't have to compare each
        // suggestion against every selected value. Reading d_value through its reactive proxy makes in-place changes to
        // the array (push, splice) rebuild the set.
        selectedKeys() {
            return new Set(this.modelValues.map((value) => this.getSelectionKey(value)));
        },
        searchResultMessageText() {
            return isNotEmpty(this.visibleOptions) && this.overlayVisible
                ? this.searchMessageText.replaceAll('{0}', String(this.visibleOptions.length))
                : this.emptySearchMessageText;
        },
        searchMessageText() {
            return this.searchMessage || this.$primevue?.config.locale?.searchMessage || '';
        },
        emptySearchMessageText() {
            return this.emptySearchMessage || this.$primevue?.config.locale?.emptySearchMessage || '';
        },
        selectionMessageText() {
            return this.selectionMessage || this.$primevue?.config.locale?.selectionMessage || '';
        },
        emptySelectionMessageText() {
            return this.emptySelectionMessage || this.$primevue?.config.locale?.emptySelectionMessage || '';
        },
        selectedMessageText() {
            return this.$filled
                ? this.selectionMessageText.replaceAll('{0}', this.multiple ? String(this.modelValues.length) : '1')
                : this.emptySelectionMessageText;
        },
        listAriaLabel() {
            return this.$primevue?.config.locale?.aria?.listLabel;
        },
        focusedOptionId() {
            return this.focusedOptionIndex !== -1 ? `${this.$id}_${this.focusedOptionIndex}` : undefined;
        },
        focusedMultipleOptionId() {
            return this.focusedMultipleOptionIndex !== -1 ? `${this.$id}_multiple_option_${this.focusedMultipleOptionIndex}` : undefined;
        },
        isClearIconVisible() {
            return this.showClear && this.$filled && !this.disabled && !this.loading;
        },
        ariaSetSize() {
            return this.visibleOptions.filter((option) => !this.isOptionGroup(option)).length;
        },
        virtualScrollerDisabled() {
            return !this.virtualScrollerOptions;
        },
        panelId() {
            return this.$id + '_panel';
        },
        containerDataP() {
            return cn({
                fluid: this.$fluid
            });
        },
        overlayDataP() {
            return cn({
                ['portal-' + this.appendTo]: 'portal-' + this.appendTo
            });
        },
        inputMultipleDataP() {
            return cn({
                invalid: this.$invalid,
                disabled: this.disabled,
                focus: this.focused,
                fluid: this.$fluid,
                filled: this.$variant === 'filled',
                empty: !this.$filled,
                [this.size]: this.size
            });
        }
    },
    components: {
        InputText,
        VirtualScroller,
        Portal,
        Chip,
        ChevronDownIcon,
        SpinnerIcon,
        TimesIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
