.. tp-restructuredtext-viewer::
   :label: tp-xy-plot
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-xy-plot::

            .. script::
               :type: tp/xy-plot

               xyFunctionGraph
                 title "Functions"
                 x-axis [-10,10]
                 y-axis [-5,5]
                 functions [["Sine", "2*sin(x)"], ["Line", "x/2"]]

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - no-legend

               - settings

            .. tp-radio-list::
               :data-setting: axis
               :label: axis
               :label-position: top
               :orientation: horizontal
               :value: 1

               - both

               - horizontal

               - vertical

               - none

            .. tp-radio-list::
               :data-setting: grid
               :label: grid
               :label-position: top
               :orientation: horizontal
               :value: 1

               - both

               - horizontal

               - vertical

               - none

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
            :title: xy-plot attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /tp-components/docs/components/xy-plot/examples/attributes.js

      .. example:: Author directives

         Open Graph settings below the graph to edit its definition. Try the grid, axis positions, curves and points, then use Reset to restore the original graph.

         .. tp-xy-plot::
            :settings:

            .. script::
               :type: tp/xy-plot

               xyFunctionGraph
                 title "Editable graph"
                 legend-x "x"
                 legend-y "f(x)"
                 x-axis [-4, 6]
                 y-axis [-2, 10]
                 x-ticks [-4, -2, 0, 2, 4, 6]
                 y-ticks [-2, 0, 2, 4, 6, 8, 10]
                 grid both
                 x-axis-at 0
                 y-axis-at 0
                 samples 256
                 functions [["Parabola", "x*x", [-2, 3]], ["Line", "x+1"]]
                 points [["A", 2, 4, 10, -10]]

      .. example:: Numeric data (setData)

         Plot measured elevations with setData(). Add measurements to extend the profile and automatically adjust the axes; Reset restores the initial data. The dashed line connects the first and last measurements.

         .. tp-button-group::

            .. tp-button::
               :id: measurements-add
               :type: button

               Add measurements

            .. tp-button::
               :id: measurements-reset
               :type: button

               Reset

         .. tp-xy-plot::
            :id: measurements-plot

         .. script::
            :type: module

            await customElements.whenDefined("tp-xy-plot");
            const plot = document.getElementById("measurements-plot");
            const add = document.getElementById("measurements-add");
            const reset = document.getElementById("measurements-reset");
            const initial = [
              { x: 0, y: 120 },
              { x: 1, y: 145 },
              { x: 2, y: 135 },
              { x: 3, y: 180 }
            ];

            function render(extended = false) {
              const measurements = extended
                ? [...initial, { x: 4, y: 165 }, { x: 5, y: 210 }]
                : initial;
              const first = measurements[0];
              const last = measurements[measurements.length - 1];
              plot.setData({
                title: "Measured elevation",
                xLabel: "Distance (km)",
                yLabel: "Elevation (m)",
                series: [
                  { label: "Measurements", points: measurements },
                  { label: "First to last", points: [first, last], dashed: true }
                ],
                points: [{ ...last, label: "Last measurement", dx: -120, dy: -12 }]
              });
              add.toggleAttribute("disabled", extended);
            }

            add.addEventListener("click", () => render(true));
            reset.addEventListener("click", () => render());
            render();

      .. example:: Line styles and vectors

         Compare the four curve styles and their legend samples. Open Graph settings to change styles or the vector components.

         .. tp-xy-plot::
            :settings:

            .. script::
               :type: tp/xy-plot

               xyFunctionGraph
                title "Line styles and a vector"
                x-axis [-4, 4]
                y-axis [-4, 4]
                functions [["Solid", "sin(x)+2", "solid"], ["Dashed", "sin(x)", "dashed"], ["Dotted", "sin(x)-2", "dotted"], ["Dash-dot", "x/2", "dash-dot", [-3, 3]]]
                vectors [["u", -2, -3, 3, 2]]

      .. example:: Vectors only

         The vectors u and v are successive displacements; w is their resultant. Open Graph settings to change an origin or a component.

         .. tp-xy-plot::
            :settings:

            .. script::
               :type: tp/xy-plot

               xyFunctionGraph
                title "Vector addition"
                x-axis [-1, 5]
                y-axis [-1, 5]
                vectors [["u", 0, 0, 3, 1], ["v", 3, 1, -1, 3, "dashed"], ["w", 0, 0, 2, 4, "dotted"]]
                points [["O", 0, 0]]

      .. example:: Step-by-step reveal

         .. tp-xy-plot::
            :settings:

            .. script::
               :type: tp/xy-plot

               xyFunctionGraph
                 title "Step-by-step reveal"
                 x-axis [-2, 4]
                 y-axis [-2, 6]
                 functions [["Reference", "x", "dotted"], ["Parabola", "x*x"]]
                 points [["A", 1, 1]]
                 vectors [["u", 1, 1, 1, 2]]
                 anim ["A", "u", "Parabola"]
