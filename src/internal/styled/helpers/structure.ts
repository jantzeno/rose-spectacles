import { dt } from './dt';

const accent = 'var(--rs-primary-color, AccentColor)';
const accentText = 'var(--rs-primary-contrast-color, AccentColorText)';
const surface = 'var(--rs-content-background, Canvas)';
const border = 'var(--rs-content-border-color, color-mix(in srgb, CanvasText 20%, transparent))';
const subtle = 'color-mix(in srgb, CanvasText 7%, transparent)';
const selected = 'var(--rs-highlight-background, color-mix(in srgb, ' + accent + ' 14%, transparent))';
const muted = 'var(--rs-text-muted-color, color-mix(in srgb, CanvasText 72%, Canvas))';

const defaults: Record<string, string> = {
    'accordion.content.border.width': '0',
    'accordion.header.border.width': '0',
    'accordion.header.first.border.width': '0',
    'avatar.group.offset': '-0.625rem',
    'avatar.lg.group.offset': '-0.875rem',
    'avatar.xl.group.offset': '-1rem',
    'badge.dot.size': '0.5rem',
    'badge.padding': '0.125rem 0.5rem',
    'border.radius.md': '0.5rem',
    'button.badge.size': '1.25rem',
    'card.body.padding': '1rem',
    'card.title.font.size': '1.125rem',
    'carousel.indicator.height': '0.375rem',
    'carousel.indicator.width': '1.25rem',
    'checkbox.background': surface,
    'checkbox.border.radius': '0.25rem',
    'checkbox.checked.background': accent,
    'checkbox.checked.border.color': accent,
    'checkbox.icon.checked.color': accentText,
    'chip.image.height': '1.5rem',
    'chip.image.width': '1.5rem',
    'chip.padding.x': '0.625rem',
    'chip.padding.y': '0.25rem',
    'confirmpopup.arrow.offset': '0.5rem',
    'confirmpopup.arrow.left': '1rem',
    'datatable.column.resizer.width': '0.5rem',
    'datatable.footer.border.width': '1px 0 0',
    'datatable.header.border.width': '0 0 1px',
    'datatable.paginator.bottom.border.width': '1px 0 0',
    'datatable.paginator.top.border.width': '0 0 1px',
    'datatable.resize.indicator.width': '1px',
    'dataview.border.width': '0',
    'dataview.content.border.width': '0',
    'dataview.paginator.bottom.border.width': '1px 0 0',
    'dataview.paginator.top.border.width': '0 0 1px',
    'datepicker.date.height': '2rem',
    'datepicker.date.width': '2rem',
    'dialog.content.padding': '0 1rem 1rem',
    'dialog.footer.padding': '0 1rem 1rem',
    'dialog.header.padding': '1rem',
    'dialog.shadow': '0 14px 40px rgb(0 0 0 / 14%)',
    'dialog.title.font.size': '1.125rem',
    'divider.horizontal.margin': '0.75rem 0',
    'divider.vertical.margin': '0 0.75rem',
    'dock.item.size': '2.5rem',
    'drawer.title.font.size': '1.125rem',
    'drawer.shadow': '0 14px 40px rgb(0 0 0 / 14%)',
    'fileupload.progressbar.height': '0.375rem',
    'floatlabel.in.active.top': '0.4rem',
    'floatlabel.in.input.padding.bottom': '0.35rem',
    'floatlabel.in.input.padding.top': '1.25rem',
    'floatlabel.on.active.background': surface,
    'floatlabel.on.active.padding': '0 0.25rem',
    'floatlabel.over.active.top': '-1rem',
    'floatlabel.position.x': '0.75rem',
    'floatlabel.position.y': '0.65rem',
    'floatlabel.active.font.size': '0.75rem',
    'galleria.indicator.button.height': '0.625rem',
    'galleria.indicator.button.width': '0.625rem',
    'galleria.thumbnail.nav.button.size': '2rem',
    'icon.size': '1rem',
    'iftalabel.font.size': '0.75rem',
    'iftalabel.input.padding.bottom': '0.35rem',
    'iftalabel.input.padding.top': '1.25rem',
    'iftalabel.position.x': '0.75rem',
    'iftalabel.top': '0.4rem',
    'image.action.size': '2.25rem',
    'image.toolbar.background': surface,
    'image.toolbar.position.bottom': 'auto',
    'image.toolbar.position.left': 'auto',
    'image.toolbar.position.right': '1rem',
    'image.toolbar.position.top': '1rem',
    'imagecompare.handle.border.style': 'solid',
    'imagecompare.handle.size': '2rem',
    'imagecompare.handle.hover.size': '2.25rem',
    'inputgroup.addon.min.width': '2.5rem',
    'inputnumber.button.width': '2.25rem',
    'inputotp.input.width': '2.5rem',
    'inputotp.input.sm.width': '2rem',
    'inputotp.input.lg.width': '3rem',
    'mask.background': 'color-mix(in srgb, CanvasText 38%, transparent)',
    'metergroup.label.marker.size': '0.65rem',
    'metergroup.meters.size': '0.5rem',
    'organizationchart.connector.height': '1.25rem',
    'overlaybadge.outline.width': '2px',
    'paginator.jump.to.page.input.max.width': '4rem',
    'password.meter.height': '0.375rem',
    'popover.arrow.offset': '0.5rem',
    'popover.arrow.left': '1rem',
    'popover.shadow': '0 8px 24px rgb(0 0 0 / 12%)',
    'progressbar.height': '0.75rem',
    'progressbar.value.background': accent,
    'radiobutton.background': surface,
    'radiobutton.checked.background': accent,
    'radiobutton.checked.border.color': accent,
    'radiobutton.icon.checked.color': accentText,
    'scrollpanel.bar.size': '0.5rem',
    'scrollpanel.barfocus.ring.offset': '2px',
    'scrollpanel.barfocus.ring.width': '2px',
    'skeleton.background': subtle,
    'skeleton.animation.background': 'color-mix(in srgb, Canvas 50%, transparent)',
    'slider.handle.background': accent,
    'slider.handle.content.height': '0.625rem',
    'slider.handle.content.width': '0.625rem',
    'slider.handle.height': '1rem',
    'slider.handle.width': '1rem',
    'slider.range.background': accent,
    'slider.track.background': border,
    'slider.track.size': '0.375rem',
    'splitter.handle.size': '1.5rem',
    'stepper.separator.size': '2px',
    'stepper.step.number.size': '2rem',
    'tabs.active.bar.background': accent,
    'tabs.active.bar.bottom': '0',
    'tabs.active.bar.height': '2px',
    'tabs.tab.border.width': '0 0 2px',
    'tabs.tablist.border.width': '0 0 1px',
    'terminal.height': '16rem',
    'timeline.event.connector.size': '2px',
    'timeline.event.marker.size': '1.125rem',
    'timeline.event.marker.content.size': '0.5rem',
    'timeline.event.min.height': '4rem',
    'toast.width': 'min(24rem, calc(100vw - 2rem))',
    'toggleswitch.checked.background': accent,
    'toggleswitch.handle.background': surface,
    'toggleswitch.handle.size': '1rem',
    'toggleswitch.height': '1.375rem',
    'toggleswitch.slide.duration': '150ms',
    'toggleswitch.width': '2.5rem',
    'tooltip.max.width': '20rem',
    'tree.indent': '1.25rem',
    'treetable.column.resizer.width': '0.5rem',
    'treetable.resize.indicator.width': '1px'
};

const groupDefaults: Record<string, string> = {
    'border.width': '1px',
    'border.radius': '0.5rem',
    'focus.ring.color': accent,
    'focus.ring.offset': '2px',
    'focus.ring.style': 'solid',
    'focus.ring.width': '2px',
    'transition.duration': '150ms'
};

function sizeFor(path: string): string | undefined {
    const small = path.includes('.sm.');
    const large = path.includes('.lg.');
    if (/\.(?:icon\.only|dropdown|nav\.button|toggle\.button|close\.button|mobile\.button|image\.action)\.(?:sm\.|lg\.)?(?:height|width|size)$/.test(path)) {
        return small ? '1.875rem' : large ? '2.75rem' : '2.25rem';
    }
    if (/^(checkbox|radiobutton|colorpicker)\./.test(path) && /\.(?:height|width)$/.test(path)) return small ? '0.95rem' : large ? '1.375rem' : '1.125rem';
    if (/^avatar\./.test(path) && /\.(?:height|width)$/.test(path)) return path.includes('.xl.') ? '3rem' : large ? '2.5rem' : '2rem';
    if (/^badge\./.test(path) && /\.(?:height|min\.width)$/.test(path)) return small ? '1rem' : '1.35rem';
    if (/\.icon(?:\.(?:sm|lg))?\.size$/.test(path)) return '1rem';
    if (path.endsWith('.font.size')) return large ? '1.125rem' : small ? '0.875rem' : '0.95rem';
}

function backgroundFor(path: string): string {
    if (path.endsWith('.mask.background')) return defaults['mask.background'];
    if (path.startsWith('button.primary.')) return accent;
    if (/\.(?:selected|highlight|checked|active)\./.test(path)) return selected;
    if (/\.(?:hover|focus|focused|striped|filled|disabled)\./.test(path)) return subtle;
    if (/\.(?:overlay|panel)\.background$/.test(path)) return surface;
    if (/^(?:toast|dialog|drawer|tooltip|panel|card|popover|confirmpopup|listbox)\./.test(path)) return surface;
    if (/^(?:inputtext|inputnumber|select|multiselect|treeselect|textarea|autocomplete|datepicker|cascadeselect)\.background$/.test(path)) return surface;
    if (/^(?:badge|chip|message|tag|progressbar|toggleswitch)\./.test(path)) return subtle;
    return 'transparent';
}

function structureFallback(path: string): string | undefined {
    if (Object.hasOwn(defaults, path)) return defaults[path];

    for (const [part, value] of Object.entries(groupDefaults)) {
        if (path === part || path.endsWith('.' + part)) return value;
    }

    if (path.endsWith('.padding.x')) return path.includes('.sm.') ? '0.55rem' : '0.75rem';
    if (path.endsWith('.padding.y')) return path.includes('.sm.') ? '0.375rem' : '0.5rem';
    if (path.endsWith('.padding')) return /\.(?:item|option|tab|date)\.padding$/.test(path) ? '0.5rem 0.75rem' : '0.75rem';
    if (path.endsWith('.gap') || path.endsWith('.margin')) return '0.5rem';
    if (/\.gutter(?:\.start|\.end)?$/.test(path)) return '0.5rem';
    if (path.endsWith('.indent')) return '1rem';
    if (path.endsWith('.font.weight')) return '600';
    if (path.endsWith('.shadow')) return 'none';
    if (path.endsWith('.blur')) return '0px';
    if (path.endsWith('.opacity')) return '0.55';
    if (path.endsWith('.background')) return backgroundFor(path);
    if (path.endsWith('.border.color')) return path.startsWith('button.primary.') ? accent : border;
    if (path.endsWith('.color')) {
        if (path.startsWith('button.primary.')) return accentText;
        if (/\.(?:muted|placeholder|disabled|helper|icon)\.color$/.test(path)) return muted;
        return 'inherit';
    }
    if (path.startsWith('progressspinner.color')) return accent;

    return sizeFor(path);
}

export function structuralDt(path: string, fallback?: string, type?: string) {
    // A supplied value or component token keeps precedence over the structural default.
    return dt(path, fallback ?? structureFallback(path), type);
}
