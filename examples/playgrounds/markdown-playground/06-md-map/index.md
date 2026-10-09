# Markdown OpenStreetMap

[[toc]]

This example demonstrates interactive maps using the `OpenStreetMap`
extension based on `Leaflet`.

---

## Eiffel Tower

:::map
lat=48.8584
lon=2.2945
zoom=15
marker
title="Eiffel Tower"
:::

---

## London

:::map
lat=51.5074
lon=-0.1278
zoom=11
marker
title="London"
:::

---

## New York

:::map
lat=40.7128
lon=-74.0060
zoom=12
marker
title="New York City"
:::

---

## Tokyo

:::map
lat=35.6762
lon=139.6503
zoom=12
marker
title="Tokyo"
:::

---

## Sydney

:::map
lat=-33.8688
lon=151.2093
zoom=12
marker
title="Sydney"
:::

---

## Multiple maps

Maps can appear several times in the same document.

:::map
lat=48.8566
lon=2.3522
zoom=13
marker
title="Paris"
:::

:::map
lat=41.9028
lon=12.4964
zoom=12
marker
title="Rome"
:::

---

## Minimal map

A marker is optional.

:::map
lat=46.2276
lon=2.2137
zoom=5
:::

---

## Notes

The extension automatically:

- loads Leaflet
- loads OpenStreetMap tiles
- creates interactive maps
- supports markers and popups
- supports multiple maps per page
- adapts to responsive layouts