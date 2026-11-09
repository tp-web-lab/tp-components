.. tp-restructuredtext-viewer::
   :label: tp-listof
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. div::
            :data-tp-reference-scope:

            .. tp-listof::
               :selector: figure

            .. figure::

               A diagram of the water cycle.

               .. figcaption::

                  The water cycle

            .. figure::

               A diagram of a food chain.

               .. figcaption::

                  A food chain

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
