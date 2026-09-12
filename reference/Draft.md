# Draft

```css
/*
    Remove all the styles of the "User-Agent-Stylesheet", except for the 'display' property
    - The "symbol *" part is to solve Firefox SVG sprite bug
    - The "html" element is excluded, otherwise a bug in Chrome breaks the CSS hyphens property (https://github.com/elad2412/the-new-css-reset/issues/36)
 */
*:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *)) {
    all: unset;
    display: revert;
}

/* per tailwind-preflight.css:259-273 */
:where(select:is([multiple], [size])) optgroup {
    font-weight: bolder;
}
:where(select:is([multiple], [size])) optgroup option {
    padding-inline-start: 20px;
}

/* monospace font, block and copy button */
pre, pre > code, pre > samp {}

/* kbd: [data-style="outline"], [data-style="fill"] */
kbd {}

/* card: [data-style="outline"], [data-style="fill"] */
article > header, footer {}


/* Remove list styles (bullets/numbers). */
ol, ul, menu, summary {
    list-style: none;
}

/* === aria-orientation === */
*:where(menu):where(
    [aria-orientation="vertical"],
    :not([aria-orientation]),
) {}
*:where(menu)[aria-orientation="horizontal"] {}

/* Reference: https://github.com/yuto-hasegawa/sashimi-ui/blob/main/src/css/key-value.css */
dl {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 0.5rem;
    row-gap: 0.5rem;
    list-style: none;
    overflow-wrap: anywhere;
}
dl dd {
    margin: 0;
    justify-self: end;
}
:is(ul, ol) {
    --gap: 0;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 2rem;
    list-style-type: revert;
}
:is(ul, ol) > li {
    padding-top: var(--gap);
    padding-bottom: var(--gap);
}
ol {
    display: grid;
    grid-template-columns: minmax(2rem, auto) 1fr;
    padding-left: 0;
    list-style-type: none;
}
ol > li,
ol > li > a {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: inherit;
    align-items: baseline;
}
ol > li > a > span {
    text-decoration-thickness: inherit;
}
ol > li > :not(a, span) {
    grid-column: 2;
}
@supports (grid-template-columns: subgrid) {
    ol > li,
    ol > li > a {
        grid-template-columns: subgrid;
    }
}
:is(ul, ol) :is(ul, ol) {
    margin-top: var(--gap);
    margin-bottom: calc(-1 * var(--gap));
}

@media (prefers-reduced-motion: no-preference) {
    [aria-busy="true"] {

    }
}

/* === cite === */
cite {
    font-style: italic;
}
:lang(ja), :lang(zh), :lang(ko) {
    cite {
        font-style: normal;
    }
}

/*  Usage:

    <figure data-style="rule-indent">
        <blockquote>Block contents</blockquote>
        <figcaption>Author. YYYY. 
            <cite>Title</cite>. Publisher, Location.</figcaption></figure> 
*/

/* footnote 

1個目: *   asterisk
2個目: †   dagger
3個目: ‡   double dagger
4個目: §   section sign
5個目: ‖   parallel
6個目: ¶   pilcrow
7個目: **
8個目: ††
9個目: ‡‡

Usage:
    <sup></sup>
    <sub></sub>  
*/
sub, sup {
  font-size: smaller;
  line-height: normal;
}
sub { vertical-align: sub; }
sup { vertical-align: super; }

/* === focus === */

/* フォーカスのエスカレーションが必要なフォーム要素などに追加 */
*:focus-visible {
    outline: none;
}
*:has(*:focus-visible) {
    outline-color: var(--color-focus);
}
```

## Reference

- [GOV.UK Design System: Notification banner](https://design-system.service.gov.uk/components/notification-banner/)
- [GOV.UK Design System: Panel](https://design-system.service.gov.uk/components/panel/)

- 信号部品
    - Badge: span[data-style]
    - Deletion and addition: div > (del > p, ins > p) (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ins)
    - Description list: dl > (dt, dd)
        - [GOV.UK Design System: Summary list](https://design-system.service.gov.uk/components/summary-list/)
        - Task list: https://design-system.service.gov.uk/components/task-list/
    - Figure: figure > (figcaption > cite, img/table/blockquote/div)
        - Blockquote: figure > (blockquote > p, figcaption > cite)
    - Error message: https://design-system.service.gov.uk/components/error-message/
    - Heading: hgroup > (h1/h2/h3/h4/h5/h6, p)
    - Meter: label > meter
    - Progress indicator:
        - Loading: *[aria-busy="true"] [Pico: Loading](https://picocss.com/docs/loading)
    - Table: table > (caption, (thead, tbody, tfoot) > tr > (th, td))
    - Tabs: ul > li, div
    - Input count: p[role="status"][aria-live="polite"][aria-atomic="true"] > (samp, span)
    - Icon: image [Kelp CSS: Avatar](https://kelpui.com/docs/components/avatar/)

- P2(コマンド構成)部品
    - Checkbox: fieldset > (legend, label > input[type="checkbox"])
    - Color picker
    - Coordinate picker: label > input[type=image]
    - Dropdown:
        - details > (summary, ul > li) [Pico: Dropdown](https://picocss.com/docs/dropdown)
        - label > select > optgroup > option
    - Email: label > input[type="email"]
    - File picker: label > input[type=file]
    - Numeric: label > (button[type="button"], input[type="text"][inputmode="numeric"], button[type="button"])
    - Password:
        - label > input[type="password"][autocomplete="current-password"], label > input[type="checkbox"]
        - fieldset > (legend, label > input[type="password"][autocomplete="new-password"], label > input[type="checkbox"], label > input[type="password"][autocomplete="new-password"], label > input[type="checkbox"])
    - Radio: fieldset > (legend, label > input[type="radio"])
    - Range: label > input[type=range]
    - Searchbox: label > input[type=search], [role="search"]
    - Tel: label > input[type="tel"]
    - Temporal: fieldset[role=group] > (legend, (label > input[type=text][inputmode=numeric]))
        - [autocomplete="bday-year", "bday-month", "bday-day"]
    - Text: label > input[type="text"], [readonly], [disabled], [aria-invalid], ::placeholder
    - Textarea: label > textarea
    - Url: label > input[type="url"]

- P1~P3(対象選択~執行)パターン
        - Command button: [disabled]
        - label > button[type="button"], a[role=button]
        - Back link, Link: a, button[role="link"]
          - Link copy button: chain(🔗) 
          - Anchor link: [Kelp: Heading anchors](https://kelpui.com/docs/components/heading-anchors)
        - Breadcrumb: nav > ol > li > a
        - Pagenation: nav[aria-label="Pagination"] > (a[rel=prev] > span, ul > li > a[aria-current="page"], a[rel=next]) [GOV.UK Design System: Pagenation](https://design-system.service.gov.uk/components/pagination/)
    - Cookie agreement: https://design-system.service.gov.uk/components/cookie-banner/
    - Disclosure: details > (summary, div)
    - Form: form, fieldset > legend, submit button[type="submit"], button[type="reset"]
        - Hint
        - Error summary: div[role="alert"] > p, (ul > li) (https://design-system.service.gov.uk/components/error-summary/)
    - Toggle button: label > input[type="checkbox"]
    - Tooltip: *:hover, *:focus

- その他
    - header, footer
    - section: 汎用ブロック要素
    - article: 汎用ブロック要素(独立して意味の通る情報)
    - dialog:  汎用ポップアップ要素, ::backdrop, backdrop-filter
    - label > output
    - body > header, main, aside, body > footer
    - address
    - nav, search, form: セマンティクスラッパー
    - hr
    - cite
    - q
    - ruby > rt
    - em, strong
    - small: 免責事項、著作権表示、利用規約への言及
    - sub
    - sup
    - dfn
    - abbr
    - bdi
    - time[datetime]
    - Media: img, iframe, object, video, audio