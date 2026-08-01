# css

Css universal design boilerplate. Works without interference to HTML.

- Universal Design (variants included) based on [digital government jp design system](https://github.com/digital-go-jp/design-system-example-components-html), WCAG 2.2, ARIA APG.
- Requires to html only semantic and also structural tag's structure and minimum anonymous elements.
- Render correctly without JS.
- Each component's CSS file starts with an HTML comment showing its expected HTML structure.

## Version

| Version | Status    | Date       | Description |
|---------|-----------|------------|-------------|
| 0.1.0   | Scheduled | 2026-08-31 | 1st release |

## Size Scale (data-size attribute)

Every component below reuses these same column names — a component either consumes a value as-is or overrides it locally.

| `data-size`   | box-height | font-size | letter-spacing | line-height |
|---------------|------------|-----------|----------------|-------------|
| `xs`          | 1.75rem | 0.85rem | 0.02rem | 1.5rem |
| `sm`          | 2.5rem  | 0.85rem | 0.02em  | 1.5rem |
| `md`(default) | 3rem    | 1rem    | 0       | 1.5rem |
| `lg`          | 3.5rem  | 1.15rem | 0       | 1.725rem |
| `xl`          | 4rem    | 1.5rem  | 0       | 2.25rem |
| `2xl`         | 4.75rem | 2rem    | 0       | 3rem   |

```css
/* config.css */
@layer css.config {
    :root {
        --xs-box-height: 1.75rem; /* border-box height  */
        --xs-font-size: 0.85rem;
        --xs-letter-spacing: 0.02rem;
        --xs-line-height: 1.5rem;

        /* ... */
    }
}
```

- **`padding-block`**, wherever a component consumes a `box-height`, is derived as `calc((var(--{size}-box-height) - var(--{size}-line-height)) / 2)` — this centers the line box inside the scale's box-height regardless of component. How `box-height` itself is applied differs by component's native sizing behavior:
    - `button`: `min-height` (grows with content)
    - `input(text, number)`, `select`, `toggle`: `height` (fixed)
    - `checkbox`, `radio`: not consumed directly; box-height is the row height the scale reserves for input+label, kept aligned to it by convention rather than `var()` reference
    - `textarea`: `height: auto; resize: vertical`(grows with content). `box-height` is only ever read to derive `padding-block`
    - `disclosure`(`summary`): `height: auto`(grows with content). Same rule as textarea.
    - `heading`: `padding-block: 0`
- **`padding-inline`**, component has of its own (an icon, a stepper button, a dropdown arrow) is a component-local decision, so hardcoded in `rem`, not unified across components.
- **`width`** is left unset (auto / content-driven) everywhere. Nothing hardcodes a fixed width or `100%`; give an element a width via the surrounding markup (a wrapping `style`/class) when one is needed.
- **`data-size` fallback**: omitting `data-size` defaults to `md` everywhere, with one exception — `heading` (`h1`–`h6`, or via a wrapping `hgroup`) defaults by element instead: `h1`→`2xl`, `h2`→`xl`, `h3`→`lg`, `h4`/`h5`/`h6`→`md`.