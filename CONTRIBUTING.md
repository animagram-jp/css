// This file includes untranslated text (ja).

# Contrinbuting

- Follow [ORG_CONTRIBUTING.md](./ORG_CONTRIBUTING.md)

If "ORG_CONTRIBUTING.md" does not exist in the repository root of your working environment, download it by executing the following.

```bash
curl -fsSL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/animagram-jp/.github/contents/.github/CONTRIBUTING.md?ref=main" -o "ORG_CONTRIBUTING.md"
```

## Requirements


設計哲学:Boolean属性はHTML標準の真偽属性パターンに揃える
```html
コミット 447f963(#7 normalize boolean to none-value attribute)より

Before(値つきの文字列でtrue/falseを表現)
<div class="dads-file-upload" data-multiple="false">
  <div class="dads-file-upload__drop-area" data-dragover="false">...</div>
</div>
.dads-file-upload__drop-area[data-dragover="true"] { ... }
.dads-file-upload[data-multiple="false"] .dads-file-upload__file-marker { ... }
.dads-file-upload[data-multiple="true"] .dads-file-upload__file-marker { ... }

After(属性の有無だけでON/OFFを表現。disabledと同じ発想)
<div class="dads-file-upload">
  <div class="dads-file-upload__drop-area" dads-dragover>...</div>
</div>
.dads-file-upload__drop-area[dads-dragover] { ... }
.dads-file-upload:not([dads-multiple]) .dads-file-upload__file-marker { ... }
.dads-file-upload[dads-multiple] .dads-file-upload__file-marker { ... }
```

ポイント
- HTMLのネイティブなboolean属性(disabled, checked, requiredなど)は「あるかないか」だけで意味を持ち、値を取らない。この設計を独自属性にも一貫適用。
- ="true"/"false"という文字列比較をなくすことで、CSSセレクタが[attr] / :not([attr])のシンプルな存在チェックになる。
- JSからの操作もel.dataset.dragover = "true"ではなくel.toggleAttribute("dads-dragover")で済み、実装側の対称性も上がる。

---

設計哲学:BEM的な専用クラスより、HTML要素とネイティブ属性を活用する
```html
コミット 8e03a70(#1 simple class name in table.css)より

Before(要素の位置や状態ごとにBEM風の専用クラスを命名)
<table class="dads-table" data-row-stripe data-selectable>
  <thead>
    <tr><th class="dads-table__col-header dads-table__sort-header" aria-sort="ascending">
      Name
      <span class="dads-table__sort-buttons">
        <span class="dads-table__sort-upper"></span>
        <span class="dads-table__sort-lower"></span>
      </span>
    </th></tr>
  </thead>
  <tbody>
    <tr><th class="dads-table__row-header">Row 1</th></tr>
  </tbody>
</table>
.dads-table__col-header { ... }
.dads-table__row-header { ... }
.dads-table[data-row-stripe] { ... }
.dads-table[data-row-hover-highlight] { ... }
.dads-table__sort-header { ... }
.dads-table__sort-buttons { ... }
:is(.dads-table__sort-upper, .dads-table__sort-lower) { ... }

After(構造はセマンティックなHTML要素セレクタに任せ、クラスは再利用可能な最小単位だけに)
<table class="dads-table" dads-stripe dads-selectable>
  <thead>
    <tr><th dads-sort aria-sort="ascending">
      Name
      <span class="dads-sort">
        <span class="dads-sort-up"></span>
        <span class="dads-sort-down"></span>
      </span>
    </th></tr>
  </thead>
  <tbody>
    <tr><th>Row 1</th></tr>
  </tbody>
</table>
.dads-table thead th { ... }
.dads-table tbody th { ... }
.dads-table[dads-stripe] { ... }
.dads-table[dads-hover] { ... }
.dads-table th[dads-sort] { ... }
.dads-sort { ... }
:is(.dads-sort-up, .dads-sort-down) { ... }
```
---
```html
Before(セマンティクス通りにtype="number"を使う)
<span class="dads-input-number" dads-size="md">
  <button type="button">▼</button>
  <input type="number" min="0" placeholder="0">
  <button type="button">▲</button>
</span>

After(挙動を制御するためtype="text" inputmode="numeric"に切り替え、補助属性を追加)
<span class="dads-input-number" dads-size="md">
  <button type="button" aria-label="減らす">−</button>
  <input type="text" inputmode="numeric" min="0" placeholder="0">
  <button type="button" aria-label="増やす">+</button>
</span>
```
---

設計哲学:意味を持たないラッパー要素は置かず、DOMをフラットに保つ
```html
コミット 997422c(#9 del unused div in html)より

Before(グリッドの各セルを<div>でラップしてから中身を置く)
<div style="display: grid; grid-template-columns: repeat(5, auto); gap: 1rem; justify-content: start">
  <div><button class="dads-button" dads-size="lg" dads-type="fill">ボタン</button></div>
  <div><button class="dads-button" dads-size="lg" dads-type="fill" disabled>ボタン</button></div>
  <div><button class="dads-button" dads-size="md" dads-type="fill">ボタン</button></div>
  ...
</div>

After(グリッドの直接の子として要素自身を並べる。div一段が消える)
<div style="display: grid; grid-template-columns: repeat(5, auto); gap: 1rem; justify-content: start; align-items: center">
  <button class="dads-button" dads-size="lg" dads-type="fill">ボタン</button>
  <button class="dads-button" dads-size="lg" dads-type="fill" disabled>ボタン</button>
  <button class="dads-button" dads-size="md" dads-type="fill">ボタン</button>
  ...
</div>
```
ポイント
- <div><button>...</button></div>のdivはレイアウトにもセマンティクスにも寄与していない、CSS Gridのアイテムを作るためだけの容れ物。button自体が直接gridアイテムになれるので、この一段は不要。
- ラッパーを消したことで各ボタンの高さ・サイズが揃わなくなる可能性があるため、align-items: centerをgridコンテナに追加して補っている。単に消しただけでなく、消した結果生じる見た目のズレまで責任を持って調整している点が重要。
- 「構造上意味のある入れ子」と「実装の都合だけで生まれた入れ子」を区別し、後者は容赦なく削る。DOMが浅いほど、CSSセレクタも状態管理もシンプルになる、という一貫した考え方は前回までの属性・クラス設計の話ともつながる。
