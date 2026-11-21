<script lang="ts">
import { defineComponent } from 'vue';
import DatePicker from '../datepicker/DatePicker.vue';

export default defineComponent({
    name: 'Calendar',
    extends: DatePicker,
    mounted() {
        console.warn('Deprecated since v4. Use DatePicker component instead.');
    }
});
</script>
