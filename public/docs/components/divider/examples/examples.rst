.. tp-restructuredtext-viewer::
   :label: tp-divider
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            Primary content group.

            .. tp-divider::

            Secondary content group.

      .. example:: Custom style

         .divider-custom-style tp-divider { --tp-divider-color: var(--tp-brand-fill-mid); --tp-divider-thickness: 4px; --tp-divider-margin-block: 0.75rem; }

         .. tp-box::

            Before the custom divider.

            .. tp-divider::

            After the custom divider.

      .. example:: Dropdown menu

         .. tp-dropdown::
            :open:

            - Load
            - Save
