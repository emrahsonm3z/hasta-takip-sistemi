# Versions & Releases

This document explains how the application gets its version numbers (like
0.2.0) and how a release is cut. The short version for everyone: **nobody
types a version number — a robot derives it from the commit history, and the
owner approves each release with one click.** The exact mechanics follow.

---

## What a version number means

`major.minor.patch` — e.g. `0.2.0`:

| Part | Bumps when | Example |
| --- | --- | --- |
| patch | only fixes landed (`fix:`) | 0.2.0 → 0.2.1 |
| minor | something new landed (`feat:`) | 0.2.0 → 0.3.0 |
| major | stays **0** during initial development | — |

While pre-1.0, even breaking changes bump only the minor
(`bump-minor-pre-major: true` in the config below). Moving to 1.0.0 will be a
deliberate decision when the app is feature-complete — it cannot happen by
accident.

---

## Where the numbers come from

Every commit message carries a machine-readable type (`feat:`, `fix:`, … —
see "How We Work"). The **release-please** GitHub Action reads the commits on
`main` and computes the next version on its own. The complete setup is two
small files:

```yaml
# .github/workflows/release.yml
on:
  push:
    branches: [main]
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          token: ${{ secrets.RELEASE_PLEASE_TOKEN }}
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
```

```json
// release-please-config.json
{
  "include-component-in-tag": false,
  "bump-minor-pre-major": true,
  "packages": {
    ".": { "release-type": "node", "package-name": "hasta-takip-sistemi" }
  }
}
```

This is why every reviewed sub-commit is preserved on `main` (rebase-merge,
never squash): each commit's type is release signal.

---

## How a release is cut, step by step

1. Topic branches merge into `main` as usual. **Each merge already deploys
   the code** (Vercel watches `main`) — but the version number does not move.
2. The robot notices the new commits and opens (or updates) a single
   **Release PR**: it bumps `package.json`'s version, updates the manifest,
   and regenerates `CHANGELOG.md` from the commit messages since the last
   release.
3. The owner merges that Release PR — the release now exists: the version is
   bumped and the commit is tagged (e.g. `v0.2.0`).

One detail worth knowing: the robot opens the Release PR with a dedicated
token (`RELEASE_PLEASE_TOKEN`, a repository secret) rather than the default
workflow token. That matters because GitHub blocks workflows from running on
pull requests opened by the default token (an anti-recursion safety rule) —
the required gate would never start. With the dedicated token, **the CI gate
runs on the Release PR automatically**, and the owner merges it like any
other pull request, on a real green check.

---

## The changelog

`CHANGELOG.md` lives at the repository root because release-please generates
it there. It is English-only (exempt from the bilingual docs rule) and is
rendered read-only inside the app — Documentation → Changelog shows the same
file in both languages.

There is no npm publish and no app store — the application is private, and
deployment happens at merge time. A "release" here is bookkeeping done well:
an accurate number and an honest changelog.
