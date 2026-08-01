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

Defined once in `css/config.css` (`:root`) as `--{size}-box-height` / `--{size}-font-size` / `--{size}-letter-spacing` / `--{size}-line-height`. Every component below reuses these same column names — a component either consumes a value as-is or overrides it locally, noted per row.

| `data-size` | box-height | font-size | letter-spacing | line-height |
|-------------|------------|-----------|-----------------|-------------|
| `xs`        | 1.75rem | 0.85rem | 0.02rem | 1.5rem |
| `sm`        | 2.5rem  | 0.85rem | 0.02em  | 1.5rem |
| `md`        | 3rem    | 1rem    | 0       | 1.5rem |
| `lg`        | 3.5rem  | 1.15rem | 0       | 1.725rem |
| `xl`        | 4rem    | 1.5rem  | 0       | 2.25rem |
| `2xl`       | 4.75rem | 2rem    | 0       | 3rem   |

### Cross-component convention: padding & width

- **`padding-block`** (vertical padding) is derived the same way everywhere a `box-height` applies: `calc((var(--{size}-box-height) - var(--{size}-line-height)) / 2)`. This centers the text's line box inside the scale's box-height regardless of component.
- **`padding-inline`** (horizontal padding) is a per-component, hardcoded rem value at each size — never derived from a shared variable, since it is a per-component design choice, not a scale primitive. Where a component has an internal visual boundary of its own (e.g. an icon, a stepper button, a dropdown arrow), that spacing is likewise a component-local decision and not unified across components.
- **`width`** is left unset (auto / content-driven) on every component below. None hardcode a fixed width or `100%`; give an element a width via the surrounding markup (a wrapping `style`/class) when one is needed.

### button

| `data-size` | box-height | padding-block | padding-inline |
|-------------|------------|-----------------|------------------|
| `xs`        | 1.75rem    | `calc((var(--xs-box-height) - var(--sm-line-height)) / 2)` | 0.5rem |
| `sm`        | 2.5rem     | `calc((var(--sm-box-height) - var(--sm-line-height)) / 2)` | 0.75rem |
| `md`        | 3rem       | `calc((var(--md-box-height) - var(--md-line-height)) / 2)` | 1rem |
| `lg`        | 3.5rem     | `calc((var(--lg-box-height) - var(--lg-line-height)) / 2)` | 1rem |

`box-height` is applied as `min-height` (not `height`), so content can grow the button beyond the scale value. `xs` renders at `--sm-font-size`/`--sm-line-height` (there is no dedicated xs type scale for button text).

### input

| `data-size` | box-height | padding-block | padding-inline |
|-------------|---------|-----------------|------------------|
| `sm`        | 2.5rem  | `calc((var(--sm-box-height) - var(--sm-line-height)) / 2)` | 0.75rem |
| `md`        | 3rem    | `calc((var(--md-box-height) - var(--md-line-height)) / 2)` | 1rem |
| `lg`        | 3.5rem  | `calc((var(--lg-box-height) - var(--lg-line-height)) / 2)` | 1rem |

`height` is fixed (not `min-height`); padding-block is still derived from the same box-height/line-height formula as button.

### input-number

| `data-size` | box-height | button width | input |
|-------------|---------|--------------|--------------|
| `sm`        | 2.5rem  | 1.5rem       | flex: 1      |
| `md`        | 3rem    | 2rem         | flex: 1      |
| `lg`        | 3.5rem  | 2.5rem       | flex: 1      |

The gap between the stepper buttons and the text input (`padding: 0.75rem 0` on the inner `input[type="text"]`) is a component-local visual boundary, not part of the shared padding-inline convention.

### select

| `data-size` | box-height | padding-left | padding-right |
|-------------|---------|--------------|--------------|
| `sm`        | 2.5rem  | 0.75rem      | 2.5rem       |
| `md`        | 3rem    | 1rem         | 2.5rem       |
| `lg`        | 3.5rem  | 1rem         | 2.5rem       |

`padding-left` follows the shared per-component padding-inline value; `padding-right` stays fixed across sizes since it exists to clear the dropdown arrow icon (a component-local boundary), not to scale with size.

### textarea

| `data-size` | box-height | padding-block | padding-inline | font-size | line-height |
|-------------|---------|-----------------|------------------|-----------|-------------|
| `sm`        | 2.5rem  | `calc((var(--sm-box-height) - var(--sm-line-height)) / 2)` | 0.75rem | `var(--sm-font-size)` | `var(--sm-line-height)` |
| `md`        | 3rem    | `calc((var(--md-box-height) - var(--md-line-height)) / 2)` | 1rem    | `var(--md-font-size)` | `var(--md-line-height)` |
| `lg`        | 3.5rem  | `calc((var(--lg-box-height) - var(--lg-line-height)) / 2)` | 1rem    | `var(--lg-font-size)` | `var(--lg-line-height)` |

`height` is `auto` (textarea grows with content / `resize: vertical`); `box-height` here is only ever used to derive `padding-block`, never applied as an actual height.

### checkbox

Label `font-size` is fixed to `--md-font-size` (`--label-font-size`) regardless of `data-size`; `line-height`/`letter-spacing: 0` remain hardcoded to `--md-line-height`/`0`.

| `data-size` | box-height | input-size | hover-size | gap     | border-width | padding-block |
|-------------|------------|------------|------------|---------|--------------|---------------|
| `sm`        | 2.5rem     | 1.25rem    | 1.5rem     | 0.25rem | 0.125rem     | 0.625rem      |
| `md`        | 3rem       | 1.625rem   | 2rem       | 0.5rem  | 0.125rem     | 0.6875rem     |
| `lg`        | 3.5rem     | 2.25rem    | 2.75rem    | 0.5rem  | 0.1875rem    | 0.625rem      |

`box-height` here is the overall row height the size scale reserves for a checkbox + label (not itself consumed via `var(--{size}-box-height)`, but kept aligned to it); `hover-size` is the invisible touch-target square centered behind `input-size`. There is no `padding-inline` — the gap between the box and its label text is handled by `gap`, a component-local boundary.

#### radio

Label `font-size`/`line-height`/`letter-spacing` follow the same rule as checkbox.css above; `font-family`/`font-weight`/`letter-spacing` are explicit rather than relying on inheritance, matching checkbox.css.

| `data-size` | box-height | outer-size | inner-size | hover-size | gap     | border-width | padding-block |
|-------------|------------|------------|------------|------------|---------|--------------|---------------|
| `sm`        | 2.5rem     | 1.25rem    | 0.625rem   | 1.5rem     | 0.25rem | 0.125rem     | 0.625rem      |
| `md`        | 3rem       | 1.625rem   | 0.75rem    | 2rem       | 0.5rem  | 0.125rem     | 0.6875rem     |
| `lg`        | 3.5rem     | 2.25rem    | 1rem       | 2.75rem    | 0.75rem | 0.1875rem    | 0.625rem      |

### heading

`data-size` is accepted on any of `h1`–`h6` directly, or on a wrapping `hgroup` (applies to its heading child). Omitting `data-size` defaults by element: `h1`→`2xl`, `h2`→`xl`, `h3`→`lg`, `h4`/`h5`/`h6`→`md`; omitting it on `hgroup` defaults the same way per its heading child. There is no implicit fallback beyond this — every size below must be reached via one of these two paths.

| `data-size` | font-size | line-height | letter-spacing |
|-------------|-----------|-------------|-----------------|
| `xs`        | 0.85rem  | 1.5rem   | 0.02rem |
| `sm`        | 0.85rem  | 1.5rem   | 0.02em  |
| `md`        | 1rem     | 1.5rem   | 0       |
| `lg`        | 1.15rem  | 1.725rem | 0       |
| `xl`        | 1.5rem   | 2.25rem  | 0       |
| `2xl`       | 2rem     | 3rem     | 0       |

`data-rule` (boolean attribute, no value) adds a bottom border sized to `data-size`; `data-chip` adds a leading vertical accent bar, independent of size.

| `data-size` | rule border-width | rule padding-bottom |
|-------------|---------------------|------------------------|
| `xs`        | 0.125rem  | 0.5rem   |
| `sm`        | 0.1875rem | 0.625rem |
| `md`        | 0.25rem   | 0.75rem  |
| `lg`        | 0.3125rem | 0.875rem |
| `xl`        | 0.375rem  | 1rem     |
| `2xl`       | 0.5rem    | 1.25rem  |

### disclosure

`data-size` on `details` (defaults to `md` when omitted — no per-element fallback like heading, since `details`/`summary` has only one element shape).

| `data-size` | box-height | icon-size | summary padding-block |
|-------------|------------|-----------|------------------------|
| `xs`        | 1.75rem | `calc(var(--xs-font-size) * 1.25)` | `calc((var(--xs-box-height) - var(--xs-line-height)) / 2)` |
| `sm`        | 2.5rem  | `calc(var(--sm-font-size) * 1.25)` | `calc((var(--sm-box-height) - var(--sm-line-height)) / 2)` |
| `md`        | 3rem    | `calc(var(--md-font-size) * 1.25)` | `calc((var(--md-box-height) - var(--md-line-height)) / 2)` |
| `lg`        | 3.5rem  | `calc(var(--lg-font-size) * 1.25)` | `calc((var(--lg-box-height) - var(--lg-line-height)) / 2)` |
| `xl`        | 4rem    | `calc(var(--xl-font-size) * 1.25)` | `calc((var(--xl-box-height) - var(--xl-line-height)) / 2)` |
| `2xl`       | 4.75rem | `calc(var(--2xl-font-size) * 1.25)` | `calc((var(--2xl-box-height) - var(--2xl-line-height)) / 2)` |

`summary`'s horizontal padding is `0` on the outer edge and `calc(var(--icon-size) + 0.75rem)` on the icon side only — the icon gap is a component-local boundary, matching the cross-component convention above. The disclosure arrow (`::before`) is centered within `icon-size`: `left: calc((var(--icon-size) - 0.625rem) / 2)`.
