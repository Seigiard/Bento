# Anti-slop checks

Run `bun run lint:anti-slop` to check owned JavaScript and TypeScript, including tests. A dedicated GitHub Actions job runs the same command on pull requests and pushes. Existing lint commands and workflows are retained.

All 18 upstream generic rules and native `oxc/no-accumulating-spread` are enabled at error severity. No direct Effect dependency is declared, so Effect rules are not registered.

Source: [dmmulroy/anti-slop at c44ef22](https://github.com/dmmulroy/anti-slop/tree/c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b/src). Exact provenance and licenses are in `tools/oxlint/anti-slop/`. Oxlint and `@oxlint/plugins` are pinned at 1.87.0. This upgrades older Oxlint installations because their matching plugin package versions are not published.

## Initial verification

The first installation check reported **27 existing source findings**. The cleanup resolved all of them without changing rule severity.

- `require-safety-comment-for-type-assertion`: 7
- `require-readable-spacing`: 17
- `no-unknown-parameters`: 3

| Command                         | Exit code |
| ------------------------------- | --------- |
| `bun run lint:anti-slop`        | 0         |
| `bun run lint`                  | 0         |
| `bun --bun tsc --noEmit`        | 0         |
| `bun install --frozen-lockfile` | 0         |
| `bun run size`                  | 0         |

Typechecking and existing type-aware lint pass. Existing lint has two warnings: an empty file and a non-Promise iterable passed to a promise aggregator. `moduleResolution` uses `bundler` to remain compatible with the updated type-aware engine.

## Scope

Owned source now has readable spacing. Response handlers decode JSON at the I/O boundary with the same Valibot schemas and errors. Redundant assertions were removed; the remaining API-key assertions document nanoquery key ordering and the string-valued settings store. The input handler uses Preact's typed currentTarget.

The size action is pinned to a revision with Bun support. Both head and base builds use Bun and clean their output after measurement. The Preact store adapter is pinned to the existing 1.0.0 version, which supports nanostores 0.10.3; later 1.x adapters require nanostores 1.2.0. The measured production bundle is 30.65 kB brotlied against the existing 45 kB budget.

Vendored plugin source, installed dependencies, generated output, and agent tooling are excluded from the new check. Existing rules are not suppressed. The separate config avoids inheriting broad legacy ignores that would exclude owned JavaScript or tests.

The existing staged-file lint command permits an empty match after ignores. This lets commits containing only vendored TypeScript pass the hook without linting or rewriting upstream files. Checks on owned files keep their existing rules.
