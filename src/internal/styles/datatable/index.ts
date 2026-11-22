export const style = /*css*/ `
    .rs-datatable {
        position: relative;
        display: block;
    }

    .rs-datatable-table {
        border-spacing: 0;
        border-collapse: separate;
        width: 100%;
    }

    .rs-datatable-scrollable > .rs-datatable-table-container {
        position: relative;
    }

    .rs-datatable-scrollable-table > .rs-datatable-thead {
        inset-block-start: 0;
        z-index: 1;
    }

    .rs-datatable-scrollable-table > .rs-datatable-frozen-tbody {
        position: sticky;
        z-index: 1;
    }

    .rs-datatable-scrollable-table > .rs-datatable-tfoot {
        inset-block-end: 0;
        z-index: 1;
    }

    .rs-datatable-scrollable .rs-datatable-frozen-column {
        position: sticky;
    }

    .rs-datatable-scrollable .rs-datatable-thead > tr > .rs-datatable-frozen-column {
        z-index: 1;
    }

    .rs-datatable-scrollable td.rs-datatable-frozen-column:not(:where(thead *)) {
        background: inherit;
    }

    .rs-datatable-scrollable > .rs-datatable-table-container > .rs-datatable-table > .rs-datatable-thead,
    .rs-datatable-scrollable > .rs-datatable-table-container > .rs-virtualscroller > .rs-datatable-table > .rs-datatable-thead {
        background: dt('datatable.header.cell.background');
    }

    .rs-datatable-scrollable > .rs-datatable-table-container > .rs-datatable-table > .rs-datatable-tfoot,
    .rs-datatable-scrollable > .rs-datatable-table-container > .rs-virtualscroller > .rs-datatable-table > .rs-datatable-tfoot {
        background: dt('datatable.footer.cell.background');
    }

    .rs-datatable-flex-scrollable {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .rs-datatable-flex-scrollable > .rs-datatable-table-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
    }

    .rs-datatable-scrollable-table > .rs-datatable-tbody > .rs-datatable-row-group-header {
        position: sticky;
        z-index: 1;
    }

    .rs-datatable-resizable-table > .rs-datatable-thead > tr > :is(th, td),
    .rs-datatable-resizable-table > .rs-datatable-tfoot > tr > td,
    .rs-datatable-resizable-table > .rs-datatable-tbody > tr > td {
        overflow: hidden;
        white-space: nowrap;
    }

    .rs-datatable-resizable-table > .rs-datatable-thead > tr > th.rs-datatable-resizable-column:not(.rs-datatable-frozen-column) {
        background-clip: padding-box;
        position: relative;
    }

    .rs-datatable-resizable-table-fit > .rs-datatable-thead:not([data-p-column-group="true"]) > tr > th.rs-datatable-resizable-column:last-child .rs-datatable-column-resizer {
        display: none;
    }

    .rs-datatable-column-resizer {
        display: block;
        position: absolute;
        inset-block-start: 0;
        inset-inline-end: 0;
        margin: 0;
        width: dt('datatable.column.resizer.width');
        height: 100%;
        padding: 0;
        cursor: col-resize;
        border: 1px solid transparent;
    }

    .rs-datatable-column-header-content {
        display: flex;
        align-items: center;
        gap: dt('datatable.header.cell.gap');
    }

    .rs-datatable-column-resize-indicator {
        width: dt('datatable.resize.indicator.width');
        position: absolute;
        z-index: 10;
        display: none;
        background: dt('datatable.resize.indicator.color');
    }

    .rs-datatable-row-reorder-indicator-up,
    .rs-datatable-row-reorder-indicator-down {
        position: absolute;
        display: none;
    }

    .rs-datatable-reorderable-column,
    .rs-datatable-reorderable-row-handle {
        cursor: move;
    }

    .rs-datatable-mask {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
    }

    .rs-datatable-inline-filter {
        display: flex;
        align-items: center;
        width: 100%;
        gap: dt('datatable.filter.inline.gap');
    }

    .rs-datatable-inline-filter .rs-datatable-filter-element-container {
        flex: 1 1 auto;
        width: 1%;
    }

    .rs-datatable-filter-overlay {
        background: dt('datatable.filter.overlay.select.background');
        color: dt('datatable.filter.overlay.select.color');
        border: 1px solid dt('datatable.filter.overlay.select.border.color');
        border-radius: dt('datatable.filter.overlay.select.border.radius');
        box-shadow: dt('datatable.filter.overlay.select.shadow');
        min-width: 12.5rem;
    }

    .rs-datatable-filter-constraint-list {
        margin: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        padding: dt('datatable.filter.constraint.list.padding');
        gap: dt('datatable.filter.constraint.list.gap');
    }

    .rs-datatable-filter-constraint {
        padding: dt('datatable.filter.constraint.padding');
        color: dt('datatable.filter.constraint.color');
        border-radius: dt('datatable.filter.constraint.border.radius');
        cursor: pointer;
        transition:
            background dt('datatable.transition.duration'),
            color dt('datatable.transition.duration'),
            border-color dt('datatable.transition.duration'),
            box-shadow dt('datatable.transition.duration');
    }

    .rs-datatable-filter-constraint-selected {
        background: dt('datatable.filter.constraint.selected.background');
        color: dt('datatable.filter.constraint.selected.color');
    }

    .rs-datatable-filter-constraint:not(.rs-datatable-filter-constraint-selected):not(.rs-disabled):hover {
        background: dt('datatable.filter.constraint.focus.background');
        color: dt('datatable.filter.constraint.focus.color');
    }

    .rs-datatable-filter-constraint:focus-visible {
        outline: 0 none;
        background: dt('datatable.filter.constraint.focus.background');
        color: dt('datatable.filter.constraint.focus.color');
    }

    .rs-datatable-filter-constraint-selected:focus-visible {
        outline: 0 none;
        background: dt('datatable.filter.constraint.selected.focus.background');
        color: dt('datatable.filter.constraint.selected.focus.color');
    }

    .rs-datatable-filter-constraint-separator {
        border-block-start: 1px solid dt('datatable.filter.constraint.separator.border.color');
    }

    .rs-datatable-popover-filter {
        display: inline-flex;
        margin-inline-start: auto;
    }

    .rs-datatable-filter-overlay-popover {
        background: dt('datatable.filter.overlay.popover.background');
        color: dt('datatable.filter.overlay.popover.color');
        border: 1px solid dt('datatable.filter.overlay.popover.border.color');
        border-radius: dt('datatable.filter.overlay.popover.border.radius');
        box-shadow: dt('datatable.filter.overlay.popover.shadow');
        min-width: 12.5rem;
        padding: dt('datatable.filter.overlay.popover.padding');
        display: flex;
        flex-direction: column;
        gap: dt('datatable.filter.overlay.popover.gap');
    }

    .rs-datatable-filter-operator-dropdown {
        width: 100%;
    }

    .rs-datatable-filter-rule-list,
    .rs-datatable-filter-rule {
        display: flex;
        flex-direction: column;
        gap: dt('datatable.filter.overlay.popover.gap');
    }

    .rs-datatable-filter-rule {
        border-block-end: 1px solid dt('datatable.filter.rule.border.color');
        padding-bottom: dt('datatable.filter.overlay.popover.gap');
    }

    .rs-datatable-filter-rule:last-child {
        border-block-end: 0 none;
        padding-bottom: 0;
    }

    .rs-datatable-filter-add-rule-button {
        width: 100%;
    }

    .rs-datatable-filter-remove-rule-button {
        width: 100%;
    }

    .rs-datatable-filter-buttonbar {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .rs-datatable-virtualscroller-spacer {
        display: flex;
    }

    .rs-datatable .rs-virtualscroller .rs-virtualscroller-loading {
        transform: none !important;
        min-height: 0;
        position: sticky;
        inset-block-start: 0;
        inset-inline-start: 0;
    }

    .rs-datatable-paginator-top {
        border-color: dt('datatable.paginator.top.border.color');
        border-style: solid;
        border-width: dt('datatable.paginator.top.border.width');
    }

    .rs-datatable-paginator-bottom {
        border-color: dt('datatable.paginator.bottom.border.color');
        border-style: solid;
        border-width: dt('datatable.paginator.bottom.border.width');
    }

    .rs-datatable-header {
        background: dt('datatable.header.background');
        color: dt('datatable.header.color');
        border-color: dt('datatable.header.border.color');
        border-style: solid;
        border-width: dt('datatable.header.border.width');
        padding: dt('datatable.header.padding');
    }

    .rs-datatable-footer {
        background: dt('datatable.footer.background');
        color: dt('datatable.footer.color');
        border-color: dt('datatable.footer.border.color');
        border-style: solid;
        border-width: dt('datatable.footer.border.width');
        padding: dt('datatable.footer.padding');
    }

    .rs-datatable-header-cell {
        padding: dt('datatable.header.cell.padding');
        background: dt('datatable.header.cell.background');
        border-color: dt('datatable.header.cell.border.color');
        border-style: solid;
        border-width: 0 0 1px 0;
        color: dt('datatable.header.cell.color');
        font-weight: normal;
        text-align: start;
        transition:
            background dt('datatable.transition.duration'),
            color dt('datatable.transition.duration'),
            border-color dt('datatable.transition.duration'),
            outline-color dt('datatable.transition.duration'),
            box-shadow dt('datatable.transition.duration');
    }

    .rs-datatable-column-title {
        font-weight: dt('datatable.column.title.font.weight');
    }

    .rs-datatable-tbody > tr {
        outline-color: transparent;
        background: dt('datatable.row.background');
        color: dt('datatable.row.color');
        transition:
            background dt('datatable.transition.duration'),
            color dt('datatable.transition.duration'),
            border-color dt('datatable.transition.duration'),
            outline-color dt('datatable.transition.duration'),
            box-shadow dt('datatable.transition.duration');
    }

    .rs-datatable-tbody > tr > td {
        text-align: start;
        border-color: dt('datatable.body.cell.border.color');
        border-style: solid;
        border-width: 0 0 1px 0;
        padding: dt('datatable.body.cell.padding');
    }

    .rs-datatable-hoverable .rs-datatable-tbody > tr:not(.rs-datatable-row-selected):hover {
        background: dt('datatable.row.hover.background');
        color: dt('datatable.row.hover.color');
    }

    .rs-datatable-tbody > tr.rs-datatable-row-selected {
        background: dt('datatable.row.selected.background');
        color: dt('datatable.row.selected.color');
    }

    .rs-datatable-tbody > tr:has(+ .rs-datatable-row-selected) > td {
        border-block-end-color: dt('datatable.body.cell.selected.border.color');
    }

    .rs-datatable-tbody > tr.rs-datatable-row-selected > td {
        border-block-end-color: dt('datatable.body.cell.selected.border.color');
    }

    .rs-datatable-tbody > tr:focus-visible,
    .rs-datatable-tbody > tr.rs-datatable-contextmenu-row-selected {
        box-shadow: dt('datatable.row.focus.ring.shadow');
        outline: dt('datatable.row.focus.ring.width') dt('datatable.row.focus.ring.style') dt('datatable.row.focus.ring.color');
        outline-offset: dt('datatable.row.focus.ring.offset');
    }

    .rs-datatable-tfoot > tr > td {
        text-align: start;
        padding: dt('datatable.footer.cell.padding');
        border-color: dt('datatable.footer.cell.border.color');
        border-style: solid;
        border-width: 0 0 1px 0;
        color: dt('datatable.footer.cell.color');
        background: dt('datatable.footer.cell.background');
    }

    .rs-datatable-column-footer {
        font-weight: dt('datatable.column.footer.font.weight');
    }

    .rs-datatable-sortable-column {
        cursor: pointer;
        user-select: none;
        outline-color: transparent;
    }

    .rs-datatable-column-title,
    .rs-datatable-sort-icon,
    .rs-datatable-sort-badge {
        vertical-align: middle;
    }

    .rs-datatable-sort-icon {
        color: dt('datatable.sort.icon.color');
        font-size: dt('datatable.sort.icon.size');
        width: dt('datatable.sort.icon.size');
        height: dt('datatable.sort.icon.size');
        transition: color dt('datatable.transition.duration');
    }

    .rs-datatable-sortable-column:not(.rs-datatable-column-sorted):hover {
        background: dt('datatable.header.cell.hover.background');
        color: dt('datatable.header.cell.hover.color');
    }

    .rs-datatable-sortable-column:not(.rs-datatable-column-sorted):hover .rs-datatable-sort-icon {
        color: dt('datatable.sort.icon.hover.color');
    }

    .rs-datatable-column-sorted {
        background: dt('datatable.header.cell.selected.background');
        color: dt('datatable.header.cell.selected.color');
    }

    .rs-datatable-column-sorted .rs-datatable-sort-icon {
        color: dt('datatable.header.cell.selected.color');
    }

    .rs-datatable-sortable-column:focus-visible {
        box-shadow: dt('datatable.header.cell.focus.ring.shadow');
        outline: dt('datatable.header.cell.focus.ring.width') dt('datatable.header.cell.focus.ring.style') dt('datatable.header.cell.focus.ring.color');
        outline-offset: dt('datatable.header.cell.focus.ring.offset');
    }

    .rs-datatable-hoverable .rs-datatable-selectable-row {
        cursor: pointer;
    }

    .rs-datatable-tbody > tr.rs-datatable-dragpoint-top > td {
        box-shadow: inset 0 2px 0 0 dt('datatable.drop.point.color');
    }

    .rs-datatable-tbody > tr.rs-datatable-dragpoint-bottom > td {
        box-shadow: inset 0 -2px 0 0 dt('datatable.drop.point.color');
    }

    .rs-datatable-loading-icon {
        font-size: dt('datatable.loading.icon.size');
        width: dt('datatable.loading.icon.size');
        height: dt('datatable.loading.icon.size');
    }

    .rs-datatable-gridlines .rs-datatable-header {
        border-width: 1px 1px 0 1px;
    }

    .rs-datatable-gridlines .rs-datatable-footer {
        border-width: 0 1px 1px 1px;
    }

    .rs-datatable-gridlines .rs-datatable-paginator-top {
        border-width: 1px 1px 0 1px;
    }

    .rs-datatable-gridlines .rs-datatable-paginator-bottom {
        border-width: 0 1px 1px 1px;
    }

    .rs-datatable-gridlines .rs-datatable-thead > tr > :is(th, td) {
        border-width: 1px 0 1px 1px;
    }

    .rs-datatable-gridlines .rs-datatable-thead > tr > :is(th, td):last-child {
        border-width: 1px;
    }

    .rs-datatable-gridlines .rs-datatable-tbody > tr > td {
        border-width: 1px 0 0 1px;
    }

    .rs-datatable-gridlines .rs-datatable-tbody > tr > td:last-child {
        border-width: 1px 1px 0 1px;
    }

    .rs-datatable-gridlines .rs-datatable-tbody > tr:last-child > td {
        border-width: 1px 0 1px 1px;
    }

    .rs-datatable-gridlines .rs-datatable-tbody > tr:last-child > td:last-child {
        border-width: 1px;
    }

    .rs-datatable-gridlines .rs-datatable-tfoot > tr > td {
        border-width: 1px 0 1px 1px;
    }

    .rs-datatable-gridlines .rs-datatable-tfoot > tr > td:last-child {
        border-width: 1px 1px 1px 1px;
    }

    .rs-datatable.rs-datatable-gridlines .rs-datatable-thead + .rs-datatable-tfoot > tr > td {
        border-width: 0 0 1px 1px;
    }

    .rs-datatable.rs-datatable-gridlines .rs-datatable-thead + .rs-datatable-tfoot > tr > td:last-child {
        border-width: 0 1px 1px 1px;
    }

    .rs-datatable.rs-datatable-gridlines:has(.rs-datatable-thead):has(.rs-datatable-tbody) .rs-datatable-tbody > tr > td {
        border-width: 0 0 1px 1px;
    }

    .rs-datatable.rs-datatable-gridlines:has(.rs-datatable-thead):has(.rs-datatable-tbody) .rs-datatable-tbody > tr > td:last-child {
        border-width: 0 1px 1px 1px;
    }

    .rs-datatable.rs-datatable-gridlines:has(.rs-datatable-tbody):has(.rs-datatable-tfoot) .rs-datatable-tbody > tr:last-child > td {
        border-width: 0 0 0 1px;
    }

    .rs-datatable.rs-datatable-gridlines:has(.rs-datatable-tbody):has(.rs-datatable-tfoot) .rs-datatable-tbody > tr:last-child > td:last-child {
        border-width: 0 1px 0 1px;
    }

    .rs-datatable.rs-datatable-striped .rs-datatable-tbody > tr.rs-row-odd {
        background: dt('datatable.row.striped.background');
    }

    .rs-datatable.rs-datatable-striped .rs-datatable-tbody > tr.rs-row-odd.rs-datatable-row-selected {
        background: dt('datatable.row.selected.background');
        color: dt('datatable.row.selected.color');
    }

    .rs-datatable-striped.rs-datatable-hoverable .rs-datatable-tbody > tr:not(.rs-datatable-row-selected):hover {
        background: dt('datatable.row.hover.background');
        color: dt('datatable.row.hover.color');
    }

    .rs-datatable.rs-datatable-sm .rs-datatable-header {
        padding: dt('datatable.header.sm.padding');
    }

    .rs-datatable.rs-datatable-sm .rs-datatable-thead > tr > :is(th, td) {
        padding: dt('datatable.header.cell.sm.padding');
    }

    .rs-datatable.rs-datatable-sm .rs-datatable-tbody > tr > td {
        padding: dt('datatable.body.cell.sm.padding');
    }

    .rs-datatable.rs-datatable-sm .rs-datatable-tfoot > tr > td {
        padding: dt('datatable.footer.cell.sm.padding');
    }

    .rs-datatable.rs-datatable-sm .rs-datatable-footer {
        padding: dt('datatable.footer.sm.padding');
    }

    .rs-datatable.rs-datatable-lg .rs-datatable-header {
        padding: dt('datatable.header.lg.padding');
    }

    .rs-datatable.rs-datatable-lg .rs-datatable-thead > tr > :is(th, td) {
        padding: dt('datatable.header.cell.lg.padding');
    }

    .rs-datatable.rs-datatable-lg .rs-datatable-tbody > tr > td {
        padding: dt('datatable.body.cell.lg.padding');
    }

    .rs-datatable.rs-datatable-lg .rs-datatable-tfoot > tr > td {
        padding: dt('datatable.footer.cell.lg.padding');
    }

    .rs-datatable.rs-datatable-lg .rs-datatable-footer {
        padding: dt('datatable.footer.lg.padding');
    }

    .rs-datatable-row-toggle-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: dt('datatable.row.toggle.button.size');
        height: dt('datatable.row.toggle.button.size');
        color: dt('datatable.row.toggle.button.color');
        border: 0 none;
        background: transparent;
        cursor: pointer;
        border-radius: dt('datatable.row.toggle.button.border.radius');
        transition:
            background dt('datatable.transition.duration'),
            color dt('datatable.transition.duration'),
            border-color dt('datatable.transition.duration'),
            outline-color dt('datatable.transition.duration'),
            box-shadow dt('datatable.transition.duration');
        outline-color: transparent;
        user-select: none;
    }

    .rs-datatable-row-toggle-button:enabled:hover {
        color: dt('datatable.row.toggle.button.hover.color');
        background: dt('datatable.row.toggle.button.hover.background');
    }

    .rs-datatable-tbody > tr.rs-datatable-row-selected .rs-datatable-row-toggle-button:hover {
        background: dt('datatable.row.toggle.button.selected.hover.background');
        color: dt('datatable.row.toggle.button.selected.hover.color');
    }

    .rs-datatable-row-toggle-button:focus-visible {
        box-shadow: dt('datatable.row.toggle.button.focus.ring.shadow');
        outline: dt('datatable.row.toggle.button.focus.ring.width') dt('datatable.row.toggle.button.focus.ring.style') dt('datatable.row.toggle.button.focus.ring.color');
        outline-offset: dt('datatable.row.toggle.button.focus.ring.offset');
    }

    .rs-datatable-row-toggle-icon:dir(rtl) {
        transform: rotate(180deg);
    }
`;
