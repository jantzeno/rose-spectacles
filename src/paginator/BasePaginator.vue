<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import PaginatorStyle from './style/PaginatorStyle';

export const defaultTemplate = 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown';

export default defineComponent({
    name: 'BasePaginator',
    extends: BaseComponent,
    props: {
        totalRecords: {
            type: Number,
            default: 0
        },
        rows: {
            type: Number,
            default: 0
        },
        first: {
            type: Number,
            default: 0
        },
        pageLinkSize: {
            type: Number,
            default: 5
        },
        rowsPerPageOptions: {
            type: Array as PropType<number[]>,
            default: null
        },
        template: {
            type: [Object, String] as PropType<string | Record<string, string>>,
            default: defaultTemplate
        },
        currentPageReportTemplate: {
            type: null,
            default: '({currentPage} of {totalPages})'
        },
        alwaysShow: {
            type: Boolean,
            default: true
        }
    },
    style: PaginatorStyle,
    provide() {
        return {
            $pcPaginator: this,
            $parentInstance: this
        };
    }
});
</script>
