---
lang: ja
translations: none
---

# Rule

- Follow [ORG_CONTRIBUTING.md](./ORG_CONTRIBUTING.md)

If "ORG_CONTRIBUTING.md" does not exist in the repository root of your working environment, download it by executing the following.

```bash
curl -fsSL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/animagram-jp/.github/contents/.github/CONTRIBUTING.md?ref=main" -o "ORG_CONTRIBUTING.md"
```

- All CSS properties MUST be described in order of dependencies, and then, alphabetical.
- CSSのセレクターは、トップレベルの列挙に:where()を用い、:whereの内では:is()を用いる。
- 必須でない*セレクタは記述を省略する。
- `css/`の各ファイル冒頭に、想定するhtml要素を`/* Usage: */`として記す。スタイリングに必要なタグ・属性以外は記述しない。
- base.css以外の各ファイルで、個別の中間変数を定義しない。

## prefers-reduced-motion

自動モーションは必ず`@media (prefers-reduced-motion: no-preference)`で明示オプションとする。

## prefers-contrast

`@media (prefers-contrast)`(値なし)は、装飾グラデーション・背景画像・box-shadowを単色やsolid borderに置き換えるなど、視覚的な単純化の共通段階に留める。
`@media (prefers-contrast: more | less) and (forced-colors: none)`と書く。

## forced-colors

[W3C: CSS Color Adjustment Module Level 1](https://www.w3.org/TR/css-color-adjust-1/)
forced-colorsで失われる要素は、使用しない。色要素で伝える情報は、形またはテキストを常に併用する。

以下が強制的にSystem Color(CSS Color Level 4)またはnone, autoで上書きされる。

```
accent-color: auto;, background-color, border-color, caret-color, color, flood-color, fill, lighting-color, outline-color, rule-color, scrollbar-color: auto;, stop-color, stroke, text-decoration-color, text-emphasis-color, "box-shadow and text-shadow compute to none", "background-image computes to none"(但し、url()は例外的に除かれる), "color-scheme computes to light dark"
```

| System color | Use |
|-|-|
| `Canvas` | ページ/コンテンツの背景 |
| `CanvasText` | 本文の文字色 |
| `LinkText` | 未訪問リンク |
| `VisitedText` | 訪問済みリンク |
| `ActiveText` | アクティブ(押下中)リンク |
| `ButtonFace` | ボタンの背景 |
| `ButtonText` | ボタンの文字色 |
| `ButtonBorder` | ボタンの枠線色 |
| `Field` | テキスト入力欄などの背景 |
| `FieldText` | 入力欄の文字色 |
| `Mark` | `<mark>`相当のハイライト背景 |
| `MarkText` | `<mark>`相当のハイライト文字色 |
| `Highlight` | テキスト選択時などの背景(反転色) |
| `HighlightText` | 選択された部分の文字色 |
| `SelectedItem` | 選択された項目の背景 |
| `SelectedItemText` | 選択された項目の文字色 |
| `GrayText` | 無効化(disabled)要素の文字色 |
| `AccentColor` | チェックボックス・ラジオなどのアクセント色 |
| `AccentColorText` | `AccentColor`上に乗る文字色 |

## data-sign

data-signとdata-facetの疑似要素は、高さを--{size}-box-heightとする仮想のカンバスの重心に対して配置する。
facet要素は、この仮想が想定するtext(--{size}-line-heightに従う)と水平方向で人間の視覚に合わせて光学調整をrem単位で行う。本体をrelative, 疑似要素をabsoluteにすると、border内側左上が相対原点(0,0)に取られる。
data_signでは、inline方向はdata-inline-align="start|end|center"バリアント別にinset-inline-{start|end}: 0を指定して配置し、block方向は({size}-line-height - {size}-box-height)までを許容して配置する。これにより、`button[data-facet="..."]`(デフォルトのsurround styleに従う)と、`label[data-surround="outline"] > button[data-sign-style="inline"][data-facet="..."]`が同じサイズのsignを表示する。左右方向には正方形を課さず、それぞれのsignに必要な最低限の幅を確保する。すべてのsign・facetはdata-inline-align="start|end|center"の3値と、無指定時のフォールバック値を持つ。無指定時のフォールバックは、テキストと同居しない単独記号(hatch/reload/sync/visible等)はcenter、テキストや他要素と同居する記号(chevron/rule/copy等)はそのsignの慣用位置(chevronはend)とする。中央揃え(center・無指定含む)は疑似要素のmargin-inlineをauto、start/endは要素本体のpadding-inline-(start/end)と疑似要素側のinset-inline-{start/end}で、ユーザーランドから増方向に調整可能とする。単一の疑似要素しか使わないsign・facetは、data-inline-alignがstartの時は::before、end/centerの時は::afterを使う。DOM生成順で::afterは::beforeや本来のコンテンツより後に生成されるため、重畳時は::afterが手前に描画される既定のスタッキング順序に従う。

# Required reading

- [README.md](./README.md)
- Common layers: `./css/{reset, base, data_*}.css`
- [InterfaceDesign.md](./reference/InterfaceDesign.md)

# Commands

```bash
# Test by IBM Equal Access engine (WCAG 2.2 A+AA) with 6 color schemes
docker run -d --name css-test -v .:/work -v "$HOME/.cache/ms-playwright":/pw \
  -e PLAYWRIGHT_BROWSERS_PATH=/pw -w /work/reference node:lts-slim tail -f /dev/null
docker exec css-test bash -lc "npm ci && npm run setup"
docker exec css-test npm run test

# Validate ./css against the CSS syntax definitions
docker exec css-test npm run validate

# Solve the emphasis palette for a color (default: accent-purple)
docker run --rm -v "$PWD/reference":/w -w /w node:lts-slim node solve_palette.js [RRGGBB]
```

# References

- [Ant Design: Repository](https://github.com/ant-design/ant-design)
- [ARIA Authoring Practices Guide (APG): pattern](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [ARIA APG: Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [CUDO: Color Universal Design Recommended Color Set ver.3](https://cudo.jp/wp-content/uploads/2016/07/CUD%E6%8E%A8%E5%A5%A8%E9%85%8D%E8%89%B2%E3%82%BB%E3%83%83%E3%83%88%E3%82%AC%E3%82%A4%E3%83%89%E3%83%96%E3%83%83%E3%82%AF.pdf)
- [Gov UK Design System: Repository](https://github.com/alphagov/govuk-frontend)
- [IBM SAA CUA: Basic Interface Design Guide (SC26-4583-00, 1989)](https://archive.org/details/ibm-saa-cua-basic-interface-design-guide)
- JIS C 0447:1997 (IEC60447:1993) Man-machine-interface (MMI) - Actuating principles
- [Kelp CSS: Repository](https://github.com/cferdinandi/kelp)
- [Microsoft: Shortcut Keys](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/bb246441(v=vs.85)?redirectedfrom=MSDN)
- [Microsoft: Keyboard Interface Summary](https://learn.microsoft.com/en-us/previous-versions/ms997427(v=msdn.10))
- [Pico CSS: Repository](https://github.com/picocss/pico)
- [React Suite: InlineEdit](https://www.rsuitejs.com/components/inline-edit/)
- [U.S. Web Design System (USWDS): Repository](https://github.com/uswds/uswds)
- [XForms 1.1, W3C Recommendation 20 October 2009](https://www.w3.org/TR/2009/REC-xforms-20091020/)
