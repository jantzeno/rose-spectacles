export const style = /*css*/ `
    .rs-tree {
        display: block;
        background: dt('tree.background');
        color: dt('tree.color');
        padding: dt('tree.padding');
        position: relative;
    }

    .rs-tree-root-children,
    .rs-tree-node-children {
        display: flex;
        list-style-type: none;
        flex-direction: column;
        margin: 0;
        gap: dt('tree.gap');
    }

    .rs-tree-root-children {
        padding: 0;
        padding-block-start: dt('tree.gap');
    }

    .rs-tree-node-children {
        padding: 0;
        padding-block-start: dt('tree.gap');
        padding-inline-start: dt('tree.indent');
    }

    .rs-tree-node {
        padding: 0;
        outline: 0 none;
    }

    .rs-tree-node-content {
        border-radius: dt('tree.node.border.radius');
        padding: dt('tree.node.padding');
        display: flex;
        align-items: center;
        outline-color: transparent;
        color: dt('tree.node.color');
        gap: dt('tree.node.gap');
        transition:
            background dt('tree.transition.duration'),
            color dt('tree.transition.duration'),
            outline-color dt('tree.transition.duration'),
            box-shadow dt('tree.transition.duration');
    }

    .rs-tree-node-content[data-p-dragging] {
        outline: 1px dashed dt('primary.color');
        outline-offset: -1px;
    }

    .rs-tree-node-content[data-pc-section="drag-image"] {
        background: dt('tree.background');
    }

    .rs-tree-node:focus-visible > .rs-tree-node-content {
        box-shadow: dt('tree.node.focus.ring.shadow');
        outline: dt('tree.node.focus.ring.width') dt('tree.node.focus.ring.style') dt('tree.node.focus.ring.color');
        outline-offset: dt('tree.node.focus.ring.offset');
    }

    .rs-tree-node-content.rs-tree-node-selectable:not(.rs-tree-node-selected):hover {
        background: dt('tree.node.hover.background');
        color: dt('tree.node.hover.color');
    }

    .rs-tree-node-content.rs-tree-node-selectable:not(.rs-tree-node-selected):hover .rs-tree-node-icon {
        color: dt('tree.node.icon.hover.color');
    }

    .rs-tree-node-content.rs-tree-node-selected {
        background: dt('tree.node.selected.background');
        color: dt('tree.node.selected.color');
    }

    .rs-tree-node-content.rs-tree-node-selected .rs-tree-node-toggle-button {
        color: inherit;
    }

    .rs-tree-node-content.rs-tree-node-dragover {
        background: dt('tree.node.hover.background');
        color: dt('tree.node.hover.color');
    }

    .rs-tree-node-content:focus-visible,
    .rs-tree-node-content.rs-tree-node-contextmenu-selected {
        box-shadow: dt('tree.node.focus.ring.shadow');
        outline: dt('tree.node.focus.ring.width') dt('tree.node.focus.ring.style') dt('tree.node.focus.ring.color');
        outline-offset: dt('tree.node.focus.ring.offset');
    }

    .rs-tree-node-drop-point {
		outline: 1px solid dt('primary.color');
	}

    .rs-tree-node-toggle-button {
        cursor: pointer;
        user-select: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        flex-shrink: 0;
        width: dt('tree.node.toggle.button.size');
        height: dt('tree.node.toggle.button.size');
        color: dt('tree.node.toggle.button.color');
        border: 0 none;
        background: transparent;
        border-radius: dt('tree.node.toggle.button.border.radius');
        transition:
            background dt('tree.transition.duration'),
            color dt('tree.transition.duration'),
            border-color dt('tree.transition.duration'),
            outline-color dt('tree.transition.duration'),
            box-shadow dt('tree.transition.duration');
        outline-color: transparent;
        padding: 0;
    }

    .rs-tree-node-toggle-button:enabled:hover {
        background: dt('tree.node.toggle.button.hover.background');
        color: dt('tree.node.toggle.button.hover.color');
    }

    .rs-tree-node-content.rs-tree-node-selected .rs-tree-node-toggle-button:hover {
        background: dt('tree.node.toggle.button.selected.hover.background');
        color: dt('tree.node.toggle.button.selected.hover.color');
    }

    .rs-tree-root {
        overflow: auto;
    }

    .rs-tree-node-selectable {
        cursor: pointer;
        user-select: none;
    }

    .rs-tree-node-leaf > .rs-tree-node-content .rs-tree-node-toggle-button {
        visibility: hidden;
    }

    .rs-tree-node-icon {
        color: dt('tree.node.icon.color');
        transition: color dt('tree.transition.duration');
    }

    .rs-tree-node-content.rs-tree-node-selected .rs-tree-node-icon {
        color: dt('tree.node.icon.selected.color');
    }

    .rs-tree-filter {
        margin: dt('tree.filter.margin');
    }

    .rs-tree-filter-input {
        width: 100%;
    }

    .rs-tree-loading-icon {
        font-size: dt('tree.loading.icon.size');
        width: dt('tree.loading.icon.size');
        height: dt('tree.loading.icon.size');
    }

    .rs-tree .rs-tree-mask {
        position: absolute;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .rs-tree-flex-scrollable {
        display: flex;
        flex: 1;
        height: 100%;
        flex-direction: column;
    }

    .rs-tree-flex-scrollable .rs-tree-root {
        flex: 1;
    }
`;
