# Демонстрация языка

Это русская версия демонстрационной страницы.

Текущий репозиторий находится в русском подкаталоге.

## Базовое использование

Пример представляет собой компонент `<tp-markup-multi-pages>`, подключенный к этому демонстрационному репозиторию.

## Автоматический режим

Переключатель языка показывает `auto` перед явными кодами языков. В автоматическом режиме он использует язык браузера, если он совпадает с одним из настроенных кодов.

## Внешний переключатель

`<tp-lang>` также можно использовать вне `<tp-markup-multi-pages>`, если он указывает на тот же репозиторий.

## Использование в панели инструментов

`<tp-markup-multi-pages>` помещает `<tp-lang>` в свою панель инструментов и передает ему настроенный список `langs`.

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
