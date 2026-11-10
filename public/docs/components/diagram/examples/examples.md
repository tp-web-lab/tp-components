:::::: tp-markdown-viewer { label="tp-diagram" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-diagram { label="Request flow" }
::: script { type="tp/diagram" }
flowchart LR
  Browser --> Server
  Server --> Database
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/diagram/diagram.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-diagram");
element1.setAttribute("label", "Request flow");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/diagram");
element2.textContent = "\n    flowchart LR\n      Browser --> Server\n      Server --> Database\n  ";
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Architecture diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/architecture.mmd" label="Architecture diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/architecture.mmd" label="Architecture diagram" engine="pele" }
:::
```

``` example {label="Block diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/block.mmd" label="Block diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/block.mmd" label="Block diagram" engine="pele" }
:::
```

``` example {label="C4 diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/c4.mmd" label="C4 diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/c4.mmd" label="C4 diagram" engine="pele" }
:::
```

``` example {label="Class diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/class.mmd" label="Class diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/class.mmd" label="Class diagram" engine="pele" }
:::
```

``` example {label="Cynefin framework"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/cynefin.mmd" label="Cynefin framework" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/cynefin.mmd" label="Cynefin framework" engine="pele" }
:::
```

``` example {label="Entity relationship diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/entity-relationship.mmd" label="Entity relationship diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/entity-relationship.mmd" label="Entity relationship diagram" engine="pele" }
:::
```

``` example {label="Event modeling diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/event-modeling.mmd" label="Event modeling diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/event-modeling.mmd" label="Event modeling diagram" engine="pele" }
:::
```

``` example {label="Flowchart"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/flowchart.mmd" label="Flowchart" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/flowchart.mmd" label="Flowchart" engine="pele" }
:::
```

``` example {label="Gantt diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/gantt.mmd" label="Gantt diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/gantt.mmd" label="Gantt diagram" engine="pele" }
:::
```

``` example {label="Git graph"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/git-graph.mmd" label="Git graph" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/git-graph.mmd" label="Git graph" engine="pele" }
:::
```

``` example {label="Ishikawa diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/ishikawa.mmd" label="Ishikawa diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/ishikawa.mmd" label="Ishikawa diagram" engine="pele" }
:::
```

``` example {label="Kanban diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/kanban.mmd" label="Kanban diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/kanban.mmd" label="Kanban diagram" engine="pele" }
:::
```

``` example {label="Mind map"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/mindmap.mmd" label="Mind map" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/mindmap.mmd" label="Mind map" engine="pele" }
:::
```

``` example {label="Packet diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/packet.mmd" label="Packet diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/packet.mmd" label="Packet diagram" engine="pele" }
:::
```

``` example {label="Pie chart"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/pie.mmd" label="Pie chart" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/pie.mmd" label="Pie chart" engine="pele" }
:::
```

``` example {label="Quadrant chart"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/quadrant.mmd" label="Quadrant chart" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/quadrant.mmd" label="Quadrant chart" engine="pele" }
:::
```

``` example {label="Radar chart"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/radar.mmd" label="Radar chart" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/radar.mmd" label="Radar chart" engine="pele" }
:::
```

``` example {label="Requirement diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/requirement.mmd" label="Requirement diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/requirement.mmd" label="Requirement diagram" engine="pele" }
:::
```

``` example {label="Sankey diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/sankey.mmd" label="Sankey diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/sankey.mmd" label="Sankey diagram" engine="pele" }
:::
```

``` example {label="Sequence diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/sequence.mmd" label="Sequence diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/sequence.mmd" label="Sequence diagram" engine="pele" }
:::
```

``` example {label="State diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/state.mmd" label="State diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/state.mmd" label="State diagram" engine="pele" }
:::
```

``` example {label="Swimlanes diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/swimlanes.mmd" label="Swimlanes diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/swimlanes.mmd" label="Swimlanes diagram" engine="pele" }
:::
```

``` example {label="Timeline"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/timeline.mmd" label="Timeline" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/timeline.mmd" label="Timeline" engine="pele" }
:::
```

``` example {label="TreeView diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/tree-view.mmd" label="TreeView diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/tree-view.mmd" label="TreeView diagram" engine="pele" }
:::
```

``` example {label="Treemap"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/treemap.mmd" label="Treemap" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/treemap.mmd" label="Treemap" engine="pele" }
:::
```

``` example {label="User journey"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/user-journey.mmd" label="User journey" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/user-journey.mmd" label="User journey" engine="pele" }
:::
```

``` example {label="Venn diagram"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/venn.mmd" label="Venn diagram" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/venn.mmd" label="Venn diagram" engine="pele" }
:::
```

``` example {label="Wardley map"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/wardley.mmd" label="Wardley map" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/wardley.mmd" label="Wardley map" engine="pele" }
:::
```

``` example {label="XY chart"}
###### [Mermaid](https://mermaid.ai)

::: tp-diagram { src="/docs/components/diagram/examples/xy-chart.mmd" label="XY chart" engine="mermaid" }
:::

###### [Pele](https://pele.run)

::: tp-diagram { src="/docs/components/diagram/examples/xy-chart.mmd" label="XY chart" engine="pele" }
:::
```
:::::
::::::
