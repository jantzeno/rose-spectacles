import { style } from '../../internal/styles/carousel/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }) => [
        'rs-carousel rs-component',
        {
            'rs-carousel-vertical': instance.isVertical(),
            'rs-carousel-horizontal': !instance.isVertical()
        }
    ],
    header: 'rs-carousel-header',
    contentContainer: 'rs-carousel-content-container',
    content: 'rs-carousel-content',
    pcPrevButton: ({ instance }) => [
        'rs-carousel-prev-button',
        {
            'rs-disabled': instance.backwardIsDisabled
        }
    ],
    viewport: 'rs-carousel-viewport',
    itemList: 'rs-carousel-item-list',
    itemClone: ({ index, value, totalShiftedItems, d_numVisible }) => [
        'rs-carousel-item rs-carousel-item-clone',
        {
            'rs-carousel-item-active': totalShiftedItems * -1 === value.length + d_numVisible,
            'rs-carousel-item-start': index === 0,
            'rs-carousel-item-end': value.slice(-1 * d_numVisible).length - 1 === index
        }
    ],
    item: ({ instance, index }) => [
        'rs-carousel-item',
        {
            'rs-carousel-item-active': instance.firstIndex() <= index && instance.lastIndex() >= index,
            'rs-carousel-item-start': instance.firstIndex() === index,
            'rs-carousel-item-end': instance.lastIndex() === index
        }
    ],
    pcNextButton: ({ instance }) => [
        'rs-carousel-next-button',
        {
            'rs-disabled': instance.forwardIsDisabled
        }
    ],
    indicatorList: 'rs-carousel-indicator-list',
    indicator: ({ instance, index }) => [
        'rs-carousel-indicator',
        {
            'rs-carousel-indicator-active': instance.d_page === index
        }
    ],
    indicatorButton: 'rs-carousel-indicator-button',
    footer: 'rs-carousel-footer'
};

export default BaseStyle.extend({
    name: 'carousel',
    style,
    classes
});
