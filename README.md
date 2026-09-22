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

Color custom properties are defined in [base.css](./css/base.css).
Color custom styles are defined in [data_style.css](./css/data_style.css).
Override the `--color-*` properties on any scope to restyle.

| Category | Name | Meaning |
|-|-|-|
| channel | `--rgb-accent-red` | Default channel for `--color-error`. |
| | `--rgb-accent-yellow` | Default color for `--color-highlight-paper`. |
| | `--rgb-accent-green` | Default background for `--color-success`. |
| | `--rgb-accent-purple` | Default channel for `--color-emphasis-*` and `--color-visited`. |
| global parameter | `--color-ink` | Default text color in the scheme. |
| | `--color-paper` | Default background color in the scheme. |
| | `--color-ink-mix` | Default mixed to contrast with paper. |
| | `--color-paper-mix` | Default mixed color to contrast with ink. |
| | `--color-error` | Default color for `:user-invalid`. |
| | `--color-highlight-ink` | Default for `::selection` to contrast with paper. |
| | `--color-highlight-paper` | Default for `::selection` to contrast with ink. |
| | `--color-success` | Default color for success/true states to contrast with ink. |
| | `--color-visited` | Default `a:visited` color to contrast with paper. |
| | `--color-emphasis-ink` | Emphasis color to contrast with paper. |
| | `--color-emphasis-ink-mix` | Emphasis mixed to contrast with paper. |
| | `--color-emphasis-paper` | Emphasis color contrast with ink. |
| scoped parameter | `color` | Text color in the scope. |
| | `background-color` | Fill color in the scope. |
| | `border-color` | Border color in the scope. |
| | `outline-color` | Focus color in the scope. |

Scoped colors:

```
┌ (backdrop) ────────┐
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
- :hover does not have any color difference in basic styles.
- Empty cells mean as above.

| Style | text | highlight | fill | border | backdrop | 
|-|-|-|-|-|-|
| - | color-ink | - | color-paper(-mix) | color-ink | color-paper |
| | color-ink | - | color-emphasis-paper | - | | 
| ::selection | color-paper | color-highlight-ink | color-paper(-mix) | | | 
| `data-surround="transparent"` | color-ink | - | transparent | - | |
| `data-surround="input"` | color-ink | - | color-paper | color-ink-mix | |
| input::selection | color-paper | color-highlight-ink | | | |
| input:disabled | color-ink-mix | - | | | |
| input:disabled::selection | color-paper | color-highlight-ink | | | |
| input:user-invalid | color-ink | - | | color-error | |
| input:user-invalid::selection | color-paper | color-highlight-ink | | | |
| `data-surround="fill"` | color-paper | - | color-emphasis-ink | transparent | |
| fill::selection | color-ink | color-highlight-paper | color-emphasis-ink | | |
| fill:disabled | color-paper | - | color-ink-mix | | |
| fill:disabled::selection | color-ink | color-highlight-paper | color-ink-mix | | |
| fill:active | color-paper | - | color-emphasis-ink-mix | | |
| fill:active::selection | color-ink | color-highlight-paper | color-emphasis-ink-mix | | |
| `data-surround="outline"` | color-emphasis-ink | - | color-paper | color-emphasis-ink | |
| outline::selection | color-emphasis-paper | color-highlight-ink | | | |
| outline:disabled | color-ink-mix | - | | color-ink-mix | |
| outline:disabled::selection | color-paper | color-highlight-ink | | | |
| outline:active | color-emphasis-ink | - | color-paper-mix | color-emphasis-ink-mix | |
| outline:active::selection | color-emphasis-paper | color-highlight-ink | | | |
| `data-style="underline"` | color-{emphasis}-ink | - | color-paper | - | |
| underline::selection | color-paper | color-highlight-ink | | | |
| underline:disabled | color-ink-mix | - | | | |
| underline:disabled::selection | color-paper | color-highlight-ink | | | |
| underline:active | color-emphasis-ink-mix | - | | | |
| underline:active::selection | color-paper | color-highlight-ink | | | |

### Contrast requirements

Requirements come from layer adjacency (text↔highlight↔fill, fill↔border↔backdrop) in the style table above. 

Layers alternate polarity outward from the backdrop — `-paper` → `-ink` → `-paper` → … — so each
layer contrasts with the one enclosing it. All 27 rows of the style table satisfy this.

Each row below holds per light or dark scheme.
Emphasis colors are the injection point for a brand or per-scope users' color.
The library default is the CUD accent purple. 

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
| color-visited | paper | — | — |

## Size

- Default width is left unset (auto / content-driven) everywhere.
- Default margin width is 0.
- Padding-block is derived from `--{size}-box-height` and  `--{size}-line-height` and only when border is not none, `--{size}-border-width`.

| Scoped parameter | Meaning |
|-|-|
| `--{xs/sm/md/lg/xl/2xl}-border-width` | Border radius for the scope. |
| `--{xs/sm/md/lg/xl/2xl}-border-width` | Border width for the scope. |
| `--{xs/sm/md/lg/xl/2xl}-box-height` | Block height (border top to bottom) when with 1 line content. |
| `--{xs/sm/md/lg/xl/2xl}-font-size` | Font size for the scope. |
| `--{xs/sm/md/lg/xl/2xl}-letter-spacing` | Letter spacing for the scope. |
| `--{xs/sm/md/lg/xl/2xl}-line-height` | Line height for the scope. |

| `data-size`   | heading | box-height | font-size | letter-spacing | line-height |
|-|-|-|-|-|-|
| `xs`          | - | 1.75rem  | 0.85rem | 0.02rem | 1.5rem   |
| `sm`          | - | | | | |
| `md`(default) | h4~h6 | 3rem | 1rem    | 0       | 1.5rem   |
| `lg`          | h3 | 3.5rem  | 1.15rem | 0       | 1.725rem |
| `xl`          | h2 | 4rem    | 1.5rem  | 0       | 2.25rem  |
| `2xl`         | h1 | 4.75rem | 2rem    | 0       | 3rem     |

## Other custom attributes

### data-axis

Direction in which a component lays its parts out. Each value below is opt-in; omitting the attribute keeps the component's own default arrangement.

| Selector | Value | Applied by |
|-|-|-|
| `hgroup` | `inline` | [heading.css](./css/heading.css) |
| `details` | `inline` | [button.css](./css/button.css) |
| `label` | `block` | [toggle.css](./css/toggle.css), [step.css](./css/step.css) |

### Tag unique attributes

| Selector | Attribute | Description |
|-|-|-|
| `table` | `data-border` | `sectioned` (default) / `grid` / `booktabs`; rule style ([table.css](./css/table.css)) |
| `table` | `data-stripe`, `data-selectable` | boolean; zebra striping, row selection ([table.css](./css/table.css)) |
| `button` | `data-action` | `increment` / `decrement` ([step.css](./css/step.css)) |
