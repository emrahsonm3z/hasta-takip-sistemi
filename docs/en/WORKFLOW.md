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
| Developer | Claude Code, working under supervision | Plans, writes code + tests, self-reviews, **presents the full diff before committing**, commits the approved breakdown, pushes — then STOPS |
| Owner | The repository owner / team manager | Reviews plans and **the pre-commit diff**, **opens the pull request**, does the final check, merges, owns every release |

---

## The life of a change

```
idea (sprint plan)
  → audit / plan (no code; owner approves)
    → implement the sub-items + tests, one at a time
        → self-review each — NOTHING is committed yet
    → prepare the docs:sync edits (both languages), still uncommitted
  → pre-commit review: the developer outputs the full diff, the planned
    commit breakdown, and the proposed PR title + body — then STOPS
    → the owner reviews the actual diff (issues → fix → re-review)
  → on approval: the atomic Conventional sub-commits are made and the
    branch is pushed — the developer's flow ENDS here
    → the OWNER opens the PR on GitHub (the already-reviewed description
      is the contract)
      → the CI gate runs — must be green
        → the owner's final check against the contract
          → Rebase and merge (sub-commits preserved, never squashed)
            → Vercel deploys main automatically
```

Small, low-risk changes (dependency bumps, typo fixes) may skip the formal
audit ceremony — but never the pre-commit diff review, the pull request, the
gate, or the owner's merge.

---

## The pre-commit diff review

The owner reviews the actual changes **before they are committed** — not only
on the pull request. When a topic's work is complete (code, tests, and the
bilingual documentation updates), the developer presents three things and
stops:

1. the full uncommitted diff (`git diff`),
2. the planned commit breakdown — which hunks become which Conventional
   Commit, in what order,
3. the proposed pull-request title and body (the contract).

The owner reads the diff; problems go back to the developer, the corrected
diff is presented again, and the loop repeats until the owner approves. Only
then are the planned atomic commits made and the branch pushed. The later
look at the pull request (with the gate green) is a **final check** against
the contract — the substantive code review has already happened here.

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

## Release PRs

After merges land on `main`, the release-please robot opens a **Release PR**
(version bump + changelog — see "Versions & Releases"). The robot opens it
with a dedicated token (`RELEASE_PLEASE_TOKEN`, a repository secret) instead
of the default workflow token — deliberately: GitHub's anti-recursion rule
blocks workflows from running on pull requests opened by the default token,
which would leave the required gate stuck at "waiting for status". With the
dedicated token, **the gate runs on the Release PR automatically**, and the
owner merges it like any other pull request, on a real green check.

---

## When something goes wrong

A failed self-review loops back to implementation; a failed owner review goes
back to the developer. If a problem reaches production: Vercel can instantly
roll back to the previous deployment, and an urgent fix travels the same path
above on a `fix/*` branch, just faster.
