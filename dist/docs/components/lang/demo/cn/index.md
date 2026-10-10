# 语言演示

这是演示页面的中文版本。

当前仓库是中文子目录。

## 基本用法

该示例是一个连接到此演示仓库的 `<tp-markup-multi-pages>` 组件。

## 自动模式

语言选择器会在显式语言代码之前显示 `auto`。在自动模式下，如果浏览器语言匹配已配置的代码之一，就会使用该语言。

## 外部选择器

当 `<tp-lang>` 指向同一仓库时，也可以在 `<tp-markup-multi-pages>` 外部使用。

## 工具栏用法

`<tp-markup-multi-pages>` 会把 `<tp-lang>` 放入工具栏，并传入配置好的 `langs` 列表。

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-markup-multi-pages>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-clock
@summary Live clock component with digital or analogic display and date tooltip.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-lang
@summary Documentation language selector.
-->
<!--
@tp-dependency tp-source
@summary Source repository link button.
-->
<!--
@tp-dependency tp-splitter
@summary Splitter component with two resizable panels.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->
<!--
@tp-dependency tp-tree
@summary Generic tree component for interactive hierarchical editing.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-clock>`](../clock/index.md) : Live clock component with digital or analogic display and date tooltip.
- [`<tp-color>`](../color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-fullscreen>`](../fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-lang>`](../lang/index.md) : Documentation language selector.
- [`<tp-source>`](../source/index.md) : Source repository link button.
- [`<tp-splitter>`](../splitter/index.md) : Splitter component with two resizable panels.
- [`<tp-theme>`](../theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](../toolbar/index.md) : Sticky toolbar with start / center / end sections,
- [`<tp-tree>`](../tree/index.md) : Generic tree component for interactive hierarchical editing.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
