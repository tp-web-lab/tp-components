# Reproducible CI workspace

The Accessibility, Component quality and Lighthouse workflows use the same
composite action in `../actions/setup-workspace/action.yml`. It checks out the
four shared repositories at fixed commit SHAs, alongside the tested checkout of
`tp-components`. No sibling repository is taken from a developer's local machine.

The runner layout is:

```text
GITHUB_WORKSPACE/
  package.json
  pnpm-workspace.yaml
  pnpm-lock.yaml
  tp-components/
  tp-utilities/
  tp-markdown/
  tp-asciidoc/
  tp-restructuredtext/
```

The three root files are copied from this directory. This dedicated lockfile
replaces the obsolete standalone `tp-components/pnpm-lock.yaml` for CI only; it
does not replace the developer monorepo's root lockfile. Both the workspace and
component manifests specify pnpm 9.15.5. Actions and project commands use Node.js 24.

Installation uses `--frozen-lockfile`. Shared packages are built in dependency
order before a workflow runs its own checks. The setup action does not run
accessibility, coverage or Lighthouse reports. Run steps execute inside
`tp-components`; artifact paths remain relative to `GITHUB_WORKSPACE`.

## Updating a dependency or pinned revision

1. Review and update the relevant commit SHA in the composite action, if needed.
2. Recreate the layout above in a temporary directory, with the exact pinned
   repositories and the current `tp-components` working tree. Copy this directory's
   three workspace files to that temporary root.
3. From the temporary root, run:

   ```sh
   pnpm install --lockfile-only --ignore-scripts --no-frozen-lockfile
   ```

4. Copy the resulting root lockfile back to `tp-components/.github/ci/pnpm-lock.yaml`
   and review its changes. Do not regenerate it from the real monorepo: unrelated
   packages or unpublished sibling changes must not enter the CI workspace.
5. Verify `pnpm install --frozen-lockfile` and the four build commands from the
   composite action under Node.js 24 in the temporary workspace.
6. From `tp-components`, run `node --test scripts/ci-workspace.test.mjs`.

Do not run the global reports solely to validate this setup. A full run on GitHub
is still needed to validate the Linux runner and each workflow's actual tests.
