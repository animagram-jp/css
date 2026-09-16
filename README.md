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
| | `--rgb-accent-yellow` | `--color-highlight-paper` default. |
| | `--rgb-accent-green` | `--color-success` default. |
| | `--rgb-accent-purple` | `a:visited` default (light mode). |
| global parameter | `--color-ink` | Default text color in the scheme. |
| | `--color-paper` | Default background color in the scheme. |
| | `--color-ink-mix` | Default mixed to contrast with paper. |
| | `--color-paper-mix` | Default mixed to contrast with ink. |
| | `--color-error` | `:user-invalid` default. |
| | `--color-highlight-ink` | `::selection` default to contrast with paper. |
| | `--color-highlight-ink` | `::selection` default to contrast with ink. |
| | `--color-success` | boolean true default to contrast with ink. |
| | `--color-emphasis-ink` | Emphasis color to contrast with paper. |
| | `--color-emphasis-ink-mix` | Emphasis mixed to contrast with paper. |
| | `--color-emphasis-paper` | Emphasis color for surfaces that stay the same across schemes (e.g. a `[data-selectable]` selected row); not used by `fill`, which uses `--color-emphasis-ink` in both light and dark. |
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
- Empty cells mean as above.

| Style | text | highlight | fill | border | backdrop | 
|-|-|-|-|-|-|
| input | color-ink | - | color-paper | color-ink-mix | |
| input::selection | color-paper | color-highlight-ink | | | |
| input:disabled | color-ink-mix | - | | | |
| input:disabled::selection | color-paper | color-highlight-ink | | | |
| input:user-invalid | color-ink | - | | color-error | |
| input:user-invalid::selection | color-paper | color-highlight-ink | | | |
| fill | color-paper | - | color-emphasis-ink | transparent | |
| fill::selection | color-ink | color-highlight-paper | color-emphasis-ink | | |
| fill:disabled | color-paper | - | color-ink-mix | | |
| fill:disabled::selection | color-ink | color-highlight-paper | color-ink-mix | | |
| fill:active | color-paper | - | color-emphasis-ink-mix | | |
| fill:active::selection | color-ink | color-highlight-paper | color-emphasis-ink-mix | | |
| outline | color-emphasis-ink | - | color-paper | color-emphasis-ink | |
| outline::selection | color-emphasis-paper | color-highlight-ink | | | |
| outline:disabled | color-ink-mix | - | | color-ink-mix | |
| outline:disabled::selection | color-paper | color-highlight-ink | | | |
| outline:active | color-emphasis-ink | - | color-paper-mix | color-emphasis-ink-mix | |
| outline:active::selection | color-emphasis-paper | color-highlight-ink | | | |
| - | color-ink | - | color-paper(-mix) | color-ink | | 
| ::selection | color-paper | color-highlight-ink | color-paper(-mix) | | | 
| - | color-ink | - | color-emphasis-paper | - | | 
| underline | color-{emphasis}-ink | - | color-paper | - | |
| underline::selection | color-paper | color-highlight-ink | | | |
| underline:disabled | color-ink-mix | - | | | |
| underline:disabled::selection | color-paper | color-highlight-ink | | | |
| underline:active | color-emphasis-ink-mix | - | | | |
| underline:active::selection | color-paper | color-highlight-ink | | | |

### Contrast requirements

Requirements come from layer adjacency (text↔highlight↔fill, fill↔border, border↔backdrop) in the
style table above. Selection text is fully enclosed by the highlight box and never touches the fill
layer, so it pairs only with the highlight (4.5:1, 1.4.3); the highlight box edge is what sits on the
fill (3:1, 1.4.11).

Layers alternate polarity outward from the backdrop — `-paper` → `-ink` → `-paper` → … — so each
layer contrasts with the one enclosing it. All 27 rows of the style table satisfy this.

Each row below holds per scheme; light and dark resolve to different values of the same parameter.

| Property | 7:1 text (AAA 1.4.6) | 4.5:1 text (AA 1.4.3) | 3:1 non-text (AA 1.4.11) |
|-|-|-|-|
| color-ink | color(-emphasis)-paper | color(-emphasis)-paper(-mix) | — |
| color-ink-mix | — | color-paper | color-paper, color-paper-mix |
| color-paper | — | color-success, color-ink-mix | emphasis-paper, color-error |
| color-paper-mix | emphasis-ink-mix | — | color-ink-mix |
| color-emphasis-ink | paper | — | — |
| color-emphasis-ink-mix | paper | — | — |
| color-emphasis-paper | — | — | paper |
| color-highlight-ink | — | color-paper | color-paper, color-paper-mix |
| color-highlight-paper | — | color-ink | color-emphasis-ink, color-emphasis-ink-mix |
| color-error | — | — | paper |
| color-success | — | paper | — |
| color:visited | paper | — | — |

**Distinctness (not a WCAG rule).** The rows above only constrain each color against the layer
enclosing it, so colors that never touch are free to converge — two of them legitimately clear every
row while rendering as the same swatch. These pairs must additionally stay apart:

| Pair | Ratio | Why |
|-|-|-|
| `color-emphasis-paper` ↔ `color-emphasis-ink` | 2:1 | a selected surface must read as distinct from an emphasis fill |
| `color:visited` ↔ `color-emphasis-ink` | 1.4:1 | a visited link must read as distinct from an unvisited one |

**Premises of the analysis below.** The results hold only under these; changing any one changes them:
1. The fill set per context is read off the style table's `::selection` rows. Selection text is enclosed
   by the highlight box, so it pairs with the highlight, not with the fill layer.
2. Contrast is sRGB relative luminance per WCAG 2.x, ignoring alpha, `color-mix` in non-sRGB spaces,
   subpixel rendering and user stylesheets.
3. `--color-*` values are still being tuned, so the table states requirements a palette must satisfy,
   not properties of today's `base.css` literals. `forced-colors` is out of scope (UA-controlled).
4. `:hover` adds no color change and `:focus` reuses the border requirement, per the notes above.
5. 1.4.11 exempts inactive components, so `:disabled` fills (`color-ink-mix`) carry no 3:1 requirement.

**Scheme values are derived, not chosen.**

*`*-high-contrast`* — the mode's purpose is maximum separation, and rgb(0,0,0) / rgb(255,255,255) is
the unique sRGB pair reaching the 21:1 ceiling. Nothing else satisfies the intent, so `--color-ink`
and `--color-paper` are fixed there.

*`*-less-contrast`* — the mode narrows the ink/paper span as far as the requirements still allow,
while `--color-success`, `--color-error`, `--color-highlight-*` and `--color-emphasis-*` stay shared
with the other light schemes. Body text keeps AAA 7:1 across the span, which sets the floor: the
narrowest feasible span is **rgb(43) / rgb(243) = 12.76:1**, bounded by ink ≤ 43 and paper ≥ 243.

**Derived palette.** At that threshold, [solve-palette.mjs](./css/solve-palette.mjs) finds values for every shared color as a `color-mix()` over the CUD channels already in `base.css`, clearing all rows
of the table above in all six schemes.

The dark family mirrors the light one. `*-high-contrast` is an exact swap (contrast is symmetric in
the pair). For `*-less-contrast` the swapped rgb(243)/rgb(43) is feasible and is what the table below
assumes, but it is not dark's own threshold: because the dark accents are lightened rather than
darkened, dark can compress further, to rgb(220)/rgb(43) = **10.33:1**. Keeping the light span keeps
the two families symmetric at the cost of 2.4:1 of available compression. The accents do
**not** swap: in dark, "on paper" means on a *dark* background, so every color that was darkened
toward black in light is instead lightened toward white. The CUD hue is unchanged either way — mixing
toward pure black or white moves lightness only (measured drift ≤ 1°, from rounding).

| Variable | light | dark |
|-|-|-|
| `--color-emphasis-ink` | `accent-purple` 100% → rgb(154,0,121) | `accent-purple` 35% + white → rgb(220,166,208) |
| `--color-emphasis-paper` | `accent-purple` 46% + black → rgb(71,0,56) | `accent-purple` 71% + white → rgb(183,74,160) |
| `--color-highlight-ink` | `accent-yellow` 46% + black → rgb(115,113,0) | `accent-yellow` 100% → rgb(250,245,0) |
| `--color-highlight-paper` | `accent-yellow` 100% → rgb(250,245,0) | `accent-yellow` 41% + black → rgb(103,100,0) |
| `--color-success` | `accent-green` 78% + black → rgb(41,126,83) | `accent-green` 97% + white → rgb(59,164,111) |
| `--color-error` | `accent-red` 100% → rgb(255,40,0) | `accent-red` 100% → rgb(255,40,0) |
| `color:visited` | `accent-purple` 74% + black → rgb(114,0,90) | `accent-purple` 19% + white → rgb(236,207,230) |

Note the two highlight variables trade places between families: what is the dark member in light is
the light member in dark, since `-ink` always carries `color-paper` text and `-paper` always carries
`color-ink` text.

**The emphasis pair is hue-independent.** `--color-emphasis-*` is the injection point for a brand or
per-scope userland color, so the solve must not depend on one particular hue. Passing a hue to the
solver (`node solve-palette.mjs 5B2F91`) re-solves for it; sweeping 288 combinations across the hue
circle (24 hues × 4 saturations × 3 lightnesses) yields a solution for every one.

This needs one refinement. `emphasis-paper` and `visited` normally mix *away* from paper, but when the
brand hue is already saturated at that end — a light hue in dark, a dark one in light — `emphasis-ink`
lands at 100% and mixing further cannot separate them: from pure yellow in dark, every mix toward white
stays within 1.03:1 of `emphasis-ink`. The solver then mixes the other way instead. Without that
fallback, 44 of the 288 combinations fail, all in the yellow-green band (45°–90°) and all on the
distinctness rules above rather than on a WCAG row.

For this project's theme #5B2F91 (hsl 267°), both families solve with more headroom than the CUD
default — 8.37:1 against light paper, since the theme purple is dark enough to clear 7:1 unmixed:

| Variable | light | dark |
|-|-|-|
| `--color-emphasis-ink` | `#5B2F91` 100% → rgb(91,47,145) | `#5B2F91` 38% + white → rgb(193,176,213) |
| `--color-emphasis-paper` | `#5B2F91` 27% + black → rgb(25,13,39) | `#5B2F91` 74% + white → rgb(134,101,174) |
| `color:visited` | `#5B2F91` 69% + black → rgb(63,32,100) | `#5B2F91` 20% + white → rgb(222,213,233) |

No `*-less-contrast` exemption is needed. An earlier draft claimed one, on the grounds that a single
highlight carrying text on both sides would need a 4.5 × 4.5 = 20.25:1 span. That followed from
treating `--color-highlight` as one value; with `--color-highlight-ink` and `--color-highlight-paper`
as separate variables each carrying one text color, the product no longer applies and every row is
satisfiable within the 12.76:1 span derived above.

### style

Appearance of a box or of text. Applied by [button.css](./css/button.css) and [part.css](./css/part.css).

| Selector | Value | Description |
|-|-|-|
| `button`, `a`, `details > summary` | `fill` | filled with `--color-emphasis-ink`, transparent border (default for `button`) |
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
| `table` | `data-border` | `sectioned` (default) / `grid` / `booktabs`; rule style ([table.css](./css/table.css)) |
| `table` | `data-stripe`, `data-selectable` | boolean; zebra striping, row selection ([table.css](./css/table.css)) |
| `button` (step) | `data-action` | `increment` / `decrement` ([step.css](./css/step.css)) |