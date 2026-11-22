import { mount, type VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import RoseSpectacles from 'rose-spectacles/config';
import ConfirmationService from 'rose-spectacles/confirmationservice';
import DialogService from 'rose-spectacles/dialogservice';
import ToastService from 'rose-spectacles/toastservice';
import { catalog, idFor } from './catalog';
import { demo, type Example } from './examples/shared';
import manifest from '../package.json';

const examples = Object.values(catalog).flat();
const declared = new Set(examples.flatMap(({ names }) => names));

describe('catalog coverage', () => {
    it('gives every public component its own example or a role in a compound example', () => {
        const coveredPaths = new Set([...declared].map((name) => name.toLowerCase()));
        const getPath = (entry: (typeof manifest.exports)[keyof typeof manifest.exports]) =>
            typeof entry === 'string' ? entry : 'default' in entry ? entry.default : undefined;

        const missing = Object.entries(manifest.exports).filter(([key, entry]) => {
            const path = getPath(entry);
            if (!path?.endsWith('.vue') || key.startsWith('./core/')) return false;
            if (key.startsWith('./icons/')) return !coveredPaths.has(`${key.split('/').at(-1)}icon`) && key !== './icons/baseicon';
            return !coveredPaths.has(key.split('/').at(-1) ?? '');
        });

        expect(missing.map(([key]) => key)).toEqual([]);
        expect(new Set(examples.map(({ name }) => idFor(name))).size).toBe(examples.length);
    });

    const iconEntries = catalog.Icons.filter(({ name }) => name !== 'Base icon');
    for (const icon of iconEntries) {
        it(`draws the ${icon.name} glyph and exposes its label to assistive technology`, () => {
            const name = icon.names[0];
            const wrapper = mount({ render: () => demo(name, { label: 'Note action', spin: true }) });

            try {
                const svg = wrapper.get('svg');
                expect(svg.get('path, circle, rect, g').element.namespaceURI).toBe('http://www.w3.org/2000/svg');
                expect(svg.attributes('role')).toBe('img');
                expect(svg.attributes('aria-label')).toBe('Note action');
                expect(svg.classes()).toContain('rs-icon-spin');
            } finally {
                wrapper.unmount();
            }
        });
    }

    it('lets BaseIcon subclasses provide an accessible custom glyph', () => {
        return mountCase('Base icon', (wrapper) => {
            expect(wrapper.get('svg').attributes('aria-label')).toBe('Diamond');
            expect(wrapper.get('svg path').attributes('d')).toContain('7 13');
        });
    });
});

function findExample(name: string): Example {
    const entry = examples.find((item) => item.name === name);
    if (!entry) throw new Error(`Unknown gallery example ${name}`);

    return entry;
}

async function mountCase(name: string, run: (wrapper: VueWrapper) => void | Promise<void>) {
    const wrapper = mount(
        { setup: findExample(name).setup },
        { attachTo: document.body, global: { plugins: [RoseSpectacles, ConfirmationService, DialogService, ToastService] } }
    );

    try {
        await nextTick();
        await run(wrapper);
    } finally {
        wrapper.unmount();
    }
}

describe('compound gallery examples', () => {
    it('connects an AccordionHeader to its AccordionContent through the AccordionPanel', async () => {
        await mountCase('Accordion', async (wrapper) => {
            const header = wrapper.get('button');
            expect(header.attributes('aria-expanded')).toBe('true');
            expect(header.attributes('aria-controls')).toBe(wrapper.get('[role="region"]').attributes('id'));

            await header.trigger('click');
            expect(header.attributes('aria-expanded')).toBe('false');
        });
    });

    it('switches TabPanels when a different Tab in the TabList is activated', async () => {
        await mountCase('Tabs', async (wrapper) => {
            const list = wrapper.get('[role="tablist"]');
            const [notes, details] = list.findAll('[role="tab"]');
            expect(notes.attributes('aria-selected')).toBe('true');
            expect(details.attributes('aria-selected')).toBe('false');

            await details.trigger('click');
            const panel = wrapper.findAll('[role="tabpanel"]').find((element) => element.isVisible());

            expect(details.attributes('aria-selected')).toBe('true');
            expect(panel?.attributes('id')).toBe(details.attributes('aria-controls'));
            expect(panel?.text()).toBe('Collected after sunrise.');
        });
    });

    it('shows content inside the selected vertical StepItem', async () => {
        await mountCase('Vertical stepper', async (wrapper) => {
            expect(wrapper.text()).toContain('Write your notes.');
            await wrapper
                .findAll('button')
                .find((button) => button.text() === 'Review')
                ?.trigger('click');
            expect(wrapper.text()).toContain('Check your notes.');
        });
    });

    it('keeps RadioButton selection exclusive inside a RadioButtonGroup', async () => {
        await mountCase('Radio button group', async (wrapper) => {
            const [daily, weekly] = wrapper.findAll<HTMLInputElement>('input[type="radio"]');
            expect(weekly.element.checked).toBe(true);
            await daily.setValue(true);
            expect(daily.element.checked).toBe(true);
            expect(weekly.element.checked).toBe(false);
        });
    });

    it('submits the field value through the Form submit event', async () => {
        await mountCase('Form and field', async (wrapper) => {
            await wrapper.get('input').setValue('Revised journal');
            await wrapper.get('form').trigger('submit');
            await nextTick();
            expect(wrapper.get('output').text()).toBe('Revised journal');
        });
    });
});

const examplesWithSelectors = [
    ['Button group', 'button', ['Previous', 'Next']],
    ['Checkbox group', 'label', ['maps', 'notes']],
    ['Input group', '.rs-inputgroupaddon', ['https://']],
    ['Icon field', '.rs-inputicon svg', ['']],
    ['Ifta label', 'label', ['Title']],
    ['Float label', 'label', ['Title']],
    ['Dock', 'a', ['O', 'A', 'S']],
    ['MeterGroup', '.rs-metergroup-label', ['Draft (30%)', 'Review (25%)']],
    ['Overlay badge', '.rs-badge', ['3']],
    ['Portal', 'p', ['The portal can render its content locally or in another container.']],
    ['Toolbar', 'button, .rs-tag', ['New note', 'Draft']]
] as const;

for (const [name, selector, content] of examplesWithSelectors) {
    it(`renders the consumer-provided content for ${name}`, async () => {
        await mountCase(name, (wrapper) => expect(wrapper.findAll(selector).map((node) => node.text())).toEqual(content));
    });
}

const examplesWithInitialValues = [
    ['DatePicker', 'input', '11/21/2026'],
    ['Select', 'output', '"Oslo"'],
    ['InputChips', 'output', '["research","review"]']
] as const;

for (const [name, selector, initial] of examplesWithInitialValues) {
    it(`preserves the initial value in the ${name} example`, async () => {
        await mountCase(name, (wrapper) => {
            const node = wrapper.get(selector);
            expect(selector === 'input' ? (node.element as HTMLInputElement).value : node.text()).toBe(initial);
        });
    });
}

describe('interactive gallery examples', () => {
    it('lets a checkbox group change one checked value independently of another', async () => {
        await mountCase('Checkbox group', async (wrapper) => {
            const [maps, notes] = wrapper.findAll<HTMLInputElement>('input[type="checkbox"]');
            expect(maps.element.checked).toBe(true);
            expect(notes.element.checked).toBe(false);
            await notes.setValue(true);
            expect(maps.element.checked).toBe(true);
            expect(notes.element.checked).toBe(true);
        });
    });

    it('makes the child input fluid through the Fluid provider', async () => {
        await mountCase('Fluid', (wrapper) => {
            expect(wrapper.get('.rs-fluid input').classes()).toContain('rs-inputtext-fluid');
        });
    });

    it('moves the image comparison clip boundary when the range changes', async () => {
        await mountCase('Image compare', async (wrapper) => {
            await wrapper.get('input[type="range"]').setValue('70');
            expect(wrapper.get<HTMLImageElement>('img[alt="Adjusted"]').element.style.getPropertyValue('--rs-imagecompare-scope-x')).toBe('70%');
        });
    });

    it('mounts the dynamic dialog content when its service opens it', async () => {
        await mountCase('Dynamic dialog', async (wrapper) => {
            expect(document.body.textContent).not.toContain('Loaded through the dialog service.');
            await wrapper.get('button').trigger('click');
            const dialog = document.querySelector('[role="dialog"]');
            expect(dialog?.textContent).toContain('Loaded through the dialog service.');
        });
    });

    it('anchors and toggles the Popover example from its trigger', async () => {
        await mountCase('Popover', async (wrapper) => {
            const trigger = wrapper.get('button');
            await trigger.trigger('click');
            expect(document.body.textContent).toContain('Positioned next to the trigger.');
            await trigger.trigger('click');
            expect(document.body.textContent).not.toContain('Positioned next to the trigger.');
        });
    });

    it('opens headless Drawer content in a dialog', async () => {
        await mountCase('Headless drawer', async (wrapper) => {
            await wrapper.get('button').trigger('click');
            expect(document.querySelector('.rs-drawer[role="complementary"], .rs-drawer[role="dialog"]')?.textContent).toContain('Review these notes');
        });
    });

    it('filters non-integer key presses on the input while accepting digits', async () => {
        await mountCase('Key filter', (wrapper) => {
            const input = wrapper.get('input').element;
            const letter = new KeyboardEvent('keypress', { key: 'a', bubbles: true, cancelable: true });
            const digit = new KeyboardEvent('keypress', { key: '4', bubbles: true, cancelable: true });
            expect(input.dispatchEvent(letter)).toBe(false);
            expect(input.dispatchEvent(digit)).toBe(true);
        });
    });

    it('wraps focus from the last focus target to the first inside the focus trap', async () => {
        await mountCase('Focus trap', (wrapper) => {
            const [first, last] = wrapper.findAll<HTMLButtonElement>('button');
            const sentinel = wrapper.get<HTMLElement>('[data-pc-section="lastfocusableelement"]').element;
            last.element.focus();
            sentinel.focus();
            expect(document.activeElement).toBe(first.element);
        });
    });

    it('reveals AnimateOnScroll content after its observer reports intersection', async () => {
        const observers: IntersectionObserverCallback[] = [];
        class Observer {
            constructor(callback: IntersectionObserverCallback) {
                observers.push(callback);
            }
            observe() {}
            unobserve() {}
        }
        vi.stubGlobal('IntersectionObserver', Observer);
        vi.useFakeTimers();
        try {
            await mountCase('Animate on scroll', (wrapper) => {
                const note = wrapper.get('p');
                expect(note.element.style.opacity).toBe('0');
                vi.runAllTimers();
                const entry = { isIntersecting: true } as IntersectionObserverEntry;
                observers[0]([entry], new Observer(() => {}) as unknown as IntersectionObserver);
                expect(note.classes()).toContain('enter-note');
                expect(note.element.style.opacity).toBe('');
            });
        } finally {
            vi.useRealTimers();
            vi.unstubAllGlobals();
        }
    });
});
