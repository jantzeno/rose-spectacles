<template>
    <span :class="cx('current')" v-bind="ptm('current')">{{ text }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';

export default defineComponent({
    name: 'CurrentPageReport',
    hostName: 'Paginator',
    extends: BaseComponent,
    props: {
        pageCount: {
            type: Number,
            default: 0
        },
        currentPage: {
            type: Number,
            default: 0
        },
        page: {
            type: Number,
            default: 0
        },
        first: {
            type: Number,
            default: 0
        },
        rows: {
            type: Number,
            default: 0
        },
        totalRecords: {
            type: Number,
            default: 0
        },
        template: {
            type: String,
            default: '({currentPage} of {totalPages})'
        }
    },
    computed: {
        text() {
            let text = this.template
                .replace('{currentPage}', String(this.currentPage))
                .replace('{totalPages}', String(this.pageCount))
                .replace('{first}', String(this.pageCount > 0 ? this.first + 1 : 0))
                .replace('{last}', String(Math.min(this.first + this.rows, this.totalRecords)))
                .replace('{rows}', String(this.rows))
                .replace('{totalRecords}', String(this.totalRecords));

            return text;
        }
    }
});
</script>
