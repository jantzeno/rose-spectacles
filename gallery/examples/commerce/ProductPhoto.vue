<script setup lang="ts">
import { photos, type ProductPhotoName } from './products';

defineProps<{ name: ProductPhotoName; decorative?: boolean }>();
</script>

<template>
    <span
        class="commerce-product-photo"
        :style="{ backgroundPosition: photos[name].position }"
        :role="decorative ? undefined : 'img'"
        :aria-hidden="decorative || undefined"
        :aria-label="decorative ? undefined : photos[name].alt"
    />
</template>

<style>
.commerce-product-photo {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    background-color: #ecdcca;
    background-image: url('./products.webp');
    background-repeat: no-repeat;
    background-size: 300% 200%;
}
</style>
