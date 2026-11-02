import{t as e}from"./markdown-style-registry.js";var t=`tp-md-music-styles`,n=`
.tp-md-music {
  display: grid;
  gap: 0.75rem;

  margin-block: 1rem;
  padding: 1rem;

  border: 1px solid
    color-mix(
      in srgb,
      CanvasText 18%,
      transparent
    );

  border-radius: 0.75rem;

  background:
    color-mix(
      in srgb,
      Canvas 96%,
      CanvasText 4%
    );
}

.tp-md-music-notation {
  position: relative;
  overflow-x: auto;
}

.tp-md-music-audio:empty,
.tp-md-music-tablature:empty {
  display: none;
}

.tp-md-music-source {
  margin: 0;
  overflow-x: auto;
}

.tp-md-music-instrument {
  min-inline-size: 10rem;
}

/* -------------------------------------------------------------------------- */
/* Toolbar */
/* -------------------------------------------------------------------------- */

.tp-md-music-toolbar {
  display: grid;

  grid-template-columns:
    minmax(10rem, max-content)
    max-content
    max-content
    minmax(10rem, 1fr);

  gap: 0.5rem;
  align-items: center;

  margin-block-start: 0.5rem;
}

.tp-md-music-toolbar select,
.tp-md-music-toolbar button,
.tp-md-music-toolbar input {
  margin: 0 !important;
}

/* -------------------------------------------------------------------------- */
/* Buttons */
/* -------------------------------------------------------------------------- */

.tp-md-music-toolbar button {
  padding-inline: 0.75rem;
  white-space: nowrap;
}

/* -------------------------------------------------------------------------- */
/* Range */
/* -------------------------------------------------------------------------- */

.tp-md-music-toolbar input[type='range'] {
  inline-size: 100%;

  min-inline-size: 0;

  padding: 0 !important;
  margin: 0 !important;

  border: none !important;

  background: transparent !important;

  appearance: auto !important;
  accent-color: currentColor;

  cursor: pointer;
}

/* -------------------------------------------------------------------------- */
/* Cursor */
/* -------------------------------------------------------------------------- */

.tp-md-music-cursor {
  position: absolute;

  inline-size: 2px;

  background: red;

  opacity: 0.75;

  pointer-events: none;

  z-index: 10;
}

/* -------------------------------------------------------------------------- */
/* abcjs fallback tempo input */
/* -------------------------------------------------------------------------- */

.tp-md-music-audio input.abcjs-midi-tempo[type='number'] {
  position: static !important;

  display: inline-flex !important;
  align-items: center !important;

  inline-size: 4rem !important;
  block-size: 1.75rem !important;

  min-block-size: 1.75rem !important;

  padding: 0 0.35rem !important;
  margin: 0 !important;

  appearance: auto !important;

  vertical-align: middle !important;

  font: inherit !important;
  line-height: 1 !important;

  background: Canvas !important;
  color: CanvasText !important;

  border: 1px solid
    color-mix(
      in srgb,
      CanvasText 20%,
      transparent
    ) !important;

  border-radius: 0.35rem !important;

  box-sizing: border-box !important;
}

/* -------------------------------------------------------------------------- */
/* Responsive */
/* -------------------------------------------------------------------------- */

@media (width <= 720px) {
  .tp-md-music-toolbar {
    grid-template-columns: 1fr;
  }

  .tp-md-music-instrument {
    min-inline-size: 0;
  }
}
`;function r(r){e(t,n),i(r)}function i(e){let t=e.renderer.rules.fence;e.renderer.rules.fence=(e,n,r,i,u)=>{let d=e[n];if(d===void 0)return``;let f=s(d.info);if(f.name!==`music`)return typeof t==`function`?t(e,n,r,i,u):u.renderToken(e,n,r);let p=`${f.args} ${o(d)}`.trim(),m={play:l(p,`play`),tablature:l(p,`tablature`),instrument:c(p,`instrument`)??`guitar`};return a(d.content.trim(),m,n)}}function a(e,t,n){return`
<section
  class="tp-md-music"
  data-music-id="${f(`tp-md-music-${String(n)}`)}"
  ${t.play?`data-music-play`:``}
  ${t.tablature?`data-music-tablature`:``}
  data-music-instrument="${f(t.instrument)}"
>
  <pre hidden class="tp-md-music-source">${d(e)}</pre>

  <div class="tp-md-music-controls"></div>

  <div class="tp-md-music-notation"></div>

  <div class="tp-md-music-audio"></div>

  <div class="tp-md-music-tablature"></div>
</section>
`}function o(e){return(e.attrs??[]).map(([e,t])=>t===``?e:`${e}=${JSON.stringify(t)}`).join(` `)}function s(e){let t=e.trim(),n=t.search(/\s/);return n===-1?{name:t,args:``}:{name:t.slice(0,n),args:t.slice(n+1).trim()}}function c(e,t){let n=RegExp(`${t}=("[^"]+"|'[^']+'|\\S+)`),r=e.match(n);return r===null?null:(r[1]??``).replace(/^["']|["']$/g,``)}function l(e,t){return RegExp(`(^|\\s)${u(t)}(\\s|$)`).test(e)}function u(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function d(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}function f(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`"`,`&quot;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`)}export{r as default};
//# sourceMappingURL=music.js.map