import BaseStyle from '../../../core/base/style/BaseStyle';

const css = `
.rs-icon {
    display: inline-block;
    vertical-align: baseline;
    flex-shrink: 0;
}

.rs-icon-spin {
    -webkit-animation: rs-icon-spin 2s infinite linear;
    animation: rs-icon-spin 2s infinite linear;
}

@-webkit-keyframes rs-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes rs-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`;

export default BaseStyle.extend({
    name: 'baseicon',
    css
});
