# <tp-icon name="code-editor" library="components" size="1.25em"></tp-icon> Code editor

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-code-editor>` element implements the <tp-icon name="code-editor" library="components" size="1.25em"></tp-icon> Code editor functionality: displays a CodeMirror 6 based code editor.

<tp-code-editor language="javascript" line-numbers>
  <script type="tp/javascript">
const greeting = "Hello, tp-components!";
console.log(greeting);
  </script>
</tp-code-editor>

## Usage

### User interactions

Use F1 while the editor is focused to show or hide its toolbar. Mod means ⌘ on macOS and Ctrl elsewhere; Shift and Alt are shown as ⇧ and ⌥ on macOS.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Editor text | Click to place the cursor; drag to select text. Editing does not execute the code. |
| Numbered comment marker, when linked to tp-code-comment | Hover to read its formatted explanation in a tooltip. |
| Keyboard button | Open or close the command palette listed below. |
| Copy code button | Copy the entire editor content, unlike Copy in the palette, which copies the selection. |
| Theme button | Choose light, dark or automatic appearance for this editor. |
| Fullscreen button | Enter or leave fullscreen for this editor. |
| Language badge / line and column | Display the current language and cursor position; these are indicators, not buttons. |
| Palette: Undo | Reverts the last editor change. |
| Palette: Redo | Reapplies the last reverted editor change. |
| Palette: Copy | Copies the current selection. |
| Palette: Cut | Cuts the current selection. |
| Palette: Paste | Pastes clipboard text at the current selection. |
| Palette: Select all | Selects the whole editor content. |
| Palette: Fold code | Folds the current foldable code block. |
| Palette: Unfold code | Unfolds the current folded code block. |
| Palette: Toggle gutters | Shows or hides the fold gutter. |
| Palette: Toggle line numbers | Shows or hides line numbers. |
| Palette: Indent | Indents the current line or selection. |
| Palette: Dedent | Dedents the current line or selection. |
| Palette: Search | Opens the search panel. |
| Palette: Replace | Opens search and runs replace-next. |
| Palette: Go to line | Opens the go-to-line prompt. |
| Palette: Toggle line comment | Toggles line comments for the current line or selection. |
| Palette: Toggle block comment | Toggles block comments for the current selection. |
| Palette: Toggle Command Palette | Opens or closes the command palette. |
| Palette: Toggle toolbar | Opens or closes the toolbar. |
| Clipboard permission | Paste may require browser permission. Read-only content cannot be edited. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Typing and cursor movement | Edit text and move the insertion point in the focused editor. Editing is unavailable in read-only mode. |
| `Mod Z` | Reverts the last editor change. |
| `Mod Shift Z` | Reapplies the last reverted editor change. |
| `Mod C` | Copies the current selection. |
| `Mod X` | Cuts the current selection. |
| `Mod V` | Pastes clipboard text at the current selection. |
| `Mod A` | Selects the whole editor content. |
| `Mod Alt ↓` | Folds the current foldable code block. |
| `Mod Alt ↑` | Unfolds the current folded code block. |
| `Mod Alt G` | Shows or hides the fold gutter. |
| `Mod Alt L` | Shows or hides line numbers. |
| `Tab` | Indents the current line or selection. |
| `Shift Tab` | Dedents the current line or selection. |
| `Mod F` | Opens the search panel. |
| `Mod Alt F` | Open the search and replacement panel. |
| `Mod G` | Opens the go-to-line prompt. |
| `Mod Alt C` | Toggles line comments for the current line or selection. |
| `Mod Alt B` | Toggles block comments for the current selection. |
| `Mod Shift P` | Opens or closes the command palette. |
| `F1` | Opens or closes the toolbar. |
| Up / Down in the open palette | Move between commands. |
| Enter / Space in the open palette | Activate the focused command. |
| Escape in the open palette | Close the palette. |
| Focus a numbered comment marker / Escape | Show its explanation / close the tooltip without changing the code. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

#### Initial editor content
::: tp-tabs
no content
: ``` html
  <tp-code-editor language="python"></tp-code-editor>
  ```
  If the `language` attribute is not specified, the language used is `html`.

`value` attribute
: ``` html
  <tp-code-editor value="<p>hello, world!</p>"></tp-code-editor>
  ```
  If the `language` attribute is not specified, the language used is `html`.

internal script
: ``` html
  <tp-code-editor>
    <script type="tp/javascript">
      console.log('hello, world!');
    </script>
  </tp-code-editor>
  ```
  The script must have a `type` attribute in the form `tp/language`, where `language` is the language used in the script.

external file
: ``` html
  <tp-code-editor src="/path/to/filename.ext"></tp-code-editor>
  ```
  The file extension specifies the language used.
:::

Add the boolean `toolbar` attribute to display the editor toolbar initially.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit the sample code and try the editor controls.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Using an internal script
: Edit code initialized from an embedded script.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpCodeEditor -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>dir</code> | <code>string</code> | <code>&quot;inherited&quot;</code> | Text direction inherited from HTMLElement (`ltr`, `rtl`, `auto`). |
  | <code>filename</code> | <code>string</code> | <code>&quot;&quot;</code> | Logical filename associated with the current content. |
  | <code>fold-gutter</code> | <code>boolean</code> | <code>false</code> | Shows fold markers in the gutter. |
  | <code>lang</code> | <code>string</code> | <code>&quot;inherited&quot;</code> | Language tag inherited from HTMLElement. |
  | <code>language</code> | <code>string</code> | <code>html</code> | Fallback editing language when it cannot be inferred from a `tp/LANGUAGE` script or `src` extension. |
  | <code>line-numbers</code> | <code>boolean</code> | <code>false</code> | Shows line numbers. |
  | <code>placeholder</code> | <code>string</code> | <code>&quot;Type some LANGUAGE code... or F1 to toggle the toolbar&quot;</code> | Text shown when the editor is empty. Defaults to `Type some LANGUAGE code... or F1 to toggle the toolbar` using the resolved language. |
  | <code>readonly</code> | <code>boolean</code> | <code>false</code> | Enables read-only mode. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of a source file to load. |
  | <code>toolbar</code> | <code>boolean</code> | <code>false</code> | Shows the editor UI panel. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Initial editor content. |
  | <code>word-wrap</code> | <code>boolean</code> | <code>false</code> | Enables soft wrapping. |
  [Attributes of `<tp-code-editor>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>focus</code> | <code>focus(): void</code> | Moves focus to the CodeMirror editor. |
  | <code>getContentHeight</code> | <code>getContentHeight(): number</code> | Returns the computed height required by the current editor content, in pixels. |
  | <code>getInitialValue</code> | <code>getInitialValue(): string</code> | Returns the value currently used as the reset target. |
  | <code>getValue</code> | <code>getValue(): string</code> | Returns the current editor content. |
  | <code>isCursorAtEnd</code> | <code>isCursorAtEnd(): boolean</code> | Returns `true` when the editor selection is collapsed at the end of the document. |
  | <code>isCursorAtStart</code> | <code>isCursorAtStart(): boolean</code> | Returns `true` when the editor selection is collapsed at the start of the document. |
  | <code>reload</code> | <code>reload(): void</code> | Reloads the content from `src`, when a source file is configured. |
  | <code>reset</code> | <code>reset(): void</code> | Restores the editor content to the initial value and emits `tp-code-editor-reset`. |
  | <code>setCodeCommentNumbers</code> | <code>setCodeCommentNumbers(owner: object, numbers: readonly number[], comments: ReadonlyMap&lt;number, HTMLElement&gt; = new Map()): void</code> | Registers a linked annotation list; an empty array removes only that owner's markers. |
  | <code>setInitialValue</code> | <code>setInitialValue(value: string): void</code> | Sets the value used by `reset()` without changing the current editor content. |
  | <code>setValue</code> | <code>setValue(code: string): void</code> | Replaces the current editor content and stores it as an explicit API-provided value. |
  | <code>syncHeightToContent</code> | <code>syncHeightToContent(): void</code> | Recomputes the editor height from the current content and panels. |
  [Public methods of `TpCodeEditor`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-code-editor-boundary</code> | <code>&#123; direction: &quot;before&quot; \| &quot;after&quot; &#125;</code> | Emitted when keyboard navigation reaches the editor boundary. |
  | <code>tp-code-editor-change</code> | <code>&#123; filename: string; value: string &#125;</code> | Emitted when the editor content changes after user input. |
  | <code>tp-code-editor-error</code> | <code>&#123; message: string &#125;</code> | Emitted when a source loading error occurs. |
  | <code>tp-code-editor-input</code> | <code>&#123; filename: string; value: string &#125;</code> | Emitted on user input. |
  | <code>tp-code-editor-load</code> | <code>&#123; filename: string; source: &quot;api&quot; \| &quot;script&quot; \| &quot;src&quot; \| &quot;value&quot;; valueLength: number &#125;</code> | Emitted after the editor source has been resolved and loaded. |
  | <code>tp-code-editor-ready</code> | <code>void</code> | Emitted when the editor has been initialized. |
  | <code>tp-code-editor-reset</code> | <code>&#123; value: string &#125;</code> | Emitted after `reset()` restores the initial value. |
  [Events emitted by `<tp-code-editor>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-code-editor-active-line</code> | <code>var( &#45;&#45;tp-syntax-active-line, color-mix(in srgb, var(&#45;&#45;tp-neutral-fill-soft, #e5e7eb) 38%, transparent) )</code> | Background color of the active editor line. |
  | <code>&#45;&#45;tp-code-editor-caret</code> | <code>var(&#45;&#45;tp-syntax-caret, var(&#45;&#45;tp-text-body, #111827))</code> | Caret color. |
  | <code>&#45;&#45;tp-code-editor-fold-background</code> | <code>var( &#45;&#45;tp-syntax-fold-background, color-mix(in srgb, var(&#45;&#45;tp-neutral-fill-soft, #e5e7eb) 70%, transparent) )</code> | Background color of fold placeholders. |
  | <code>&#45;&#45;tp-code-editor-foreground</code> | <code>var(&#45;&#45;tp-syntax-foreground, var(&#45;&#45;tp-text-body, #111827))</code> | Main editor text color. |
  | <code>&#45;&#45;tp-code-editor-gutter-background</code> | <code>var( &#45;&#45;tp-syntax-gutter-background, color-mix(in srgb, var(&#45;&#45;tp-neutral-fill-softer, #f3f4f6) 88%, transparent) )</code> | Gutter background color. |
  | <code>&#45;&#45;tp-code-editor-gutter-border</code> | <code>var(&#45;&#45;tp-syntax-gutter-border, var(&#45;&#45;tp-neutral-stroke-soft, #d1d5db))</code> | Gutter border color. |
  | <code>&#45;&#45;tp-code-editor-gutter-foreground</code> | <code>var(&#45;&#45;tp-syntax-gutter-foreground, var(&#45;&#45;tp-text-muted, #6b7280))</code> | Gutter text and marker color. |
  | <code>&#45;&#45;tp-code-editor-muted</code> | <code>var(&#45;&#45;tp-syntax-muted, var(&#45;&#45;tp-text-muted, #6b7280))</code> | Muted editor text color. |
  | <code>&#45;&#45;tp-code-editor-selection</code> | <code>var( &#45;&#45;tp-syntax-selection, color-mix(in srgb, var(&#45;&#45;tp-brand-fill-mid, #60a5fa) 62%, transparent) )</code> | Selection background color. |
  | <code>&#45;&#45;tp-code-editor-surface</code> | <code>var(&#45;&#45;tp-syntax-surface, var(&#45;&#45;tp-paper-color, #ffffff))</code> | Editor surface background color. |
  | <code>&#45;&#45;tp-code-editor-token-comment</code> | <code>var(&#45;&#45;tp-syntax-token-comment, #6b7280)</code> | Syntax color for comments. |
  | <code>&#45;&#45;tp-code-editor-token-function</code> | <code>var(&#45;&#45;tp-syntax-token-function, #1d4ed8)</code> | Syntax color for function names. |
  | <code>&#45;&#45;tp-code-editor-token-keyword</code> | <code>var(&#45;&#45;tp-syntax-token-keyword, #2563eb)</code> | Syntax color for keywords. |
  | <code>&#45;&#45;tp-code-editor-token-link</code> | <code>var(&#45;&#45;tp-syntax-token-link, #0284c7)</code> | Syntax color for links. |
  | <code>&#45;&#45;tp-code-editor-token-number</code> | <code>var(&#45;&#45;tp-syntax-token-number, #7c3aed)</code> | Syntax color for numbers. |
  | <code>&#45;&#45;tp-code-editor-token-property</code> | <code>var(&#45;&#45;tp-syntax-token-property, #0f766e)</code> | Syntax color for properties. |
  | <code>&#45;&#45;tp-code-editor-token-string</code> | <code>var(&#45;&#45;tp-syntax-token-string, #b45309)</code> | Syntax color for strings. |
  | <code>&#45;&#45;tp-code-editor-token-type</code> | <code>var(&#45;&#45;tp-syntax-token-type, #1d4ed8)</code> | Syntax color for types. |
  | <code>&#45;&#45;tp-code-editor-token-variable</code> | <code>var(&#45;&#45;tp-syntax-token-variable, #0f766e)</code> | Syntax color for variables. |
  [CSS properties of `<tp-code-editor>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_code-editor.TpCodeEditor.html)
<!-- tp-docgen:typedoc:end -->






































































































































































































































































### Imports

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/code-editor/code-editor.js"></script>
  ```

import
: ```js
  import "/path/to/components/code-editor/code-editor.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/code-editor/code-editor.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-code-editor>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-badge
@summary Badge component for compact status labels.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-copy-code
@summary Copy-to-clipboard button component.
-->
<!--
@tp-dependency tp-dropdown
@summary Displays an anchored dropdown menu.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-tooltip
@summary Displays anchored tooltip content.
-->

- [`<tp-badge>`](../badge/index.md) : Badge component for compact status labels.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-copy-code>`](../copy-code/index.md) : Copy-to-clipboard button component.
- [`<tp-dropdown>`](../dropdown/index.md) : Displays an anchored dropdown menu.
- [`<tp-fullscreen>`](../fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-theme>`](../theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-tooltip>`](../tooltip/index.md) : Displays anchored tooltip content.

### External

<!--
@credit CodeMirror https://codemirror.net/
@summary Code editing and language support.
-->
<!--
@credit Lezer https://lezer.codemirror.net/
@summary Syntax tree highlighting.
-->

- [CodeMirror](https://codemirror.net/) : Code editing and language support.
- [Lezer](https://lezer.codemirror.net/) : Syntax tree highlighting.
<!-- tp-docgen:dependencies:end -->
