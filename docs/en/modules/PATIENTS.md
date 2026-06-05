# Patients Module

This document describes the patient tracking feature in detail: the list, the
add/edit/delete flows, and how the module is built inside. The first sections
are for everyone; the file map is for developers.

> This is an early skeleton. The module's screens are being built in the
> current sprint; this page will grow with them.

## What it does

Shows the list of patient records with their appointment details, lets you
search, sort, and filter the list (Turkish-aware), and lets you add a new
record, edit an existing one, or delete one. Changes stay on your device —
see "Data & Storage".

## What the data looks like

Each record holds the patient's name, birth date, appointment date,
department, status, priority, blood type, a score, bilingual notes and
diagnosis, a few yes/no flags, and free-form tags.

## How it is built

The module follows the standard layer recipe described in "Architecture":
data fetching and local storage at the bottom, the data model and its
transformations above that, then the coordinating logic, and the screens on
top.
