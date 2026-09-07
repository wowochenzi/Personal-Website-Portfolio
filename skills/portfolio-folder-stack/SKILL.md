---
name: portfolio-folder-stack
description: Implement the Other Works stacked folder interaction, active-folder expansion, persistent category labels, and long-strip auto-scroll.
---

# Portfolio Folder Stack Skill

## Source of Truth

Use:
- `09_OTHER_REFERENCE_DEFAULT`
- `09_OTHER_REFERENCE_ACTIVE_A`
- `09_OTHER_REFERENCE_ACTIVE_B`
- `09_OTHER_REFERENCE_ACTIVE_C`
- `09_OTHER_REFERENCE_ACTIVE_D`

Do not invent a generic accordion visual that ignores the references.

## Fixed Folder Identity

A = 品牌设计  
B = 商业创新设计  
C = AIGC插画  
D = 空间构成

The category labels appear in Default Reference and are omitted from Active references only for convenience.

**Labels must remain visible and attached to their folder in every state.**

## Active Transition

Click folder N:

- folders above / including the active folder move upward according to the corresponding Active Reference
- folders below the active folder move downward
- reveal a horizontal media window inside the active folder
- page becomes vertically scrollable
- target visual height follows 1568×1510 Active Reference

Do not scale the expanded 1510px reference back into 900px.

## Long Strip

Atomic assets:

- `09_OTHER_STRIP_A`
- `09_OTHER_STRIP_B`
- `09_OTHER_STRIP_C`
- `09_OTHER_STRIP_D`

Never reconstruct them from child frames.

Reference viewport:
about `1310 × 305`.

Display intent:
roughly two artworks visible at once.

## Auto Scroll

- continuous leftward motion
- constant speed 32–40 px/s
- compute duration from rendered strip width
- duplicate same strip element to make loop seamless
- pause on hover
- pause on pointer drag
- resume about 800ms after release
- reduced motion = manual horizontal scrolling only

## Project Copy

Folder A:
`东一品牌焕新策略全案`
Show title + description below strip.

Folder B:
`香印香氛疗愈丝巾`
Show title + description below strip.

Folders C/D:
no forced project description in V1.

## Switching

Clicking another folder while one is active should transition directly to the new reference state.
No need for a full close-then-open sequence.

Clicking the active folder again may return to Default.
