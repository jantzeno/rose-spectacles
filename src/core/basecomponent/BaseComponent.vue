<script lang="ts">
import { Theme, ThemeService } from '../../internal/styled/index';
import { findSingle, isElement } from '../../internal/utils/dom/index';
import { getKeyValue, isArray, isFunction, isNotEmpty, isString, resolve, toFlatCase } from '../../internal/utils/object/index';
import Base from '../base/Base';
import BaseStyle from '../base/style/BaseStyle';
import { useAttrSelector } from '../useattrselector/UseAttrSelector';
import { defineComponent, mergeProps, type ComponentPublicInstance, type Ref, type StyleValue } from 'vue';
import BaseComponentStyle from './style/BaseComponentStyle';

type PassThrough = Record<string, any>;
type PassThroughResolver = (options: PassThrough | undefined, key?: string, params?: PassThrough) => any;
type Style = ReturnType<typeof BaseStyle.extend>;
type RuntimeStyle = Omit<Partial<Style>, 'load' | 'loadCSS' | 'loadStyle'> & {
    load: Style['load'];
    loadCSS: (...args: Parameters<Style['loadCSS']>) => void;
    loadStyle: (...args: Parameters<Style['loadStyle']>) => void;
};
type Host = ComponentPublicInstance & {
    $parentInstance?: unknown;
    $style?: Partial<RuntimeStyle>;
};

interface PassThroughContext {
    instance: ComponentPublicInstance;
    props: object;
    state: object;
    attrs: Record<string, unknown>;
    parent: {
        instance: ComponentPublicInstance | null;
        props?: object;
        state?: object;
        attrs?: Record<string, unknown>;
    };
}

declare module 'vue' {
    interface ComponentCustomOptions {
        hostName?: string;
        style?: Partial<Style>;
    }

    interface ComponentCustomProperties {
        $attrSelector: string;
        rootEl: (Element & { $pc?: PassThrough }) | null;
        scopedStyleEl?: Ref<HTMLStyleElement | null>;
        uid: string;
        _themeScopedListener?: () => void;
    }
}

export default defineComponent({
    name: 'BaseComponent',
    props: {
        pt: {
            type: Object,
            default: undefined
        },
        ptOptions: {
            type: Object,
            default: undefined
        },
        unstyled: {
            type: Boolean,
            default: undefined
        },
        dt: {
            type: Object,
            default: undefined
        }
    },
    inject: {
        $parentInstance: {
            default: undefined
        }
    },
    watch: {
        isUnstyled: {
            immediate: true,
            handler(newValue: boolean | undefined) {
                ThemeService.off('theme:change', this._loadCoreStyles);

                if (!newValue) {
                    this._loadCoreStyles();
                    this._themeChangeListener(this._loadCoreStyles); // update styles with theme settings
                }
            }
        },
        dt: {
            immediate: true,
            handler(newValue: unknown) {
                if (this._themeScopedListener) ThemeService.off('theme:change', this._themeScopedListener);

                if (newValue) {
                    this._loadScopedThemeStyles(newValue);
                    this._themeScopedListener = () => this._loadScopedThemeStyles(newValue);
                    this._themeChangeListener(this._themeScopedListener);
                } else {
                    this._unloadScopedThemeStyles();
                }
            }
        }
    },
    scopedStyleEl: undefined,
    rootEl: undefined,
    uid: undefined,
    $attrSelector: undefined,
    beforeCreate() {
        const name = this.$.type.name!;
        const _usept = this.pt?.['_usept'];
        const originalValue = _usept ? this.pt?.originalValue?.[name] : undefined;
        const value = _usept ? this.pt?.value?.[name] : this.pt;

        (value || originalValue)?.hooks?.['onBeforeCreate']?.();

        const _useptInConfig = this.$primevueConfig?.pt?.['_usept'];
        const originalValueInConfig = _useptInConfig ? this.$primevue?.config?.pt?.originalValue : undefined;
        const valueInConfig = _useptInConfig ? this.$primevue?.config?.pt?.value : this.$primevue?.config?.pt;

        (valueInConfig || originalValueInConfig)?.[name]?.hooks?.['onBeforeCreate']?.();

        this.$attrSelector = useAttrSelector();
        this.uid = (this.$attrs.id as string | undefined) || this.$attrSelector.replace('pc', 'pv_id_');
    },
    created() {
        this._hook('onCreated');
    },
    beforeMount() {
        // @deprecated - remove in v5
        this.rootEl = findSingle(isElement(this.$el) ? this.$el : this.$el?.parentElement, `[${this.$attrSelector}]`);

        if (this.rootEl) {
            this.rootEl.$pc = { name: this.$.type.name, attrSelector: this.$attrSelector, ...this.$params };
        }

        this._loadStyles();
        this._hook('onBeforeMount');
    },
    mounted() {
        this._hook('onMounted');
    },
    beforeUpdate() {
        this._hook('onBeforeUpdate');
    },
    updated() {
        this._hook('onUpdated');
    },
    beforeUnmount() {
        this._hook('onBeforeUnmount');
    },
    unmounted() {
        this._removeThemeListeners();
        this._unloadScopedThemeStyles();
        this._hook('onUnmounted');
    },
    methods: {
        _hook(hookName: string) {
            if (!this.$options.hostName) {
                const selfHook = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, `hooks.${hookName}`);
                const defaultHook = this._useDefaultPT(this._getOptionValue, `hooks.${hookName}`);

                selfHook?.();
                defaultHook?.();
            }
        },
        _mergeProps(fn: unknown, ...args: unknown[]) {
            return isFunction(fn) ? fn(...args) : mergeProps(...(args as PassThrough[]));
        },
        _load() {
            // @todo
            if (!Base.isStyleNameLoaded('base')) {
                BaseStyle.loadCSS(this.$styleOptions);
                this._loadGlobalStyles();

                Base.setLoadedStyleName('base');
            }

            this._loadThemeStyles();
        },
        _loadStyles() {
            this._load();
            this._themeChangeListener(this._load);
        },
        _loadCoreStyles() {
            if (this.$style.name && !Base.isStyleNameLoaded(this.$style.name)) {
                BaseComponentStyle.loadCSS(this.$styleOptions);
                this.$options.style && this.$style.loadCSS(this.$styleOptions);

                Base.setLoadedStyleName(this.$style.name);
            }
        },
        _loadGlobalStyles() {
            /*
             * @todo Add self custom css support;
             * <Panel :pt="{ css: `...` }" .../>
             *
             * const selfCSS = this._getPTClassValue(this.pt, 'css', this.$params);
             * const defaultCSS = this._getPTClassValue(this.defaultPT, 'css', this.$params);
             * const mergedCSS = mergeProps(selfCSS, defaultCSS);
             * isNotEmpty(mergedCSS?.class) && this.$css.loadCustomStyle(mergedCSS?.class);
             */

            const globalCSS = this._useGlobalPT(this._getOptionValue, 'global.css', this.$params);

            isNotEmpty(globalCSS) && BaseStyle.load(globalCSS, { name: 'global', ...this.$styleOptions });
        },
        _loadThemeStyles() {
            if (this.isUnstyled || this.$theme === 'none') return;

            // common
            if (!Theme.isStyleNameLoaded('common')) {
                const { primitive, semantic, global, style } = this.$style?.getCommonTheme?.() || {};

                BaseStyle.load(primitive?.css, { name: 'primitive-variables', ...this.$styleOptions });
                BaseStyle.load(semantic?.css, { name: 'semantic-variables', ...this.$styleOptions });
                BaseStyle.load(global?.css, { name: 'global-variables', ...this.$styleOptions });
                BaseStyle.loadStyle({ name: 'global-style', ...this.$styleOptions }, style);

                Theme.setLoadedStyleName('common');
            }

            // component
            if (this.$style.name && !Theme.isStyleNameLoaded(this.$style.name)) {
                const { css, style } = this.$style?.getComponentTheme?.() || {};

                this.$style?.load(css, { name: `${this.$style.name}-variables`, ...this.$styleOptions });
                this.$style?.loadStyle({ name: `${this.$style.name}-style`, ...this.$styleOptions }, style);

                Theme.setLoadedStyleName(this.$style.name);
            }

            // layer order
            if (!Theme.isStyleNameLoaded('layer-order')) {
                const layerOrder = this.$style?.getLayerOrderThemeCSS?.();

                BaseStyle.load(layerOrder, { name: 'layer-order', first: true, ...this.$styleOptions });

                Theme.setLoadedStyleName('layer-order');
            }
        },
        _loadScopedThemeStyles(preset: unknown) {
            const { css } = this.$style?.getPresetTheme?.(preset, `[${this.$attrSelector}]`) || {};
            const scopedStyle = this.$style?.load(css, { name: `${this.$attrSelector}-${this.$style.name}`, ...this.$styleOptions });

            this.scopedStyleEl = scopedStyle.el;
        },
        _unloadScopedThemeStyles() {
            this.scopedStyleEl?.value?.remove();
        },
        _themeChangeListener(callback = () => {}) {
            Base.clearLoadedStyleNames();
            ThemeService.on('theme:change', callback);
        },
        _removeThemeListeners() {
            ThemeService.off('theme:change', this._loadCoreStyles);
            ThemeService.off('theme:change', this._load);
            if (this._themeScopedListener) ThemeService.off('theme:change', this._themeScopedListener);
        },
        _getHostInstance(instance?: Host): Host | undefined {
            return instance
                ? this.$options.hostName
                    ? instance.$.type.name === this.$options.hostName
                        ? instance
                        : this._getHostInstance(instance.$parentInstance as Host | undefined)
                    : (instance.$parentInstance as Host | undefined)
                : undefined;
        },
        _getPropValue(name: string) {
            return (this as PassThrough)[name] || (this._getHostInstance(this) as PassThrough | undefined)?.[name];
        },
        _getOptionValue(options: PassThrough | undefined, key = '', params: PassThrough = {}): any {
            return getKeyValue(options, key, params);
        },
        _getPTValue(obj = {}, key = '', params: PassThrough = {}, searchInDefaultPT = true): PassThrough {
            const searchOut = /./g.test(key) && !!params[key.split('.')[0]];
            const { mergeSections = true, mergeProps: useMergeProps = false } = this._getPropValue('ptOptions') || this.$primevueConfig?.ptOptions || {};
            const global = searchInDefaultPT
                ? searchOut
                    ? this._useGlobalPT(this._getPTClassValue, key, params)
                    : this._useDefaultPT(this._getPTClassValue, key, params)
                : undefined;
            const self = searchOut ? undefined : this._getPTSelf(obj, this._getPTClassValue, key, { ...params, global: global || {} });
            const datasets = this._getPTDatasets(key);

            return mergeSections || (!mergeSections && self)
                ? useMergeProps
                    ? this._mergeProps(useMergeProps, global, self, datasets)
                    : { ...global, ...self, ...datasets }
                : { ...self, ...datasets };
        },
        _getPTSelf(obj: PassThrough | undefined, ...args: [PassThroughResolver, string, PassThrough]) {
            return mergeProps(
                this._usePT(this._getPT(obj, this.$name), ...args), // Exp; <component :pt="{}"
                this._usePT(this.$_attrsPT, ...args) // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
            );
        },
        _getPTDatasets(key = '') {
            const datasetPrefix = 'data-pc-';
            const isExtended = key === 'root' && isNotEmpty(this.pt?.['data-pc-section']);

            return (
                key !== 'transition' && {
                    ...(key === 'root' && {
                        [`${datasetPrefix}name`]: toFlatCase(isExtended ? this.pt?.['data-pc-section'] : this.$.type.name!),
                        ...(isExtended && { [`${datasetPrefix}extend`]: toFlatCase(this.$.type.name!) }),
                        [`${this.$attrSelector}`]: ''
                    }),
                    [`${datasetPrefix}section`]: toFlatCase(key)
                }
            );
        },
        _getPTClassValue(...args: Parameters<PassThroughResolver>) {
            const value = this._getOptionValue(...args);

            return isString(value) || isArray(value) ? { class: value } : value;
        },
        _getPT(pt: PassThrough | undefined, key = '', callback?: PassThroughResolver) {
            const getValue = (value?: PassThrough, checkSameKey = false) => {
                const computedValue = callback ? callback(value) : value;
                const _key = toFlatCase(key);
                const _cKey = toFlatCase(this.$name!);

                return (checkSameKey ? (_key !== _cKey ? computedValue?.[_key] : undefined) : computedValue?.[_key]) ?? computedValue;
            };

            return pt?.hasOwnProperty('_usept')
                ? {
                      _usept: pt['_usept'],
                      originalValue: getValue(pt.originalValue),
                      value: getValue(pt.value)
                  }
                : getValue(pt, true);
        },
        _usePT(pt: PassThrough | undefined, callback: PassThroughResolver, key: string, params?: PassThrough) {
            const fn = (value?: PassThrough) => callback(value, key, params);

            if (pt?.hasOwnProperty('_usept')) {
                const { mergeSections = true, mergeProps: useMergeProps = false } = pt['_usept'] || this.$primevueConfig?.ptOptions || {};
                const originalValue = fn(pt.originalValue);
                const value = fn(pt.value);

                if (originalValue === undefined && value === undefined) return undefined;
                else if (isString(value)) return value;
                else if (isString(originalValue)) return originalValue;

                return mergeSections || (!mergeSections && value)
                    ? useMergeProps
                        ? this._mergeProps(useMergeProps, originalValue, value)
                        : { ...originalValue, ...value }
                    : value;
            }

            return fn(pt);
        },
        _useGlobalPT(callback: PassThroughResolver, key: string, params?: PassThrough) {
            return this._usePT(this.globalPT, callback, key, params);
        },
        _useDefaultPT(callback: PassThroughResolver, key: string, params?: PassThrough) {
            return this._usePT(this.defaultPT, callback, key, params);
        },
        ptm(key = '', params = {}) {
            return this._getPTValue(this.pt, key, { ...this.$params, ...params });
        },
        ptmi(key = '', params = {}) {
            // inheritAttrs:true
            const attrs = mergeProps(this.$_attrsWithoutPT, this.ptm(key, params));

            attrs?.hasOwnProperty('id') && (attrs.id ??= this.$id);

            return attrs;
        },
        ptmo(obj = {}, key = '', params = {}) {
            return this._getPTValue(obj, key, { instance: this, ...params }, false);
        },
        /** @returns {import('vue').ClassValue} */
        cx(key = '', params = {}) {
            return !this.isUnstyled ? this._getOptionValue(this.$style.classes, key, { ...this.$params, ...params }) : undefined;
        },
        sx(key = '', when = true, params = {}): StyleValue {
            if (when) {
                const self = this._getOptionValue(this.$style.inlineStyles, key, { ...this.$params, ...params });
                const base = this._getOptionValue(BaseComponentStyle.inlineStyles, key, { ...this.$params, ...params });

                return [base, self];
            }

            return undefined;
        }
    },
    computed: {
        globalPT() {
            return this._getPT(this.$primevueConfig?.pt, undefined, (value) => resolve(value, { instance: this }));
        },
        defaultPT() {
            return this._getPT(
                this.$primevueConfig?.pt,
                undefined,
                (value) => this._getOptionValue(value, this.$name, { ...this.$params }) || resolve(value, { ...this.$params })
            );
        },
        isUnstyled() {
            return this.unstyled !== undefined ? this.unstyled : this.$primevueConfig?.unstyled;
        },
        $id(): string {
            return (this.$attrs.id as string | undefined) || this.uid;
        },
        $inProps() {
            const nodePropKeys = Object.keys(this.$.vnode?.props || {});

            return Object.fromEntries(Object.entries(this.$props).filter(([k]) => nodePropKeys?.includes(k)));
        },
        $theme() {
            return this.$primevueConfig?.theme;
        },
        $style(): RuntimeStyle {
            return {
                classes: undefined,
                inlineStyles: undefined,
                load: (): ReturnType<Style['load']> => ({}),
                loadCSS: () => {},
                loadStyle: () => {},
                ...(this._getHostInstance(this) || {}).$style,
                ...this.$options.style
            };
        },
        $styleOptions() {
            return { nonce: this.$primevueConfig?.csp?.nonce };
        },
        $primevueConfig() {
            return this.$primevue?.config;
        },
        $name() {
            return this.$options.hostName || this.$.type.name;
        },
        $params(): PassThroughContext {
            const parentInstance = this._getHostInstance(this) || this.$parent;

            return {
                instance: this,
                props: this.$props,
                state: this.$data,
                attrs: this.$attrs,
                parent: {
                    instance: parentInstance,
                    props: parentInstance?.$props,
                    state: parentInstance?.$data,
                    attrs: parentInstance?.$attrs
                }
            };
        },
        $_attrsPT() {
            return Object.entries(this.$attrs || {})
                .filter(([key]) => key?.startsWith('pt:'))
                .reduce<PassThrough>((result, [key, value]) => {
                    const [, ...rest] = key.split(':');

                    rest?.reduce<PassThrough>((currentObj, nestedKey, index, array) => {
                        !currentObj[nestedKey] && (currentObj[nestedKey] = index === array.length - 1 ? value : {});

                        return currentObj[nestedKey];
                    }, result);

                    return result;
                }, {});
        },
        $_attrsWithoutPT() {
            return Object.entries(this.$attrs || {})
                .filter(([key]) => !key?.startsWith('pt:'))
                .reduce<PassThrough>((acc, [key, value]) => {
                    acc[key] = value;

                    return acc;
                }, {});
        }
    }
});
</script>
