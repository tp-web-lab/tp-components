# <tp-icon name="console" library="components" size="1.25em"></tp-icon> Console

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-console>` element implements the <tp-icon name="console" library="components" size="1.25em"></tp-icon> Console functionality: visual console for playground output.

<tp-box data-intro-action="console" data-allow-script>
  <p>Inspect these example messages, then use Clear to empty the console.</p>
  <tp-console></tp-console>
  <p data-demo-status role="status"></p>
  <script src="/tp-components/docs/components/_shared/introduction-actions.js"></script>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Messages | Read output and errors. |
| Structured values | Expand or collapse values to inspect their contents. |
| Copy button | Copy the console text. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the focused button. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives


Use `<tp-console>` when you need a visual console. You can write entries directly through the component methods:

``` html
<tp-console id="output"></tp-console>

<script type="module">
  await customElements.whenDefined('tp-console');
  const output = document.querySelector('#output');
  output.log('Loaded');
  output.warn('Missing optional value');
  output.error(new Error('Example error'));
</script>
```

The component can also redirect global `console.log`, `console.info`, `console.warn`, `console.error`, and `console.clear` calls to itself while keeping the native browser console behavior.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the sample messages and use Clear to empty the console.

Values and tables
: Inspect how the console displays structured values and tabular data.

Groups and timers
: Inspect grouped console output and timing information.

Redirect global console
: Observe global console messages redirected into the component.

Message levels
: Compare standard, informative, warning and error messages in the console, then clear its output.
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
<!-- tp-docgen:api TpConsole -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-console>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addEntry</code> | <code>addEntry(kind: TpConsoleEntryKind, values: TpConsoleValue[]): TpConsoleEntry</code> | Adds an entry to the console. |
  | <code>assert</code> | <code>assert(condition: unknown, ...values: TpConsoleValue[]): void</code> | Writes an assertion failure. |
  | <code>clear</code> | <code>clear(): void</code> | Removes all entries. |
  | <code>count</code> | <code>count(label = &quot;default&quot;): void</code> | Writes a counter value. |
  | <code>countReset</code> | <code>countReset(label = &quot;default&quot;): void</code> | Resets a counter. |
  | <code>error</code> | <code>error(...values: TpConsoleValue[]): void</code> | Writes an error entry. |
  | <code>getEntries</code> | <code>getEntries(): TpConsoleEntry[]</code> | Returns a copy of the displayed entries. |
  | <code>getValue</code> | <code>getValue(): string</code> | Returns the text copied by the toolbar copy button. |
  | <code>group</code> | <code>group(...values: TpConsoleValue[]): void</code> | Starts an expanded group. |
  | <code>groupCollapsed</code> | <code>groupCollapsed(...values: TpConsoleValue[]): void</code> | Starts a collapsed group. |
  | <code>groupEnd</code> | <code>groupEnd(): void</code> | Ends the current group. |
  | <code>info</code> | <code>info(...values: TpConsoleValue[]): void</code> | Writes an informational entry. |
  | <code>log</code> | <code>log(...values: TpConsoleValue[]): void</code> | Writes a standard entry. |
  | <code>redirectConsoleToSelf</code> | <code>redirectConsoleToSelf(): () =&gt; void</code> | Redirects global console calls to this component. |
  | <code>restoreConsole</code> | <code>restoreConsole(): void</code> | Restores the original global console methods. |
  | <code>table</code> | <code>table(...values: TpConsoleValue[]): void</code> | Writes tabular data. |
  | <code>time</code> | <code>time(label = &quot;default&quot;): void</code> | Starts a timer. |
  | <code>timeEnd</code> | <code>timeEnd(label = &quot;default&quot;): void</code> | Ends a timer. |
  | <code>timeLog</code> | <code>timeLog(label = &quot;default&quot;, ...values: TpConsoleValue[]): void</code> | Writes a timer value. |
  | <code>warn</code> | <code>warn(...values: TpConsoleValue[]): void</code> | Writes a warning entry. |
  [Public methods of `TpConsole`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-console-clear</code> | <code>&#123; removedCount: number &#125;</code> | Emitted when the console is cleared. |
  | <code>tp-console-entry-add</code> | <code>&#123; entry: TpConsoleEntry &#125;</code> | Emitted when an entry is added. |
  [Events emitted by `<tp-console>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-console-bg</code> | <code>#0d1117</code> | Console background. |
  | <code>&#45;&#45;tp-console-bigint-color</code> | <code>#bc8cff</code> | BigInt value color. |
  | <code>&#45;&#45;tp-console-boolean-color</code> | <code>#ffa657</code> | Boolean value color. |
  | <code>&#45;&#45;tp-console-border</code> | <code>#30363d</code> | Console border color. |
  | <code>&#45;&#45;tp-console-circular-color</code> | <code>#f2cc60</code> | Controls the circular color. |
  | <code>&#45;&#45;tp-console-color</code> | <code>#e6edf3</code> | Console text color. |
  | <code>&#45;&#45;tp-console-date-color</code> | <code>#7ee787</code> | Controls the date color. |
  | <code>&#45;&#45;tp-console-depth</code> | <code>0</code> | Controls the depth. |
  | <code>&#45;&#45;tp-console-empty-color</code> | <code>#8b949e</code> | Empty state text color. |
  | <code>&#45;&#45;tp-console-entry-bg</code> | <code>transparent</code> | Controls the entry bg. |
  | <code>&#45;&#45;tp-console-entry-border</code> | <code>#21262d</code> | Entry separator color. |
  | <code>&#45;&#45;tp-console-error-color</code> | <code>#ff7b72</code> | Controls the error color. |
  | <code>&#45;&#45;tp-console-function-color</code> | <code>#d2a8ff</code> | Controls the function color. |
  | <code>&#45;&#45;tp-console-kind-accent</code> | <code>#ff7b72</code> | Controls the kind accent. |
  | <code>&#45;&#45;tp-console-nullish-color</code> | <code>#8b949e</code> | Null and undefined value color. |
  | <code>&#45;&#45;tp-console-number-color</code> | <code>#79c0ff</code> | Number value color. |
  | <code>&#45;&#45;tp-console-object-bg</code> | <code>#11161d</code> | Object preview background. |
  | <code>&#45;&#45;tp-console-object-border</code> | <code>#30363d</code> | Object preview border color. |
  | <code>&#45;&#45;tp-console-object-key-color</code> | <code>#c9d1d9</code> | Object key color. |
  | <code>&#45;&#45;tp-console-object-marker-color</code> | <code>#8b949e</code> | Controls the object marker color. |
  | <code>&#45;&#45;tp-console-object-panel-bg</code> | <code>#0f141a</code> | Object tree panel background. |
  | <code>&#45;&#45;tp-console-object-separator-color</code> | <code>#8b949e</code> | Controls the object separator color. |
  | <code>&#45;&#45;tp-console-object-summary-bg</code> | <code>#161b22</code> | Controls the object summary bg. |
  | <code>&#45;&#45;tp-console-object-summary-color</code> | <code>#c9d1d9</code> | Object summary text color. |
  | <code>&#45;&#45;tp-console-string-color</code> | <code>#a5d6ff</code> | String value color. |
  | <code>&#45;&#45;tp-console-time-color</code> | <code>#8b949e</code> | Timestamp color. |
  [CSS properties of `<tp-console>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_console.TpConsole.html)
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
  <script type="module" src="/path/to/components/console/console.js"></script>
  ```

import
: ```js
  import "/path/to/components/console/console.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/console/console.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-console>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-copy-code
@summary Copy-to-clipboard button component.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-object-tree
@summary Specialized tree for inspecting JavaScript values.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-copy-code>`](../copy-code/index.md) : Copy-to-clipboard button component.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-object-tree>`](../object-tree/index.md) : Specialized tree for inspecting JavaScript values.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->


