.. tp-restructuredtext-viewer::
   :label: tp-badge
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-badge-1(tp-badge)
            :variant: success
            :pulse:

         Build status: :example-tp-badge-1:`Ready`

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/badge/badge.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("p");
            element1.append(document.createTextNode("\n  Build status: "));

            const element2 = document.createElement("tp-badge");
            element2.setAttribute("variant", "success");
            element2.setAttribute("pulse", "");
            element2.append(document.createTextNode("Ready"));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: With icon

         .. role:: example-tp-icon-1(tp-icon)
            :name: file_type_vite
            :library: languages

         .. tp-badge::
            :outlined:

            :example-tp-icon-1:`file_type_vite` Vite

            .. tp-divider::
               :orientation: vertical

            8.1.5

      .. example:: Status labels

         .. tp-badge::
            :variant: success

            Complete

         .. tp-badge::
            :variant: warning

            Pending
