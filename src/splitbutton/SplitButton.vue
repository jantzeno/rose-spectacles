<template>
    <div :class="containerClass" :style="style" v-bind="ptmi('root')" :data-p-severity="severity">
        <PVSButton
            type="button"
            :class="cx('pcButton')"
            :label="label"
            :disabled="disabled"
            :severity="severity"
            :text="text"
            :icon="icon"
            :outlined="outlined"
            :size="size"
            :fluid="fluid"
            :aria-label="label"
            @click="onDefaultButtonClick"
            v-bind="buttonProps"
            :pt="ptm('pcButton')"
            :unstyled="unstyled"
        >
            <template v-if="$slots.icon" #icon="slotProps">
                <slot name="icon" :class="slotProps.class">
                    <span :class="[icon, slotProps.class]" v-bind="ptm('pcButton')['icon']" data-pc-section="buttonicon" />
                </slot>
            </template>
            <template #default>
                <slot></slot>
            </template>
        </PVSButton>
        <PVSButton
            ref="button"
            type="button"
            :class="cx('pcDropdown')"
            :disabled="disabled"
            aria-haspopup="true"
            :aria-expanded="isExpanded"
            :aria-controls="isExpanded ? $id + '_overlay' : undefined"
            @click="onDropdownButtonClick"
            @keydown="onDropdownKeydown"
            :severity="severity"
            :text="text"
            :outlined="outlined"
            :size="size"
            :unstyled="unstyled"
            v-bind="menuButtonProps"
            :pt="ptm('pcDropdown')"
        >
            <template #icon="slotProps">
                <!--TODO: menubuttonicon and menuButtonIcon deprecated since v4.0-->
                <slot :name="$slots.dropdownicon ? 'dropdownicon' : 'menubuttonicon'" :class="slotProps.class">
                    <component
                        :is="menuButtonIcon || dropdownIcon ? 'span' : 'ChevronDownIcon'"
                        :class="[dropdownIcon || menuButtonIcon, slotProps.class]"
                        v-bind="ptm('pcDropdown')['icon']"
                        data-pc-section="menubuttonicon"
                    />
                </slot>
            </template>
        </PVSButton>
        <PVSMenu
            ref="menu"
            :id="$id + '_overlay'"
            :model="model"
            :popup="true"
            :autoZIndex="autoZIndex"
            :baseZIndex="baseZIndex"
            :appendTo="appendTo"
            :unstyled="unstyled"
            :pt="ptm('pcMenu')"
        >
            <template v-if="$slots.menuitemicon" #itemicon="slotProps">
                <slot name="menuitemicon" :item="slotProps.item" :class="slotProps.class" />
            </template>
            <template v-if="$slots.item" #item="slotProps">
                <slot name="item" :item="slotProps.item" :hasSubmenu="slotProps.hasSubmenu" :label="slotProps.label" :props="slotProps.props"></slot>
            </template>
        </PVSMenu>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isEmpty } from '../internal/utils/object/index';
import { ChevronDownIcon } from '../internal/lucide';
import Button from '../button/Button.vue';
import TieredMenu from '../tieredmenu/TieredMenu.vue';
import BaseSplitButton from './BaseSplitButton.vue';

export default defineComponent({
    name: 'SplitButton',
    extends: BaseSplitButton,
    inheritAttrs: false,
    emits: ['click'],
    inject: {
        $pcFluid: { default: null }
    },
    data() {
        return {
            isExpanded: false
        };
    },
    mounted() {
        const menu = this.$refs.menu as InstanceType<typeof TieredMenu>;

        this.$watch(
            () => menu.visible,
            (visible) => {
                this.isExpanded = visible;
            }
        );
    },
    methods: {
        onDropdownButtonClick(event?: MouseEvent) {
            event?.preventDefault();

            const menu = this.$refs.menu as InstanceType<typeof TieredMenu>;
            const button = this.$refs.button as InstanceType<typeof Button>;

            menu.toggle({ currentTarget: this.$el, relatedTarget: button.$el });
            this.isExpanded = menu.visible;
        },
        onDropdownKeydown(event: KeyboardEvent) {
            if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
                this.onDropdownButtonClick();
                event.preventDefault();
            }
        },
        onDefaultButtonClick(event: MouseEvent) {
            if (this.isExpanded) {
                const menu = this.$refs.menu as InstanceType<typeof TieredMenu>;

                menu.hide(event, undefined);
            }

            this.$emit('click', event);
        }
    },
    computed: {
        containerClass() {
            return [this.cx('root'), this.class];
        },
        hasFluid() {
            return isEmpty(this.fluid) ? !!this.$pcFluid : this.fluid;
        }
    },
    components: {
        PVSButton: Button,
        PVSMenu: TieredMenu,
        ChevronDownIcon: ChevronDownIcon
    }
});
</script>
