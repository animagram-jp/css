# css

Interface design system and DOM implements.

- Universal Design (variants included) based on [digital government jp design system](https://github.com/digital-go-jp/design-system-example-components-html), [Color Universal Design Recommended Color Set ver.3](https://cudo.jp/wp-content/uploads/2016/07/CUD%E6%8E%A8%E5%A5%A8%E9%85%8D%E8%89%B2%E3%82%BB%E3%83%83%E3%83%88%E3%82%AC%E3%82%A4%E3%83%89%E3%83%96%E3%83%83%E3%82%AF.pdf), GOV.UK Design System, WCAG 2.2, ARIA APG, IEC60447:1993(Man-machine-interface Principle).
- Requires to html only semantic and also structural tags and minimum anonymous elements.
- Render correctly without JS.
- All CSS properties are described in order of dependencies, and then, alphabetical.

## Version

| Version | Status    | Date       | Description |
|---------|-----------|------------|-------------|
| 0.1.0   | Scheduled | 2026-09-30 | 1st release |

---

## Dependency layers

- [reset.css(@layer css.reset)](./css/reset.css): 1st common layer per the-new-css-reset.
- [base.css(@layer css.base)](./css/base.css):   2nd common layer defining defaults of all custom global/scoped parameters.
- [data_style.css(@layer css.data_style)](./css/data_style.css): 3rd common layer defining data-style attribute.
- [data_size.css(@layer css.data_size)](./css/data_size.css): 4th common layer defining data-size attribute.
- [data_sign.css(@layer css.data_sign)](./css/data_sign.css): 5th common layer defining data-sign and data-facet attributes.
- [data_group.css(@layer css.data_group)](./css/data_group.css): 6th common layer defining data-group attribute.

---

## Color

Defined in [base.css](./css/base.css) (`@layer css.base`). 
Override the `--color-*` variables on any scope to restyle.

| Category | Name | Meaning |
|-|-|-|
| channel | `--rgb-accent-red` | `--color-error` default. |
| | `--rgb-accent-yellow` | `--color-higlight` default. |
| | `--rgb-accent-green` | `--color-success` default. |
| | `--rgb-accent-purple` | `a:visited` default (light). Lightened toward white in dark, per "Contrast requirements". |
| global parameter | `--color-ink` | Default text color in the scheme. |
| | `--color-paper` | Default background color in the scheme. |
| | `--color-ink-mix` | Default mixed to contrast with paper. |
| | `--color-paper-mix` | Default mixed to contrast with ink. |
| | `--color-error` | `:user-invalid` default. |
| | `--color-highlight` | `::selection` default to contrast with ink. |
| | `--color-success` | boolean true default to contrast with ink. |
| | `--color-emphasis-ink` | Emphasis color to contrast with paper. |
| | `--color-emphasis-ink-mix` | Emphasis mixed to contrast with paper. |
| | `--color-emphasis-paper` | Emphasis color for surfaces that stay the same across schemes (e.g. a `[data-selectable]` selected row); not used by `invert`, which uses `--color-emphasis-ink` in both light and dark. |
| scoped parameter | `color` | text color in the scope. |
| | `background-color` | fill color in the scope. |
| | `border-color` | border color in the scope. |
| | `outline-color` | focus color in the scope. |

Scoped parameters contrast requirements:

```
┌ backdrop ──────────┐
│  ┏ border ━━━━━━━┓ │
│  ┃  fill         ┃ │
│  ┃ ┌(highlight)┐ ┃ │
│  ┃ │  -text-   │ ┃ │
│  ┃ └───────────┘ ┃ │
│  ┃               ┃ │
│  ┗━━━━━━━━━━━━━━━┛ │
└────────────────────┘
```

- :focus outline's requirements is equal to border and it is not nessesary to differ with border.
- :hover does not have any color difference.
- Each ink and paper variant have to meet contrast 7:1 (WCAG 2.2 AAA) with all of the other color group.
- {color}-mix variant has additional requirement: non text contrast 3:1 (per WCAG 2.2 A) to {color}
- To fix fill color, ::selection remove text color "mix" suffix.

| Style | text | fill | border | backdrop | 
|-|-|-|-|-|
| - | `--color-ink` | `--color-paper` | `--color-ink` | `--color-paper` |
| ::selection | `--color-ink` | `--color-highlight`/`--color-paper` | | |
| input | `--color-ink` | `--color-paper` | `--color-ink-mix` | `--color-paper` |
| input::selection | | `--color-highlight`/`--color-paper` | | |
| input:disabled | `--color-ink-mix` | `--color-paper` | `--color-ink-mix` | `--color-paper` |
| input:disabled::selection | `--color-ink` | `--color-highlight`/`--color-paper` | | |
| input:user-invalid | `--color-ink` | `--color-paper` | `--color-error` | `--color-paper` |
| input:user-invalid::selection | | `--color-highlight`/`--color-paper` | | |
| invert | `--color-paper` | `--color-emphasis-ink` | transparent | `--color-paper` |
| invert::selection | | `--color-highlight`/`--color-emphasis-ink` | | |
| invert:disabled | `--color-paper` | `--color-ink-mix` | transparent | `--color-paper` |
| invert:disabled::selection | | `--color-highlight`/`--color-ink-mix` | | |
| invert:active | `--color-paper` | `--color-emphasis-ink-mix` | transparent | `--color-paper` |
| invert:active::selection | | `--color-highlight`/`--color-emphasis-ink-mix` | transparent | `--color-paper` |
| outline | `--color-emphasis-ink` | `--color-paper` | `--color-emphasis-ink` | `--color-paper` |
| outline::selection | | `--color-highlight`/`--color-paper` | | |
| outline:disabled | `--color-ink-mix` | `--color-paper` | `--color-ink-mix` | `--color-paper` |
| outline:disabled::selection | `--color-ink` | `--color-highlight`/`--color-paper` | | |
| outline:active | `--color-emphasis-ink-mix` | `--color-paper-mix` | `--color-emphasis-ink-mix` | `--color-paper` |
| outline:active::selection | | `--color-highlight`/`--color-paper-mix` | | |
| underline | `--color-emphasis-ink` | `--color-paper` | `--color-emphasis-ink` | `--color-paper` |
| underline::selection | | `--color-highlight`/`--color-paper` | | |
| underline:disabled | `--color-ink-mix` | `--color-paper` | `--color-ink-mix` | `--color-paper` |
| underline:disabled::selection | `--color-ink(-mix)` | `--color-highlight`/`--color-paper` | | |
| underline:active | `--color-emphasis-ink-mix` | `--color-paper-mix` | - | `--color-paper` |
| underline:active::selection | | `--color-highlight`/`--color-paper-mix` | | |

### Contrast requirements

Requirements come from layer adjacency (text↔fill, fill↔border, border↔backdrop) in the style table above, not from color grouping.

| Property | 7:1 text (AAA 1.4.6) | 4.5:1 text (AA 1.4.3) | 3:1 non-text (AA 1.4.11) |
|-|-|-|-|
| `--color-ink` (light) | — | `highlight` | — |
| `--color-ink` (dark) | `paper` | `success` | `highlight` |
| `--color-ink-mix` | — | `paper` | `highlight` |
| `--color-paper` (light) | `emphasis-ink`, `emphasis-ink-mix` | `success` | `emphasis-paper`, `error`, `highlight`, `ink-mix` |
| `--color-paper` (dark) | `emphasis-ink`, `emphasis-ink-mix`, `ink` | — | `emphasis-paper`, `error`, `ink-mix` |
| `--color-paper-mix` | `emphasis-ink-mix` | — | — |
| `--color-emphasis-ink` | `paper` | — | — |
| `--color-emphasis-ink-mix` | `paper` | — | `highlight` |
| `--color-emphasis-paper` | — | — | `paper` |
| `--color-highlight` (light) | — | `ink` | `emphasis-ink`, `emphasis-ink-mix`, `ink-mix`, `paper`, `paper-mix` |
| `--color-highlight` (dark) | — | `paper` | `emphasis-ink`, `emphasis-ink-mix`, `ink-mix`, `paper-mix`, `ink` |
| `--color-error` | — | — | `paper` |
| `--color-success` (light) | — | `paper` | — |
| `--color-success` (dark) | — | `ink` | — |
| `color:visited` (light) | `paper` | — | — |
| `color:visited` (dark) | `paper` | — | — |

- Text contrast is 7:1 (AAA 1.4.6), or 4.5:1 for large-scale text (AA 1.4.3).
- `--color-ink-mix` carries no 7:1 row: it is only ever text on `:disabled`.
- `--color-emphasis-ink-mix` never touches its own base color: `invert:active`'s border is `transparent` (not `emphasis-ink`), because a color dark enough to clear 7:1 against paper as `emphasis-ink` can't also clear 3:1 against its own `-mix` variant — the self-contrast tops out around 2.3–2.7:1 regardless of hue. `--color-ink-mix` and `--color-paper-mix` likewise never touch their base. `--color-emphasis-paper` has no `-mix` variant: `invert` uses `--color-emphasis-ink` in both light and dark, so `--color-emphasis-paper` only ever appears as a flat fill (e.g. a `[data-selectable]` selected row) with no active/mix state.
- `--color-highlight` nests inside whatever fill it's applied over (per the Color section's backdrop/border/fill/(highlight)/text diagram): its own inner `::selection` text drops the `-mix` suffix (4.5:1, against `ink` in light / `paper` in dark only — capped at AA, not 7:1, because the same fill must also clear 3:1 as a non-text patch against every outer fill it can land on: `paper`/`ink` normally, `emphasis-ink`/`emphasis-ink-mix`/`paper-mix` under invert/outline/underline `:active`; one color can't hit 7:1 text and 3:1 non-text against opposite ends of the same ink/paper pair at once). It never touches `--color-error`, since `error` is only ever a `border-color`/`outline-color` and the diagram has no border↔highlight adjacency (border meets fill, not the highlight nested inside it).
- Rows marked (light)/(dark) hold only in that color-scheme, because `--color-highlight`'s `::selection` text swaps `ink`↔`paper` by scheme (see the Style table's `::selection (dark)` row); unmarked rows hold in both.
- `--color-success` has no adjacency in the style table above; its requirement comes from its own definition (boolean-true fill, per the Color table). Same shape as `--color-highlight`: it needs 4.5:1 against whichever of `ink`/`paper` reads lighter in each scheme (`paper` in light, `ink` in dark), because it has to clear that AA bar in both schemes with a single value.
- `--color-emphasis-paper` only needs 3:1 against `--color-paper`: since `invert` no longer uses it (both schemes use `--color-emphasis-ink` for that), its one remaining use (`table[data-selectable]`'s selected-row fill) never carries text, so the 4.5:1/7:1 text columns don't apply.
- `color:visited` isn't one of the `--color-*` custom properties above; it's `a:visited`'s own `color` (default `rgb(var(--rgb-accent-purple))`, per the Color table). Its 7:1 requirement is against `--color-paper` in each scheme (`paper` reads white in light, black in dark), so a single color can't clear both — button.css switches the value under `prefers-color-scheme: dark` instead of introducing a new `--color-*` variable.

### style

Appearance of a box or of text. Applied by [button.css](./css/button.css) and [part.css](./css/part.css).

| Selector | Value | Description |
|-|-|-|
| `button`, `a`, `details > summary` | `invert` | filled with `--color-emphasis-ink`, transparent border (default for `button`) |
| | `outline` | transparent background, `--color-emphasis-ink` border and text |
| | `underline` | no box, underlined `--color-emphasis-ink` text (default for a bare `a:any-link` and a bare `summary`) |
| any element | `rule-indent` | indented block with an accent rule down the inline start edge |

## Size

```
↑ margin-block: 0 (default)
↓
───
↑ border-width: --{size}-border-width
↓
───
↑
  padding-block: (--{size}-box-height - --{size}-line-height) / 2 - --{size}-border-width
↓ 
───
↑
  line-height: --{size}-line-height
↓  
───
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