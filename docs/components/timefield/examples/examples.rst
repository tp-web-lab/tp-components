.. tp-restructuredtext-viewer::
   :label: tp-timefield
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-timefield::
            :label: Time
            :value: 14:30
            :clearable:

      .. example:: Attributes

         Change several attributes on one preview. All controls start at their documented defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Reset defaults fills the controls with their defaults again. Controls stay available when the preview is disabled or readonly.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: timefield-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - clearable

               - disabled

               - readonly

               - required

            .. tp-radio-list::
               :data-setting: label-position
               :label: label-position
               :label-position: top
               :orientation: horizontal
               :value: 1

               - top

               - bottom

               - start

               - end

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: autocomplete
                  :label: autocomplete
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: label
                  :label: label
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: max
                  :label: max
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: min
                  :label: min
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: name
                  :label: name
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: placeholder
                  :label: placeholder
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: step
                  :label: step
                  :value: 60
                  :placeholder: 60
                  :clearable:

               .. tp-textfield::
                  :data-setting: value
                  :label: value
                  :value:
                  :placeholder:
                  :clearable:

            .. tp-button::
               :id: timefield-reset
               :type: button

               Reset defaults

         .. tp-divider::

         .. h3::

            Preview

         .. tp-box::

            .. tp-timefield::
               :id: timefield-preview

         .. tp-box::
            :id: timefield-readout
            :aria-live: polite

            Reading native attributes…

         .. tp-callout::
            :variant: info
            :heading: Things to try

            Set label and enter a time such as 14:30 in value. Use HH:MM or HH:MM:SS for min and max; step is measured in seconds (60 by default). Change the native time and observe the value setting update. Enable clearable to show the clear button; it is hidden otherwise.

         .. script::
            :type: module
            :src: /tp-components/docs/components/timefield/examples/attributes.js

      .. example:: Inline named field

         .. role:: example-tp-timefield-1(tp-timefield)
            :value: 14:30
            :placeholder: Enter a value

         Value: :example-tp-timefield-1:`identifier`
