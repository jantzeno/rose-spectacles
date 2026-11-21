<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import InputIconStyle from './style/InputIconStyle';

export default defineComponent({
    name: 'BaseInputIcon',
    extends: BaseComponent,
    style: InputIconStyle,
    props: {
        class: null
    },
    provide() {
        return {
            $pcInputIcon: this,
            $parentInstance: this
        };
    }
});
</script>
