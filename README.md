# css

Css universal design boilerplate. Works without interference to HTML.

- Universal Design (variants included) based on [digital government jp design system](https://github.com/digital-go-jp/design-system-example-components-html), WCAG 2.2, ARIA APG.
- No div wrappers required by CSS.
- Uses semantic elements (`article`, `section`, `figure`, etc.)
- Render correctly without JS.

## Version

| Version | Status    | Date       | Description |
|---------|-----------|------------|-------------|
| 0.1.0   | Scheduled | 2026-08-31 | 1st release |

## Size Scale (data-size attribute)

The `size` attribute (`data-size="sm"` etc.) controls the physical density of a component. `height`/`padding` are pure UI sizing (touch-target scale), tracked independently in `--size-*` custom properties — they no longer encode `font-size` or `line-height`. Typography for these components (`font-size`, `line-height`, `letter-spacing`) instead references the `typography-*` scale (see below); most components use a single fixed typography step regardless of `data-size`, since font-size/line-height don't vary by tier except where noted.

| `data-size` | box height | padding (block) | padding (inline) |
|-------------|------------|-----------------|------------------|
| `xs`        | 1.75rem | 0.125rem | 0.5rem |
| `sm`        | 2.5rem  | —        | —      |
| `md`        | 3rem    | —        | —      |
| `lg`        | 3.5rem  | —        | —      |

`—` = Components unique as below

### button

| `data-size` | min-height | padding (block) | padding (inline) |
|-------------|------------|-----------------|------------------|
| `xs`        | 1.75rem    | 0.125rem        | 0.5rem           |
| `sm`        | 2.5rem     | 0.125rem        | 0.75rem          |
| `md`        | 3rem       | 0.5rem          | 1rem             |
| `lg`        | 3.5rem     | 0.75rem         | 1rem             |

### input

| `data-size` | height  | padding (block) | padding (inline) | width  |
|-------------|---------|-----------------|------------------|--------|
| `sm`        | 2.5rem  | 0.75rem         | 1rem             | 12rem  |
| `md`        | 3rem    | 0.75rem         | 1rem             | 12rem  |
| `lg`        | 3.5rem  | 0.75rem         | 1rem             | 12rem  |

### input-number

| `data-size` | height  | button width | input        | full-length width |
|-------------|---------|--------------|--------------|------------|
| `sm`        | 2.5rem  | 2rem         | flex: 1      | 12rem      |
| `md`        | 3rem    | 2rem         | flex: 1      | 12rem      |
| `lg`        | 3.5rem  | 2rem         | flex: 1      | 12rem      |

### select

| `data-size` | height  | padding-inline-start | padding-inline-end |
|-------------|---------|----------------------|--------------------|
| `sm`        | 2.5rem  | 1rem                 | 2.5rem             |
| `md`        | 3rem    | 1rem                 | 2.5rem             |
| `lg`        | 3.5rem  | 1rem                 | 2.5rem             |

### textarea

| `data-size` | padding (block) | padding (inline) | font-size | line-height | width  |
|-------------|-----------------|------------------|-----------|-------------|--------|
| `sm`        | 0.75rem         | 1rem             | 1rem      | 1.5 (hardcoded) | 100%   |
| `md`        | 0.75rem         | 1rem             | 1rem      | 1.6 (hardcoded) | 100%   |
| `lg`        | 0.75rem         | 1rem             | 1rem      | `text-normal-2` (1.7) | 100%   |

### checkbox

Label `font-size`/`line-height` reference `text-flush-2`; `letter-spacing: 0` remains hardcoded (does not match `text-flush-2`'s `0.02em`, and no matching step exists).

| `data-size` | 行高   | input-size | hover-size | gap     | border-width | padding-block |
|-------------|--------|------------|------------|---------|--------------|---------------|------------|
| `sm`        | 40px   | 1.25rem    | 1.5rem     | 0.25rem | 0.125rem     | 0.625rem      | `text-flush-2` |
| `md`        | 48px   | 1.625rem   | 2rem       | 0.5rem  | 0.125rem     | 0.6875rem     | `text-flush-2` |
| `lg`        | 56px   | 2.25rem    | 2.75rem    | 0.5rem  | 0.1875rem    | 0.625rem      | `text-flush-2` |

#### radio

Label `font-size`/`line-height` reference `text-flush-2`; `letter-spacing: 0` remains hardcoded (does not match `text-flush-2`'s `0.02em`, and no matching step exists) — `font-family`/`font-weight`/`letter-spacing` are now explicit rather than relying on inheritance, matching checkbox.css.

| `data-size` | 行高   | outer-size | inner-size | hover-size | gap     | border-width | padding-block |
|-------------|--------|------------|------------|------------|---------|--------------|---------------|
| `sm`        | 40px   | 1.25rem    | 0.625rem   | 1.5rem     | 0.25rem | 0.125rem     | 0.6rem        |
| `md`        | 48px   | 1.625rem   | 0.75rem    | 2rem       | 0.5rem  | 0.125rem     | 0.6875rem     |
| `lg`        | 56px   | 2.25rem    | 1rem       | 2.75rem    | 0.75rem | 0.1875rem    | 0.625rem      |

### heading

| `data-size` | heading font-size | shoulder step |
|-------------|--------------------|----------------|
