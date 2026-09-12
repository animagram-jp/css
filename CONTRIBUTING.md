// This file includes untranslated text (ja).

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

## See

- [InterfaceDesign.md](./reference/InterfaceDesign.md)

---

## Todo

- [ ] リファクタリング中

---

