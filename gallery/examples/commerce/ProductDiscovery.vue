<script setup lang="ts">
import { ArrowUpRight, Search, SlidersHorizontal } from '@lucide/vue';
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch, type ComponentPublicInstance } from 'vue';
import { Button, Card, Chip, DataView, Drawer, EmptyState, IconField, InputIcon, InputText, Select } from 'rose-spectacles';
import CatalogFilters from './CatalogFilters.vue';
import ProductPhoto from './ProductPhoto.vue';
import { categories, formatMoney, products, type ProductCategory } from './products';

const maxPrice = 100;
const sorts = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to high', value: 'price-asc' },
    { label: 'Price: High to low', value: 'price-desc' }
] as const;
type Sort = (typeof sorts)[number]['value'];

const query = ref('');
const pickedCategories = ref<ProductCategory[]>([]);
const priceRange = ref([0, maxPrice]);
const inStock = ref(false);
const sort = ref<Sort>('featured');
const filtersOpen = ref(false);
const filterTrigger = useTemplateRef<ComponentPublicInstance>('filterTrigger');

function readPrice(value: string | null, fallback: number) {
    if (!value?.trim()) return fallback;
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(maxPrice, Math.max(0, number)) : fallback;
}

function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    query.value = params.get('catalog-q') ?? '';
    const selected = params.getAll('catalog-category');
    pickedCategories.value = categories.filter((category) => selected.includes(category));
    priceRange.value = [readPrice(params.get('catalog-min'), 0), readPrice(params.get('catalog-max'), maxPrice)].sort((a, b) => a - b);
    inStock.value = params.get('catalog-stock') === '1';
    sort.value = sorts.find(({ value }) => value === params.get('catalog-sort'))?.value ?? 'featured';
}

onMounted(() => {
    restoreFromUrl();
    window.addEventListener('popstate', restoreFromUrl);
});
onUnmounted(() => window.removeEventListener('popstate', restoreFromUrl));

watch(
    [query, pickedCategories, priceRange, inStock, sort],
    () => {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const values = {
            'catalog-q': query.value.trim(),
            'catalog-min': priceRange.value[0] > 0 ? String(priceRange.value[0]) : '',
            'catalog-max': priceRange.value[1] < maxPrice ? String(priceRange.value[1]) : '',
            'catalog-stock': inStock.value ? '1' : '',
            'catalog-sort': sort.value === 'featured' ? '' : sort.value
        };

        for (const [key, value] of Object.entries(values)) {
            if (value) params.set(key, value);
            else params.delete(key);
        }
        params.delete('catalog-category');
        for (const category of pickedCategories.value) params.append('catalog-category', category);
        if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
    },
    { deep: true }
);

const filteredProducts = computed(() => {
    const term = query.value.trim().toLocaleLowerCase();
    const [min, max] = priceRange.value;
    const result = products.filter(
        (product) =>
            (!term || product.name.toLocaleLowerCase().includes(term)) &&
            (!pickedCategories.value.length || pickedCategories.value.includes(product.category)) &&
            product.price >= min &&
            product.price <= max &&
            (!inStock.value || product.inStock)
    );

    if (sort.value === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort.value === 'price-desc') result.sort((a, b) => b.price - a.price);
    return result;
});

function resetPrice() {
    priceRange.value = [0, maxPrice];
}

const activeFilters = computed(() => [
    ...pickedCategories.value.map((category) => ({
        label: category,
        remove: () => {
            pickedCategories.value = pickedCategories.value.filter((value) => value !== category);
        }
    })),
    ...(query.value.trim()
        ? [
              {
                  label: 'Search: ' + query.value.trim(),
                  remove: () => {
                      query.value = '';
                  }
              }
          ]
        : []),
    ...(priceRange.value[0] !== 0 || priceRange.value[1] !== maxPrice
        ? [{ label: formatMoney(priceRange.value[0]) + ' – ' + formatMoney(priceRange.value[1]), remove: resetPrice }]
        : []),
    ...(inStock.value
        ? [
              {
                  label: 'In stock only',
                  remove: () => {
                      inStock.value = false;
                  }
              }
          ]
        : [])
]);

function clearFilters() {
    query.value = '';
    pickedCategories.value = [];
    resetPrice();
    inStock.value = false;
}

function selectVariant(color: 'olive' | 'clay') {
    const url = new URL(window.location.href);
    url.searchParams.set('variant-color', color);
    window.history.replaceState(window.history.state, '', url);
}

function restoreFilterFocus() {
    (filterTrigger.value?.$el as HTMLElement | undefined)?.focus();
}
</script>

<template>
    <div class="commerce-catalog">
        <div class="commerce-toolbar">
            <IconField class="commerce-search">
                <InputIcon><Search :size="17" aria-hidden="true" /></InputIcon>
                <InputText v-model="query" placeholder="Search products" aria-label="Search products" />
            </IconField>
            <Button ref="filterTrigger" class="commerce-mobile-filters" label="Filters" outlined aria-haspopup="dialog" @click="filtersOpen = true">
                <template #icon><SlidersHorizontal :size="17" aria-hidden="true" /></template>
            </Button>
            <Select v-model="sort" :options="[...sorts]" option-label="label" option-value="value" aria-label="Sort products" />
        </div>
        <div class="commerce-catalog-layout">
            <aside class="commerce-desktop-filters" aria-label="Catalog filters">
                <CatalogFilters v-model:categories="pickedCategories" v-model:range="priceRange" v-model:in-stock="inStock" :max-price="maxPrice" />
            </aside>
            <div class="commerce-catalog-results">
                <div class="commerce-applied-filters">
                    <p role="status">{{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'product' : 'products' }}</p>
                    <div v-if="activeFilters.length" class="commerce-filter-tags">
                        <Chip v-for="filter in activeFilters" :key="filter.label" :label="filter.label" removable @remove="filter.remove" />
                        <Button label="Clear filters" text @click="clearFilters" />
                    </div>
                </div>
                <DataView :value="filteredProducts" layout="grid">
                    <template #grid="{ items }">
                        <div class="commerce-catalog-grid">
                            <Card v-for="product in items" :key="product.id" class="commerce-product-card">
                                <template #header><ProductPhoto :name="product.photo" /></template>
                                <template #title><h3>{{ product.name }}</h3></template>
                                <template #subtitle>{{ product.category }}</template>
                                <template #content>
                                    <p class="commerce-product-price">{{ formatMoney(product.price) }}</p>
                                    <span>{{ product.inStock ? 'In stock' : 'Sold out' }}</span>
                                </template>
                                <template v-if="product.category === 'Bags'" #footer>
                                    <Button
                                        as="a"
                                        href="#product-variants"
                                        label="View variants"
                                        text
                                        @click="selectVariant(product.photo === 'clay' ? 'clay' : 'olive')"
                                    >
                                        <template #icon><ArrowUpRight :size="16" aria-hidden="true" /></template>
                                    </Button>
                                </template>
                            </Card>
                        </div>
                    </template>
                    <template #empty>
                        <EmptyState title="No matching products" description="Try a different search or clear the current filters." heading="h3">
                            <template #actions><Button label="Clear filters" @click="clearFilters" /></template>
                        </EmptyState>
                    </template>
                </DataView>
            </div>
        </div>
        <Drawer
            v-model:visible="filtersOpen"
            class="commerce-facet-drawer"
            header="Catalog filters"
            aria-label="Catalog filters"
            :block-scroll="true"
            @after-hide="restoreFilterFocus"
        >
            <CatalogFilters v-model:categories="pickedCategories" v-model:range="priceRange" v-model:in-stock="inStock" :max-price="maxPrice" />
            <template #footer><Button :label="'Show ' + filteredProducts.length + ' results'" @click="filtersOpen = false" /></template>
        </Drawer>
    </div>
</template>
