.. tp-restructuredtext-viewer::
   :label: tp-animation
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-animation::
            :in: shakeX
            :trigger: click
            :autoplay:
            :duration: 1200ms
            :iterations: 3

            .. tp-box::

               This box shakes three times on load. Click to replay.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/animation/animation.js";
            import "/components/box/box.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-animation");
            element1.setAttribute("in", "shakeX");
            element1.setAttribute("trigger", "click");
            element1.setAttribute("autoplay", "");
            element1.setAttribute("duration", "1200ms");
            element1.setAttribute("iterations", "3");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("tp-box");
            element2.append(document.createTextNode("This box shakes three times on load. Click to replay."));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Attention seekers

         Click each box to compare three ways of drawing attention.

         .. tp-stack::

            .. tp-animation::
               :in: bounce
               :trigger: click
               :duration: 1200ms

               .. tp-box::

                  Bounce: a vertical rebound.

            .. tp-animation::
               :in: shakeX
               :trigger: click
               :duration: 1200ms

               .. tp-box::

                  Shake: a horizontal oscillation.

            .. tp-animation::
               :in: pulse
               :trigger: click
               :duration: 1200ms
               :iterations: 3

               .. tp-box::

                  Pulse: a gentle change of scale.

      .. example:: Directional entrances

         Click each box to compare a sliding entrance with a bouncing entrance.

         .. tp-stack::

            .. tp-animation::
               :in: slideInLeft
               :trigger: click
               :duration: 1200ms

               .. tp-box::

                  Slide in from the left.

            .. tp-animation::
               :in: bounceInDown
               :trigger: click
               :duration: 1200ms

               .. tp-box::

                  Bounce in from above.

      .. example:: Zoom and rotation

         Click a box to play its entrance again.

         .. tp-stack::

            .. tp-animation::
               :in: zoomIn
               :trigger: click
               :duration: 1200ms

               .. tp-box::

                  Zoom in: grow from a smaller size.

            .. tp-animation::
               :in: rotateIn
               :trigger: click
               :duration: 1200ms

               .. tp-box::

                  Rotate in: combine rotation and fading.

      .. example:: Three-dimensional flip

         Hover over the box, or focus it with the keyboard, to flip it around its vertical axis. Leave and return to replay.

         .. tp-animation::
            :in: flipInY
            :trigger: hover
            :duration: 1500ms

            .. tp-box::

               Flip in around the vertical axis.

      .. example:: Entrance and exit

         Use Enter or Exit, then Pause during the movement. Resume continues from the same position; Reset restores the box.

         .. tp-cluster::

            .. tp-button::
               :id: animation-enter

               Enter

            .. tp-button::
               :id: animation-exit

               Exit

            .. tp-button::
               :id: animation-pause

               Pause

            .. tp-button::
               :id: animation-resume

               Resume

            .. tp-button::
               :id: animation-reset

               Reset

         .. tp-animation::
            :id: controlled-animation
            :in: fadeInLeft
            :out: fadeOutRight
            :trigger: manual
            :duration: 3000ms

            .. tp-box::

               Enter from the left; exit to the right.

         .. script::
            :type: module

            await customElements.whenDefined("tp-animation");
            const animation = document.getElementById("controlled-animation");
            document.getElementById("animation-enter").addEventListener("click", () => animation.playIn());
            document.getElementById("animation-exit").addEventListener("click", () => animation.playOut());
            document.getElementById("animation-pause").addEventListener("click", () => animation.pause());
            document.getElementById("animation-resume").addEventListener("click", () => animation.resume());
            document.getElementById("animation-reset").addEventListener("click", () => animation.cancel());
