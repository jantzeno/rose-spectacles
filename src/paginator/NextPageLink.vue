<template>
    <button v-ripple :class="cx('next')" type="button" v-bind="getPTOptions('next')" data-pc-group-section="pagebutton">
        <component :is="template || 'AngleRightIcon'" :class="cx('nextIcon')" v-bind="getPTOptions('nextIcon')" />
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import AngleRightIcon from '../icons/angleright/AngleRightIcon.vue';
import Ripple from '../ripple/Ripple';

export default defineComponent({
    name: 'NextPageLink',
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
        AngleRightIcon: AngleRightIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
