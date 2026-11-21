export const style = /*css*/ `
    .rs-toast {
        width: dt('toast.width');
        white-space: pre-line;
        word-break: break-word;
    }

    .rs-toast-message {
        margin: 0 0 1rem 0;
        display: grid;
        grid-template-rows: 1fr;
    }

    .rs-toast-message-icon {
        flex-shrink: 0;
        font-size: dt('toast.icon.size');
        width: dt('toast.icon.size');
        height: dt('toast.icon.size');
    }

    .rs-toast-message-content {
        display: flex;
        align-items: flex-start;
        padding: dt('toast.content.padding');
        gap: dt('toast.content.gap');
        min-height: 0;
        overflow: hidden;
        transition: padding 250ms ease-in;
    }

    .rs-toast-message-text {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        gap: dt('toast.text.gap');
    }

    .rs-toast-summary {
        font-weight: dt('toast.summary.font.weight');
        font-size: dt('toast.summary.font.size');
    }

    .rs-toast-detail {
        font-weight: dt('toast.detail.font.weight');
        font-size: dt('toast.detail.font.size');
    }

    .rs-toast-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        background: transparent;
        transition:
            background dt('toast.transition.duration'),
            color dt('toast.transition.duration'),
            outline-color dt('toast.transition.duration'),
            box-shadow dt('toast.transition.duration');
        outline-color: transparent;
        color: inherit;
        width: dt('toast.close.button.width');
        height: dt('toast.close.button.height');
        border-radius: dt('toast.close.button.border.radius');
        margin: -25% 0 0 0;
        right: -25%;
        padding: 0;
        border: none;
        user-select: none;
    }

    .rs-toast-close-button:dir(rtl) {
        margin: -25% 0 0 auto;
        left: -25%;
        right: auto;
    }

    .rs-toast-message-info,
    .rs-toast-message-success,
    .rs-toast-message-warn,
    .rs-toast-message-error,
    .rs-toast-message-secondary,
    .rs-toast-message-contrast {
        border-width: dt('toast.border.width');
        border-style: solid;
        -webkit-backdrop-filter: blur(dt('toast.blur'));
        backdrop-filter: blur(dt('toast.blur'));
        border-radius: dt('toast.border.radius');
    }

    .rs-toast-close-icon {
        font-size: dt('toast.close.icon.size');
        width: dt('toast.close.icon.size');
        height: dt('toast.close.icon.size');
    }

    .rs-toast-close-button:focus-visible {
        outline-width: dt('focus.ring.width');
        outline-style: dt('focus.ring.style');
        outline-offset: dt('focus.ring.offset');
    }

    .rs-toast-message-info {
        background: dt('toast.info.background');
        border-color: dt('toast.info.border.color');
        color: dt('toast.info.color');
        box-shadow: dt('toast.info.shadow');
    }

    .rs-toast-message-info .rs-toast-detail {
        color: dt('toast.info.detail.color');
    }

    .rs-toast-message-info .rs-toast-close-button:focus-visible {
        outline-color: dt('toast.info.close.button.focus.ring.color');
        box-shadow: dt('toast.info.close.button.focus.ring.shadow');
    }

    .rs-toast-message-info .rs-toast-close-button:hover {
        background: dt('toast.info.close.button.hover.background');
    }

    .rs-toast-message-success {
        background: dt('toast.success.background');
        border-color: dt('toast.success.border.color');
        color: dt('toast.success.color');
        box-shadow: dt('toast.success.shadow');
    }

    .rs-toast-message-success .rs-toast-detail {
        color: dt('toast.success.detail.color');
    }

    .rs-toast-message-success .rs-toast-close-button:focus-visible {
        outline-color: dt('toast.success.close.button.focus.ring.color');
        box-shadow: dt('toast.success.close.button.focus.ring.shadow');
    }

    .rs-toast-message-success .rs-toast-close-button:hover {
        background: dt('toast.success.close.button.hover.background');
    }

    .rs-toast-message-warn {
        background: dt('toast.warn.background');
        border-color: dt('toast.warn.border.color');
        color: dt('toast.warn.color');
        box-shadow: dt('toast.warn.shadow');
    }

    .rs-toast-message-warn .rs-toast-detail {
        color: dt('toast.warn.detail.color');
    }

    .rs-toast-message-warn .rs-toast-close-button:focus-visible {
        outline-color: dt('toast.warn.close.button.focus.ring.color');
        box-shadow: dt('toast.warn.close.button.focus.ring.shadow');
    }

    .rs-toast-message-warn .rs-toast-close-button:hover {
        background: dt('toast.warn.close.button.hover.background');
    }

    .rs-toast-message-error {
        background: dt('toast.error.background');
        border-color: dt('toast.error.border.color');
        color: dt('toast.error.color');
        box-shadow: dt('toast.error.shadow');
    }

    .rs-toast-message-error .rs-toast-detail {
        color: dt('toast.error.detail.color');
    }

    .rs-toast-message-error .rs-toast-close-button:focus-visible {
        outline-color: dt('toast.error.close.button.focus.ring.color');
        box-shadow: dt('toast.error.close.button.focus.ring.shadow');
    }

    .rs-toast-message-error .rs-toast-close-button:hover {
        background: dt('toast.error.close.button.hover.background');
    }

    .rs-toast-message-secondary {
        background: dt('toast.secondary.background');
        border-color: dt('toast.secondary.border.color');
        color: dt('toast.secondary.color');
        box-shadow: dt('toast.secondary.shadow');
    }

    .rs-toast-message-secondary .rs-toast-detail {
        color: dt('toast.secondary.detail.color');
    }

    .rs-toast-message-secondary .rs-toast-close-button:focus-visible {
        outline-color: dt('toast.secondary.close.button.focus.ring.color');
        box-shadow: dt('toast.secondary.close.button.focus.ring.shadow');
    }

    .rs-toast-message-secondary .rs-toast-close-button:hover {
        background: dt('toast.secondary.close.button.hover.background');
    }

    .rs-toast-message-contrast {
        background: dt('toast.contrast.background');
        border-color: dt('toast.contrast.border.color');
        color: dt('toast.contrast.color');
        box-shadow: dt('toast.contrast.shadow');
    }

    .rs-toast-message-contrast .rs-toast-detail {
        color: dt('toast.contrast.detail.color');
    }

    .rs-toast-message-contrast .rs-toast-close-button:focus-visible {
        outline-color: dt('toast.contrast.close.button.focus.ring.color');
        box-shadow: dt('toast.contrast.close.button.focus.ring.shadow');
    }

    .rs-toast-message-contrast .rs-toast-close-button:hover {
        background: dt('toast.contrast.close.button.hover.background');
    }

    .rs-toast-top-center {
        transform: translateX(-50%);
    }

    .rs-toast-bottom-center {
        transform: translateX(-50%);
    }

    .rs-toast-center {
        min-width: 20vw;
        transform: translate(-50%, -50%);
    }

    .rs-toast-message-enter-active {
        animation: rs-animate-toast-enter 300ms ease-out;
    }

    .rs-toast-message-leave-active {
        animation: rs-animate-toast-leave 250ms ease-in forwards;
    }

    .rs-toast-message-leave-to .rs-toast-message-content {
        padding-top: 0;
        padding-bottom: 0;
    }

    @keyframes rs-animate-toast-enter {
        from {
            opacity: 0;
            transform: scale(0.6);
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

     @keyframes rs-animate-toast-leave {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            margin-bottom: 0;
            border-width: 0;
            grid-template-rows: 0fr;
            transform: translateY(-100%) scale(0.6);
        }
    }
`;
