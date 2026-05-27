---
name: test-runner
description: Intelligently selects and runs tests based on code changes, features, or Jira IDs across M-One, MethodUI, and Playwright repositories
allowedTools: [Bash, Glob, Grep, Read]
disallowedTools: [Write, Edit, NotebookEdit]
---

# Test Runner Skill

Select and run tests based on what you're working on.

## Repositories

| Repo | Path | Framework |
|------|------|-----------|
| M-One | `c:\MethodDev\method-platform-ui\m-one` | Jest 29 |
| MethodUI | `c:\MethodDev\method-platform-ui\MethodUI` | Jest 29 |
| Playwright | `C:\MethodDev\playwright-automation-tests` | Playwright |

## Workflow

1. **Parse input** for: file paths, feature names, Jira IDs (PL-TR-XXX), widget codes
2. **Load mappings** from `./mappings/*.json` as needed
3. **Recommend tests** with exact commands
4. **Ask before running** - never auto-execute
5. **Summarize results** with pass/fail counts

## Commands

**M-One:**
```bash
npx nx test @m-next/[package]              # Single package
npx nx test @m-next/[pkg] -- --watch       # Watch mode
npm run affected-test                      # Changed packages only
```

**MethodUI:**
```bash
npm test                                   # All tests
npm test -- --testPathPattern="pattern"    # Pattern match
```

**Playwright:**
```bash
npx playwright test tests/[feature]/       # Feature directory
npx playwright test -g "test name"         # By name pattern
```

## Critical Paths

If working on `packages/runtime-interface/` or `packages/types/`:
```
⚠️ CRITICAL - Run full test sequence:
1. npx nx test @m-next/runtime-interface
2. npm run affected-test
3. npx playwright test tests/app-builder/
```

## Response Format

```
### Test Analysis
[What you identified]

### Recommended Tests
#### Unit Tests (M-One)
- Command: `[command]`

#### E2E Tests (Playwright)
- Command: `[command]`

Would you like me to run these tests?
```

## Mappings

Load from `./mappings/` as needed:
- `jira-to-tests.json` - Jira ID → Playwright test paths
- `components-to-packages.json` - Widget codes → M-One packages
- `features-to-e2e.json` - Feature names → Playwright directories
