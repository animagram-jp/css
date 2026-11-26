[![CI](https://github.com/animagram-jp/css/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/animagram-jp/css/actions/workflows/ci.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/animagram-jp/css/badge)](https://scorecard.dev/viewer/?uri=github.com/animagram-jp/css)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/16852/badge)](https://www.bestpractices.dev/projects/16852)
[![OpenSSF Baseline](https://www.bestpractices.dev/projects/16852/baseline)](https://www.bestpractices.dev/projects/16852)

Universal Design (variants included) system and CSS implementations.

- Requires only semantic and structural HTML tags and a minimum of anonymous elements.
- Render correctly without JS.

# Browser support

Rendering requires Baseline 2024 features: `@layer`, `:has()`, `light-dark()`, `color-mix()`, relative color syntax, popover, `:user-invalid` and `round()`.

| Browser | Minimum |
|-|-|
| Chrome, Edge | 125 |
| Firefox | 128 |
| Safari | 18 |

`field-sizing`, `text-wrap: pretty`, `:open`, `position-area` and `position-try-fallbacks` are progressive enhancements and fall back without layout breakage.

# Layer structure

[import.css](./css/import.css) declares the `@layer` order. Its `dependency` comments name the layers each layer requires before it.

Use the library in either way:

- Link `animagram_css.css` attached to each [release](https://github.com/animagram-jp/css/releases). It declares the `@layer` order first and contains every layer.
- Link the files individually, and declare the `@layer` order of import.css yourself. Include the layers named in each `dependency` comment of the layers you use.

Common layer files are as follows:

1. [reset.css(@layer css.reset)](./css/reset.css): 1st layer to unset all.
2. [base.css(@layer css.base)](./css/base.css): 2nd layer defining defaults of all custom parameters.
3. [data_style.css(@layer css.data_style)](./css/data_style.css): 3rd layer defining data-surround and data-style attributes.
4. [data_size.css(@layer css.data_size)](./css/data_size.css): 4th layer defining data-size attribute.
5. [data_sign.css(@layer css.data_sign)](./css/data_sign.css): 5th layer defining data-sign and data-facet attributes.
6. [data_union.css(@layer css.data_union)](./css/data_union.css): 6th layer defining data-union attribute: removes the gap between adjacent controls and squares their shared corners.

# Color

Custom properties are defined in [base.css](./css/base.css).
Override the `--color-*` properties on any scope to restyle in use.

| Category | Name | Meaning |
|-|-|-|
| channel | `--rgb-accent-red` | Default channel for `--color-error`. |
| | `--rgb-accent-yellow` | Default channel for `--color-highlight-*`. |
| | `--rgb-accent-green` | Default channel for `--color-success`. |
| | `--rgb-accent-purple` | Default channel for `--color-emphasis-*` and `--color-visited`. |
| global parameter | `--color-ink` | Default text color in the scheme. |
| | `--color-paper` | Default background color in the scheme. |
| | `--color-ink-mix` | Default mixed color to contrast with paper. |
| | `--color-paper-mix` | Default mixed color to contrast with ink. |
| | `--color-error` | Default color for `:user-invalid`. |
| | `--color-highlight-ink` | Default for `::selection` to contrast with paper. |
| | `--color-highlight-paper` | Default for `::selection` to contrast with ink. |
| | `--color-success` | Default color for success/true states to contrast with paper. |
| | `--color-visited` | Default `a:visited` color to contrast with paper. |
| | `--color-emphasis-ink` | Emphasis color to contrast with paper. |
| | `--color-emphasis-ink-mix` | Emphasis mixed color to contrast with paper. |
| | `--color-focus` | Default color for focus outline. |
| scoped parameter | `color` | Text color in the scope. |
| | `background-color` | Fill color in the scope. |
| | `border-color` | Border color in the scope. |
| | `outline-color` | Focus color in the scope. |

## Scoped colors

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

- :focus outline's requirement is equal to border and it is not necessary to differ from border.
- :hover does not have any color difference in basic styles.
- Empty cells mean as above.
- `:disabled` includes `[aria-disabled="true"]`, `:user-invalid` includes `[aria-invalid="true"]`, and `:active` includes `[aria-pressed="true"]`.
- `data-surround="transparent"` draws the border column with outline.

| Style | Attribute | text | highlight | fill | border | backdrop |
|-|-|-|-|-|-|-|
| - | - | color-ink | - | color-paper(-mix) | color-ink | color-paper |
|  | `::selection` | color-paper | color-highlight-ink | color-paper(-mix) | | |
| `data-surround="transparent"` | | color-ink | - | transparent | - | |
| | `:visited` | color-visited | - | | | |
| | `:disabled` | color-ink-mix | - | | | |
| | `:user-invalid` | color-ink | - | | color-error | |
| | `:active` | color-ink | - | | color-emphasis-ink | |
| `input[type="text"]` | | color-ink | - | color-paper | color-ink-mix | |
| | `::selection` | color-paper | color-highlight-ink | | | |
| | `:disabled` | color-ink-mix | - | | | |
| | `:disabled::selection` | color-paper | color-highlight-ink | | | |
| | `:user-invalid` | color-ink | - | | color-error | |
| | `:user-invalid::selection` | color-paper | color-highlight-ink | | | |
| `data-surround="fill"` | | color-paper | - | color-emphasis-ink | transparent | |
| | `::selection` | color-ink | color-highlight-paper | color-emphasis-ink | | |
| | `:disabled` | color-paper | - | color-ink-mix | | |
| | `:disabled::selection` | color-ink | color-highlight-paper | color-ink-mix | | |
| | `:user-invalid` | color-paper | - | color-emphasis-ink | color-error | |
| | `:active` | color-paper | - | color-emphasis-ink-mix | | |
| | `:active::selection` | color-ink | color-highlight-paper | color-emphasis-ink-mix | | |
| `data-surround="outline"` | | color-emphasis-ink | - | color-paper | color-emphasis-ink | |
| | `::selection` | color-paper | color-highlight-ink | | | |
| | `:disabled` | color-ink-mix | - | | color-ink-mix | |
| | `:disabled::selection` | color-paper | color-highlight-ink | | | |
| | `:user-invalid` | color-emphasis-ink | - | | color-error | |
| | `:active` | color-emphasis-ink-mix | - | | color-emphasis-ink-mix | |
| | `:active::selection` | color-paper | color-highlight-ink | | | |
| | `:visited` | color-visited | - | | color-visited | |
| `data-style="underline"` | | color-{emphasis}-ink | - | color-paper | - | |
| | `::selection` | color-paper | color-highlight-ink | | | |
| | `:disabled` | color-ink-mix | - | | | |
| | `:disabled::selection` | color-paper | color-highlight-ink | | | |
| | `:active` | color-emphasis-ink-mix | - | | | |
| | `:active::selection` | color-paper | color-highlight-ink | | | |
| | `:visited` | color-visited | - | | | |
| `input[type="checkbox"][role="switch"]` | | - | - | color-ink-mix | color-ink-mix | color-paper |
| | `:user-invalid` | - | - | | color-error | |
| | `:disabled` | - | - | | color-ink-mix | |
| | `:checked` | - | - | color-success | color-ink | |
| | `::after` | color-ink | - | color-paper | - | color-ink-mix |
| | `:checked::after` | | | | | color-success |
| | `:disabled::after` | color-ink-mix | - | | | color-ink-mix |
| | `:checked:disabled::after` | | | | | color-success |

### Contrast requirements

Requirements come from layer adjacency (text↔highlight↔fill, fill↔border↔backdrop) in the style table above.

The required ratio depends on the scheme.

| Scheme | text | non-text |
|-|-|-|
| `*-more-contrast` | 7:1 (AAA 1.4.6) | 3:1 (AA 1.4.11) |
| light, dark | 4.5:1 (AA 1.4.3) | 3:1 (AA 1.4.11) |
| `*-less-contrast` | 4.5:1 (AA 1.4.3) | 3:1 (AA 1.4.11) |

- Signs (icons, marks, carets) are non-text.
- A pair of two `-mix` colors has no requirement.
- Disabled states (`:disabled`, `[aria-disabled="true"]`) have no requirement.
- The `toggle` (`input[type="checkbox"][role="switch"]`) has no error state: its `:user-invalid` and `[aria-invalid="true"]` styles have no requirement. Use a checkbox for a value that must be checked.
- Each row below holds in every scheme at the ratio above.

Emphasis colors are the injection point for a brand or per-scope users' color.
The library default is the CUD accent purple.
`color-success` is a non-text fill: it carries no text.

| Property | text | non-text |
|-|-|-|
| color-ink | color-paper, color-paper-mix | color-paper, color-paper-mix |
| color-ink-mix | — | color-paper |
| color-emphasis-ink | color-paper | color-paper, color-highlight-paper |
| color-emphasis-ink-mix | color-paper | color-paper, color-highlight-paper |
| color-highlight-ink | color-paper | color-paper, color-paper-mix |
| color-highlight-paper | color-ink | — |
| color-error | — | color-paper |
| color-success | — | color-paper, color-ink |
| color-visited | color-paper | color-paper |

# Size

- Default width is left unset (auto / content-driven) everywhere.
- Default margin width is 0.
- Padding-block is derived from `--{size}-box-height` and `--{size}-line-height` and only when border is not none, `--{size}-border-width`.
- `--pt` and `--mm` are 1pt and 1mm in print, where the `html` font size is 14pt.

| Scoped parameter | Meaning |
|-|-|
| `--{xs/sm/md/lg/xl/2xl}-border-radius` | Border radius for the scope. |
| `--{xs/sm/md/lg/xl/2xl}-border-width` | Border width for the scope. |
| `--{xs/sm/md/lg/xl/2xl}-box-height` | Block height (border top to bottom) when with 1 line content. |
| `--{xs/sm/md/lg/xl/2xl}-font-size` | Font size for the scope. |
| `--{xs/sm/md/lg/xl/2xl}-letter-spacing` | Letter spacing for the scope. |
| `--{xs/sm/md/lg/xl/2xl}-line-height` | Line height for the scope. |

| `data-size`   | heading | box-height | font-size | letter-spacing | line-height |
|-|-|-|-|-|-|
| `xs`          | - | 1.75rem  | 0.85rem | 0.02rem | 1.5rem   |
| `sm`          | - | 2.5rem  | 0.85rem | 0.02rem | 1.5rem   |
| `md`(default) | h4~h6 | 3rem | 1rem    | 0       | 1.5rem   |
| `lg`          | h3 | 3.5rem  | 1.15rem | 0       | 1.725rem |
| `xl`          | h2 | 4rem    | 1.5rem  | 0       | 2.25rem  |
| `2xl`         | h1 | 4.75rem | 2rem    | 0       | 3rem     |

# Other custom attributes

## data-axis

Direction in which a component lays its parts out. Both `block` and `inline` are accepted on every component below; omitting the attribute is the same as writing the default.

| Selector | Default | Applied by |
|-|-|-|
| `hgroup` | `block` | [heading.css](./css/heading.css) |
| `fieldset` (with `label > input[type="radio"]` or `label > input[type="checkbox"]`) | `block` | [input.css](./css/input.css) |
| `label` | `inline` | [toggle.css](./css/toggle.css) |

## data-union

- `inline`: a horizontal row.
- `block`: a vertical stack. Every member is stretched to the same inline size.

| Selector | Value | Applied by |
|-|-|-|
| `*` | `inline`, `block` | [data_union.css](./css/data_union.css) |
| `*` (with `label > input[type="radio"]` or `label > input[type="checkbox"]`) | `inline`, `block` | [input.css](./css/input.css), [radio.css](./css/radio.css), [checkbox.css](./css/checkbox.css), [data_style.css](./css/data_style.css), [data_size.css](./css/data_size.css) |

`search` and `form[role="search"]` are joined the same way as `inline` without `data-union`.

A radio or checkbox member is its `label`, with the `input` transparent over it. Checkboxes with `role="switch"`, `data-sign` or `data-facet`, and the `:indeterminate` state, are not supported.

Without `data-union`, `[role="toolbar"]`, `[role="radiogroup"]` and `[role="tablist"]` follow `aria-orientation` (horizontal by default).

## data-step

Layout for the pair of controls a spinbutton carries. Applied to the `span` wrapping the pair, not the `label` itself.

| Selector | Value | Applied by |
|-|-|-|
| `span` | `block` | [step.css](./css/step.css) |

## data-cycle

One control that steps through the radios of a group in order, back to the first after the last. Applied to the `span` wrapping the radios. Each click checks the radio after the checked one. Only the checked radio is shown, or the last one while none is checked. Each radio draws its own state, such as with `data-sign`.

| Selector | Value | Applied by |
|-|-|-|
| `span` | (none) | [cycle.css](./css/cycle.css) |

In a `th`, the three radios are descending, ascending and unsorted, drawn as ▼, ▲ and a hollow ▽ in `--color-ink-mix`. The radios of every column share one `name`, and an unchecked column shows unsorted.

## Tag unique attributes

| Selector | Attribute | Description |
|-|-|-|
| `table` | `data-border` | `sectioned` (default) / `grid` / `booktabs`; rule style ([table.css](./css/table.css)) |
| `table` | `data-stripe`, `data-selectable` | boolean; zebra striping, row selection ([table.css](./css/table.css)) |
| `table` | `data-print` | boolean; grid layout whose rules take no layout space, for print forms. Set `grid-template-columns` in use ([table.css](./css/table.css)) |
| `html` | `data-print` | boolean; print document. Border widths in `--pt`, rounded to device pixels on screen; `body` previewed with `--page-margin-block` on screen ([base.css](./css/base.css)) |
