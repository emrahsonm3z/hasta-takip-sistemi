# How We Work

This document explains how a change makes its way into the application: from
the first idea, through writing and checking the code, to going live. It is
written for everyone on the team — you do not need to be a developer to follow
it. If you only remember one thing, remember this: **nothing goes live without
the project owner's review and approval.**

## The two roles

- **The developer** (in this project, the AI assistant Claude Code working
  under supervision) writes the code and prepares every change.
- **The owner** (the project manager) reviews every change, opens the pull
  request, and presses the final "merge" button. The owner is the only person
  who can put something live.

## Where work comes from

Planned work lives in one place: the **Sprint Plan** (you can read it right
here in the app, under Documentation). It is a simple list of tasks. Finished
tasks are marked with a ✅ and are never deleted, so the plan is also the
project's history.

## The life of a change, step by step

1. **Plan first.** Before any code is written, the developer reads the
   relevant documentation and proposes a plan: what will change, in what
   order, and how it will be tested. The owner reviews and approves the plan.
2. **Work in small, reviewed steps.** The change is built piece by piece. Each
   piece is checked by the developer (a self-review), and only then recorded
   as a **commit** — a small, named snapshot of the work. Commit messages
   follow a strict naming convention so that machines can read them too (this
   powers automatic version numbers — see "Versions & Releases").
3. **Update the documentation.** If the change affects anything described in
   the documentation, the relevant pages are updated in **both languages** in
   the same batch of work.
4. **Push and stop.** The developer uploads ("pushes") the finished branch and
   **stops there**. The developer does **not** open the pull request. After
   pushing, the developer hands the owner a proposed title and description for
   it in its final report.
5. **The owner opens the pull request.** A **pull request** (PR) is a request
   to bring the change into the main version of the app. Its description is
   the **contract**: what was planned, what was done, how it was tested, and
   which documents were touched. The owner opens it on GitHub using the text
   the developer proposed.
6. **Automatic checks run.** Every pull request is checked by a machine (the
   **CI gate**): code quality, types, formatting, tests, and a security scan.
   A pull request **cannot** be merged while the gate is red.
7. **The owner reviews and merges.** The owner compares the work against the
   contract. If something is off, it goes back to the developer. When it is
   right and the gate is green, the owner merges it — keeping each reviewed
   step visible in the history (no squashing).
8. **It goes live.** Merging to the main branch deploys the application
   automatically.

## The safety rules that never bend

- The developer never records (commits) work without approval, never uploads
  it without finishing the agreed steps, and **never opens the pull request**.
- The automated gate runs on every pull request, with no exceptions.
- Small, low-risk changes may skip the formal planning ceremony — but never
  the pull request, the gate, or the owner's review.

## When something goes wrong

If a problem reaches the live application, there are two tools: the hosting
service can instantly roll back to the previous version, and an urgent fix can
travel the same path described above, just faster.
