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
- セレクタの最初のタグ定義は、無指定でも*を明示すること。
- base.css以外の各ファイルで、個別の中間変数を定義してはならない。
- Javascriptのクォートは"を優先して使用すること。

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

