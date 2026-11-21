/*
 * Ported from useStyleTag in @vueuse/core
 * https://github.com/vueuse
 */
import { isClient, isExist, setAttribute, setAttributes } from '../../internal/utils/dom/index';
import { getCurrentInstance, nextTick, onMounted, readonly, ref, watch } from 'vue';

interface StyleAttributes extends Record<string, unknown> {
    name?: string;
    id?: string;
    nonce?: string;
}

export interface StyleOptions {
    document?: Document;
    immediate?: boolean;
    manual?: boolean;
    name?: string;
    id?: string;
    media?: string;
    nonce?: string;
    first?: boolean;
    onMounted?: (name: string) => void;
    onUpdated?: (name: string) => void;
    onLoad?: (event: Event, style: { name: string }) => void;
    props?: StyleAttributes;
}

function tryOnMounted(callback: () => void, sync = true) {
    const instance = getCurrentInstance();

    if (instance && 'components' in instance && instance.components) onMounted(callback);
    else if (sync) callback();
    else nextTick(callback);
}

let lastId = 0;

export function useStyle(css: string, options: StyleOptions = {}) {
    const isLoaded = ref(false);
    const cssRef = ref(css);
    const styleRef = ref<HTMLStyleElement | null>(null);

    const defaultDocument = isClient() ? window.document : undefined;
    const {
        document = defaultDocument,
        immediate = true,
        manual = false,
        name = `style_${++lastId}`,
        id,
        media,
        nonce,
        first = false,
        onMounted: onStyleMounted,
        onUpdated: onStyleUpdated,
        onLoad: onStyleLoaded,
        props = {}
    } = options;

    let stop = () => {};

    const load = (nextCss?: string, nextProps: StyleAttributes = {}) => {
        if (!document) return;

        const attributes = { ...props, ...nextProps };
        const styleName = attributes.name || name;
        const styleId = attributes.id || id;
        const styleNonce = attributes.nonce || nonce;
        const existing =
            document.querySelector<HTMLStyleElement>(`style[data-primevue-style-id="${styleName}"]`) ?? (styleId ? document.getElementById(styleId) : null);
        const style = (existing as HTMLStyleElement | null) ?? document.createElement('style');

        styleRef.value = style;

        if (!style.isConnected) {
            cssRef.value = nextCss || css;

            setAttributes(style, { type: 'text/css', id: styleId, media, nonce: styleNonce });
            if (first) document.head.prepend(style);
            else document.head.appendChild(style);
            setAttribute(style, 'data-primevue-style-id', styleName);
            setAttributes(style, attributes);
            style.onload = (event) => onStyleLoaded?.(event, { name: styleName });
            onStyleMounted?.(styleName);
        }

        if (isLoaded.value) return;

        stop = watch(
            cssRef,
            (value) => {
                if (styleRef.value) styleRef.value.textContent = value;
                onStyleUpdated?.(styleName);
            },
            { immediate: true }
        );

        isLoaded.value = true;
    };

    const unload = () => {
        if (!document || !isLoaded.value) return;

        stop();
        if (styleRef.value && isExist(styleRef.value)) document.head.removeChild(styleRef.value);
        isLoaded.value = false;
        styleRef.value = null;
    };

    if (immediate && !manual) tryOnMounted(load);

    return {
        id,
        name,
        el: styleRef,
        css: cssRef,
        unload,
        load,
        isLoaded: readonly(isLoaded)
    };
}
