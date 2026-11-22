<template>
    <div ref="container" :class="cx('root')" :style="sx('root')" @click="onClick" v-bind="ptmi('root')">
        <div class="rs-hidden-accessible" v-bind="ptm('hiddenInputContainer')" :data-p-hidden-accessible="true">
            <input
                ref="focusInput"
                :id="inputId"
                type="text"
                role="combobox"
                :class="inputClass"
                :style="inputStyle"
                readonly
                :disabled="disabled"
                :tabindex="!disabled ? tabindex : -1"
                :aria-labelledby="ariaLabelledby"
                :aria-label="ariaLabel"
                aria-haspopup="tree"
                :aria-expanded="overlayVisible"
                :aria-controls="overlayVisible ? listId : undefined"
                @focus="onFocus($event)"
                @blur="onBlur($event)"
                @keydown="onKeyDown($event)"
                v-bind="{ ...inputProps, ...ptm('hiddenInput') }"
            />
        </div>
        <div :class="cx('labelContainer')" v-bind="ptm('labelContainer')">
            <div :class="cx('label')" v-bind="ptm('label')">
                <slot name="value" :value="selectedNodes" :placeholder="placeholder">
                    <template v-if="display === 'comma'">
                        {{ label || 'empty' }}
                    </template>
                    <template v-else-if="display === 'chip'">
                        <template v-if="chipSelectedItems">
                            <span>{{ label }}</span>
                        </template>
                        <template v-else>
                            <div v-for="node of selectedNodes" :key="node.key" :class="cx('chipItem')" v-bind="ptm('chipItem')">
                                <Chip :class="cx('pcChip')" :label="node.label" :unstyled="unstyled" :pt="ptm('pcChip')" />
                            </div>
                            <template v-if="emptyValue">{{ placeholder || 'empty' }}</template>
                        </template>
                    </template>
                </slot>
            </div>
        </div>
        <slot v-if="isClearIconVisible" name="clearicon" :class="cx('clearIcon')" :clearCallback="onClearClick">
            <component
                :is="clearIcon ? 'i' : 'TimesIcon'"
                ref="clearIcon"
                :class="[cx('clearIcon'), clearIcon]"
                @click="onClearClick"
                v-bind="ptm('clearIcon')"
                data-pc-section="clearicon"
            />
        </slot>
        <div :class="cx('dropdown')" role="button" aria-haspopup="tree" :aria-expanded="overlayVisible" v-bind="ptm('dropdown')">
            <!-- TODO: triggericon is deprecated since v4.0 -->
            <slot :name="$slots.dropdownicon ? 'dropdownicon' : 'triggericon'" :class="cx('dropdownIcon')">
                <component :is="'ChevronDownIcon'" :class="cx('dropdownIcon')" v-bind="ptm('dropdownIcon')" />
            </slot>
        </div>
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
                    @click="onOverlayClick"
                    :class="[cx('panel'), panelClass]"
                    @keydown="onOverlayKeydown"
                    v-bind="{ ...panelProps, ...ptm('panel') }"
                >
                    <span
                        ref="firstHiddenFocusableElementOnOverlay"
                        role="presentation"
                        class="rs-hidden-accessible rs-hidden-focusable"
                        :tabindex="0"
                        @focus="onFirstHiddenFocus"
                        v-bind="ptm('hiddenFirstFocusableEl')"
                        :data-p-hidden-accessible="true"
                        :data-p-hidden-focusable="true"
                    ></span>
                    <slot name="header" :value="d_value" :options="options"></slot>
                    <div :class="cx('treeContainer')" :style="{ 'max-height': scrollHeight }" v-bind="ptm('treeContainer')">
                        <TSTree
                            v-if="options && options.length > 0"
                            ref="tree"
                            :id="listId"
                            :value="options"
                            :selectionMode="selectionMode"
                            :loading="loading"
                            :loadingIcon="loadingIcon"
                            :loadingMode="loadingMode"
                            :filter="filter"
                            :filterBy="filterBy"
                            :filterMode="filterMode"
                            :filterPlaceholder="filterPlaceholder"
                            :filterLocale="filterLocale"
                            @update:selectionKeys="onSelectionChange"
                            :selectionKeys="d_value"
                            :expandedKeys="d_expandedKeys"
                            @update:expandedKeys="onNodeToggle"
                            :metaKeySelection="metaKeySelection"
                            @node-expand="$emit('node-expand', $event)"
                            @node-collapse="$emit('node-collapse', $event)"
                            @node-select="onNodeSelect"
                            @node-unselect="onNodeUnselect"
                            @filter="$emit('filter', $event)"
                            @click.stop
                            :level="0"
                            :unstyled="unstyled"
                            :pt="ptm('pcTree')"
                        >
                            <template v-if="$slots.option" #default="optionSlotProps">
                                <slot name="option" :node="optionSlotProps.node" :expanded="optionSlotProps.expanded" :selected="optionSlotProps.selected" />
                            </template>
                            <template v-if="$slots.itemtoggleicon" #toggleicon="iconSlotProps">
                                <slot name="itemtoggleicon" :node="iconSlotProps.node" :expanded="iconSlotProps.expanded" :class="iconSlotProps.class" />
                            </template>
                            <!--TODO: itemtogglericon deprecated since v4.0-->
                            <template v-else-if="$slots.itemtogglericon" #togglericon="iconSlotProps">
                                <slot name="itemtogglericon" :node="iconSlotProps.node" :expanded="iconSlotProps.expanded" :class="iconSlotProps.class" />
                            </template>
                            <template v-if="$slots.itemcheckboxicon" #checkboxicon="iconSlotProps">
                                <slot
                                    name="itemcheckboxicon"
                                    :checked="iconSlotProps.checked"
                                    :partialChecked="iconSlotProps.partialChecked"
                                    :class="iconSlotProps.class"
                                />
                            </template>
                            <template #empty>
                                <slot name="empty">{{ emptyMessageText }}</slot>
                            </template>
                        </TSTree>
                        <div v-if="emptyOptions && !loading" :class="cx('emptyMessage')" v-bind="ptm('emptyMessage')">
                            <slot name="empty">{{ emptyMessageText }}</slot>
                        </div>
                    </div>
                    <slot name="footer" :value="d_value" :options="options"></slot>
                    <span
                        ref="lastHiddenFocusableElementOnOverlay"
                        role="presentation"
                        class="rs-hidden-accessible rs-hidden-focusable"
                        :tabindex="0"
                        @focus="onLastHiddenFocus"
                        v-bind="ptm('hiddenLastFocusableEl')"
                        :data-p-hidden-accessible="true"
                        :data-p-hidden-focusable="true"
                    ></span>
                </div>
            </transition>
        </Portal>
    </div>
</template>

<script lang="ts">
import {
    absolutePosition,
    addStyle,
    findSingle,
    focus,
    getFirstFocusableElement,
    getFocusableElements,
    getLastFocusableElement,
    getOuterWidth,
    isTouchDevice,
    relativePosition
} from '../internal/utils/dom/index';
import { isEmpty, isNotEmpty } from '../internal/utils/object/index';
import { ZIndex } from '../internal/utils/zindex/index';
import { ConnectedOverlayScrollHandler } from '../core/utils/Utils';
import { ChevronDownIcon, TimesIcon } from '../internal/lucide';
import Chip from '../chip/Chip.vue';
import OverlayEventBus from '../overlayeventbus/OverlayEventBus';
import { listenForOutsideOverlayClick } from '../internal/overlay-dismissal';
import Portal from '../portal/Portal.vue';
import Ripple from '../ripple/Ripple';
import Tree from '../tree/Tree.vue';
import { defineComponent, inject, type ComponentPublicInstance } from 'vue';
import type { TreeNode } from '../treenode/TreeNode';
import BaseTreeSelect from './BaseTreeSelect.vue';

type ExpandedKeys = Record<string, boolean>;
type SelectionKeys = Record<string, boolean | { checked?: boolean; partialChecked?: boolean }>;

export default defineComponent({
    name: 'TreeSelect',
    extends: BaseTreeSelect,
    inheritAttrs: false,
    emits: [
        'before-show',
        'before-hide',
        'change',
        'show',
        'hide',
        'node-select',
        'node-unselect',
        'node-expand',
        'node-collapse',
        'filter',
        'focus',
        'blur',
        'update:expandedKeys'
    ],
    setup() {
        return { inheritedFluid: inject('$pcFluid', null) };
    },
    data() {
        return {
            focused: false,
            overlayVisible: false,
            d_expandedKeys: (this.expandedKeys || {}) as ExpandedKeys,
            stopOutsideClickListener: null as (() => void) | null,
            resizeListener: null as (() => void) | null,
            scrollHandler: null as ConnectedOverlayScrollHandler | null,
            overlay: null as HTMLElement | null,
            selfChange: false
        };
    },
    watch: {
        modelValue: {
            handler: function () {
                if (!this.selfChange) {
                    this.updateTreeState();
                }

                this.selfChange = false;
            },
            immediate: true
        },
        options() {
            this.updateTreeState();
        },
        expandedKeys(value) {
            this.d_expandedKeys = value ?? {};
        }
    },
    beforeUnmount() {
        this.unbindOutsideClickListener();
        this.unbindResizeListener();

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
        show() {
            this.$emit('before-show');
            this.overlayVisible = true;
        },
        hide() {
            this.$emit('before-hide');
            this.overlayVisible = false;
            (this.$refs.focusInput as HTMLInputElement | undefined)?.focus();
        },
        onFocus(event: FocusEvent) {
            this.focused = true;
            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            this.focused = false;
            this.$emit('blur', event);
            this.formField.onBlur?.();
        },
        onClick(event: MouseEvent) {
            const target = event.target;

            if (this.disabled || !(target instanceof Element)) {
                return;
            }

            if (target.tagName === 'INPUT' || target.getAttribute('data-pc-section') === 'clearicon' || target.closest('[data-pc-section="clearicon"]')) {
                return;
            } else if (!this.overlay || !this.overlay.contains(target)) {
                if (this.overlayVisible) this.hide();
                else this.show();

                focus(this.$refs.focusInput as HTMLInputElement);
            }
        },
        onClearClick() {
            this.onSelectionChange(null);
        },
        onSelectionChange(keys: SelectionKeys | null) {
            this.selfChange = true;
            this.writeValue(keys);
            this.$emit('change', keys);
        },
        onNodeSelect(node: TreeNode) {
            this.$emit('node-select', node);

            if (this.selectionMode === 'single') {
                this.hide();
            }
        },
        onNodeUnselect(node: TreeNode) {
            this.$emit('node-unselect', node);
        },
        onNodeToggle(keys: ExpandedKeys) {
            this.d_expandedKeys = keys;

            this.$emit('update:expandedKeys', this.d_expandedKeys);
        },
        getSelectedItemsLabel() {
            const selectedItemsLabel = this.selectedItemsLabel || this.$primevue?.config.locale?.selectionMessage;

            return selectedItemsLabel?.replace(/{(.*?)}/, String(Object.keys(this.d_value).length));
        },
        onFirstHiddenFocus(event: FocusEvent) {
            const focusableEl =
                this.overlay && event.relatedTarget === this.$refs.focusInput
                    ? getFirstFocusableElement(this.overlay, ':not([data-p-hidden-focusable="true"])')
                    : (this.$refs.focusInput as HTMLInputElement);

            if (focusableEl instanceof HTMLElement) focus(focusableEl);
        },
        onLastHiddenFocus(event: FocusEvent) {
            const focusableEl =
                this.overlay && event.relatedTarget === this.$refs.focusInput
                    ? getLastFocusableElement(this.overlay, ':not([data-p-hidden-focusable="true"])')
                    : (this.$refs.focusInput as HTMLInputElement);

            if (focusableEl instanceof HTMLElement) focus(focusableEl);
        },
        onKeyDown(event: KeyboardEvent) {
            switch (event.code) {
                case 'ArrowDown':
                    this.onArrowDownKey(event);
                    break;

                case 'Space':
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
        onArrowDownKey(event: KeyboardEvent) {
            if (this.overlayVisible) return;

            this.show();

            this.$nextTick(() => {
                const tree = this.$refs.tree as ComponentPublicInstance | undefined;
                const focusedElement = (tree?.$el as HTMLElement | undefined)?.querySelector<HTMLElement>('[data-pc-section="treeitem"][tabindex="0"]');

                if (focusedElement) focus(focusedElement);
            });

            event.preventDefault();
        },
        onEnterKey(event: KeyboardEvent) {
            if (this.overlayVisible) {
                this.hide();
            } else {
                this.onArrowDownKey(event);
            }

            event.preventDefault();
        },
        onEscapeKey(event: KeyboardEvent) {
            if (this.overlayVisible) {
                this.hide();
                event.preventDefault();
            }
        },
        onTabKey(event: KeyboardEvent, pressedInInputText = false) {
            if (!pressedInInputText) {
                if (this.overlayVisible && this.hasFocusableElements()) {
                    focus(this.$refs.firstHiddenFocusableElementOnOverlay as HTMLElement);

                    event.preventDefault();
                }
            }
        },
        hasFocusableElements() {
            return this.overlay != null && getFocusableElements(this.overlay, ':not([data-p-hidden-focusable="true"])').length > 0;
        },
        onOverlayEnter(el: Element) {
            if (!(el instanceof HTMLElement)) return;

            ZIndex.set('overlay', el, this.$primevue?.config.zIndex?.overlay);

            addStyle(el, { position: 'absolute', top: '0' });
            this.alignOverlay();
            this.focus();

            // Issue: #7508
            this.$attrSelector && el.setAttribute(this.$attrSelector, '');
        },
        onOverlayAfterEnter() {
            this.bindOutsideClickListener();
            this.bindScrollListener();
            this.bindResizeListener();
            this.scrollValueInView();
            this.$emit('show');
        },
        onOverlayLeave() {
            this.unbindOutsideClickListener();
            this.unbindScrollListener();
            this.unbindResizeListener();
            this.$emit('hide');
            this.overlay = null;
        },
        onOverlayAfterLeave(el: Element) {
            if (el instanceof HTMLElement) ZIndex.clear(el);
        },
        focus() {
            if (!this.overlay) return;

            const target = getFocusableElements(this.overlay)[0];

            if (target instanceof HTMLElement) target.focus();
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
        overlayRef(el: Element | ComponentPublicInstance | null) {
            this.overlay = el instanceof HTMLElement ? el : null;
        },
        onOverlayClick(event: MouseEvent) {
            OverlayEventBus.emit('overlay-click', {
                originalEvent: event,
                target: this.$el
            });
        },
        onOverlayKeydown(event: KeyboardEvent) {
            if (event.code === 'Escape') this.hide();
        },
        fillNodeMap(node: TreeNode, nodeMap: Record<string, TreeNode>) {
            nodeMap[node.key] = node;

            if (node.children && node.children.length > 0) {
                node.children.forEach((children) => this.fillNodeMap(children, nodeMap));
            }
        },
        isSelected(key: string, keys: SelectionKeys) {
            const value = keys[key];
            return this.selectionMode === 'checkbox' ? typeof value === 'object' && value?.checked : value;
        },
        updateTreeState() {
            const keys: SelectionKeys = this.d_value ?? {};
            const remaining = new Set(Object.keys(keys).filter((key) => this.isSelected(key, keys)));
            if (!remaining.size) return;

            const expanded = new Set<string>();
            for (const option of this.options ?? []) {
                this.updateTreeBranchState(option, [], remaining, expanded);
                if (!remaining.size) break;
            }

            const newAncestors = [...expanded].filter((key) => this.d_expandedKeys[key] !== true);
            if (!newAncestors.length) return;

            this.d_expandedKeys = { ...this.d_expandedKeys, ...Object.fromEntries(newAncestors.map((key) => [key, true])) };
            this.$emit('update:expandedKeys', this.d_expandedKeys);
        },
        updateTreeBranchState(node: TreeNode, path: string[], remaining: Set<string>, expanded: Set<string>) {
            if (remaining.delete(node.key)) {
                for (const key of path) expanded.add(key);
            }

            if (!remaining.size || !node.children?.length) return;

            path.push(node.key);
            for (const child of node.children) {
                this.updateTreeBranchState(child, path, remaining, expanded);
                if (!remaining.size) break;
            }
            path.pop();
        },
        scrollValueInView() {
            if (this.overlay) {
                let selectedItem = findSingle(this.overlay, '[data-p-selected="true"]');

                if (selectedItem) {
                    selectedItem.scrollIntoView?.({ block: 'nearest', inline: 'start' });
                }
            }
        }
    },
    computed: {
        nodeMap() {
            const nodeMap: Record<string, TreeNode> = {};

            this.options?.forEach((node) => this.fillNodeMap(node, nodeMap));

            return nodeMap;
        },
        selectedNodes() {
            const selectedNodes: TreeNode[] = [];

            if (this.d_value && this.options && this.options.length > 0) {
                Object.keys(this.d_value).forEach((key) => {
                    const node = this.nodeMap[key];

                    if (node && this.isSelected(key, this.d_value)) {
                        selectedNodes.push(node);
                    }
                });
            }

            return selectedNodes;
        },
        label() {
            let value = this.selectedNodes;
            let label;

            if (value.length) {
                if (isNotEmpty(this.maxSelectedLabels) && value.length > this.maxSelectedLabels) {
                    label = this.getSelectedItemsLabel();
                } else {
                    label = value.map((node) => node.label).join(', ');
                }
            } else {
                label = this.placeholder;
            }

            return label;
        },
        chipSelectedItems() {
            return isNotEmpty(this.maxSelectedLabels) && this.d_value && Object.keys(this.d_value).length > this.maxSelectedLabels;
        },
        emptyMessageText() {
            return this.emptyMessage || this.$primevue?.config.locale?.emptyMessage;
        },
        emptyValue() {
            return !this.$filled;
        },
        emptyOptions() {
            return !this.options || this.options.length === 0;
        },
        listId() {
            return this.$id + '_list';
        },
        hasFluid() {
            return isEmpty(this.fluid) ? !!this.inheritedFluid : this.fluid;
        },
        isClearIconVisible() {
            return this.showClear && this.d_value != null && isNotEmpty(this.options) && !this.disabled && !this.loading;
        }
    },
    components: {
        TSTree: Tree,
        Chip,
        Portal,
        ChevronDownIcon,
        TimesIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
