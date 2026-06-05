# Data & Storage

This document explains where the patient data comes from, where it is kept,
and what happens when you add, edit, or delete a record. It is for anyone who
wonders "where does my change actually go?" — no developer background needed
for the big picture.

> This is an early skeleton. Each section will be expanded with full detail
> in an upcoming documentation pass.

## Where the data comes from

The patient list is downloaded **once** from a read-only data service. After
that first load, the application works from its own copy.

## Where your changes live

Adding, editing, and deleting all happen in your browser's local storage — on
your device, not on a server. This is a deliberate choice for this case-study
project: the data is mock data. Real patient data would never be handled this
way.

## How the screen stays fresh

An in-memory cache sits between the storage and the screens. After every
change, the cache is told "your copy is stale", and it re-reads from storage.
There is exactly one source of truth.

## If something goes wrong

A failed load shows an in-page error with a retry button; a failed save shows
a notification. Corrupt stored data is treated as empty rather than crashing
the app.
