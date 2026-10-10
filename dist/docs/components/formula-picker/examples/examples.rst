.. tp-restructuredtext-viewer::
   :label: tp-formula-picker
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-formula-picker::

      .. example:: Selection event

         .. tp-formula-picker::
            :id: formula-event-picker

         .. tp-textfield::
            :id: formula-event-result
            :label: Selected formula
            :placeholder: Select a formula
            :clearable:

         .. script::
            :type: module

            const picker = document.querySelector("#formula-event-picker");
            const result = document.querySelector("#formula-event-result");
            await customElements.whenDefined("tp-textfield");
            picker.addEventListener("tp-formula-picker-select", (event) => {
              result.value = event.detail.formula;
            });
