<template>
    <button v-ripple :class="cx('prev')" type="button" v-bind="getPTOptions('prev')" data-pc-group-section="pagebutton">
        <component :is="template || 'AngleLeftIcon'" :class="cx('prevIcon')" v-bind="getPTOptions('prevIcon')" />
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import AngleLeftIcon from '../icons/angleleft/AngleLeftIcon.vue';
import Ripple from '../ripple/Ripple';

export default defineComponent({
    name: 'PrevPageLink',
    hostName: 'Paginator',
    extends: BaseComponent,
    props: {
        template: {
            type: Function,
            default: null
        }
    },
    methods: {
        getPTOptions(key: string) {
            return this.ptm(key, {
                context: {
                    disabled: this.$attrs.disabled
                }
            });
        }
    },
    components: {
        AngleLeftIcon: AngleLeftIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
