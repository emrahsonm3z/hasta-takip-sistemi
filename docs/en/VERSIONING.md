# Versions & Releases

This document explains how the application gets its version numbers (like
0.2.0) and how a new release is published. It is written for everyone — no
developer background needed. The short version: **version numbers are not
chosen by hand; a robot derives them from the history of changes, and the
owner approves each release with one click.**

## What a version number means

A version looks like `0.2.0` — three numbers: **major.minor.patch**.

- A **patch** bump (0.2.0 → 0.2.1) means "small fixes only".
- A **minor** bump (0.2.0 → 0.3.0) means "something new was added".
- The **major** number says "things changed in a breaking way". While the
  project is still being built, the major stays at **0**; moving to 1.0.0 will
  be a deliberate decision when the app is feature-complete — it never happens
  by accident.

## Where the numbers come from

Every recorded change (every **commit**) carries a typed message, like
`fix: …` ("I repaired something") or `feat: …` ("I added something new"). A
robot called **release-please** reads these messages on the main branch and
works out the next version on its own: fixes bump the patch, features bump the
minor. This is why the message convention from "How We Work" is enforced so
strictly — the history is also the release calculator.

## How a release happens, step by step

1. Changes are merged into the main branch as usual (see "How We Work"). Each
   merge already puts the new code live — but the version number does not move
   yet.
2. The robot notices the new changes and opens (or updates) a special
   **Release PR**: a single pull request that raises the version number and
   rewrites the **Changelog** (the version-by-version list of what changed —
   also readable here in the app).
3. The owner merges that Release PR. That is the moment the new version
   officially exists: the number is bumped and the release is tagged.

There is no app store or package to publish — the application is private, and
going live happens through the normal merge, so a "release" here is really
about bookkeeping: the number and the changelog.

## The one quirk worth knowing

The Release PR is opened by a robot account, and for safety GitHub does not
let one robot's pull request trigger another robot's checks. So the automated
**gate** does not run on the Release PR by itself. The owner has two ways to
merge it:

- **Close and reopen it in the GitHub interface.** A reopen done by a human
  *does* trigger the checks, the gate runs, and the PR merges with a real
  green check. **This is the preferred path.**
- Merge it directly using the owner's administrator rights, without the check.
  This is acceptable because the Release PR only ever touches the version
  number and the changelog — it contains no code.
