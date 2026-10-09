Shoelace web components
=======================

.. contents:: Contents
   :depth: 2

Introduction
------------

This example demonstrates the ``web-component`` and ``slot`` directives with
Shoelace web components.

Card
----

.. web-component:: sl-card
   :attributes: class="card-overview"

   .. slot:: image

      .. image:: https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80
          :alt: A kitten sits patiently between a terracotta pot and decorative grasses.

   .. slot:: header

      **Shoelace Card**

   This card uses named slots generated from reStructuredText directives.

   - ``image``
   - ``header``
   - default slot
   - ``footer``

   The content you are currently reading belongs to the default slot.

   .. slot:: footer

      .. raw:: html

         <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
           <sl-button variant="primary">Primary action</sl-button>
           <sl-button variant="default">Secondary</sl-button>
         </div>

.. style::

    .card-overview {
      max-width: 300px;
    }

    .card-overview small {
      color: var(--sl-color-neutral-500);
    }

    .card-overview [slot='footer'] {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

Divider
-------

.. web-component:: sl-divider

Details
-------

.. web-component:: sl-details
   :attributes: summary="Expandable panel"

   This content is rendered inside a Shoelace details component.

   It can contain standard reStructuredText formatting:

   - lists
   - **bold**
   - *italic*
   - links

Alert
-----

.. web-component:: sl-alert
   :attributes: variant="primary" open

   This is a Shoelace alert component rendered from reStructuredText.

Badges
------

.. web-component:: div
   :attributes: style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;"

    .. web-component:: sl-badge
      :attributes: variant="primary"

      Primary

    .. web-component:: sl-badge
      :attributes: variant="success"

      Success

    .. web-component:: sl-badge
      :attributes: variant="warning"

      Warning

    .. web-component:: sl-badge
      :attributes: variant="danger"

      Danger



Image comparer
--------------

.. web-component:: sl-image-comparer

   .. slot:: before

      .. web-component:: img
         :attributes: src="https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80&sat=-100&bri=-5" alt="Grayscale version of kittens in a basket looking around."


   .. slot:: after

      .. image:: https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80
         :alt: Color version of kittens in a basket looking around.

Dialog trigger
--------------

.. web-component:: sl-button
   :attributes: id="open-dialog-button" variant="outline"

   Open dialog

.. web-component:: sl-dialog
   :attributes: label="Shoelace dialog"

   This dialog is declared directly inside reStructuredText.

   .. slot:: footer

      .. web-component:: sl-button
         :attributes: variant="primary" id="close-dialog-button"

         Close

.. script::
   :type: module

   const dialog = document.querySelector('sl-dialog');
   const openButton = document.getElementById('open-dialog-button');
   const closeButton = document.getElementById('close-dialog-button');

   openButton?.addEventListener('click', () => {
     console.log('Opening dialog');
     dialog?.show();
   });

   closeButton?.addEventListener('click', () => {
     console.log('Closing dialog');
     dialog?.hide();
   });
