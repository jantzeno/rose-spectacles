<script lang="ts">
import { defineComponent } from 'vue';
import type HelperSet from '../core/utils/HelperSet';
import BaseColumn from './BaseColumn.vue';

export default defineComponent({
    name: 'Column',
    extends: BaseColumn,
    inheritAttrs: false,
    inject: ['$columns'],
    mounted() {
        (this.$columns as HelperSet | undefined)?.add(this.$);
    },
    unmounted() {
        (this.$columns as HelperSet | undefined)?.delete(this.$);
    },
    render() {
        return null;
    }
});
</script>
