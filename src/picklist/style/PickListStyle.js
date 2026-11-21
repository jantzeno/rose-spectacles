import { style } from '../../internal/styles/picklist/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-picklist rs-component',
    sourceControls: 'rs-picklist-controls rs-picklist-source-controls',
    sourceListContainer: 'rs-picklist-list-container rs-picklist-source-list-container',
    transferControls: 'rs-picklist-controls rs-picklist-transfer-controls',
    targetListContainer: 'rs-picklist-list-container rs-picklist-target-list-container',
    targetControls: 'rs-picklist-controls rs-picklist-target-controls'
};

export default BaseStyle.extend({
    name: 'picklist',
    style,
    classes
});
