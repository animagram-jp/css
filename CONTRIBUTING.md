# Contributing

- Follow [ORG_CONTRIBUTING.md](./ORG_CONTRIBUTING.md)

If "ORG_CONTRIBUTING.md" does not exist in the repository root of your working environment, download it by executing the following.

```bash
curl -fsSL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/animagram-jp/.github/contents/.github/CONTRIBUTING.md?ref=main" -o "ORG_CONTRIBUTING.md"
```

## Commands

```bash
# WCAG 2.2 A+AA 監査出力コマンド
docker run -d --name accessibility-audit \
  -v .:/work \
  -w /work \
  node:lts-slim \
  tail -f /dev/null
docker exec accessibility-audit bash -lc "npx --yes playwright install --with-deps chromium && npm ci"

docker exec accessibility-audit node docs/audit.mjs
docker exec accessibility-audit chown -R "$(id -u):$(id -g)" docs
```


## 要件

本cssリポジトリは、元々UD対応汎用ライブラリとしての[デジタル庁ライブラリ](https://github.com/digital-go-jp/design-system-example-components-html)のクローンだったが、[主要使用先: appリポジトリ](https://github.com/animagram-jp/app)がWasmAppの発行するCommand(op, dom_id, arg1, arg2, ...)で全てのDOM操作を実現している都合、JS前提の状態管理や、無用なタグのネストを改める必要がある。また、UDでありつつ、一般汎用用途に耐えるべく、デザイン性やダークモードなどに対応する。

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
