<script setup lang="ts">
import { useId } from 'vue';
import { Checkbox, CheckboxGroup, Slider } from 'rose-spectacles';
import { categories, formatMoney, type ProductCategory } from './products';

defineProps<{ maxPrice: number }>();
const picked = defineModel<ProductCategory[]>('categories', { required: true });
const range = defineModel<number[]>('range', { required: true });
const inStock = defineModel<boolean>('inStock', { required: true });
const id = useId();

function setRange(value: number | number[]) {
    if (Array.isArray(value)) range.value = value;
}
</script>

<template>
    <div class="commerce-facet-fields">
        <fieldset>
            <legend>Category</legend>
            <CheckboxGroup v-model="picked" class="commerce-facet-options">
                <div v-for="(category, index) in categories" :key="category" class="commerce-choice">
                    <Checkbox :input-id="id + '-category-' + index" :value="category" />
                    <label :for="id + '-category-' + index">{{ category }}</label>
                </div>
            </CheckboxGroup>
        </fieldset>
        <fieldset>
            <legend>Price range</legend>
            <p :id="id + '-price'" class="commerce-price-range">{{ formatMoney(range[0]) }} – {{ formatMoney(range[1]) }}</p>
            <Slider :aria-labelledby="id + '-price'" :model-value="range" :max="maxPrice" range @update:model-value="setRange" />
        </fieldset>
        <div class="commerce-choice">
            <Checkbox v-model="inStock" :input-id="id + '-stock'" binary />
            <label :for="id + '-stock'">In stock only</label>
        </div>
    </div>
</template>
