import { style } from '../../internal/styles/virtualscroller/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const css = `
.rs-virtualscroller {
    position: relative;
    overflow: auto;
    contain: strict;
    transform: translateZ(0);
    will-change: scroll-position;
    outline: 0 none;
}

.rs-virtualscroller-content {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    min-width: 100%;
    will-change: transform;
}

.rs-virtualscroller-spacer {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    transform-origin: 0 0;
    pointer-events: none;
}

.rs-virtualscroller-loader {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.rs-virtualscroller-loader-mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.rs-virtualscroller-horizontal > .rs-virtualscroller-content {
    display: flex;
}

.rs-virtualscroller-inline .rs-virtualscroller-content {
    position: static;
}

.rs-virtualscroller .rs-virtualscroller-loading {
    transform: none !important;
    min-height: 0;
    position: sticky;
    inset-block-start: 0;
    inset-inline-start: 0;
}
`;

export default BaseStyle.extend({
    name: 'virtualscroller',
    css,
    style
});
