### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | The introductory circuit is an RC low-pass filter driven by a square-wave voltage source. |
| Using the component | Its named `Vin` and `Vout` measurement points are the oscilloscope channels. |
| Measurement | Drag **Measurement** from the **Annotations** palette onto any wire, then give it a label to add another channel. |
| Run transient analysis | Press **Run transient analysis** to refresh the oscilloscope. |
| Using the component | Wires merge connected terminals into electrical nodes, and every simulatable circuit needs a ground reference. |
| Hub | A four-port **Hub** creates an electrical junction for clean branch layouts; all four ports share exactly the same potential. |
| Using the component | The oscilloscope header provides independent time and voltage calibration controls. |
| Using the component | The displayed values use `ms/div` and `V/div`; the center button restores both automatic scales. |
| Using the component | Use the `V / A` selector in the oscilloscope header to display either node voltage or signed branch current at every named measurement point. |
| Using the component | Current mode changes the legend and vertical scale to amperes. |
| Using the component | A current point placed on a direct component wire uses the component terminal as its sign reference; a point on an electrically ambiguous junction branch reports zero until it is moved to a wire adjoining a component. |
| Links | The **Links** palette provides straight and orthogonal wires without arrowheads. |
| Using the component | Analog self-links are rejected because a component terminal cannot be wired back to the same component through a single editor link. |
| Hub | The **Hub** is the single four-way equipotential junction used to lay out branches. |
| Open or close selected switch | A switch can be open or closed; select it and use **Open or close selected switch** in the lower toolbar. |
| Using the component | An open switch has a very high resistance, while a closed switch behaves as an ideal conductor. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
