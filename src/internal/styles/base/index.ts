export const style = /*css*/ `
    *,
    ::before,
    ::after {
        box-sizing: border-box;
    }

    .rs-collapsible-enter-active {
        animation: rs-animate-collapsible-expand 0.2s ease-out;
        overflow: hidden;
    }

    .rs-collapsible-leave-active {
        animation: rs-animate-collapsible-collapse 0.2s ease-out;
        overflow: hidden;
    }

    @keyframes rs-animate-collapsible-expand {
        from {
            grid-template-rows: 0fr;
        }
        to {
            grid-template-rows: 1fr;
        }
    }

    @keyframes rs-animate-collapsible-collapse {
        from {
            grid-template-rows: 1fr;
        }
        to {
            grid-template-rows: 0fr;
        }
    }

    .rs-disabled,
    .rs-disabled * {
        cursor: default;
        pointer-events: none;
        user-select: none;
    }

    .rs-disabled,
    .rs-component:disabled {
        opacity: dt('disabled.opacity');
    }

    .pi {
        font-size: dt('icon.size');
    }

    .rs-icon {
        width: dt('icon.size');
        height: dt('icon.size');
    }

    .rs-overlay-mask {
        background: var(--rs-mask-background, dt('mask.background'));
        color: dt('mask.color');
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .rs-overlay-mask-enter-active {
        animation: rs-animate-overlay-mask-enter dt('mask.transition.duration') forwards;
    }

    .rs-overlay-mask-leave-active {
        animation: rs-animate-overlay-mask-leave dt('mask.transition.duration') forwards;
    }

    @keyframes rs-animate-overlay-mask-enter {
        from {
            background: transparent;
        }
        to {
            background: var(--rs-mask-background, dt('mask.background'));
        }
    }
    @keyframes rs-animate-overlay-mask-leave {
        from {
            background: var(--rs-mask-background, dt('mask.background'));
        }
        to {
            background: transparent;
        }
    }

    .rs-anchored-overlay-enter-active {
        animation: rs-animate-anchored-overlay-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .rs-anchored-overlay-leave-active {
        animation: rs-animate-anchored-overlay-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes rs-animate-anchored-overlay-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes rs-animate-anchored-overlay-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
