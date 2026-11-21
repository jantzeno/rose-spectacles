<template>
    <tr
        ref="node"
        :class="containerClass"
        :style="node.style"
        :tabindex="tabindex"
        role="row"
        :aria-expanded="node.children && node.children.length ? expanded : undefined"
        :aria-level="level + 1"
        :aria-setsize="ariaSetSize"
        :aria-posinset="ariaPosInset"
        :aria-selected="getAriaSelected"
        :aria-checked="partialChecked ? 'mixed' : checked || undefined"
        @click="onClick"
        @keydown="onKeyDown"
        @touchend="onTouchEnd"
        @contextmenu="onRowRightClick"
        v-bind="ptm('row', ptmOptions)"
        :data-p-selected="selected"
        :data-p-selected-contextmenu="contextMenuSelection && isSelectedWithContextMenu"
    >
        <template v-for="(col, i) of columns" :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || i">
            <TTBodyCell
                v-if="!columnProp(col, 'hidden')"
                :column="col"
                :node="node"
                :level="level"
                :leaf="leaf"
                :indentation="indentation"
                :expanded="expanded"
                :selectionMode="selectionMode"
                :checked="checked"
                :partialChecked="partialChecked"
                :templates="templates"
                @node-toggle="$emit('node-toggle', $event)"
                @checkbox-toggle="toggleCheckbox"
                :index="i"
                :loadingMode="loadingMode"
                :unstyled="unstyled"
                :pt="pt"
            ></TTBodyCell>
        </template>
    </tr>
    <template v-if="expanded && node.children && node.children.length">
        <TreeTableRow
            v-for="childNode of node.children"
            :key="nodeKey(childNode)"
            :dataKey="dataKey"
            :columns="columns"
            :node="childNode"
            :parentNode="node"
            :level="level + 1"
            :expandedKeys="expandedKeys"
            :selectionMode="selectionMode"
            :selectionKeys="selectionKeys"
            :contextMenu="contextMenu"
            :contextMenuSelection="contextMenuSelection"
            :indentation="indentation"
            :ariaPosInset="node.children.indexOf(childNode) + 1"
            :ariaSetSize="node.children.length"
            :loadingMode="loadingMode"
            :templates="templates"
            @node-toggle="$emit('node-toggle', $event)"
            @node-click="$emit('node-click', $event)"
            @row-rightclick="$emit('row-rightclick', $event)"
            @checkbox-change="onCheckboxChange"
            :unstyled="unstyled"
            :pt="pt"
        />
    </template>
</template>

<script lang="ts">
import { focus, getAttribute, isClickable } from '../internal/utils/dom/index';
import { equals, resolveFieldData } from '../internal/utils/object/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { getVNodeProp } from '../core/utils/Utils';
import { defineComponent, inject, type PropType, type Slots, type VNode } from 'vue';
import type { TreeNode } from '../treenode/TreeNode';
import BodyCell from './BodyCell.vue';
import type { TreeTableCheckboxChange, TreeTableSelection } from './selection';

interface TreeTableParent {
    rowHover?: boolean;
    rowSelectionMode?: boolean;
    scrollable?: boolean;
}

export default defineComponent({
    name: 'TreeTableRow',
    hostName: 'TreeTable',
    extends: BaseComponent,
    emits: ['node-click', 'node-toggle', 'checkbox-change', 'nodeClick', 'nodeToggle', 'checkboxChange', 'row-rightclick', 'rowRightclick'],
    props: {
        node: {
            type: Object as PropType<TreeNode>,
            required: true
        },
        dataKey: {
            type: [String, Function] as PropType<string | ((node: TreeNode) => string)>,
            default: 'key'
        },
        parentNode: {
            type: Object as PropType<TreeNode>,
            default: null
        },
        columns: {
            type: Array as PropType<VNode[]>,
            default: null
        },
        expandedKeys: {
            type: Object as PropType<Record<string, boolean>>,
            default: null
        },
        selectionKeys: {
            type: Object as PropType<TreeTableSelection>,
            default: null
        },
        selectionMode: {
            type: String,
            default: null
        },
        level: {
            type: Number,
            default: 0
        },
        indentation: {
            type: Number,
            default: 1
        },
        tabindex: {
            type: Number,
            default: -1
        },
        ariaSetSize: {
            type: Number,
            default: null
        },
        ariaPosInset: {
            type: Number,
            default: null
        },
        loadingMode: {
            type: String,
            default: 'mask'
        },
        templates: {
            type: Object as PropType<Slots>,
            default: () => ({})
        },
        contextMenu: {
            type: Boolean,
            default: false
        },
        contextMenuSelection: {
            type: Object as PropType<TreeNode>,
            default: null
        }
    },
    setup() {
        return { treeTable: inject<TreeTableParent>('$parentInstance', {}) };
    },
    data() {
        return { nodeTouched: false };
    },
    methods: {
        columnProp(col: VNode, prop: string) {
            return getVNodeProp(col, prop);
        },
        toggle() {
            this.$emit('node-toggle', this.node);
        },
        onClick(event: MouseEvent) {
            const target = event.target;

            if (!(target instanceof Element)) return;

            if (
                isClickable(target) ||
                getAttribute(target, 'data-pc-section') === 'nodetogglebutton' ||
                getAttribute(target, 'data-pc-section') === 'nodetoggleicon' ||
                target.tagName === 'path'
            ) {
                return;
            }

            this.setTabIndexForSelectionMode(event, this.nodeTouched);

            this.$emit('node-click', {
                originalEvent: event,
                nodeTouched: this.nodeTouched,
                node: this.node
            });
            this.nodeTouched = false;
        },
        onRowRightClick(event: MouseEvent) {
            this.$emit('row-rightclick', {
                originalEvent: event,
                node: this.node
            });
        },
        onTouchEnd() {
            this.nodeTouched = true;
        },
        nodeKey(node: TreeNode): string {
            return resolveFieldData(node, this.dataKey);
        },
        onKeyDown(event: KeyboardEvent) {
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

                case 'Enter':
                case 'NumpadEnter':
                case 'Space':
                    if (!(event.target instanceof Element) || !isClickable(event.target)) {
                        this.onEnterKey(event);
                    }

                    break;

                case 'Tab':
                    this.onTabKey();
                    break;

                default:
                    break;
            }
        },
        onArrowDownKey(event: KeyboardEvent) {
            const row = event.currentTarget;

            if (!(row instanceof HTMLElement)) return;

            const next = row.nextElementSibling;
            if (next instanceof HTMLElement) this.focusRowChange(row, next);

            event.preventDefault();
        },
        onArrowUpKey(event: KeyboardEvent) {
            const row = event.currentTarget;

            if (!(row instanceof HTMLElement)) return;

            const previous = row.previousElementSibling;
            if (previous instanceof HTMLElement) this.focusRowChange(row, previous);

            event.preventDefault();
        },
        onArrowRightKey(event: KeyboardEvent) {
            const row = event.currentTarget;

            if (!(row instanceof HTMLElement)) return;

            const togglerElement = row.querySelector<HTMLButtonElement>('[data-pc-section="nodetogglebutton"]');

            if (!togglerElement || togglerElement.style.visibility === 'hidden') return;

            !this.expanded && togglerElement.click();

            this.$nextTick(() => {
                const child = row.nextElementSibling;

                if (child instanceof HTMLElement && Number(child.getAttribute('aria-level')) > this.level + 1) {
                    this.focusRowChange(row, child);
                }
            });

            event.preventDefault();
        },
        onArrowLeftKey(event: KeyboardEvent) {
            if (this.level === 0 && !this.expanded) {
                return;
            }

            const currentTarget = event.currentTarget;

            if (!(currentTarget instanceof HTMLElement)) return;

            const togglerElement = currentTarget.querySelector<HTMLButtonElement>('[data-pc-section="nodetogglebutton"]');

            if (this.expanded && togglerElement && togglerElement.style.visibility !== 'hidden') {
                togglerElement.click();

                return;
            }

            const target = this.findBeforeClickableNode(currentTarget);

            target && this.focusRowChange(currentTarget, target);
        },
        onHomeKey(event: KeyboardEvent) {
            const row = event.currentTarget as HTMLElement;
            const firstRow = row.parentElement?.querySelector<HTMLTableRowElement>(`tr[aria-level="${this.level + 1}"]`);

            if (firstRow) focus(firstRow);

            event.preventDefault();
        },
        onEndKey(event: KeyboardEvent) {
            const row = event.currentTarget as HTMLElement;
            const rows = row.parentElement?.querySelectorAll<HTMLTableRowElement>(`tr[aria-level="${this.level + 1}"]`);
            const lastRow = rows?.[rows.length - 1];

            if (lastRow) focus(lastRow);

            event.preventDefault();
        },
        onEnterKey(event: KeyboardEvent) {
            event.preventDefault();
            this.setTabIndexForSelectionMode(event, this.nodeTouched);

            if (this.selectionMode === 'checkbox') {
                this.toggleCheckbox();

                return;
            }

            this.$emit('node-click', {
                originalEvent: event,
                nodeTouched: this.nodeTouched,
                node: this.node
            });

            this.nodeTouched = false;
        },
        onTabKey() {
            const row = this.$refs.node as HTMLTableRowElement;
            const rows = [...(row.parentElement?.querySelectorAll('tr') ?? [])];
            const hasSelectedRow = rows.some((row) => getAttribute(row, 'data-p-selected') || row.getAttribute('aria-checked') === 'true');

            rows.forEach((row) => {
                row.tabIndex = -1;
            });

            if (hasSelectedRow) {
                const selectedNodes = rows.filter((node) => getAttribute(node, 'data-p-selected') || node.getAttribute('aria-checked') === 'true');

                selectedNodes[0].tabIndex = 0;

                return;
            }

            if (rows[0]) rows[0].tabIndex = 0;
        },
        focusRowChange(firstFocusableRow: HTMLElement, currentFocusedRow: HTMLElement) {
            firstFocusableRow.tabIndex = -1;
            currentFocusedRow.tabIndex = 0;
            focus(currentFocusedRow);
        },
        findBeforeClickableNode(node: HTMLElement): HTMLElement | null {
            const prevNode = node.previousElementSibling;

            if (prevNode instanceof HTMLElement) {
                const prevNodeButton = prevNode.querySelector('button');

                if (prevNodeButton && prevNodeButton.style.visibility !== 'hidden') {
                    return prevNode;
                }

                return this.findBeforeClickableNode(prevNode);
            }

            return null;
        },
        toggleCheckbox() {
            if (this.node.selectable === false) return;

            const _selectionKeys = { ...this.selectionKeys };
            const _check = !this.checked && !(this.partialChecked && this.allSelectableNodesChecked(this.node, _selectionKeys));

            this.propagateDown(this.node, _check, _selectionKeys);

            this.$emit('checkbox-change', {
                node: this.node,
                check: _check,
                selectionKeys: _selectionKeys
            });
        },
        allSelectableNodesChecked(node: TreeNode, selectionKeys: TreeTableSelection): boolean {
            const state = selectionKeys[this.nodeKey(node)];
            const selected = node.selectable === false || (typeof state === 'object' && (state.checked || state.partialChecked));

            return selected && (node.children?.every((child) => this.allSelectableNodesChecked(child, selectionKeys)) ?? true);
        },
        propagateDown(node: TreeNode, check: boolean, selectionKeys: TreeTableSelection): boolean {
            let fullySelectable = node.selectable !== false;

            for (const child of node.children ?? []) {
                if (!this.propagateDown(child, check, selectionKeys)) fullySelectable = false;
            }

            if (node.selectable !== false) {
                const key = this.nodeKey(node);

                if (check) selectionKeys[key] = { checked: fullySelectable, partialChecked: !fullySelectable };
                else delete selectionKeys[key];
            }

            return fullySelectable;
        },
        onCheckboxChange(event: TreeTableCheckboxChange) {
            let check = event.check;
            let _selectionKeys = { ...event.selectionKeys };
            let checkedChildCount = 0;
            let childPartialSelected = false;

            const children = this.node.children ?? [];

            for (const child of children) {
                if (child.selectable === false) {
                    if (this.hasSelectedCheckboxDescendant(child, _selectionKeys)) childPartialSelected = true;
                } else {
                    const state = _selectionKeys[this.nodeKey(child)];

                    if (typeof state === 'object' && state?.checked) checkedChildCount++;
                    else if (typeof state === 'object' && state?.partialChecked) childPartialSelected = true;
                }
            }

            if (this.node.selectable !== false) {
                const checked = check && checkedChildCount === children.length;
                const partialChecked = childPartialSelected || (checkedChildCount > 0 && checkedChildCount !== children.length);

                _selectionKeys[this.nodeKey(this.node)] = { checked, partialChecked };
            }

            this.$emit('checkbox-change', {
                node: event.node,
                check: event.check,
                selectionKeys: _selectionKeys
            });
        },
        hasSelectedCheckboxDescendant(node: TreeNode, selectionKeys: TreeTableSelection): boolean {
            return (
                node.children?.some((child) => {
                    if (child.selectable === false) return this.hasSelectedCheckboxDescendant(child, selectionKeys);

                    const state = selectionKeys[this.nodeKey(child)];

                    return typeof state === 'object' && (state.checked || state.partialChecked);
                }) ?? false
            );
        },
        setTabIndexForSelectionMode(event: MouseEvent | KeyboardEvent, nodeTouched: boolean) {
            if (this.selectionMode !== null && event.currentTarget instanceof HTMLElement) {
                const row = this.$refs.node as HTMLTableRowElement;
                const elements = [...(row.parentElement?.querySelectorAll('tr') ?? [])];

                event.currentTarget.tabIndex = nodeTouched === false ? -1 : 0;

                if (elements[0] && elements.every((element) => element.tabIndex === -1)) {
                    elements[0].tabIndex = 0;
                }
            }
        }
    },
    computed: {
        containerClass() {
            return [this.node.styleClass, this.cx('row')];
        },
        expanded() {
            return this.expandedKeys?.[this.nodeKey(this.node)] === true;
        },
        leaf() {
            return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
        },
        selected() {
            return this.selectionMode && this.selectionKeys ? this.selectionKeys[this.nodeKey(this.node)] === true : false;
        },
        isSelectedWithContextMenu() {
            if (this.node && this.contextMenuSelection) {
                return typeof this.dataKey === 'function'
                    ? this.nodeKey(this.node) === this.nodeKey(this.contextMenuSelection)
                    : equals(this.node, this.contextMenuSelection, this.dataKey);
            }

            return false;
        },
        checked() {
            const selection = this.selectionKeys?.[this.nodeKey(this.node)];

            return typeof selection === 'object' && selection?.checked;
        },
        partialChecked() {
            const selection = this.selectionKeys?.[this.nodeKey(this.node)];

            return typeof selection === 'object' && selection?.partialChecked;
        },
        getAriaSelected() {
            return this.selectionMode === 'single' || this.selectionMode === 'multiple' ? this.selected : undefined;
        },
        ptmOptions() {
            return {
                context: {
                    selectable: this.treeTable.rowHover || this.treeTable.rowSelectionMode,
                    selected: this.selected,
                    scrollable: this.treeTable.scrollable
                }
            };
        }
    },
    components: {
        TTBodyCell: BodyCell
    }
});
</script>
