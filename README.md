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
| 0.2.0   | Scheduled | 2026-06-06 | rename to css repository |

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
- Add input-number.
- Change button, input, textarea to display:inline-flex.
- Normalize dads-size (renamed from dada-size) betweeen button, input and textarea.
- Edit heading to remove wrapper hgroup dependency and rename to class dads-h.

## `dads-size` — Size Scale

The `size` attribute (`dads-size="sm"` etc.) controls the physical density of a component. The intended shared values per tier are:

| `dads-size` | height | padding (block) | padding (inline) | font-size | line-height |
|-------------|--------|-----------------|------------------|-----------|-------------|
| `xs`        | 1.75rem | 0.125rem        | 0.5rem           | 0.875rem  | 1           |
| `sm`        | 2.5rem  | —               | —                | 1rem      | —           |
| `md`        | 3rem    | —               | —                | 1rem      | —           |
| `lg`        | 3.5rem  | —               | —                | 1rem      | —           |

`—` = Components unique as below

### button

| `dads-size` | min-height | padding (block) | padding (inline) | font-size | line-height |
|-------------|------------|-----------------|------------------|-----------|-------------|
| `xs`        | 1.75rem    | 0.125rem        | 0.5rem           | 0.875rem  | 1           |
| `sm`        | 2.5rem     | 0.125rem        | 0.75rem          | 1rem      | 1           |
| `md`        | 3rem       | 0.5rem          | 1rem             | 1rem      | 1           |
| `lg`        | 3.5rem     | 0.75rem         | 1rem             | 1rem      | 1           |

### input-text

| `dads-size` | height  | padding (block) | padding (inline) | font-size | line-height | width  |
|-------------|---------|-----------------|------------------|-----------|-------------|--------|
| `sm`        | 2.5rem  | 0.75rem         | 1rem             | 1rem      | 1.7         | 12rem  |
| `md`        | 3rem    | 0.75rem         | 1rem             | 1rem      | 1.7         | 12rem  |
| `lg`        | 3.5rem  | 0.75rem         | 1rem             | 1rem      | 1.7         | 12rem  |

### input-number

| `dads-size` | height  | button width | input        | font-size | line-height | 全体 width |
|-------------|---------|--------------|--------------|-----------|-------------|------------|
| `sm`        | 2.5rem  | 2rem         | flex: 1      | 1rem      | 1.7         | 12rem      |
| `md`        | 3rem    | 2rem         | flex: 1      | 1rem      | 1.7         | 12rem      |
| `lg`        | 3.5rem  | 2rem         | flex: 1      | 1rem      | 1.7         | 12rem      |

### select

| `dads-size` | height  | padding-inline-start | padding-inline-end | line-height |
|-------------|---------|----------------------|--------------------|-------------|
| `sm`        | 2.5rem  | 1rem                 | 2.5rem             | 1           |
| `md`        | 3rem    | 1rem                 | 2.5rem             | 1           |
| `lg`        | 3.5rem  | 1rem                 | 2.5rem             | 1           |

### textarea

| `dads-size` | padding (block) | padding (inline) | font-size | line-height | width  |
|-------------|-----------------|------------------|-----------|-------------|--------|
| `sm`        | 0.75rem         | 1rem             | 1rem      | 1.5         | 100%   |
| `md`        | 0.75rem         | 1rem             | 1rem      | 1.6         | 100%   |
| `lg`        | 0.75rem         | 1rem             | 1rem      | 1.7         | 100%   |

### checkbox

| `dads-size` | 行高   | input-size | hover-size | gap     | border-width | padding-block | label font-size | line-height |
|-------------|--------|------------|------------|---------|--------------|---------------|-----------------|-------------|
| `sm`        | 40px   | 1.25rem    | 1.5rem     | 0.25rem | 0.125rem     | 0.625rem      | 1rem            | 1           |
| `md`        | 48px   | 1.625rem   | 2rem       | 0.5rem  | 0.125rem     | 0.6875rem     | 1rem            | 1           |
| `lg`        | 56px   | 2.25rem    | 2.75rem    | 0.5rem  | 0.1875rem    | 0.625rem      | 1rem            | 1           |

#### radio

| `dads-size` | 行高   | outer-size | inner-size | hover-size | gap     | border-width | padding-block | label font-size | line-height |
|-------------|--------|------------|------------|------------|---------|--------------|---------------|-----------------|-------------|
| `sm`        | 40px   | 1.25rem    | 0.625rem   | 1.5rem     | 0.25rem | 0.125rem     | 0.6rem        | 1rem            | 1           |
| `md`        | 48px   | 1.625rem   | 0.75rem    | 2rem       | 0.5rem  | 0.125rem     | 0.6875rem     | 1rem            | 1           |
| `lg`        | 56px   | 2.25rem    | 1rem       | 2.75rem    | 0.75rem | 0.1875rem    | 0.625rem      | 1rem            | 1           |

## License

```
SPDX-License-Identifier: Apache-2.0
Copyright (c) 2026 Andyou <andyou@animagram.jp>
```

Also see [Notice](./NOTICE).