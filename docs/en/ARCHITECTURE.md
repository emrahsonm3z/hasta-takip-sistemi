# Architecture

This document explains how the application is organised: which building blocks
exist, what each one is responsible for, and how they fit together. It is for
anyone who wants to understand the project's structure — you do not need to be
a developer to follow the big picture.

> This is an early skeleton. Each section will be filled with full
> explanations and short examples in an upcoming documentation pass.

## The big picture

A single-page web application for tracking patients. It loads the patient list
once from a data service, keeps all later changes on your own device, and
speaks two languages (Turkish and English).

## Modules

Each feature lives in its own self-contained folder, called a module — for
example `patients` (the patient screens) and `docs` (the documentation viewer
you are reading right now). A module keeps everything it needs in one place
and only talks to other modules through its public doorway.

## Layers

Inside a module, code is arranged in layers, each with one job: talking to the
outside world, describing data shapes, transforming data, coordinating, and
drawing the screen. Each layer may only lean on the layers below it.

## Routing and the menu

Which page opens at which address, and how the sidebar menu is generated from
the same single list of routes — so the menu can never drift out of sync.

## Configuration

What the application needs from its environment to start (for example, the
address of the data service), and how a missing setting is reported.
