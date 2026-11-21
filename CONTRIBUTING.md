# Contributing

Use the Bun version in `package.json`. Run `bun install --frozen-lockfile` from the repository root.

- `bun run lint` checks the source with Oxlint.
- `bun run format:check` checks formatting with Oxfmt.
- `bun run test:unit` runs the Vue Test Utils suite in jsdom.

When fixing an upstream issue, reproduce it with a regression test and add the test and resolving commit to the [issue ledger](docs/upstream-issues.json).
