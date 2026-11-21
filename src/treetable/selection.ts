import type { TreeNode } from '../treenode/TreeNode';

interface CheckboxState {
    checked: boolean;
    partialChecked: boolean;
}

export type TreeTableSelection = Record<string, boolean | CheckboxState>;

export interface TreeTableCheckboxChange {
    node: TreeNode;
    check: boolean;
    selectionKeys: TreeTableSelection;
}
