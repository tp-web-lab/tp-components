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

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-radio-list::
               :data-setting: src
               :label: src
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default

               - file1

               - file2

               - file-unknown

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: label
                  :label: label
                  :value: Diagram
                  :placeholder: Diagram
                  :clearable:

            .. tp-button-group::

               .. tp-button::
                  :id: attributes-reset
                  :type: button

                  Reset defaults

               .. tp-button::
                  :id: attributes-reload
                  :type: button

                  Reload preview

         .. tp-divider::

         .. h3::

            Preview

         .. tp-iframe::
            :id: attributes-frame
            :title: diagram attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /docs/components/diagram/examples/attributes.js

      .. example:: Architecture diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/architecture.mmd
            :label: Architecture diagram

      .. example:: Block diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/block.mmd
            :label: Block diagram

      .. example:: C4 diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/c4.mmd
            :label: C4 diagram

      .. example:: Class diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/class.mmd
            :label: Class diagram

      .. example:: Cynefin framework

         .. tp-diagram::
            :src: /docs/components/diagram/examples/cynefin.mmd
            :label: Cynefin framework

      .. example:: Entity relationship diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/entity-relationship.mmd
            :label: Entity relationship diagram

      .. example:: Event modeling diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/event-modeling.mmd
            :label: Event modeling diagram

      .. example:: Flowchart

         .. tp-diagram::
            :src: /docs/components/diagram/examples/flowchart.mmd
            :label: Flowchart

      .. example:: Gantt diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/gantt.mmd
            :label: Gantt diagram

      .. example:: Git graph

         .. tp-diagram::
            :src: /docs/components/diagram/examples/git-graph.mmd
            :label: Git graph

      .. example:: Ishikawa diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/ishikawa.mmd
            :label: Ishikawa diagram

      .. example:: Kanban diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/kanban.mmd
            :label: Kanban diagram

      .. example:: Mind map

         .. tp-diagram::
            :src: /docs/components/diagram/examples/mindmap.mmd
            :label: Mind map

      .. example:: Packet diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/packet.mmd
            :label: Packet diagram

      .. example:: Pie chart

         .. tp-diagram::
            :src: /docs/components/diagram/examples/pie.mmd
            :label: Pie chart

      .. example:: Quadrant chart

         .. tp-diagram::
            :src: /docs/components/diagram/examples/quadrant.mmd
            :label: Quadrant chart

      .. example:: Radar chart

         .. tp-diagram::
            :src: /docs/components/diagram/examples/radar.mmd
            :label: Radar chart

      .. example:: Requirement diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/requirement.mmd
            :label: Requirement diagram

      .. example:: Sankey diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/sankey.mmd
            :label: Sankey diagram

      .. example:: Sequence diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/sequence.mmd
            :label: Sequence diagram

      .. example:: State diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/state.mmd
            :label: State diagram

      .. example:: Swimlanes diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/swimlanes.mmd
            :label: Swimlanes diagram

      .. example:: Timeline

         .. tp-diagram::
            :src: /docs/components/diagram/examples/timeline.mmd
            :label: Timeline

      .. example:: TreeView diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/tree-view.mmd
            :label: TreeView diagram

      .. example:: Treemap

         .. tp-diagram::
            :src: /docs/components/diagram/examples/treemap.mmd
            :label: Treemap

      .. example:: User journey

         .. tp-diagram::
            :src: /docs/components/diagram/examples/user-journey.mmd
            :label: User journey

      .. example:: Venn diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/venn.mmd
            :label: Venn diagram

      .. example:: Wardley map

         .. tp-diagram::
            :src: /docs/components/diagram/examples/wardley.mmd
            :label: Wardley map

      .. example:: XY chart

         .. tp-diagram::
            :src: /docs/components/diagram/examples/xy-chart.mmd
            :label: XY chart

      .. example:: ZenUML diagram

         .. tp-diagram::
            :src: /docs/components/diagram/examples/zenuml.mmd
            :label: ZenUML diagram
