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
| 0.1.0   | Scheduled | 2026-09-30 | 1st release |

## Color

Defined in [base.css](./css/base.css) (`@layer css.base`). There is no separate config file — override the `--color-*` variables on any scope to restyle.

```css
@layer css.base {
    :root {
        /* CUDO palette, as space-separated channels (usable via rgb(var(--rgb-*) / alpha)) */
        --rgb-accent-red, --rgb-accent-yellow, --rgb-accent-green, --rgb-accent-blue,
        --rgb-accent-sky, --rgb-accent-pink, --rgb-accent-orange, --rgb-accent-purple,
        --rgb-accent-brown;
        --rgb-base-light-pink, --rgb-base-cream, --rgb-base-light-yellow-green,
        --rgb-base-light-sky, --rgb-base-beige, --rgb-base-light-green,
        --rgb-base-light-purple;
        --rgb-white, --rgb-light-gray, --rgb-gray, --rgb-black;

        /* Roles — these are what components actually consume */
        --color-ink;    /* text color        */
        --color-paper;  /* background color  */
        --color-mute;   /* border / subdued text; >=4.5:1 on paper (WCAG AA 1.4.3) */

        --color-emphasis;              /* >=7:1 on paper (WCAG AAA 1.4.6) */
        --color-emphasis-fill;         /* emphasis as a fill; >=7:1 against ink */
        --color-emphasis-active;
        --color-emphasis-fill-active;  /* >=3:1 on paper (WCAG AA 1.4.11)  */
        --color-paper-active;

        --color-focus;      /* focus ring; defaults to --color-emphasis */
        --color-error;      /* non-text only (per CUDO FAQ) */
        --color-success;    /* non-text only */
        --color-highlight;  /* mark, ::selection */
    }
}

/* --- Example substitution (user-style.css) --- */
#some-element {
    --color-ink: ;
    --color-paper: ;
    --color-mute: ;
    --color-emphasis: ;
}
```

Status colors (`--color-error`, `--color-success`) are applied to non-text elements only — border, icon, background fill — per the CUDO FAQ; the accompanying text stays `--color-ink`.

`--color-mute` and the `-active` variants are derived with `color-mix()` from the ratios `--ratio-mute`, `--ratio-emphasis-active` and `--ratio-paper-active`, so adjusting a ratio moves every dependent color at once.

## Size

Every component below reuses these same column names — a component either consumes a value as-is or overrides it locally.

```css
/* base.css */
@layer css.base {
    :root {
        /* ... */
        --md-border-radius:  0.5rem;
        --md-border-width:   0.125rem;
        --md-box-height:     3rem;
        --md-font-size:      1rem;
        --md-letter-spacing: 0;
        --md-line-height:    1.5rem;
        /* ... */
    }
}

/* each component's own layer, e.g. @layer css.button */
@layer css.button {
    :is(button, input, select, textarea):not([data-size]),
    [data-size="md"] {
        border-radius:  var(--md-border-radius);
        border-width:   var(--md-border-width);
        font-size:      var(--md-font-size);
        letter-spacing: var(--md-letter-spacing);
        line-height:    var(--md-line-height);
        padding-block: calc(((var(--md-box-height) - var(--md-line-height)) / 2) - var(--md-border-width));
    }
}
```

| `data-size`   | box-height | Typography |
|-|-|-|
| `xs`          | 1.75rem    | small     |
| `sm`          | 2.5rem     | small     |
| `md`(default) | 3rem       | medium    |
| `lg`          | 3.5rem     | large     |
| `xl`          | 4rem       | heading 2 |
| `2xl`         | 4.75rem    | heading 1 |

| Typography  | font-size | letter-spacing | line-height |
|-|-|-|-|
| small     | 0.85rem | 0.02rem | 1.5rem      |
| medium    | 1rem    | 0       | 1.5rem      |
| large     | 1.15rem | 0       | 1.725rem    |
| heading 2 | 1.5rem  | 0       | 2.25rem     |
| heading 1 | 2rem    | 0       | 3rem        |

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

### data-style

Appearance of a box or of text. Applied by [button.css](./css/button.css) and [part.css](./css/part.css).

| Selector | Value | Description |
|-|-|-|
| `button`, `a`, `details > summary` | `fill` | filled with `--color-emphasis-fill`, transparent border (default for `button`) |
| | `outline` | transparent background, `--color-emphasis` border and text |
| | `underline` | no box, underlined `--color-emphasis` text (default for a bare `a:any-link` and a bare `summary`) |
| any element | `rule-indent` | indented block with an accent rule down the inline start edge |

### data-type

Kind, rather than appearance. Values are component-local.

| Selector | Value | Description |
|-|-|-|
| `section` | `error-summary` | error summary block ([error.css](./css/error.css)) |
| `p` | `error` | per-field error message ([error.css](./css/error.css)) |
| `label` (toggle) | `knob-only` | non-interactive toggle showing state only ([toggle.css](./css/toggle.css)) |

### data-axis

Direction in which a component lays its parts out. Each value below is opt-in; omitting the attribute keeps the component's own default arrangement.

| Selector | Value | Applied by |
|-|-|-|
| `hgroup` | `inline` | [heading.css](./css/heading.css) |
| `details` | `inline` | [button.css](./css/button.css) |
| `label` (toggle, slider, step) | `block` | [toggle.css](./css/toggle.css), [slider.css](./css/slider.css), [step.css](./css/step.css) |

### Component-local attributes

| Selector | Attribute | Description |
|-|-|-|
| `table` | `data-border`, `data-stripe`, `data-hover`, `data-selectable` | boolean; rules, zebra striping, row hover, row selection ([table.css](./css/table.css)) |
| `label > input[type="range"]` | `data-text-min`, `data-text-max` | labels for the limits of the range ([slider.css](./css/slider.css)) |
| `button` (step) | `data-action` | `increment` / `decrement` ([step.css](./css/step.css)) |

### Preference

| Preference | |
|-|-|
| `prefers-color-scheme: dark` | |
