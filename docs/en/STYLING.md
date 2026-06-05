# Styling & Theme

This document explains how the application gets its look: where the colours
come from, how light and dark mode work, and why everything stays visually
consistent. It is for anyone curious about the design system; the technical
sections matter mostly to developers.

> This is an early skeleton. Each section will be expanded with full detail
> in an upcoming documentation pass.

## One source of colour

Every colour in the app comes from a single palette (the theme). No screen is
allowed to invent its own colour. This is why the whole app changes correctly,
everywhere, when you switch between light and dark.

## Light and dark mode

The moon/sun button in the top bar swaps the entire theme in one move. Your
choice is remembered for your next visit.

## The design language

A calm, modern look: the menu sits flat on the page background with a
decorative pattern behind it, while content lives on raised white (or dark)
cards. The typeface is Inter, hosted by the app itself.

## The tools

Three styling tools share that one palette: the component library's theme,
utility classes for spacing and layout, and a small amount of custom styling
for the shell. Which tool is used when is a documented rule.
