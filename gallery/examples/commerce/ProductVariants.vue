<script setup lang="ts">
import { ShoppingBag } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { Badge, Button, Card, SelectButton } from 'rose-spectacles';
import ProductPhoto from './ProductPhoto.vue';
import { formatMoney, type ProductPhotoName } from './products';

const colors = [
    { value: 'olive', label: 'Olive', swatch: '#55553b', photos: ['olive', 'oliveDetail'] },
    { value: 'clay', label: 'Clay', swatch: '#a85434', photos: ['clay', 'clayDetail'] }
] as const;

type Color = (typeof colors)[number]['value'];
type Size = '25 L' | '35 L' | '45 L';

const variants: Record<Color, readonly { size: Size; price: number; stock: number }[]> = {
    olive: [
        { size: '25 L', price: 84, stock: 6 },
        { size: '35 L', price: 98, stock: 4 },
        { size: '45 L', price: 114, stock: 0 }
    ],
    clay: [
        { size: '25 L', price: 92, stock: 0 },
        { size: '35 L', price: 106, stock: 3 },
        { size: '45 L', price: 122, stock: 5 }
    ]
};

const color = ref<Color>('olive');
const size = ref<Size>('25 L');
const photoIndex = ref(0);
const bag = ref<Record<string, number>>({});
const bagCount = computed(() => Object.values(bag.value).reduce((total, quantity) => total + quantity, 0));
const currentColor = computed(() => colors.find(({ value }) => value === color.value)!);

const sizes = computed(() => variants[color.value].map((variant) => ({ ...variant, disabled: !variant.stock })));
const selected = computed(() => sizes.value.find((variant) => variant.size === size.value)!);
const sku = computed(() => color.value + '-' + size.value);
const quantity = computed(() => bag.value[sku.value] ?? 0);

const mainPhoto = computed<ProductPhotoName>(() => currentColor.value.photos[photoIndex.value]);
const photoLabels = ['Front view', 'Zipper detail'];

function selectColor(next: Color) {
    if (next === color.value) return;

    color.value = next;
    photoIndex.value = 0;
    if (!sizes.value.some((option) => option.size === size.value && !option.disabled)) {
        const available = sizes.value.find((option) => !option.disabled);
        if (available) size.value = available.size;
    }
}

onMounted(() => {
    const selection = new URLSearchParams(window.location.search).get('variant-color');
    if (selection === 'clay' || selection === 'olive') selectColor(selection);
});

function addToBag() {
    if (quantity.value < selected.value.stock) bag.value = { ...bag.value, [sku.value]: quantity.value + 1 };
}
</script>

<template>
    <div class="commerce-variant-layout">
        <div class="commerce-variant-media">
            <ProductPhoto :name="mainPhoto" class="commerce-variant-photo" />
            <div class="commerce-photo-options" role="group" aria-label="Product views">
                <Button
                    v-for="(photo, index) in currentColor.photos"
                    :key="photo"
                    outlined
                    class="commerce-photo-option"
                    :aria-label="'View ' + photoLabels[index].toLowerCase()"
                    :aria-pressed="photoIndex === index"
                    @mouseenter="photoIndex = index"
                    @focus="photoIndex = index"
                    @click="photoIndex = index"
                >
                    <ProductPhoto :name="photo" decorative />
                </Button>
            </div>
        </div>

        <Card class="commerce-variant-card">
            <template #title><h2>Canvas Weekender</h2></template>
            <template #subtitle>Heavyweight canvas with reinforced straps and a full-length zipper.</template>
            <template #content>
                <div class="commerce-variant-price">
                    <strong>{{ formatMoney(selected.price) }}</strong>
                    <Badge :value="selected.stock + ' in stock'" severity="success" />
                </div>
                <fieldset>
                    <legend>Color</legend>
                    <SelectButton
                        :model-value="color"
                        :options="[...colors]"
                        option-label="label"
                        option-value="value"
                        :allow-empty="false"
                        aria-label="Color"
                        @update:model-value="selectColor"
                    >
                        <template #option="{ option }">
                            <span class="commerce-swatch" :style="{ backgroundColor: option.swatch }" aria-hidden="true" />
                            {{ option.label }}
                        </template>
                    </SelectButton>
                </fieldset>
                <fieldset>
                    <legend>Capacity</legend>
                    <SelectButton
                        v-model="size"
                        :options="sizes"
                        option-label="size"
                        option-value="size"
                        option-disabled="disabled"
                        :allow-empty="false"
                        aria-label="Capacity"
                    >
                        <template #option="{ option }"> {{ option.size }}<span v-if="option.disabled" class="commerce-option-status">Sold out</span> </template>
                    </SelectButton>
                </fieldset>
            </template>
            <template #footer>
                <Button label="Add to bag" :disabled="quantity >= selected.stock" @click="addToBag">
                    <template #icon><ShoppingBag :size="17" aria-hidden="true" /></template>
                </Button>
                <p class="commerce-bag-count" role="status">{{ bagCount }} {{ bagCount === 1 ? 'item' : 'items' }} in your bag</p>
            </template>
        </Card>
    </div>
</template>
