<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="slope-simulator" library="components" size="1.25em"></tp-icon> Slope simulator

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-slope-simulator>` element shows how uphill and downhill gradients affect the effort needed to move a point.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-slope-simulator></tp-slope-simulator>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-slope-simulator" src="/docs/components/slope-simulator/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Effort and profiles

The straight line uses equal horizontal and vertical scales: a 20% gradient rises 20 units per 100 horizontal units. Stage elevation is fitted vertically for readability, including long routes with small elevation-to-distance ratios; the displayed scale is stated above the stage. Effort always uses the underlying gradient. The profiles are illustrative, not actual Tour de France routes.

At +20% in the direction of travel, movement requires four times the flat-ground effort. At −20%, it requires one quarter. Reversing direction reverses uphill and downhill. Crossing a summit applies the resistance of each segment, independently of how mouse events are grouped. There is no inertia or automatic motion. At the endpoints, extra effort is discarded so reversing responds immediately.

The large badge above each route shows its signed slope followed by an indicative speed in km/h in the most recent direction of travel: positive uphill, negative downhill, and zero on flat ground. Reversing the mouse or arrow-key direction reverses the sign. The simulator explicitly states that this fictional speed assumes constant effort, based on `speed-base` (30 km/h by default) on flat ground (0% slope): `speed = speedBase / 4^(signed slope / 20)`. It is a teaching model, not a measured cycling speed or distance divided by real elapsed time. With the default base, it shows 7.5 km/h at +20% and 120 km/h at −20%, independently of route length. Speed returns to zero on release, restart, loss of focus or after 600 ms without movement. The information line below the route shows the same signed value and a direction arrow. Initially and after restarting, the direction is left to right.

The internal slope control uses the library's `<tp-numberfield range clearable>`.

The Grid icon beside Cycling stage toggles distance (km) and height (m) axes. The grid starts hidden, retains its visibility when switching profiles, and recalculates its graduations after loading or editing a profile. Elevations use the original absolute values, including negative values; distances retain the source’s starting distance. Showing the grid does not change movement effort.

### Editing a stage

Expand **Profile code** below Cycling stage to reveal the point-unit and ±20% slope-limit legend, action buttons and JSON editor. The editor shows the selected profile, using `[distance in kilometres, altitude in metres]` points. With one profile, Play applies changes to the selected profile only. With multiple profiles, Play replaces the collection, selects the first profile and shows the profile selector. Refresh restores both its code and curve from the most recent initial load, `src` load or `setProfiles()` call. Other profiles are retained. Drafts survive profile switching; loading a new collection replaces all drafts and reset baselines. The editor grows and shrinks with its content.

The editor accepts the same `{ "profiles": [...] }` structure as external sources, with one or more profiles. A single profile replaces the selected entry and its id must remain unique within the collection. Multiple profiles replace the entire collection, establish new reset baselines and select the first entry. Validation errors preserve the active curve and editable draft. The straight-line experiment is unaffected.

The file menu follows Construction source: Load accepts the same profile-collection JSON as `src`, and establishes a new reset baseline. Save and Save as export the current editor text, including unapplied or invalid drafts; they do not apply it. Save destinations are remembered separately for each selected profile and cleared when loading another collection. F1, or the F1 icon button, toggles the code editor toolbar.

### Base speed

Set `speed-base="25"` on the component to use a fictional flat-ground speed of 25 km/h. Changes apply immediately to both badges and their explanatory notes. The value must be a finite positive number in km/h.

The JSON document can provide an optional top-level numeric field: `{"speed-base": 25, "profiles": [...]}`. This works with `src`, inline JSON, `setProfiles()`, Load and the profile editor. A valid component attribute takes precedence; otherwise the selected profile’s document value is used, falling back to 30. Removing the attribute restores that fallback. An empty or invalid attribute is ignored; an invalid JSON value rejects the document without changing the current profiles. The editor preserves the field on save and restores its original value with Refresh. Applying a single edited profile changes its base speed; applying a collection assigns its base speed to every profile.

### Profile format

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

### Loading profiles

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

### Updating profiles and handling errors

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

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Adjust the slope, drag either point or use arrow keys, then compare the three cycling profiles.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Tour of Lombardy 2026
: Explore an approximate 239.6 km reconstruction from the supplied route-profile image. Compare the climbs and descents, reverse direction to change the signed slope, and edit the JSON in Profile code.

Alpe d’Huez 2026
: Explore an approximate 170.9 km reconstruction through the Croix de Fer, Télégraphe, Galibier and Sarenne passes to Alpe d’Huez. Toggle the grid, compare uphill and downhill effort, and edit the profile JSON.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> HTML
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_latex" library="languages" size="1.25em"></tp-icon> tp-latex
: ::include{examples/examples-latex.html}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

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
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-numberfield
@summary Numeric field with an optional native range slider.
-->
<!--
@tp-dependency tp-radio-list
@summary Transforms a list into a group of radio buttons.
-->

- [`<tp-badge>`](#/components/badge/index.md) : Badge component for compact status labels.
- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-code-editor>`](#/components/code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-numberfield>`](#/components/numberfield/index.md) : Numeric field with an optional native range slider.
- [`<tp-radio-list>`](#/components/radio-list/index.md) : Transforms a list into a group of radio buttons.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
