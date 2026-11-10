.. tp-restructuredtext-viewer::
   :label: tp-slope-simulator
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-slope-simulator::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/slope-simulator/slope-simulator.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-slope-simulator");
            example.append(element1);

            document.body.append(example);

      .. example:: Tour of Lombardy 2026

         Approximate reconstruction of the supplied Tour of Lombardy 2026 profile image (239.6 km). Distances and elevations are estimated for this interactive example, not official route or GPS data. Every segment stays within ±20%; vertical exaggeration affects only the drawing.

         .. tp-slope-simulator::
            :src: /docs/components/slope-simulator/examples/2026-lombardy-tour.json

      .. example:: Alpe d’Huez 2026

         Approximate reconstruction of the supplied Alpe d’Huez 2026 stage profile image (170.9 km), from Le Bourg d’Oisans via the Croix de Fer, Télégraphe, Galibier and Sarenne passes. Labelled distances and elevations are taken from the image; intermediate points are estimated for this interactive example, not official GPS data. Every segment stays within ±20%; vertical exaggeration affects only the drawing.

         .. tp-slope-simulator::
            :src: /docs/components/slope-simulator/examples/2026-alpe-huez.json
