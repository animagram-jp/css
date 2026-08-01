# css

Css universal design boilerplate. Works without interference to HTML.

- Universal Design (variants included) based on [digital government jp design system](https://github.com/digital-go-jp/design-system-example-components-html), WCAG 2.2, ARIA APG.
- Requires to html only semantic and also structural tag's structure and a few anonymous elements.
- Render correctly without JS.

## Version

| Version | Status    | Date       | Description |
|---------|-----------|------------|-------------|
| 0.1.0   | Scheduled | 2026-08-31 | 1st release |

## Size Scale (data-size attribute)

Defined once in `css/config.css` (`:root`) as `--{size}-box-height` / `--{size}-font-size` / `--{size}-letter-spacing` / `--{size}-line-height` (plus `--xs-padding-block` / `--xs-padding-inline`). Every component below reuses these same column names — a component either consumes a value as-is or overrides it locally, noted per row.

| `data-size` | box-height | font-size | letter-spacing | line-height | padding-block | padding-inline |
|-------------|------------|-----------|-----------------|-------------|----------------|-----------------|
| `xs`        | 1.75rem | 0.85rem | 0.02rem | 1.5rem | 0.125rem | 0.5rem |
| `sm`        | 2.5rem  | 0.85rem | 0.02em  | 1.5rem | —        | —      |
| `md`        | 3rem    | 1rem    | 0       | 1.5rem | —        | —      |
| `lg`        | 3.5rem  | 1.15rem | 0       | 1.725rem | —      | —      |
| `xl`        | —       | 1.5rem  | 0       | 2.25rem | —       | —      |
| `2xl`       | —       | 2rem    | 0       | 3rem   | —        | —      |

`—` = not defined at that scale (`xl`/`2xl` have no box-height since no component uses them as a control size; `sm`/`md`/`lg`/`xl`/`2xl` have no shared padding since padding is a per-component override — see below).

### button

| `data-size` | box-height | padding-block | padding-inline |
|-------------|------------|-----------------|------------------|
| `xs`        | 1.75rem    | 0.125rem        | 0.5rem           |
| `sm`        | 2.5rem     | 0.125rem        | 0.75rem          |
| `md`        | 3rem       | 0.5rem          | 1rem             |
| `lg`        | 3.5rem     | 0.75rem         | 1rem             |

`box-height` is applied as `min-height` (not `height`), so content can grow the button beyond the scale value.

### input

| `data-size` | box-height | padding-block | padding-inline | width  |
|-------------|---------|-----------------|------------------|--------|
| `sm`        | 2.5rem  | 0.75rem         | 1rem             | 12rem  |
| `md`        | 3rem    | 0.75rem         | 1rem             | 12rem  |
| `lg`        | 3.5rem  | 0.75rem         | 1rem             | 12rem  |

### input-number

| `data-size` | box-height | button width | input        | full-length width |
|-------------|---------|--------------|--------------|------------|
| `sm`        | 2.5rem  | 1.5rem       | flex: 1      | 12rem      |
| `md`        | 3rem    | 2rem         | flex: 1      | 12rem      |
| `lg`        | 3.5rem  | 2.5rem       | flex: 1      | 12rem      |

### select

| `data-size` | box-height | padding-inline-start | padding-inline-end |
|-------------|---------|----------------------|--------------------|
| `sm`        | 2.5rem  | 1rem                 | 2.5rem             |
| `md`        | 3rem    | 1rem                 | 2.5rem             |
| `lg`        | 3.5rem  | 1rem                 | 2.5rem             |

### textarea

| `data-size` | padding-block | padding-inline | font-size | line-height | width  |
|-------------|-----------------|------------------|-----------|-------------|--------|
| `sm`        | 0.75rem         | 1rem             | 1rem      | 1.5 (hardcoded) | 100%   |
| `md`        | 0.75rem         | 1rem             | 1rem      | 1.6 (hardcoded) | 100%   |
| `lg`        | 0.75rem         | 1rem             | var(--md-font-size) | var(--md-line-height) | 100%   |

### checkbox

Label `font-size` is fixed to `--md-font-size` (`--label-font-size`) regardless of `data-size`; `line-height`/`letter-spacing: 0` remain hardcoded to `--md-line-height`/`0`.

| `data-size` | box-height | input-size | hover-size | gap     | border-width | padding-block |
|-------------|------------|------------|------------|---------|--------------|---------------|
| `sm`        | 2.5rem     | 1.25rem    | 1.5rem     | 0.25rem | 0.125rem     | 0.625rem      |
| `md`        | 3rem       | 1.625rem   | 2rem       | 0.5rem  | 0.125rem     | 0.6875rem     |
| `lg`        | 3.5rem     | 2.25rem    | 2.75rem    | 0.5rem  | 0.1875rem    | 0.625rem      |

`box-height` here is the overall row height the size scale reserves for a checkbox + label (not itself consumed via `var(--{size}-box-height)`, but kept aligned to it); `hover-size` is the invisible touch-target square centered behind `input-size`.

#### radio

Label `font-size`/`line-height`/`letter-spacing` follow the same rule as checkbox.css above; `font-family`/`font-weight`/`letter-spacing` are explicit rather than relying on inheritance, matching checkbox.css.

| `data-size` | box-height | outer-size | inner-size | hover-size | gap     | border-width | padding-block |
|-------------|------------|------------|------------|------------|---------|--------------|---------------|
| `sm`        | 2.5rem     | 1.25rem    | 0.625rem   | 1.5rem     | 0.25rem | 0.125rem     | 0.625rem      |
| `md`        | 3rem       | 1.625rem   | 0.75rem    | 2rem       | 0.5rem  | 0.125rem     | 0.6875rem     |
| `lg`        | 3.5rem     | 2.25rem    | 1rem       | 2.75rem    | 0.75rem | 0.1875rem    | 0.625rem      |

### heading

Only `data-size="md"` is currently implemented; `display-1`, `display-2`, `heading-1`〜`heading-9` are accepted by the demo markup but not yet styled (they render at the browser's default heading size until added to `css/heading.css`).

| `data-size` | font-size | line-height | letter-spacing |
|-------------|-----------|-------------|-----------------|
| `md`        | 1rem      | 1.5rem      | 0               |
