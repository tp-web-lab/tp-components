<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="map" library="components" size="1.25em"></tp-icon> Map

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-map>` element displays an interactive OpenStreetMap with named markers and GPX routes or tracks.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-map lat="48.3904" lon="-4.4861" zoom="13" title="Brest, Brittany, France" marker=""></tp-map>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-map" src="/docs/components/map/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

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

### Programming notes

Set `lat`, `lon`, `zoom`, `title` or `marker` to update the map. Consecutive attribute changes are grouped. `locate()` requests the visitor's position; obsolete responses are ignored after removal or a change of coordinates. Removing the component releases the map and its observers; reconnecting it creates a fresh map.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Explore Brest by dragging the map or using its keyboard controls. Select the marker to read its location name; the location button requests permission before using your position.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

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

tp-latex
: ::include{examples/examples-latex.html}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button-group>`](#/components/button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-callout>`](#/components/callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-xy-plot>`](#/components/xy-plot/index.md) : XY graph rendering component.

### External

<!--
@credit Leaflet https://leafletjs.com/
@summary Interactive geographic maps.
-->
<!--
@credit OpenStreetMap https://www.openstreetmap.org/copyright
@summary Map tiles and geographic data; attribution required.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [Leaflet](https://leafletjs.com/) : Interactive geographic maps.
- [OpenStreetMap](https://www.openstreetmap.org/copyright) : Map tiles and geographic data; attribution required.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
