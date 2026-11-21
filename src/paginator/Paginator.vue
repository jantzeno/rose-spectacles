<template>
    <nav v-if="alwaysShow ? true : pageLinks && pageLinks.length > 1" v-bind="ptmi('paginatorContainer')">
        <div v-for="(value, key) in templateItems" :key="key" ref="paginator" :class="cx('paginator', { key })" v-bind="ptm('root')">
            <slot
                v-if="$slots.container"
                name="container"
                :first="d_first + 1"
                :last="last"
                :rows="d_rows"
                :page="page"
                :pageCount="pageCount"
                :pageLinks="pageLinks"
                :totalRecords="totalRecords"
                :firstPageCallback="changePageToFirst"
                :lastPageCallback="changePageToLast"
                :prevPageCallback="changePageToPrev"
                :nextPageCallback="changePageToNext"
                :rowChangeCallback="onRowChange"
                :changePageCallback="changePage"
            />
            <template v-else>
                <div v-if="$slots.start" :class="cx('contentStart')" v-bind="ptm('contentStart')">
                    <slot name="start" :state="currentState"></slot>
                </div>
                <div :class="cx('content')" v-bind="ptm('content')">
                    <template v-for="item in value" :key="item">
                        <FirstPageLink
                            v-if="item === 'FirstPageLink'"
                            :aria-label="getAriaLabel('firstPageLabel')"
                            :template="$slots.firsticon || $slots.firstpagelinkicon"
                            @click="changePageToFirst($event)"
                            :disabled="isFirstPage || empty"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                        <PrevPageLink
                            v-else-if="item === 'PrevPageLink'"
                            :aria-label="getAriaLabel('prevPageLabel')"
                            :template="$slots.previcon || $slots.prevpagelinkicon"
                            @click="changePageToPrev($event)"
                            :disabled="isFirstPage || empty"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                        <NextPageLink
                            v-else-if="item === 'NextPageLink'"
                            :aria-label="getAriaLabel('nextPageLabel')"
                            :template="$slots.nexticon || $slots.nextpagelinkicon"
                            @click="changePageToNext($event)"
                            :disabled="isLastPage || empty"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                        <LastPageLink
                            v-else-if="item === 'LastPageLink'"
                            :aria-label="getAriaLabel('lastPageLabel')"
                            :template="$slots.lasticon || $slots.lastpagelinkicon"
                            @click="changePageToLast($event)"
                            :disabled="isLastPage || empty"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                        <PageLinks
                            v-else-if="item === 'PageLinks'"
                            :aria-label="getAriaLabel('pageLabel')"
                            :value="pageLinks"
                            :page="page"
                            @click="changePageLink($event)"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                        <CurrentPageReport
                            v-else-if="item === 'CurrentPageReport'"
                            aria-live="polite"
                            :template="currentPageReportTemplate"
                            :currentPage="currentPage"
                            :page="page"
                            :pageCount="pageCount"
                            :first="d_first"
                            :rows="d_rows"
                            :totalRecords="totalRecords"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                        <RowsPerPageDropdown
                            v-else-if="item === 'RowsPerPageDropdown' && rowsPerPageOptions"
                            :aria-label="getAriaLabel('rowsPerPageLabel')"
                            :rows="d_rows"
                            :options="rowsPerPageOptions"
                            @rows-change="onRowChange($event)"
                            :disabled="empty"
                            :templates="$slots"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                        <JumpToPageDropdown
                            v-else-if="item === 'JumpToPageDropdown'"
                            :aria-label="getAriaLabel('jumpToPageDropdownLabel')"
                            :page="page"
                            :pageCount="pageCount"
                            @page-change="changePage($event)"
                            :disabled="empty"
                            :templates="$slots"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                        <JumpToPageInput
                            v-else-if="item === 'JumpToPageInput'"
                            :page="currentPage"
                            @page-change="changePage($event)"
                            :disabled="empty"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                    </template>
                </div>
                <div v-if="$slots.end" :class="cx('contentEnd')" v-bind="ptm('contentEnd')">
                    <slot name="end" :state="currentState"></slot>
                </div>
            </template>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PrimeVueLocaleAriaOptions } from 'rose-spectacles/core/config';
import { setAttribute } from '../internal/utils/dom/index';
import BasePaginator, { defaultTemplate } from './BasePaginator.vue';
import CurrrentPageReport from './CurrentPageReport.vue';
import FirstPageLink from './FirstPageLink.vue';
import JumpToPageDropdown from './JumpToPageDropdown.vue';
import JumpToPageInput from './JumpToPageInput.vue';
import LastPageLink from './LastPageLink.vue';
import NextPageLink from './NextPageLink.vue';
import PageLinks, { type PageLinkClickEvent } from './PageLinks.vue';
import PrevPageLink from './PrevPageLink.vue';
import RowsPerPageDropdown from './RowsPerPageDropdown.vue';

export default defineComponent({
    name: 'Paginator',
    extends: BasePaginator,
    inheritAttrs: false,
    emits: ['update:first', 'update:rows', 'page'],
    data() {
        return {
            d_first: this.first,
            d_rows: this.rows,
            styleElement: null as HTMLStyleElement | null
        };
    },
    watch: {
        first(newValue) {
            this.d_first = newValue;
        },
        rows(newValue) {
            this.d_rows = newValue;
        },
        totalRecords(newValue) {
            if (this.page > 0 && newValue && this.d_first >= newValue) {
                this.changePage(this.pageCount - 1);
            }
        }
    },
    mounted() {
        this.createStyle();
    },
    methods: {
        changePage(p: number) {
            const pc = this.pageCount;

            if (p >= 0 && p < pc) {
                this.d_first = this.d_rows * p;
                const state = {
                    page: p,
                    first: this.d_first,
                    rows: this.d_rows,
                    pageCount: pc
                };

                this.$emit('update:first', this.d_first);
                this.$emit('update:rows', this.d_rows);
                this.$emit('page', state);
            }
        },

        changePageToFirst(event: Event) {
            if (!this.isFirstPage) {
                this.changePage(0);
            }

            event.preventDefault();
        },
        changePageToPrev(event: Event) {
            this.changePage(this.page - 1);
            event.preventDefault();
        },
        changePageLink(event: PageLinkClickEvent) {
            this.changePage(event.value - 1);
            event.originalEvent.preventDefault();
        },
        changePageToNext(event: Event) {
            this.changePage(this.page + 1);
            event.preventDefault();
        },
        changePageToLast(event: Event) {
            if (!this.isLastPage) {
                this.changePage(this.pageCount - 1);
            }

            event.preventDefault();
        },
        onRowChange(value: number) {
            this.d_rows = value;
            this.changePage(this.page);
        },
        createStyle() {
            if (this.hasBreakpoints() && !this.isUnstyled) {
                this.styleElement = document.createElement('style');
                this.styleElement.type = 'text/css';
                setAttribute(this.styleElement, 'nonce', this.$primevue?.config?.csp?.nonce);
                document.body.appendChild(this.styleElement);

                let innerHTML = '';

                const sortedBreakpoints = Object.keys(this.templateItems).sort((a, b) => parseInt(a) - parseInt(b));

                for (const [index, key] of sortedBreakpoints.entries()) {
                    const previous = sortedBreakpoints[index - 1];
                    const minimumWidth = key !== 'default' && previous ? `${Number(previous.slice(0, -2)) + 1}px` : previous;
                    const minValue = previous ? `and (min-width:${minimumWidth})` : '';

                    if (key === 'default') {
                        innerHTML += `
                            @media screen ${minValue} {
                                .rs-paginator[${this.$attrSelector}],
                                    display: flex;
                                }
                            }
                        `;
                    } else {
                        innerHTML += `
.rs-paginator-${key} {
    display: none;
}
@media screen ${minValue} and (max-width: ${key}) {
    .rs-paginator-${key} {
        display: flex;
    }

    .rs-paginator-default{
        display: none;
    }
}
                    `;
                    }
                }

                this.styleElement.innerHTML = innerHTML;
            }
        },
        hasBreakpoints() {
            return typeof this.template === 'object';
        },
        getAriaLabel(labelType: keyof PrimeVueLocaleAriaOptions) {
            return this.$primevue?.config.locale?.aria?.[labelType];
        }
    },
    computed: {
        templateItems() {
            const templates =
                typeof this.template === 'string' ? { default: this.template } : { ...this.template, default: this.template.default || defaultTemplate };

            return Object.fromEntries(Object.entries(templates).map(([key, value]) => [key, value.split(' ').map((item) => item.trim())]));
        },
        page() {
            return Math.floor(this.d_first / this.d_rows);
        },
        pageCount() {
            return Math.ceil(this.totalRecords / this.d_rows);
        },
        isFirstPage() {
            return this.page === 0;
        },
        isLastPage() {
            return this.page === this.pageCount - 1;
        },
        calculatePageLinkBoundaries() {
            const numberOfPages = this.pageCount;
            const visiblePages = Math.min(this.pageLinkSize, numberOfPages);

            //calculate range, keep current in middle if necessary
            let start = Math.max(0, Math.ceil(this.page - visiblePages / 2));
            let end = Math.min(numberOfPages - 1, start + visiblePages - 1);

            //check when approaching to last page
            const delta = this.pageLinkSize - (end - start + 1);

            start = Math.max(0, start - delta);

            return [start, end];
        },
        pageLinks() {
            const pageLinks: number[] = [];
            let boundaries = this.calculatePageLinkBoundaries;
            let start = boundaries[0];
            let end = boundaries[1];

            for (var i = start; i <= end; i++) {
                pageLinks.push(i + 1);
            }

            return pageLinks;
        },
        currentState() {
            return {
                page: this.page,
                first: this.d_first,
                rows: this.d_rows
            };
        },
        empty() {
            return this.pageCount === 0;
        },
        currentPage() {
            return this.pageCount > 0 ? this.page + 1 : 0;
        },
        last() {
            return Math.min(this.d_first + this.rows, this.totalRecords);
        }
    },
    components: {
        CurrentPageReport: CurrrentPageReport,
        FirstPageLink: FirstPageLink,
        LastPageLink: LastPageLink,
        NextPageLink: NextPageLink,
        PageLinks: PageLinks,
        PrevPageLink: PrevPageLink,
        RowsPerPageDropdown: RowsPerPageDropdown,
        JumpToPageDropdown: JumpToPageDropdown,
        JumpToPageInput: JumpToPageInput
    }
});
</script>
