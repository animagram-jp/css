# css

Css universal design boilerplate. Works without interference to HTML.

- CSS drives appearance; HTML structure is not dictated by CSS.
- Single-element components: one class on a semantic or just select block/inline element, no wrappers.
- Multi-element components: composed from semantic tags only (`table > th`, `details > summary`, etc.), no div wrappers required by CSS.
- div-based layouts must be rewritten to use semantic elements (`article`, `section`, `figure`, etc.)
- JS that holds state belongs to WAM (Web Application Module) layer; CSS-only components must render correctly without JS.

## Version

| Version | Status    | Date       | Description |
|---------|-----------|------------|-------------|
| 0.1.0   | Released  | 2026-03-09 | create following DADS(html) |
| 0.1.1   | Released  | 2026-04-28 | update following DADS(html) |
| 0.1.2   | Scheduled | 2026-05-31 | rename to css repository |

## Reference

- [DADS(html)](https://github.com/digital-go-jp/design-system-example-components-html)

## Changes from Dads(html)

- CSS/JS components only, no build tooling.
- Custom font-family applied in global.css.
- Single html and replace images with svg placeholders.
- Unwrap single element css components.
- Delete div wrapper in table.css.
- Delete table/scroll-shadow.js
- Edit radio.css to remove wrapper divs.

## Popup Menu — Shared JS Contract

A single JS module handles open/close, outside-click dismissal, focusout dismissal, and keyboard navigation for all dropdown/popup-menu components. CSS components that expose a popup menu must mark their elements with the following `data-*` attributes so the shared JS can find them without knowing the component name.

| Attribute | Required | Element | Role |
|---|---|---|---|
| `data-js-opener` | yes | `<button>` | Toggles the popup; holds `aria-expanded` |
| `data-js-popup` | yes | popup container | Shown/hidden via `hidden` attribute |
| `data-js-menu` | yes | `<ul>` inside popup | Receives `keydown` for arrow-key navigation |
| `data-js-menu-item` | yes | focusable `<a>` / `<button>` inside menu | Navigation target; click closes popup and returns focus to opener |

### Keyboard behavior

| Context | Key | Action |
|---|---|---|
| opener focused, menu open | `ArrowDown` | Focus first item |
| opener focused, menu open | `ArrowUp` | Focus last item |
| menu focused | `ArrowDown` | Next item (wraps to first) |
| menu focused | `ArrowUp` | Previous item (wraps to last) |
| menu focused | `Home` | First item |
| menu focused | `End` | Last item |
| anywhere | `Escape` | Close menu, return focus to opener |

### CSS requirements

- The popup container must default to `hidden` in HTML (`<div data-js-popup hidden>`). The shared JS removes/sets the attribute; CSS must not control visibility independently.
- No CSS rule may show or hide `[data-js-popup]` based on a class toggle — visibility is owned entirely by the `hidden` attribute.
- `aria-expanded` on the opener is set by JS; CSS may style `[aria-expanded="true"]` for visual open-state feedback (e.g. rotating a chevron icon).

## License

```
SPDX-License-Identifier: Apache-2.0
Copyright (c) 2026 Andyou <andyou@animagram.jp>
```

Also see [Notice](./NOTICE).