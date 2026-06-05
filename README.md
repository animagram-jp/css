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
| 0.2.0   | Scheduled | 2026-05-31 | rename to css repository |

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
- Edit input-text.css to remove wrapper span.
- Delete language-selector and edit menu-list-box to list-box.
- Edit form-control-label.css and textarea.css.
- Change button.css display:flex to inline-flex.

## `dads-size` — Size Scale

The `size` attribute (`dads-size="sm"` etc.) controls the physical density of a component. The intended shared values per tier are:

| `dads-size` | height | padding (block) | padding (inline) | font-size | line-height |
|-------------|--------|-----------------|------------------|-----------|-------------|
| `xs`        | 1.75rem | 0.125rem        | 0.5rem           | 0.875rem  | 1           |
| `sm`        | 2.5rem  | —               | —                | 1rem      | —           |
| `md`        | 3rem    | —               | —                | 1rem      | —           |
| `lg`        | 3.5rem  | —               | —                | 1rem      | —           |

`—` = コンポーネント固有のため共通値なし（下表参照）

### 現状の差異

button、input-text、select の height は一致しているが、padding・font-size・line-height は各コンポーネントで異なる。

#### button

| `dads-size` | min-height | padding (block) | padding (inline) | font-size | line-height |
|-------------|------------|-----------------|------------------|-----------|-------------|
| `xs`        | 1.75rem    | 0.125rem        | 0.5rem           | 0.875rem  | 1           |
| `sm`        | 2.5rem     | 0.125rem        | 0.75rem          | 1rem      | 1           |
| `md`        | 3rem       | 0.5rem          | 1rem             | 1rem      | 1           |
| `lg`        | 3.5rem     | 0.75rem         | 1rem             | 1rem      | 1           |

#### input-text

padding・font-size・line-height は全サイズ共通。`dads-size` は height のみ制御。

| `dads-size` | height  | padding (block) | padding (inline) | font-size | line-height |
|-------------|---------|-----------------|------------------|-----------|-------------|
| `sm`        | 2.5rem  | 0.75rem         | 1rem             | 1rem      | 1.7         |
| `md`        | 3rem    | 0.75rem         | 1rem             | 1rem      | 1.7         |
| `lg`        | 3.5rem  | 0.75rem         | 1rem             | 1rem      | 1.7         |

#### input-number

padding・font-size・line-height は全サイズ共通。`dads-size` は height のみ制御。

| `dads-size` | height  | padding (block) | padding (inline) | font-size | line-height |
|-------------|---------|-----------------|------------------|-----------|-------------|
| `sm`        | 2.5rem  | 0.75rem         | 1rem             | 1rem      | 1.7         |
| `md`        | 3rem    | 0.75rem         | 1rem             | 1rem      | 1.7         |
| `lg`        | 3.5rem  | 0.75rem         | 1rem             | 1rem      | 1.7         |

#### select

padding・font-size・line-height は全サイズ共通。`dads-size` は height のみ制御。

| `dads-size` | height  | padding-inline-start | padding-inline-end | line-height |
|-------------|---------|----------------------|--------------------|-------------|
| `sm`        | 2.5rem  | 1rem                 | 2.5rem             | 1           |
| `md`        | 3rem    | 1rem                 | 2.5rem             | 1           |
| `lg`        | 3.5rem  | 1rem                 | 2.5rem             | 1           |

#### textarea

`dads-size` バリアント未定義。全サイズ共通値のみ（padding: 1rem 四方、font-size: 1rem、line-height: 1.7）。

#### checkbox

`dads-size` はチェックボックス本体サイズ・gap・label font-size を制御。height/padding は概念が異なる。

| `dads-size` | checkbox-size | gap     | border-width  | label font-size |
|-------------|---------------|---------|---------------|-----------------|
| `sm`        | 1.5rem        | 0.25rem | 0.125rem      | 1rem            |
| `md`        | 2rem          | 0.5rem  | 0.125rem      | 1rem            |
| `lg`        | 2.75rem       | 0.5rem  | 0.1875rem     | 1rem            |

#### radio

checkbox と同様の概念。

| `dads-size` | outer-size | inner-size | gap     | border-width  | label font-size |
|-------------|------------|------------|---------|---------------|-----------------|
| `sm`        | 1.25rem    | 0.625rem   | 0.25rem | 0.125rem      | 1rem            |
| `md`        | 1.625rem   | 0.75rem    | 0.5rem  | 0.125rem      | 1rem            |
| `lg`        | 2.25rem    | 1rem       | 0.75rem | 0.1875rem     | 1rem            |

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