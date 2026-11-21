import { style } from '../../internal/styles/tree/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props, state }: StyleContext) => [
        'rs-tree rs-component',
        {
            'rs-tree-selectable': props.selectionMode != null,
            'rs-tree-loading': props.loading,
            'rs-tree-flex-scrollable': props.scrollHeight === 'flex',
            'rs-tree-node-dragover': state.dragHover
        }
    ],
    mask: 'rs-tree-mask rs-overlay-mask',
    loadingIcon: 'rs-tree-loading-icon',
    pcFilterContainer: 'rs-tree-filter',
    pcFilterInput: 'rs-tree-filter-input',
    wrapper: 'rs-tree-root', //TODO: discuss
    rootChildren: 'rs-tree-root-children',
    node: ({ instance }: StyleContext) => ['rs-tree-node', { 'rs-tree-node-leaf': instance.leaf }],
    nodeContent: ({ instance }: StyleContext) => [
        'rs-tree-node-content',
        instance.node.styleClass,
        {
            'rs-tree-node-selectable': instance.selectable,
            'rs-tree-node-selected': instance.checkboxMode && instance.$parentInstance.highlightOnSelect ? instance.checked : instance.selected,
            'rs-tree-node-dragover': instance.isNodeDropActive
        }
    ],
    nodeToggleButton: 'rs-tree-node-toggle-button',
    nodeToggleIcon: 'rs-tree-node-toggle-icon',
    nodeCheckbox: 'rs-tree-node-checkbox',
    nodeIcon: 'rs-tree-node-icon',
    nodeLabel: 'rs-tree-node-label',
    nodeChildren: 'rs-tree-node-children',
    emptyMessage: 'rs-tree-empty-message',
    dropPoint: 'rs-tree-node-drop-point'
};

export default BaseStyle.extend({
    name: 'tree',
    style,
    classes
});
