import { style } from '../../internal/styles/organizationchart/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-organizationchart rs-component',
    table: 'rs-organizationchart-table',
    node: ({ instance }) => ['rs-organizationchart-node', { 'rs-organizationchart-node-selectable': instance.selectable, 'rs-organizationchart-node-selected': instance.selected }],
    nodeToggleButton: ({ instance }) => ['rs-organizationchart-node-toggle-button', { 'rs-disabled': !instance.selectable }],
    nodeToggleButtonIcon: 'rs-organizationchart-node-toggle-button-icon',
    connectors: 'rs-organizationchart-connectors',
    connectorDown: 'rs-organizationchart-connector-down',
    connectorLeft: ({ index }) => ['rs-organizationchart-connector-left', { 'rs-organizationchart-connector-top': !(index === 0) }],
    connectorRight: ({ props, index }) => ['rs-organizationchart-connector-right', { 'rs-organizationchart-connector-top': !(index === props.node.children.length - 1) }],
    nodeChildren: 'rs-organizationchart-node-children'
};

export default BaseStyle.extend({
    name: 'organizationchart',
    style,
    classes
});
