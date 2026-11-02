import{t as e}from"./markdown-style-registry.js";var t=`tp-md-binary-styles`,n=`
.tp-binary {
  box-sizing: border-box;
  display: block;
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 600px;
  margin: 1rem 0;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.tp-binary *,
.tp-binary *::before,
.tp-binary *::after {
  box-sizing: border-box;
}

.tp-binary-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tp-binary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tp-binary-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.tp-binary-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: nowrap;
  align-items: center;
}

.tp-binary button {
  appearance: none;
  height: 2.25rem;
  padding: 0 0.9rem;
  background: #0b63ce;
  color: white;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  font: inherit;
  transition: background 0.2s;
  box-sizing: border-box;
}

.tp-binary button:hover:not(:disabled) {
  background: #0056b3;
}

.tp-binary button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.tp-binary select {
  max-width: none;
  height: 2.25rem;
  padding: 0 0.7rem;
  border: 1px solid #c7d2e0;
  border-radius: 4px;
  background: white;
  color: #223;
  font: inherit;
  box-sizing: border-box;
}

.tp-binary-grid {
  display: grid;
  gap: 1px;
  padding: 2px;
  background: #333;
  border: 2px solid #333;
  aspect-ratio: 1;
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
  overflow: hidden;
}

.tp-binary-cell {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: white;
  min-width: 0;
  min-height: 0;
}

.tp-binary-cell.initial .tp-binary-input {
  background: #dbe7ff;
  color: #1d4f91;
  font-weight: 800;
}

.tp-binary-cell.current-line .tp-binary-input {
  background: #e6f0ff;
}

.tp-binary-cell.initial.current-line .tp-binary-input {
  background: #cfe0ff;
}

.tp-binary-cell.incorrect .tp-binary-input {
  background: #ffebee;
  color: #c62828;
}

.tp-binary-cell.current-cell {
  box-shadow: inset 0 0 0 2px #0b63ce;
}

.tp-binary-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  text-align: center;
  text-transform: uppercase;
  font: 600 1rem/1 system-ui, -apple-system, sans-serif;
  color: #1f2937;
  background: transparent;
  padding: 0;
}

.tp-binary-input:focus {
  outline: 2px solid #0b63ce;
  outline-offset: -2px;
}

.tp-binary-status {
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  min-height: 1.5rem;
}

.tp-binary-status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.tp-binary-status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.tp-binary-status.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.tp-binary-error {
  padding: 1rem;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
`,r=`__tp_binary_installed`;function i(i){if(i[r])return;i[r]=!0,e(t,n);let a=i.renderer.rules.fence;i.renderer.rules.fence=function(e,t,n,r,i){let o=e[t];return o?(o.info||``).trim().startsWith(`binary`)?`<div class="tp-binary" data-binary-puzzle="${o.content.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}"></div>`:a?a.call(this,e,t,n,r,i):``:``}}export{i as binaryExtension,i as default};
//# sourceMappingURL=binary3.js.map