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
| lint      | fails (21 errors, 5 warnings) |

Later stack layers should reduce the lint baseline and must not introduce new lint failures outside their scope.
