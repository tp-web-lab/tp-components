.. tp-restructuredtext-viewer::
   :label: tp-fill-blank-question
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-textfield-1(tp-textfield)
            :name: france-capital
            :placeholder: Capital
            :aria-label: Capital of France
            :clearable:

         .. role:: example-tp-textfield-2(tp-textfield)
            :name: italy-capital
            :placeholder: Capital
            :aria-label: Capital of Italy
            :clearable:

         .. tp-fill-blank-question::
            :case-sensitive:

            Answers
               1. Paris

               2. Rome

            Title
               Geography

            Prompt
               Complete both sentences.

            Form
               The capital of France is :example-tp-textfield-1:`france-capital`.

               The capital of Italy is :example-tp-textfield-2:`italy-capital`.

            Feedback
               Check the spelling of each capital.

               - The capital of France is home to the Eiffel Tower.

               - The capital of Italy is home to the Colosseum.

            Solution
               The capital of France is Paris. The capital of Italy is Rome.

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - case-sensitive

               - closed

               - partial

            .. tp-cluster::

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
            :title: fill-blank-question attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/fill-blank-question/examples/attributes.js

      .. example:: Geography

         .. role:: france-field(tp-textfield)
            :name: france
            :aria-label: Capital of France
            :placeholder: City name
            :clearable:

         .. role:: germany-field(tp-textfield)
            :name: germany
            :aria-label: Capital of Germany
            :placeholder: City name
            :clearable:

         .. role:: italy-field(tp-textfield)
            :name: italy
            :aria-label: Capital of Italy
            :placeholder: City name
            :clearable:

         .. tp-fill-blank-question::
            :lang: en

            Answers
               1. Paris
               2. Berlin
               3. Rome

            Title
               Geography

            Prompt
               Complete the sentences with the capitals.

            Form
               The capital of France is :france-field:`…`.

               The capital of Germany is :germany-field:`…`.

               The capital of Italy is :italy-field:`…`.

            Feedback
               Check the capital of each country and its spelling.

            Solution
               France: Paris. Germany: Berlin. Italy: Rome.

      .. example:: Irregular verbs

         .. role:: go-field(tp-textfield)
            :name: go
            :aria-label: Past simple of go
            :placeholder: go
            :clearable:

         .. role:: see-field(tp-textfield)
            :name: see
            :aria-label: Past simple of see
            :placeholder: see
            :clearable:

         .. role:: take-field(tp-textfield)
            :name: take
            :aria-label: Past simple of take
            :placeholder: take
            :clearable:

         .. tp-fill-blank-question::
            :lang: en

            Answers
               1. went
               2. saw
               3. took

            Title
               Irregular verbs

            Prompt
               Complete each sentence with the past simple form of the verb shown in the blank.

            Form
               Yesterday, I :go-field:`…` to school.

               Last night, she :see-field:`…` a shooting star.

               Last Monday, we :take-field:`…` the train.

            Feedback
               These verbs are irregular: their past simple forms do not end in -ed.

            Solution
               go → went; see → saw; take → took.

      .. example:: Baltic capitals and flags

         .. role:: estonia-capital-field(tp-blank)
            :name: estonia-capital
            :aria-label: Capital of Estonia

         .. role:: estonia-flag-field(tp-blank)
            :name: estonia-flag
            :aria-label: Flag of Estonia

         .. role:: latvia-capital-field(tp-blank)
            :name: latvia-capital
            :aria-label: Capital of Latvia

         .. role:: latvia-flag-field(tp-blank)
            :name: latvia-flag
            :aria-label: Flag of Latvia

         .. role:: lithuania-capital-field(tp-blank)
            :name: lithuania-capital
            :aria-label: Capital of Lithuania

         .. role:: lithuania-flag-field(tp-blank)
            :name: lithuania-flag
            :aria-label: Flag of Lithuania

         .. role:: flag-ee(tp-icon)
            :name: ee
            :library: flags
            :aria-label: Flag of Estonia

         .. role:: flag-lv(tp-icon)
            :name: lv
            :library: flags
            :aria-label: Flag of Latvia

         .. role:: flag-lt(tp-icon)
            :name: lt
            :library: flags
            :aria-label: Flag of Lithuania

         .. tp-fill-blank-question::
            :closed:
            :lang: en

            Answers
               1. Tallinn
               2. :flag-ee:`…`
               3. Riga
               4. :flag-lv:`…`
               5. Vilnius
               6. :flag-lt:`…`

            Title
               Baltic capitals and flags

            Prompt
               Match each country with its capital and national flag.

            Form
               Estonia has :estonia-capital-field:`…` as its capital and :estonia-flag-field:`…` as its national flag.

               Latvia has :latvia-capital-field:`…` as its capital and :latvia-flag-field:`…` as its national flag.

               Lithuania has :lithuania-capital-field:`…` as its capital and :lithuania-flag-field:`…` as its national flag.

            Feedback
               Check which country each capital and flag belongs to.

            Solution
               Estonia: Tallinn; Latvia: Riga; Lithuania: Vilnius. Match each flag with its country.

      .. example:: Square root

         .. role:: domain-blank(tp-blank)
            :name: domain
            :aria-label: Domain

         .. role:: differentiability-blank(tp-blank)
            :name: differentiability
            :aria-label: Domain of differentiability

         .. role:: derivative-blank(tp-blank)
            :name: derivative
            :aria-label: Derivative

         .. tp-fill-blank-question::
            :closed:
            :lang: en

            Answers
               1. :math:`\mathbb{R}_{+}`
               2. :math:`\mathbb{R}_{+}^{*}`
               3. :math:`\frac{1}{2\sqrt{x}}`

            Title
               The square root function

            Prompt
               Complete the sentence with the mathematical expressions.

            Form
               The square root function :math:`f(x) = \sqrt{x}` is defined on :domain-blank:`…`, differentiable on :differentiability-blank:`…`, and :math:`f'(x) =` :derivative-blank:`…`.

            Feedback
               Consider whether zero belongs to the domain and whether the derivative exists there.

            Solution
               The domain is :math:`\mathbb{R}_{+} = [0, +\infty)`. The function is differentiable on :math:`\mathbb{R}_{+}^{*} = (0, +\infty)`, with :math:`f'(x) = \frac{1}{2\sqrt{x}}`.
