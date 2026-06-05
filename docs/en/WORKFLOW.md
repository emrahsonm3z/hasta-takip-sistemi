# How We Work

This document explains how a change makes its way into the application: from
the first idea, through writing and checking the code, to going live. If you
only remember one thing, remember this: **nothing goes live without the
project owner's review, and the owner — never the AI developer — opens and
merges the pull request.**

---

## The two roles

| Role | Who | Does |
| --- | --- | --- |
| Developer | Claude Code, working under supervision | Plans, writes code + tests, self-reviews, commits (only with approval), pushes — then STOPS |
| Owner | The repository owner / team manager | Reviews plans and code, **opens the pull request**, merges, owns every release |

---

## The life of a change

```
idea (sprint plan)
  → audit / plan (no code; owner approves)
    → implement one sub-item at a time
        → self-review → Conventional Commit (one per reviewed sub-item)
    → docs:sync (both languages) in the topic's final commit
  → push the branch — the developer's flow ENDS here
    → the OWNER opens the PR on GitHub (using the title + body the
      developer proposed in its final report; the description is the contract)
      → the CI gate runs — must be green
        → owner reviews against the contract
          → Rebase and merge (sub-commits preserved, never squashed)
            → Vercel deploys main automatically
```

Small, low-risk changes (dependency bumps, typo fixes) may skip the formal
audit ceremony — but never the pull request, the gate, or the owner's merge.

---

## Commits — readable by humans AND machines

Every commit message follows **Conventional Commits**, enforced by commitlint
on a git hook. A real example from this branch:

```
feat(layout): group module docs under a section label in the sub-menu
```

The type prefix is not cosmetic: release-please derives version numbers from
it (see "Versions & Releases"). The common types here:

| Type | Means | Version effect (0.x) |
| --- | --- | --- |
| `feat:` | something new | minor bump |
| `fix:` | a repair | patch bump |
| `docs:` / `chore:` / `ci:` / `refactor:` | no user-facing change | none |

Branches are named by the same types: `feat/*`, `fix/*`, `docs/*`, `chore/*` —
one topic per branch, many reviewed commits on it.

---

## The automated gate

Every pull request runs the `gate` job (`.github/workflows/ci.yml`) — the
exact steps, in order:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version-file: .nvmrc      # Node 24
    cache: npm
- run: npm ci
- run: npm run validate            # type-check + ESLint + Stylelint + Prettier
- run: npm test                    # node --test (pure-logic specs)
- run: npm run build               # production build must succeed
- run: npm audit --audit-level=high
```

Branch protection on `main` requires a pull request and a green `gate` before
merging, with linear history (only "Rebase and merge" is possible — sub-commits
are preserved because release-please reads each one; squashing would destroy
release signal). The check is required but not in "strict" mode (the branch
does not have to be re-synced with `main` before merging). Administrators stay
exempt — needed for the release flow below.

---

## Release PRs and the close + reopen trick

After merges land on `main`, the release-please robot opens a **Release PR**
(version bump + changelog — see "Versions & Releases"). That PR is created by
the `GITHUB_TOKEN`, and GitHub's anti-recursion rule means a robot-opened PR
does not trigger the CI gate by itself. The owner's preferred move: **close
the Release PR and reopen it in the GitHub UI** — a human-initiated reopen IS
allowed to trigger workflows, the gate runs, and the PR merges with a real
green check. (Fallback: admin-exempt direct merge — acceptable because the
Release PR only ever touches the version number and the changelog.)

---

## When something goes wrong

A failed self-review loops back to implementation; a failed owner review goes
back to the developer. If a problem reaches production: Vercel can instantly
roll back to the previous deployment, and an urgent fix travels the same path
above on a `fix/*` branch, just faster.
