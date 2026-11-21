# Rose Spectacles

Rose Spectacles brings Vue 3 components, forms, icons, directives, and services together in one source package. It includes structural styles and exposes `rs-` classes and CSS custom properties for your application styles.

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

Install `chart.js@4.6.1` before importing Chart from `rose-spectacles/chart`, or `quill@2.0.3` before importing Editor from `rose-spectacles/editor`. Import forms and icons by name from the package root or from their dedicated subpaths such as `rose-spectacles/forms/form` and `rose-spectacles/icons/check`. Schema resolvers use `rose-spectacles/forms/resolvers/<library>` with the corresponding validator installed.

## Gallery and checks

```sh
bun install --frozen-lockfile
bun run dev
```

The gallery includes interactive examples and identifies legacy components. The [component reference](docs/components.md) maps former names to the current alternatives.

Run `bun run lint`, `bun run format:check`, `bun run typecheck`, `bun run test:unit`, and `bun run build` before opening a change. The production gallery browser test prefers Chromium and falls back to an isolated Firefox profile. Run `bun run test:browser` after the build. `bun run test:consumer` builds a disposable Vite application using the packaged source, and `bun run verify:issues` reconciles the upstream issue ledger.

## Attribution

The source incorporates MIT-licensed work from PrimeTek, OpenVi Foundation, and contributors. See the [license](LICENSE.md).
