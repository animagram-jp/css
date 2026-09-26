// This file includes untranslated text (ja).

# Contributing

## Development rule

- Follow [ORG_CONTRIBUTING.md](./ORG_CONTRIBUTING.md)

If "ORG_CONTRIBUTING.md" does not exist in the repository root of your working environment, download it by executing the following.

```bash
curl -fsSL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/animagram-jp/.github/contents/.github/CONTRIBUTING.md?ref=main" -o "ORG_CONTRIBUTING.md"
```

- CSSスクリプト内コメントによる仕切り線の形式は `/* === size === */`、または`/* --- size --- */`とする。セレクタ形式では無く、単語形式に統一すること。
- CSSセレクターは、複数記述時は:where()を用い、:whereの内部では:is()を用いること。
- 必須でない*セレクタは記述を省略する。
- 各CSSファイルの冒頭に、想定するhtml要素をUsageとして記すこと。スタイリングに必要なタグ・属性以外は記述しないこと。
- base.css以外の各ファイルで、個別の中間変数を定義してはならない。
- Javascriptのクォートは"を優先して使用すること。
- _sign.css: sign・facetの疑似要素は、高さを--{size}-box-heightとする仮想のカンバスの重心に対して配置する。facet要素は、この仮想が想定するtext(--{size}-line-heightに従う)と水平方向で人間の視覚に合わせて光学調整をrem単位で行う。本体をrelative, 疑似要素をabsoluteにすると、border内側左上が相対原点(0,0)に取られる。_signでは、inline方向はdata-inline-align="start|end|center"バリアント別にinset-inline-{start|end}: 0を指定して配置し、block方向は({size}-line-height - {size}-box-height)までを許容して配置する。これにより、`button[data-facet="..."]`(デフォルトのsurround styleに従う)と、`label[surround=outline] > button[data-sign-style="inline"][data-facet="..."]`が同じサイズのsignを表示する。左右方向には正方形を課さず、それぞれのsignに必要な最低限の幅を確保する。すべてのsign・facetはdata-inline-align="start|end|center"の3値と、無指定時のフォールバック値を持つ。無指定時のフォールバックは、テキストと同居しない単独記号(hatch/reload/sync/visible等)はcenter、テキストや他要素と同居する記号(chevron/rule/copy等)はそのsignの慣用位置(chevronはend)とする。中央揃え(center・無指定含む)は疑似要素のmargin-inlineをauto、start/endは要素本体のpadding-inline-(start/end)と疑似要素側のinset-inline-{start/end}で、ユーザーランドから増方向に調整可能とする。単一の疑似要素しか使わないsign・facetは、data-inline-alignがstartの時は::before、end/centerの時は::afterを使う。DOM生成順で::afterは::beforeや本来のコンテンツより後に生成されるため、重畳時は::afterが手前に描画される既定のスタッキング順序に従う(centerは他要素と被った際に手前に出るべきという判断、endはstartとの対比としてafter側に統一)。

---

## TODO

- input css inline scroll bar 確実に出したい

---

## See

- [README.md](./README.md)
- css common files: [README.md#dependency-layers](./README.md#dependency-layers)
- [InterfaceDesign.md](./reference/InterfaceDesign.md)

## Commands

```bash
# Audit by IBM Equal Access engine (WCAG 2.2 A+AA) with 6 color schemes 
docker run -d --name accessibility-audit -v .:/work -v "$HOME/.cache/ms-playwright":/pw \
  -e PLAYWRIGHT_BROWSERS_PATH=/pw -w /work/reference node:lts-slim tail -f /dev/null
docker exec accessibility-audit bash -lc "npm ci && npx --yes playwright@\$(node -p \"require('playwright-core/package.json').version\") install --with-deps --only-shell chromium"
docker exec accessibility-audit npm run audit

# Validate ./css against the CSS syntax definitions
docker exec accessibility-audit npm run validate
```

---

## References

- [CUDO: Color Universal Design Recommended Color Set ver.3](https://cudo.jp/wp-content/uploads/2016/07/CUD%E6%8E%A8%E5%A5%A8%E9%85%8D%E8%89%B2%E3%82%BB%E3%83%83%E3%83%88%E3%82%AC%E3%82%A4%E3%83%89%E3%83%96%E3%83%83%E3%82%AF.pdf)
- JIS C 0447:1997 (IEC60447:1993) Man-machine-interface (MMI) - Actuating principles
- XForms 1.1, W3C Recommendation 20 October 2009
- [Kelp CSS: Repository](https://github.com/cferdinandi/kelp)
- [Pico CSS: Repository](https://github.com/picocss/pico)
- [Gov UK Design System: Repository](https://github.com/alphagov/govuk-frontend)
- [U.S. Web Design System (USWDS): Repository](https://github.com/uswds/uswds)
- [Ant Design: Repository](https://github.com/ant-design/ant-design)
- [ARIA Authoring Practices Guide (APG): Repository](https://github.com/w3c/aria-practices)
- [React Suite: InlineEdit](https://www.rsuitejs.com/components/inline-edit/)
- [shadcn Astro Track Landing Page (Free): Repository](https://github.com/shadcnstudio/shadcn-astro-track-landing-page-free)
- [catnose99: use-chat-submit](https://github.com/catnose99/use-chat-submit)