# Footnote

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