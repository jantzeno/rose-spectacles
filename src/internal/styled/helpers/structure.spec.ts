import CheckboxStyle from '../../../checkbox/style/CheckboxStyle';
import { css } from './css';
import { $dt } from './dt';

it('fills missing layout values in component CSS and generated stylesheets', () => {
    const rendered = css`
        .control {
            min-width: dt('checkbox.width');
            padding: dt('inputtext.padding.y') dt('inputtext.padding.x');
            border-width: dt('tabs.tablist.border.width');
        }
    `;

    expect(rendered).toContain('var(--rs-checkbox-width, 1.125rem)');
    expect(rendered).toContain('var(--rs-inputtext-padding-y, 0.5rem) var(--rs-inputtext-padding-x, 0.75rem)');
    expect(rendered).toContain('var(--rs-tabs-tablist-border-width, 0 0 1px)');
    expect(CheckboxStyle.getThemeStyleSheet()).toMatch(/var\(--rs-checkbox-width,\s*1\.125rem\)/);
});

it('preserves an explicit CSS fallback and leaves token lookup intact', () => {
    const rendered = css`
        width: dt('checkbox.width', '2rem');
        inset-inline-start: dt('imagecompare.scope.x', '50%');
    `;

    expect(rendered).toContain('var(--rs-checkbox-width, 2rem)');
    expect(rendered).toContain('var(--rs-imagecompare-scope-x, 50%)');
    expect($dt('checkbox.width').variable).toBe('var(--rs-checkbox-width)');
});
