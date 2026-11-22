import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { preview } from 'vite';
import { browserDriver } from './browser-driver';

const server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true } });
const address = server.httpServer.address();
assert(address && typeof address !== 'string', 'Vite is listening on loopback');
const base = `http://127.0.0.1:${address.port}/`;

try {
    const browser = await browserDriver();
    console.log(`Testing the production gallery in ${browser.name}`);

    async function wait(expression: string, description: string) {
        const end = Date.now() + 8000;
        do {
            if (await browser.evaluate(expression)) return;
            await delay(50);
        } while (Date.now() < end);
        assert.fail(description);
    }

    async function show(hash: string) {
        await browser.navigate(base + hash);
        await wait(`document.querySelector('[data-example="${hash.slice(1)}"]')?.childElementCount > 0`, `The ${hash} example should render content`);
    }

    try {
        await show('#button');
        assert.equal(await browser.evaluate('document.querySelector("main button").textContent'), 'Save changes');
        const examples = await browser.evaluate<string[]>('Array.from(document.querySelectorAll("nav a"), (link) => link.hash)');
        assert(examples.length > 100, 'The gallery contains the component catalog');

        for (const hash of examples) {
            await show(hash);
            assert.deepEqual(await browser.evaluate('window.roseErrors'), [], `No browser errors in ${hash}`);
        }

        console.log(`${examples.length} gallery examples render`);

        await show('#select');
        const select = '[data-example="select"]';
        assert.equal(
            await browser.evaluate(`(() => {
                const combobox = document.querySelector('${select} [role="combobox"]');
                combobox.focus();
                return document.activeElement === combobox;
            })()`),
            true
        );
        await browser.keys(['Tab']);
        await wait(`document.activeElement === document.querySelector('${select} button[aria-label="Clear"]')`, 'Tab reaches the Select clear button');
        await browser.click(`${select} button[aria-label="Clear"]`);
        await wait(
            `document.querySelector('${select} output').textContent === 'null' &&
                document.activeElement === document.querySelector('${select} [role="combobox"]')`,
            'The Select clear button clears the value and restores focus after activation'
        );
        console.log('Tab reaches the Select clear button, and activating it clears the value and restores focus');

        await show('#inputchips');
        const longTag = 'LongTag'.repeat(18);
        await browser.evaluate(`(() => {
            const root = document.querySelector('[data-example="inputchips"] .rs-inputchips');
            root.style.inlineSize = '12rem';
            const input = root.querySelector('input');
            input.value = ${JSON.stringify(longTag)};
            input.dispatchEvent(new InputEvent('input', { bubbles: true }));
            return input.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', bubbles: true, cancelable: true }));
        })()`);
        const longChip = `[data-example="inputchips"] .rs-inputchips-chip-item[aria-label="${longTag}"]`;
        const removeChip = `${longChip} .rs-chip-remove-icon`;
        await wait(
            `(() => {
                const control = document.querySelector(${JSON.stringify(removeChip)});
                const input = control?.closest('ul');
                if (!input) return false;
                const outer = input.getBoundingClientRect();
                const button = control.getBoundingClientRect();
                return button.width > 0 && button.left >= outer.left && button.right <= outer.right + 1;
            })()`,
            'Long chips keep their remove controls inside the input'
        );
        await browser.click(removeChip);
        await wait(`!document.querySelector(${JSON.stringify(longChip)})`, 'The long chip can be removed');
        console.log('Long chips keep their remove controls inside the input');

        await show('#input-group');
        const smallGroupSizing = await browser.evaluate(`(() => {
            const group = document.querySelector('[data-example="input-group"] .rs-inputgroup');
            group.style.setProperty('--rs-inputgroup-addon-padding', '12px 16px');
            group.style.setProperty('--rs-inputtext-sm-font-size', '12px');
            group.style.setProperty('--rs-inputtext-sm-padding-y', '3px');
            group.style.setProperty('--rs-inputtext-sm-padding-x', '7px');
            return [group.querySelector('input'), group.querySelector('.rs-inputgroupaddon')].map((element) => {
                const style = getComputedStyle(element);
                return [style.fontSize, style.paddingBlockStart, style.paddingInlineStart];
            });
        })()`);
        assert.deepEqual(
            smallGroupSizing,
            [
                ['12px', '3px', '7px'],
                ['12px', '3px', '7px']
            ],
            'A small input group gives its text add-on the same font size and padding'
        );

        await show('#frozen-table-columns');
        const frozenHeader = '[data-example="frozen-table-columns"] th[data-p-frozen-column="true"]';
        const firstWidth = await browser.evaluate<number>(`document.querySelector(${JSON.stringify(frozenHeader)}).offsetWidth`);
        await browser.evaluate(`document.querySelector('[data-testid="frozen-table-width"]').style.width = '48rem'`);
        await wait(
            `document.querySelector(${JSON.stringify(frozenHeader)}).offsetWidth > ${firstWidth} + 40`,
            'Resizing the container changes the first frozen column width'
        );
        await wait(
            `(() => {
                const [first, second] = document.querySelectorAll(${JSON.stringify(frozenHeader)});
                const bodyCell = document.querySelector('[data-example="frozen-table-columns"] tr td:nth-child(2)');
                return Math.abs(parseFloat(second.style.insetInlineStart) - first.offsetWidth) <= 1 &&
                    Math.abs(parseFloat(bodyCell.style.insetInlineStart) - first.offsetWidth) <= 1;
            })()`,
            'Frozen table columns update their offsets after a container resize'
        );
        console.log('Frozen table columns update their offsets after a container resize');

        await show('#chart');
        const bar = '[data-example="chart"] svg [data-rs-chart-mark="bar"]';
        await wait(`document.querySelector(${JSON.stringify(bar)})?.getAttribute('d')?.length > 0`, 'Chart renders a Unovis SVG bar');
        const snapshot = await browser.evaluate<string>(`document.querySelector(${JSON.stringify(bar)}).getAttribute('d')`);
        await browser.click('[data-testid="chart-update"]');
        await wait(
            `document.querySelector(${JSON.stringify(bar)})?.getAttribute('d')?.length > 0 && document.querySelector(${JSON.stringify(bar)}).getAttribute('d') !== ${JSON.stringify(snapshot)}`,
            'Unovis redraws the SVG plot after a dataset update'
        );
        console.log('Unovis redraws the SVG plot after a dataset update');
        await browser.click(bar);
        await wait(
            'document.querySelector("[data-testid=chart-selection]")?.textContent === "Notes: 7"',
            'Unovis bar selection identifies the updated data point'
        );

        await show('#editor');
        await wait('document.querySelector(".rs-editor-content .tiptap")?.textContent.includes("Field notes")', 'Editor initializes with its HTML model');
        await browser.click('.rs-editor-content .tiptap');
        await browser.keys(['End', '!', 'R', 'S']);
        await wait('document.querySelector("[data-testid=editor-value]").textContent.includes("!RS")', 'Tiptap edits update the Vue model');
        await browser.click('button[aria-label="Bullet list"]');
        await wait(
            `(() => {
                const item = document.querySelector('.rs-editor-content .tiptap ul > li');
                return item && getComputedStyle(item).listStyleType === 'disc';
            })()`,
            'The Tiptap toolbar formats an unordered list with a bullet marker'
        );
        assert.match(await browser.evaluate<string>('document.querySelector("[data-testid=editor-value]").textContent'), /<ul>/);
        console.log('Tiptap edits update the model and the toolbar formats an unordered list');

        await show('#dialog');
        await browser.click('[data-testid="overlay-open"]');
        await wait('document.activeElement?.getAttribute("data-testid") === "overlay-done"', 'Dialog focuses its autofocus target');
        await browser.keys(['Escape']);
        await wait(
            '!document.querySelector("[role=dialog]") && document.activeElement?.getAttribute("data-testid") === "overlay-open"',
            'Escape closes the dialog and restores trigger focus'
        );
        console.log('Escape closes the dialog and restores trigger focus');

        await show('#headless-drawer');
        await browser.click('[data-example="headless-drawer"] [data-testid="overlay-open"]');
        await wait(
            `(() => {
                const panel = document.querySelector('.rs-drawer');
                return panel && panel.scrollHeight > panel.clientHeight && getComputedStyle(panel).overflowY === 'auto';
            })()`,
            'Overflowing headless Drawer content can scroll'
        );
        await browser.evaluate(`document.querySelector('.rs-drawer').scrollTop = 300`);
        assert.ok((await browser.evaluate<number>(`document.querySelector('.rs-drawer').scrollTop`)) > 0);
        console.log('Overflowing headless Drawer content can scroll');

        await show('#popover');
        await browser.evaluate(`Object.assign(document.querySelector('[data-example="popover"] button').style, {
            position: 'fixed',
            top: '8rem',
            right: '1rem'
        })`);
        await browser.click('[data-example="popover"] button');
        await wait('document.querySelector(".rs-popover")?.getBoundingClientRect().width > 0', 'Popover opens beside its trigger');
        const widthBeforeResize = await browser.evaluate<number>('document.querySelector(".rs-popover").getBoundingClientRect().width');
        await browser.evaluate(`document.querySelector('.rs-popover-content p').style.width = 'min(60vw, 550px)'`);
        await wait(
            `(() => {
                const { left, right, width } = document.querySelector('.rs-popover').getBoundingClientRect();
                return width > ${widthBeforeResize} + 50 && left >= 0 && right <= innerWidth + 1;
            })()`,
            'Popover stays inside the viewport as its content widens'
        );
        console.log('Popover stays inside the viewport as its content widens');

        for (const component of ['select', 'multiselect']) {
            await show('#popover-choice-menus');
            const trigger = `[data-example="popover-choice-menus"] [data-testid="open-${component}-popover"]`;
            await browser.evaluate(`Object.assign(document.querySelector(${JSON.stringify(trigger)}).style, {
                position: 'fixed', top: '8rem', right: '1rem'
            })`);
            await browser.click(trigger);
            await wait(
                `(() => {
                    const popover = document.querySelector('.rs-popover');
                    const anchor = popover?.querySelector('.rs-${component}');
                    const panel = document.querySelector('.rs-${component}-overlay');
                    const entering = 'rs-anchored-overlay-enter-active';
                    if (!anchor || !panel || popover.classList.contains(entering) || panel.classList.contains(entering)) return false;
                    const anchorRect = anchor.getBoundingClientRect();
                    const panelRect = panel.getBoundingClientRect();
                    return Math.min(Math.abs(anchorRect.left - panelRect.left), Math.abs(anchorRect.right - panelRect.right)) <= 1;
                })()`,
                'Programmatically opened choice menus stay aligned inside a popover'
            );
            await show('#button');
        }
        console.log('Programmatically opened Select and MultiSelect panels stay aligned inside a popover');

        await show('#command-palette');
        await browser.evaluate('window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, cancelable: true }))');
        await wait('document.activeElement?.matches(".rs-command-palette input[role=combobox]")', 'The command shortcut focuses the search input');
        await browser.keys(['ArrowDown', 'Enter']);
        await wait(
            'document.querySelector(\'[data-example="command-palette"] [role="status"]\').textContent === "Selected: Search products"',
            'Command palette supports selection by keyboard'
        );

        await browser.navigate(base + '?catalog-category=Drinkware&ref=sample#product-discovery');
        const productResults = '[data-example="product-discovery"] .commerce-applied-filters [role="status"]';
        await wait(`document.querySelector(${JSON.stringify(productResults)})?.textContent.trim() === '1 product'`, 'Catalog filters hydrate from the URL');
        await browser.click('[data-example="product-discovery"] button[aria-label="Remove Drinkware"]');
        await wait(
            `document.querySelector(${JSON.stringify(productResults)})?.textContent.trim() === '4 products' &&
                location.search === '?ref=sample'`,
            'Removing a catalog filter updates the results and the URL'
        );

        await show('#product-variants');
        await browser.click('[data-example="product-variants"] button[aria-label="View zipper detail"]');
        await wait(
            'document.querySelector(".commerce-variant-photo")?.getAttribute("aria-label")?.includes("zipper")',
            'Product photography can be switched by button'
        );

        await show('#orders-and-inventory');
        await browser.click('[data-example="orders-and-inventory"] tbody tr:first-child .rs-checkbox');
        await browser.click('[data-example="orders-and-inventory"] .commerce-order-actions button');
        await wait(
            'document.querySelector(".commerce-order-view .commerce-feedback")?.textContent === "Fulfilled 1 order."',
            'The orders toolbar applies a bulk action to selected rows'
        );

        await browser.setViewport(390, 844);
        await show('#app-sidebar');
        await browser.click('[data-example="app-sidebar"] button[aria-label="Open navigation"]');
        await wait('!!document.querySelector(\'.rs-drawer[aria-label="Workspace navigation"]\')', 'The app sidebar opens as a drawer on a narrow viewport');
        await browser.click('.rs-drawer[aria-label="Workspace navigation"] .rs-app-sidebar-group li:nth-child(2) button');
        await wait(
            'document.querySelector(".commerce-sidebar-content h2")?.textContent === "Products" && !document.querySelector(\'.rs-drawer[aria-label="Workspace navigation"]\')',
            'Selecting mobile navigation updates the active page and closes the drawer'
        );
        console.log('Commerce examples support keyboard commands, shareable filters, product previews, order actions, and mobile navigation');
    } finally {
        await browser.close();
    }
} finally {
    await new Promise<void>((resolve, reject) => server.httpServer.close((error) => (error ? reject(error) : resolve())));
}
