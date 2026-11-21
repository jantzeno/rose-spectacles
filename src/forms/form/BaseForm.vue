<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../../core/basecomponent/BaseComponent.vue';
import FormStyle from './style/FormStyle';

export default defineComponent({
    name: 'BaseForm',
    extends: BaseComponent,
    style: FormStyle,
    props: {
        resolver: {
            type: Function,
            default: null
        },
        initialValues: {
            type: Object,
            default: null
        },
        validateOnValueUpdate: {
            type: [Boolean, Array],
            default: true
        },
        validateOnBlur: {
            type: [Boolean, Array],
            default: false
        },
        validateOnMount: {
            type: [Boolean, Array],
            default: false
        },
        validateOnSubmit: {
            type: [Boolean, Array],
            default: true
        }
    },
    provide() {
        return {
            $pcForm: this,
            $parentInstance: this
        };
    }
});
</script>
