import{t as e}from"./markdown-style-registry.js";import{t}from"./simple-list-fence.js";var n=`tp-md-sudoku-styles`,r=`
.tp-sudoku {
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

.tp-sudoku *,
.tp-sudoku *::before,
.tp-sudoku *::after {
  box-sizing: border-box;
}

.tp-sudoku-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tp-sudoku-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tp-sudoku-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.tp-sudoku-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: nowrap;
  align-items: center;
}

.tp-sudoku button {
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

.tp-sudoku button:hover:not(:disabled) {
  background: #0056b3;
}

.tp-sudoku button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.tp-sudoku select {
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

.tp-sudoku-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, minmax(0, 1fr));
  gap: 0;
  background: #333;
  padding: 2px;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 1;
  border: 2px solid #333;
  margin-inline: auto;
  overflow: hidden;
}

.tp-sudoku-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ddd;
  min-width: 0;
  min-height: 0;
  font-size: 1.25rem;
  font-weight: bold;
  position: relative;
}

/* 3x3 box borders */
.tp-sudoku-cell.box-left {
  border-left-width: 2px;
  border-left-color: #333;
}
.tp-sudoku-cell.box-right {
  border-right-width: 2px;
  border-right-color: #333;
}
.tp-sudoku-cell.box-top {
  border-top-width: 2px;
  border-top-color: #333;
}
.tp-sudoku-cell.box-bottom {
  border-bottom-width: 2px;
  border-bottom-color: #333;
}

.tp-sudoku-input {
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  font-family: inherit;
  background: white;
  color: #1f2937;
  padding: 0;
}

.tp-sudoku-input:focus {
  outline: 2px solid #007bff;
  outline-offset: -2px;
}

.tp-sudoku-cell.initial .tp-sudoku-input {
  background: #dbe7ff;
  color: #1d4f91;
  font-weight: 800;
  cursor: default;
}

.tp-sudoku-cell.initial.current-line .tp-sudoku-input {
  background: #cfe0ff;
}

.tp-sudoku-cell.initial .tp-sudoku-input:focus {
  outline: none;
}

.tp-sudoku-cell.incorrect .tp-sudoku-input {
  background: #ffebee;
  color: #c62828;
}

.tp-sudoku-cell.current-line .tp-sudoku-input {
  background: #e6f0ff;
}

.tp-sudoku-cell.current-cell {
  box-shadow: inset 0 0 0 2px #0b63ce;
}

.tp-sudoku-status {
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  min-height: 1.5rem;
}

.tp-sudoku-status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.tp-sudoku-status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.tp-sudoku-status.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.tp-sudoku-error {
  padding: 1rem;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
`,i=`__tp_sudoku_installed`;function a(a){if(a[i])return;a[i]=!0,e(n,r);let o=a.renderer.rules.fence;a.renderer.rules.fence=function(e,n,r,i,a){let s=e[n];return s?(s.info||``).trim().startsWith(`sudoku`)?`<div class="tp-sudoku" data-sudoku-puzzle="${t(s.content).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}"></div>`:o?o.call(this,e,n,r,i,a):``:``}}export{a as default,a as sudokuExtension};
//# sourceMappingURL=sudoku3.js.map