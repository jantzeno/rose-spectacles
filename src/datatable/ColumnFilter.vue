<template>
    <div :class="cx('filter')" v-bind="getColumnPT('filter')">
        <div
            v-if="display === 'row'"
            ref="filterElementContainer"
            :class="cx('filterElementContainer')"
            v-bind="{ ...filterInputProps, ...getColumnPT('filterElementContainer') }"
        >
            <component :is="filterElement" :field="field" :filterModel="fieldFilter" :filterCallback="filterCallback" />
        </div>
        <Button
            v-if="showMenuButton"
            ref="icon"
            :aria-label="columnFilterButtonAriaLabel"
            aria-haspopup="true"
            :aria-expanded="overlayVisible"
            :aria-controls="overlayVisible ? overlayId : undefined"
            :class="cx('pcColumnFilterButton')"
            :unstyled="unstyled"
            @click="toggleMenu($event)"
            @keydown="onToggleButtonKeyDown($event)"
            v-bind="{ ...getColumnPT('pcColumnFilterButton', ptmFilterMenuParams), ...filterButtonProps?.filter }"
        >
            <template #icon="slotProps">
                <component
                    :is="filterIconTemplate || (hasFilter() ? 'FilterFillIcon' : 'FilterIcon')"
                    :class="slotProps.class"
                    v-bind="getColumnPT('filterMenuIcon')"
                />
            </template>
        </Button>
        <Button
            v-if="display === 'row' && showClearButton && hasRowFilter()"
            type="button"
            :aria-label="clearButtonLabel"
            :class="cx('pcColumnFilterClearButton')"
            :unstyled="unstyled"
            @click="clearInlineFilter"
            v-bind="{ ...getColumnPT('pcColumnFilterClearButton', ptmHeaderFilterClearParams), ...filterButtonProps?.inline?.clear }"
        >
            <template #icon="slotProps">
                <component :is="filterClearIconTemplate || 'FilterSlashIcon'" :class="slotProps.class" v-bind="getColumnPT('filterClearIcon')" />
            </template>
        </Button>
        <Portal>
            <transition
                name="rs-anchored-overlay"
                @enter="onOverlayEnter"
                @after-enter="onOverlayAfterEnter"
                @leave="onOverlayLeave"
                @after-leave="onOverlayAfterLeave"
                v-bind="getColumnPT('transition')"
            >
                <div
                    v-if="overlayVisible"
                    :ref="overlayRef"
                    :id="overlayId"
                    v-focustrap
                    :aria-modal="overlayVisible"
                    role="dialog"
                    :class="[cx('filterOverlay'), filterMenuClass]"
                    @keydown.escape="hide"
                    @click="onContentClick"
                    @mousedown="onContentMouseDown"
                    v-bind="getColumnPT('filterOverlay')"
                >
                    <component :is="filterHeaderTemplate" :field="field" :filterModel="fieldFilter" :filterCallback="filterCallback" />
                    <template v-if="display === 'row'">
                        <ul :class="cx('filterConstraintList')" v-bind="getColumnPT('filterConstraintList')">
                            <li
                                v-for="(matchMode, i) of matchModes"
                                :key="matchMode.label"
                                :class="cx('filterConstraint', { matchMode })"
                                @click="onRowMatchModeChange(matchMode.value)"
                                @keydown="onRowMatchModeKeyDown($event)"
                                @keydown.enter.prevent="onRowMatchModeChange(matchMode.value)"
                                :tabindex="i === 0 ? 0 : undefined"
                                v-bind="getColumnPT('filterConstraint', ptmFilterConstraintOptions(matchMode))"
                            >
                                {{ matchMode.label }}
                            </li>
                            <li :class="cx('filterConstraintSeparator')" v-bind="getColumnPT('filterConstraintSeparator')"></li>
                            <li
                                :class="cx('filterConstraint')"
                                @click="clearFilter()"
                                @keydown="onRowMatchModeKeyDown($event)"
                                @keydown.enter.prevent="clearFilter()"
                                v-bind="getColumnPT('filterConstraint')"
                            >
                                {{ noFilterLabel }}
                            </li>
                        </ul>
                    </template>
                    <template v-else>
                        <div v-if="isShowOperator" :class="cx('filterOperator')" v-bind="getColumnPT('filterOperator')">
                            <Select
                                :options="operatorOptions"
                                :modelValue="operator"
                                :aria-label="filterOperatorAriaLabel"
                                :class="cx('pcFilterOperatorDropdown')"
                                optionLabel="label"
                                optionValue="value"
                                @update:modelValue="onOperatorChange($event)"
                                :unstyled="unstyled"
                                :pt="getColumnPT('pcFilterOperatorDropdown')"
                            ></Select>
                        </div>
                        <div :class="cx('filterRuleList')" v-bind="getColumnPT('filterRuleList')">
                            <div v-for="(fieldConstraint, i) of fieldConstraints" :key="i" :class="cx('filterRule')" v-bind="getColumnPT('filterRule')">
                                <Select
                                    v-if="isShowMatchModes"
                                    :options="matchModes"
                                    :modelValue="fieldConstraint.matchMode"
                                    :class="cx('pcFilterConstraintDropdown')"
                                    optionLabel="label"
                                    optionValue="value"
                                    :aria-label="filterRuleAriaLabel"
                                    @update:modelValue="onMenuMatchModeChange($event, i)"
                                    :unstyled="unstyled"
                                    :pt="getColumnPT('pcFilterConstraintDropdown')"
                                ></Select>
                                <component
                                    v-if="display === 'menu'"
                                    :is="filterElement"
                                    :field="field"
                                    :filterModel="fieldConstraint"
                                    :filterCallback="filterCallback"
                                    :applyFilter="applyFilter"
                                />
                                <div v-if="showRemoveIcon" v-bind="getColumnPT('filterRemove')">
                                    <Button
                                        type="button"
                                        :class="cx('pcFilterRemoveRuleButton')"
                                        @click="removeConstraint(i)"
                                        :label="removeRuleButtonLabel"
                                        :unstyled="unstyled"
                                        v-bind="filterButtonProps?.popover?.removeRule"
                                        :pt="getColumnPT('pcFilterRemoveRuleButton')"
                                    >
                                        <template #icon="iconProps">
                                            <component
                                                :is="filterRemoveIconTemplate || 'TrashIcon'"
                                                :class="iconProps.class"
                                                v-bind="getColumnIconPT('pcFilterRemoveRuleButton')"
                                            />
                                        </template>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div v-if="isShowAddConstraint" v-bind="getColumnPT('filterAddButtonContainer')">
                            <Button
                                type="button"
                                :label="addRuleButtonLabel"
                                iconPos="left"
                                :class="cx('pcFilterAddRuleButton')"
                                @click="addConstraint()"
                                :unstyled="unstyled"
                                v-bind="filterButtonProps?.popover?.addRule"
                                :pt="getColumnPT('pcFilterAddRuleButton')"
                            >
                                <template #icon="iconProps">
                                    <component
                                        :is="filterAddIconTemplate || 'PlusIcon'"
                                        :class="iconProps.class"
                                        v-bind="getColumnIconPT('pcFilterAddRuleButton')"
                                    />
                                </template>
                            </Button>
                        </div>
                        <div :class="cx('filterButtonbar')" v-bind="getColumnPT('filterButtonbar')">
                            <Button
                                v-if="!filterClearTemplate && showClearButton"
                                type="button"
                                :class="cx('pcFilterClearButton')"
                                :label="clearButtonLabel"
                                @click="clearFilter()"
                                :unstyled="unstyled"
                                v-bind="filterButtonProps?.popover?.clear"
                                :pt="getColumnPT('pcFilterClearButton')"
                            ></Button>
                            <component v-else :is="filterClearTemplate" :field="field" :filterModel="fieldFilter" :filterCallback="clearFilter" />
                            <template v-if="showApplyButton">
                                <Button
                                    v-if="!filterApplyTemplate"
                                    type="button"
                                    :class="cx('pcFilterApplyButton')"
                                    :label="applyButtonLabel"
                                    @click="applyFilter()"
                                    :unstyled="unstyled"
                                    v-bind="filterButtonProps?.popover?.apply"
                                    :pt="getColumnPT('pcFilterApplyButton')"
                                ></Button>
                                <component v-else :is="filterApplyTemplate" :field="field" :filterModel="fieldFilter" :filterCallback="applyFilter" />
                            </template>
                        </div>
                    </template>
                    <component :is="filterFooterTemplate" :field="field" :filterModel="fieldFilter" :filterCallback="filterCallback" />
                </div>
            </transition>
        </Portal>
    </div>
</template>

<script lang="ts">
import { getColumnPassThroughProps } from '../internal/column-pass-through';
import { absolutePosition, addStyle, focus, getAttribute, getFirstFocusableElement, isTouchDevice } from '../internal/utils/dom/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { FilterOperator } from '../core/api/Api';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { ConnectedOverlayScrollHandler } from '../core/utils/Utils';
import { FilterFillIcon, FilterIcon, FilterSlashIcon, PlusIcon, TrashIcon } from '../internal/lucide';
import Button from '../button/Button.vue';
import FocusTrap from '../focustrap/FocusTrap';
import OverlayEventBus from '../overlayeventbus/OverlayEventBus';
import { isOwnedOverlayTarget } from '../internal/overlay-dismissal';
import Portal from '../portal/Portal.vue';
import Select from '../select/Select.vue';
import { defineComponent, mergeProps, type ComponentPublicInstance, type PropType, type VNode } from 'vue';
import type { PrimeVueLocaleOptions } from 'rose-spectacles/core/config';

interface FilterConstraint {
    value?: unknown;
    matchMode?: string | null;
}

interface FieldFilter extends FilterConstraint {
    operator?: string | null;
    constraints?: FilterConstraint[];
}

type FilterMap = Record<string, FieldFilter>;

type FilterOption = { label?: string; value: string };
type FilterOverlay = HTMLElement & { $focustrap?: { autoFocus(): void } };
type FilterScrollPosition = { container: HTMLElement; left: number; top: number };
type FilterButtons = {
    filter?: Record<string, unknown>;
    inline?: { clear?: Record<string, unknown> };
    popover?: Partial<Record<'clear' | 'apply' | 'addRule' | 'removeRule', Record<string, unknown>>>;
};

export default defineComponent({
    name: 'ColumnFilter',
    hostName: 'DataTable',
    extends: BaseComponent,
    emits: ['filter-change', 'filter-apply', 'operator-change', 'matchmode-change', 'constraint-add', 'constraint-remove', 'filter-clear', 'apply-click'],
    props: {
        field: {
            type: String,
            default: null
        },
        type: {
            type: String,
            default: 'text'
        },
        display: {
            type: String,
            default: null
        },
        showMenu: {
            type: Boolean,
            default: true
        },
        matchMode: {
            type: String,
            default: null
        },
        showOperator: {
            type: Boolean,
            default: true
        },
        showClearButton: {
            type: Boolean,
            default: true
        },
        showApplyButton: {
            type: Boolean,
            default: true
        },
        showMatchModes: {
            type: Boolean,
            default: true
        },
        showAddButton: {
            type: Boolean,
            default: true
        },
        matchModeOptions: {
            type: Array as PropType<FilterOption[]>,
            default: null
        },
        maxConstraints: {
            type: Number,
            default: 2
        },
        filterElement: {
            type: Function,
            default: null
        },
        filterHeaderTemplate: {
            type: Function,
            default: null
        },
        filterFooterTemplate: {
            type: Function,
            default: null
        },
        filterClearTemplate: {
            type: Function,
            default: null
        },
        filterApplyTemplate: {
            type: Function,
            default: null
        },
        filterIconTemplate: {
            type: Function,
            default: null
        },
        filterAddIconTemplate: {
            type: Function,
            default: null
        },
        filterRemoveIconTemplate: {
            type: Function,
            default: null
        },
        filterClearIconTemplate: {
            type: Function,
            default: null
        },
        filters: {
            type: Object as PropType<FilterMap>,
            default: null
        },
        filtersStore: {
            type: Object as PropType<FilterMap>,
            default: null
        },
        filterMenuClass: {
            type: String,
            default: null
        },
        filterMenuStyle: {
            type: [String, Object] as PropType<string | object>,
            default: null
        },
        filterInputProps: {
            type: null,
            default: null
        },
        filterButtonProps: {
            type: Object as PropType<FilterButtons>,
            default: null
        },
        column: {
            type: Object as PropType<VNode>,
            required: true
        }
    },
    data() {
        return {
            overlayVisible: false,
            defaultMatchMode: null as string | null,
            defaultOperator: null as string | null,
            overlay: null as FilterOverlay | null,
            selfClick: false,
            overlayEventListener: null as ((event: unknown) => void) | null,
            outsideClickListener: null as ((event: MouseEvent) => void) | null,
            scrollHandler: null as ConnectedOverlayScrollHandler | null,
            scrollBeforeFilter: null as FilterScrollPosition | null,
            resizeListener: null as (() => void) | null
        };
    },
    beforeUnmount() {
        if (this.overlay) ZIndex.clear(this.overlay);
        this.onOverlayHide();
        this.scrollHandler?.destroy();
    },
    mounted() {
        const filter = this.fieldFilter;

        if (filter?.operator) {
            this.defaultMatchMode = filter.constraints?.[0]?.matchMode ?? null;
            this.defaultOperator = filter.operator;
        } else {
            this.defaultMatchMode = filter?.matchMode ?? null;
        }
    },
    methods: {
        getColumnPT(key: string, params?: Record<string, unknown>) {
            const columnMetaData = {
                props: getColumnPassThroughProps(this.column),
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                ...params
            };

            return mergeProps(
                this.ptm(`column.${key}`, { column: columnMetaData }),
                this.ptm(`column.${key}`, columnMetaData),
                this.ptmo(this.getColumnProp(), key, columnMetaData)
            );
        },
        getColumnProp() {
            return this.column.props && this.column.props.pt ? this.column.props.pt : undefined;
        },
        getColumnIconPT(key: string) {
            const icon = this.getColumnPT(key).icon;
            return icon && typeof icon === 'object' ? icon : undefined;
        },
        ptmFilterConstraintOptions(matchMode: FilterOption) {
            return {
                context: {
                    highlighted: matchMode && this.isRowMatchModeSelected(matchMode.value)
                }
            };
        },
        clearFilter() {
            const _filters = { ...this.filters };
            const filter = _filters[this.field];
            if (!filter) return;

            if (filter.operator && filter.constraints) {
                filter.constraints.splice(1);
                filter.operator = this.defaultOperator;
                filter.constraints[0] = { value: null, matchMode: this.defaultMatchMode };
            } else {
                filter.value = null;
                filter.matchMode = this.defaultMatchMode;
            }

            this.$emit('filter-clear');
            this.$emit('filter-change', _filters);
            this.$emit('filter-apply');
            this.hide();
        },
        clearInlineFilter() {
            this.clearFilter();
            this.$nextTick(() => {
                const container = this.$refs.filterElementContainer;
                if (container instanceof HTMLElement) {
                    const control = getFirstFocusableElement(container);
                    if (control instanceof HTMLElement) focus(control);
                }
            });
        },
        applyFilter() {
            this.$emit('apply-click', { field: this.field, constraints: this.fieldFilter });
            this.$emit('filter-apply');
            this.hide();
        },
        hasFilter() {
            if (this.filtersStore) {
                let fieldFilter = this.filtersStore[this.field];

                if (fieldFilter) {
                    if (fieldFilter.operator) return !this.isFilterBlank(fieldFilter.constraints?.[0]?.value);
                    else return !this.isFilterBlank(fieldFilter.value);
                }
            }

            return false;
        },
        hasRowFilter() {
            return this.fieldFilter != null && !this.isFilterBlank(this.fieldFilter.value);
        },
        isFilterBlank(filter: unknown) {
            if (filter !== null && filter !== undefined) {
                if ((typeof filter === 'string' && filter.trim().length == 0) || (filter instanceof Array && filter.length == 0)) return true;
                else return false;
            }

            return true;
        },
        toggleMenu(event: MouseEvent | KeyboardEvent) {
            this.overlayVisible = !this.overlayVisible;

            event.preventDefault();
        },
        onToggleButtonKeyDown(event: KeyboardEvent) {
            switch (event.code) {
                case 'Enter':
                case 'NumpadEnter':
                case 'Space':
                    this.toggleMenu(event);

                    break;

                case 'Escape':
                    this.overlayVisible = false;
                    break;
            }
        },
        onRowMatchModeChange(matchMode: string) {
            const _filters = { ...this.filters };
            const filter = _filters[this.field];
            if (!filter) return;

            filter.matchMode = matchMode;
            this.$emit('matchmode-change', { field: this.field, matchMode: matchMode });
            this.$emit('filter-change', _filters);
            this.$emit('filter-apply');
            this.hide();
        },
        onRowMatchModeKeyDown(event: KeyboardEvent) {
            const item = event.target;
            if (!(item instanceof HTMLElement)) return;

            switch (event.code) {
                case 'ArrowDown':
                    var nextItem = this.findNextItem(item);

                    if (nextItem) {
                        item.removeAttribute('tabindex');
                        nextItem.tabIndex = 0;
                        nextItem.focus();
                    }

                    event.preventDefault();
                    break;

                case 'ArrowUp':
                    var prevItem = this.findPrevItem(item);

                    if (prevItem) {
                        item.removeAttribute('tabindex');
                        prevItem.tabIndex = 0;
                        prevItem.focus();
                    }

                    event.preventDefault();
                    break;
            }
        },
        isRowMatchModeSelected(matchMode: string) {
            return this.fieldFilter?.matchMode === matchMode;
        },
        onOperatorChange(value: string) {
            const _filters = { ...this.filters };
            const filter = _filters[this.field];
            if (!filter) return;

            filter.operator = value;
            this.$emit('filter-change', _filters);

            this.$emit('operator-change', { field: this.field, operator: value });

            if (!this.showApplyButton) {
                this.$emit('filter-apply');
            }
        },
        onMenuMatchModeChange(value: string, index: number) {
            const constraint = this.fieldConstraints[index];
            if (!constraint) return;

            constraint.matchMode = value;
            this.$emit('matchmode-change', { field: this.field, matchMode: value, index: index });

            if (!this.showApplyButton) {
                this.$emit('filter-apply');
            }
        },
        addConstraint() {
            let _filters = { ...this.filters };
            const constraints = _filters[this.field]?.constraints;
            if (!constraints) return;

            const newConstraint = { value: null, matchMode: this.defaultMatchMode };
            constraints.push(newConstraint);
            this.$emit('constraint-add', { field: this.field, constraint: newConstraint });
            this.$emit('filter-change', _filters);

            if (!this.showApplyButton) {
                this.$emit('filter-apply');
            }
        },
        removeConstraint(index: number) {
            const _filters = { ...this.filters };
            const removedConstraint = _filters[this.field]?.constraints?.splice(index, 1);
            if (!removedConstraint) return;

            this.$emit('constraint-remove', { field: this.field, constraint: removedConstraint });
            this.$emit('filter-change', _filters);

            if (!this.showApplyButton) {
                this.$emit('filter-apply');
            }
        },
        filterCallback() {
            const scrollableParents = this.scrollHandler?.scrollableParents;
            if (scrollableParents && !this.scrollBeforeFilter) {
                const container = this.getIconElement()?.closest('table')?.parentElement;
                if (container && scrollableParents.includes(container)) {
                    this.scrollBeforeFilter = { container, left: container.scrollLeft, top: container.scrollTop };
                }
            }

            this.$emit('filter-apply');
        },
        findNextItem(item: HTMLElement): HTMLElement | null {
            const nextItem = item.nextElementSibling ?? item.parentElement?.firstElementChild;

            if (!(nextItem instanceof HTMLElement)) return null;
            return getAttribute(nextItem, 'data-pc-section') === 'filterconstraintseparator' ? this.findNextItem(nextItem) : nextItem;
        },
        findPrevItem(item: HTMLElement): HTMLElement | null {
            const prevItem = item.previousElementSibling ?? item.parentElement?.lastElementChild;

            if (!(prevItem instanceof HTMLElement)) return null;
            return getAttribute(prevItem, 'data-pc-section') === 'filterconstraintseparator' ? this.findPrevItem(prevItem) : prevItem;
        },
        hide() {
            this.overlayVisible = false;

            if (this.showMenuButton) focus(this.getIconElement());
        },
        onContentClick(event: MouseEvent) {
            this.selfClick = true;

            OverlayEventBus.emit('overlay-click', {
                originalEvent: event,
                target: this.overlay
            });

            this.selfClick = false;
        },
        onContentMouseDown() {
            this.selfClick = true;
        },
        onOverlayEnter(el: Element) {
            if (!(el instanceof HTMLElement)) return;
            if (this.filterMenuStyle) addStyle(el, this.filterMenuStyle);

            ZIndex.set('overlay', el, this.$primevue?.config.zIndex?.overlay);
            addStyle(el, { position: 'absolute', top: '0' });
            const icon = this.getIconElement();
            if (icon) absolutePosition(el, icon);
            this.bindOutsideClickListener();
            this.bindScrollListener();
            this.bindResizeListener();

            this.overlayEventListener = (e) => {
                if (e && typeof e === 'object' && 'target' in e && e.target instanceof Element && !this.isOutsideClicked(e.target)) {
                    this.selfClick = true;
                }
            };

            OverlayEventBus.on('overlay-click', this.overlayEventListener);
        },
        onOverlayAfterEnter() {
            this.overlay?.$focustrap?.autoFocus();
        },
        onOverlayLeave() {
            this.onOverlayHide();
        },
        onOverlayAfterLeave(el: Element) {
            if (el instanceof HTMLElement) ZIndex.clear(el);
        },
        onOverlayHide() {
            this.unbindOutsideClickListener();
            this.unbindResizeListener();
            this.unbindScrollListener();
            this.overlay = null;
            if (this.overlayEventListener) OverlayEventBus.off('overlay-click', this.overlayEventListener);
            this.overlayEventListener = null;
        },
        overlayRef(el: Element | ComponentPublicInstance | null) {
            this.overlay = el instanceof HTMLElement ? el : null;
        },
        isOutsideClicked(target: EventTarget | null) {
            if (!(target instanceof Element)) return false;

            return (
                !this.isTargetClicked(target) &&
                this.overlay &&
                !(this.overlay.isSameNode(target) || this.overlay.contains(target) || this.isNestedOverlayClicked(target))
            );
        },
        isNestedOverlayClicked(target: Element) {
            return this.overlay !== null && isOwnedOverlayTarget(this.overlay, target);
        },
        getIconElement(): HTMLElement | undefined {
            return (this.$refs.icon as ComponentPublicInstance | undefined)?.$el as HTMLElement | undefined;
        },
        isTargetClicked(target: Element) {
            return this.getIconElement()?.contains(target);
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.overlayVisible && !this.selfClick && this.isOutsideClicked(event.target)) {
                        this.overlayVisible = false;
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
            const icon = this.getIconElement();

            if (!this.scrollHandler && icon) {
                this.scrollHandler = new ConnectedOverlayScrollHandler(icon, this.onScroll);
            }

            this.scrollHandler?.bindScrollListener();
        },
        onScroll(event: Event) {
            const before = this.scrollBeforeFilter;
            this.scrollBeforeFilter = null;
            if (!this.overlayVisible) return;

            const icon = this.getIconElement();
            if (before && before.container === event.currentTarget && this.overlay && icon) {
                const { scrollLeft, scrollTop, scrollWidth, clientWidth } = before.container;
                const limit = Math.max(0, scrollWidth - clientWidth);
                const clampedLeft = Math.sign(before.left) * limit;

                // A filter can shrink the table and force the browser to clamp its horizontal offset.
                if (Math.abs(before.left) > limit + 1 && Math.abs(scrollLeft - clampedLeft) <= 1 && scrollTop === before.top) {
                    absolutePosition(this.overlay, icon);
                    return;
                }
            }

            this.hide();
        },
        unbindScrollListener() {
            this.scrollBeforeFilter = null;
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
        }
    },
    computed: {
        showMenuButton() {
            return this.showMenu && (this.display === 'row' ? this.type !== 'boolean' : true);
        },
        overlayId() {
            return this.$id + '_overlay';
        },
        fieldFilter() {
            return this.filters?.[this.field];
        },
        matchModes(): FilterOption[] {
            if (this.matchModeOptions) return this.matchModeOptions;

            const modes: string[] = this.$primevue?.config.filterMatchModeOptions?.[this.type] ?? [];
            return modes.map((value) => {
                const label = this.$primevue?.config.locale?.[value as keyof PrimeVueLocaleOptions];

                return { label: typeof label === 'string' ? label : value, value };
            });
        },
        isShowMatchModes() {
            return this.type !== 'boolean' && this.showMatchModes && this.matchModes;
        },
        operatorOptions() {
            return [
                { label: this.$primevue?.config.locale?.matchAll, value: FilterOperator.AND },
                { label: this.$primevue?.config.locale?.matchAny, value: FilterOperator.OR }
            ];
        },
        noFilterLabel() {
            return this.$primevue?.config.locale?.noFilter;
        },
        isShowOperator() {
            return this.showOperator && this.fieldFilter?.operator;
        },
        operator() {
            return this.fieldFilter?.operator;
        },
        fieldConstraints() {
            return this.fieldFilter?.constraints ?? (this.fieldFilter ? [this.fieldFilter] : []);
        },
        showRemoveIcon() {
            return this.fieldConstraints.length > 1;
        },
        removeRuleButtonLabel() {
            return this.$primevue?.config.locale?.removeRule;
        },
        addRuleButtonLabel() {
            return this.$primevue?.config.locale?.addRule;
        },
        isShowAddConstraint() {
            return this.showAddButton && this.fieldFilter?.operator && this.fieldConstraints && this.fieldConstraints.length < this.maxConstraints;
        },
        clearButtonLabel() {
            return this.$primevue?.config.locale?.clear;
        },
        applyButtonLabel() {
            return this.$primevue?.config.locale?.apply;
        },
        columnFilterButtonAriaLabel() {
            const aria = this.$primevue?.config.locale?.aria;
            return this.overlayVisible ? aria?.hideFilterMenu : aria?.showFilterMenu;
        },
        filterOperatorAriaLabel() {
            return this.$primevue?.config.locale?.filterOperator;
        },
        filterRuleAriaLabel() {
            return this.$primevue?.config.locale?.filterConstraint;
        },
        ptmHeaderFilterClearParams() {
            return {
                context: {
                    hidden: !this.hasRowFilter()
                }
            };
        },
        ptmFilterMenuParams() {
            return {
                context: {
                    overlayVisible: this.overlayVisible,
                    active: this.hasFilter()
                }
            };
        }
    },
    components: {
        Select,
        Button,
        Portal,
        FilterSlashIcon,
        FilterFillIcon,
        FilterIcon,
        TrashIcon,
        PlusIcon
    },
    directives: {
        focustrap: FocusTrap
    }
});
</script>
