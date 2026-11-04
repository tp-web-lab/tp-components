# Component viewer

Inspect a component's API or test its attributes on one live preview. Choose Doc, Demo or API at the right of the title; Doc is selected initially. Switching panels preserves the demo configuration. API loads the full generated TypeDoc page when first selected.

<tp-component-viewer tag="tp-button"></tp-component-viewer>

## Usage

### Component tag

```html
<tp-component-viewer tag="tp-button"></tp-component-viewer>
```

The viewer loads the component API manifest and uses its introductory example. The documentation pane groups its tables in five tabs: Commands, Attributes, Methods, Events and CSS Properties. Commands is selected first. Commands lists each documented button or palette action with its meaning and optional shortcut; Mod means ⌘ on macOS and Ctrl elsewhere. Empty tabs explicitly report that no entries are declared. Events lists only custom events created by the component itself, excluding native and inherited events. Boilerplate descriptions are shown as an em dash until the source metadata is documented. Attribute controls cover the local API; inherited settings belong to their declaring component.

### Internal script

```html
<tp-component-viewer>
  <script type="tp/html">
    <tp-button variant="brand" outlined>Try the attributes</tp-button>
  </script>
</tp-component-viewer>
```

### External file

```html
<tp-component-viewer src="./examples/button.html"></tp-component-viewer>
```

Script and file modes infer the tag from the first `tp-*` element. Supply `tag` to select another component in a composed example. The first matching element is controlled. Supplied content and attributes are preserved; relative resources resolve from the example file or author document. `api-src` can select a manifest at another location.

Configuration controls appear in this order: booleans, enumerated choices, then text, numeric, date and time fields. Typed fields share a wrapping row.

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Doc / Demo / API | Show the user documentation, interactive demo or complete API, and update the component title. |
| API tabs | Display the selected API table. |
| Boolean checkboxes | Add or remove attributes on the preview. |
| Choice lists | Select a documented configuration value. |
| Text fields | Edit a value and leave the field to apply it. Clear removes the attribute and leaves the field empty. |
| Preview | Interact with the component; reflected attribute changes update the controls. |
| Reset defaults | Restore the documented attribute defaults and restart the preview. |
| Reload preview | Restart the preview with current settings, including initialization-only attributes. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move through configuration controls and the preview. Leaving an edited field applies its value. |
| Arrow keys / Home / End on API tabs | Select the adjacent, first or last API tab. |
| Space | Toggle the focused checkbox. |
| Arrow keys | Change the selection in a focused radio list. |
| Enter / Space | Activate the focused action button. |
| Ctrl+? | Open User help for the component under the pointer, falling back to the focused component; Shift may be needed to type ?. |

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the button API and change its configuration using the generated controls.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Custom content
: Load an outlined button from an HTML file, then change its variant or size while preserving its label.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

AsciiDoc
: ::include{examples/examples.adoc}

Markdown
: ::include{examples/examples.md}

reStructuredText
: ::include{examples/examples.rst}
:::::::::::::::

## API

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `tag` | string | `""` | Component tag; inferred from supplied HTML when omitted. |
| `src` | string | `""` | External HTML example. Takes precedence over the internal script. |
| `api-src` | string | `""` | Explicit component API manifest URL. |

`resetDefaults()` restores the documented attribute defaults and restarts the preview.

The control catalog is generated from existing attribute metadata, enum definitions and reviewed file fixtures with `pnpm viewer:sync-controls`. The build and example synchronization refresh it automatically.

Command metadata comes from the `Shortcut` column in `Usage > User interactions > Mouse interactions`. Use an explicit shortcut for a command with a key binding, `—` for a command without one, and an empty cell for an ordinary gesture or indicator. Keep toolbar buttons and palette commands distinct. A component without specific commands, such as `tp-button`, has no command rows.
