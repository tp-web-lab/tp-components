# Publishing the documentation

<tp-toc position="end" expand-all open brand></tp-toc>

The documentation is published at [tp-web-lab.github.io/tp-components](https://tp-web-lab.github.io/tp-components/). A push to `main` starts the **Documentation Pages** workflow: it builds the library and documentation, prepares the site for its public URL, and deploys it through GitHub Pages. Publishing to npm is a separate operation and is not required for this site.

## Which files are published?

| Location | Role |
| --- | --- |
| `public/docs/` | Authored documentation, examples and assets. |
| `public/docs/sidebar.md` | Navigation entries, including this appendix. |
| `src/` | Component implementation and styles. |
| `dist/` | Compiled library, documentation, generated API and assets. |
| `.pages/` | Generated site with URLs adapted to `/tp-components/`; this is the Pages artifact. |
| `.github/workflows/pages.yml` | Build, deployment and downstream examples automation. |
| `.github/actions/setup-workspace/action.yml` | Exact shared dependency revisions and their build order. |

Edit the source documents and components. Do not edit `.pages/` or the compiled `runtime` branch: the next publication replaces them. Uploading only `public/docs/` would omit the component code and other required resources.

## Prerequisites

Use **Node.js 24**, **pnpm 9.15.5** and Git to reproduce the publication environment. GitHub CLI (`gh`) is optional; all deployment operations are also available in the repository's Actions tab. Python 3 is used only by the local HTTP preview command below.

Building from source requires access to the four shared repositories: `tp-utilities`, `tp-markdown`, `tp-asciidoc` and `tp-restructuredtext`. They are checked out alongside `tp-components` in a pnpm workspace. A public clone of `tp-components` alone is not a complete build workspace.

```text
workspace/
  package.json
  pnpm-workspace.yaml
  pnpm-lock.yaml
  tp-components/
  tp-utilities/
  tp-markdown/
  tp-asciidoc/
  tp-restructuredtext/
```

For a fresh, isolated reproduction of CI, obtain these repositories with your authorized GitHub access, check out the shared dependency revisions listed in the [setup action](https://github.com/tp-web-lab/tp-components/blob/main/.github/actions/setup-workspace/action.yml), and copy the three files from `tp-components/.github/ci/` to the new workspace root. Do not overwrite an existing development workspace's root files with this CI configuration. The [CI workspace guide](https://github.com/tp-web-lab/tp-components/blob/main/.github/ci/README.md) explains the pinned revisions and lockfile maintenance.

From the workspace root, install and build shared dependencies in order:

```sh
pnpm install --frozen-lockfile
pnpm --filter @tp/tp-utilities build
pnpm --filter @tp/tp-markdown build
pnpm --filter @tp/tp-asciidoc build
pnpm --filter @tp/tp-restructuredtext build
cd tp-components
```

An existing development workspace can use its own configuration. When investigating a difference between local and published output, reproduce the pinned CI revisions rather than assuming that local sibling packages match GitHub.

## Prepare and check locally

The following commands run from `tp-components` after its shared dependencies have been built:

```sh
node --test scripts/ci-workspace.test.mjs
node --test scripts/prepare-pages.test.mjs
pnpm build
pnpm release:check
node scripts/prepare-pages.mjs /tp-components/
```

`pnpm build` generates the API documentation, checks TypeScript, builds the library, and produces its declarations and publication-time renderers. `pnpm release:check` checks package entry points and verifies that document parsers and TypeScript compilation remain lazy dependencies. Run the focused tests relevant to any component change as well; these publication checks do not replace them.

The preparation script recreates `.pages/` from `dist/`. It adapts known local URLs to the project prefix, maps development component paths to compiled files, excludes source maps and adds `.nojekyll`. It leaves `dist/` unchanged. For a site hosted at the domain root, use `/` instead of `/tp-components/` and change the workflow's preparation argument to match.

`pnpm preview` is useful for checking the ordinary `dist/` build. To test the actual Pages artifact at its final path prefix, mount `.pages/` under a temporary HTTP root:

```sh
preview_dir="$(mktemp -d)"
ln -s "$PWD/.pages" "$preview_dir/tp-components"
python3 -m http.server 4174 --bind 127.0.0.1 --directory "$preview_dir"
```

Open [the local publication preview](http://127.0.0.1:4174/tp-components/). Stop the server with Ctrl+C. The temporary directory contains only the preview symlink; the generated files remain in `.pages/`. Opening `index.html` through `file://` does not reproduce module imports or HTTP document loading.

Check the navigation, a direct link to a nested page, the Code control, an interactive example, images and mathematical formulas. Inspect the browser console for failed requests.

## Publish an update

Review the working tree and commit only the intended source changes. For example, from `tp-components`, after editing this appendix:

```sh
git status --short
git diff
git add public/docs/appendices/publication/index.md public/docs/appendices.md public/docs/sidebar.md
git commit -m "Update publication documentation"
git push origin main
```

Adapt the file list to your change. Build tools can regenerate documentation files; review those differences before staging them. Generated `.pages/` and `dist/` artifacts do not need to be committed for deployment.

A push to `main` triggers publication automatically. There is no separate upload command or version bump required for a documentation-only update. To republish the existing `main` without creating another commit, choose **Actions → Documentation Pages → Run workflow**, or run:

```sh
gh workflow run pages.yml --repo tp-web-lab/tp-components --ref main
```

## Follow the deployment

The workflow has three jobs:

1. **build** installs the pinned workspace, tests site preparation, builds the documentation, checks release files and uploads the Pages and reusable-runtime artifacts.
2. **deploy** publishes `.pages/` to GitHub Pages.
3. **update-examples** publishes the compiled library to the `runtime` branch and updates the revision used by `tp-examples`.

Use the [Documentation Pages runs](https://github.com/tp-web-lab/tp-components/actions/workflows/pages.yml) to inspect their status. With GitHub CLI:

```sh
gh run list --repo tp-web-lab/tp-components --workflow pages.yml --limit 5
```

Copy the relevant run ID and substitute it for `RUN_ID` in these commands:

```sh
gh run watch RUN_ID --repo tp-web-lab/tp-components --exit-status
gh run view RUN_ID --repo tp-web-lab/tp-components --log-failed
```

A successful `build` alone does not mean the site is published: verify `deploy` too. Then open the [public documentation](https://tp-web-lab.github.io/tp-components/). If an older page remains visible, reload without the browser cache; deployment and cache propagation are separate from compilation.

## How the examples are updated

After the documentation deployment, `update-examples` writes the new compiled-runtime revision to `tp-examples/.github/tp-components-revision`. That commit starts the **Examples Pages** workflow in `tp-examples`, which builds both sites:

| Site | Publication |
| --- | --- |
| Examples home | [tp-web-lab.github.io/tp-examples](https://tp-web-lab.github.io/tp-examples/) |
| Derivatives course | [tp-web-lab.github.io/derivatives](https://tp-web-lab.github.io/derivatives/) |

The home page is deployed directly by Actions. The course is committed to `tp-web-lab/derivatives`, whose own Pages deployment follows. Check all relevant runs when a library change must reach the course:

```sh
gh run list --repo tp-web-lab/tp-examples --workflow pages.yml --limit 5
gh run list --repo tp-web-lab/derivatives --limit 5
```

After the automation updates the examples repository, synchronize an existing local checkout before continuing work there. Review or save any local changes first, then run `git pull --ff-only` in `tp-examples`. Never merge the generated `runtime` or historical `gh-pages` branches into the source `main` branch.

## Static HTML and mathematical formulas

The `tp-components` documentation build currently compiles the library and prepares URLs; it does **not** convert all authored Markdown, AsciiDoc and reStructuredText documents to HTML. The documentation components still interpret those texts in the browser.

The examples publication adds another step in `tp-examples/scripts/render-markdown.mjs`: Markdown documents are converted to HTML during the build. The home page includes its available translations, and the derivatives course keeps a mapping between its original document URLs and generated HTML. The Code control still loads the original source.

`tp-examples/scripts/render-math.mjs` also converts inline `tp-math` content, in LaTeX or AsciiMath, to self-contained SVG. The browser reuses matching SVG output without loading the MathJax engine. Changing a formula loads MathJax on demand; formulas with external `src` remain dynamic. Invalid inline formulas fail publication instead of silently producing an error image.

From an installed `tp-examples` workspace with its component runtime available, these commands reproduce that pipeline:

```sh
pnpm test:prerender
pnpm --filter @tp/example-home test:prerender
pnpm --filter @tp/example-home build:pages
pnpm --filter @tp/example-derivatives build:pages
```

This optimization is automatic on publication. Authors continue editing the original Markdown and formulas. Validate gains with a new Lighthouse audit of the published URL under the same device, network and cache conditions; local compilation success is not a performance score.

## First-time repository configuration

The existing repositories are already configured. For a new installation of this publication chain, select **Settings → Pages → Build and deployment → Source → GitHub Actions** in `tp-components` and `tp-examples`, and configure the required repository access before running the workflows. GitHub must permit Pages for the repository's visibility and account plan.

| Secret | Repository holding it | Purpose |
| --- | --- | --- |
| `TP_UTILITIES_READ_KEY` | `tp-components` | Read the pinned `tp-utilities` dependency. |
| `TP_MARKDOWN_READ_KEY` | `tp-components` | Read the pinned `tp-markdown` dependency. |
| `TP_ASCIIDOC_READ_KEY` | `tp-components` | Read the pinned `tp-asciidoc` dependency. |
| `TP_RESTRUCTUREDTEXT_READ_KEY` | `tp-components` | Read the pinned `tp-restructuredtext` dependency. |
| `TP_EXAMPLES_UPDATE_KEY` | `tp-components` | Write the runtime revision to `tp-examples`. |
| `DERIVATIVES_PUBLISH_KEY` | `tp-examples` | Write the compiled course to `derivatives`. |

Each secret contains a dedicated deploy key's private part; its public part belongs in the corresponding target repository's deploy keys. The first four require read access only; the last two require write access. Never place private keys in source documents or commits. The workflow's GitHub token handles Pages deployment and the `runtime` branch within `tp-components`.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Shared dependency checkout fails | Its pinned commit and the associated read-only deploy key. |
| Frozen-lockfile installation fails | Dependency manifests and `.github/ci/pnpm-lock.yaml`; follow the CI workspace guide to regenerate the isolated lockfile. |
| Documentation works locally but fails in Actions | Local Node/pnpm versions and sibling revisions versus the pinned CI workspace. |
| Assets return 404 after publication | Preparation prefix, Pages URL and deployment of the complete `.pages/` artifact. |
| Documentation is current but examples are not | `update-examples`, the Examples Pages run, and the course's separate Pages deployment. |
| A static formula is reported as invalid | Its source and notation; correct the expression and rebuild. |
| A pushed change does not start publication | The target branch (`main`), Actions status and any CI-skip marker in the commit message. |
| A failed publication needs another attempt | Inspect `--log-failed`, correct the cause, then push the fix or run the workflow manually. |

The executable reference remains the [publication workflow](https://github.com/tp-web-lab/tp-components/blob/main/.github/workflows/pages.yml). Update this appendix when its commands or deployment structure change.
