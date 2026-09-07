---
name: portfolio-book-viewer
description: Build the physical open-book viewer for Cao Yuchen's portfolio project pages. Use whenever implementing or modifying the main project flipbook.
---

# Portfolio Book Viewer Skill

## Goal

Turn sequential Figma half-page assets into a believable open physical book.

Use `page-flip` / StPageFlip for actual page turning. Do not replace with a carousel or a simple `rotateY(180deg)` card flip.

## Source Pages

Pages arrive as ordered image assets:

```text
PAGE_01, PAGE_02, PAGE_03...
```

Pairs reconstruct the original portfolio spread:

```text
01 + 02
03 + 04
...
```

Never reorder.

## Open State

The viewer opens immediately as an already-open book.
There is no standalone cover screen.

Desktop/iPad:
```text
[LEFT PAGE][RIGHT PAGE]
```

Phone landscape:
single-page mode is allowed.

## Physical Structure

The viewer must render four visual layers:

1. **cover-underlay**
2. **page-stack**
3. **active pages**
4. **spine / dynamic flip shadow**

### Cover Underlay — Mandatory

Even though cover art is not displayed, the open book must visibly sit on a cover/back-cover layer.

Create a pseudo cover behind both page blocks:

- extend 5–10px beyond left/right outer edges
- extend 6–12px below the page block
- 2–4px subtle radius
- slightly darker / warmer than page edge
- subtle shadow below
- never cover actual portfolio content

This layer must remain visible when the book is idle and during flipping.

### Page Stack

Simulate 3–8px paper thickness at both outer edges and bottom.

Use pseudo-elements / multi-shadow, not dozens of DOM leaves.

### Spine

Use a narrow central gutter:
- subtle inward shadow
- no large blank gap
- never obscure meaningful content
- slight highlight adjacent to the darkest crease

## Page Images

Do not stretch typography.

Each source image goes into a common logical page box:

```css
object-fit: contain;
```

Use an edge-matched page background behind it.

Minor Figma width differences are expected.

## Flip

Preferred library:
`page-flip`

Required:
- drag page corner
- click right to next
- click left to previous
- touch swipe
- keyboard arrows

Target flip duration:
550–800ms.

Flip shadow must change dynamically with the turning page.

## Book Scale

Desktop:
roughly 74–82vw, with max-width.

Book must preserve the source spread's overall visual proportion.

## Page Counter

Low-weight text:
`01–02 / 18`

No large progress bar.

## Reduced Motion

When reduced motion is requested:
- disable 3D bend
- use short fade/slide page change
- keep physical cover-underlay + page-stack visual

## Failure Conditions

Reject implementation if:
- it looks like two flat images
- cover-underlay is missing
- there is no page thickness
- there is a big empty gutter
- pages are cropped
- text is stretched
- flip is only a 180° card rotation
