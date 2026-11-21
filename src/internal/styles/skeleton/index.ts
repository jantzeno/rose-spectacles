export const style = /*css*/ `
    .rs-skeleton {
        display: block;
        overflow: hidden;
        background: dt('skeleton.background');
        border-radius: dt('skeleton.border.radius');
    }

    .rs-skeleton::after {
        content: '';
        animation: rs-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), dt('skeleton.animation.background'), rgba(255, 255, 255, 0));
    }

    [dir='rtl'] .rs-skeleton::after {
        animation-name: rs-skeleton-animation-rtl;
    }

    .rs-skeleton-circle {
        border-radius: 50%;
    }

    .rs-skeleton-animation-none::after {
        animation: none;
    }

    @keyframes rs-skeleton-animation {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }

    @keyframes rs-skeleton-animation-rtl {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }
`;
