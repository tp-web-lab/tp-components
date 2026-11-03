# <tp-icon name="screen" library="components" size="1.25em"></tp-icon> Screen

<tp-screen src="/docs/components/screen/examples/responsive.html"></tp-screen>

Choose a page format in two horizontal menus: absolute device sizes as icon buttons on the first row, relative formats on the second. Relative formats appear in this order: **default**, **16:9**, **3:2**, **4:3**, **1:1**, **3:4**, **2:3**, **9:16**. Hover an absolute-format icon to read its device name. Each row scrolls horizontally on narrow screens.

Click **OK** to apply the selected format to the page, centered in the window. The chooser closes while the embedded page stays active. Its toolbar's Screen button opens the chooser again; pages without that control receive a floating Screen formats button. **Cancel**, the close button and <kbd>Escape</kbd> in the chooser restore the last confirmed format. Choosing **default** and clicking **OK** returns to the original page. <kbd>Escape</kbd> from the applied view also returns to the original page.

The first preview loads an independent iframe using `src` or the current URL, including query and hash route. Unsaved changes in the original document are not copied. Switching formats, confirming and reopening the chooser keep the same iframe and its local state. Returning to **default** restores the original document and releases the iframe. Nested Screen controls delegate to the outer chooser instead of creating another preview. When the outer page is fullscreen, the embedded Fullscreen button displays Exit fullscreen and returns to normal window mode while keeping the selected format.

<tp-screen src="/docs/components/screen/examples/responsive.html"></tp-screen>

| Format | Viewport |
| --- | --- |
| Phone portrait | 390 × 844 CSS px |
| Phone landscape | 844 × 390 CSS px |
| Tablet portrait | 768 × 1024 CSS px |
| Tablet landscape | 1024 × 768 CSS px |
| Laptop | 1366 × 768 CSS px |
| Desktop | 1920 × 1080 CSS px |
| default | Current window proportions; restores the original window on OK |
| 16:9, 3:2, 4:3 | Landscape ratios fitted to the available area |
| 1:1 | Square fitted to the available area |
| 3:4, 2:3, 9:16 | Portrait ratios fitted to the available area |

Absolute presets preserve their CSS pixel dimensions and scale down visually if needed. Relative presets resize with the available area. Media queries and viewport units respond to the actual iframe size. This is viewport sizing, not hardware emulation: browser engine, touch input, device pixel ratio and user agent remain unchanged. A remote page can refuse embedding. Use a served page URL rather than an inline `srcdoc` document for current-page preview.

### User interactions

#### Mouse interactions

| Control | Result |
| --- | --- |
| Screen preview | Hover to see the currently applied format and window width and height in CSS pixels; click to open the selected device viewport. |
| Absolute formats / Relative formats | Preview a tentative format without reloading the page; the active choice is highlighted. |
| OK | Apply the selected format; default restores the original page. |
| Cancel / Close preview | Discard the tentative choice and restore the last confirmed format. |
| Screen formats | Reopen the chooser from an applied page without its own Screen control. |


#### Keyboard interactions

| Key | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move through controls within the modal preview. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate the focused button or device option. |
| <kbd>ArrowLeft</kbd> / <kbd>ArrowRight</kbd> | Move between device menu options. |
| <kbd>Escape</kbd> | Cancel the chooser, or restore the original window from an applied view. For cross-origin content, focus an outer control first. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to focus. <kbd>Shift</kbd> may be needed to type <kbd>?</kbd>. |

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Try the absolute and relative format rows, then use OK to apply a format or Cancel to keep the last choice. Type into the field and reopen the chooser to check that the applied page keeps its state.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-screen>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-iframe
@summary Controlled iframe component.
-->
<!--
@tp-dependency tp-menu
@summary Accessible menu component.
-->
<!--
@tp-dependency tp-modal
@summary Modal overlay component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-iframe>`](../iframe/index.md) : Controlled iframe component.
- [`<tp-menu>`](../menu/index.md) : Accessible menu component.
- [`<tp-modal>`](../modal/index.md) : Modal overlay component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->

<!-- tp-docgen:api TpScreen -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>device</code> | <code>TpScreenDevice</code> | <code>&quot;default&quot;</code> | Device preset in CSS pixels, or a ratio fitted to the available preview area. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables and closes the preview. |
  | <code>size</code> | <code>TpSizeType</code> | <code>&quot;m&quot;</code> | Trigger size. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Page URL to preview; empty uses the current document URL, including its route. |
  | <code>variant</code> | <code>TpVariantType</code> | <code>&quot;neutral&quot;</code> | Trigger color variant. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-screen>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>close</code> | <code>close(): void</code> | Cancels the tentative choice and restores the last confirmed format. |
  | <code>confirm</code> | <code>confirm(): void</code> | Confirms the tentative format, or restores the original page for default. |
  | <code>show</code> | <code>show(): void</code> | Opens the format chooser, keeping the current applied page alive. |
  [Public methods of `TpScreen`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-screen-change</code> | <code>&#123; device: string; width: number; height: number &#125;</code> | Emitted when the preview opens or its viewport changes. |
  | <code>tp-screen-confirm</code> | <code>&#123; device: string &#125;</code> | Emitted after OK applies the selected format. |
  | <code>tp-screen-edit</code> | <code>void</code> | Emitted when screen edit occurs. |
  | <code>tp-screen-mode</code> | <code>void</code> | Emitted when screen mode occurs. |
  [Events emitted by `<tp-screen>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-screen>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_screen.TpScreen.html)
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
  <script type="module" src="/path/to/components/screen/screen.js"></script>
  ```

import
: ```js
  import "/path/to/components/screen/screen.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/screen/screen.js";
  ```
:::
