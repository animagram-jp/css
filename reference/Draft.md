# Footnote

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

    /* list */

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

    /* [aria-orientation] todo */

    [aria-orientation="horizontal"] {}
    [aria-orientation="vertical"] {}

    /* code todo */

    code {

    }

    /* --- cite --- */

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
            <figcaption>Author. YYYY. <cite>Title</cite>. Publisher, Location.</figcaption></figure> */


/* data variant: inline editor with select option */

```html
<sup></sup>
<sub></sub>
```

```css
sub, sup {
  font-size: smaller;
  line-height: normal;
}

sub { vertical-align: sub; }
sup { vertical-align: super; }
```

```
1個目: *   asterisk
2個目: †   dagger
3個目: ‡   double dagger
4個目: §   section sign
5個目: ‖   parallel
6個目: ¶   pilcrow
7個目: **
8個目: ††
9個目: ‡‡
...
```

## focus-visible

/* component.cssに反映予定 */

/* フォーカスのエスカレーションが必要なフォーム要素などに追加 */
/* *:focus-visible {
    outline: none;
}
*:has(*:focus-visible) {
    outline-color: var(--color-focus);
} */