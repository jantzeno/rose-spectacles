<template>
    <span :class="cx('pages')" v-bind="ptm('pages')">
        <button
            v-for="pageLink of value"
            :key="pageLink"
            v-ripple
            :class="cx('page', { pageLink })"
            type="button"
            :aria-label="ariaPageLabel(pageLink)"
            :aria-current="pageLink - 1 === page ? 'page' : undefined"
            @click="onPageLinkClick($event, pageLink)"
            v-bind="getPTOptions(pageLink - 1, 'page')"
            :data-p-active="pageLink - 1 === page"
        >
            {{ pageLink }}
        </button>
    </span>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import Ripple from '../ripple/Ripple';

export interface PageLinkClickEvent {
    originalEvent: MouseEvent;
    value: number;
}

export default defineComponent({
    name: 'PageLinks',
    hostName: 'Paginator',
    extends: BaseComponent,
    inheritAttrs: false,
    emits: ['click'],
    props: {
        value: Array as PropType<number[]>,
        page: Number
    },
    methods: {
        getPTOptions(pageLink: number, key: string) {
            return this.ptm(key, {
                context: {
                    active: pageLink === this.page
                }
            });
        },
        onPageLinkClick(event: MouseEvent, pageLink: number) {
            const linkEvent: PageLinkClickEvent = {
                originalEvent: event,
                value: pageLink
            };

            this.$emit('click', linkEvent);
        },
        ariaPageLabel(value: number) {
            return this.$primevue?.config.locale?.aria?.pageLabel?.replace(/{page}/g, String(value));
        }
    },
    directives: {
        ripple: Ripple
    }
});
</script>
