<script>
import BaseEditableHolder from '../core/baseeditableholder/BaseEditableHolder.vue';
import RatingStyle from './style/RatingStyle';

export default {
    name: 'BaseRating',
    extends: BaseEditableHolder,
    props: {
        readonly: {
            type: Boolean,
            default: false
        },
        stars: {
            type: Number,
            default: 5
        },
        onIcon: {
            type: String,
            default: undefined
        },
        offIcon: {
            type: String,
            default: undefined
        }
    },
    style: RatingStyle,
    provide() {
        return {
            $pcRating: this,
            $parentInstance: this
        };
    }
};
</script>
