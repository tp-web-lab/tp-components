.. tp-restructuredtext-viewer::
   :label: tp-tangram
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-tangram::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/tangram/tangram.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-tangram");
            example.append(element1);

            document.body.append(example);

      .. example:: Named vertices

         .. tp-tangram::

            .. script::
               :type: tp/tangram

               # Corners of a square of side 4
               point A = (0, 0)
               point B = (4, 0)
               point C = (4, 4)
               point D = (0, 4)

               # Shared landmarks
               point O = midpoint(A, C)
               point E = midpoint(B, C)
               point F = midpoint(C, D)
               point G = midpoint(B, O)
               point H = midpoint(O, C)
               point I = midpoint(O, D)

               # The seven pieces, described by their boundary vertices
               triangle A B O
               triangle A O D
               triangle E C F
               triangle B E G
               triangle O H I
               square O G E H
               parallelogram D F H I

      .. example:: Exact orientation

         .. tp-tangram::
            :exact-orientation:
            :src: /docs/components/tangram/examples/convex-01.txt

      .. example:: Convex 01

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-01.txt

      .. example:: Convex 02

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-02.txt

      .. example:: Convex 03

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-03.txt

      .. example:: Convex 04

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-04.txt

      .. example:: Convex 05

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-05.txt

      .. example:: Convex 06

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-06.txt

      .. example:: Convex 07

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-07.txt

      .. example:: Convex 08

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-08.txt

      .. example:: Convex 09

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-09.txt

      .. example:: Convex 10

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-10.txt

      .. example:: Convex 11

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-11.txt

      .. example:: Convex 12

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-12.txt

      .. example:: Convex 13

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-13.txt
