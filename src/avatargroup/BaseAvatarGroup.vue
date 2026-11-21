<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import AvatarGroupStyle from './style/AvatarGroupStyle';

export default {
    name: 'BaseAvatarGroup',
    extends: BaseComponent,
    style: AvatarGroupStyle,
    provide() {
        return {
            $pcAvatarGroup: this,
            $parentInstance: this
        };
    }
};
</script>
