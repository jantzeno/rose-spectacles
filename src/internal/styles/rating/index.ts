export const style = /*css*/ `
    .rs-rating {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: dt('rating.gap');
    }

    .rs-rating-option {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        outline-color: transparent;
        border-radius: 50%;
        transition:
            background dt('rating.transition.duration'),
            color dt('rating.transition.duration'),
            border-color dt('rating.transition.duration'),
            outline-color dt('rating.transition.duration'),
            box-shadow dt('rating.transition.duration');
    }

    .rs-rating-option.rs-focus-visible {
        box-shadow: dt('rating.focus.ring.shadow');
        outline: dt('rating.focus.ring.width') dt('rating.focus.ring.style') dt('rating.focus.ring.color');
        outline-offset: dt('rating.focus.ring.offset');
    }

    .rs-rating-icon {
        color: dt('rating.icon.color');
        transition:
            background dt('rating.transition.duration'),
            color dt('rating.transition.duration'),
            border-color dt('rating.transition.duration'),
            outline-color dt('rating.transition.duration'),
            box-shadow dt('rating.transition.duration');
        font-size: dt('rating.icon.size');
        width: dt('rating.icon.size');
        height: dt('rating.icon.size');
    }

    .rs-rating:not(.rs-disabled):not(.rs-readonly) .rs-rating-option:hover .rs-rating-icon {
        color: dt('rating.icon.hover.color');
    }

    .rs-rating-option-active .rs-rating-icon {
        color: dt('rating.icon.active.color');
    }

    .rs-rating-icon.rs-invalid {
        /* @todo */
        stroke: dt('rating.invalid.icon.color');
    }

    .rs-rating.rs-readonly .rs-rating-option {
        cursor: not-allowed;
    }
`;
