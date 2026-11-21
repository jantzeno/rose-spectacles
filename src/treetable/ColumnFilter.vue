<script lang="ts">
import { defineComponent } from 'vue';
import ColumnFilter from '../datatable/ColumnFilter.vue';

// Same filter UI as DataTable, resolved against the TreeTable host so cx()/ptm() use the treetable style and pass-through keys.
export default defineComponent({
    name: 'ColumnFilter',
    hostName: 'TreeTable',
    extends: ColumnFilter
});
</script>
