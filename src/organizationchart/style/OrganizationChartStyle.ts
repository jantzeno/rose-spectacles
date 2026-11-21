import { style } from '../../internal/styles/organizationchart/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-organizationchart rs-component',
    table: 'rs-organizationchart-table',
    node: ({ instance }: StyleContext) => ['rs-organizationchart-node', { 'rs-organizationchart-node-selectable': instance.selectable, 'rs-organizationchart-node-selected': instance.selected }],
    nodeToggleButton: ({ instance }: StyleContext) => ['rs-organizationchart-node-toggle-button', { 'rs-disabled': !instance.selectable }],
    nodeToggleButtonIcon: 'rs-organizationchart-node-toggle-button-icon',
    connectors: 'rs-organizationchart-connectors',
    connectorDown: 'rs-organizationchart-connector-down',
    connectorLeft: ({ index }: StyleContext) => ['rs-organizationchart-connector-left', { 'rs-organizationchart-connector-top': !(index === 0) }],
    connectorRight: ({ props, index }: StyleContext) => ['rs-organizationchart-connector-right', { 'rs-organizationchart-connector-top': !(index === props.node.children.length - 1) }],
    nodeChildren: 'rs-organizationchart-node-children'
};

export default BaseStyle.extend({
    name: 'organizationchart',
    style,
    classes
});
