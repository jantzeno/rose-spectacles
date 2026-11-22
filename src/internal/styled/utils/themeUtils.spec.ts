import themeUtils from './themeUtils';

it('scopes attribute-based dark tokens to the target component', () => {
    const token = '--rs-card-background: red;';
    const options = { darkModeSelector: '[data-tone="night,dusk"]' };
    const scope = '[data-target]';

    expect(themeUtils.transformCSS('card', token, 'dark', 'variable', options, undefined, undefined, scope)).toBe(
        `:root[data-tone="night,dusk"]${scope},:root[data-tone="night,dusk"] ${scope},:host[data-tone="night,dusk"]${scope},:host[data-tone="night,dusk"] ${scope}{${token}}`
    );
    expect(themeUtils.transformCSS('card', token, 'dark', 'variable', options)).toBe(`:root[data-tone="night,dusk"],:host[data-tone="night,dusk"]{${token}}`);
});
