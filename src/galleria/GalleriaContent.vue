<template>
    <div
        v-if="value && value.length > 0"
        :id="$id"
        role="region"
        :class="[cx('root'), containerClass]"
        :style="containerStyle"
        :aria-label="ariaLabel"
        :aria-roledescription="ariaRoledescription"
        v-bind="{ ...containerProps, ...getPTOptions('root') }"
    >
        <button
            v-if="fullScreen"
            v-ripple
            autofocus
            type="button"
            :class="cx('closeButton')"
            :aria-label="closeAriaLabel"
            @click="$emit('mask-hide')"
            v-bind="getPTOptions('closeButton')"
        >
            <component :is="templates['closeicon'] || 'TimesIcon'" :class="cx('closeIcon')" v-bind="getPTOptions('closeIcon')" />
        </button>
        <div v-if="templates && templates['header']" :class="cx('header')" v-bind="getPTOptions('header')">
            <component :is="templates['header']" />
        </div>
        <div :class="cx('content')" :aria-live="autoPlay ? 'polite' : 'off'" v-bind="getPTOptions('content')">
            <GalleriaItem
                :id="$id"
                v-model:activeIndex="currentIndex"
                v-model:slideShowActive="slideShowActive"
                :value="value"
                :circular="circular"
                :templates="templates"
                :showIndicators="showIndicators"
                :changeItemOnIndicatorHover="changeItemOnIndicatorHover"
                :showItemNavigators="showItemNavigators"
                :autoPlay="autoPlay"
                @start-slideshow="startSlideShow"
                @stop-slideshow="stopSlideShow"
                :pt="pt"
                :unstyled="unstyled"
            />

            <GalleriaThumbnails
                v-if="showThumbnails"
                v-model:activeIndex="currentIndex"
                v-model:slideShowActive="slideShowActive"
                :containerId="$id"
                :value="value"
                :templates="templates"
                :numVisible="visibleCount"
                :responsiveOptions="responsiveOptions"
                :circular="circular"
                :isVertical="isVertical()"
                :contentHeight="verticalThumbnailViewPortHeight"
                :showThumbnailNavigators="showThumbnailNavigators"
                :prevButtonProps="prevButtonProps"
                :nextButtonProps="nextButtonProps"
                @stop-slideshow="stopSlideShow"
                :pt="pt"
                :unstyled="unstyled"
            />
        </div>
        <div v-if="templates && templates['footer']" :class="cx('footer')" v-bind="getPTOptions('footer')">
            <component :is="templates['footer']" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, type Slots } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { TimesIcon } from '../internal/lucide';
import Ripple from '../ripple/Ripple';
import { galleriaProps } from './BaseGalleria.vue';
import GalleriaItem from './GalleriaItem.vue';
import GalleriaThumbnails from './GalleriaThumbnails.vue';

export default defineComponent({
    name: 'GalleriaContent',
    hostName: 'Galleria',
    extends: BaseComponent,
    inheritAttrs: false,
    emits: ['activeitem-change', 'mask-hide'],
    props: {
        ...galleriaProps,
        templates: {
            type: Object as PropType<Slots>,
            default: () => ({})
        }
    },
    data() {
        return {
            currentIndex: this.activeIndex,
            visibleCount: this.numVisible,
            slideShowActive: false,
            interval: null as ReturnType<typeof setInterval> | null
        };
    },
    watch: {
        value(newVal) {
            if (newVal && newVal.length < this.visibleCount) {
                this.visibleCount = newVal.length;
            }
        },
        activeIndex(newVal) {
            this.currentIndex = newVal;
        },
        numVisible(newVal) {
            this.visibleCount = newVal;
        },
        autoPlay(newVal) {
            newVal ? this.startSlideShow() : this.stopSlideShow();
        }
    },
    updated() {
        this.$emit('activeitem-change', this.currentIndex);
    },
    beforeUnmount() {
        if (this.slideShowActive) {
            this.stopSlideShow();
        }
    },
    methods: {
        getPTOptions(key: string) {
            return this.ptm(key, {
                props: {
                    ...this.$attrs,
                    ...this.$props
                }
            });
        },
        isAutoPlayActive() {
            return this.slideShowActive;
        },
        startSlideShow() {
            this.interval = setInterval(() => {
                this.currentIndex = this.circular && this.value && this.value.length - 1 === this.currentIndex ? 0 : this.currentIndex + 1;
            }, this.transitionInterval);

            this.slideShowActive = true;
        },
        stopSlideShow() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }

            this.slideShowActive = false;
        },
        getPositionClass(preClassName: string, position: string) {
            const positions = ['top', 'left', 'bottom', 'right'];
            const pos = positions.find((item) => item === position);

            return pos ? `${preClassName}-${pos}` : '';
        },
        isVertical() {
            return this.thumbnailsPosition === 'left' || this.thumbnailsPosition === 'right';
        }
    },
    computed: {
        closeAriaLabel() {
            return this.$primevue?.config.locale?.aria?.close;
        }
    },
    components: {
        GalleriaItem: GalleriaItem,
        GalleriaThumbnails: GalleriaThumbnails,
        TimesIcon: TimesIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
