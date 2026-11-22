import { h, nextTick, onUnmounted, ref, withDirectives, type Directive } from 'vue';
import { useConfirm, useDialog, useToast } from 'rose-spectacles';
import TerminalService from 'rose-spectacles/terminalservice';
import { component, demo, example, locations, menu, sample, type ComponentName, type Example } from './shared';

function overlay(name: ComponentName, headless = false): Example {
    return example(name, [name], () => {
        const visible = ref(false);
        const close = () => (visible.value = false);
        const content = () => [
            h('p', 'Review these notes before publishing.'),
            h('button', { type: 'button', autofocus: true, 'data-testid': 'overlay-done', onClick: close }, 'Done')
        ];
        return () =>
            h('div', [
                h('button', { type: 'button', 'data-testid': 'overlay-open', onClick: () => (visible.value = true) }, `Open ${name}`),
                demo(
                    name,
                    { visible: visible.value, 'onUpdate:visible': (next: boolean) => (visible.value = next), header: 'Field notes', modal: true },
                    headless
                        ? {
                              container: () => [
                                  ...content(),
                                  h(
                                      'ol',
                                      Array.from({ length: 50 }, (_, index) => h('li', `Field note ${index + 1}`))
                                  )
                              ]
                          }
                        : content
                )
            ]);
    });
}

function anchored(name: ComponentName): Example {
    return example(name, [name], () => {
        const positioner = ref<{ toggle: (event: MouseEvent) => void }>();
        return () =>
            h('div', [
                h('button', { type: 'button', onClick: (event: MouseEvent) => positioner.value?.toggle(event) }, `Open ${name}`),
                demo(name, { ref: positioner }, () => h('p', 'Positioned next to the trigger.'))
            ]);
    });
}

function confirmation(name: 'ConfirmDialog' | 'ConfirmPopup'): Example {
    return example(name, [name, 'ConfirmationService'], () => {
        const confirm = useConfirm();
        const result = ref('');
        return () =>
            h('div', [
                demo(name),
                h(
                    'button',
                    {
                        type: 'button',
                        onClick: (event: MouseEvent) =>
                            confirm.require({
                                target: event.currentTarget as HTMLButtonElement,
                                header: 'Archive note',
                                message: 'Move this note to the archive?',
                                accept: () => (result.value = 'Archived')
                            })
                    },
                    'Archive note'
                ),
                h('output', result.value)
            ]);
    });
}

function directive(name: ComponentName): Directive {
    return component(name) as Directive;
}

export const overlays: Example[] = [
    overlay('Dialog'),
    overlay('Drawer'),
    overlay('Sidebar', true),
    anchored('Popover'),
    anchored('OverlayPanel'),
    example('Popover choice menus', ['Popover', 'Select', 'MultiSelect'], () => {
        const popover = ref<{ show: (event: MouseEvent) => void }>();
        const picker = ref<{ show: () => void }>();
        const multiple = ref(false);
        const openPicker = async (event: MouseEvent, allowMultiple: boolean) => {
            multiple.value = allowMultiple;
            popover.value?.show(event);
            await nextTick();
            picker.value?.show();
        };

        return () =>
            h('div', [
                h(
                    'button',
                    { type: 'button', 'data-testid': 'open-select-popover', onClick: (event: MouseEvent) => openPicker(event, false) },
                    'Choose a city'
                ),
                h(
                    'button',
                    { type: 'button', 'data-testid': 'open-multiselect-popover', onClick: (event: MouseEvent) => openPicker(event, true) },
                    'Choose cities'
                ),
                demo('Popover', { ref: popover, style: { width: 'min(22rem, 90vw)' } }, () =>
                    demo(multiple.value ? 'MultiSelect' : 'Select', {
                        ref: picker,
                        options: locations,
                        optionLabel: 'name',
                        ariaLabel: 'Cities',
                        placeholder: 'Select a city',
                        style: { width: '12rem' }
                    })
                )
            ]);
    }),
    confirmation('ConfirmDialog'),
    confirmation('ConfirmPopup'),
    example('Dynamic dialog', ['DynamicDialog', 'DialogService'], () => {
        const dialog = useDialog();
        return () =>
            h('div', [
                demo('DynamicDialog'),
                h(
                    'button',
                    {
                        type: 'button',
                        onClick: () =>
                            dialog.open({ render: () => h('p', 'Loaded through the dialog service.') }, { props: { header: 'Field notes', modal: true } })
                    },
                    'Open dynamic dialog'
                )
            ]);
    }),
    example('Toast', ['Toast', 'ToastService'], () => {
        const toast = useToast();
        return () =>
            h('div', [
                demo('Toast', { position: 'bottom-right' }),
                h(
                    'button',
                    { type: 'button', onClick: () => toast.add({ severity: 'success', summary: 'Saved', detail: 'Field notes updated', life: 4000 }) },
                    'Show toast'
                )
            ]);
    }),
    example('Context menu', ['ContextMenu'], () => {
        const context = ref<{ show: (event: MouseEvent) => void }>();
        return () =>
            h('div', [
                h(
                    'button',
                    {
                        type: 'button',
                        onContextmenu: (event: MouseEvent) => context.value?.show(event),
                        onClick: (event: MouseEvent) => context.value?.show(event)
                    },
                    'Show actions'
                ),
                demo('ContextMenu', { ref: context, model: menu })
            ]);
    }),
    example(
        'Portal',
        ['Portal'],
        () => () => demo('Portal', { appendTo: 'self' }, () => h('p', 'The portal can render its content locally or in another container.'))
    ),
    example('Badge directive', ['BadgeDirective'], () => () => withDirectives(h('button', { type: 'button' }, 'Messages'), [[directive('BadgeDirective'), 3]])),
    example(
        'Ripple',
        ['Ripple'],
        () => () =>
            withDirectives(h('button', { type: 'button', style: { position: 'relative', overflow: 'hidden' } }, 'Click for ripple'), [[directive('Ripple')]])
    ),
    example(
        'Tooltip',
        ['Tooltip'],
        () => () =>
            withDirectives(h('button', { type: 'button' }, 'Show storage location'), [
                [directive('Tooltip'), 'The notes are stored locally.', undefined, { focus: true }]
            ])
    ),
    example(
        'Key filter',
        ['KeyFilter'],
        () => () =>
            withDirectives(demo('InputText', { 'aria-label': 'Integer only', placeholder: 'Integer only' }), [
                [directive('KeyFilter'), undefined, undefined, { int: true }]
            ])
    ),
    example(
        'Focus trap',
        ['FocusTrap'],
        () => () => withDirectives(h('div', [h('button', 'First focus target'), h('button', 'Last focus target')]), [[directive('FocusTrap')]])
    ),
    example(
        'Style class',
        ['StyleClass'],
        () => () =>
            h('div', [
                withDirectives(h('button', 'Toggle note'), [[directive('StyleClass'), { selector: '@next', toggleClass: 'example-hidden' }]]),
                h('p', 'Visible note')
            ])
    ),
    example(
        'Animate on scroll',
        ['AnimateOnScroll'],
        () => () => withDirectives(h('p', 'This note animates when scrolled into view.'), [[directive('AnimateOnScroll'), { enterClass: 'enter-note' }]])
    ),
    example('Terminal', ['Terminal', 'TerminalService'], () => {
        const run = (command: string) => TerminalService.emit('response', command === 'help' ? 'Commands: help, status' : 'Notes are ready.');
        TerminalService.on('command', run);
        onUnmounted(() => TerminalService.off('command', run));
        return () => demo('Terminal', { welcomeMessage: 'Type help to list actions.', prompt: 'notes $' });
    }),
    example(
        'Scroll top',
        ['ScrollTop'],
        () => () =>
            h('div', { style: { overflow: 'auto', height: '8rem', position: 'relative' }, tabindex: 0, 'aria-label': 'Scrollable field notes' }, [
                h('p', { style: { height: '18rem' } }, 'Scroll this region to reveal the scroll-to-top control.'),
                demo('ScrollTop', { target: 'parent', threshold: 10, behavior: 'instant' })
            ])
    ),
    sample('SplitButton', { label: 'Save', model: menu }),
    example(
        'Speed dial',
        ['SpeedDial'],
        () => () => demo('SpeedDial', { model: menu, direction: 'right', style: { position: 'relative' }, ariaLabel: 'Note actions' })
    )
];
