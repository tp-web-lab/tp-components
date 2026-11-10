.. tp-restructuredtext-viewer::
   :label: tp-ref
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-ref-1(tp-ref)
            :href: ^detail

         .. div::
            :data-tp-reference-scope:

            A useful detail :example-tp-ref-1:`note-detail`.

            .. tp-note::
               :ref: detail
               :title: Detail

               A note with **formatted content**.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/note/note.js";
            import "/components/ref/ref.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("div");
            element1.setAttribute("data-tp-reference-scope", "");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("p");
            element2.append(document.createTextNode("A useful detail "));

            const element3 = document.createElement("tp-ref");
            element3.setAttribute("href", "^detail");
            element2.append(element3);
            element2.append(document.createTextNode("."));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element4 = document.createElement("tp-note");
            element4.setAttribute("ref", "detail");
            element4.setAttribute("title", "Detail");

            const element5 = document.createElement("p");
            element5.append(document.createTextNode("A note with "));

            const element6 = document.createElement("strong");
            element6.append(document.createTextNode("formatted content"));
            element5.append(element6);
            element5.append(document.createTextNode("."));
            element4.append(element5);
            element1.append(element4);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Notes, bibliography and glossary

         .. role:: example-tp-ref-1(tp-ref)
            :href: ^method

         .. role:: example-tp-ref-2(tp-ref)
            :href: @book

         .. role:: example-tp-ref-3(tp-ref)
            :href: %ecosystem

         .. role:: example-tp-ref-4(tp-ref)
            :href: ^weather

         .. role:: example-tp-ref-5(tp-ref)
            :href: ^method

         .. div::
            :data-tp-reference-scope:

            Read a note :example-tp-ref-1:`note-method`, consult a source :example-tp-ref-2:`bibliography-book`, or look up :example-tp-ref-3:`glossary-ecosystem`. Compare another note :example-tp-ref-4:`note-weather`, then read the first note again :example-tp-ref-5:`note-method`.

            .. tp-note::
               :ref: method
               :title: Method

               Observe the habitat at **three different times** of day.

               - Record the weather.

               - Compare your observations.

            .. tp-biblio::
               :ref: book
               :title: Book

               Alex Example. *Field observation handbook*. Example Press, 2026.

            .. tp-glossary::
               :ref: ecosystem
               :title: Ecosystem

               A community of organisms interacting with their physical environment.

            .. tp-note::
               :ref: weather

               Record the temperature and cloud cover.

            .. tp-biblio::
               :ref: atlas

               Alex Example. *A field atlas*. Example Press, 2025.

            .. tp-glossary::
               :ref: community

               A group of interacting populations.

            .. h3::

               Notes

            .. tp-listof::
               :selector: tp-note

            .. h3::

               Bibliography

            .. tp-listof::
               :selector: tp-biblio

            .. h3::

               Glossary

            .. tp-listof::
               :selector: tp-glossary
