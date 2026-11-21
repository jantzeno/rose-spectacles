<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <div ref="toolbarElement" :class="cx('toolbar')" v-bind="ptm('toolbar')">
            <slot name="toolbar">
                <span class="ql-formats" v-bind="ptm('formats')">
                    <select class="ql-header" defaultValue="0" v-bind="ptm('header')">
                        <option value="1" v-bind="ptm('option')">Heading</option>
                        <option value="2" v-bind="ptm('option')">Subheading</option>
                        <option value="0" v-bind="ptm('option')">Normal</option>
                    </select>
                    <select class="ql-font" v-bind="ptm('font')">
                        <option v-bind="ptm('option')"></option>
                        <option value="serif" v-bind="ptm('option')"></option>
                        <option value="monospace" v-bind="ptm('option')"></option>
                    </select>
                </span>
                <span class="ql-formats" v-bind="ptm('formats')">
                    <button class="ql-bold" type="button" v-bind="ptm('bold')"></button>
                    <button class="ql-italic" type="button" v-bind="ptm('italic')"></button>
                    <button class="ql-underline" type="button" v-bind="ptm('underline')"></button>
                </span>
                <span class="ql-formats" v-bind="ptm('formats')">
                    <select class="ql-color" v-bind="ptm('color')"></select>
                    <select class="ql-background" v-bind="ptm('background')"></select>
                </span>
                <span class="ql-formats" v-bind="ptm('formats')">
                    <button class="ql-list" value="ordered" type="button" v-bind="ptm('list')"></button>
                    <button class="ql-list" value="bullet" type="button" v-bind="ptm('list')"></button>
                    <select class="ql-align" v-bind="ptm('select')">
                        <option defaultValue v-bind="ptm('option')"></option>
                        <option value="center" v-bind="ptm('option')"></option>
                        <option value="right" v-bind="ptm('option')"></option>
                        <option value="justify" v-bind="ptm('option')"></option>
                    </select>
                </span>
                <span class="ql-formats" v-bind="ptm('formats')">
                    <button class="ql-link" type="button" v-bind="ptm('link')"></button>
                    <button class="ql-image" type="button" v-bind="ptm('image')"></button>
                    <button class="ql-code-block" type="button" v-bind="ptm('codeBlock')"></button>
                </span>
                <span class="ql-formats" v-bind="ptm('formats')">
                    <button class="ql-clean" type="button" v-bind="ptm('clean')"></button>
                </span>
            </slot>
        </div>
        <div ref="editorElement" :class="cx('content')" :style="editorStyle" v-bind="ptm('content')"></div>
    </div>
</template>

<script lang="ts">
import type Quill from 'quill';
import type { Delta, EmitterSource, QuillOptions, Range } from 'quill';
import { defineComponent, shallowRef } from 'vue';
import { isExist } from '../internal/utils/dom/index';
import BaseEditor from './BaseEditor.vue';

const QuillJS = typeof window !== 'undefined' ? (window as Window & { Quill?: typeof Quill }).Quill : undefined;

export default defineComponent({
    name: 'Editor',
    extends: BaseEditor,
    inheritAttrs: false,
    emits: ['text-change', 'selection-change', 'load'],
    setup() {
        return { quill: shallowRef<Quill | null>(null), detachQuillHandlers: shallowRef<(() => void) | null>(null) };
    },
    watch: {
        modelValue(newValue, oldValue) {
            if (newValue !== oldValue && this.quill && !this.quill.hasFocus()) {
                this.renderValue(newValue);
            }
        },
        d_value(newValue, oldValue) {
            if (newValue !== oldValue && this.quill && !this.quill.hasFocus()) {
                this.renderValue(newValue);
            }
        },
        readonly() {
            this.handleReadOnlyChange();
        }
    },
    mounted() {
        const configuration: QuillOptions = {
            modules: {
                toolbar: this.$refs.toolbarElement as HTMLElement,
                ...this.modules
            },
            readOnly: this.readonly,
            theme: 'snow',
            formats: this.formats,
            placeholder: this.placeholder
        };
        if (QuillJS) {
            // Loaded by script only
            this.quill = new QuillJS(this.$refs.editorElement as HTMLElement, configuration);
            this.initQuill();
            this.handleLoad();
        } else {
            import('quill')
                .then((module) => {
                    if (module && isExist(this.$refs.editorElement as Node)) {
                        if (module.default) {
                            // webpack
                            this.quill = new module.default(this.$refs.editorElement as HTMLElement, configuration);
                        } else {
                            // parceljs
                            this.quill = new (module as unknown as typeof Quill)(this.$refs.editorElement as HTMLElement, configuration);
                        }

                        this.initQuill();
                    }
                })
                .then(() => {
                    this.handleLoad();
                });
        }
    },
    beforeUnmount() {
        this.detachQuillHandlers?.();
        this.quill = null;
    },
    methods: {
        renderValue(value: string | null | undefined) {
            if (this.quill) {
                if (value) {
                    const delta = this.quill.clipboard.convert({ html: value });
                    this.quill.setContents(delta);
                } else {
                    this.quill.setText('');
                }
            }
        },
        initQuill() {
            const quill = this.quill;
            if (!quill) return;

            this.renderValue(this.d_value);

            const onTextChange = (delta: Delta, _oldContents: Delta, source: EmitterSource) => {
                if (source === 'user') {
                    let html = quill.getSemanticHTML();
                    let text = quill.getText().trim();

                    if (html === '<p><br></p>') {
                        html = '';
                    }

                    this.writeValue(html, undefined);
                    this.$emit('text-change', {
                        htmlValue: html,
                        textValue: text,
                        delta: delta,
                        source: source,
                        instance: this.quill
                    });
                }
            };

            const onSelectionChange = (range: Range | null, oldRange: Range | null, source: EmitterSource) => {
                let html = quill.getSemanticHTML();
                let text = quill.getText().trim();

                this.$emit('selection-change', {
                    htmlValue: html,
                    textValue: text,
                    range: range,
                    oldRange: oldRange,
                    source: source,
                    instance: this.quill
                });
            };

            quill.on('text-change', onTextChange);
            quill.on('selection-change', onSelectionChange);
            this.detachQuillHandlers = () => {
                quill.off('text-change', onTextChange);
                quill.off('selection-change', onSelectionChange);
            };
        },
        handleLoad() {
            if (this.quill && this.quill.getModule('toolbar')) {
                this.$emit('load', { instance: this.quill });
            }
        },
        handleReadOnlyChange() {
            if (this.quill) this.quill.enable(!this.readonly);
        }
    }
});
</script>
