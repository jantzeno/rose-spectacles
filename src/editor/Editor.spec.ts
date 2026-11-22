import { flushPromises, mount } from '@vue/test-utils';
import type { EditorLoadEvent, EditorTextChangeEvent } from './Editor.d';
import Editor from './Editor.vue';
import './extensions';

it('loads HTML and emits native transactions when edited without echoing model updates', async () => {
    const wrapper = mount(Editor, { props: { modelValue: '<p>Draft</p>' } });
    try {
        await flushPromises();
        const event = wrapper.emitted<[EditorLoadEvent]>('load')?.[0]?.[0];
        expect(event?.instance.getHTML()).toBe('<p>Draft</p>');
        event?.instance.commands.insertContent('New ');
        expect(wrapper.emitted('update:modelValue')).toEqual([['<p>New Draft</p>']]);
        const update = wrapper.emitted<[EditorTextChangeEvent]>('text-change')?.[0]?.[0];
        expect(update?.textValue).toBe('New Draft');
        expect(update?.htmlValue).toBe('<p>New Draft</p>');
        expect(update?.instance).toBe(event?.instance);
        expect(update?.transaction.docChanged).toBe(true);

        await wrapper.setProps({ modelValue: '<p>Replaced</p>', readonly: true });
        expect(event?.instance.getHTML()).toBe('<p>Replaced</p>');
        expect(wrapper.get('.tiptap').attributes('contenteditable')).toBe('false');
        expect(wrapper.get('button[aria-label="Bullet list"]').attributes('disabled')).toBeDefined();
        expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
        expect(wrapper.emitted('text-change')).toHaveLength(1);
    } finally {
        wrapper.unmount();
    }
});

it('combines the initial value, format whitelist, and Tiptap toolbar slot', async () => {
    const wrapper = mount(Editor, {
        props: { defaultValue: '<p>Initial</p>', formats: ['bold'] },
        slots: { toolbar: '<span>{{ editor?.getText() }}</span>' }
    });
    await flushPromises();
    const editor = wrapper.emitted<[EditorLoadEvent]>('load')?.[0]?.[0].instance;

    expect(wrapper.get('[role="toolbar"]').text()).toBe('Initial');
    expect(editor?.schema.marks).toHaveProperty('bold');
    expect(editor?.schema.marks).not.toHaveProperty('italic');
    wrapper.unmount();
    expect(editor?.isDestroyed).toBe(true);
});
