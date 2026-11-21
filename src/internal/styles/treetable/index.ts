export const style = /*css*/ `
    .rs-treetable {
        position: relative;
    }

    .rs-treetable-table {
        border-spacing: 0;
        border-collapse: separate;
        width: 100%;
    }

    .rs-treetable-scrollable > .rs-treetable-table-container {
        position: relative;
    }

    .rs-treetable-scrollable-table > .rs-treetable-thead {
        inset-block-start: 0;
        z-index: 1;
    }

    .rs-treetable-scrollable-table > .rs-treetable-frozen-tbody {
        position: sticky;
        z-index: 1;
    }

    .rs-treetable-scrollable-table > .rs-treetable-tfoot {
        inset-block-end: 0;
        z-index: 1;
    }

    .rs-treetable-scrollable .rs-treetable-frozen-column {
        position: sticky;
        background: dt('treetable.header.cell.background');
    }

    .rs-treetable-scrollable th.rs-treetable-frozen-column {
        z-index: 1;
    }

    .rs-treetable-scrollable > .rs-treetable-table-container > .rs-treetable-table > .rs-treetable-thead {
        background: dt('treetable.header.cell.background');
    }

    .rs-treetable-scrollable > .rs-treetable-table-container > .rs-treetable-table > .rs-treetable-tfoot {
        background: dt('treetable.footer.cell.background');
    }

    .rs-treetable-flex-scrollable {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .rs-treetable-flex-scrollable > .rs-treetable-table-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
    }

    .rs-treetable-scrollable-table > .rs-treetable-tbody > .rs-treetable-row-group-header {
        position: sticky;
        z-index: 1;
    }

    .rs-treetable-resizable-table > .rs-treetable-thead > tr > th,
    .rs-treetable-resizable-table > .rs-treetable-tfoot > tr > td,
    .rs-treetable-resizable-table > .rs-treetable-tbody > tr > td {
        overflow: hidden;
        white-space: nowrap;
    }

    .rs-treetable-resizable-table > .rs-treetable-thead > tr > th.rs-treetable-resizable-column:not(.rs-treetable-frozen-column) {
        background-clip: padding-box;
        position: relative;
    }

    .rs-treetable-resizable-table-fit > .rs-treetable-thead > tr > th.rs-treetable-resizable-column:last-child .rs-treetable-column-resizer {
        display: none;
    }

    .rs-treetable-column-resizer {
        display: block;
        position: absolute;
        inset-block-start: 0;
        inset-inline-end: 0;
        margin: 0;
        width: dt('treetable.column.resizer.width');
        height: 100%;
        padding: 0;
        cursor: col-resize;
        border: 1px solid transparent;
    }

    .rs-treetable-column-header-content {
        display: flex;
        align-items: center;
        gap: dt('treetable.header.cell.gap');
    }

    .rs-treetable-column-resize-indicator {
        width: dt('treetable.resize.indicator.width');
        position: absolute;
        z-index: 10;
        display: none;
        background: dt('treetable.resize.indicator.color');
    }

    .rs-treetable-mask {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
    }

    .rs-treetable-inline-filter {
        display: flex;
        align-items: center;
        width: 100%;
        gap: dt('treetable.filter.inline.gap');
    }

    .rs-treetable-inline-filter .rs-treetable-filter-element-container {
        flex: 1 1 auto;
        width: 1%;
    }

    .rs-treetable-filter-overlay {
        background: dt('treetable.filter.overlay.select.background');
        color: dt('treetable.filter.overlay.select.color');
        border: 1px solid dt('treetable.filter.overlay.select.border.color');
        border-radius: dt('treetable.filter.overlay.select.border.radius');
        box-shadow: dt('treetable.filter.overlay.select.shadow');
        min-width: 12.5rem;
    }

    .rs-treetable-filter-constraint-list {
        margin: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        padding: dt('treetable.filter.constraint.list.padding');
        gap: dt('treetable.filter.constraint.list.gap');
    }

    .rs-treetable-filter-constraint {
        padding: dt('treetable.filter.constraint.padding');
        color: dt('treetable.filter.constraint.color');
        border-radius: dt('treetable.filter.constraint.border.radius');
        cursor: pointer;
        transition:
            background dt('treetable.transition.duration'),
            color dt('treetable.transition.duration'),
            border-color dt('treetable.transition.duration'),
            box-shadow dt('treetable.transition.duration');
    }

    .rs-treetable-filter-constraint-selected {
        background: dt('treetable.filter.constraint.selected.background');
        color: dt('treetable.filter.constraint.selected.color');
    }

    .rs-treetable-filter-constraint:not(.rs-treetable-filter-constraint-selected):not(.rs-disabled):hover {
        background: dt('treetable.filter.constraint.focus.background');
        color: dt('treetable.filter.constraint.focus.color');
    }

    .rs-treetable-filter-constraint:focus-visible {
        outline: 0 none;
        background: dt('treetable.filter.constraint.focus.background');
        color: dt('treetable.filter.constraint.focus.color');
    }

    .rs-treetable-filter-constraint-selected:focus-visible {
        outline: 0 none;
        background: dt('treetable.filter.constraint.selected.focus.background');
        color: dt('treetable.filter.constraint.selected.focus.color');
    }

    .rs-treetable-filter-constraint-separator {
        border-block-start: 1px solid dt('treetable.filter.constraint.separator.border.color');
    }

    .rs-treetable-popover-filter {
        display: inline-flex;
        margin-inline-start: auto;
    }

    .rs-treetable-filter-overlay-popover {
        background: dt('treetable.filter.overlay.popover.background');
        color: dt('treetable.filter.overlay.popover.color');
        border: 1px solid dt('treetable.filter.overlay.popover.border.color');
        border-radius: dt('treetable.filter.overlay.popover.border.radius');
        box-shadow: dt('treetable.filter.overlay.popover.shadow');
        min-width: 12.5rem;
        padding: dt('treetable.filter.overlay.popover.padding');
        display: flex;
        flex-direction: column;
        gap: dt('treetable.filter.overlay.popover.gap');
    }

    .rs-treetable-filter-operator-dropdown {
        width: 100%;
    }

    .rs-treetable-filter-rule-list,
    .rs-treetable-filter-rule {
        display: flex;
        flex-direction: column;
        gap: dt('treetable.filter.overlay.popover.gap');
    }

    .rs-treetable-filter-rule {
        border-block-end: 1px solid dt('treetable.filter.rule.border.color');
        padding-bottom: dt('treetable.filter.overlay.popover.gap');
    }

    .rs-treetable-filter-rule:last-child {
        border-block-end: 0 none;
        padding-bottom: 0;
    }

    .rs-treetable-filter-add-rule-button {
        width: 100%;
    }

    .rs-treetable-filter-remove-rule-button {
        width: 100%;
    }

    .rs-treetable-filter-buttonbar {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .rs-treetable-paginator-top {
        border-color: dt('treetable.paginator.top.border.color');
        border-style: solid;
        border-width: dt('treetable.paginator.top.border.width');
    }

    .rs-treetable-paginator-bottom {
        border-color: dt('treetable.paginator.bottom.border.color');
        border-style: solid;
        border-width: dt('treetable.paginator.bottom.border.width');
    }

    .rs-treetable-header {
        background: dt('treetable.header.background');
        color: dt('treetable.header.color');
        border-color: dt('treetable.header.border.color');
        border-style: solid;
        border-width: dt('treetable.header.border.width');
        padding: dt('treetable.header.padding');
    }

    .rs-treetable-footer {
        background: dt('treetable.footer.background');
        color: dt('treetable.footer.color');
        border-color: dt('treetable.footer.border.color');
        border-style: solid;
        border-width: dt('treetable.footer.border.width');
        padding: dt('treetable.footer.padding');
    }

    .rs-treetable-header-cell {
        padding: dt('treetable.header.cell.padding');
        background: dt('treetable.header.cell.background');
        border-color: dt('treetable.header.cell.border.color');
        border-style: solid;
        border-width: 0 0 1px 0;
        color: dt('treetable.header.cell.color');
        font-weight: normal;
        text-align: start;
        transition:
            background dt('treetable.transition.duration'),
            color dt('treetable.transition.duration'),
            border-color dt('treetable.transition.duration'),
            outline-color dt('treetable.transition.duration'),
            box-shadow dt('treetable.transition.duration');
    }

    .rs-treetable-column-title {
        font-weight: dt('treetable.column.title.font.weight');
    }

    .rs-treetable-tbody > tr {
        outline-color: transparent;
        background: dt('treetable.row.background');
        color: dt('treetable.row.color');
        transition:
            background dt('treetable.transition.duration'),
            color dt('treetable.transition.duration'),
            border-color dt('treetable.transition.duration'),
            outline-color dt('treetable.transition.duration'),
            box-shadow dt('treetable.transition.duration');
    }

    .rs-treetable-tbody > tr > td {
        text-align: start;
        border-color: dt('treetable.body.cell.border.color');
        border-style: solid;
        border-width: 0 0 1px 0;
        padding: dt('treetable.body.cell.padding');
    }

    .rs-treetable-hoverable .rs-treetable-tbody > tr:not(.rs-treetable-row-selected):hover {
        background: dt('treetable.row.hover.background');
        color: dt('treetable.row.hover.color');
    }

    .rs-treetable-tbody > tr.rs-treetable-row-selected {
        background: dt('treetable.row.selected.background');
        color: dt('treetable.row.selected.color');
    }

    .rs-treetable-tbody > tr:has(+ .rs-treetable-row-selected) > td {
        border-block-end-color: dt('treetable.body.cell.selected.border.color');
    }

    .rs-treetable-tbody > tr.rs-treetable-row-selected > td {
        border-block-end-color: dt('treetable.body.cell.selected.border.color');
    }

    .rs-treetable-tbody > tr:focus-visible,
    .rs-treetable-tbody > tr.rs-treetable-contextmenu-row-selected {
        box-shadow: dt('treetable.row.focus.ring.shadow');
        outline: dt('treetable.row.focus.ring.width') dt('treetable.row.focus.ring.style') dt('treetable.row.focus.ring.color');
        outline-offset: dt('treetable.row.focus.ring.offset');
    }

    .rs-treetable-tfoot > tr > td {
        text-align: start;
        padding: dt('treetable.footer.cell.padding');
        border-color: dt('treetable.footer.cell.border.color');
        border-style: solid;
        border-width: 0 0 1px 0;
        color: dt('treetable.footer.cell.color');
        background: dt('treetable.footer.cell.background');
    }

    .rs-treetable-column-footer {
        font-weight: dt('treetable.column.footer.font.weight');
    }

    .rs-treetable-sortable-column {
        cursor: pointer;
        user-select: none;
        outline-color: transparent;
    }

    .rs-treetable-column-title,
    .rs-treetable-sort-icon,
    .rs-treetable-sort-badge {
        vertical-align: middle;
    }

    .rs-treetable-sort-icon {
        color: dt('treetable.sort.icon.color');
        font-size: dt('treetable.sort.icon.size');
        width: dt('treetable.sort.icon.size');
        height: dt('treetable.sort.icon.size');
        transition: color dt('treetable.transition.duration');
    }

    .rs-treetable-sortable-column:not(.rs-treetable-column-sorted):hover {
        background: dt('treetable.header.cell.hover.background');
        color: dt('treetable.header.cell.hover.color');
    }

    .rs-treetable-sortable-column:not(.rs-treetable-column-sorted):hover .rs-treetable-sort-icon {
        color: dt('treetable.sort.icon.hover.color');
    }

    .rs-treetable-column-sorted {
        background: dt('treetable.header.cell.selected.background');
        color: dt('treetable.header.cell.selected.color');
    }

    .rs-treetable-column-sorted .rs-treetable-sort-icon {
        color: dt('treetable.header.cell.selected.color');
    }

    .rs-treetable-sortable-column:focus-visible {
        box-shadow: dt('treetable.header.cell.focus.ring.shadow');
        outline: dt('treetable.header.cell.focus.ring.width') dt('treetable.header.cell.focus.ring.style') dt('treetable.header.cell.focus.ring.color');
        outline-offset: dt('treetable.header.cell.focus.ring.offset');
    }

    .rs-treetable-hoverable .rs-treetable-selectable-row {
        cursor: pointer;
    }

    .rs-treetable-loading-icon {
        font-size: dt('treetable.loading.icon.size');
        width: dt('treetable.loading.icon.size');
        height: dt('treetable.loading.icon.size');
    }

    .rs-treetable-gridlines .rs-treetable-header {
        border-width: 1px 1px 0 1px;
    }

    .rs-treetable-gridlines .rs-treetable-footer {
        border-width: 0 1px 1px 1px;
    }

    .rs-treetable-gridlines .rs-treetable-paginator-top {
        border-width: 1px 1px 0 1px;
    }

    .rs-treetable-gridlines .rs-treetable-paginator-bottom {
        border-width: 0 1px 1px 1px;
    }

    .rs-treetable-gridlines .rs-treetable-thead > tr > th {
        border-width: 1px 0 1px 1px;
    }

    .rs-treetable-gridlines .rs-treetable-thead > tr > th:last-child {
        border-width: 1px;
    }

    .rs-treetable-gridlines .rs-treetable-tbody > tr > td {
        border-width: 1px 0 0 1px;
    }

    .rs-treetable-gridlines .rs-treetable-tbody > tr > td:last-child {
        border-width: 1px 1px 0 1px;
    }

    .rs-treetable-gridlines .rs-treetable-tbody > tr:last-child > td {
        border-width: 1px 0 1px 1px;
    }

    .rs-treetable-gridlines .rs-treetable-tbody > tr:last-child > td:last-child {
        border-width: 1px;
    }

    .rs-treetable-gridlines .rs-treetable-tfoot > tr > td {
        border-width: 1px 0 1px 1px;
    }

    .rs-treetable-gridlines .rs-treetable-tfoot > tr > td:last-child {
        border-width: 1px 1px 1px 1px;
    }

    .rs-treetable.rs-treetable-gridlines .rs-treetable-thead + .rs-treetable-tfoot > tr > td {
        border-width: 0 0 1px 1px;
    }

    .rs-treetable.rs-treetable-gridlines .rs-treetable-thead + .rs-treetable-tfoot > tr > td:last-child {
        border-width: 0 1px 1px 1px;
    }

    .rs-treetable.rs-treetable-gridlines:has(.rs-treetable-thead):has(.rs-treetable-tbody) .rs-treetable-tbody > tr > td {
        border-width: 0 0 1px 1px;
    }

    .rs-treetable.rs-treetable-gridlines:has(.rs-treetable-thead):has(.rs-treetable-tbody) .rs-treetable-tbody > tr > td:last-child {
        border-width: 0 1px 1px 1px;
    }

    .rs-treetable.rs-treetable-gridlines:has(.rs-treetable-tbody):has(.rs-treetable-tfoot) .rs-treetable-tbody > tr:last-child > td {
        border-width: 0 0 0 1px;
    }

    .rs-treetable.rs-treetable-gridlines:has(.rs-treetable-tbody):has(.rs-treetable-tfoot) .rs-treetable-tbody > tr:last-child > td:last-child {
        border-width: 0 1px 0 1px;
    }

    .rs-treetable.rs-treetable-sm .rs-treetable-header {
        padding: 0.375rem 0.5rem;
    }

    .rs-treetable.rs-treetable-sm .rs-treetable-thead > tr > th {
        padding: 0.375rem 0.5rem;
    }

    .rs-treetable.rs-treetable-sm .rs-treetable-tbody > tr > td {
        padding: 0.375rem 0.5rem;
    }

    .rs-treetable.rs-treetable-sm .rs-treetable-tfoot > tr > td {
        padding: 0.375rem 0.5rem;
    }

    .rs-treetable.rs-treetable-sm .rs-treetable-footer {
        padding: 0.375rem 0.5rem;
    }

    .rs-treetable.rs-treetable-lg .rs-treetable-header {
        padding: 0.9375rem 1.25rem;
    }

    .rs-treetable.rs-treetable-lg .rs-treetable-thead > tr > th {
        padding: 0.9375rem 1.25rem;
    }

    .rs-treetable.rs-treetable-lg .rs-treetable-tbody > tr > td {
        padding: 0.9375rem 1.25rem;
    }

    .rs-treetable.rs-treetable-lg .rs-treetable-tfoot > tr > td {
        padding: 0.9375rem 1.25rem;
    }

    .rs-treetable.rs-treetable-lg .rs-treetable-footer {
        padding: 0.9375rem 1.25rem;
    }

    .rs-treetable-body-cell-content {
        display: flex;
        align-items: center;
        gap: dt('treetable.body.cell.gap');
    }

    .rs-treetable-tbody > tr.rs-treetable-row-selected .rs-treetable-node-toggle-button {
        color: inherit;
    }

    .rs-treetable-node-toggle-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: dt('treetable.node.toggle.button.size');
        height: dt('treetable.node.toggle.button.size');
        color: dt('treetable.node.toggle.button.color');
        border: 0 none;
        background: transparent;
        cursor: pointer;
        border-radius: dt('treetable.node.toggle.button.border.radius');
        transition:
            background dt('treetable.transition.duration'),
            color dt('treetable.transition.duration'),
            border-color dt('treetable.transition.duration'),
            outline-color dt('treetable.transition.duration'),
            box-shadow dt('treetable.transition.duration');
        outline-color: transparent;
        user-select: none;
    }

    .rs-treetable-node-toggle-button:enabled:hover {
        color: dt('treetable.node.toggle.button.hover.color');
        background: dt('treetable.node.toggle.button.hover.background');
    }

    .rs-treetable-tbody > tr.rs-treetable-row-selected .rs-treetable-node-toggle-button:hover {
        background: dt('treetable.node.toggle.button.selected.hover.background');
        color: dt('treetable.node.toggle.button.selected.hover.color');
    }

    .rs-treetable-node-toggle-button:focus-visible {
        box-shadow: dt('treetable.node.toggle.button.focus.ring.shadow');
        outline: dt('treetable.node.toggle.button.focus.ring.width') dt('treetable.node.toggle.button.focus.ring.style') dt('treetable.node.toggle.button.focus.ring.color');
        outline-offset: dt('treetable.node.toggle.button.focus.ring.offset');
    }

    .rs-treetable-node-toggle-icon:dir(rtl) {
        transform: rotate(180deg);
    }
`;
