export const style = /*css*/ `
    .rs-inputnumber {
        display: inline-flex;
        position: relative;
    }

    .rs-inputnumber-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        cursor: pointer;
        background: dt('inputnumber.button.background');
        color: dt('inputnumber.button.color');
        width: dt('inputnumber.button.width');
        transition:
            background dt('inputnumber.transition.duration'),
            color dt('inputnumber.transition.duration'),
            border-color dt('inputnumber.transition.duration'),
            outline-color dt('inputnumber.transition.duration');
    }

    .rs-inputnumber-button:disabled {
        cursor: auto;
    }

    .rs-inputnumber-button:not(:disabled):hover {
        background: dt('inputnumber.button.hover.background');
        color: dt('inputnumber.button.hover.color');
    }

    .rs-inputnumber-button:not(:disabled):active {
        background: dt('inputnumber.button.active.background');
        color: dt('inputnumber.button.active.color');
    }

    .rs-inputnumber-stacked .rs-inputnumber-button {
        position: relative;
        flex: 1 1 auto;
        border: 0 none;
    }

    .rs-inputnumber-stacked .rs-inputnumber-button-group {
        display: flex;
        flex-direction: column;
        position: absolute;
        inset-block-start: 1px;
        inset-inline-end: 1px;
        height: calc(100% - 2px);
        z-index: 1;
    }

    .rs-inputnumber-stacked .rs-inputnumber-increment-button {
        padding: 0;
        border-start-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .rs-inputnumber-stacked .rs-inputnumber-decrement-button {
        padding: 0;
        border-end-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .rs-inputnumber-stacked .rs-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .rs-inputnumber-horizontal .rs-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
    }

    .rs-inputnumber-horizontal .rs-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .rs-inputnumber-horizontal .rs-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .rs-inputnumber-horizontal .rs-inputnumber-increment-button {
        order: 3;
        border-start-end-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        border-inline-start: 0 none;
    }

    .rs-inputnumber-horizontal .rs-inputnumber-input {
        order: 2;
        border-radius: 0;
    }

    .rs-inputnumber-horizontal .rs-inputnumber-decrement-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-inline-end: 0 none;
    }

    .rs-floatlabel:has(.rs-inputnumber-horizontal) label {
        margin-inline-start: dt('inputnumber.button.width');
    }

    .rs-inputnumber-vertical {
        flex-direction: column;
    }

    .rs-inputnumber-vertical .rs-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
        padding: dt('inputnumber.button.vertical.padding');
    }

    .rs-inputnumber-vertical .rs-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .rs-inputnumber-vertical .rs-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .rs-inputnumber-vertical .rs-inputnumber-increment-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-start-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-end: 0 none;
    }

    .rs-inputnumber-vertical .rs-inputnumber-input {
        order: 2;
        border-radius: 0;
        text-align: center;
    }

    .rs-inputnumber-vertical .rs-inputnumber-decrement-button {
        order: 3;
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-start: 0 none;
    }

    .rs-inputnumber-input {
        flex: 1 1 auto;
    }

    .rs-inputnumber-fluid {
        width: 100%;
    }

    .rs-inputnumber-fluid .rs-inputnumber-input {
        width: 1%;
    }

    .rs-inputnumber-fluid.rs-inputnumber-vertical .rs-inputnumber-input {
        width: 100%;
    }

    .rs-inputnumber:has(.rs-inputtext-sm) .rs-inputnumber-button .rs-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .rs-inputnumber:has(.rs-inputtext-lg) .rs-inputnumber-button .rs-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .rs-inputnumber-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    .rs-inputnumber:has(.rs-inputnumber-clear-icon) .rs-inputnumber-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-inputnumber-stacked .rs-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .rs-inputnumber-stacked:has(.rs-inputnumber-clear-icon) .rs-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + (dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-inputnumber-horizontal .rs-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }
`;
