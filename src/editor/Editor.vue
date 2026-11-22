<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <div role="toolbar" aria-label="Text formatting" :class="cx('toolbar')" v-bind="ptm('toolbar')">
            <slot name="toolbar" :editor="editor">
                <span :class="cx('formats')" v-bind="ptm('formats')">
                    <select
                        v-if="allows('header')"
                        aria-label="Paragraph style"
                        :disabled="toolbarDisabled"
                        :value="headingLevel"
                        v-bind="ptm('header')"
                        @change="setHeading"
                    >
                        <option value="0" v-bind="ptm('option')">Normal</option>
                        <option value="1" v-bind="ptm('option')">Heading</option>
                        <option value="2" v-bind="ptm('option')">Subheading</option>
                    </select>
                    <select v-if="allows('font')" aria-label="Font" :disabled="toolbarDisabled" v-bind="ptm('font')" @change="setFont">
                        <option value="" v-bind="ptm('option')">Default font</option>
                        <option value="serif" v-bind="ptm('option')">Serif</option>
                        <option value="monospace" v-bind="ptm('option')">Monospace</option>
                    </select>
                </span>
                <span :class="cx('formats')" v-bind="ptm('formats')">
                    <button
                        v-if="allows('bold')"
                        type="button"
                        aria-label="Bold"
                        :aria-pressed="isActive('bold')"
                        :disabled="toolbarDisabled"
                        v-bind="ptm('bold')"
                        @click="editor?.chain().focus().toggleBold().run()"
                    >
                        <b>B</b>
                    </button>
                    <button
                        v-if="allows('italic')"
                        type="button"
                        aria-label="Italic"
                        :aria-pressed="isActive('italic')"
                        :disabled="toolbarDisabled"
                        v-bind="ptm('italic')"
                        @click="editor?.chain().focus().toggleItalic().run()"
                    >
                        <i>I</i>
                    </button>
                    <button
                        v-if="allows('underline')"
                        type="button"
                        aria-label="Underline"
                        :aria-pressed="isActive('underline')"
                        :disabled="toolbarDisabled"
                        v-bind="ptm('underline')"
                        @click="editor?.chain().focus().toggleUnderline().run()"
                    >
                        <u>U</u>
                    </button>
                </span>
                <span :class="cx('formats')" v-bind="ptm('formats')">
                    <input v-if="allows('color')" type="color" aria-label="Text color" :disabled="toolbarDisabled" v-bind="ptm('color')" @change="setColor" />
                    <input
                        v-if="allows('background')"
                        type="color"
                        aria-label="Text background"
                        :disabled="toolbarDisabled"
                        v-bind="ptm('background')"
                        @change="setBackground"
                    />
                </span>
                <span :class="cx('formats')" v-bind="ptm('formats')">
                    <button
                        v-if="allows('list')"
                        type="button"
                        aria-label="Numbered list"
                        :aria-pressed="isActive('orderedList')"
                        :disabled="toolbarDisabled"
                        v-bind="ptm('list')"
                        @click="editor?.chain().focus().toggleOrderedList().run()"
                    >
                        1.
                    </button>
                    <button
                        v-if="allows('list')"
                        type="button"
                        aria-label="Bullet list"
                        :aria-pressed="isActive('bulletList')"
                        :disabled="toolbarDisabled"
                        v-bind="ptm('list')"
                        @click="editor?.chain().focus().toggleBulletList().run()"
                    >
                        • List
                    </button>
                    <select v-if="allows('align')" aria-label="Text alignment" :disabled="toolbarDisabled" v-bind="ptm('select')" @change="setAlignment">
                        <option value="left" v-bind="ptm('option')">Left</option>
                        <option value="center" v-bind="ptm('option')">Center</option>
                        <option value="right" v-bind="ptm('option')">Right</option>
                        <option value="justify" v-bind="ptm('option')">Justify</option>
                    </select>
                </span>
                <span :class="cx('formats')" v-bind="ptm('formats')">
                    <button v-if="allows('link')" type="button" :disabled="toolbarDisabled" v-bind="ptm('link')" @click="openLink">Link</button>
                    <button v-if="allows('image')" type="button" :disabled="toolbarDisabled" v-bind="ptm('image')" @click="chooseImage">Image</button>
                    <input v-if="allows('image')" ref="imageInput" type="file" accept="image/*" hidden @change="insertImage" />
                    <button
                        v-if="allows('code-block')"
                        type="button"
                        aria-label="Code block"
                        :aria-pressed="isActive('codeBlock')"
                        :disabled="toolbarDisabled"
                        v-bind="ptm('codeBlock')"
                        @click="editor?.chain().focus().toggleCodeBlock().run()"
                    >
                        Code
                    </button>
                    <button type="button" :disabled="toolbarDisabled" v-bind="ptm('clean')" @click="editor?.chain().focus().unsetAllMarks().clearNodes().run()">
                        Clear formatting
                    </button>
                </span>
                <span v-if="linkOpen" :class="cx('formats')" v-bind="ptm('formats')">
                    <input
                        ref="linkInput"
                        v-model="linkURL"
                        type="url"
                        aria-label="Link address"
                        @keydown.enter.prevent="applyLink"
                        @keydown.esc.prevent="closeLink"
                    />
                    <button type="button" :disabled="toolbarDisabled" @click="applyLink">Apply link</button>
                    <button type="button" @click="closeLink">Cancel</button>
                </span>
            </slot>
        </div>
        <div
            ref="editorElement"
            :class="cx('content')"
            :style="editorStyle"
            :data-placeholder="placeholder || undefined"
            :data-empty="editorEmpty || undefined"
            v-bind="ptm('content')"
        ></div>
    </div>
</template>

<script lang="ts">
import type { Editor as TiptapEditor, EditorEvents } from '@tiptap/core';
import { defineComponent, shallowRef } from 'vue';
import BaseEditor from './BaseEditor.vue';

type EditorRange = { from: number; to: number };

export default defineComponent({
    name: 'Editor',
    extends: BaseEditor,
    inheritAttrs: false,
    emits: ['text-change', 'selection-change', 'load'],
    data() {
        return {
            editor: shallowRef<TiptapEditor | null>(null),
            editorEmpty: true,
            editorRevision: 0,
            previousRange: null as EditorRange | null,
            linkOpen: false,
            linkURL: ''
        };
    },
    computed: {
        toolbarDisabled() {
            return !this.editor || this.readonly || this.disabled;
        },
        headingLevel(): number {
            return this.editorRevision ? (this.editor?.getAttributes('heading').level ?? 0) : 0;
        }
    },
    watch: {
        d_value(value) {
            const html = typeof value === 'string' ? value : '';
            if (this.editor && html !== this.htmlValue(this.editor)) this.editor.commands.setContent(html, { emitUpdate: false });
        },
        readonly() {
            this.updateEditable();
        },
        disabled() {
            this.updateEditable();
        }
    },
    async mounted() {
        const element = this.$refs.editorElement as HTMLElement;
        const { Editor, editorExtensions } = await import('./extensions');
        if (this.$refs.editorElement !== element) return;

        this.editor = new Editor({
            element,
            content: typeof this.d_value === 'string' ? this.d_value : '',
            editable: !this.readonly && !this.disabled,
            extensions: editorExtensions(this.formats, this.extensions),
            editorProps: {
                attributes: {
                    role: 'textbox',
                    'aria-multiline': 'true',
                    'aria-label': this.$attrs['aria-label']?.toString() ?? this.name ?? 'Rich text editor'
                }
            },
            onTransaction: ({ editor }) => {
                this.editorRevision++;
                this.editorEmpty = editor.isEmpty;
            },
            onUpdate: (event) => this.onEditorUpdate(event),
            onSelectionUpdate: ({ editor }) => this.onEditorSelection(editor, editor.state.selection),
            onFocus: ({ editor }) => this.onEditorSelection(editor, editor.state.selection),
            onBlur: ({ editor, event }) => {
                this.onEditorSelection(editor, null);
                this.formField.onBlur?.(event);
            }
        });
        this.editorEmpty = this.editor.isEmpty;
        this.editorRevision++;
        this.$emit('load', { instance: this.editor });
    },
    beforeUnmount() {
        this.editor?.destroy();
        this.editor = null;
    },
    methods: {
        htmlValue(editor: TiptapEditor) {
            return editor.isEmpty ? '' : editor.getHTML();
        },
        onEditorUpdate({ editor, transaction }: EditorEvents['update']) {
            const htmlValue = this.htmlValue(editor);
            this.writeValue(htmlValue, undefined, true);
            this.$emit('text-change', { htmlValue, textValue: editor.getText().trim(), transaction, instance: editor });
        },
        onEditorSelection(editor: TiptapEditor, selection: EditorRange | null) {
            const oldRange = this.previousRange;
            const range = selection && { from: selection.from, to: selection.to };
            if (range?.from === oldRange?.from && range?.to === oldRange?.to) return;
            this.previousRange = range;
            this.$emit('selection-change', { htmlValue: this.htmlValue(editor), textValue: editor.getText().trim(), range, oldRange, instance: editor });
        },
        updateEditable() {
            this.editor?.setEditable(!this.readonly && !this.disabled, false);
        },
        allows(format: string) {
            return !this.formats || this.formats.includes(format);
        },
        isActive(name: string) {
            return this.editorRevision > 0 && !!this.editor?.isActive(name);
        },
        setHeading(event: Event) {
            const level = (event.target as HTMLSelectElement).value;
            const chain = this.editor?.chain().focus();
            if (level === '1' || level === '2') chain?.setHeading({ level: level === '1' ? 1 : 2 }).run();
            else chain?.setParagraph().run();
        },
        setFont(event: Event) {
            const value = (event.target as HTMLSelectElement).value;
            const chain = this.editor?.chain().focus();
            if (value) chain?.setFontFamily(value).run();
            else chain?.unsetFontFamily().run();
        },
        setColor(event: Event) {
            this.editor
                ?.chain()
                .focus()
                .setColor((event.target as HTMLInputElement).value)
                .run();
        },
        setBackground(event: Event) {
            this.editor
                ?.chain()
                .focus()
                .setBackgroundColor((event.target as HTMLInputElement).value)
                .run();
        },
        setAlignment(event: Event) {
            this.editor
                ?.chain()
                .focus()
                .setTextAlign((event.target as HTMLSelectElement).value)
                .run();
        },
        async openLink() {
            this.linkURL = this.editor?.getAttributes('link').href ?? '';
            this.linkOpen = true;
            await this.$nextTick();
            (this.$refs.linkInput as HTMLInputElement | undefined)?.focus();
        },
        applyLink() {
            const address = this.linkURL.trim();
            const chain = this.editor?.chain().focus().extendMarkRange('link');
            const applied = address ? chain?.setLink({ href: address }).run() : chain?.unsetLink().run();
            if (applied) this.linkOpen = false;
        },
        closeLink() {
            this.linkOpen = false;
            this.editor?.commands.focus();
        },
        chooseImage() {
            (this.$refs.imageInput as HTMLInputElement | undefined)?.click();
        },
        insertImage(event: Event) {
            const input = event.target as HTMLInputElement;
            const file = input.files?.[0];
            input.value = '';
            if (!file || !file.type.startsWith('image/')) return;

            const editor = this.editor;
            const reader = new FileReader();
            reader.onload = () => {
                if (editor && editor === this.editor && !this.toolbarDisabled && typeof reader.result === 'string') {
                    editor.chain().focus().setImage({ src: reader.result, alt: file.name }).run();
                }
            };
            reader.readAsDataURL(file);
        }
    }
});
</script>
