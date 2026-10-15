# <tp-icon name="slope-simulator" library="components" size="1.25em"></tp-icon> Slope simulator

<tp-toc position="end" expand-all open brand></tp-toc>

Move a point along a straight slope and three fictional cycling stages. Equal mouse movements or arrow presses cover less distance uphill and more downhill, in either direction.

<tp-slope-simulator></tp-slope-simulator>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Slope slider | Set the straight slope between −20% and +20%. |
| Clear slope | Restore a flat line (0%). |
| Drag either point horizontally | Spend movement effort along the route. Release and grab again to continue; the point does not jump to the pointer. Mouse, pen and touch are supported. |
| Stage profile | Select one of the available profiles; restart the stage point. A single supplied profile is shown as a label. |
| Restart | Return that route's point to 10% of the route. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Focus the slope slider, clear button, points, profile choices and restart buttons. |
| Left / Right on a point | Move left / right with slope-dependent effort. Holding a key repeats the movement. |
| Arrow keys on the slope slider | Adjust the slope. |
| Arrow keys on profile choices | Select another stage. |
| Enter / Space on a button | Clear the slope or restart the corresponding route. |
| Escape | End a drag at the current position. |
| Ctrl+? | Open User help for the component under the pointer, falling back to the focused component. Shift may be needed to type ?. |

### Effort and profiles

The straight line uses equal horizontal and vertical scales: a 20% gradient rises 20 units per 100 horizontal units. Stage elevation is exaggerated up to ×2 for readability and fitted vertically when needed; the displayed scale is stated above the stage. Effort always uses the underlying gradient. The profiles are illustrative, not actual Tour de France routes.

At +20% in the direction of travel, movement requires four times the flat-ground effort. At −20%, it requires one quarter. Reversing direction reverses uphill and downhill. Crossing a summit applies the resistance of each segment, independently of how mouse events are grouped. There is no inertia or automatic motion. At the endpoints, extra effort is discarded so reversing responds immediately.

The internal slope control uses the library's `<tp-numberfield range clearable>`.

### Author directives

#### Profile format

Provide a JSON object with a nonempty `profiles` array. Each profile has a unique nonempty `id`, a nonempty `name` and at least two `points`. A point is `[distance in kilometres, altitude in metres]`. Distances must increase strictly; all values must be finite numbers. The first distance need not be zero, and negative elevations are allowed.

```json
{
  "profiles": [
    {
      "id": "two-passes",
      "name": "Two passes",
      "points": [[0,200], [10,200], [20,1000], [30,400], [40,1400], [50,300]]
    }
  ]
}
```

Every segment must satisfy `abs(slope) <= 20%`, with `slope = (altitude2 - altitude1) / (distance2 - distance1) / 10`. Exactly +20% and −20% are accepted (only floating-point roundoff is tolerated). One invalid segment rejects the entire document, without clipping the slope or partially replacing profiles. Errors identify the profile and segment, numbered from 1.

#### Loading profiles

Load a file:

```html
<tp-slope-simulator src="./stages.json"></tp-slope-simulator>
```

Or declare inert inline JSON:

```html
<tp-slope-simulator>
  <script type="tp/slope-simulator">
    {"profiles":[{"id":"pass","name":"My pass","points":[[0,200],[10,1000],[20,300]]}]}
  </script>
</tp-slope-simulator>
```

`src` takes precedence over the inline script. Changing `src` reloads the source; removing it restores inline profiles, or the defaults when there is no inline source. Inline data is captured at initialization, including parser-delayed insertion; use `setProfiles()` for subsequent updates. Supplied profiles replace the defaults and successful loading selects the first profile, resetting the stage point to 10%. The straight-slope control and point are unchanged.

#### Updating profiles and handling errors

```js
const simulator = document.querySelector("tp-slope-simulator");
simulator.addEventListener("tp-slope-simulator-error", (event) => {
  console.warn(event.detail.message);
});
const accepted = simulator.setProfiles({
  profiles: [{ id: "pass", name: "My pass", points: [[0,200],[10,1000],[20,300]] }]
});
```

`setProfiles(data)` accepts an object or JSON string and returns a boolean. A valid call cancels pending loads and takes effect immediately; a later `src` change resumes declarative loading. The exported types `TpSlopeProfile` and `TpSlopeProfiles` describe the input. Network, JSON and validation errors display a warning and emit `tp-slope-simulator-error` with `{message}`, preserving the last valid profiles and position. An initial failure retains the defaults. Stale responses and loads cancelled on disconnection cannot replace the current data.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Adjust the slope, drag either point or use arrow keys, then compare the three cycling profiles.

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

<!-- tp-docgen:api TpSlopeSimulator -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | JSON file containing cycling profiles; takes precedence over the inline script. |
  [Attributes of `<tp-slope-simulator>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>setProfiles</code> | <code>setProfiles(data: TpSlopeProfiles \| string): boolean</code> | Replace profiles atomically. Returns false and emits an error for invalid data. |
  [Public methods of `TpSlopeSimulator`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-slope-simulator-error</code> | <code>&#123; message: string &#125;</code> | Fired when a profile source fails validation or loading; detail contains message. |
  [Events emitted by `<tp-slope-simulator>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-slope-simulator>`]
:::
<!-- /tp-docgen:api -->

### Imports

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/slope-simulator/slope-simulator.js"></script>
  ```

import
: ```js
  import "/path/to/components/slope-simulator/slope-simulator.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/slope-simulator/slope-simulator.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-slope-simulator>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-numberfield
@summary Numeric field with an optional native range slider.
-->
<!--
@tp-dependency tp-radio-list
@summary Transforms a list into a group of radio buttons.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-numberfield>`](../numberfield/index.md) : Numeric field with an optional native range slider.
- [`<tp-radio-list>`](../radio-list/index.md) : Transforms a list into a group of radio buttons.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
