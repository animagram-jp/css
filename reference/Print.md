---
lang: ja
translations: none
---

# Print

目的: animagram-jp/cssへ、ページ組版機能の規範追加。

## 現時点の決定事項

組版時、ページと余白のサイズは画面ごとに1つに定めることを前提にする。
ページごとの余白差は、各ページ内で追加定義できる範囲で行う。

規則:

メディア指定の無い要素はrem単位で定義する。
rem単位を参照する単位(e.g., em)も部分的に使用してよい。

組版機能を有効にする画面では、@page内または共通に、ページと余白のサイズをmm単位で定義する。
また、html{font-size}(1remの参照先)をpt単位(1pt=0.3528mm)で定義する。
@media printにて、必要な追加または修正をrem単位または%単位で定義する。

## Reference

ブラウザの3つの出力を、ページ単位で比較する。

- screen: 画面レンダリング
- pdf: ブラウザの印刷機能による PDF 出力
- viewer: その PDF をブラウザの PDF ビューワーで開いた表示

比較で検知できるのは、3者に差異があることまでである。どれが正しいかは、生成画像を人間が確認して判断する。

## 実行

compare.pyは関数定義のみを持つ。

| 関数 | 内容 |
|-|-|
| `compare(root, targets, out, browser, threshold=64, tolerance=0.002, safari_delay=5, safari_paper="A4")` | rootを配信し、targets(rootからの相対パス)をbrowser(`firefox`または`safari`)で比較して、ターゲットごとのレポートのリストを返す。画像はoutに置く。 |
| `write_index(out, reports)` | outに、全ターゲットの画像と差分を並べたindex.htmlを書く。 |

HTTPサーバーとWebDriverは空きポートで起動する。依存はnumpy, pillow, pypdfium2, scipy。

```sh
uv run --with numpy --with pillow --with pypdfium2 --with scipy python -c 'import sys; from pathlib import Path; sys.path.insert(0, "reference"); import compare; print(compare.compare(Path("."), ["index.html"], Path("target/print"), "firefox"))'
```

CIは.github/workflows/print.yml(手動実行)。index.htmlをSafariで比較し、target/print/にcompare_result.json、index.htmlと画像を出力する。index.htmlのページはreference/style.cssの`@page`で定める。

## 前提

- 各画面は `@page` に固定の size を持つこと。PDF の用紙サイズはここから取る。
- 画面上のページは `--color-paper` を背景色に持つ要素として検出する。ページ高を超える要素は、ページの縦横比で切り分ける。
- 画面の撮影前に、print 時の html の font-size を計測し、screen 限定で同じ値を適用する。これにより画面と PDF を 1:1 で比べる。
- 画面は beforeprint を発火させた状態で撮影し、撮影後に afterprint を発火させる。

## 比較方法

- pdf は pdfium で4倍に描画し、面積平均で縮小したものを基準画像とする。
- viewer は画面全体の撮影から、背景色と異なる矩形のうち縦横比が用紙と合うものをページとして切り出し、基準画像に ±4px で位置合わせする。
- 差分は、半径1でぼかした濃度を、3×3 近傍の最大値と比べ、`threshold`(既定 64)を超えた画素の割合とする。`tolerance`(既定 0.2%)を超えると差異として報告する。

### 流し込み比較

画面のシートがページ高を超える場合、画面は改ページされないため、screen との比較はページ単位でなく流し込みで行う。viewer と pdf の比較は常にページ単位。

- 画面と各ページから @page の余白を除き、版面を縦に連結する。
- 連結した帯を、インクのある行の連続(バンド)に分ける。
- バンドの高さの差が 0.5mm 以内で、行内の横方向のインク分布の相関が 0.9 を超えるものを、順序を保って対応付ける。
- 対応したバンドを画面上の位置に置き直してから差分を取る。行ごとの端数の丸めによる累積のずれは、これで差異に数えない。
- 対応しないバンド、ページの継ぎ目を含まない行間の 0.5mm を超える差、継ぎ目をまたぐ内容は、差異として報告する。
- viewer のバンド位置は pdf から求める。viewer の描画の淡さで行の範囲が変わるのを避けるため。

## Safari

safaridriver は WebDriver の Print コマンドを持たないため、PDF は safari_print.applescript で印刷ダイアログを操作して保存する。WebDriver セッションを開く前に全ターゲット分を印刷する。

- システム設定でターミナル(CI では実行プロセス)にアクセシビリティ権限が必要。
- `sudo safaridriver --enable` が必要。
- ダイアログの要素名は英語 UI を前提とする。
- Safari のウィンドウは画面サイズを超えられないため、viewer で画面に収まりきらないページは検出されない。
