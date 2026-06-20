# Verification

Standard commands for validating the repository:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run build
bun run lint
```

## Baseline status

| Check     | Status |
| --------- | ------ |
| install   | passes |
| typecheck | passes |
| build     | passes |
| lint      | fails (19 errors, 5 warnings) |

Later stack layers should reduce the lint baseline and must not introduce new lint failures outside their scope.

## Layer 1 exception

Layer 1 included two minimal source compatibility fixes (`src/components/cheats/game.tsx`, `src/components/ui/light-rays.tsx`) caused by `eslint-plugin-react-hooks@7.1.1`, solely to restore the existing lint baseline.
