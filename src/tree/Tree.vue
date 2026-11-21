<template>
    <div
        :class="cx('root')"
        @dragover="onDragOver"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @drop="onDrop"
        :data-p="containerDataP"
        v-bind="ptmi('root')"
    >
        <transition name="rs-overlay-mask">
            <div v-if="loading && loadingMode === 'mask'" :class="cx('mask')" v-bind="ptm('mask')">
                <slot name="loadingicon" :class="cx('loadingIcon')">
                    <i v-if="loadingIcon" :class="[cx('loadingIcon'), 'pi-spin', loadingIcon]" v-bind="ptm('loadingIcon')" />
                    <SpinnerIcon v-else spin :class="cx('loadingIcon')" v-bind="ptm('loadingIcon')" />
                </slot>
            </div>
        </transition>
        <IconField v-if="filter" :unstyled="unstyled" :pt="{ ...ptm('pcFilter'), ...ptm('pcFilterContainer') }" :class="cx('pcFilterContainer')">
            <InputText
                v-model="filterValue"
                autocomplete="off"
                :class="cx('pcFilterInput')"
                :placeholder="filterPlaceholder"
                :unstyled="unstyled"
                @keyup="onFilterKeyup"
                :pt="ptm('pcFilterInput')"
            />
            <InputIcon :unstyled="unstyled" :pt="ptm('pcFilterIconContainer')">
                <!--TODO: searchicon deprecated since v4.0-->
                <slot :name="$slots.filtericon ? 'filtericon' : 'searchicon'" :class="cx('filterIcon')">
                    <SearchIcon :class="cx('filterIcon')" v-bind="ptm('filterIcon')" />
                </slot>
            </InputIcon>
        </IconField>
        <div :class="cx('wrapper')" :style="{ maxHeight: scrollHeight }" :data-p="wrapperDataP" v-bind="ptm('wrapper')">
            <slot name="header" :value="value" :expandedKeys="expandedKeys" :selectionKeys="selectionKeys" />
            <ul v-if="!empty" :class="cx('rootChildren')" role="tree" :aria-labelledby="ariaLabelledby" :aria-label="ariaLabel" v-bind="ptm('rootChildren')">
                <TreeNode
                    v-for="(node, index) of valueToRender"
                    :key="node.key"
                    :node="node"
                    :rootNodes="valueToRender ?? []"
                    :templates="$slots"
                    :level="level + 1"
                    :index="index"
                    :expandedKeys="d_expandedKeys"
                    @node-toggle="onNodeToggle"
                    @node-click="onNodeClick"
                    :selectionMode="selectionMode"
                    :selectionKeys="selectionKeys"
                    @checkbox-change="onCheckboxChange"
                    :loadingMode="loadingMode"
                    :draggableNodes="draggableNodes"
                    :droppableNodes="droppableNodes"
                    :draggableScope="draggableScope ?? undefined"
                    :validateDrop="validateDrop"
                    @node-drop="onNodeDrop"
                    @node-dragenter="onNodeDragEnter"
                    @node-dragleave="onNodeDragLeave"
                    @value-change="onValueChanged"
                    :unstyled="unstyled"
                    :pt="pt"
                ></TreeNode>
            </ul>
            <div v-else-if="empty && (!treeSelect || $slots.empty)" :class="cx('emptyMessage')" v-bind="ptm('emptyMessage')">
                <slot name="empty">
                    {{ emptyMessageText }}
                </slot>
            </div>
            <slot name="footer" :value="value" :expandedKeys="expandedKeys" :selectionKeys="selectionKeys" />
        </div>
    </div>
</template>

<script lang="ts">
import { cn } from '../internal/utils/index';
import { resolveFieldData } from '../internal/utils/object/index';
import SearchIcon from '../icons/search/SearchIcon.vue';
import SpinnerIcon from '../icons/spinner/SpinnerIcon.vue';
import IconField from '../iconfield/IconField.vue';
import InputIcon from '../inputicon/InputIcon.vue';
import InputText from '../inputtext/InputText.vue';
import BaseTree from './BaseTree.vue';
import { defineComponent, inject } from 'vue';
import type { TreeNode as TreeNodeData } from '../treenode/TreeNode';
import type { TreeExpandedKeys, TreeSelectionKeys } from './Tree';
import { useTreeDragDropService, type DragScope } from './TreeDragDropService';
import TreeNode from './TreeNode.vue';

interface TreeNodeClick {
    originalEvent: MouseEvent | KeyboardEvent;
    node: TreeNodeData;
    nodeTouched?: boolean;
}

interface TreeCheckboxChange {
    selectionKeys: TreeSelectionKeys;
    check: boolean;
    node: TreeNodeData;
}

interface TreeFilter {
    searchFields: Array<string | ((node: TreeNodeData) => unknown)>;
    filterText: string;
    strict: boolean;
}

export default defineComponent({
    name: 'Tree',
    extends: BaseTree,
    inheritAttrs: false,
    emits: [
        'node-expand',
        'node-collapse',
        'update:expandedKeys',
        'update:selectionKeys',
        'node-select',
        'node-unselect',
        'filter',
        'node-drop',
        'node-dragenter',
        'node-dragleave',
        'update:value',
        'drag-enter',
        'drag-leave'
    ],
    data() {
        return {
            d_expandedKeys: (this.expandedKeys || {}) as TreeExpandedKeys,
            filterValue: '',
            dragNode: null as TreeNodeData | null,
            dragNodeSubNodes: null as TreeNodeData[] | null,
            dragNodeIndex: null as number | null,
            dragNodeScope: null as DragScope,
            dragHover: false,
            dragDropService: null as ReturnType<typeof useTreeDragDropService> | null,
            dragStartCleanup: null as (() => void) | null,
            dragStopCleanup: null as (() => void) | null
        };
    },
    setup() {
        return { treeSelect: inject('$pcTreeSelect', null) };
    },
    watch: {
        expandedKeys(newValue) {
            this.d_expandedKeys = newValue ?? {};
        },
        droppableNodes(newValue) {
            if (newValue) {
                this.initDragDropService();
            } else {
                this.cleanupDragDropService();
            }
        }
    },
    mounted() {
        if (this.droppableNodes) {
            this.initDragDropService();
        }
    },
    beforeUnmount() {
        this.cleanupDragDropService();
    },
    methods: {
        initDragDropService() {
            if (this.dragDropService) return;

            this.dragDropService = useTreeDragDropService();

            this.dragStartCleanup = this.dragDropService.onDragStart((event) => {
                this.dragNode = event.node;
                this.dragNodeSubNodes = event.subNodes;
                this.dragNodeIndex = event.index;
                this.dragNodeScope = event.scope;
            });

            this.dragStopCleanup = this.dragDropService.onDragStop(() => {
                this.dragNode = null;
                this.dragNodeSubNodes = null;
                this.dragNodeIndex = null;
                this.dragNodeScope = null;
                this.dragHover = false;
            });
        },
        cleanupDragDropService() {
            if (this.dragStartCleanup) {
                this.dragStartCleanup();
                this.dragStartCleanup = null;
            }

            if (this.dragStopCleanup) {
                this.dragStopCleanup();
                this.dragStopCleanup = null;
            }

            this.dragDropService = null;
        },
        onNodeToggle(node: TreeNodeData) {
            const key = node.key;
            const sourceNode = this.valueToRender === this.value ? node : this.findNodeByKey(this.value, key) || node;

            if (this.d_expandedKeys[key]) {
                delete this.d_expandedKeys[key];
                this.$emit('node-collapse', sourceNode);
            } else {
                this.d_expandedKeys[key] = true;
                this.$emit('node-expand', sourceNode);
            }

            this.d_expandedKeys = { ...this.d_expandedKeys };
            this.$emit('update:expandedKeys', this.d_expandedKeys);
        },
        onNodeClick(event: TreeNodeClick) {
            if (this.selectionMode != null && event.node.selectable !== false) {
                const metaSelection = event.nodeTouched ? false : this.metaKeySelection;
                const _selectionKeys = metaSelection ? this.handleSelectionWithMetaKey(event) : this.handleSelectionWithoutMetaKey(event);

                this.$emit('update:selectionKeys', _selectionKeys);
            }
        },
        onCheckboxChange(event: TreeCheckboxChange) {
            this.$emit('update:selectionKeys', event.selectionKeys);

            if (event.check) this.$emit('node-select', event.node);
            else this.$emit('node-unselect', event.node);
        },
        handleSelectionWithMetaKey(event: TreeNodeClick) {
            const originalEvent = event.originalEvent;
            const node = event.node;
            const metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
            const selected = this.isNodeSelected(node);
            let _selectionKeys: TreeSelectionKeys = {};

            if (selected && metaKey) {
                if (this.isSingleSelectionMode()) {
                    _selectionKeys = {};
                } else {
                    _selectionKeys = { ...this.selectionKeys };
                    delete _selectionKeys[node.key];
                }

                this.$emit('node-unselect', node);
            } else {
                if (this.isSingleSelectionMode()) {
                    _selectionKeys = {};
                } else if (this.isMultipleSelectionMode()) {
                    _selectionKeys = !metaKey ? {} : this.selectionKeys ? { ...this.selectionKeys } : {};
                }

                _selectionKeys[node.key] = true;
                this.$emit('node-select', node);
            }

            return _selectionKeys;
        },
        handleSelectionWithoutMetaKey(event: TreeNodeClick) {
            const node = event.node;
            const selected = this.isNodeSelected(node);
            let _selectionKeys: TreeSelectionKeys = {};

            if (this.isSingleSelectionMode()) {
                if (selected) {
                    _selectionKeys = {};
                    this.$emit('node-unselect', node);
                } else {
                    _selectionKeys = {};
                    _selectionKeys[node.key] = true;
                    this.$emit('node-select', node);
                }
            } else {
                if (selected) {
                    _selectionKeys = { ...this.selectionKeys };
                    delete _selectionKeys[node.key];

                    this.$emit('node-unselect', node);
                } else {
                    _selectionKeys = this.selectionKeys ? { ...this.selectionKeys } : {};
                    _selectionKeys[node.key] = true;

                    this.$emit('node-select', node);
                }
            }

            return _selectionKeys;
        },
        isSingleSelectionMode() {
            return this.selectionMode === 'single';
        },
        isMultipleSelectionMode() {
            return this.selectionMode === 'multiple';
        },
        isNodeSelected(node: TreeNodeData) {
            return this.selectionMode && this.selectionKeys ? this.selectionKeys[node.key] === true : false;
        },
        isChecked(node: TreeNodeData) {
            return this.selectionKeys ? this.selectionKeys[node.key] && this.selectionKeys[node.key].checked : false;
        },
        isNodeLeaf(node: TreeNodeData) {
            return node.leaf === false ? false : !(node.children && node.children.length);
        },
        onFilterKeyup(event: KeyboardEvent) {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                event.preventDefault();
            }

            this.$emit('filter', { originalEvent: event, value: (event.target as HTMLInputElement).value, filteredNodes: this.valueToRender });
        },
        findFilteredNodes(node: TreeNodeData, paramsWithoutNode: TreeFilter): true | undefined {
            if (node) {
                let matched = false;

                if (node.children) {
                    let childNodes = [...node.children];

                    node.children = [];

                    for (let childNode of childNodes) {
                        let copyChildNode = { ...childNode };

                        if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
                            matched = true;
                            node.children.push(copyChildNode);
                        }
                    }
                }

                if (matched) {
                    return true;
                }
            }
        },
        isFilterMatched(node: TreeNodeData, { searchFields, filterText, strict }: TreeFilter): boolean {
            let matched = false;

            for (let field of searchFields) {
                let fieldValue = String(resolveFieldData(node, field)).toLocaleLowerCase(this.filterLocale);

                if (fieldValue.indexOf(filterText) > -1) {
                    matched = true;
                }
            }

            if (!matched || (strict && !this.isNodeLeaf(node))) {
                matched = this.findFilteredNodes(node, { searchFields, filterText, strict }) || matched;
            }

            return matched;
        },
        onNodeDrop(event: unknown) {
            this.$emit('node-drop', event);
        },
        onNodeDragEnter(event: unknown) {
            this.$emit('node-dragenter', event);
        },
        onNodeDragLeave(event: unknown) {
            this.$emit('node-dragleave', event);
        },
        onValueChanged(event: { nodes: TreeNodeData[] }) {
            if (this.dragNodeIndex != null) this.dragNodeSubNodes?.splice(this.dragNodeIndex, 1);
            this.$emit('update:value', event.nodes);
        },
        findNodeByKey(nodes: TreeNodeData[] | undefined | null, key: string): TreeNodeData | null {
            for (let node of nodes || []) {
                if (node.key === key) return node;

                const found = this.findNodeByKey(node.children, key);

                if (found) return found;
            }

            return null;
        },
        isDescendantOf(node: TreeNodeData, target: TreeNodeData): boolean {
            if (!node || !node.children) {
                return false;
            }

            for (let child of node.children) {
                if (child === target || this.isDescendantOf(child, target)) {
                    return true;
                }
            }

            return false;
        },
        allowDrop(dragNode: TreeNodeData | null, dropNode: TreeNodeData | null, dragNodeScope: DragScope) {
            if (!dragNode) {
                return false;
            }

            if (!this.isValidDragScope(dragNodeScope)) {
                return false;
            }

            if (dropNode && (dragNode === dropNode || this.isDescendantOf(dragNode, dropNode))) {
                return false;
            }

            return true;
        },
        allowNodeDrop(dropNode: TreeNodeData) {
            return this.allowDrop(this.dragNode, dropNode, this.dragNodeScope);
        },
        hasCommonScope(dragScope: DragScope, dropScope: DragScope) {
            if (dragScope === null && dropScope === null) {
                return true;
            } else if (dragScope === null || dropScope === null) {
                return false;
            }

            if (typeof dropScope === 'string') {
                if (typeof dragScope === 'string') {
                    return dragScope === dropScope;
                } else if (Array.isArray(dragScope)) {
                    return dragScope.indexOf(dropScope) !== -1;
                }
            } else if (Array.isArray(dropScope)) {
                if (typeof dragScope === 'string') {
                    return dropScope.indexOf(dragScope) !== -1;
                } else if (Array.isArray(dragScope)) {
                    for (let ds of dragScope) {
                        if (dropScope.indexOf(ds) !== -1) {
                            return true;
                        }
                    }
                    return false;
                }
            }

            return false;
        },
        isValidDragScope(dragScope: DragScope) {
            if (this.droppableScope === null) {
                return true;
            }

            return this.hasCommonScope(dragScope, this.droppableScope);
        },
        isSameTreeScope(dragScope: DragScope) {
            return this.hasCommonScope(dragScope, this.draggableScope);
        },
        onDragOver(event: DragEvent) {
            if (!event.dataTransfer) return;

            if (this.droppableNodes && this.allowDrop(this.dragNode, null, this.dragNodeScope)) {
                event.dataTransfer.dropEffect = 'copy';
            } else {
                event.dataTransfer.dropEffect = 'none';
            }

            event.preventDefault();
        },
        onDragEnter(event: DragEvent) {
            if (this.droppableNodes && this.allowDrop(this.dragNode, null, this.dragNodeScope)) {
                this.dragHover = true;

                this.$emit('drag-enter', {
                    originalEvent: event,
                    value: this.value,
                    dragNode: this.dragNode,
                    dragNodeScope: this.dragNodeScope
                });
            }
        },
        onDragLeave(event: DragEvent) {
            if (this.droppableNodes && event.currentTarget instanceof Element) {
                const rect = event.currentTarget.getBoundingClientRect();

                if (
                    event.x >= Math.trunc(rect.right) ||
                    event.x <= Math.trunc(rect.left) ||
                    event.y >= Math.trunc(rect.bottom) ||
                    event.y <= Math.trunc(rect.top)
                ) {
                    this.dragHover = false;
                }

                this.$emit('drag-leave', {
                    originalEvent: event,
                    value: this.value,
                    dragNode: this.dragNode,
                    dragNodeScope: this.dragNodeScope
                });
            }
        },
        processTreeDrop(dragNode: TreeNodeData, dragNodeIndex: number) {
            this.dragNodeSubNodes?.splice(dragNodeIndex, 1);
            const newValue = [...(this.value || []), dragNode];
            this.$emit('update:value', newValue);

            this.dragDropService?.stopDrag({
                node: dragNode
            });
        },
        onDrop(event: DragEvent) {
            if (this.droppableNodes) {
                event.preventDefault();
                const { dragNode, dragNodeIndex } = this;

                if (dragNode && dragNodeIndex != null && this.allowDrop(dragNode, null, this.dragNodeScope)) {
                    if (this.isSameTreeScope(this.dragNodeScope)) {
                        this.dragDropService?.stopDrag({
                            node: dragNode
                        });

                        return;
                    }

                    if (this.validateDrop) {
                        this.$emit('node-drop', {
                            originalEvent: event,
                            value: this.value,
                            dragNode: dragNode,
                            dropNode: null,
                            index: dragNodeIndex,
                            accept: () => {
                                this.processTreeDrop(dragNode, dragNodeIndex);
                            }
                        });
                    } else {
                        this.$emit('node-drop', {
                            originalEvent: event,
                            value: this.value,
                            dragNode: dragNode,
                            dropNode: null,
                            index: dragNodeIndex
                        });

                        this.processTreeDrop(dragNode, dragNodeIndex);
                    }
                }
            }
        }
    },
    computed: {
        filteredValue(): TreeNodeData[] {
            const filteredNodes: TreeNodeData[] = [];
            const searchFields = typeof this.filterBy === 'function' ? [this.filterBy] : this.filterBy.split(',');
            const filterText = this.filterValue.trim().toLocaleLowerCase(this.filterLocale);
            const strict = this.filterMode === 'strict';

            for (const node of this.value ?? []) {
                let _node = { ...node };
                let paramsWithoutNode = { searchFields, filterText, strict };

                if (
                    (strict && (this.findFilteredNodes(_node, paramsWithoutNode) || this.isFilterMatched(_node, paramsWithoutNode))) ||
                    (!strict && (this.isFilterMatched(_node, paramsWithoutNode) || this.findFilteredNodes(_node, paramsWithoutNode)))
                ) {
                    filteredNodes.push(_node);
                }
            }

            return filteredNodes;
        },
        valueToRender(): TreeNodeData[] | null {
            if (this.filterValue && this.filterValue.trim().length > 0) return this.filteredValue;
            else return this.value;
        },
        empty() {
            return !this.valueToRender || this.valueToRender.length === 0;
        },
        emptyMessageText() {
            return this.$primevue?.config.locale?.emptyMessage || '';
        },
        containerDataP() {
            return cn({
                loading: this.loading,
                scrollable: this.scrollHeight === 'flex'
            });
        },
        wrapperDataP() {
            return cn({
                scrollable: this.scrollHeight === 'flex'
            });
        }
    },
    components: {
        TreeNode,
        InputText,
        InputIcon,
        IconField,
        SearchIcon,
        SpinnerIcon
    }
});
</script>
