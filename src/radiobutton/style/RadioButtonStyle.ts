import { style } from '../../internal/styles/radiobutton/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

// The dot is masked out of a layer covering the ring, so it snaps with the ring at 125%/175% scaling.
// Sizes are reset with the base style's selectors, so custom width/height CSS still wins.
const centredDotStyle = `
    .rs-radiobutton-icon {
        position: absolute;
        inset: 0;
        margin: auto;
        width: auto;
        height: auto;
        -webkit-mask-image: radial-gradient(circle closest-side, #000 calc(0.5em - 0.5px), transparent calc(0.5em + 0.5px));
        mask-image: radial-gradient(circle closest-side, #000 calc(0.5em - 0.5px), transparent calc(0.5em + 0.5px));
    }

    .rs-radiobutton-sm .rs-radiobutton-icon,
    .rs-radiobutton-lg .rs-radiobutton-icon {
        width: auto;
        height: auto;
    }
`;

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-radiobutton rs-component',
        {
            'rs-radiobutton-checked': instance.checked,
            'rs-disabled': props.disabled,
            'rs-invalid': instance.$pcRadioButtonGroup ? instance.$pcRadioButtonGroup.$invalid : instance.$invalid,
            'rs-variant-filled': instance.$variant === 'filled',
            'rs-radiobutton-sm rs-inputfield-sm': props.size === 'small',
            'rs-radiobutton-lg rs-inputfield-lg': props.size === 'large'
        }
    ],
    box: 'rs-radiobutton-box',
    input: 'rs-radiobutton-input',
    icon: 'rs-radiobutton-icon'
};

export default BaseStyle.extend({
    name: 'radiobutton',
    style: style + centredDotStyle,
    classes
});
