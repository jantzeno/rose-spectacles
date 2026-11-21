<script>
import { isEmpty } from '../../internal/utils/object/index';
import BaseComponent from '../../core/basecomponent/BaseComponent.vue';
import BaseIconStyle from './style/BaseIconStyle';

export default {
    name: 'BaseIcon',
    extends: BaseComponent,
    props: {
        label: {
            type: String,
            default: undefined
        },
        spin: {
            type: Boolean,
            default: false
        }
    },
    style: BaseIconStyle,
    provide() {
        return {
            $pcIcon: this,
            $parentInstance: this
        };
    },
    methods: {
        pti() {
            const isLabelEmpty = isEmpty(this.label);

            return {
                ...(!this.isUnstyled && {
                    class: [
                        'rs-icon',
                        {
                            'rs-icon-spin': this.spin
                        }
                    ]
                }),
                role: !isLabelEmpty ? 'img' : undefined,
                'aria-label': !isLabelEmpty ? this.label : undefined,
                'aria-hidden': isLabelEmpty
            };
        }
    }
};
</script>
