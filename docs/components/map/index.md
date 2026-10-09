# <tp-icon name="map" library="components" size="1.25em"></tp-icon> Map

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-map>` element implements the map functionality: displays an interactive OpenStreetMap with named markers and GPX routes or tracks.

<tp-map lat="48.3904" lon="-4.4861" zoom="13" title="Brest, Brittany, France" marker></tp-map>

The component uses [Leaflet](https://leafletjs.com/) and [OpenStreetMap](https://www.openstreetmap.org/).

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Drag the map | Explore the surrounding area without moving the configured marker. |
| Zoom in / Zoom out | Change the map scale. Controls are disabled at the zoom limits. Double-click also zooms in; touch devices support pinch zoom. |
| Use my location | Ask the browser for location permission and center the map on your position. Refusal or unavailability displays a warning and preserves the previous coordinates. |
| Location marker | Open its title popup when a title is provided. Use the popup's close button to dismiss it. |
| Mouse wheel | Scroll the page; it does not zoom the map. |
| Route or track line | Follow the recorded path visually. Separate recording segments are not joined. Lines have no additional click action and do not provide navigation guidance. |
| Elevation profile: Zoom / Close | Open the profile in a larger dialog, then close it to return to the map. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between toolbar buttons, the map, its marker and attribution links. |
| Enter / Space | Activate a focused toolbar button or the profile's Zoom and Close buttons. Enter opens a focused marker's popup. |
| Arrow keys | Pan the focused map. |
| + / - | Zoom the focused map in or out. |
| Escape | Close an open popup or the enlarged elevation profile. |
| Ctrl+? | Open User Help for the component under the pointer, falling back to the focused component. Include Shift if needed to type ?. |

### Author directives

Supply `lat` and `lon` in decimal degrees, `zoom` from 0 to 19, and a meaningful `title`. The defaults show Paris at zoom 13. Invalid or empty numeric values use their defaults; finite values are clamped to their supported ranges and zoom is rounded down. The map projection cannot display the poles.

Add the boolean `marker` attribute to show the configured point. Without it, no marker is drawn. `title` names the map region and the marker popup; its content is plain text, not HTML. Provide a nearby textual description when a geographic relationship is essential to understanding the page.

For multiple markers, place a `dl` directly inside the component. Each `dt` provides a marker's plain-text title and its following `dd` contains `latitude, longitude` in decimal degrees. The list replaces the single-marker configuration, even when `marker` is absent or the list is empty. The component retains the original list without displaying it and updates the markers when its entries change. Invalid or incomplete pairs are skipped with a warning, rather than silently moving a marker to a default location.

Add `fit-markers` to frame all valid markers with padding. Fitting runs on initialization, when the marker coordinates change, or when this attribute is enabled; it does not prevent subsequent manual panning or zooming. A single location is framed at a maximum zoom of 16. Without `fit-markers`, `lat`, `lon` and `zoom` control the initial viewport. With a list, `title` names the map as a whole; the individual titles come from the `dt` entries. Geolocation recenters the viewport without changing the authored list.

Use `src` to load a [GPX file](https://www.topografix.com/GPX/1/1/) through the library's common URL-resolution and text-loading mechanism. Tracks (`trk`) are drawn as separate `trkseg` lines, routes (`rte`) as independent lines, and waypoints (`wpt`) as markers named by their `name` element. Unnamed waypoints use “Waypoint”. GPX markers supplement those declared in the page; neither `marker` nor a `dl` is required for them. Timestamps and extension data are not displayed. This is a geographic display, not route calculation, guidance or a safety assessment.

Add the boolean `elevation-profile` attribute to display a [`tp-xy-plot`](../xy-plot/index.md) below the map. It plots GPX `ele` values in metres against cumulative horizontal distance in kilometres, calculated from consecutive latitude/longitude pairs using great-circle distances (mean Earth radius 6,371 km). This is an approximate geographic distance, not a terrain-following 3D distance. It does not use `time` or calculate speed. The profile follows the map's configured width; `--tp-map-height` still controls the map viewport only.

Each route or track segment starts a separate profile section at the previous section's cumulative distance: no extra distance or line is invented across recording gaps. Missing or invalid elevations interrupt the profile without discarding the corresponding geographic points from the map or the distance calculation. Zero and negative elevations are valid; isolated valid samples appear as points. Files without usable track/route elevation data show an informational callout. Toggling the profile does not reload the file, and removing or replacing `src` removes the previous profile. In **Attributes**, enable the profile and choose `file2` to use Ouessant's elevations; `file1` demonstrates the missing-elevation message.

The lowest and highest recorded elevations are marked on the profile with **Min** and **Max** labels in metres, including in the enlarged view. When several samples share an extreme elevation, the first occurrence is marked. A flat profile uses a single **Min / Max** marker.

A summary above the chart shows cumulative ascent (**D+**), descent (**D−**, expressed as a positive magnitude), and minimum and maximum elevations in metres. The extrema also remain marked on the curve. Ascent and descent are the sums of positive and negative elevation differences between consecutive valid samples within each continuous section; neither recording gaps nor missing elevations contribute a jump. Values are calculated from the recorded elevations without smoothing, so measurement noise can increase the totals.

Two dashed horizontal lines show the **Mean** and **Median** of the discrete elevation samples, with their values and dashed samples in the legend. The elevation profile remains solid. Every valid sample has equal weight, independently of distance or time. For an even number of samples, the median averages the two central sorted values. Equal mean and median lines overlap. Displayed statistics are rounded to two decimal places, while the plotted lines retain the calculated precision.

`fit-content` frames both the lines and all markers; it takes precedence over `fit-markers`, which continues to frame markers only. Both attributes default to absent (false). After fitting, users can pan and zoom normally. Removing `src` removes the GPX geometry but retains authored markers. Switching sources cancels obsolete requests and removes the previous file's geometry; ordinary zoom, title or marker changes reuse the loaded file without fetching it again. Reassign `src` or use Reload preview to retry a failed file.

GPX 1.0 and 1.1 namespaces, prefixed namespaces and unnamespaced files are supported. The component validates XML and coordinate ranges but does not perform full schema validation. Malformed files, invalid coordinates or files without usable geometry display a warning while authored markers remain available. Segments with fewer than two points are not drawn. Document types and custom entities are rejected; labels are plain text, never executable HTML. Parsing is limited to 5,000,000 text characters and 50,000 points. Files must be served by your site or a remote server allowing CORS; `src` is a URL, not a local file-picker control. The GPX content is parsed in the browser without uploading it to a conversion service; the displayed area still determines the external map-tile requests described below.

In **Attributes**, `file1` is a synthetic two-segment Brest track, `file2` a recorded track in northeastern Ouessant, and `file-unknown` deliberately tests failure. Enable `fit-content` after choosing a file to frame its geometry. These examples do not provide navigation guidance or certify current access conditions. Provide an adjacent textual description for visitors who cannot perceive the route visually.

Changing coordinates recenters the map. Changing zoom preserves the current viewport center. Direct zoom interactions update the `zoom` attribute; dragging does not change the configured coordinates. Set `--tp-map-height` to change the default 24rem viewport height and `--tp-map-width` to change its default width of 100%. The map viewport never exceeds the available container width, including beside the table of contents, and responds to changes in both dimensions.

```css
tp-map {
  --tp-map-width: 40rem;
  --tp-map-height: 25rem;
}
```

The options follow the map extension of `@tp/tp-markdown`, but this component does not request geolocation automatically. Only **Use my location** (or an explicit call to `locate()`) requests it. Geolocation needs a secure context and browser permission; an embedded frame may be restricted by its host's permissions policy.

Leaflet is loaded on demand. Map tiles are requested from OpenStreetMap's public tile service, which receives the visitor's network information and the requested map area. Keep the visible attribution and comply with the [tile usage policy](https://operations.osmfoundation.org/policies/tiles/): no bulk downloading or offline prefetching. The service is best-effort; failed tile requests produce a warning. Account for these external requests in your site's privacy information. Do not disable the browser's Referer header for this service.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Explore Brest by dragging the map or using its keyboard controls. Select the marker to read its location name; the location button requests permission before using your position.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Multiple markers
: Explore Brest and Rennes on a map fitted to both places. Select each marker to read its own title; zooming and panning remain available after the initial framing.

GPX track
: Load an illustrative Brest track with two disconnected recording segments and named waypoints, plus a marker declared in the page. The visible gap is preserved; this synthetic example is not a navigation guide.

GPX route
: Explore a recorded track in northeastern Ouessant and its altitude profile below the map. Compare elevation in metres against cumulative distance in kilometres; the three recording segments remain separate. Use the profile’s Zoom button for a larger chart.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

Set `lat`, `lon`, `zoom`, `title` or `marker` to update the map. Consecutive attribute changes are grouped. `locate()` requests the visitor's position; obsolete responses are ignored after removal or a change of coordinates. Removing the component releases the map and its observers; reconnecting it creates a fresh map.

### API

<!-- tp-docgen:api TpMap -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>elevation-profile</code> | <code>boolean</code> | <code>false</code> | Shows GPX altitude in metres against cumulative distance in kilometres below the map. |
  | <code>fit-content</code> | <code>boolean</code> | <code>false</code> | Fits markers and GPX geometry together; takes precedence over fit-markers. |
  | <code>fit-markers</code> | <code>boolean</code> | <code>false</code> | Fits the viewport to the markers when their locations change or fitting is enabled. |
  | <code>lat</code> | <code>number</code> | <code>48.8566</code> | Latitude of the configured location, between -90 and 90. |
  | <code>lon</code> | <code>number</code> | <code>2.3522</code> | Longitude of the configured location, between -180 and 180. |
  | <code>marker</code> | <code>boolean</code> | <code>false</code> | Shows a marker at the configured coordinates when no location list is supplied. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of a GPX file containing tracks, routes or waypoints. |
  | <code>title</code> | <code>string</code> | <code>&quot;&quot;</code> | Accessible map name and optional marker popup text. |
  | <code>zoom</code> | <code>number</code> | <code>13</code> | Zoom level from 0 to 19. |
  [Attributes of `<tp-map>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>locate</code> | <code>locate(): void</code> | Requests geolocation only following an explicit user action; stale replies are ignored. |
  [Public methods of `TpMap`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-map>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-map-height</code> | <code>24rem</code> | Controls the height. |
  | <code>&#45;&#45;tp-map-width</code> | <code>100%</code> | Controls the width. |
  [CSS properties of `<tp-map>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_map.TpMap.html)
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
  <script type="module" src="/path/to/components/map/map.js"></script>
  ```

import
: ```js
  import "/path/to/components/map/map.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/map/map.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-map>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->
<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-xy-plot
@summary XY graph rendering component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-xy-plot>`](../xy-plot/index.md) : XY graph rendering component.

### External

<!--
@credit Leaflet https://leafletjs.com/
@summary Interactive geographic maps.
-->
<!--
@credit OpenStreetMap https://www.openstreetmap.org/copyright
@summary Map tiles and geographic data; attribution required.
-->

- [Leaflet](https://leafletjs.com/) : Interactive geographic maps.
- [OpenStreetMap](https://www.openstreetmap.org/copyright) : Map tiles and geographic data; attribution required.
<!-- tp-docgen:dependencies:end -->
