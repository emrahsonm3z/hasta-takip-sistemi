# Testing

This document explains how we check that the application works correctly —
what is tested automatically, what is checked by hand, and where the line
between the two sits. The big picture is for everyone; the tooling details
matter mostly to developers.

> This is an early skeleton. Each section will be expanded with full detail
> in an upcoming documentation pass.

## What machines check

The pure logic of the application — data transformations, Turkish text
handling, translation-file completeness, the documentation registry — is
covered by automated tests that run on every change, plus a full chain of
code-quality checks (types, lint, formatting).

## What humans check

Visual appearance and on-screen behaviour are verified by hand. The project
deliberately keeps no automated browser tests at this stage; adding them is a
recorded, separate decision.

## When tests are written

Tests are planned together with the work (in the planning step) and written
together with the code — never bolted on afterwards.
