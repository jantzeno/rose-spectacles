# Rose Spectacles migration and upstream issue audit

## Upstream issue ledger

- Create `docs/upstream-issues.json` with one entry for every issue open when implementation starts. GitHub showed **558 open issues** during planning. Fetch all pages, exclude pull requests, and record the snapshot time, total, and fork revision. Reconcile the issue IDs and totals before triage begins. [Upstream issue tracker](https://github.com/openvi-foundation/openvue/issues) · [GitHub issues API](https://docs.github.com/en/rest/issues/issues#list-repository-issues)
- Record each issue’s number, source link, title, affected component, disposition, and supporting evidence. Record a local regression test and resolving commit for each fix. Link duplicates to their primary entry and explain why any issue is outside scope or could not be verified.
- **Fix every confirmed defect in retained Vue and Vite code.** Check actual behavior in the fork, including when an upstream issue has a linked patch or is labeled as a feature. Record enhancements and issues tied to removed integrations. Keep upstream URLs in the ledger as provenance.

## Vue, TypeScript, and the gallery

- Consolidate the full Vue 3 catalog into one Bun-managed `rose-spectacles` source package. Keep components, legacy aliases, forms, icons, directives, and services. Declare Vue 3.5 as a peer, preserve named and direct imports, and document Git commit pinning and Vite configuration. Defer installation in Mission Control and Box Please.
- Convert all retained JavaScript, Vue script blocks, configs, tests, and examples to TypeScript. Preserve public component contracts. Use strict `vue-tsc`, Oxlint, and Oxfmt.
- Upgrade Chart.js to **4.6.1** and standardize Quill on **2.0.3**. Keep both as optional peers behind dedicated Chart and Editor imports, with both present in the gallery and test environment. [Chart.js versions](https://www.npmjs.com/package/chart.js?activeTab=versions) · [Quill releases](https://github.com/slab/quill/releases)
- Replace OpenUX dependencies with local helpers. Remove upstream themes, branding, sites, and distribution tooling while preserving required MIT attribution. Keep structural CSS and `rs-` styling hooks for app-owned visuals. Retain one Vite gallery with examples for every public component and document legacy components for later review.

## Tests and completion criteria

- Port the existing **777 passing tests** to TypeScript with Vitest, Vue Test Utils, and jsdom. Require a meaningful test and a gallery example for every public component, counting alternate imports of the same component once. Cover compound children in their intended parent. Reproduce confirmed issues with failing tests before applying fixes, then verify the tests pass.
- Run browser checks for gallery rendering, Chart canvas updates, Quill editing, and overlay focus and dismissal. Use Chromium when available. Otherwise, use headless Firefox with an isolated temporary profile and clean it up on exit. Chromium was absent locally. Firefox 159 launched successfully outside the workspace sandbox, and profile cleanup was verified.
- Finish with a frozen Bun install, lint, format, type checks, unit and browser tests, a production gallery build, and a disposable Vite consumer check. Reconcile the ledger against the snapshot and require a disposition for every issue, a fix for every confirmed in-scope defect, and a specific evidence gap for anything still unverified.

## Commit checkpoints

1. Capture the issue snapshot and establish the Bun, Oxc, and Vitest baseline.
2. Consolidate the package and remove upstream infrastructure.
3. Migrate and audit one component family at a time. Keep TypeScript conversions and defect fixes in separate reviewable commits. Group defects that share a verified root cause.
4. Upgrade Chart and Editor, then verify their behavior in a real browser.
5. Complete the gallery, CI checks, consumer verification, and ledger reconciliation.

Create local Conventional Commits after each validated chunk under the approval already given. Stage only task-related changes, include test results in each commit, and preserve unrelated work.
