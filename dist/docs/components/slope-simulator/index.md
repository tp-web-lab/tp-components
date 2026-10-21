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
| Grid | Show or hide the cycling-stage grid, with distance in kilometres and absolute elevation in metres. Graduations adapt to the selected or edited profile. |
| Restart | Return that route's point to 10% of the route. |
| Profile code disclosure | Expand or collapse the profile editor and its point-unit / slope-limit legend. |
| Profile files → Load (.json) | Choose a local JSON file, validate it and replace the collection; invalid files leave the current profiles unchanged. |
| Profile files → Save / Save as (.json) | Save the selected profile’s current editor text. Save reuses its destination; Save as chooses another one. Browsers without direct file access download the file. |
| F1 toolbar button | Show or hide the code editor toolbar. |
| Profile code editor | Edit the selected profile JSON; changes remain a draft until applied. |
| Play (Apply profile) | Validate and apply the selected profile, or replace the collection when the JSON contains multiple profiles; reset the point to 10%. Invalid JSON or a slope beyond ±20% keeps the curve and draft unchanged. |
| Refresh (Restore original profile) | Restore the selected profile and its code as originally loaded, discarding its edits. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Focus the slope slider, clear button, points, profile choices and restart buttons. |
| Left / Right on a point | Move left / right with slope-dependent effort. Holding a key repeats the movement. |
| Arrow keys on the slope slider | Adjust the slope. |
| Arrow keys on profile choices | Select another stage. |
| Enter / Space on Grid | Show or hide the distance and elevation grid (hidden initially). |
| Enter / Space on a button | Clear the slope, restart a route, apply the edited profile or restore its original code and curve. |
| Enter / Space on Profile code | Expand or collapse the editor. |
| F1 in the code editor | Show or hide its toolbar. |
| Enter / Space on a file-menu command | Load, save or save as JSON. |
| Typing / arrow keys in the code editor | Edit JSON and move the caret without moving the route point. |
| Escape | End a drag at the current position. |
| Ctrl+? | Open User help for the component under the pointer, falling back to the focused component. Shift may be needed to type ?. |

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

### Author directives

#### Base speed

Set `speed-base="25"` on the component to use a fictional flat-ground speed of 25 km/h. Changes apply immediately to both badges and their explanatory notes. The value must be a finite positive number in km/h.

The JSON document can provide an optional top-level numeric field: `{"speed-base": 25, "profiles": [...]}`. This works with `src`, inline JSON, `setProfiles()`, Load and the profile editor. A valid component attribute takes precedence; otherwise the selected profile’s document value is used, falling back to 30. Removing the attribute restores that fallback. An empty or invalid attribute is ignored; an invalid JSON value rejects the document without changing the current profiles. The editor preserves the field on save and restores its original value with Refresh. Applying a single edited profile changes its base speed; applying a collection assigns its base speed to every profile.

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

Tour of Lombardy 2026
: Explore an approximate 239.6 km reconstruction from the supplied route-profile image. Compare the climbs and descents, reverse direction to change the signed slope, and edit the JSON in Profile code.

Alpe d’Huez 2026
: Explore an approximate 170.9 km reconstruction through the Croix de Fer, Télégraphe, Galibier and Sarenne passes to Alpe d’Huez. Toggle the grid, compare uphill and downhill effort, and edit the profile JSON.
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
  | <code>speed-base</code> | <code>number</code> | <code>30</code> | Fictional flat-ground speed in km/h; a positive attribute overrides the optional JSON speed-base. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | JSON file containing cycling profiles; takes precedence over the inline script. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
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

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_slope-simulator.TpSlopeSimulator.html)
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
@tp-dependency tp-dropdown
@summary Dropdown menu component.
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

- [`<tp-badge>`](../badge/index.md) : Badge component for compact status labels.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-code-editor>`](../code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-dropdown>`](../dropdown/index.md) : Dropdown menu component.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-numberfield>`](../numberfield/index.md) : Numeric field with an optional native range slider.
- [`<tp-radio-list>`](../radio-list/index.md) : Transforms a list into a group of radio buttons.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
