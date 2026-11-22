import { Editor, type AnyExtension } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';

export { Editor };

export function editorExtensions(formats?: string[], additional?: AnyExtension[]): AnyExtension[] {
    const allows = (format: string) => !formats || formats.includes(format);
    const list = allows('list');

    return [
        StarterKit.configure({
            heading: allows('header') ? { levels: [1, 2, 3, 4, 5, 6] } : false,
            bold: allows('bold') && {},
            italic: allows('italic') && {},
            underline: allows('underline') && {},
            strike: allows('strike') && {},
            blockquote: allows('blockquote') && {},
            code: allows('code') && {},
            codeBlock: allows('code-block') && {},
            link: allows('link') && { openOnClick: false },
            bulletList: list && {},
            orderedList: list && {},
            listItem: list && {},
            listKeymap: list && {}
        }),
        TextStyleKit.configure({
            fontFamily: allows('font') && {},
            color: allows('color') && {},
            backgroundColor: allows('background') && {},
            fontSize: allows('size') && {}
        }),
        ...(allows('align') ? [TextAlign.configure({ types: ['heading', 'paragraph'] })] : []),
        ...(allows('image') ? [Image.configure({ allowBase64: true })] : []),
        ...(additional ?? [])
    ];
}
