/**
 *
 * OrganizationChart visualizes hierarchical organization data.
 *
 * [Live Demo](https://openvue.dev/organizationchart)
 *
 * @module organizationchartstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum OrganizationChartClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-organizationchart',
    /**
     * Class name of the table element
     */
    table = 'rs-organizationchart-table',
    /**
     * Class name of the node element
     */
    node = 'rs-organizationchart-node',
    /**
     * Class name of the node toggle button element
     */
    nodeToggleButton = 'rs-organizationchart-node-toggle-button',
    /**
     * Class name of the node toggle button icon element
     */
    nodeToggleButtonIcon = 'rs-organizationchart-node-toggle-button-icon',
    /**
     * Class name of the connectors element
     */
    connectors = 'rs-organizationchart-connectors',
    /**
     * Class name of the connector down element
     */
    connectorDown = 'rs-organizationchart-connector-down',
    /**
     * Class name of the connector left element
     */
    connectorLeft = 'rs-organizationchart-connector-left',
    /**
     * Class name of the connector right element
     */
    connectorRight = 'rs-organizationchart-connector-right',
    /**
     * Class name of the node children element
     */
    nodeChildren = 'rs-organizationchart-node-children'
}

export interface OrganizationChartStyle extends BaseStyle {}

declare const style: OrganizationChartStyle;
export default style;
