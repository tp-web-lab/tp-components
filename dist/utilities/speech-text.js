function e(e){let t=[],n=e.ownerDocument.defaultView;function r(e){if(e.nodeType===Node.TEXT_NODE){t.push(e.textContent??``);return}if(!(e instanceof Element)||e.matches(`script, style, template, noscript, input, textarea, select, button, [hidden], [aria-hidden="true"], tp-text-to-speech, tp-button, tp-icon-button, tp-dropdown`))return;let i=n?.getComputedStyle(e);if(i?.display===`none`||i?.visibility===`hidden`||i?.visibility===`collapse`)return;let a=e.matches(`p, div, section, article, header, footer, aside, main, nav, blockquote, h1, h2, h3, h4, h5, h6, li, dt, dd, tr, br, hr`);if(e.matches(`br, hr`)){t.push(`
`);return}a&&t.push(`
`);for(let t of e.childNodes)r(t);a&&t.push(`
`),e.matches(`td, th`)&&t.push(` `)}return r(e),t.join(``).replace(/[\t\r\f\v ]+/g,` `).replace(/ *\n */g,`
`).replace(/\n{3,}/g,`

`).trim()}export{e as readSpeechText};
//# sourceMappingURL=speech-text.js.map