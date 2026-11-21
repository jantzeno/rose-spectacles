<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { TreeNode } from '../treenode/TreeNode';
import type { DragScope } from './TreeDragDropService';
import type { TreeExpandedKeys, TreeSelectionKeys } from './Tree';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TreeStyle from './style/TreeStyle';

export default defineComponent({
    name: 'BaseTree',
    extends: BaseComponent,
    props: {
        value: {
            type: Array as PropType<TreeNode[]>,
            default: null
        },
        expandedKeys: {
            type: Object as PropType<TreeExpandedKeys>,
            default: null
        },
        selectionKeys: {
            type: Object as PropType<TreeSelectionKeys>,
            default: null
        },
        selectionMode: {
            type: String,
            default: null
        },
        metaKeySelection: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        loadingIcon: {
            type: String,
            default: undefined
        },
        loadingMode: {
            type: String,
            default: 'mask'
        },
        filter: {
            type: Boolean,
            default: false
        },
        filterBy: {
            type: [String, Function] as PropType<string | ((node: TreeNode) => unknown)>,
            default: 'label'
        },
        filterMode: {
            type: String,
            default: 'lenient'
        },
        filterPlaceholder: {
            type: String,
            default: null
        },
        filterLocale: {
            type: String,
            default: undefined
        },
        highlightOnSelect: {
            type: Boolean,
            default: false
        },
        scrollHeight: {
            type: String,
            default: null
        },
        level: {
            type: Number,
            default: 0
        },
        draggableNodes: {
            type: Boolean,
            default: null
        },
        droppableNodes: {
            type: Boolean,
            default: null
        },
        draggableScope: {
            type: [String, Array] as PropType<DragScope>,
            default: null
        },
        droppableScope: {
            type: [String, Array] as PropType<DragScope>,
            default: null
        },
        validateDrop: {
            type: Boolean,
            default: false
        },
        ariaLabelledby: {
            type: String,
            default: null
        },
        ariaLabel: {
            type: String,
            default: null
        }
    },
    style: TreeStyle,
    provide() {
        return {
            $pcTree: this,
            $parentInstance: this
        };
    }
});
</script>
