# <tp-icon name="tabs" library="components" size="1.25em"></tp-icon> Tabs

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-tabs>` element implements the <tp-icon name="tabs" library="components" size="1.25em"></tp-icon> Tabs functionality: accessible tab group in light DOM.

<tp-tabs>
        <dl>
          <dt>Tab 1</dt>
          <dd>Content of panel <tp-icon size="2em" name="numeric-1"></tp-icon></dd>
          <dt>Tab 2</dt>
          <dd>Content of panel <tp-icon size="2em" name="numeric-2"></tp-icon></dd>
          <dt>Tab 3</dt>
          <dd>Content of panel <tp-icon size="2em" name="numeric-3"></tp-icon></dd>
          <dt>Tab 4</dt>
          <dd>Content of panel <tp-icon size="2em" name="numeric-4"></tp-icon></dd>
        </dl>
      </tp-tabs>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Tab | Click to display its panel. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the tab list and focusable panel content. |
| ArrowRight / ArrowDown | Moves focus to the next tab according to orientation. |
| ArrowLeft / ArrowUp | Moves focus to the previous tab according to orientation. |
| Home | Moves focus to the first tab. |
| End | Moves focus to the last tab. |
| Enter / Space | Activates the focused tab in manual activation mode. |
| Delete | Requests closing a dynamically added tab. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-tabs>` as shown below.

```html
<tp-tabs>
  <dl>
    <dt>Tab 1</dt>
    <dd>Content of panel <tp-icon size="2em" name="numeric-1"></tp-icon></dd>
    <dt>Tab 2</dt>
    <dd>Content of panel <tp-icon size="2em" name="numeric-2"></tp-icon></dd>
    <dt>Tab 3</dt>
    <dd>Content of panel <tp-icon size="2em" name="numeric-3"></tp-icon></dd>
    <dt>Tab 4</dt>
    <dd>Content of panel <tp-icon size="2em" name="numeric-4"></tp-icon></dd>
  </dl>
</tp-tabs>
```

Authors keep the familiar `dl`/`dt`/`dd` structure and do not add ARIA roles themselves. At runtime, `tp-tabs` converts it into generic elements carrying the compatible `tablist`, `tab`, and `tabpanel` roles, relationships, selection state, and keyboard behavior.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Select the tabs to switch between their content panels.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
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
<!-- tp-docgen:api TpTabs -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>activation</code> | <code>TpTabsActivation</code> | <code>auto</code> | Keyboard activation mode (`auto` or `manual`). |
  | <code>orientation</code> | <code>TpTabsOrientation</code> | <code>horizontal</code> | Tab list orientation (`horizontal` or `vertical`). |
  | <code>selected</code> | <code>number</code> | <code>0</code> | Selected tab index. |
  [Attributes of `<tp-tabs>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addTab</code> | <code>addTab(value: string, label: string): number</code> | Adds a tab and its empty panel. |
  | <code>clearTabs</code> | <code>clearTabs(): void</code> | Removes all tabs and panels. |
  | <code>getSelectedValue</code> | <code>getSelectedValue(): string \| null</code> | Returns the selected tab value. |
  | <code>moveTab</code> | <code>moveTab(fromIndex: number, toIndex: number): void</code> | Moves a tab from one index to another. |
  | <code>refresh</code> | <code>refresh(): void</code> | Rebuilds tab roles and selection state. |
  | <code>removeTab</code> | <code>removeTab(value: string): void</code> | Removes a tab by value. |
  | <code>select</code> | <code>select(index: number): void</code> | Selects a tab by its index. |
  | <code>selectValue</code> | <code>selectValue(value: string): void</code> | Selects a tab by its `data-value`. |
  [Public methods of `TpTabs`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-tabs-close</code> | <code>&#123; index: number; value: string &#125;</code> | Emitted when a tab close button is activated. |
  | <code>tp-tabs-reorder</code> | <code>&#123; fromIndex: number; toIndex: number; value: string &#125;</code> | Emitted after a tab is reordered by drag and drop. |
  | <code>tp-tabs-select</code> | <code>&#123; selected: number; value: string &#125;</code> | Emitted after a tab is selected. |
  [Events emitted by `<tp-tabs>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-tabs-border-color</code> | <code>var(&#45;&#45;tp-neutral-stroke-soft)</code> | Controls the border color. |
  | <code>&#45;&#45;tp-tabs-border-selected-color</code> | <code>var(&#45;&#45;tp-brand-stroke-soft)</code> | Controls the border selected color. |
  | <code>&#45;&#45;tp-tabs-panel-bg</code> | <code>var(&#45;&#45;tp-paper-color)</code> | Controls the panel bg. |
  | <code>&#45;&#45;tp-tabs-tab-bg</code> | <code>var(&#45;&#45;tp-neutral-fill-softer)</code> | Controls the tab bg. |
  | <code>&#45;&#45;tp-tabs-tab-color</code> | <code>var(&#45;&#45;tp-text-body)</code> | Controls the tab color. |
  | <code>&#45;&#45;tp-tabs-tab-selected-bg</code> | <code>var(&#45;&#45;tp-paper-color)</code> | Controls the tab selected bg. |
  | <code>&#45;&#45;tp-tabs-tab-selected-color</code> | <code>var(&#45;&#45;tp-brand-text-colorful)</code> | Controls the tab selected color. |
  [CSS properties of `<tp-tabs>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_tabs.TpTabs.html)
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
  <script type="module" src="/path/to/components/tabs/tabs.js"></script>
  ```

import
: ```js
  import "/path/to/components/tabs/tabs.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/tabs/tabs.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-tabs>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
