.. tp-restructuredtext-viewer::
   :label: tp-fill-blank-question
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-blank-1(tp-blank)
            :name: france-capital
            :placeholder: Capital
            :aria-label: Capital of France
            :clearable:

         .. role:: example-tp-blank-2(tp-blank)
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
               The capital of France is :example-tp-blank-1:`france-capital`.

               The capital of Italy is :example-tp-blank-2:`italy-capital`.

            Feedback
               Check the spelling of each capital.

               - The capital of France is home to the Eiffel Tower.

               - The capital of Italy is home to the Colosseum.

            Solution
               The capital of France is Paris. The capital of Italy is Rome.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/blank/blank.js";
            import "/components/fill-blank/fill-blank.js";
            import "/components/fill-blank-question/fill-blank-question.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-fill-blank-question");
            element1.setAttribute("case-sensitive", "");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("dl");
            element2.append(document.createTextNode("\n    "));

            const element3 = document.createElement("dt");
            element3.append(document.createTextNode("Answers"));
            element2.append(element3);

            const element4 = document.createElement("dd");

            const element5 = document.createElement("ol");

            const element6 = document.createElement("li");
            element6.append(document.createTextNode("Paris"));
            element5.append(element6);

            const element7 = document.createElement("li");
            element7.append(document.createTextNode("Rome"));
            element5.append(element7);
            element4.append(element5);
            element2.append(element4);
            element2.append(document.createTextNode("\n    "));

            const element8 = document.createElement("dt");
            element8.append(document.createTextNode("Title"));
            element2.append(element8);

            const element9 = document.createElement("dd");
            element9.append(document.createTextNode("Geography"));
            element2.append(element9);
            element2.append(document.createTextNode("\n    "));

            const element10 = document.createElement("dt");
            element10.append(document.createTextNode("Prompt"));
            element2.append(element10);

            const element11 = document.createElement("dd");
            element11.append(document.createTextNode("Complete both sentences."));
            element2.append(element11);
            element2.append(document.createTextNode("\n    "));

            const element12 = document.createElement("dt");
            element12.append(document.createTextNode("Form"));
            element2.append(element12);
            element2.append(document.createTextNode("\n    "));

            const element13 = document.createElement("dd");
            element13.append(document.createTextNode("\n      "));

            const element14 = document.createElement("p");
            element14.append(document.createTextNode("The capital of France is "));

            const element15 = document.createElement("tp-blank");
            element15.setAttribute("name", "france-capital");
            element15.setAttribute("placeholder", "Capital");
            element15.setAttribute("aria-label", "Capital of France");
            element15.setAttribute("clearable", "");
            element14.append(element15);
            element14.append(document.createTextNode("."));
            element13.append(element14);
            element13.append(document.createTextNode("\n      "));

            const element16 = document.createElement("p");
            element16.append(document.createTextNode("The capital of Italy is "));

            const element17 = document.createElement("tp-blank");
            element17.setAttribute("name", "italy-capital");
            element17.setAttribute("placeholder", "Capital");
            element17.setAttribute("aria-label", "Capital of Italy");
            element17.setAttribute("clearable", "");
            element16.append(element17);
            element16.append(document.createTextNode("."));
            element13.append(element16);
            element13.append(document.createTextNode("\n    "));
            element2.append(element13);
            element2.append(document.createTextNode("\n    "));

            const element18 = document.createElement("dt");
            element18.append(document.createTextNode("Feedback"));
            element2.append(element18);
            element2.append(document.createTextNode("\n    "));

            const element19 = document.createElement("dd");
            element19.append(document.createTextNode("\n      "));

            const element20 = document.createElement("p");
            element20.append(document.createTextNode("Check the spelling of each capital."));
            element19.append(element20);
            element19.append(document.createTextNode("\n      "));

            const element21 = document.createElement("ul");
            element21.append(document.createTextNode("\n        "));

            const element22 = document.createElement("li");
            element22.append(document.createTextNode("The capital of France is home to the Eiffel Tower."));
            element21.append(element22);
            element21.append(document.createTextNode("\n        "));

            const element23 = document.createElement("li");
            element23.append(document.createTextNode("The capital of Italy is home to the Colosseum."));
            element21.append(element23);
            element21.append(document.createTextNode("\n      "));
            element19.append(element21);
            element19.append(document.createTextNode("\n    "));
            element2.append(element19);
            element2.append(document.createTextNode("\n    "));

            const element24 = document.createElement("dt");
            element24.append(document.createTextNode("Solution"));
            element2.append(element24);

            const element25 = document.createElement("dd");
            element25.append(document.createTextNode("The capital of France is Paris. The capital of Italy is Rome."));
            element2.append(element25);
            element2.append(document.createTextNode("\n  "));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Geography

         .. role:: france-field(tp-blank)
            :name: france
            :aria-label: Capital of France
            :placeholder: City name
            :clearable:

         .. role:: germany-field(tp-blank)
            :name: germany
            :aria-label: Capital of Germany
            :placeholder: City name
            :clearable:

         .. role:: italy-field(tp-blank)
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

         .. role:: go-field(tp-blank)
            :name: go
            :aria-label: Past simple of go
            :placeholder: go
            :clearable:

         .. role:: see-field(tp-blank)
            :name: see
            :aria-label: Past simple of see
            :placeholder: see
            :clearable:

         .. role:: take-field(tp-blank)
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
            :mode: closed
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

         .. role:: example-tp-math-1(tp-math)
            :aria-label: Nonnegative real numbers
            :value: \mathbb{R}_{+}

         .. role:: example-tp-math-2(tp-math)
            :aria-label: Positive real numbers
            :value: \mathbb{R}_{+}^{*}

         .. role:: example-tp-math-3(tp-math)
            :aria-label: One over twice the square root of x
            :value: \frac{1}{2\sqrt{x}}

         .. role:: example-tp-math-4(tp-math)
            :value: f(x) = \sqrt{x}

         .. role:: example-tp-blank-5(tp-blank)
            :name: domain
            :aria-label: Domain

         .. role:: example-tp-blank-6(tp-blank)
            :name: differentiability
            :aria-label: Domain of differentiability

         .. role:: example-tp-math-7(tp-math)
            :value: f'(x) =

         .. role:: example-tp-blank-8(tp-blank)
            :name: derivative
            :aria-label: Derivative

         .. role:: example-tp-math-9(tp-math)
            :value: \mathbb{R}_{+} = [0, +\infty)

         .. role:: example-tp-math-10(tp-math)
            :value: \mathbb{R}_{+}^{*} = (0, +\infty)

         .. role:: example-tp-math-11(tp-math)
            :value: f'(x) = \frac{1}{2\sqrt{x}}

         .. tp-fill-blank-question::
            :mode: closed
            :lang: en

            Answers
               1. :example-tp-math-1:`…`

               2. :example-tp-math-2:`…`

               3. :example-tp-math-3:`…`

            Title
               The square root function

            Prompt
               Complete the sentence with the mathematical expressions.

            Form
               The square root function :example-tp-math-4:`…` is defined on :example-tp-blank-5:`domain`, differentiable on :example-tp-blank-6:`differentiability`, and :example-tp-math-7:`…` :example-tp-blank-8:`derivative`.

            Feedback
               Consider whether zero belongs to the domain and whether the derivative exists there.

            Solution
               The domain is :example-tp-math-9:`…`. The function is differentiable on :example-tp-math-10:`…`, with :example-tp-math-11:`…`.
