export const style = /*css*/ `
    .rs-datepicker {
        display: inline-flex;
        max-width: 100%;
    }

    .rs-datepicker:has(.rs-datepicker-dropdown) .rs-datepicker-input {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .rs-datepicker-input {
        flex: 1 1 auto;
        width: 1%;
    }

    .rs-datepicker-dropdown {
        cursor: pointer;
        display: inline-flex;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: dt('datepicker.dropdown.width');
        border-start-end-radius: dt('datepicker.dropdown.border.radius');
        border-end-end-radius: dt('datepicker.dropdown.border.radius');
        background: dt('datepicker.dropdown.background');
        border: 1px solid dt('datepicker.dropdown.border.color');
        border-inline-start: 0 none;
        color: dt('datepicker.dropdown.color');
        transition:
            background dt('datepicker.transition.duration'),
            color dt('datepicker.transition.duration'),
            border-color dt('datepicker.transition.duration'),
            outline-color dt('datepicker.transition.duration');
        outline-color: transparent;
    }

    .rs-datepicker-dropdown:not(:disabled):hover {
        background: dt('datepicker.dropdown.hover.background');
        border-color: dt('datepicker.dropdown.hover.border.color');
        color: dt('datepicker.dropdown.hover.color');
    }

    .rs-datepicker-dropdown:not(:disabled):active {
        background: dt('datepicker.dropdown.active.background');
        border-color: dt('datepicker.dropdown.active.border.color');
        color: dt('datepicker.dropdown.active.color');
    }

    .rs-datepicker-dropdown:focus-visible {
        box-shadow: dt('datepicker.dropdown.focus.ring.shadow');
        outline: dt('datepicker.dropdown.focus.ring.width') dt('datepicker.dropdown.focus.ring.style') dt('datepicker.dropdown.focus.ring.color');
        outline-offset: dt('datepicker.dropdown.focus.ring.offset');
    }

    .rs-datepicker:has(.rs-datepicker-input-icon-container) {
        position: relative;
    }

    .rs-datepicker:has(.rs-datepicker-input-icon-container) .rs-datepicker-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-datepicker-input-icon-container {
        cursor: pointer;
        position: absolute;
        top: 50%;
        inset-inline-end: dt('form.field.padding.x');
        margin-block-start: calc(-1 * (dt('icon.size') / 2));
        color: dt('datepicker.input.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .rs-datepicker:has(.rs-datepicker-input:disabled) .rs-datepicker-input-icon-container {
        cursor: default;
    }

    .rs-datepicker-fluid {
        display: flex;
    }

    .rs-datepicker .rs-datepicker-panel {
        min-width: 100%;
    }

    .rs-datepicker-panel {
        width: auto;
        padding: dt('datepicker.panel.padding');
        background: dt('datepicker.panel.background');
        color: dt('datepicker.panel.color');
        border: 1px solid dt('datepicker.panel.border.color');
        border-radius: dt('datepicker.panel.border.radius');
        box-shadow: dt('datepicker.panel.shadow');
    }

    .rs-datepicker-panel-inline {
        display: inline-block;
        overflow-x: auto;
        box-shadow: none;
    }

    .rs-datepicker-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: dt('datepicker.header.padding');
        background: dt('datepicker.header.background');
        color: dt('datepicker.header.color');
        border-block-end: 1px solid dt('datepicker.header.border.color');
    }

    .rs-datepicker-next-button:dir(rtl) {
        order: -1;
    }

    .rs-datepicker-prev-button:dir(rtl) {
        order: 1;
    }

    .rs-datepicker-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: dt('datepicker.title.gap');
        font-weight: dt('datepicker.title.font.weight');
    }

    .rs-datepicker-select-year,
    .rs-datepicker-select-month {
        border: none;
        background: transparent;
        margin: 0;
        cursor: pointer;
        font-weight: inherit;
        transition:
            background dt('datepicker.transition.duration'),
            color dt('datepicker.transition.duration'),
            border-color dt('datepicker.transition.duration'),
            outline-color dt('datepicker.transition.duration'),
            box-shadow dt('datepicker.transition.duration');
    }

    .rs-datepicker-select-month {
        padding: dt('datepicker.select.month.padding');
        color: dt('datepicker.select.month.color');
        border-radius: dt('datepicker.select.month.border.radius');
    }

    .rs-datepicker-select-year {
        padding: dt('datepicker.select.year.padding');
        color: dt('datepicker.select.year.color');
        border-radius: dt('datepicker.select.year.border.radius');
    }

    .rs-datepicker-select-month:enabled:hover {
        background: dt('datepicker.select.month.hover.background');
        color: dt('datepicker.select.month.hover.color');
    }

    .rs-datepicker-select-year:enabled:hover {
        background: dt('datepicker.select.year.hover.background');
        color: dt('datepicker.select.year.hover.color');
    }

    .rs-datepicker-select-month:focus-visible,
    .rs-datepicker-select-year:focus-visible {
        box-shadow: dt('datepicker.date.focus.ring.shadow');
        outline: dt('datepicker.date.focus.ring.width') dt('datepicker.date.focus.ring.style') dt('datepicker.date.focus.ring.color');
        outline-offset: dt('datepicker.date.focus.ring.offset');
    }

    .rs-datepicker-calendar-container {
        display: flex;
    }

    .rs-datepicker-calendar-container .rs-datepicker-calendar {
        flex: 1 1 auto;
        border-inline-start: 1px solid dt('datepicker.group.border.color');
        padding-inline-end: dt('datepicker.group.gap');
        padding-inline-start: dt('datepicker.group.gap');
    }

    .rs-datepicker-calendar-container .rs-datepicker-calendar:first-child {
        padding-inline-start: 0;
        border-inline-start: 0 none;
    }

    .rs-datepicker-calendar-container .rs-datepicker-calendar:last-child {
        padding-inline-end: 0;
    }

    .rs-datepicker-day-view {
        width: 100%;
        border-collapse: collapse;
        font-size: 1rem;
        margin: dt('datepicker.day.view.margin');
    }

    .rs-datepicker-weekday-cell {
        padding: dt('datepicker.week.day.padding');
    }

    .rs-datepicker-weekday {
        font-weight: dt('datepicker.week.day.font.weight');
        color: dt('datepicker.week.day.color');
    }

    .rs-datepicker-day-cell {
        padding: dt('datepicker.date.padding');
    }

    .rs-datepicker-day {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin: 0 auto;
        overflow: hidden;
        position: relative;
        width: dt('datepicker.date.width');
        height: dt('datepicker.date.height');
        border-radius: dt('datepicker.date.border.radius');
        transition:
            background dt('datepicker.transition.duration'),
            color dt('datepicker.transition.duration'),
            border-color dt('datepicker.transition.duration'),
            box-shadow dt('datepicker.transition.duration'),
            outline-color dt('datepicker.transition.duration');
        border: 1px solid transparent;
        outline-color: transparent;
        color: dt('datepicker.date.color');
    }

    .rs-datepicker-day:not(.rs-datepicker-day-selected):not(.rs-disabled):hover {
        background: dt('datepicker.date.hover.background');
        color: dt('datepicker.date.hover.color');
    }

    .rs-datepicker-day:focus-visible {
        box-shadow: dt('datepicker.date.focus.ring.shadow');
        outline: dt('datepicker.date.focus.ring.width') dt('datepicker.date.focus.ring.style') dt('datepicker.date.focus.ring.color');
        outline-offset: dt('datepicker.date.focus.ring.offset');
    }

    .rs-datepicker-day-selected {
        background: dt('datepicker.date.selected.background');
        color: dt('datepicker.date.selected.color');
    }

    .rs-datepicker-day-selected-range {
        background: dt('datepicker.date.range.selected.background');
        color: dt('datepicker.date.range.selected.color');
    }

    .rs-datepicker-today > .rs-datepicker-day {
        background: dt('datepicker.today.background');
        color: dt('datepicker.today.color');
    }

    .rs-datepicker-today > .rs-datepicker-day-selected {
        background: dt('datepicker.date.selected.background');
        color: dt('datepicker.date.selected.color');
    }

    .rs-datepicker-today > .rs-datepicker-day-selected-range {
        background: dt('datepicker.date.range.selected.background');
        color: dt('datepicker.date.range.selected.color');
    }

    .rs-datepicker-weeknumber {
        text-align: center;
    }

    .rs-datepicker-month-view {
        margin: dt('datepicker.month.view.margin');
    }

    .rs-datepicker-month {
        width: 33.3%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        padding: dt('datepicker.month.padding');
        transition:
            background dt('datepicker.transition.duration'),
            color dt('datepicker.transition.duration'),
            border-color dt('datepicker.transition.duration'),
            box-shadow dt('datepicker.transition.duration'),
            outline-color dt('datepicker.transition.duration');
        border-radius: dt('datepicker.month.border.radius');
        outline-color: transparent;
        color: dt('datepicker.date.color');
    }

    .rs-datepicker-month:not(.rs-disabled):not(.rs-datepicker-month-selected):hover {
        color: dt('datepicker.date.hover.color');
        background: dt('datepicker.date.hover.background');
    }

    .rs-datepicker-month-selected {
        color: dt('datepicker.date.selected.color');
        background: dt('datepicker.date.selected.background');
    }

    .rs-datepicker-month:not(.rs-disabled):focus-visible {
        box-shadow: dt('datepicker.date.focus.ring.shadow');
        outline: dt('datepicker.date.focus.ring.width') dt('datepicker.date.focus.ring.style') dt('datepicker.date.focus.ring.color');
        outline-offset: dt('datepicker.date.focus.ring.offset');
    }

    .rs-datepicker-year-view {
        margin: dt('datepicker.year.view.margin');
    }

    .rs-datepicker-year {
        width: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        padding: dt('datepicker.year.padding');
        transition:
            background dt('datepicker.transition.duration'),
            color dt('datepicker.transition.duration'),
            border-color dt('datepicker.transition.duration'),
            box-shadow dt('datepicker.transition.duration'),
            outline-color dt('datepicker.transition.duration');
        border-radius: dt('datepicker.year.border.radius');
        outline-color: transparent;
        color: dt('datepicker.date.color');
    }

    .rs-datepicker-year:not(.rs-disabled):not(.rs-datepicker-year-selected):hover {
        color: dt('datepicker.date.hover.color');
        background: dt('datepicker.date.hover.background');
    }

    .rs-datepicker-year-selected {
        color: dt('datepicker.date.selected.color');
        background: dt('datepicker.date.selected.background');
    }

    .rs-datepicker-year:not(.rs-disabled):focus-visible {
        box-shadow: dt('datepicker.date.focus.ring.shadow');
        outline: dt('datepicker.date.focus.ring.width') dt('datepicker.date.focus.ring.style') dt('datepicker.date.focus.ring.color');
        outline-offset: dt('datepicker.date.focus.ring.offset');
    }

    .rs-datepicker-buttonbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: dt('datepicker.buttonbar.padding');
        border-block-start: 1px solid dt('datepicker.buttonbar.border.color');
    }

    .rs-datepicker-buttonbar .rs-button {
        width: auto;
    }

    .rs-datepicker-time-picker {
        display: flex;
        justify-content: center;
        align-items: center;
        border-block-start: 1px solid dt('datepicker.time.picker.border.color');
        padding: 0;
        gap: dt('datepicker.time.picker.gap');
    }

    .rs-datepicker-calendar-container + .rs-datepicker-time-picker {
        padding: dt('datepicker.time.picker.padding');
    }

    .rs-datepicker-time-picker > div {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: dt('datepicker.time.picker.button.gap');
    }

    .rs-datepicker-time-picker span {
        font-size: 1rem;
    }

    .rs-datepicker-timeonly .rs-datepicker-time-picker {
        border-block-start: 0 none;
    }

    .rs-datepicker-time-picker:dir(rtl) {
        flex-direction: row-reverse;
    }

    .rs-datepicker:has(.rs-inputtext-sm) .rs-datepicker-dropdown {
        width: dt('datepicker.dropdown.sm.width');
    }

    .rs-datepicker:has(.rs-inputtext-sm) .rs-datepicker-dropdown .rs-icon,
    .rs-datepicker:has(.rs-inputtext-sm) .rs-datepicker-input-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .rs-datepicker:has(.rs-inputtext-lg) .rs-datepicker-dropdown {
        width: dt('datepicker.dropdown.lg.width');
    }

    .rs-datepicker:has(.rs-inputtext-lg) .rs-datepicker-dropdown .rs-icon,
    .rs-datepicker:has(.rs-inputtext-lg) .rs-datepicker-input-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .rs-datepicker-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        color: dt('form.field.icon.color');
        inset-inline-end: dt('form.field.padding.x');
    }

    .rs-datepicker:has(.rs-datepicker-dropdown) .rs-datepicker-clear-icon {
        inset-inline-end: calc(dt('datepicker.dropdown.width') + dt('form.field.padding.x'));
    }

    .rs-datepicker:has(.rs-datepicker-input-icon-container) .rs-datepicker-clear-icon {
        inset-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-datepicker:has(.rs-datepicker-clear-icon) .rs-datepicker-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-datepicker:has(.rs-datepicker-input-icon-container):has(.rs-datepicker-clear-icon) .rs-datepicker-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 3) + calc(dt('icon.size') * 2));
    }

    .rs-inputgroup .rs-datepicker-dropdown {
        border-radius: 0;
    }

    .rs-inputgroup > .rs-datepicker:last-child:has(.rs-datepicker-dropdown) > .rs-datepicker-input {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .rs-inputgroup > .rs-datepicker:last-child .rs-datepicker-dropdown {
        border-start-end-radius: dt('datepicker.dropdown.border.radius');
        border-end-end-radius: dt('datepicker.dropdown.border.radius');
    }
`;
