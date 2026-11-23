# Security Assessment

The most likely and the most impactful security problems of this software, and how each is handled.
Review this document before each release, together with the [quality checklist](https://github.com/animagram-jp/.github/blob/main/quality_checklist/README.md).

## Scope

| Item | Content |
|-|-|
| Library | `css/*.css`, and `animagram_css.css` built from them by `reference/build.sh`. A consumer links or copies these files. They contain no script. |
| Demo | `index.html` and `reference/init.js`, served by GitHub Pages. |
| Tool | `reference/*.mjs` and their npm packages (validation, accessibility test). They run in development and CI only. |
| Pipeline | `.github/workflows/`. |

## Actor

| Actor | Trust | Action |
|-|-|-|
| Consumer | Trusted. | Links `animagram_css.css` of a release or individual files of `css/` into an own page. |
| Visitor | Untrusted. | Opens the demo page. The page takes no input that leaves the browser. |
| Maintainer | Trusted. | Edits the files, runs the tools, tags a release. |
| Pipeline | Trusted. | Validates, tests and deploys the demo, and attaches `animagram_css.css` to a draft release. |

## Problem

| Problem | Likelihood | Impact | Handling |
|-|-|-|-|
| A released CSS file is altered and a consumer page loads it. CSS can hide or overlay controls and can send attribute values to a remote host through `url()`. | Low | High | The library refers to no remote resource. `@import` in `import.css` names only files of the same directory, and `reference/build.sh` stops when an `@import` remains unresolved in `animagram_css.css`. A consumer takes `animagram_css.css` from a release, or the files from a version tag. Published releases are immutable. The default branch accepts changes only through a pull request with a required check. |
| A malicious npm package runs in the test job and alters the deployed demo or the report. | Low | Medium | `npm ci` installs exactly `package-lock.json`. The test job has read permission only and holds no secret. Actions are pinned by commit SHA. Dependabot updates weekly. |
| The release job attaches an altered `animagram_css.css` to a release. | Low | High | Only the `deploy-release` job holds `contents: write`, and it installs no npm package. It attaches the file built in the `build` job and only to a draft release. The maintainer publishes the draft. |
| The demo script is taken as a safe example and reused with untrusted input. | Low | Low | `reference/init.js` handles only the controls of the demo page and sends nothing to a server. |
| A change lowers contrast or hides focus, and a user misreads a control. | Medium | Low | The accessibility engine (WCAG 2.2 A and AA) runs over six color schemes before each deploy. |
