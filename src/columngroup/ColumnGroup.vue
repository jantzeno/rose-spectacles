<script lang="ts">
import { defineComponent } from 'vue';
import type HelperSet from '../core/utils/HelperSet';
import BaseColumnGroup from './BaseColumnGroup.vue';

export default defineComponent({
    name: 'ColumnGroup',
    extends: BaseColumnGroup,
    inheritAttrs: false,
    inject: ['$columnGroups'],
    mounted() {
        (this.$columnGroups as HelperSet | undefined)?.add(this.$);
    },
    unmounted() {
        (this.$columnGroups as HelperSet | undefined)?.delete(this.$);
    },
    render() {
        return null;
    }
});
</script>
