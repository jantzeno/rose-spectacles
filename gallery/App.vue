<script setup lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { catalog, idFor, legacy } from './catalog';

const sections = Object.entries(catalog).map(([name, demos]) => ({
    name,
    demos: demos.map((entry) => ({ ...entry, id: idFor(entry.name), component: defineComponent({ setup: entry.setup }) }))
}));
const allDemos = sections.flatMap(({ demos }) => demos);
const query = ref('');
const selected = ref(idFor(allDemos[0].name));

const updateLocation = () => {
    const hash = window.location.hash.slice(1);
    if (allDemos.some(({ id }) => id === hash)) selected.value = hash;
};

onMounted(() => {
    updateLocation();
    window.addEventListener('hashchange', updateLocation);
});
onUnmounted(() => window.removeEventListener('hashchange', updateLocation));

const visible = computed(() => {
    const value = query.value.trim().toLowerCase();
    return sections
        .map(({ name, demos }) => ({ name, demos: demos.filter((entry) => [entry.name, ...entry.names].some((part) => part.toLowerCase().includes(value))) }))
        .filter(({ demos }) => demos.length);
});
const example = computed(() => allDemos.find(({ id }) => id === selected.value) ?? allDemos[0]);
</script>

<template>
    <header class="top">
        <a class="brand" href="#button">Rose Spectacles</a>
        <a class="skip-link" href="#example">Skip to example</a>
    </header>
    <div class="shell">
        <aside class="navigation">
            <label for="search">Find a component</label>
            <input id="search" v-model="query" type="search" placeholder="Search components" />
            <nav aria-label="Components">
                <section v-for="group in visible" :key="group.name">
                    <h2>{{ group.name }}</h2>
                    <ul>
                        <li v-for="entry in group.demos" :key="entry.id">
                            <a :href="'#' + entry.id" :aria-current="selected === entry.id ? 'page' : undefined">{{ entry.name }}</a>
                        </li>
                    </ul>
                </section>
                <p v-if="!visible.length" role="status">No components match.</p>
            </nav>
        </aside>
        <main id="example" tabindex="-1">
            <h1>{{ example.name }}</h1>
            <p v-if="example.names.some((name) => legacy.has(name))" class="legacy">Legacy component</p>
            <div class="sample" :data-example="example.id">
                <component :is="example.component" :key="example.id" />
            </div>
        </main>
    </div>
</template>
