.. tp-restructuredtext-viewer::
   :label: tp-diagram
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-diagram::
            :label: Request flow

            .. script::
               :type: tp/diagram

               flowchart LR
                 Browser --> Server
                 Server --> Database

      .. example:: Javascript API

         .. script::
            :type: module

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

      .. example:: Architecture diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/architecture.mmd
            :label: Architecture diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/architecture.mmd
            :label: Architecture diagram
            :engine: pele

      .. example:: Block diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/block.mmd
            :label: Block diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/block.mmd
            :label: Block diagram
            :engine: pele

      .. example:: C4 diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/c4.mmd
            :label: C4 diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/c4.mmd
            :label: C4 diagram
            :engine: pele

      .. example:: Class diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/class.mmd
            :label: Class diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/class.mmd
            :label: Class diagram
            :engine: pele

      .. example:: Cynefin framework

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/cynefin.mmd
            :label: Cynefin framework
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/cynefin.mmd
            :label: Cynefin framework
            :engine: pele

      .. example:: Entity relationship diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/entity-relationship.mmd
            :label: Entity relationship diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/entity-relationship.mmd
            :label: Entity relationship diagram
            :engine: pele

      .. example:: Event modeling diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/event-modeling.mmd
            :label: Event modeling diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/event-modeling.mmd
            :label: Event modeling diagram
            :engine: pele

      .. example:: Flowchart

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/flowchart.mmd
            :label: Flowchart
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/flowchart.mmd
            :label: Flowchart
            :engine: pele

      .. example:: Gantt diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/gantt.mmd
            :label: Gantt diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/gantt.mmd
            :label: Gantt diagram
            :engine: pele

      .. example:: Git graph

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/git-graph.mmd
            :label: Git graph
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/git-graph.mmd
            :label: Git graph
            :engine: pele

      .. example:: Ishikawa diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/ishikawa.mmd
            :label: Ishikawa diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/ishikawa.mmd
            :label: Ishikawa diagram
            :engine: pele

      .. example:: Kanban diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/kanban.mmd
            :label: Kanban diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/kanban.mmd
            :label: Kanban diagram
            :engine: pele

      .. example:: Mind map

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/mindmap.mmd
            :label: Mind map
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/mindmap.mmd
            :label: Mind map
            :engine: pele

      .. example:: Packet diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/packet.mmd
            :label: Packet diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/packet.mmd
            :label: Packet diagram
            :engine: pele

      .. example:: Pie chart

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/pie.mmd
            :label: Pie chart
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/pie.mmd
            :label: Pie chart
            :engine: pele

      .. example:: Quadrant chart

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/quadrant.mmd
            :label: Quadrant chart
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/quadrant.mmd
            :label: Quadrant chart
            :engine: pele

      .. example:: Radar chart

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/radar.mmd
            :label: Radar chart
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/radar.mmd
            :label: Radar chart
            :engine: pele

      .. example:: Requirement diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/requirement.mmd
            :label: Requirement diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/requirement.mmd
            :label: Requirement diagram
            :engine: pele

      .. example:: Sankey diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/sankey.mmd
            :label: Sankey diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/sankey.mmd
            :label: Sankey diagram
            :engine: pele

      .. example:: Sequence diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/sequence.mmd
            :label: Sequence diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/sequence.mmd
            :label: Sequence diagram
            :engine: pele

      .. example:: State diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/state.mmd
            :label: State diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/state.mmd
            :label: State diagram
            :engine: pele

      .. example:: Swimlanes diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/swimlanes.mmd
            :label: Swimlanes diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/swimlanes.mmd
            :label: Swimlanes diagram
            :engine: pele

      .. example:: Timeline

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/timeline.mmd
            :label: Timeline
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/timeline.mmd
            :label: Timeline
            :engine: pele

      .. example:: TreeView diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/tree-view.mmd
            :label: TreeView diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/tree-view.mmd
            :label: TreeView diagram
            :engine: pele

      .. example:: Treemap

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/treemap.mmd
            :label: Treemap
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/treemap.mmd
            :label: Treemap
            :engine: pele

      .. example:: User journey

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/user-journey.mmd
            :label: User journey
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/user-journey.mmd
            :label: User journey
            :engine: pele

      .. example:: Venn diagram

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/venn.mmd
            :label: Venn diagram
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/venn.mmd
            :label: Venn diagram
            :engine: pele

      .. example:: Wardley map

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/wardley.mmd
            :label: Wardley map
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/wardley.mmd
            :label: Wardley map
            :engine: pele

      .. example:: XY chart

         .. h6::

            `Mermaid <https://mermaid.ai>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/xy-chart.mmd
            :label: XY chart
            :engine: mermaid

         .. h6::

            `Pele <https://pele.run>`_

         .. tp-diagram::
            :src: /docs/components/diagram/examples/xy-chart.mmd
            :label: XY chart
            :engine: pele
