import BaseStyle from '../../core/base/style/BaseStyle';

const inlineStyles = {
    root: { position: 'relative' }
};

const classes = {
    root: 'rs-chart',
    plot: 'rs-chart-plot',
    legend: 'rs-chart-legend'
};

export default BaseStyle.extend({
    name: 'chart',
    style: `
        .rs-chart-themed {
            --vis-axis-grid-color: var(--rs-content-border-color, #dfe3eb);
            --vis-axis-tick-label-color: var(--rs-text-muted-color, #6c778c);
            --vis-axis-label-color: var(--rs-text-color, #3f4b5f);
        }
        .rs-chart-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin: 0 0 0.5rem;
            padding: 0;
            list-style: none;
        }
        .rs-chart-legend li {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
        }
        .rs-chart-legend li span {
            inline-size: 0.75em;
            block-size: 0.75em;
        }
    `,
    classes,
    inlineStyles
});
