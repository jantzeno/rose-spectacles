<script lang="ts">
import { defineComponent } from 'vue';
import Select from '../select/Select.vue';

export default defineComponent({
    name: 'Dropdown',
    extends: Select,
    mounted() {
        console.warn('Deprecated since v4. Use Select component instead.');
    }
});
</script>
