import{t as e}from"./markdown-style-registry.js";var t=`tp-md-slide-runtime-styles`,n=`
.tp-md-slide.reveal {
  box-sizing: border-box;
  inline-size: 100%;
  max-inline-size: 100%;
  block-size: var(--tp-md-slide-height, 36rem);
  margin-block: 1rem;
  overflow: hidden;
}

.tp-md-slide.reveal * {
  box-sizing: border-box;
}

.tp-md-slide.reveal .slides {
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-inline-size: 100%;
}

.tp-md-slide.reveal .slides section {
  top: 0 !important;
  left: 0 !important;
  padding: 0.75rem;
  box-sizing: border-box;
}

.tp-md-slide.reveal .slides section,
.tp-md-slide.reveal .slides section > * {
  text-align: start !important;
}

.tp-md-slide.reveal .slides section {
  max-block-size: 100%;
  overflow-y: auto !important;
  scrollbar-gutter: stable;
}

.tp-md-slide.reveal .slides section.present {
  overflow-y: auto !important;
}
  
.tp-md-slide.reveal h1,
.tp-md-slide.reveal h2,
.tp-md-slide.reveal h3,
.tp-md-slide.reveal p,
.tp-md-slide.reveal ul,
.tp-md-slide.reveal ol,
.tp-md-slide.reveal pre {
  text-align: start !important;
}
`;function r(r,a={}){e(t,n),i(r,a)}function i(e,t){let n=e.renderer,r=n.rules.fence;n.rules.fence=(n,i,o,c,l)=>{let u=n[i];if(u===void 0)return``;let p=f(u.info);if(p.name!==`slide`&&p.name!==`reveal`)return typeof r==`function`?r(n,i,o,c,l):l.renderToken(n,i,o);let m=s(`${p.args} ${d(u)}`.trim()),h=c.attributes?.slide??c.attributes?.reveal??{},g={...t,...h,...m,options:{...t.options??{},...h.options??{},...m.options??{}}};return a(e,u.content.trim(),g,c)}}function a(e,t,n,r){let i=n.className??`tp-md-slide`,a=n.options??{},s=p(t,/^---\s*$/m);return`
<div
  class="${h(i)} reveal"
  data-slide-options="${h(JSON.stringify(a))}"
  ${m(`data-slide-theme`,n.theme)}
>
  <div class="slides">
    ${s.map(t=>o(e,t,r)).join(`
`)}
  </div>
</div>
`}function o(e,t,n){let r=p(t,/^--\s*$/m);return r.length<=1?`<section>${e.render(t.trim(),n)}</section>`:`
<section>
  ${r.map(t=>`<section>${e.render(t.trim(),n)}</section>`).join(`
`)}
</section>
`}function s(e){let t=c(e),n=t.className??t.class,r=t.theme,i={...l(t.options)??{}};for(let[e,n]of Object.entries(t))e===`class`||e===`className`||e===`theme`||e===`options`||(i[e]=u(n));return{className:n,theme:r,options:i}}function c(e){let t={};for(let n of e.matchAll(/([a-zA-Z][\w-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s}]+)/g)){let e=n[1]??``;t[e]=(n[2]??``).replace(/^["']|["']$/g,``)}return t}function l(e){if(!(e===void 0||e.trim()===``))try{let t=JSON.parse(e);if(typeof t==`object`&&t&&!Array.isArray(t))return t}catch(e){console.warn(`Invalid slide JSON options:`,e)}}function u(e){if(e===`true`)return!0;if(e===`false`)return!1;let t=Number(e);return Number.isFinite(t)&&e.trim()!==``?t:e}function d(e){return(e.attrs??[]).map(([e,t])=>t===``?e:`${e}=${JSON.stringify(t)}`).join(` `)}function f(e){let t=e.trim(),n=t.search(/\s/);return n===-1?{name:t,args:``}:{name:t.slice(0,n),args:t.slice(n+1).trim()}}function p(e,t){return e.split(t).map(e=>e.trim()).filter(e=>e!==``)}function m(e,t){return t===void 0?``:`${e}="${h(t)}"`}function h(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`"`,`&quot;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`)}export{r as default};
//# sourceMappingURL=slide.js.map