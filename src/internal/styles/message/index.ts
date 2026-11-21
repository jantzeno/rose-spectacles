export const style = /*css*/ `
    .rs-message {
        display: grid;
        grid-template-rows: 1fr;
        border-radius: dt('message.border.radius');
        outline-width: dt('message.border.width');
        outline-style: solid;
    }

    .rs-message-content-wrapper {
        min-height: 0;
    }

    .rs-message-content {
        display: flex;
        align-items: center;
        padding: dt('message.content.padding');
        gap: dt('message.content.gap');
    }

    .rs-message-icon {
        flex-shrink: 0;
    }

    .rs-message-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-inline-start: auto;
        overflow: hidden;
        position: relative;
        width: dt('message.close.button.width');
        height: dt('message.close.button.height');
        border-radius: dt('message.close.button.border.radius');
        background: transparent;
        transition:
            background dt('message.transition.duration'),
            color dt('message.transition.duration'),
            outline-color dt('message.transition.duration'),
            box-shadow dt('message.transition.duration'),
            opacity 0.3s;
        outline-color: transparent;
        color: inherit;
        padding: 0;
        border: none;
        cursor: pointer;
        user-select: none;
    }

    .rs-message-close-icon {
        font-size: dt('message.close.icon.size');
        width: dt('message.close.icon.size');
        height: dt('message.close.icon.size');
    }

    .rs-message-close-button:focus-visible {
        outline-width: dt('message.close.button.focus.ring.width');
        outline-style: dt('message.close.button.focus.ring.style');
        outline-offset: dt('message.close.button.focus.ring.offset');
    }

    .rs-message-info {
        background: dt('message.info.background');
        outline-color: dt('message.info.border.color');
        color: dt('message.info.color');
        box-shadow: dt('message.info.shadow');
    }

    .rs-message-info .rs-message-close-button:focus-visible {
        outline-color: dt('message.info.close.button.focus.ring.color');
        box-shadow: dt('message.info.close.button.focus.ring.shadow');
    }

    .rs-message-info .rs-message-close-button:hover {
        background: dt('message.info.close.button.hover.background');
    }

    .rs-message-info.rs-message-outlined {
        color: dt('message.info.outlined.color');
        outline-color: dt('message.info.outlined.border.color');
    }

    .rs-message-info.rs-message-simple {
        color: dt('message.info.simple.color');
    }

    .rs-message-success {
        background: dt('message.success.background');
        outline-color: dt('message.success.border.color');
        color: dt('message.success.color');
        box-shadow: dt('message.success.shadow');
    }

    .rs-message-success .rs-message-close-button:focus-visible {
        outline-color: dt('message.success.close.button.focus.ring.color');
        box-shadow: dt('message.success.close.button.focus.ring.shadow');
    }

    .rs-message-success .rs-message-close-button:hover {
        background: dt('message.success.close.button.hover.background');
    }

    .rs-message-success.rs-message-outlined {
        color: dt('message.success.outlined.color');
        outline-color: dt('message.success.outlined.border.color');
    }

    .rs-message-success.rs-message-simple {
        color: dt('message.success.simple.color');
    }

    .rs-message-warn {
        background: dt('message.warn.background');
        outline-color: dt('message.warn.border.color');
        color: dt('message.warn.color');
        box-shadow: dt('message.warn.shadow');
    }

    .rs-message-warn .rs-message-close-button:focus-visible {
        outline-color: dt('message.warn.close.button.focus.ring.color');
        box-shadow: dt('message.warn.close.button.focus.ring.shadow');
    }

    .rs-message-warn .rs-message-close-button:hover {
        background: dt('message.warn.close.button.hover.background');
    }

    .rs-message-warn.rs-message-outlined {
        color: dt('message.warn.outlined.color');
        outline-color: dt('message.warn.outlined.border.color');
    }

    .rs-message-warn.rs-message-simple {
        color: dt('message.warn.simple.color');
    }

    .rs-message-error {
        background: dt('message.error.background');
        outline-color: dt('message.error.border.color');
        color: dt('message.error.color');
        box-shadow: dt('message.error.shadow');
    }

    .rs-message-error .rs-message-close-button:focus-visible {
        outline-color: dt('message.error.close.button.focus.ring.color');
        box-shadow: dt('message.error.close.button.focus.ring.shadow');
    }

    .rs-message-error .rs-message-close-button:hover {
        background: dt('message.error.close.button.hover.background');
    }

    .rs-message-error.rs-message-outlined {
        color: dt('message.error.outlined.color');
        outline-color: dt('message.error.outlined.border.color');
    }

    .rs-message-error.rs-message-simple {
        color: dt('message.error.simple.color');
    }

    .rs-message-secondary {
        background: dt('message.secondary.background');
        outline-color: dt('message.secondary.border.color');
        color: dt('message.secondary.color');
        box-shadow: dt('message.secondary.shadow');
    }

    .rs-message-secondary .rs-message-close-button:focus-visible {
        outline-color: dt('message.secondary.close.button.focus.ring.color');
        box-shadow: dt('message.secondary.close.button.focus.ring.shadow');
    }

    .rs-message-secondary .rs-message-close-button:hover {
        background: dt('message.secondary.close.button.hover.background');
    }

    .rs-message-secondary.rs-message-outlined {
        color: dt('message.secondary.outlined.color');
        outline-color: dt('message.secondary.outlined.border.color');
    }

    .rs-message-secondary.rs-message-simple {
        color: dt('message.secondary.simple.color');
    }

    .rs-message-contrast {
        background: dt('message.contrast.background');
        outline-color: dt('message.contrast.border.color');
        color: dt('message.contrast.color');
        box-shadow: dt('message.contrast.shadow');
    }

    .rs-message-contrast .rs-message-close-button:focus-visible {
        outline-color: dt('message.contrast.close.button.focus.ring.color');
        box-shadow: dt('message.contrast.close.button.focus.ring.shadow');
    }

    .rs-message-contrast .rs-message-close-button:hover {
        background: dt('message.contrast.close.button.hover.background');
    }

    .rs-message-contrast.rs-message-outlined {
        color: dt('message.contrast.outlined.color');
        outline-color: dt('message.contrast.outlined.border.color');
    }

    .rs-message-contrast.rs-message-simple {
        color: dt('message.contrast.simple.color');
    }

    .rs-message-text {
        font-size: dt('message.text.font.size');
        font-weight: dt('message.text.font.weight');
    }

    .rs-message-icon {
        font-size: dt('message.icon.size');
        width: dt('message.icon.size');
        height: dt('message.icon.size');
    }

    .rs-message-sm .rs-message-content {
        padding: dt('message.content.sm.padding');
    }

    .rs-message-sm .rs-message-text {
        font-size: dt('message.text.sm.font.size');
    }

    .rs-message-sm .rs-message-icon {
        font-size: dt('message.icon.sm.size');
        width: dt('message.icon.sm.size');
        height: dt('message.icon.sm.size');
    }

    .rs-message-sm .rs-message-close-icon {
        font-size: dt('message.close.icon.sm.size');
        width: dt('message.close.icon.sm.size');
        height: dt('message.close.icon.sm.size');
    }

    .rs-message-lg .rs-message-content {
        padding: dt('message.content.lg.padding');
    }

    .rs-message-lg .rs-message-text {
        font-size: dt('message.text.lg.font.size');
    }

    .rs-message-lg .rs-message-icon {
        font-size: dt('message.icon.lg.size');
        width: dt('message.icon.lg.size');
        height: dt('message.icon.lg.size');
    }

    .rs-message-lg .rs-message-close-icon {
        font-size: dt('message.close.icon.lg.size');
        width: dt('message.close.icon.lg.size');
        height: dt('message.close.icon.lg.size');
    }

    .rs-message-outlined {
        background: transparent;
        outline-width: dt('message.outlined.border.width');
    }

    .rs-message-simple {
        background: transparent;
        outline-color: transparent;
        box-shadow: none;
    }

    .rs-message-simple .rs-message-content {
        padding: dt('message.simple.content.padding');
    }

    .rs-message-outlined .rs-message-close-button:hover,
    .rs-message-simple .rs-message-close-button:hover {
        background: transparent;
    }

    .rs-message-enter-active {
        animation: rs-animate-message-enter 0.3s ease-out forwards;
        overflow: hidden;
    }

    .rs-message-leave-active {
        animation: rs-animate-message-leave 0.15s ease-in forwards;
        overflow: hidden;
    }

    @keyframes rs-animate-message-enter {
        from {
            opacity: 0;
            grid-template-rows: 0fr;
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

    @keyframes rs-animate-message-leave {
        from {
            opacity: 1;
            grid-template-rows: 1fr;
        }
        to {
            opacity: 0;
            margin: 0;
            grid-template-rows: 0fr;
        }
    }
`;
