# Shared Components

This document describes the reusable building blocks that every screen is
assembled from: the table, the form fields, the loading and error displays,
the notification messages, and the layout shell. It is useful for anyone who
wants to know what the screens have in common — and essential reading for
developers before building a new screen.

> This is an early skeleton. Each component will get its full description
> (what it does, what it accepts, how it behaves) in an upcoming
> documentation pass.

## One table for everything

All lists in the app use a single shared table component. It understands
Turkish sorting and searching (so "ç" and "ı" behave correctly), shows page
numbers, and adapts to small screens. Screens are not allowed to build their
own tables.

## Form fields

Text boxes, dropdowns, date pickers, checkboxes — all come from a shared set
of form fields with labels and error messages built in, in both languages.

## Loading, errors, and messages

There is one way to show "loading", one way to show "this failed, try again",
one way to show a popup notification, and clear separation between an expected
problem (the data did not load) and an unexpected one (a bug). Each has its
own dedicated component, used everywhere.

## The layout shell

The sidebar, the top bar, the logo, the language switch, and the light/dark
toggle together form the frame around every page.
