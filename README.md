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

Defined once in `css/config.css` (`:root`) as `--{size}-box-height` / `--{size}-font-size` / `--{size}-letter-spacing` / `--{size}-line-height`, for `xs`/`sm`/`md`/`lg`/`xl`/`2xl`. Each component's CSS file starts with an HTML comment showing its expected markup structure; `index.html` enumerates every `data-size`/`data-type` variant a component supports. Check those two sources for a component's concrete shape rather than a table here — this file only states the rules that hold *across* components.

### Cross-component convention: padding & width

- **`padding-block`** (vertical padding), wherever a component consumes a `box-height`, is derived as `calc((var(--{size}-box-height) - var(--{size}-line-height)) / 2)` — this centers the line box inside the scale's box-height regardless of component. How `box-height` itself is applied differs by component's native sizing behavior:
  - `button`: `min-height` (content can grow the button beyond the scale value)
  - `input`, `input-number`, `select`, `toggle`: `height` (fixed)
  - `textarea`: not applied as a height at all (`height: auto`, grows with content / `resize: vertical`) — `box-height` is only ever read to derive `padding-block`
  - `checkbox`, `radio`: not consumed directly; box-height is the row height the scale reserves for input+label, kept aligned to it by convention rather than `var()` reference
  - `heading`, `disclosure` (its `details`/`summary` height): no box-height concept — `disclosure` only reads `box-height` to derive `summary`'s `padding-block`, same rule as textarea
- **`padding-inline`** (horizontal padding) is a per-component, hardcoded rem value at each size — never derived from a shared variable, since it's a per-component design choice, not a scale primitive. Any internal visual boundary a component has of its own (an icon, a stepper button, a dropdown arrow) is likewise a component-local decision, not unified across components.
- **`width`** is left unset (auto / content-driven) everywhere. Nothing hardcodes a fixed width or `100%`; give an element a width via the surrounding markup (a wrapping `style`/class) when one is needed.
- **`data-size` fallback**: omitting `data-size` defaults to `md` everywhere, with one exception — `heading` (`h1`–`h6`, or via a wrapping `hgroup`) defaults by element instead: `h1`→`2xl`, `h2`→`xl`, `h3`→`lg`, `h4`/`h5`/`h6`→`md`.
