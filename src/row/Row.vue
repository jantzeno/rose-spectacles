<script lang="ts">
import { defineComponent } from 'vue';
import type HelperSet from '../core/utils/HelperSet';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';

export default defineComponent({
    name: 'Row',
    extends: BaseComponent,
    inject: ['$rows'],
    mounted() {
        (this.$rows as HelperSet | undefined)?.add(this.$);
    },
    unmounted() {
        (this.$rows as HelperSet | undefined)?.delete(this.$);
    },
    render() {
        return null;
    }
});
</script>
