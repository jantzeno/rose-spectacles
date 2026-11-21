<script>
import Select from '../select/Select.vue';

export default {
    name: 'Dropdown',
    extends: Select,
    mounted() {
        console.warn('Deprecated since v4. Use Select component instead.');
    }
};
</script>
