# css

Css universal design boilerplate. Works without interference to HTML.

- Universal Design (variants included) based on [digital government jp design system](https://github.com/digital-go-jp/design-system-example-components-html), [CUDO: Color Universal Design Recommended Color Set ver.3](https://cudo.jp/wp-content/uploads/2016/07/CUD%E6%8E%A8%E5%A5%A8%E9%85%8D%E8%89%B2%E3%82%BB%E3%83%83%E3%83%88%E3%82%AC%E3%82%A4%E3%83%89%E3%83%96%E3%83%83%E3%82%AF.pdf), WCAG 2.2, ARIA APG, IEC60447:1993(Man-machine-interface Principle).
- Requires to html only semantic and also structural tag's structure and minimum anonymous elements.
- Render correctly without JS.
- Each component's CSS file starts with an HTML comment showing its expected HTML structure.
- All CSS Property is described in order of dependencies, and then, alphabetical.

## Version

| Version | Status    | Date       | Description |
|---------|-----------|------------|-------------|
| 0.1.0   | Scheduled | 2026-08-31 | 1st release |

## Color

```css
/* config.css */
@layer css.config {
    :root {
        --rgb-ink         /* text color */
        --rgb-border      /* border color */
        --rgb-background  /* background color */

        --rgb-success
        --rgb-error
        --rgb-focus

        --rgb-emphasis /* theme color */

    }

    @media (prefers-color-scheme: dark) {
        :root {
            --rgb-ink
            --rgb-border
            --rgb-background
            --rgb-emphasis
        }
    }
}

/* --- Example substitution (user-style.css) --- */
#some-element {
    --color-ink: ;
    --color-border: ;
    --color-background: ;
    --color-emphasis: ;
    --color-emphasis-hover: ;
    --color-emphasis-active: ;
}
```

## Size

Every component below reuses these same column names — a component either consumes a value as-is or overrides it locally.

```css
@layer css.config {
    :root {
        /* ... */
        --md-box-height: 3rem; /* border-box height  */
        --md-font-size: 1rem;
        --md-letter-spacing: 0;
        --md-line-height: 1.5rem;
        /* ... */
    }
}

@layer css.component {
    button:not([data-size]),
    button[data-size="md"],
    input:not([data-size]),
    input[data-size="md"] {
        padding-block: calc((var(--md-box-height) - var(--md-line-height)) / 2);
    }
}
```

| `data-size`   | box-height | font-size | letter-spacing | line-height |
|---------------|------------|-----------|----------------|-------------|
| `xs`          | 1.75rem    | 0.85rem | 0.02rem | 1.5rem |
| `sm`          | 2.5rem     | 0.85rem | 0.02rem | 1.5rem |
| `md`(default) | 3rem       | 1rem    | 0       | 1.5rem |
| `lg`          | 3.5rem     | 1.15rem | 0       | 1.725rem |
| `xl`          | 4rem       | 1.5rem  | 0       | 2.25rem |
| `2xl`         | 4.75rem    | 2rem    | 0       | 3rem   |

- **`data-size` fallback**: omitting `data-size` defaults to `md` everywhere. Only `heading` (`h1`–`h6`, or via a wrapping `hgroup`) defaults by element: `h1`→`2xl`, `h2`→`xl`, `h3`→`lg`, `h4`/`h5`/`h6`→`md`.
- **`padding-block`**, wherever a component consumes a `box-height`, is derived as `calc((var(--{size}-box-height) - var(--{size}-line-height)) / 2)` — this centers the line box inside the scale's box-height regardless of component. How `box-height` itself is applied differs by component's native sizing behavior:
    - `button`: `min-height` (grows with content)
    - `input(text, number)`, `select`, `toggle`: `height` (fixed)
    - `checkbox`, `radio`: label is box-height, input is line-height.
    - `textarea`: `height: auto; resize: vertical`(grows with content). `box-height` is only ever read to derive `padding-block`
    - `disclosure`(`summary`): `height: auto`(grows with content). Same rule as textarea.
    - `heading`: `padding-block: 0`
- **`padding-inline`**, component has of its own (an icon, a stepper button, a dropdown arrow) is a component-local decision, so hardcoded in `rem`, not unified across components.
- **`width`** is left unset (auto / content-driven) everywhere. Nothing hardcodes a fixed width or `100%`; give an element a width via the surrounding markup (a wrapping `style`/class) when one is needed.

### data-type

| Selector  | Name        | Value     | Specification |
|-|-|-|-|
| `button`  | `data-type` | `fill`    | |
|           |             | `outline` | |
|           |             | `text`    | |
| `hr`      | `data-type` | `dash`    | |
| `details` | `data-type` | `fill`    | |
|           |             | `outline` | |
|           |             | `rule`    | |

### Preference

| Preference | |
|-|-|
| `prefers-color-scheme: dark` | |
