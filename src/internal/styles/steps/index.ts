export const style = /*css*/ `
    .rs-steps {
        position: relative;
    }

    .rs-steps-list {
        padding: 0;
        margin: 0;
        list-style-type: none;
        display: flex;
    }

    .rs-steps-item {
        position: relative;
        display: flex;
        justify-content: center;
        flex: 1 1 auto;
    }

    .rs-steps-item.rs-disabled,
    .rs-steps-item.rs-disabled * {
        opacity: 1;
        pointer-events: auto;
        user-select: auto;
        cursor: auto;
    }

    .rs-steps-item:before {
        content: ' ';
        border-top: 2px solid dt('steps.separator.background');
        width: 100%;
        top: 50%;
        left: 0;
        display: block;
        position: absolute;
        margin-top: calc(-1rem + 1px);
    }

    .rs-steps-item:first-child::before {
        width: calc(50% + 1rem);
        transform: translateX(100%);
    }

    .rs-steps-item:last-child::before {
        width: 50%;
    }

    .rs-steps-item-link {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        text-decoration: none;
        transition:
            outline-color dt('steps.transition.duration'),
            box-shadow dt('steps.transition.duration');
        border-radius: dt('steps.item.link.border.radius');
        outline-color: transparent;
        gap: dt('steps.item.link.gap');
    }

    .rs-steps-item-link:not(.rs-disabled):focus-visible {
        box-shadow: dt('steps.item.link.focus.ring.shadow');
        outline: dt('steps.item.link.focus.ring.width') dt('steps.item.link.focus.ring.style') dt('steps.item.link.focus.ring.color');
        outline-offset: dt('steps.item.link.focus.ring.offset');
    }

    .rs-steps-item-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        color: dt('steps.item.label.color');
        display: block;
        font-weight: dt('steps.item.label.font.weight');
    }

    .rs-steps-item-number {
        display: flex;
        align-items: center;
        justify-content: center;
        color: dt('steps.item.number.color');
        border: 2px solid dt('steps.item.number.border.color');
        background: dt('steps.item.number.background');
        min-width: dt('steps.item.number.size');
        height: dt('steps.item.number.size');
        line-height: dt('steps.item.number.size');
        font-size: dt('steps.item.number.font.size');
        z-index: 1;
        border-radius: dt('steps.item.number.border.radius');
        position: relative;
        font-weight: dt('steps.item.number.font.weight');
    }

    .rs-steps-item-number::after {
        content: ' ';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: dt('steps.item.number.border.radius');
        box-shadow: dt('steps.item.number.shadow');
    }

    .rs-steps:not(.rs-readonly) .rs-steps-item {
        cursor: pointer;
    }

    .rs-steps-item-active .rs-steps-item-number {
        background: dt('steps.item.number.active.background');
        border-color: dt('steps.item.number.active.border.color');
        color: dt('steps.item.number.active.color');
    }

    .rs-steps-item-active .rs-steps-item-label {
        color: dt('steps.item.label.active.color');
    }
`;
