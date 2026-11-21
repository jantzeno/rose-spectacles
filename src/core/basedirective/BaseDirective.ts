import { Theme, ThemeService } from '../../internal/styled/index';
import { getKeyValue, isArray, isEmpty, isFunction, isObject, isString, resolve, toCapitalCase, toFlatCase } from '../../internal/utils/object/index';
import { uuid } from '../../internal/utils/uuid/index';
import Base from '../base/Base';
import BaseStyle from '../base/style/BaseStyle';
import type { PrimeVueConfiguration } from 'rose-spectacles/core/config';
import PrimeVueService from '../service/PrimeVueService';
import type { StyleOptions } from '../usestyle/UseStyle';
import { mergeProps, type DirectiveBinding, type ObjectDirective, type Ref, type VNode } from 'vue';

type Hook = 'created' | 'beforeMount' | 'mounted' | 'beforeUpdate' | 'updated' | 'beforeUnmount' | 'unmounted';
type ConfigWatcher = 'config' | 'config.ripple';
type PassThrough = Record<string, any>;
type PassThroughResolver = (options: PassThrough | undefined, key: string, params?: PassThrough) => any;
type Style = ReturnType<typeof BaseStyle.extend>;
type ConfigChange = { newValue: unknown; oldValue: unknown };
type ConfigCallback = (change: unknown) => void;
type Watchers = Partial<Record<ConfigWatcher, (newValue: unknown, oldValue?: unknown) => void>>;

interface DirectiveElement extends HTMLElement {
    _$instances: Record<string, RuntimeInstance>;
    $instance: RuntimeInstance;
    $pd: Record<string, { name?: string; attrSelector?: string; instance?: RuntimeInstance }>;
}

interface RuntimeInstance {
    $name?: string;
    $host: DirectiveElement;
    $el: HTMLElement;
    $binding: DirectiveBinding;
    $modifiers: DirectiveBinding['modifiers'];
    $value: any;
    $style: Partial<Style> & Pick<Style, 'load' | 'loadCSS' | 'loadStyle'>;
    $primevueConfig?: PrimeVueConfiguration;
    $attrSelector: string;
    $loadStyles?: () => void;
    $watchersCallback?: Record<ConfigWatcher, ConfigCallback>;
    scopedStyleEl?: Ref<HTMLStyleElement | null>;
    defaultPT: () => PassThrough | undefined;
    isUnstyled: () => boolean | undefined;
    theme: () => unknown;
    preset: () => unknown;
    ptm: (key?: string, params?: PassThrough) => PassThrough;
    ptmo: (obj?: PassThrough, key?: string, params?: PassThrough) => PassThrough;
    cx: (key?: string, params?: PassThrough) => unknown;
    sx: (key?: string, when?: boolean, params?: PassThrough) => unknown;
    watch?: Watchers;
    [property: string]: any;
}

type DirectiveHook = (el: DirectiveElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode | null) => void;
type DirectiveOptions = Partial<Record<Hook, DirectiveHook>> & {
    style?: Partial<Style>;
    watch?: Watchers & ThisType<RuntimeInstance>;
    methods?: Record<string, (...args: any[]) => unknown> & ThisType<RuntimeInstance>;
    [property: string]: unknown;
} & ThisType<RuntimeInstance>;
type DirectiveArguments = [DirectiveOptions] | [string | undefined, DirectiveOptions?];
type ExtendedDirective = ObjectDirective<DirectiveElement> & {
    extend: (...args: DirectiveArguments) => ExtendedDirective;
};

const BaseDirective = {
    _getMeta: (...args: DirectiveArguments): [string | undefined, DirectiveOptions | undefined] =>
        isObject(args[0]) ? [undefined, resolve(args[0])] : [args[0] as string | undefined, resolve(args[1])],
    _getConfig: (binding: DirectiveBinding, vnode: VNode): PrimeVueConfiguration | undefined =>
        (binding.instance?.$primevue || (vnode as VNode & { ctx?: { appContext?: VNode['appContext'] } }).ctx?.appContext?.config?.globalProperties?.$primevue)
            ?.config,
    _getOptionValue: getKeyValue,
    _getPTValue: (instance: RuntimeInstance, obj: PassThrough = {}, key = '', params: PassThrough = {}, searchInDefaultPT = true): PassThrough => {
        const getValue: PassThroughResolver = (...args) => {
            const value = BaseDirective._getOptionValue(...args);

            return isString(value) || isArray(value) ? { class: value } : value;
        };

        const { mergeSections = true, mergeProps: useMergeProps = false } = instance.binding?.value?.ptOptions || instance.$primevueConfig?.ptOptions || {};
        const global = searchInDefaultPT ? BaseDirective._useDefaultPT(instance, instance.defaultPT(), getValue, key, params) : undefined;
        const self = BaseDirective._usePT(instance, BaseDirective._getPT(obj, instance.$name), getValue, key, { ...params, global: global || {} });
        const datasets = BaseDirective._getPTDatasets(instance, key);

        return mergeSections || (!mergeSections && self)
            ? useMergeProps
                ? BaseDirective._mergeProps(instance, useMergeProps, global, self, datasets)
                : { ...global, ...self, ...datasets }
            : { ...self, ...datasets };
    },
    _getPTDatasets(instance: RuntimeInstance, key = '') {
        const datasetPrefix = 'data-pc-';

        return {
            ...(key === 'root' && { [`${datasetPrefix}name`]: toFlatCase(instance.$name!) }),
            [`${datasetPrefix}section`]: toFlatCase(key)
        };
    },
    _getPT: (pt: PassThrough | undefined, key = '', callback?: (value?: PassThrough) => PassThrough | undefined) => {
        const getValue = (value?: PassThrough) => {
            const computedValue = callback ? callback(value) : value;
            const _key = toFlatCase(key);

            return computedValue?.[_key] ?? computedValue;
        };

        return pt && Object.hasOwn(pt, '_usept')
            ? {
                  _usept: pt['_usept'],
                  originalValue: getValue(pt.originalValue),
                  value: getValue(pt.value)
              }
            : getValue(pt);
    },
    _usePT: (instance: RuntimeInstance, pt: PassThrough | undefined, callback: PassThroughResolver, key: string, params?: PassThrough) => {
        const fn = (value?: PassThrough) => callback(value, key, params);

        if (pt && Object.hasOwn(pt, '_usept')) {
            const { mergeSections = true, mergeProps: useMergeProps = false } = pt['_usept'] || instance.$primevueConfig?.ptOptions || {};
            const originalValue = fn(pt.originalValue);
            const value = fn(pt.value);

            if (originalValue === undefined && value === undefined) return undefined;
            else if (isString(value)) return value;
            else if (isString(originalValue)) return originalValue;

            return mergeSections || (!mergeSections && value)
                ? useMergeProps
                    ? BaseDirective._mergeProps(instance, useMergeProps, originalValue, value)
                    : { ...originalValue, ...value }
                : value;
        }

        return fn(pt);
    },
    _useDefaultPT: (instance: RuntimeInstance, defaultPT: PassThrough = {}, callback: PassThroughResolver, key: string, params?: PassThrough) => {
        return BaseDirective._usePT(instance, defaultPT, callback, key, params);
    },
    _loadStyles: (instance: RuntimeInstance | undefined, binding: DirectiveBinding, vnode: VNode) => {
        if (!instance) return;

        const config = BaseDirective._getConfig(binding, vnode);
        const useStyleOptions = { nonce: config?.csp?.nonce };

        BaseDirective._loadCoreStyles(instance, useStyleOptions);
        BaseDirective._loadThemeStyles(instance, useStyleOptions);
        BaseDirective._loadScopedThemeStyles(instance, useStyleOptions);

        BaseDirective._removeThemeListeners(instance);

        instance.$loadStyles = () => BaseDirective._loadThemeStyles(instance, useStyleOptions);

        BaseDirective._themeChangeListener(instance.$loadStyles);
    },
    _loadCoreStyles(instance: RuntimeInstance, useStyleOptions: StyleOptions) {
        if (instance.$style.name && !Base.isStyleNameLoaded(instance.$style.name)) {
            BaseStyle.loadCSS(useStyleOptions);
            instance.$style?.loadCSS(useStyleOptions);

            Base.setLoadedStyleName(instance.$style.name);
        }
    },
    _loadThemeStyles: (instance: RuntimeInstance, useStyleOptions: StyleOptions) => {
        if (instance?.isUnstyled() || instance?.theme?.() === 'none') return;

        // common
        if (!Theme.isStyleNameLoaded('common')) {
            const { primitive, semantic, global, style } = instance.$style?.getCommonTheme?.() || {};

            BaseStyle.load(primitive?.css, { name: 'primitive-variables', ...useStyleOptions });
            BaseStyle.load(semantic?.css, { name: 'semantic-variables', ...useStyleOptions });
            BaseStyle.load(global?.css, { name: 'global-variables', ...useStyleOptions });
            BaseStyle.loadStyle({ name: 'global-style', ...useStyleOptions }, style);

            Theme.setLoadedStyleName('common');
        }

        // directive
        if (instance.$style.name && !Theme.isStyleNameLoaded(instance.$style.name)) {
            const { css, style } = instance.$style?.getDirectiveTheme?.() || {};

            instance.$style?.load(css, { name: `${instance.$style.name}-variables`, ...useStyleOptions });
            instance.$style?.loadStyle({ name: `${instance.$style.name}-style`, ...useStyleOptions }, style);

            Theme.setLoadedStyleName(instance.$style.name);
        }

        // layer order
        if (!Theme.isStyleNameLoaded('layer-order')) {
            const layerOrder = instance.$style?.getLayerOrderThemeCSS?.();

            BaseStyle.load(layerOrder, { name: 'layer-order', first: true, ...useStyleOptions });

            Theme.setLoadedStyleName('layer-order');
        }
    },
    _loadScopedThemeStyles(instance: RuntimeInstance, useStyleOptions: StyleOptions) {
        const preset = instance.preset();

        if (preset && instance.$attrSelector) {
            const { css } = instance.$style?.getPresetTheme?.(preset, `[${instance.$attrSelector}]`) || {};
            const scopedStyle = instance.$style?.load(css, { name: `${instance.$attrSelector}-${instance.$style.name}`, ...useStyleOptions });

            instance.scopedStyleEl = scopedStyle.el;
        }
    },
    _themeChangeListener(callback = () => {}) {
        Base.clearLoadedStyleNames();
        ThemeService.on('theme:change', callback);
    },
    _removeThemeListeners(instance?: RuntimeInstance) {
        if (instance?.$loadStyles) {
            ThemeService.off('theme:change', instance.$loadStyles);
            instance.$loadStyles = undefined;
        }
    },
    _hook: (directiveName: string, hookName: Hook, el: DirectiveElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode | null) => {
        const name = `on${toCapitalCase(hookName)}`;
        const config = BaseDirective._getConfig(binding, vnode);
        const instance = el?.$instance;
        const selfHook = BaseDirective._usePT(
            instance,
            BaseDirective._getPT(binding?.value?.pt, directiveName),
            BaseDirective._getOptionValue,
            `hooks.${name}`
        );
        const defaultHook = BaseDirective._useDefaultPT(instance, config?.pt?.directives?.[directiveName], BaseDirective._getOptionValue, `hooks.${name}`);
        const options = { el, binding, vnode, prevVnode };

        selfHook?.(instance, options);
        defaultHook?.(instance, options);
    },
    /* eslint-disable-next-line no-unused-vars */
    _mergeProps(instance: RuntimeInstance, fn: unknown, ...args: PassThrough[]) {
        return isFunction(fn) ? fn(...args) : mergeProps(...args);
    },
    _extend: (directiveName: string | undefined, options: DirectiveOptions = {}): ObjectDirective<DirectiveElement> => {
        const name = String(directiveName);
        const handleHook = (hook: Hook, el: DirectiveElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode | null) => {
            el._$instances = el._$instances || {};

            const config = BaseDirective._getConfig(binding, vnode);
            const $prevInstance = el._$instances[name];
            const $options = isEmpty($prevInstance) ? { ...options, ...options?.methods } : {};

            el._$instances[name] = {
                ...$prevInstance,
                /* new instance variables to pass in directive methods */
                $name: directiveName,
                $host: el,
                $binding: binding,
                $modifiers: binding?.modifiers,
                $value: binding?.value,
                $el: $prevInstance?.$el || el,
                $style: { classes: undefined, inlineStyles: undefined, load: () => ({}), loadCSS: () => ({}), loadStyle: () => ({}), ...options?.style },
                $primevueConfig: config,
                $attrSelector: el.$pd?.[name]?.attrSelector!,
                /* computed instance variables */
                defaultPT: () => BaseDirective._getPT(config?.pt, undefined, (value) => value?.directives?.[name]),
                isUnstyled: () =>
                    el._$instances[name]?.$binding?.value?.unstyled !== undefined ? el._$instances[name]?.$binding?.value?.unstyled : config?.unstyled,
                theme: () => el._$instances[name]?.$primevueConfig?.theme,
                preset: () => el._$instances[name]?.$binding?.value?.dt,
                /* instance's methods */
                ptm: (key = '', params = {}) => BaseDirective._getPTValue(el._$instances[name], el._$instances[name]?.$binding?.value?.pt, key, { ...params }),
                ptmo: (obj = {}, key = '', params = {}) => BaseDirective._getPTValue(el._$instances[name], obj, key, params, false),
                cx: (key = '', params = {}) =>
                    !el._$instances[name]?.isUnstyled() ? BaseDirective._getOptionValue(el._$instances[name]?.$style?.classes, key, { ...params }) : undefined,
                sx: (key = '', when = true, params = {}) =>
                    when ? BaseDirective._getOptionValue(el._$instances[name]?.$style?.inlineStyles, key, { ...params }) : undefined,
                ...$options
            };

            el.$instance = el._$instances[name]; // pass instance data to hooks
            el.$instance[hook]?.(el, binding, vnode, prevVnode); // handle hook in directive implementation
            (el as unknown as Record<string, unknown>)[`$${name}`] = el.$instance; // expose all options with $<directive_name>
            BaseDirective._hook(directiveName!, hook, el, binding, vnode, prevVnode); // handle hooks during directive uses (global and self-definition)

            el.$pd ||= {};
            el.$pd[name] = { ...el.$pd?.[name], name: directiveName, instance: el._$instances[name] };
        };

        const handleWatchers = (el: DirectiveElement) => {
            const instance = el._$instances[name];
            const watchers = instance?.watch;

            const handleWatchConfig: ConfigCallback = (change) => {
                const { newValue, oldValue } = change as ConfigChange;
                watchers?.config?.call(instance, newValue, oldValue);
            };

            const handleWatchConfigRipple: ConfigCallback = (change) => {
                const { newValue, oldValue } = change as ConfigChange;
                watchers?.['config.ripple']?.call(instance, newValue, oldValue);
            };

            instance.$watchersCallback = { config: handleWatchConfig, 'config.ripple': handleWatchConfigRipple };

            // for 'config'
            watchers?.['config']?.call(instance, instance?.$primevueConfig);
            PrimeVueService.on('config:change', handleWatchConfig);

            // for 'config.ripple'
            watchers?.['config.ripple']?.call(instance, instance?.$primevueConfig?.ripple);
            PrimeVueService.on('config:ripple:change', handleWatchConfigRipple);
        };

        const stopWatchers = (el: DirectiveElement) => {
            const watchers = el._$instances[name].$watchersCallback;

            if (watchers) {
                PrimeVueService.off('config:change', watchers.config);
                PrimeVueService.off('config:ripple:change', watchers['config.ripple']);
                el._$instances[name].$watchersCallback = undefined;
            }
        };

        return {
            created: (el, binding, vnode, prevVnode) => {
                el.$pd ||= {};
                el.$pd[name] = { name: directiveName, attrSelector: uuid('pd') };
                handleHook('created', el, binding, vnode, prevVnode);
            },
            beforeMount: (el, binding, vnode, prevVnode) => {
                BaseDirective._loadStyles(el.$pd[name]?.instance, binding, vnode);
                handleHook('beforeMount', el, binding, vnode, prevVnode);
                handleWatchers(el);
            },
            mounted: (el, binding, vnode, prevVnode) => {
                BaseDirective._loadStyles(el.$pd[name]?.instance, binding, vnode);
                handleHook('mounted', el, binding, vnode, prevVnode);
            },
            beforeUpdate: (el, binding, vnode, prevVnode) => {
                handleHook('beforeUpdate', el, binding, vnode, prevVnode);
            },
            updated: (el, binding, vnode, prevVnode) => {
                BaseDirective._loadStyles(el.$pd[name]?.instance, binding, vnode);
                handleHook('updated', el, binding, vnode, prevVnode);
            },
            beforeUnmount: (el, binding, vnode, prevVnode) => {
                stopWatchers(el);
                BaseDirective._removeThemeListeners(el.$pd[name]?.instance);
                handleHook('beforeUnmount', el, binding, vnode, prevVnode);
            },
            unmounted: (el, binding, vnode, prevVnode) => {
                el.$pd[name]?.instance?.scopedStyleEl?.value?.remove();
                handleHook('unmounted', el, binding, vnode, prevVnode);
            }
        };
    },
    extend: (...args: DirectiveArguments): ExtendedDirective => {
        const [name, options] = BaseDirective._getMeta(...args);

        return {
            extend: (..._args: DirectiveArguments) => {
                const [_name, _options] = BaseDirective._getMeta(..._args);

                return BaseDirective.extend(_name, { ...options, ...options?.methods, ..._options });
            },
            ...BaseDirective._extend(name, options)
        };
    }
};

export default BaseDirective;
