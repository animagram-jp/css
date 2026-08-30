# Contributing

- Follow [ORG_CONTRIBUTING.md](./ORG_CONTRIBUTING.md)

If "ORG_CONTRIBUTING.md" does not exist in the repository root of your working environment, download it by executing the following.

```bash
curl -fsSL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/animagram-jp/.github/contents/.github/CONTRIBUTING.md?ref=main" -o "ORG_CONTRIBUTING.md"
```

## Commands

```bash
# Audit by axe-core (WCAG 2.2 A+AA)
docker run -d --name accessibility-audit -v .:/work -w /work node:lts-slim tail -f /dev/null
docker exec accessibility-audit bash -lc "npx --yes playwright install --with-deps chromium && npm ci"
docker exec accessibility-audit node reference/audit.mjs
```

---

## Todo

- [ ] focusは当たってんのにまだcaretは出てない、って状態を無くして、確実にcaretを出したい
- [ ] focus時の密レイアウト差分として、inset差分も同時に用意する。

---

# Color System

- [CUDO: Color Universal Design Recommended Color Set ver.3](https://cudo.jp/wp-content/uploads/2016/07/CUD%E6%8E%A8%E5%A5%A8%E9%85%8D%E8%89%B2%E3%82%BB%E3%83%83%E3%83%88%E3%82%AC%E3%82%A4%E3%83%89%E3%83%96%E3%83%83%E3%82%AF.pdf)
  - License: free to use the color values (no permission/attribution required for using the colors themselves in products, printed matter, or screens). Cite the source when republishing the color values in guidelines/publications/web media. Figures/artwork in the guidebook are copyrighted by the 5 authoring organizations — no unauthorized reproduction or modification.

## 採用色の体系

- 演出・装飾用途 (イラスト, 写真の構成色、イメージ色)
- 情報の分類用途: CUDOの推奨対象
  - アクセントカラー: 小面積を目立たせる高彩度色
  - ベースカラー: 面積領域の塗り分けに用いる低彩度色
  - 無彩色: アクセントカラー・ベースカラーと併用する無彩色

## 構成色の体系

```
┌　background　───┐
│　┏ border　━━━┓　│
│　┃　　fill  　　　┃　│
│　┃ 　 -text-　 ┃　│
│　┗━━━━━━━━━━━┛　│
└───────────────┘
```

## 組み合わせ例

- 境界を共有して隣接する非テキスト色は、輝度コントラスト比3:1以上とする (per WCAG 2.2 SC 1.4.11 Non-text Contrast)。機械的に検証可能。
- 境界を共有しない並置（凡例、タグ、離れたボタン等）はWCAGの数値基準が及ばないため、下記 Good/Bad を自然言語のガイダンスとして参照する (per CUDO ver.3)。機械的な失敗検証はしない。

色名軸で塗装用・印刷用・画面用を統合。色名 ⇔ `--rgb-*` 変数の対応は [base.css](./css/base.css) 参照。
出典は [reference/CUDO.md](./reference/CUDO.md)（gitignore対象、ローカル参照用）。

### Good（比較的見分けやすい組み合わせ）

用途ごとに検証されたグループ単位の組み合わせ。ペア分解すると未検証の組み合わせを Good と誤認しうるため、グループのまま扱う。塗装用・印刷用でグループ構成が異なる（印刷用の方が対応色数が多い）。画面用は環境差が大きいため Good の指定なし（Bad 回避のみ）。

アクセントカラー:
| 組み合わせ | 塗装 | 印刷 |
|---|:---:|:---:|
| 赤・黄色・空色・青・緑 | o | o |
| 赤・黄色・空色・青 | o | o |
| 赤・黄色・空色・紫 | – | o |
| ピンク・黄色・空色・青 | o | o |
| ピンク・黄色・空色・茶色 | o | o |
| 緑・黄色・空色・茶色 | o | o |
| 青・空色・オレンジ・茶色 | – | o |

ベースカラー:
| 組み合わせ | 塗装 | 印刷 |
|---|:---:|:---:|
| 明るいピンク・クリーム・明るい黄緑・明るい空色 | o | – |
| 明るいピンク・クリーム・明るい黄緑・明るい空色・明るい緑 | – | o |
| 明るいピンク・クリーム・明るい黄緑 | o | – |
| 明るいピンク・クリーム・明るい空色 | o | – |
| 明るいピンク・クリーム・明るい緑・明るい空色 | – | o |
| 明るいピンク・クリーム・明るい緑・明るい紫 | – | o |
| 明るいピンク・クリーム・明るい紫 | o | o |
| 明るいピンク・明るい空色・明るい黄緑 | o | o |
| 明るいピンク・明るい紫・明るい緑 | – | o |
| 明るい空色・クリーム・明るい黄緑 | o | – |
| 明るい空色・クリーム・明るい緑 | – | o |
| 明るい空色・ベージュ・グレー | – | o |

### Bad（見分けにくい組み合わせ）

色名ペア軸の統合マトリクス。塗装・印刷・画面いずれかで Bad 指定があれば列挙（OR条件）し、該当用途を注釈列に示す。同系色濃淡は片方のみ使用推奨（用途共通、別掲）。

| 色A | 色B | 該当用途 |
|---|---|---|
| オレンジ | ピンク | 塗装・印刷 |
| オレンジ | 明るい黄緑 | 塗装・印刷 |
| オレンジ | 赤 | 塗装・印刷・画面 |
| クリーム | ベージュ | 印刷のみ |
| クリーム | 白 | 塗装・印刷・画面 |
| グレー | ピンク | 塗装・印刷 |
| グレー | 紫 | 塗装・印刷・画面 |
| グレー | 青 | 塗装・印刷 |
| ピンク | ベージュ | 塗装・印刷・画面 |
| ピンク | 代替緑 | 塗装のみ |
| ピンク | 明るい緑 | 塗装・印刷・画面 |
| ピンク | 緑 | 塗装・印刷・画面 |
| ベージュ | 明るいピンク | 塗装・印刷・画面 |
| ベージュ | 明るい緑 | 印刷のみ |
| ベージュ | 明るい黄緑 | 塗装・印刷 |
| ベージュ | 黄色 | 塗装のみ |
| 代替緑 | 明るい黄緑 | 塗装のみ |
| 代替緑 | 空色 | 塗装のみ |
| 代替緑 | 紫 | 塗装のみ |
| 代替黄 | 白 | 塗装のみ |
| 明るいグレー | 明るいピンク | 印刷のみ |
| 明るいグレー | 明るい空色 | 塗装・印刷・画面 |
| 明るいグレー | 明るい紫 | 画面のみ |
| 明るいグレー | 明るい緑 | 画面のみ |
| 明るいグレー | 空色 | 画面のみ |
| 明るいピンク | 明るい緑 | 塗装・画面 |
| 明るい空色 | 明るい紫 | 塗装・印刷 |
| 明るい空色 | 明るい緑 | 画面のみ |
| 明るい空色 | 白 | 画面のみ |
| 明るい紫 | 明るい黄緑 | 塗装・印刷 |
| 明るい紫 | 空色 | 塗装・印刷・画面 |
| 明るい緑 | 空色 | 塗装のみ |
| 明るい黄緑 | 黄色 | 塗装・印刷 |
| 紫 | 緑 | 塗装・印刷 |
| 紫 | 茶色 | 塗装・印刷・画面 |
| 紫 | 赤 | 塗装のみ |
| 紫 | 青 | 塗装・印刷 |
| 紫 | 黒 | 塗装・画面 |
| 茶色 | 赤 | 塗装・印刷 |
| 茶色 | 黒 | 塗装・印刷 |
| 赤 | 黒 | 画面のみ |

同系色濃淡（片方のみ使用推奨・用途共通）:
赤・ピンク／ピンク・明るいピンク／オレンジ・ベージュ／黄色・クリーム／緑・明るい緑／空色・明るい空色

## FAQ

- 色の付いた背景の色に文字や線を書く時は、黒または白のうち背景色との明度差を確保した方、さらに黒または白で縁取りを付けるとよい。
- 見分けにくい色同士を使いたい場合、同色のハッチングにより見分けやすさが向上する。
- グラデーションは全体で無く周辺部だけに留めるなど、ベタ塗りの色面積をなるべく確保するとよい。

---
