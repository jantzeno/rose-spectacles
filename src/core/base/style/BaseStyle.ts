import { css as Css, Theme, dt } from '../../../internal/styled/index';
import { style } from '../../../internal/styles/base/index';
import { isNotEmpty, minifyCSS, resolve } from '../../../internal/utils/object/index';
import { useStyle, type StyleOptions } from '../../usestyle/UseStyle';

const css = ({ dt }: { dt: CssParameters['dt'] }) => `
.rs-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    opacity: 0;
    overflow: hidden;
    padding: 0;
    pointer-events: none;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}

.rs-overflow-hidden {
    overflow: hidden;
    padding-right: ${dt('scrollbar.width')};
}

.rs-icon {
    display: inline-block;
    vertical-align: baseline;
    flex-shrink: 0;
}

.rs-icon-spin {
    animation: rs-icon-spin 2s infinite linear;
}

@keyframes rs-icon-spin {
    to { transform: rotate(1turn); }
}
`;

type CssParameters = { dt: typeof dt };
type CssValue = string | ((params: CssParameters) => string | undefined);
type ThemeParameters = Parameters<typeof Theme.getComponent>[1];

// Style callbacks receive each component's own Options API instance and pass-through values.
export interface StyleContext {
    [argument: string]: any;
    instance: Record<string, any>;
    props: Record<string, any>;
    state: Record<string, any>;
    context: Record<string, any>;
    parent: Record<string, any>;
    global: Record<string, any>;
    attrs: Record<string, any>;
}

type StyleEntries = Record<string, unknown>;

interface StyleDefinition {
    name: string;
    css?: CssValue;
    style?: CssValue;
    classes?: StyleEntries;
    inlineStyles?: StyleEntries;
}

const baseStyle = {
    name: 'base',
    css,
    style,
    classes: {} as StyleEntries,
    inlineStyles: {} as StyleEntries,
    load(style?: CssValue, options: StyleOptions = {}, transform: (css?: string) => string | undefined = (css) => css): Partial<ReturnType<typeof useStyle>> {
        const computedStyle = transform(Css`${style}`);

        if (!isNotEmpty(computedStyle)) return {};

        const styleTag = useStyle(minifyCSS(computedStyle) ?? '', { name: this.name, ...options, manual: true });
        const { immediate = true, manual } = options;

        // A component can unmount before its mounted hooks run, but the shared stylesheet is still needed.
        if (immediate && !manual) styleTag.load();

        return styleTag;
    },
    loadCSS(options: StyleOptions = {}) {
        return this.load(this.css, options);
    },
    loadStyle(options: StyleOptions = {}, style: CssValue = '') {
        return this.load(this.style, options, (computedStyle = '') => Theme.transformCSS(options.name || this.name, `${computedStyle}${Css`${style}`}`));
    },
    getCommonTheme(params?: ThemeParameters) {
        return Theme.getCommon(this.name, params);
    },
    getComponentTheme(params?: ThemeParameters) {
        return Theme.getComponent(this.name, params);
    },
    getDirectiveTheme(params?: ThemeParameters) {
        return Theme.getDirective(this.name, params);
    },
    getPresetTheme(preset: unknown, selector: string, params?: ThemeParameters) {
        return Theme.getCustomPreset(this.name, preset, selector, params);
    },
    getLayerOrderThemeCSS() {
        return Theme.getLayerOrderCSS(this.name);
    },
    getStyleSheet(extendedCSS = '', props = {}) {
        if (this.css) {
            const _css = resolve(this.css, { dt }) || '';
            const _style = minifyCSS(Css`${_css}${extendedCSS}`);
            const _props = Object.entries(props)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');

            return isNotEmpty(_style) ? `<style type="text/css" data-primevue-style-id="${this.name}" ${_props}>${_style}</style>` : '';
        }

        return '';
    },
    getCommonThemeStyleSheet(params?: ThemeParameters, props: Record<string, unknown> = {}) {
        return Theme.getCommonStyleSheet(this.name, params, props);
    },
    getThemeStyleSheet(params?: ThemeParameters, props: Record<string, unknown> = {}) {
        let css = [Theme.getStyleSheet(this.name, params, props)];

        if (this.style) {
            const name = this.name === 'base' ? 'global-style' : `${this.name}-style`;
            const _css = Css`${resolve(this.style, { dt })}`;
            const _style = minifyCSS(Theme.transformCSS(name, _css ?? ''));
            const _props = Object.entries(props)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');

            isNotEmpty(_style) && css.push(`<style type="text/css" data-primevue-style-id="${name}" ${_props}>${_style}</style>`);
        }

        return css.join('');
    },
    extend(inStyle: StyleDefinition) {
        return { ...this, css: undefined, style: undefined, ...inStyle };
    }
};

export default baseStyle;
