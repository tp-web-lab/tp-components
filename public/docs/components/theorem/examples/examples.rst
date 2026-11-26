.. tp-restructuredtext-viewer::
   :label: tp-theorem
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-theorem::
            :type: theorem
            :heading: Nonnegativity
            :number: 1
            :id: square

            The square of every real number is nonnegative.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/theorem/theorem.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-theorem");
            element1.setAttribute("type", "theorem");
            element1.setAttribute("heading", "Nonnegativity");
            element1.setAttribute("number", "1");
            element1.setAttribute("id", "square");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("p");
            element2.append(document.createTextNode("The square of every real number is nonnegative."));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Statement types

         .. tp-theorem::
            :type: theorem

            A theorem with its usual label.

         .. tp-theorem::
            :type: lemma

            A lemma with its usual label.

         .. tp-theorem::
            :type: proposition

            A proposition with its usual label.

         .. tp-theorem::
            :type: corollary

            A corollary with its usual label.

         .. tp-theorem::
            :type: definition

            A definition with its usual label.

         .. tp-theorem::
            :type: example

            A example with its usual label.

         .. tp-theorem::
            :type: remark

            A remark with its usual label.

         .. tp-theorem::
            :type: proof
            :qed: □

            A proof with its usual label.

      .. example:: Shared section counters

         .. heading-level:: 2

         First section
         =============

         .. tp-theorem::
            :numbering: section
            :counter: results

            The first statement.

         .. tp-theorem::
            :type: lemma
            :numbering: section
            :counter: results

            A supporting lemma.

         .. heading-level:: 2

         Second section
         ==============

         .. tp-theorem::
            :numbering: section
            :counter: results

            The counter restarts.

      .. example:: Background variants

         .. tp-theorem::
            :type: remark
            :numbering: none
            :variant: none
            :heading: none

            The default appearance has no border or background.

         .. tp-theorem::
            :type: remark
            :numbering: none
            :variant: neutral
            :heading: neutral

            The background follows TP theme tokens.

         .. tp-theorem::
            :type: remark
            :numbering: none
            :variant: brand
            :heading: brand

            The background follows TP theme tokens.

         .. tp-theorem::
            :type: remark
            :numbering: none
            :variant: info
            :heading: info

            The background follows TP theme tokens.

         .. tp-theorem::
            :type: remark
            :numbering: none
            :variant: success
            :heading: success

            The background follows TP theme tokens.

         .. tp-theorem::
            :type: remark
            :numbering: none
            :variant: warning
            :heading: warning

            The background follows TP theme tokens.

         .. tp-theorem::
            :type: remark
            :numbering: none
            :variant: danger
            :heading: danger

            The background follows TP theme tokens.

      .. example:: Ending symbols

         .. tp-theorem::
            :type: theorem
            :qed: ◆

            A theorem with a diamond at its end.

         .. tp-theorem::
            :type: definition
            :qed: ∎

            A definition with a filled square.

         .. tp-theorem::
            :type: proof
            :qed: □

            A proof with an explicit closing square.

         .. tp-theorem::
            :type: proof
            :qed:

            The explicit empty value hides the closing square.

      .. example:: Rich heading and citation

         .. div::
            :data-tp-reference-scope:

            .. tp-theorem::
               :type: proposition
               :number: 2.1

               .. span::
                  :slot: heading

                  Companion input,

                  .. tp-ref::
                     :href: @guide

               The conclusion follows from the cited result.

            .. tp-biblio::
               :ref: guide
               :label: [1]

               Alex Example. *A guide to reconstruction*. 2026.

            .. tp-listof::
               :selector: tp-biblio
