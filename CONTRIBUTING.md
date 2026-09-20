// This file includes untranslated text (ja).

# Contributing

- Follow [ORG_CONTRIBUTING.md](./ORG_CONTRIBUTING.md)

If "ORG_CONTRIBUTING.md" does not exist in the repository root of your working environment, download it by executing the following.

```bash
curl -fsSL -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/animagram-jp/.github/contents/.github/CONTRIBUTING.md?ref=main" -o "ORG_CONTRIBUTING.md"
```

## Commands

```bash
# Audit by IBM Equal Access engine (WCAG 2.2 A+AA)
docker run -d --name accessibility-audit -v .:/work -w /work/reference node:lts-slim tail -f /dev/null
docker exec accessibility-audit bash -lc "npm ci && npx --yes playwright@\$(node -p \"require('playwright-core/package.json').version\") install --with-deps chromium"
docker exec accessibility-audit npm run audit

# Validate ./css against the CSS syntax definitions
docker exec accessibility-audit npm run validate
```

---

## See

- [InterfaceDesign.md](./reference/InterfaceDesign.md)

---

## Todo

- [ ] リファクタリング中

---

