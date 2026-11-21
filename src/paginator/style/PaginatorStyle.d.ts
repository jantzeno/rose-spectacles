/**
 *
 * Paginator is a generic component to display content in paged format.
 *
 * [Live Demo](https://openvue.dev/paginator)
 *
 * @module paginatorstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum PaginatorClasses {
    /**
     * Class name of the paginator element
     */
    paginator = 'rs-paginator',
    /**
     * Class name of the content start element
     */
    contentStart = 'rs-paginator-content-start',
    /**
     * Class name of the content end element
     */
    contentEnd = 'rs-paginator-content-end',
    /**
     * Class name of the first element
     */
    first = 'rs-paginator-first',
    /**
     * Class name of the first icon element
     */
    firstIcon = 'rs-paginator-first-icon',
    /**
     * Class name of the prev element
     */
    prev = 'rs-paginator-prev',
    /**
     * Class name of the prev icon element
     */
    prevIcon = 'rs-paginator-prev-icon',
    /**
     * Class name of the next element
     */
    next = 'rs-paginator-next',
    /**
     * Class name of the next icon element
     */
    nextIcon = 'rs-paginator-next-icon',
    /**
     * Class name of the last element
     */
    last = 'rs-paginator-last',
    /**
     * Class name of the last icon element
     */
    lastIcon = 'rs-paginator-last-icon',
    /**
     * Class name of the pages element
     */
    pages = 'rs-paginator-pages',
    /**
     * Class name of the page element
     */
    page = 'rs-paginator-page',
    /**
     * Class name of the current element
     */
    current = 'rs-paginator-current',
    /**
     * Class name of the row per page dropdown element
     */
    pcRowPerPageDropdown = 'rs-paginator-rpp-dropdown',
    /**
     * Class name of the jump to page dropdown element
     */
    pcJumpToPageDropdown = 'rs-paginator-jtp-dropdown',
    /**
     * Class name of the jump to page input element
     */
    pcJumpToPageInputText = 'rs-paginator-jtp-input'
}

export interface PaginatorStyle extends BaseStyle {}
