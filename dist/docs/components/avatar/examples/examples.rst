.. tp-restructuredtext-viewer::
   :label: tp-avatar
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-cluster::

            .. tp-avatar::
               :src: /docs/medias/logos/logo-tp.svg
               :label: tp-components

            .. tp-avatar::
               :initials: AL
               :label: Ada Lovelace

            .. tp-avatar::
               :icon: user
               :shape: square
               :label: Guest

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/avatar/avatar.js";
            import "/components/cluster/cluster.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-cluster");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("tp-avatar");
            element2.setAttribute("src", "/docs/medias/logos/logo-tp.svg");
            element2.setAttribute("label", "tp-components");
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element3 = document.createElement("tp-avatar");
            element3.setAttribute("initials", "AL");
            element3.setAttribute("label", "Ada Lovelace");
            element1.append(element3);
            element1.append(document.createTextNode("\n  "));

            const element4 = document.createElement("tp-avatar");
            element4.setAttribute("icon", "user");
            element4.setAttribute("shape", "square");
            element4.setAttribute("label", "Guest");
            element1.append(element4);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Initials fallback

         .. tp-avatar::
            :initials: AL
            :label: Ada Lovelace
