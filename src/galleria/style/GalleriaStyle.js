import { style } from '../../internal/styles/galleria/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    mask: 'rs-galleria-mask rs-overlay-mask rs-overlay-mask-enter-active',
    root: ({ instance }) => {
        const thumbnailsPosClass = instance.$attrs.showThumbnails && instance.getPositionClass('rs-galleria-thumbnails', instance.$attrs.thumbnailsPosition);
        const indicatorPosClass = instance.$attrs.showIndicators && instance.getPositionClass('rs-galleria-indicators', instance.$attrs.indicatorsPosition);

        return [
            'rs-galleria rs-component',
            {
                'rs-galleria-fullscreen': instance.$attrs.fullScreen,
                'rs-galleria-inset-indicators': instance.$attrs.showIndicatorsOnItem,
                'rs-galleria-hover-navigators': instance.$attrs.showItemNavigatorsOnHover && !instance.$attrs.fullScreen
            },
            thumbnailsPosClass,
            indicatorPosClass
        ];
    },
    closeButton: 'rs-galleria-close-button',
    closeIcon: 'rs-galleria-close-icon',
    header: 'rs-galleria-header',
    content: 'rs-galleria-content',
    footer: 'rs-galleria-footer',
    itemsContainer: 'rs-galleria-items-container',
    items: 'rs-galleria-items',
    prevButton: ({ instance }) => [
        'rs-galleria-prev-button rs-galleria-nav-button',
        {
            'rs-disabled': instance.isNavBackwardDisabled
        }
    ],
    prevIcon: 'rs-galleria-prev-icon',
    item: 'rs-galleria-item',
    nextButton: ({ instance }) => [
        'rs-galleria-next-button rs-galleria-nav-button',
        {
            'rs-disabled': instance.isNavForwardDisabled
        }
    ],
    nextIcon: 'rs-galleria-next-icon',
    caption: 'rs-galleria-caption',
    indicatorList: 'rs-galleria-indicator-list',
    indicator: ({ instance, index }) => [
        'rs-galleria-indicator',
        {
            'rs-galleria-indicator-active': instance.isIndicatorItemActive(index)
        }
    ],
    indicatorButton: 'rs-galleria-indicator-button',
    thumbnails: 'rs-galleria-thumbnails',
    thumbnailContent: 'rs-galleria-thumbnails-content',
    thumbnailPrevButton: ({ instance }) => [
        'rs-galleria-thumbnail-prev-button rs-galleria-thumbnail-nav-button',
        {
            'rs-disabled': instance.isNavBackwardDisabled
        }
    ],
    thumbnailPrevIcon: 'rs-galleria-thumbnail-prev-icon',
    thumbnailsViewport: 'rs-galleria-thumbnails-viewport',
    thumbnailItems: 'rs-galleria-thumbnail-items',
    thumbnailItem: ({ instance, index, activeIndex }) => [
        'rs-galleria-thumbnail-item',
        {
            'rs-galleria-thumbnail-item-current': activeIndex === index,
            'rs-galleria-thumbnail-item-active': instance.isItemActive(index),
            'rs-galleria-thumbnail-item-start': instance.firstItemAciveIndex() === index,
            'rs-galleria-thumbnail-item-end': instance.lastItemActiveIndex() === index
        }
    ],
    thumbnail: 'rs-galleria-thumbnail',
    thumbnailNextButton: ({ instance }) => [
        'rs-galleria-thumbnail-next-button rs-galleria-thumbnail-nav-button',
        {
            'rs-disabled': instance.isNavForwardDisabled
        }
    ],
    thumbnailNextIcon: 'rs-galleria-thumbnail-next-icon'
};

export default BaseStyle.extend({
    name: 'galleria',
    style,
    classes
});
