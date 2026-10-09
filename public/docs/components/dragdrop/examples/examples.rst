.. tp-restructuredtext-viewer::
   :label: tp-dragdrop
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :id: dragdrop-board
            :data-dragdrop-demo:
            :data-allow-script:

            Drag a task to **To do** or **Done**, including an empty column. The Move button sends a task to the other column without dragging.

            Keyboard: focus a card, press Enter, use the arrow keys to choose another card, then press Enter to drop before or after it. Escape cancels.

            .. tp-grid::
               :min-width: 16rem
               :gap: 1rem

               .. tp-box::
                  :data-zone: To do
                  :role: group
                  :aria-label: To do
                  :style: min-height: 12rem;

                  .. h3::

                     To do

                  .. tp-stack::
                     :gap: 0.5rem
                     :data-tasks:

                     .. tp-box::
                        :data-task:
                        :aria-label: Write the introduction

                        Write the introduction

                        .. tp-button::
                           :data-move:
                           :size: s
                           :aria-label: Move Write the introduction to the other column

                           Move

                     .. tp-box::
                        :data-task:
                        :aria-label: Review the examples

                        Review the examples

                        .. tp-button::
                           :data-move:
                           :size: s
                           :aria-label: Move Review the examples to the other column

                           Move

               .. tp-box::
                  :data-zone: Done
                  :role: group
                  :aria-label: Done
                  :style: min-height: 12rem;

                  .. h3::

                     Done

                  .. tp-stack::
                     :gap: 0.5rem
                     :data-tasks:

                     .. tp-box::
                        :data-task:
                        :aria-label: Choose a title

                        Choose a title

                        .. tp-button::
                           :data-move:
                           :size: s
                           :aria-label: Move Choose a title to the other column

                           Move

            .. p::
               :data-demo-status:
               :role: status
               :aria-live: polite

               Move a task to change its column.

            .. tp-dragdrop::
               :root: #dragdrop-board
               :items: [data-task]

            .. script::
               :src: /docs/components/dragdrop/examples/task-board.js

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: handle
                  :label: handle
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: items
                  :label: items
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: root
                  :label: root
                  :value:
                  :placeholder:
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
            :title: dragdrop attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/dragdrop/examples/attributes.js

      .. example:: Sortable list

         .. tp-box::
            :id: dragdrop-sortable
            :data-sortable-demo:
            :data-allow-script:

            Arrange these steps in the order you prefer. Drag an entry above or below another entry, or use its Up and Down buttons.

            Keyboard: Tab to an entry, press Enter or Space to grab it, use the arrow keys to choose a position, then press Enter or Space to drop. Escape cancels.

            .. ol::
               :aria-label: Publishing steps

               .. li::
                  :aria-label: Publish the document

                  .. tp-box::

                     .. tp-cluster::
                        :justify: space-between

                        .. span::

                           Publish the document

                        .. tp-button-group::

                           .. tp-icon-button::
                              :name: arrow-up
                              :data-direction: up
                              :label: Move Publish the document up

                           .. tp-icon-button::
                              :name: arrow-down
                              :data-direction: down
                              :label: Move Publish the document down

               .. li::
                  :aria-label: Write a draft

                  .. tp-box::

                     .. tp-cluster::
                        :justify: space-between

                        .. span::

                           Write a draft

                        .. tp-button-group::

                           .. tp-icon-button::
                              :name: arrow-up
                              :data-direction: up
                              :label: Move Write a draft up

                           .. tp-icon-button::
                              :name: arrow-down
                              :data-direction: down
                              :label: Move Write a draft down

               .. li::
                  :aria-label: Review the content

                  .. tp-box::

                     .. tp-cluster::
                        :justify: space-between

                        .. span::

                           Review the content

                        .. tp-button-group::

                           .. tp-icon-button::
                              :name: arrow-up
                              :data-direction: up
                              :label: Move Review the content up

                           .. tp-icon-button::
                              :name: arrow-down
                              :data-direction: down
                              :label: Move Review the content down

               .. li::
                  :aria-label: Plan the document

                  .. tp-box::

                     .. tp-cluster::
                        :justify: space-between

                        .. span::

                           Plan the document

                        .. tp-button-group::

                           .. tp-icon-button::
                              :name: arrow-up
                              :data-direction: up
                              :label: Move Plan the document up

                           .. tp-icon-button::
                              :name: arrow-down
                              :data-direction: down
                              :label: Move Plan the document down

            .. tp-button::
               :data-reset:
               :outlined:

               Reset order

            .. p::
               :data-sort-status:
               :role: status
               :aria-live: polite

               The list is ready to reorder.

            .. tp-dragdrop::
               :root: #dragdrop-sortable
               :items: ol > li

            .. script::
               :src: /docs/components/dragdrop/examples/sortable-list.js

      .. example:: Tree drag and drop

         .. tp-box::

            Organize this project by dragging files or folders. Try moving **notes.md** into **Documentation**, then move **index.html** above **app.js**.

            Drop in the middle of a folder row to move an item into it, or near the top or bottom of a row to insert it before or after that item. The tree highlights the destination. Moving a folder also moves its children.

            Use the disclosure buttons to expand or collapse folders. Keyboard arrow keys navigate the tree; they do not perform drag and drop in this example.

            .. tp-tree::
               :draggable:
               :selectable:
               :guides:
               :level: 3
               :aria-label: Project files

               - Project

                 - Documentation

                   - README.md

                   - guide.md

                 - Source

                   - app.js

                   - index.html

                 - notes.md
