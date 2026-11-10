.. tp-restructuredtext-viewer::
   :label: tp-logigram
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-logigram::
            :label: The reading club

            Prompt
               Three readers chose different books and drinks. Find every match.

            Categories
               - Readers

                 - Ada

                 - Ben

                 - Cleo

               - Books

                 - Poetry

                 - History

                 - Science

               - Drinks

                 - Tea

                 - Juice

                 - Water

            Clues
               1. Ada chose Poetry.

               2. The History reader drank Juice.

               3. Ben drank Water.

               4. Cleo did not choose Poetry.

            Solution
               1.

                  - Ada

                  - Poetry

                  - Tea

               2.

                  - Ben

                  - Science

                  - Water

               3.

                  - Cleo

                  - History

                  - Juice

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/logigram/logigram.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-logigram");
            element1.setAttribute("label", "The reading club");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("dl");
            element2.append(document.createTextNode("\n    "));

            const element3 = document.createElement("dt");
            element3.append(document.createTextNode("Prompt"));
            element2.append(element3);
            element2.append(document.createTextNode("\n    "));

            const element4 = document.createElement("dd");

            const element5 = document.createElement("p");
            element5.append(document.createTextNode("Three readers chose different books and drinks. Find every match."));
            element4.append(element5);
            element2.append(element4);
            element2.append(document.createTextNode("\n    "));

            const element6 = document.createElement("dt");
            element6.append(document.createTextNode("Categories"));
            element2.append(element6);
            element2.append(document.createTextNode("\n    "));

            const element7 = document.createElement("dd");
            element7.append(document.createTextNode("\n  "));

            const element8 = document.createElement("ul");
            element8.append(document.createTextNode("\n    "));

            const element9 = document.createElement("li");
            element9.append(document.createTextNode("Readers"));

            const element10 = document.createElement("ul");

            const element11 = document.createElement("li");
            element11.append(document.createTextNode("Ada"));
            element10.append(element11);

            const element12 = document.createElement("li");
            element12.append(document.createTextNode("Ben"));
            element10.append(element12);

            const element13 = document.createElement("li");
            element13.append(document.createTextNode("Cleo"));
            element10.append(element13);
            element9.append(element10);
            element8.append(element9);
            element8.append(document.createTextNode("\n    "));

            const element14 = document.createElement("li");
            element14.append(document.createTextNode("Books"));

            const element15 = document.createElement("ul");

            const element16 = document.createElement("li");
            element16.append(document.createTextNode("Poetry"));
            element15.append(element16);

            const element17 = document.createElement("li");
            element17.append(document.createTextNode("History"));
            element15.append(element17);

            const element18 = document.createElement("li");
            element18.append(document.createTextNode("Science"));
            element15.append(element18);
            element14.append(element15);
            element8.append(element14);
            element8.append(document.createTextNode("\n    "));

            const element19 = document.createElement("li");
            element19.append(document.createTextNode("Drinks"));

            const element20 = document.createElement("ul");

            const element21 = document.createElement("li");
            element21.append(document.createTextNode("Tea"));
            element20.append(element21);

            const element22 = document.createElement("li");
            element22.append(document.createTextNode("Juice"));
            element20.append(element22);

            const element23 = document.createElement("li");
            element23.append(document.createTextNode("Water"));
            element20.append(element23);
            element19.append(element20);
            element8.append(element19);
            element8.append(document.createTextNode("\n  "));
            element7.append(element8);
            element7.append(document.createTextNode("\n  "));
            element2.append(element7);
            element2.append(document.createTextNode("\n    "));

            const element24 = document.createElement("dt");
            element24.append(document.createTextNode("Clues"));
            element2.append(element24);
            element2.append(document.createTextNode("\n    "));

            const element25 = document.createElement("dd");
            element25.append(document.createTextNode("\n  "));

            const element26 = document.createElement("ol");
            element26.append(document.createTextNode("\n    "));

            const element27 = document.createElement("li");
            element27.append(document.createTextNode("Ada chose Poetry."));
            element26.append(element27);
            element26.append(document.createTextNode("\n    "));

            const element28 = document.createElement("li");
            element28.append(document.createTextNode("The History reader drank Juice."));
            element26.append(element28);
            element26.append(document.createTextNode("\n    "));

            const element29 = document.createElement("li");
            element29.append(document.createTextNode("Ben drank Water."));
            element26.append(element29);
            element26.append(document.createTextNode("\n    "));

            const element30 = document.createElement("li");
            element30.append(document.createTextNode("Cleo did not choose Poetry."));
            element26.append(element30);
            element26.append(document.createTextNode("\n  "));
            element25.append(element26);
            element25.append(document.createTextNode("\n  "));
            element2.append(element25);
            element2.append(document.createTextNode("\n    "));

            const element31 = document.createElement("dt");
            element31.append(document.createTextNode("Solution"));
            element2.append(element31);
            element2.append(document.createTextNode("\n    "));

            const element32 = document.createElement("dd");
            element32.append(document.createTextNode("\n  "));

            const element33 = document.createElement("ol");
            element33.append(document.createTextNode("\n    "));

            const element34 = document.createElement("li");

            const element35 = document.createElement("ul");

            const element36 = document.createElement("li");
            element36.append(document.createTextNode("Ada"));
            element35.append(element36);

            const element37 = document.createElement("li");
            element37.append(document.createTextNode("Poetry"));
            element35.append(element37);

            const element38 = document.createElement("li");
            element38.append(document.createTextNode("Tea"));
            element35.append(element38);
            element34.append(element35);
            element33.append(element34);
            element33.append(document.createTextNode("\n    "));

            const element39 = document.createElement("li");

            const element40 = document.createElement("ul");

            const element41 = document.createElement("li");
            element41.append(document.createTextNode("Ben"));
            element40.append(element41);

            const element42 = document.createElement("li");
            element42.append(document.createTextNode("Science"));
            element40.append(element42);

            const element43 = document.createElement("li");
            element43.append(document.createTextNode("Water"));
            element40.append(element43);
            element39.append(element40);
            element33.append(element39);
            element33.append(document.createTextNode("\n    "));

            const element44 = document.createElement("li");

            const element45 = document.createElement("ul");

            const element46 = document.createElement("li");
            element46.append(document.createTextNode("Cleo"));
            element45.append(element46);

            const element47 = document.createElement("li");
            element47.append(document.createTextNode("History"));
            element45.append(element47);

            const element48 = document.createElement("li");
            element48.append(document.createTextNode("Juice"));
            element45.append(element48);
            element44.append(element45);
            element33.append(element44);
            element33.append(document.createTextNode("\n  "));
            element32.append(element33);
            element32.append(document.createTextNode("\n"));
            element2.append(element32);
            element2.append(document.createTextNode("\n  "));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Automatic exclusions

         .. tp-logigram::
            :label: The reading club
            :auto-exclude:

            Prompt
               Three readers chose different books and drinks. Find every match.

            Categories
               - Readers

                 - Ada

                 - Ben

                 - Cleo

               - Books

                 - Poetry

                 - History

                 - Science

               - Drinks

                 - Tea

                 - Juice

                 - Water

            Clues
               1. Ada chose Poetry.

               2. The History reader drank Juice.

               3. Ben drank Water.

               4. Cleo did not choose Poetry.

            Solution
               1.

                  - Ada

                  - Poetry

                  - Tea

               2.

                  - Ben

                  - Science

                  - Water

               3.

                  - Cleo

                  - History

                  - Juice
