import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const style = /*css*/ `
    .rs-editor-toolbar, .rs-editor-formats {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.375rem;
    }

    .rs-editor-toolbar {
        padding: 0.375rem;
        border: 1px solid dt('editor.toolbar.border.color');
    }

    .rs-editor-formats:empty {
        display: none;
    }

    .rs-editor-toolbar button[aria-pressed='true'] {
        font-weight: bold;
        text-decoration: underline;
    }

    .rs-editor-content {
        border: 1px solid dt('editor.content.border.color');
        overflow-wrap: anywhere;
    }

    .rs-editor-content .tiptap {
        box-sizing: border-box;
        min-height: inherit;
        padding: 0.75rem;
    }

    .rs-editor-content[data-placeholder] {
        position: relative;
    }

    .rs-editor-content[data-empty][data-placeholder]::before {
        content: attr(data-placeholder);
        position: absolute;
        inset: 0.75rem auto auto 0.75rem;
        pointer-events: none;
        opacity: 0.65;
    }

    .rs-editor-content .tiptap p:first-child {
        margin-block-start: 0;
    }

    .rs-editor-content .tiptap ul {
        list-style: disc;
        padding-inline-start: 1.5rem;
    }

    .rs-editor-content .tiptap ol {
        list-style: decimal;
        padding-inline-start: 1.5rem;
    }

    .rs-editor-content .tiptap img {
        max-width: 100%;
        height: auto;
    }
`;

const classes = {
    root: ({ instance }: StyleContext) => [
        'rs-editor',
        {
            'rs-invalid': instance.$invalid
        }
    ],
    toolbar: 'rs-editor-toolbar',
    formats: 'rs-editor-formats',
    content: 'rs-editor-content'
};

export default BaseStyle.extend({
    name: 'editor',
    style,
    classes
});
