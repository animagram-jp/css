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

## `data-size` — Size Scale

The `size` attribute (`data-size="sm"` etc.) controls the physical density of a component. `height`/`padding` are pure UI sizing (touch-target scale), tracked independently in `--size-*` custom properties — they no longer encode `font-size` or `line-height`. Typography for these components (`font-size`, `line-height`, `letter-spacing`) instead references the `typography-*` scale (see below); most components use a single fixed typography step regardless of `data-size`, since font-size/line-height don't vary by tier except where noted.

| `data-size` | height (`--size-*-height`) | padding (block) | padding (inline) |
|-------------|---------------------------------|------------------|-------------------|
| `xs`        | 1.75rem | 0.125rem | 0.5rem |
| `sm`        | 2.5rem  | —        | —      |
| `md`        | 3rem    | —        | —      |
| `lg`        | 3.5rem  | —        | —      |

`—` = Components unique as below

### button

| `data-size` | min-height | padding (block) | padding (inline) | typography |
|-------------|------------|-----------------|------------------|------------|
| `xs`        | 1.75rem    | 0.125rem        | 0.5rem           | `text-flush-3` |
| `sm`        | 2.5rem     | 0.125rem        | 0.75rem          | `text-flush-2` |
| `md`        | 3rem       | 0.5rem          | 1rem             | `text-flush-2` |
| `lg`        | 3.5rem     | 0.75rem         | 1rem             | `text-flush-2` |

### input

| `data-size` | height  | padding (block) | padding (inline) | typography | width  |
|-------------|---------|-----------------|------------------|------------|--------|
| `sm`        | 2.5rem  | 0.75rem         | 1rem             | `text-normal-2` | 12rem  |
| `md`        | 3rem    | 0.75rem         | 1rem             | `text-normal-2` | 12rem  |
| `lg`        | 3.5rem  | 0.75rem         | 1rem             | `text-normal-2` | 12rem  |

### input-number

| `data-size` | height  | button width | input        | typography | full-length width |
|-------------|---------|--------------|--------------|------------|------------|
| `sm`        | 2.5rem  | 2rem         | flex: 1      | `text-normal-2` | 12rem      |
| `md`        | 3rem    | 2rem         | flex: 1      | `text-normal-2` | 12rem      |
| `lg`        | 3.5rem  | 2rem         | flex: 1      | `text-normal-2` | 12rem      |

### select

| `data-size` | height  | padding-inline-start | padding-inline-end | typography |
|-------------|---------|----------------------|--------------------|------------|
| `sm`        | 2.5rem  | 1rem                 | 2.5rem             | `text-flush-2` (font-size inherited) |
| `md`        | 3rem    | 1rem                 | 2.5rem             | `text-flush-2` (font-size inherited) |
| `lg`        | 3.5rem  | 1rem                 | 2.5rem             | `text-flush-2` (font-size inherited) |

### textarea

`sm`/`md` line-heights (1.5/1.6) predate the typography token scale and have no matching `typography-text-*` step yet; they remain hardcoded until a matching step is defined. `lg` matches `text-normal-2` and has been migrated.

| `data-size` | padding (block) | padding (inline) | font-size | line-height | width  |
|-------------|-----------------|------------------|-----------|-------------|--------|
| `sm`        | 0.75rem         | 1rem             | 1rem      | 1.5 (hardcoded) | 100%   |
| `md`        | 0.75rem         | 1rem             | 1rem      | 1.6 (hardcoded) | 100%   |
| `lg`        | 0.75rem         | 1rem             | 1rem      | `text-normal-2` (1.7) | 100%   |

### checkbox

Label `font-size`/`line-height` reference `text-flush-2`; `letter-spacing: 0` remains hardcoded (does not match `text-flush-2`'s `0.02em`, and no matching step exists).

| `data-size` | 行高   | input-size | hover-size | gap     | border-width | padding-block | typography |
|-------------|--------|------------|------------|---------|--------------|---------------|------------|
| `sm`        | 40px   | 1.25rem    | 1.5rem     | 0.25rem | 0.125rem     | 0.625rem      | `text-flush-2` |
| `md`        | 48px   | 1.625rem   | 2rem       | 0.5rem  | 0.125rem     | 0.6875rem     | `text-flush-2` |
| `lg`        | 56px   | 2.25rem    | 2.75rem    | 0.5rem  | 0.1875rem    | 0.625rem      | `text-flush-2` |

#### radio

Label `font-size`/`line-height` reference `text-flush-2`; `letter-spacing: 0` remains hardcoded (does not match `text-flush-2`'s `0.02em`, and no matching step exists) — `font-family`/`font-weight`/`letter-spacing` are now explicit rather than relying on inheritance, matching checkbox.css.

| `data-size` | 行高   | outer-size | inner-size | hover-size | gap     | border-width | padding-block | typography |
|-------------|--------|------------|------------|------------|---------|--------------|---------------|------------|
| `sm`        | 40px   | 1.25rem    | 0.625rem   | 1.5rem     | 0.25rem | 0.125rem     | 0.6rem        | `text-flush-2` |
| `md`        | 48px   | 1.625rem   | 0.75rem    | 2rem       | 0.5rem  | 0.125rem     | 0.6875rem     | `text-flush-2` |
| `lg`        | 56px   | 2.25rem    | 1rem       | 2.75rem    | 0.75rem | 0.1875rem    | 0.625rem      | `text-flush-2` |

### heading

`heading.css` (`.h`, used via `data-size="…"` on the element or a wrapping `hgroup`) does not use the `xs`/`sm`/`md`/`lg` tiers above — it exposes the full `typography-display-*`/`heading-*`/`text-normal-2` step range directly as `data-size` values, since headings need finer granularity than other components. The shoulder text (`.h-shoulder` inside an `hgroup`) uses a different, smaller step for each size. Values were physical px numbers (`data-size="45"`) before the typography token rework; they are now the token step names themselves.

| `data-size` | heading font-size | shoulder step |
|-------------|--------------------|----------------|
| `display-1`     | 64px (`display-1`) | `heading-4` (28px) |
| `display-2`     | 57px (`display-2`) | `heading-6` (24px) |
| `heading-1`     | 45px | `heading-7` (22px) |
| `heading-2`     | 36px | `heading-8` (20px) |
| `heading-3`     | 32px | `heading-9` (18px) |
| `heading-4`     | 28px | `text-normal-2` (16px) |
| `heading-6`     | 24px | `text-normal-2` (16px) |
| `heading-8`     | 20px | `text-normal-2` (16px) |
| `heading-9`     | 18px | `text-normal-2` (16px) |
| `text-normal-2` | 16px | `text-normal-2` (16px) |

## `typography-*` — Typography Scale

Typography utility classes in `config.css` follow a role-based naming: `typography-{role}-{step}-{weight}` (`text` role additionally carries a density segment: `typography-text-{density}-{step}-{weight}`). The scale is defined as DTCG-format composite tokens in [`css/typography.tokens.json`](./css/typography.tokens.json); the CSS classes below are its flattened output. `step` numbers order each role from largest to smallest and carry no meaning beyond ordering.

| role | density | steps | font-size range | line-height | letter-spacing | notes |
|------|---------|-------|------------------|-------------|-----------------|-------|
| `display`  | —        | 1–3 | 64px – 48px | 1.4 (fixed)        | 0            | Largest, most prominent text; formerly `dsp` |
| `heading`  | —        | 1–9 | 45px – 18px | 1.4 – 1.6 (by step) | 0 – 0.02em   | Section/page headings; formerly `std` (heading usage) |
| `text`     | `normal` | 1–3 | 17px – 16px | 1.7 – 1.75          | 0.02em       | Body text, labels; formerly `std` (text usage) |
| `text`     | `tight`  | 1–6 | 17px – 14px | 1.2 – 1.3           | 0            | Tighter line-height variant of `text`; formerly `dns`/`dense` |
| `text`     | `flush`  | 1–3 | 17px – 14px | 1 (fixed)           | 0.02em       | Line-height flush with the font's natural height, for single-line UI text; formerly `oln`/`oneline` |
| `monospace`| —        | 1–3 | 17px – 14px | 1.5 (fixed)         | 0            | `font-family: var(--font-family-mono)`; formerly `mono` |

Each `{role}-{step}` (and `{role}-{density}-{step}`) combination is available in both `-bold` and `-normal` weights.
