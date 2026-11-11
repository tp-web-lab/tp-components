.. tp-restructuredtext-viewer::
   :label: tp-markdown-blog
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-markdown-blog::
            :page-size: 2

            .. script::
               :type: tp/markdown

               ## A small garden

               Id
               : garden

               Date
               : 2026-06-03

               Summary
               : Three ideas for a greener balcony.

               Categories
               : Life

               Tags
               : plants, outdoors

               Start with herbs, choose a sunny spot, and water regularly.

               ## Learning together

               Id
               : learning

               Date
               : 2026-06-02

               Summary
               : Notes from our first workshop.

               Categories
               : Learning

               Tags
               : community, ideas

               A short shared exercise makes a good starting point for discussion.

               ## Welcome

               Id
               : welcome

               Date
               : 2026-06-01

               Summary
               : What you will find in this blog.

               Categories
               : Life

               Tags
               : community

               We share practical ideas and small discoveries. Come back for the next article.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/markdown/markdown.js";
            import "/components/markdown-blog/markdown-blog.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-markdown-blog");
            element1.setAttribute("page-size", "2");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/markdown");
            element2.textContent = "\n    ## A small garden\n\n    Id\n    : garden\n\n    Date\n    : 2026-06-03\n\n    Summary\n    : Three ideas for a greener balcony.\n\n    Categories\n    : Life\n\n    Tags\n    : plants, outdoors\n\n    Start with herbs, choose a sunny spot, and water regularly.\n\n    ## Learning together\n\n    Id\n    : learning\n\n    Date\n    : 2026-06-02\n\n    Summary\n    : Notes from our first workshop.\n\n    Categories\n    : Learning\n\n    Tags\n    : community, ideas\n\n    A short shared exercise makes a good starting point for discussion.\n\n    ## Welcome\n\n    Id\n    : welcome\n\n    Date\n    : 2026-06-01\n\n    Summary\n    : What you will find in this blog.\n\n    Categories\n    : Life\n\n    Tags\n    : community\n\n    We share practical ideas and small discoveries. Come back for the next article.\n  ";
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: External articles

         .. tp-markdown-blog::
            :page-size: 2
            :src: /docs/components/markdown-blog/examples/articles.md
