# Draft

```css
@layer css.table {

    /* === caption: heading start, nav end === */

    table > caption {
        display:    flow-root;
        text-align: start;
    }
    table > caption > *:where(hgroup, h1, h2, h3, h4, h5, h6) {
        float:  inline-start;
        margin: 0;
    }
    table > caption > nav {
        align-items: center;
        display:     flex;
        float:       inline-end;
        gap:         0.75rem;
    }
}

/* monospace font, block and copy button */
pre, pre > code, pre > samp {}

kbd {}

/* card: [data-surround="outline"], [data-surround="fill"] 
https://design-system.service.gov.uk/components/notification-banner/ 
https://design-system.service.gov.uk/components/panel/ */
article > header, footer {}

/* === aria-orientation === */
*:where(menu):where(
    [aria-orientation="vertical"],
    :not([aria-orientation]),
) {}
*:where(menu)[aria-orientation="horizontal"] {}

@media (prefers-reduced-motion: no-preference) {
    [aria-busy="true"] {

    }
}

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

/* フォーカスのエスカレーションが必要なフォーム要素などに追加 */
*:focus-visible {
    outline: none;
}
*:has(*:focus-visible) {
    outline-color: var(--color-focus);
}
```

- Deletion and addition: div > (del > p, ins > p) (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ins)
- Figure: figure > (figcaption > cite, img/table/blockquote/div)
    - Blockquote: figure > (blockquote > p, figcaption > cite)
- Media: img, iframe, object, video, audio
- Meter: label > meter
- aria-busy="true": [Pico: Loading](https://picocss.com/docs/loading)
- Table: table > (caption, (thead, tbody, tfoot) > tr > (th, td))
- Input count: p[role="status"][aria-live="polite"][aria-atomic="true"] > (samp, span)
- Color picker
- Coordinate picker: label > input[type=image]
- Email: label > input[type="email"]
- File picker: label > input[type=file]
- Tel: label > input[type="tel"]
- Temporal: fieldset[role=group] > (legend, (label > input[type=text][inputmode=numeric]))
    - [autocomplete="bday-year", "bday-month", "bday-day"]
- Url: label > input[type="url"]
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
    - Error message: https://design-system.service.gov.uk/components/error-message/
- label > output
- ruby > rt

## Release note & Page layout

```rust
mod page {
    pub enum Tab {
        ReleaseNote,
    }
    impl Tab {
        fn label(&self, language) -> static (&str, &str) {
            match (s, l) {
                (Self::ReleaseNote, Language::En(_)) => ("Release Notes", "See what’s new in each version.")
                (Self::ReleaseNote, Language::Ja) => ("リリースノート", "バージョンごとの変更点を確認")            
            }
        }
    }
    pub struct Version;
    impl Version {
        fn read() -> (str, TimeStamp) {
            value = 
            timestamp = TimeStamp
        }
        fn display() -> (&str, &str, language) {
            value,
            timestamp.display([Calendar::Year, Calendar::Day], lamguage)
        }
    }
}
```

```html
<header>

    <span id="header_span"></span> <!-- アイコン(あれば) -->

    <hgroup> <!-- 静的な文脈情報: 画面タイトル + サブタイトル (画面情報量に余裕があれば) + テナント名... -->
        <h1 id="header_hgroup_h1"></h1>
        <p id="header_hgroup_p-1"></p>
        <p id="header_hgroup_p-2"></p></hgroup>

    <nav role="tablist">
        <!-- ... -->
        <label data-surround="transparent">
            <span id="section-{n}_label-{n}_span"></span>
            <input id="section-{n}_label-{n}_input" type="radio" role="tab" name="tab" value="{n}" aria-controls="main_section-{n}"></label>
        <!-- ... -->
        </nav>

    <button id="header_button-{n}" type="button"></button> <!-- グルーバルな操作ボタンの配置場所 -->
    <button id="header_button-{n}" type="button"></button>

</header>

<main>

    <section id="main_section-{n}" role="tabpanel">
        <header>
            <hgroup>
                <h2 id="section-{n}_header_hgroup_h2"></h2>
                <p id="section-{n}_header_hgroup_p"></hgroup></header>
                
        <section id="section-{n}_section-{n}">
            <!-- ... -->
            <article>
                <hgroup data-axis="inline">
                    <h3><code>v{version}</code></h3>
                    <p>
                        <time></time> <!-- timeのattributeはサポートしない。 -->
                        <span>{summary}</span></p></hgroup>
                <ul>
                    <li>{detail}</li>
                    <!-- ... -->
                    </ul>
            </article>
            <!-- ... -->
        </section></section>
    
</main>
```
