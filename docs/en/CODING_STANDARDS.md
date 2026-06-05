# Coding Standards

This document explains the rules we follow when writing code, and — just as
important — why they exist. It is written so that anyone can understand the
spirit of the rules; the technical details matter mostly to developers, but
the reasoning is for everyone: these rules keep the code consistent, readable,
and safe to change.

## Names do the explaining

Everything in the code gets a descriptive, full-word name. Long names are
fine; cryptic abbreviations are not. A button for saving a new patient is
called `submitNewPatientButton`, never `sbmtBtn`. The goal: someone reading
the code should understand it without a translator.

## No explanatory comments

This project has an unusual rule: code may not contain explanatory comments or
documentation blocks. If a piece of code needs a comment to be understood, we
rename or restructure it until it doesn't. The explanation you would have put
in a comment belongs in these documentation pages instead — where everyone can
find it, in both languages. A custom-built check enforces this automatically.

## Every piece in its place

Code is split into small files, each with exactly one job, and each living in
the folder that matches that job (fetching data, describing shapes,
transforming, orchestrating, rendering). Anything used by more than one
feature moves to a shared, global place — it is never copy-pasted.

## No text lives in the code

Every word a user sees comes from the translation files (Turkish and English).
Writing a visible sentence directly into the code is treated as an error.
This is what makes the app fully bilingual — see "Languages (TR / EN)".

## Strict types — and no `any`, ever

The code is written in TypeScript, a language where every value declares what
kind of thing it is. The strictest checking is switched on. One rule is worth
naming for non-developers too: the word `any` (TypeScript's "this could be
anything, stop checking" escape hatch) is **banned**. Writing it fails the
automated checks. Where the type of something is genuinely unknown, the code
must say so honestly (`unknown`) and then prove what it is before using it —
silencing the checker is not an option.

## Machines enforce the rules

None of the above relies on memory or goodwill. A chain of automated tools
(ESLint for code rules, Prettier for formatting, Stylelint for styles,
commitlint for commit messages) runs on every change — before each commit on
the developer's machine and again in the automated gate (see "How We Work").
One command, `validate`, runs the whole chain.
