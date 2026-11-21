<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TagStyle from './style/TagStyle';

export default defineComponent({
    name: 'BaseTag',
    extends: BaseComponent,
    props: {
        value: null,
        severity: null,
        rounded: Boolean,
        icon: String
    },
    style: TagStyle,
    provide() {
        return {
            $pcTag: this,
            $parentInstance: this
        };
    }
});
</script>
