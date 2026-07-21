# Contributing

- Follow [ORG_CONTRIBUTING.md](./ORG_CONTRIBUTING.md)

If "ORG_CONTRIBUTING.md" does not exist in the repository root of your working environment, download it by executing the following.

```bash
curl -fsSL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/animagram-jp/.github/contents/.github/CONTRIBUTING.md?ref=main" -o "ORG_CONTRIBUTING.md"
```

## Commands

```bash
docker run -d --name accessibility-audit \
  -v .:/work \
  -w /work \
  node:lts-bookworm-slim \
  tail -f /dev/null
docker exec accessibility-audit bash -lc "npx --yes playwright install --with-deps chromium && npm ci"

docker exec accessibility-audit node docs/audit.mjs
docker exec accessibility-audit chown -R "$(id -u):$(id -g)" docs
```


## 要件

本cssリポジトリは、元々UD対応汎用ライブラリとしての[デジタル庁ライブラリ](https://github.com/digital-go-jp/design-system-example-components-html)のクローンだったが、[主要使用先: appリポジトリ](https://github.com/animagram-jp/app)がWasmAppの発行するCommand(op, dom_id, arg1, arg2, ...)で全てのDOM操作を実現している都合、JS前提の状態管理や、無用なタグのネストを改める必要がある。また、UDでありつつ、一般汎用用途に耐えるべく、デザイン性やダークモードなどに対応する。

### これまでの作業方針例1~4

#### 例1: HTML標準パターンに揃える (コミット 447f963)

**Before(値つきの文字列でtrue/falseを表現)**

```html
<div class="dads-file-upload" data-multiple="false">
  <div class="dads-file-upload__drop-area" data-dragover="false">...</div>
</div>
```
```css
.dads-file-upload__drop-area[data-dragover="true"] { ... }
.dads-file-upload[data-multiple="false"] .dads-file-upload__file-marker { ... }
.dads-file-upload[data-multiple="true"] .dads-file-upload__file-marker { ... }
```

**After(属性の有無だけでON/OFFを表現)**

```html
<div class="dads-file-upload">
  <div class="dads-file-upload__drop-area" dads-dragover>...</div>
</div>
```
```css
.dads-file-upload__drop-area[dads-dragover] { ... }
.dads-file-upload:not([dads-multiple]) .dads-file-upload__file-marker { ... }
.dads-file-upload[dads-multiple] .dads-file-upload__file-marker { ... }
```

---

#### 例2: BEM記法の専用クラスを廃止し、HTML要素とネイティブ属性を活用する (コミット 8e03a70)

**Before(要素の位置や状態ごとにBEM記法クラスを命名)**

```html
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
```
```css
.dads-table__col-header { ... }
.dads-table__row-header { ... }
.dads-table[data-row-stripe] { ... }
.dads-table[data-row-hover-highlight] { ... }
.dads-table__sort-header { ... }
.dads-table__sort-buttons { ... }
:is(.dads-table__sort-upper, .dads-table__sort-lower) { ... }
```

**After(構造はセマンティックなHTML要素セレクタに任せ、クラスは再利用可能な最小単位だけに)**

```html
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
```
```css
.dads-table thead th { ... }
.dads-table tbody th { ... }
.dads-table[dads-stripe] { ... }
.dads-table[dads-hover] { ... }
.dads-table th[dads-sort] { ... }
.dads-sort { ... }
:is(.dads-sort-up, .dads-sort-down) { ... }
```

---

#### 例3: デバイスやブラウザによって不安定な要素は避ける

**Before(セマンティクス通りにtype="number"を使う)**

```html
<span class="dads-input-number" dads-size="md">
  <button type="button">▼</button>
  <input type="number" min="0" placeholder="0">
  <button type="button">▲</button>
</span>
```

**After(挙動を制御するためtype="text" inputmode="numeric"に切り替える)**
```html
<span class="dads-input-number" dads-size="md">
  <button type="button" aria-label="減らす">−</button>
  <input type="text" inputmode="numeric" min="0" placeholder="0">
  <button type="button" aria-label="増やす">+</button>
</span>
```
---

#### 例4: 意味を持たないラッパー要素は置かず、DOMをフラットに保つ (コミット 997422c)

**Before(グリッドの各セルをdivでラップしてから中身を置く)**

```html
<div style="display: grid; grid-template-columns: repeat(5, auto); gap: 1rem; justify-content: start">
  <div><button class="dads-button" dads-size="lg" dads-type="fill">ボタン</button></div>
  <div><button class="dads-button" dads-size="lg" dads-type="fill" disabled>ボタン</button></div>
  <div><button class="dads-button" dads-size="md" dads-type="fill">ボタン</button></div>
  ...
</div>
```

**After(グリッドの直接の子として要素自身を並べる。div一段が消える)**
```html
<div style="display: grid; grid-template-columns: repeat(5, auto); gap: 1rem; justify-content: start; align-items: center">
  <button class="dads-button" dads-size="lg" dads-type="fill">ボタン</button>
  <button class="dads-button" dads-size="lg" dads-type="fill" disabled>ボタン</button>
  <button class="dads-button" dads-size="md" dads-type="fill">ボタン</button>
  ...
</div>
```
ポイント
- <div><button>...</button></div>のdivはレイアウトにもセマンティクスにも寄与していない、CSS Gridのアイテムを作るためだけの容れ物。button自体が直接gridアイテムになれるので、この一段は不要。
- ラッパーを消したことで各ボタンの高さ・サイズが揃わなくなる可能性があるため、align-items: centerをgridコンテナに追加して補っている。単に消しただけでなく、消した結果生じる見た目のズレまで責任を持って調整する点が重要。
- 「構造上意味のある入れ子」と「実装の都合だけで生まれた入れ子」を区別し、後者は極力削除。DOMが浅いほど、CSSセレクタも状態管理もシンプルになる。

---

# カラーユニバーサルデザイン推奨配色セット ver.3

- [CUDO: Color Universal Design Recommended Color Set ver.3](https://cudo.jp/wp-content/uploads/2016/07/CUD%E6%8E%A8%E5%A5%A8%E9%85%8D%E8%89%B2%E3%82%BB%E3%83%83%E3%83%88%E3%82%AC%E3%82%A4%E3%83%89%E3%83%96%E3%83%83%E3%82%AF.pdf)

## 組み合わせ例

塗装用・印刷用・画面用マージ済み

### Good

アクセントカラー:
赤・黄色・空色・青・緑
赤・黄色・空色・青
ピンク・黄色・空色・青
ピンク・黄色・空色・茶色
緑・黄色・空色・茶色

ベースカラー:
明るいピンク・クリーム・明るい黄緑・明るい空色
明るいピンク・クリーム・明るい黄緑
明るいピンク・クリーム・明るい空色
明るいピンク・クリーム・明るい紫
明るいピンク・明るい空色・明るい黄緑
明るい空色・クリーム・明るい黄緑

### Bad

アクセントカラー:
ピンク・緑
ピンク・オレンジ
赤・オレンジ
赤・茶色
紫・茶色
紫・青
紫・緑
紫・赤
代替緑・空色
代替緑・ピンク
代替緑・紫

ベースカラー:
明るい紫・明るい空色
明るい紫・明るい黄緑
ベージュ・明るい黄緑
ベージュ・明るいピンク
ベージュ・クリーム # 印刷用のみ
明るい緑・明るいピンク

アクセントカラーとベースカラー:
ピンク・明るい緑
ピンク・ベージュ
オレンジ・明るい黄緑
黄色・明るい黄緑
黄色・ベージュ
空色・明るい紫
空色・明るい緑
代替緑・明るい黄緑

無彩色とアクセントカラー/ベースカラー:
白・クリーム
白・代替黄
明るいグレー・明るい空色
グレー・紫
グレー・青
グレー・ピンク
黒・茶色
黒・紫

## FAQ

- 色の付いた背景の色に文字や線を書く時は、黒または白のうち背景色との明度差を確保した方、さらに黒または白で縁取りを付けるとよい。
- 見分けにくい色同士を使いたい場合、同色のハッチングにより見分けやすさが向上する。
- グラデーションは全体で無く周辺部だけに留めるなど、ベタ塗りの色面積をなるべく確保するとよい。

---

## Memo

- 3:1をギリギリ満たす最小限のグレー: ライト: 148,148,148、ダーク: 100,100,100
