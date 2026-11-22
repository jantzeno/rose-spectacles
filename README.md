# Rose Spectacles

Rose Spectacles brings Vue 3 components, forms, directives, and services together in one source package. It includes structural styles and exposes `rs-` classes and CSS custom properties for your application styles.

## Install

Pin the Git dependency to a reviewed commit. Replace `COMMIT_SHA` with its full SHA.

```sh
bun add 'rose-spectacles@github:jantzeno/rose-spectacles#COMMIT_SHA'
bun add 'vue@^3.5.0'
```

Configure Vite to compile the Vue single-file components and skip prebundling the source package.

```ts
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vue()],
    optimizeDeps: { exclude: ['rose-spectacles'] },
    ssr: { noExternal: ['rose-spectacles'] }
});
```

Register the configuration plugin and import components by name or by subpath.

```ts
import { createApp } from 'vue';
import RoseSpectacles from 'rose-spectacles/config';
import App from './App.vue';

createApp(App).use(RoseSpectacles).mount('#app');
```

```vue
<script setup lang="ts">
import { Button } from 'rose-spectacles';
import Select from 'rose-spectacles/select';
</script>
```

Import forms by name from the package root or from dedicated subpaths such as `rose-spectacles/forms/form`. Schema resolvers use `rose-spectacles/forms/resolvers/<library>` with the corresponding validator installed.

Import application icons directly from `@lucide/vue`, for example `import { Check, Search } from '@lucide/vue'`. `IconField` and `InputIcon` still provide layout and accept Lucide icons in their slots.

### Chart and Editor

Install the optional peers for the component you use.

```sh
bun add '@unovis/ts@1.8.1'
bun add '@tiptap/core@3.35.0' '@tiptap/pm@3.35.0' '@tiptap/starter-kit@3.35.0' '@tiptap/extension-image@3.35.0' '@tiptap/extension-text-align@3.35.0' '@tiptap/extension-text-style@3.35.0'
```

Import Chart from `rose-spectacles/chart`. It accepts labels and datasets for bar, line, scatter, bubble, pie, and doughnut charts. Pie and doughnut use the first dataset. Set `options.stacked` for stacked bars and `options.indexAxis` to `'y'` for horizontal bars. Use `options.xAxis` and `options.yAxis` for Unovis axis configuration. Use `containerProps` and `pt.plot` for the SVG host. The old `canvasProps` and `pt.canvas` names still pass attributes to that host. `getChart()` returns the Unovis container. Use `getSVG()` for SVG markup or `getBase64Image()` for an SVG data URL.

Radar and polar-area charts, Chart.js plugins, canvas access, and PNG export were specific to the old engine. Consumers using those APIs need to update their chart configuration.

Import Editor from `rose-spectacles/editor`. Its `v-model` value is HTML. Use `extensions` to add Tiptap extensions and the `#toolbar="{ editor }"` slot to build a toolbar with native commands. The load and change events expose the Tiptap instance. Text-change events provide a ProseMirror transaction, and selection ranges use `from` and `to` document positions. Quill modules, Deltas, and toolbar classes need to be migrated to those APIs.

## Gallery and checks

```sh
bun install --frozen-lockfile
bun run dev
```

The gallery includes interactive examples. The [component reference](docs/components.md) maps removed legacy components to their replacements.

Run `bun run lint`, `bun run format:check`, `bun run typecheck`, `bun run test:unit`, and `bun run build` before opening a change. The production gallery browser test prefers Chromium and falls back to an isolated Firefox profile. Run `bun run test:browser` after the build. `bun run test:consumer` builds a disposable Vite application using the packaged source, and `bun run verify:issues` reconciles the upstream issue ledger.

## Attribution

The source incorporates MIT-licensed work from PrimeTek, OpenVi Foundation, and contributors. See the [license](LICENSE.md).
