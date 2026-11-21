<template>
    <li
        ref="currentNode"
        :class="cx('node')"
        role="treeitem"
        :aria-label="label(node)"
        :aria-selected="ariaSelected"
        :aria-expanded="expanded"
        :aria-setsize="node.children ? node.children.length : 0"
        :aria-posinset="index + 1"
        :aria-level="level"
        :aria-checked="ariaChecked"
        :tabindex="index === 0 ? 0 : -1"
        @keydown="onKeyDown"
        v-bind="getPTOptions('node')"
    >
        <div v-if="isPrevDropPointActive" :class="cx('dropPoint')" aria-hidden="true" />
        <div
            :class="cx('nodeContent')"
            :style="node.style"
            :draggable="isDraggable"
            @click="onClick"
            @touchend="onTouchEnd"
            @dragstart="onNodeDragStart"
            @dragover="onNodeDragOver"
            @dragenter="onNodeDragEnter"
            @dragleave="onNodeDragLeave"
            @dragend="onNodeDragEnd"
            @drop="onNodeDrop"
            v-bind="getPTOptions('nodeContent')"
            :data-p-selected="checkboxMode ? checked : selected"
            :data-p-selectable="selectable"
        >
            <button
                v-ripple
                type="button"
                :class="cx('nodeToggleButton')"
                @click="toggle"
                tabindex="-1"
                :data-p-leaf="leaf"
                v-bind="getPTOptions('nodeToggleButton')"
            >
                <template v-if="node.loading && loadingMode === 'icon'">
                    <!-- TODO: nodetogglericon deprecated since v4.0-->
                    <component
                        v-if="templates['nodetoggleicon'] || templates['nodetogglericon']"
                        :is="templates['nodetoggleicon'] || templates['nodetogglericon']"
                        :node="node"
                        :expanded="expanded"
                        :class="cx('nodeToggleIcon')"
                    />
                    <SpinnerIcon v-else spin :class="cx('nodeToggleIcon')" v-bind="getPTOptions('nodeToggleIcon')" />
                </template>
                <template v-else>
                    <!-- TODO: togglericon deprecated since v4.0-->
                    <component
                        v-if="templates['nodetoggleicon'] || templates['togglericon']"
                        :is="templates['nodetoggleicon'] || templates['togglericon']"
                        :node="node"
                        :expanded="expanded"
                        :class="cx('nodeToggleIcon')"
                    />
                    <component
                        v-else-if="expanded"
                        :is="node.expandedIcon ? 'span' : 'ChevronDownIcon'"
                        :class="cx('nodeToggleIcon')"
                        v-bind="getPTOptions('nodeToggleIcon')"
                    />
                    <component
                        v-else
                        :is="node.collapsedIcon ? 'span' : 'ChevronRightIcon'"
                        :class="cx('nodeToggleIcon')"
                        v-bind="getPTOptions('nodeToggleIcon')"
                    />
                </template>
            </button>
            <Checkbox
                v-if="checkboxMode"
                :defaultValue="checked"
                :binary="true"
                :indeterminate="partialChecked"
                :class="cx('nodeCheckbox')"
                :tabindex="-1"
                :unstyled="unstyled"
                :pt="getPTOptions('pcNodeCheckbox')"
                :data-p-partialchecked="partialChecked"
            >
                <template #icon="slotProps">
                    <component
                        v-if="templates['checkboxicon']"
                        :is="templates['checkboxicon']"
                        :checked="slotProps.checked"
                        :partialChecked="partialChecked"
                        :class="slotProps.class"
                    />
                </template>
            </Checkbox>
            <component
                v-if="templates['nodeicon']"
                :is="templates['nodeicon']"
                :node="node"
                :class="[cx('nodeIcon')]"
                v-bind="getPTOptions('nodeIcon')"
            ></component>
            <span v-else :class="[cx('nodeIcon'), node.icon]" v-bind="getPTOptions('nodeIcon')"></span>
            <span :class="cx('nodeLabel')" v-bind="getPTOptions('nodeLabel')" @keydown.stop>
                <component
                    v-if="templates[node.type ?? 'default'] || templates.default"
                    :is="templates[node.type ?? 'default'] || templates.default"
                    :node="node"
                    :expanded="expanded"
                    :selected="checkboxMode ? checked : selected"
                />
                <template v-else>{{ label(node) }}</template>
            </span>
        </div>
        <div v-if="isNextDropPointActive" :class="cx('dropPoint')" aria-hidden="true" />
        <ul v-if="hasChildren && expanded" :class="cx('nodeChildren')" role="group" v-bind="ptm('nodeChildren')">
            <TreeNode
                v-for="(childNode, index) of node.children"
                :key="childNode.key"
                :node="childNode"
                :parentNode="node"
                :rootNodes="rootNodes"
                :templates="templates"
                :level="level + 1"
                :index="index"
                :loadingMode="loadingMode"
                :expandedKeys="expandedKeys"
                @node-toggle="onChildNodeToggle"
                @node-click="onChildNodeClick"
                :selectionMode="selectionMode"
                :selectionKeys="selectionKeys"
                @checkbox-change="propagateUp"
                :draggableScope="draggableScope"
                :draggableNodes="draggableNodes"
                :droppableNodes="droppableNodes"
                :validateDrop="validateDrop"
                @node-drop="$emit('node-drop', $event)"
                @node-dragenter="$emit('node-dragenter', $event)"
                @node-dragleave="$emit('node-dragleave', $event)"
                @value-change="$emit('value-change', $event)"
                :unstyled="unstyled"
                :pt="pt"
            />
        </ul>
    </li>
</template>

<script lang="ts">
import { getAttribute, getOuterHeight, getOuterWidth } from '../internal/utils/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import CheckIcon from '../icons/check/CheckIcon.vue';
import ChevronDownIcon from '../icons/chevrondown/ChevronDownIcon.vue';
import ChevronRightIcon from '../icons/chevronright/ChevronRightIcon.vue';
import MinusIcon from '../icons/minus/MinusIcon.vue';
import SpinnerIcon from '../icons/spinner/SpinnerIcon.vue';
import Checkbox from '../checkbox/Checkbox.vue';
import Ripple from '../ripple/Ripple';
import { defineComponent, inject, type PropType, type Slots } from 'vue';
import type { TreeNode as TreeNodeData } from '../treenode/TreeNode';
import type { TreeExpandedKeys, TreeSelectionKeys } from './Tree';
import type { DragScope, useTreeDragDropService } from './TreeDragDropService';

interface TreeCheckboxChange {
    check: boolean;
    node: TreeNodeData;
    selectionKeys: TreeSelectionKeys;
}

interface TreeDragContext {
    dragNode: TreeNodeData | null;
    dragNodeIndex: number | null;
    dragNodeSubNodes: TreeNodeData[] | null;
    dragDropService: ReturnType<typeof useTreeDragDropService> | null;
    allowNodeDrop(node: TreeNodeData): boolean;
}

export default defineComponent({
    name: 'TreeNode',
    hostName: 'Tree',
    extends: BaseComponent,
    emits: ['node-toggle', 'node-click', 'checkbox-change', 'node-drop', 'value-change', 'node-dragenter', 'node-dragleave'],
    props: {
        node: {
            type: Object as PropType<TreeNodeData>,
            required: true
        },
        parentNode: {
            type: Object as PropType<TreeNodeData>,
            default: null
        },
        rootNodes: {
            type: Array as PropType<TreeNodeData[]>,
            default: () => []
        },
        expandedKeys: {
            type: Object as PropType<TreeExpandedKeys>,
            default: null
        },
        loadingMode: {
            type: String,
            default: 'mask'
        },
        selectionKeys: {
            type: Object as PropType<TreeSelectionKeys>,
            default: null
        },
        selectionMode: {
            type: String,
            default: null
        },
        templates: {
            type: Object as PropType<Slots>,
            default: () => ({})
        },
        level: {
            type: Number,
            default: null
        },
        draggableScope: {
            type: [String, Array] as PropType<DragScope>,
            default: null
        },
        draggableNodes: {
            type: Boolean,
            default: null
        },
        droppableNodes: {
            type: Boolean,
            default: null
        },
        validateDrop: {
            type: Boolean,
            default: false
        },
        index: {
            type: Number,
            required: true
        }
    },
    setup() {
        return { tree: inject<TreeDragContext>('$pcTree') };
    },
    data() {
        return {
            isPrevDropPointHovered: false,
            isNextDropPointHovered: false,
            isNodeDropHovered: false,
            nodeTouched: false,
            toggleClicked: false
        };
    },
    mounted() {
        this.setAllNodesTabIndexes();
    },
    methods: {
        toggle() {
            this.$emit('node-toggle', this.node);
            this.toggleClicked = true;
        },
        label(node: TreeNodeData) {
            const label = node.label as string | (() => string) | undefined;

            return typeof label === 'function' ? label() : label;
        },
        onChildNodeToggle(node: TreeNodeData) {
            this.$emit('node-toggle', node);
        },
        getPTOptions(key: string) {
            return this.ptm(key, {
                context: {
                    node: this.node,
                    index: this.index,
                    expanded: this.expanded,
                    selected: this.selected,
                    checked: this.checked,
                    partialChecked: this.partialChecked,
                    leaf: this.leaf
                }
            });
        },
        onClick(event: MouseEvent | KeyboardEvent) {
            const target = event.target;
            if (!(target instanceof Element)) return;

            if (
                this.toggleClicked ||
                target.matches('[data-pc-section="nodetogglebutton"]') ||
                target.parentElement?.matches('[data-pc-section="nodetogglebutton"]')
            ) {
                this.toggleClicked = false;

                return;
            }

            if (this.isCheckboxSelectionMode()) {
                if (this.node.selectable != false) {
                    this.toggleCheckbox();
                }
            } else {
                this.$emit('node-click', {
                    originalEvent: event,
                    nodeTouched: this.nodeTouched,
                    node: this.node
                });
            }

            this.nodeTouched = false;
        },
        onChildNodeClick(event: { originalEvent: MouseEvent | KeyboardEvent; nodeTouched: boolean; node: TreeNodeData }) {
            this.$emit('node-click', event);
        },
        onTouchEnd() {
            this.nodeTouched = true;
        },
        onKeyDown(event: KeyboardEvent) {
            if (!this.isSameNode(event)) return;

            switch (event.code) {
                case 'Tab':
                    this.onTabKey();

                    break;

                case 'ArrowDown':
                    this.onArrowDown(event);

                    break;

                case 'ArrowUp':
                    this.onArrowUp(event);

                    break;

                case 'ArrowRight':
                    this.onArrowRight(event);

                    break;

                case 'ArrowLeft':
                    this.onArrowLeft(event);

                    break;

                case 'Enter':
                case 'NumpadEnter':
                case 'Space':
                    this.onEnterKey(event);

                    break;

                default:
                    break;
            }
        },
        onArrowDown(event: KeyboardEvent) {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;

            const nodeElement = target.dataset.pcSection === 'nodetogglebutton' ? target.closest<HTMLElement>('[role="treeitem"]') : target;
            if (!nodeElement) return;

            const listElement = nodeElement.children[1];

            if (listElement) {
                this.focusRowChange(nodeElement, listElement.children[0]);
            } else {
                if (nodeElement.nextElementSibling) {
                    this.focusRowChange(nodeElement, nodeElement.nextElementSibling);
                } else {
                    let nextSiblingAncestor = this.findNextSiblingOfAncestor(nodeElement);

                    if (nextSiblingAncestor) {
                        this.focusRowChange(nodeElement, nextSiblingAncestor);
                    }
                }
            }

            event.preventDefault();
        },
        onArrowUp(event: KeyboardEvent) {
            const nodeElement = event.target;
            if (!(nodeElement instanceof HTMLElement)) return;

            if (nodeElement.previousElementSibling) {
                this.focusRowChange(nodeElement, nodeElement.previousElementSibling, this.findLastVisibleDescendant(nodeElement.previousElementSibling));
            } else {
                let parentNodeElement = this.getParentNodeElement(nodeElement);

                if (parentNodeElement) {
                    this.focusRowChange(nodeElement, parentNodeElement);
                }
            }

            event.preventDefault();
        },
        onArrowRight(event: KeyboardEvent) {
            if (this.leaf) return;

            if (this.expanded) {
                const nodeElement = event.currentTarget;
                if (!(nodeElement instanceof HTMLElement)) return;

                const child = nodeElement.querySelector<HTMLElement>(':scope > ul > [role="treeitem"]');

                if (child) this.focusRowChange(nodeElement, child);
            } else {
                this.$emit('node-toggle', this.node);
            }

            event.preventDefault();
        },
        onArrowLeft(event: KeyboardEvent) {
            const nodeElement = event.currentTarget;
            if (!(nodeElement instanceof HTMLElement)) return;

            const togglerElement = nodeElement.querySelector<HTMLButtonElement>('[data-pc-section="nodetogglebutton"]');

            if (this.level === 0 && !this.expanded) {
                return false;
            }

            if (this.expanded && !this.leaf) {
                togglerElement?.click();

                return false;
            }

            const target = this.findBeforeClickableNode(nodeElement);

            if (target) {
                this.focusRowChange(nodeElement, target);
            }
        },
        onEnterKey(event: KeyboardEvent) {
            this.setTabIndexForSelectionMode(event, this.nodeTouched);
            this.onClick(event);

            event.preventDefault();
        },
        onTabKey() {
            this.setAllNodesTabIndexes();
        },
        removeNodeFromTree(nodes: TreeNodeData[], nodeToRemove: TreeNodeData): TreeNodeData[] {
            return nodes.reduce<TreeNodeData[]>((acc, node) => {
                if (node.key === nodeToRemove.key) {
                    return acc;
                }
                if (node.children && node.children.length > 0) {
                    const updatedChildren = this.removeNodeFromTree(node.children, nodeToRemove);
                    acc.push({ ...node, children: updatedChildren });
                } else {
                    acc.push(node);
                }

                return acc;
            }, []);
        },
        insertNodeInSiblings(nodes: TreeNodeData[], targetKey: string, nodeToInsert: TreeNodeData, offset: number): TreeNodeData[] {
            const targetIndex = nodes.findIndex((n) => n.key === targetKey);

            if (targetIndex !== -1) {
                const siblings = [...nodes];
                siblings.splice(targetIndex + offset, 0, nodeToInsert);
                return siblings;
            }

            return nodes.map((node) => {
                if (node.children && node.children.length > 0) {
                    return { ...node, children: this.insertNodeInSiblings(node.children, targetKey, nodeToInsert, offset) };
                }

                return node;
            });
        },
        addNodeAsChild(nodes: TreeNodeData[], parentKey: string, nodeToInsert: TreeNodeData): TreeNodeData[] {
            return nodes.map((node) => {
                if (node.key === parentKey) {
                    return { ...node, children: [...(node.children || []), nodeToInsert] };
                }

                if (node.children && node.children.length > 0) {
                    return { ...node, children: this.addNodeAsChild(node.children, parentKey, nodeToInsert) };
                }

                return node;
            });
        },
        insertNodeOnDrop() {
            if (!this.tree) return null;

            const { dragNode, dragNodeIndex, dragNodeSubNodes, dragDropService } = this.tree;

            if (!this.node || dragNodeIndex == null || !dragNode || !dragNodeSubNodes) {
                return null;
            }

            const position = this.dropPosition;
            let updatedNodes = this.removeNodeFromTree(this.rootNodes, dragNode);

            if (position < 0) {
                // insert before a Node
                updatedNodes = this.insertNodeInSiblings(updatedNodes, this.node.key, dragNode, 0);
            } else if (position > 0) {
                // insert after a Node
                updatedNodes = this.insertNodeInSiblings(updatedNodes, this.node.key, dragNode, 1);
            } else {
                // insert as child of a Node
                updatedNodes = this.addNodeAsChild(updatedNodes, this.node.key, dragNode);
            }

            this.$emit('value-change', { nodes: updatedNodes });

            dragDropService?.stopDrag({
                node: dragNode,
                subNodes: updatedNodes,
                index: dragNodeIndex
            });

            return updatedNodes;
        },
        onNodeDrop(event: DragEvent) {
            if (this.isDroppable) {
                event.preventDefault();
                event.stopPropagation();

                const dragNode = this.tree?.dragNode;
                const position = this.dropPosition;
                const isValidDrop = position !== 0 || (position === 0 && this.isNodeDroppable);

                if (isValidDrop) {
                    if (this.validateDrop) {
                        this.$emit('node-drop', {
                            originalEvent: event,
                            value: this.rootNodes,
                            dragNode: dragNode,
                            dropNode: this.node,
                            dropPosition: position,
                            index: this.index,
                            accept: () => {
                                const updatedNodes = this.insertNodeOnDrop();

                                this.$emit('node-drop', {
                                    originalEvent: event,
                                    value: updatedNodes,
                                    dragNode: dragNode,
                                    dropNode: this.node,
                                    dropPosition: position,
                                    index: this.index
                                });
                            }
                        });
                    } else {
                        const updatedNodes = this.insertNodeOnDrop();

                        this.$emit('node-drop', {
                            originalEvent: event,
                            value: updatedNodes,
                            dragNode: dragNode,
                            dropNode: this.node,
                            dropPosition: position,
                            index: this.index
                        });
                    }
                }

                this.isPrevDropPointHovered = false;
                this.isNextDropPointHovered = false;
                this.isNodeDropHovered = false;
            }
        },
        onNodeDragStart(event: DragEvent) {
            const { currentTarget: target, dataTransfer } = event;

            if (this.isNodeDraggable && target instanceof HTMLElement && dataTransfer) {
                dataTransfer.effectAllowed = 'all';
                dataTransfer.setData('text', 'data');

                const dragEl = target.cloneNode(true) as HTMLElement;
                const toggler = dragEl.querySelector<HTMLButtonElement>('[data-pc-section="nodetogglebutton"]');
                const checkbox = dragEl.querySelector('[data-pc-name="pcnodecheckbox"]');

                target.setAttribute('data-p-dragging', 'true');
                dragEl.style.width = getOuterWidth(target) + 'px';
                dragEl.style.height = getOuterHeight(target) + 'px';
                dragEl.setAttribute('data-pc-section', 'drag-image');
                if (toggler) toggler.style.visibility = 'hidden';
                checkbox?.remove();
                document.body.appendChild(dragEl);
                dataTransfer.setDragImage(dragEl, 0, 0);

                setTimeout(() => dragEl.remove(), 0);

                this.tree?.dragDropService?.startDrag({
                    node: this.node,
                    subNodes: this.subNodes,
                    index: this.index,
                    scope: this.draggableScope
                });
            } else {
                event.preventDefault();
            }
        },
        onNodeDragOver(event: DragEvent) {
            const { dataTransfer, currentTarget: nodeElement } = event;
            if (!dataTransfer || !(nodeElement instanceof Element)) return;

            if (this.isDroppable) {
                dataTransfer.dropEffect = 'copy';
                const rect = nodeElement.getBoundingClientRect();
                const y = event.clientY - rect.top;

                this.isPrevDropPointHovered = false;
                this.isNextDropPointHovered = false;
                this.isNodeDropHovered = false;

                if (y < rect.height * 0.25) {
                    this.isPrevDropPointHovered = true;
                } else if (y > rect.height * 0.75) {
                    this.isNextDropPointHovered = true;
                } else if (this.isNodeDroppable) {
                    this.isNodeDropHovered = true;
                }
            } else {
                dataTransfer.dropEffect = 'none';
            }

            if (this.droppableNodes) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        onNodeDragEnter() {
            this.$emit('node-dragenter', {
                node: this.node
            });
        },
        onNodeDragLeave() {
            this.$emit('node-dragleave', {
                node: this.node
            });

            this.isPrevDropPointHovered = false;
            this.isNextDropPointHovered = false;
            this.isNodeDropHovered = false;
        },
        onNodeDragEnd(event: DragEvent) {
            if (event.currentTarget instanceof Element) event.currentTarget.removeAttribute('data-p-dragging');

            this.tree?.dragDropService?.stopDrag({
                node: this.node,
                subNodes: this.subNodes,
                index: this.index
            });
        },
        setAllNodesTabIndexes() {
            const currentNode = this.$refs.currentNode as HTMLElement;
            const nodes = [...(currentNode.closest('[data-pc-section="rootchildren"]')?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? [])];

            const hasSelectedNode = [...nodes].some((node) => node.getAttribute('aria-selected') === 'true' || node.getAttribute('aria-checked') === 'true');

            [...nodes].forEach((node) => {
                node.tabIndex = -1;
            });

            if (hasSelectedNode) {
                const selectedNodes = [...nodes].filter(
                    (node) => node.getAttribute('aria-selected') === 'true' || node.getAttribute('aria-checked') === 'true'
                );

                selectedNodes[0].tabIndex = 0;

                return;
            }

            if (nodes[0]) nodes[0].tabIndex = 0;
        },
        setTabIndexForSelectionMode(event: KeyboardEvent, nodeTouched: boolean) {
            if (this.selectionMode !== null && event.currentTarget instanceof HTMLElement) {
                const currentNode = this.$refs.currentNode as HTMLElement;
                const elements = [...(currentNode.parentElement?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? [])];

                event.currentTarget.tabIndex = nodeTouched === false ? -1 : 0;

                if (elements[0] && elements.every((element) => element.tabIndex === -1)) {
                    elements[0].tabIndex = 0;
                }
            }
        },
        focusRowChange(firstFocusableRow: HTMLElement, currentFocusedRow: Element | undefined, lastVisibleDescendant?: HTMLElement | null) {
            if (!(currentFocusedRow instanceof HTMLElement)) return;

            firstFocusableRow.tabIndex = -1;
            currentFocusedRow.tabIndex = 0;

            this.focusNode(lastVisibleDescendant || currentFocusedRow);
        },
        findBeforeClickableNode(node: Element | null): HTMLLIElement | null {
            const parentListElement = node?.closest('ul')?.closest('li');

            if (parentListElement) {
                const prevNodeButton = parentListElement.querySelector('button');

                if (prevNodeButton && prevNodeButton.style.visibility !== 'hidden') {
                    return parentListElement;
                }

                return this.findBeforeClickableNode(node?.previousElementSibling ?? null);
            }

            return null;
        },
        toggleCheckbox() {
            let _selectionKeys = this.selectionKeys ? { ...this.selectionKeys } : {};
            const _check = !this.checked;

            this.propagateDown(this.node, _check, _selectionKeys);

            this.$emit('checkbox-change', {
                node: this.node,
                check: _check,
                selectionKeys: _selectionKeys
            });
        },
        propagateDown(node: TreeNodeData, check: boolean, selectionKeys: TreeSelectionKeys) {
            if (check && node.selectable != false) selectionKeys[node.key] = { checked: true, partialChecked: false };
            else delete selectionKeys[node.key];

            if (node.children && node.children.length) {
                for (let child of node.children) {
                    this.propagateDown(child, check, selectionKeys);
                }
            }
        },
        propagateUp(event: TreeCheckboxChange) {
            let check = event.check;
            let _selectionKeys = { ...event.selectionKeys };
            let checkedChildCount = 0;
            let childPartialSelected = false;

            const children = this.node.children ?? [];

            for (const child of children) {
                if (_selectionKeys[child.key] && _selectionKeys[child.key].checked) checkedChildCount++;
                else if (_selectionKeys[child.key] && _selectionKeys[child.key].partialChecked) childPartialSelected = true;
            }

            if (check && checkedChildCount === children.length) {
                _selectionKeys[this.node.key] = { checked: true, partialChecked: false };
            } else {
                if (!check) {
                    delete _selectionKeys[this.node.key];
                }

                if (childPartialSelected || (checkedChildCount > 0 && checkedChildCount !== children.length))
                    _selectionKeys[this.node.key] = { checked: false, partialChecked: true };
                else delete _selectionKeys[this.node.key];
            }

            this.$emit('checkbox-change', {
                node: event.node,
                check: event.check,
                selectionKeys: _selectionKeys
            });
        },
        onChildCheckboxChange(event: TreeCheckboxChange) {
            this.$emit('checkbox-change', event);
        },
        findNextSiblingOfAncestor(nodeElement: Element): Element | null {
            let parentNodeElement = this.getParentNodeElement(nodeElement);

            if (parentNodeElement) {
                if (parentNodeElement.nextElementSibling) return parentNodeElement.nextElementSibling;
                else return this.findNextSiblingOfAncestor(parentNodeElement);
            } else {
                return null;
            }
        },
        findLastVisibleDescendant(nodeElement: Element): HTMLElement | null {
            if (!(nodeElement instanceof HTMLElement)) return null;

            const childrenListElement = nodeElement.children[1];

            if (childrenListElement) {
                const lastChildElement = childrenListElement.children[childrenListElement.children.length - 1];

                return this.findLastVisibleDescendant(lastChildElement);
            } else {
                return nodeElement;
            }
        },
        getParentNodeElement(nodeElement: Element) {
            const parentNodeElement = nodeElement.parentElement?.parentElement;

            return parentNodeElement?.getAttribute('role') === 'treeitem' ? parentNodeElement : null;
        },
        focusNode(element: HTMLElement) {
            element.focus();
        },
        isCheckboxSelectionMode() {
            return this.selectionMode === 'checkbox';
        },
        isSameNode(event: KeyboardEvent) {
            const { currentTarget, target } = event;

            return target instanceof Element && (currentTarget === target || currentTarget === target.closest('[role="treeitem"]'));
        }
    },
    computed: {
        hasChildren() {
            return this.node.children && this.node.children.length > 0;
        },
        expanded() {
            return this.expandedKeys?.[this.node.key] === true;
        },
        leaf() {
            return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
        },
        selectable() {
            return this.node.selectable === false ? false : this.selectionMode != null;
        },
        selected() {
            return this.selectionMode && this.selectionKeys ? this.selectionKeys[this.node.key] === true : false;
        },
        checkboxMode() {
            return this.selectionMode === 'checkbox' && this.node.selectable !== false;
        },
        checked() {
            return this.selectionKeys ? this.selectionKeys[this.node.key] && this.selectionKeys[this.node.key].checked : false;
        },
        partialChecked() {
            return this.selectionKeys ? this.selectionKeys[this.node.key] && this.selectionKeys[this.node.key].partialChecked : false;
        },
        ariaChecked() {
            return this.selectionMode === 'single' || this.selectionMode === 'multiple' ? this.selected : undefined;
        },
        ariaSelected() {
            return this.checkboxMode ? this.checked : undefined;
        },
        isPrevDropPointActive() {
            return this.isPrevDropPointHovered && this.isDroppable;
        },
        isNextDropPointActive() {
            return this.isNextDropPointHovered && this.isDroppable;
        },
        dropPosition() {
            return this.isPrevDropPointActive ? -1 : this.isNextDropPointActive ? 1 : 0;
        },
        subNodes() {
            return this.parentNode?.children ?? this.rootNodes;
        },
        isDraggable() {
            return this.draggableNodes;
        },
        isDroppable() {
            return this.droppableNodes && !!this.tree?.allowNodeDrop(this.node);
        },
        isNodeDraggable() {
            return this.node?.draggable !== false && this.isDraggable;
        },
        isNodeDroppable() {
            return this.node?.droppable !== false && this.isDroppable;
        },
        isNodeDropActive() {
            return this.isNodeDropHovered && this.isNodeDroppable;
        }
    },
    components: {
        Checkbox,
        ChevronDownIcon,
        ChevronRightIcon,
        CheckIcon,
        MinusIcon,
        SpinnerIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
