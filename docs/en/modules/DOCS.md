# Docs Module

This document describes the documentation viewer itself — the feature you are
using right now. The first sections are for everyone; the inner workings are
for developers.

## What it does

The Documentation entry in the menu opens an index of all project documents
as cards. Clicking a card opens that document, rendered as a comfortable
reading page. Switching the application language (TR/EN) swaps the document
to its translation instantly.

## Where the documents live

Every document is a plain text file (Markdown) stored inside the project, in
an English folder and a Turkish folder with matching names. One special
document — the Changelog — lives at the project root because the release
tooling generates it there; it exists in English only and is shown in English
in both languages.

## The registry rule

The module keeps a single list (the registry) of every document: its address
in the app, its title in both languages, its icon, and its two files. A
document that is not on that list does not exist for the app — it gets no
card and no address. An automated test checks that every listed file really
exists, in both languages.

## How it is built

The registry and the route definitions are plain data. A loader picks the
file matching the active language and fetches it on demand (documents are not
bundled into the app's first download). A small renderer turns the Markdown
into styled reading pages, using the application's theme colours so it looks
right in both light and dark mode.
