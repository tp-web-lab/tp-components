import{t as e}from"./board2.js";function t(e){let t=e.trim().split(`
`).filter(e=>e.trim().length>0);if(t.length!==9)throw Error(`Yakazu must have exactly 9 rows, got ${t.length}`);let n=[],r=0;for(let e=0;e<9;e++){let i=t[e];if(!i)throw Error(`Missing row ${e}`);let a=[];for(let t=0;t<i.length;t++){let n=i.charAt(t);if(!/\s/.test(n)){if(n===`#`){a.push({value:``,isEditable:!1,isBlack:!0,isInitial:!1,isError:!1,notes:[]});continue}if(n===`.`){a.push({value:``,isEditable:!0,isBlack:!1,isInitial:!1,isError:!1,notes:[]});continue}if(/[1-9]/.test(n)){let e=n,r=!1;t+1<i.length&&i[t+1]===`!`&&(r=!0,t+=1),a.push({value:r?e:``,isEditable:!r,isBlack:!1,isInitial:r,solution:e,isError:!1,notes:[]});continue}throw Error(n===`!`?`Unexpected '!' at row ${e}, col ${a.length}`:`Invalid character '${n}' at row ${e}, col ${a.length}: expected digit, '.', '#', or '!'`)}}if(a.length>9)throw Error(`Row ${e} has ${a.length} columns, expected at most 9`);r=Math.max(r,a.length),n.push(a)}if(r===0)throw Error(`Yakazu puzzle cannot be empty`);return n.map(e=>e.length===r?e:e.concat(Array.from({length:r-e.length},()=>({value:``,isEditable:!1,isBlack:!0,isInitial:!1,isError:!1,notes:[]}))))}function n(e,t,n){let r=`${t.row}:${t.col}:${n}`;e.has(r)||e.set(r,{coord:t,type:n})}function r(e,t,r){let i=e.filter(({cell:e})=>e.value!==``);if(i.length===0)return;let a=e.length,o=new Set,s=!1;for(let{coord:e,cell:c}of i){let i=Number(c.value);(!Number.isInteger(i)||i<1||i>a||o.has(c.value))&&(s=!0),o.add(c.value),(i<1||i>a)&&n(r,e,t)}if(s)for(let{coord:e}of i)n(r,e,t)}function i(e){let t=new Map,i=e[0]?.length??0;for(let n=0;n<e.length;n++){let i=e[n];if(!i)continue;let a=[];for(let e=0;e<i.length;e++){let o=i[e];if(o){if(o.isBlack){r(a,`row`,t),a=[];continue}a.push({coord:{row:n,col:e},cell:o})}}r(a,`row`,t)}for(let n=0;n<i;n++){let i=[];for(let a=0;a<e.length;a++){let o=e[a]?.[n];if(o){if(o.isBlack){r(i,`col`,t),i=[];continue}i.push({coord:{row:a,col:n},cell:o})}}r(i,`col`,t)}for(let r=0;r<e.length;r++)for(let a=0;a<i;a++){let i=e[r]?.[a];!i||i.isBlack||i.value===``||typeof i.solution!=`string`||i.value!==i.solution&&(n(t,{row:r,col:a},`row`),n(t,{row:r,col:a},`col`))}let a=Array.from(t.values()),o=e.flat().filter(e=>!!e&&!e.isBlack).every(e=>e.value!==``)&&a.length===0;return{isValid:a.length===0,isComplete:o,conflicts:a}}var a=[`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`],o=class{board=null;gridElement=null;onChange;activeCell=null;revealIncorrect=!1;initialPuzzle=``;entryMode=`game`;constructor(e={}){this.onChange=e.onChange}initialize(n){let r=t(n);this.board=new e({rows:r.length,cols:r[0]?.length??0},r),this.initialPuzzle=n,this.revealIncorrect=!1,this.activeCell=null,this.entryMode=`game`}renderGrid(e){let t=this.getYakazuCells(),n=this.board?.getDimensions();if(!t||!n)throw Error(`Engine not initialized. Call initialize() first.`);this.gridElement=e,e.innerHTML=``,e.className=`tp-yakazu-grid`,e.style.gridTemplateColumns=`repeat(${n.cols}, minmax(0, 1fr))`;let r=this.getValidation(),i=new Set(r.conflicts.map(({coord:e})=>`${e.row}:${e.col}`));for(let r=0;r<n.rows;r++)for(let a=0;a<n.cols;a++){let n=t[r]?.[a];if(!n)continue;let o=document.createElement(`div`);if(o.className=`tp-yakazu-cell`,n.isBlack){o.classList.add(`black`),o.addEventListener(`click`,()=>{this.clearActiveCell()}),e.appendChild(o);continue}n.isInitial&&o.classList.add(`initial`),this.revealIncorrect&&!n.isInitial&&i.has(`${r}:${a}`)&&o.classList.add(`incorrect`),this.isHighlightedCell(r,a)&&o.classList.add(`current-line`),this.activeCell?.row===r&&this.activeCell?.col===a&&o.classList.add(`current-cell`);let s=n.value===``?this.getCellNotes(n):[];s.length>0&&(o.classList.add(`has-notes`),o.appendChild(this.createNotesElement(s)));let c=document.createElement(`input`);c.type=`text`,c.className=`tp-yakazu-input`,c.value=n.value,c.maxLength=1,c.inputMode=`numeric`,c.readOnly=n.isInitial,c.dataset.row=String(r),c.dataset.col=String(a),c.setAttribute(`aria-label`,`Yakazu cell ${r+1},${a+1}`),c.addEventListener(`click`,()=>{this.setActiveCell(r,a)}),c.addEventListener(`focus`,()=>{this.setActiveCell(r,a),!n.isInitial&&c.value!==``&&requestAnimationFrame(()=>c.select())}),n.isInitial||c.addEventListener(`input`,e=>{let t=e.target,n=t.value.trim();if(n&&=n.charAt(n.length-1),n&&!/^[1-9]$/.test(n)&&(t.value=``,n=``),this.entryMode===`note`&&n!==``){t.value=``,this.toggleNote(r,a,n);return}this.setCell(r,a,n)}),o.appendChild(c),e.appendChild(o)}this.attachKeyboardNavigation(e),this.restoreActiveCellFocus()}getValidation(){let e=this.getYakazuCells();return e?i(e):{isValid:!0,isComplete:!1,conflicts:[]}}countEmptyCells(){let e=this.getYakazuCells();return e?e.flat().filter(e=>!e.isBlack&&e.value===``).length:0}countIncorrectCells(){return this.getValidation().conflicts.length}isShowingIncorrectCells(){return this.revealIncorrect}canUndo(){return this.board?.canUndo()??!1}canRedo(){return this.board?.canRedo()??!1}getEntryMode(){return this.entryMode}toggleEntryMode(){return this.entryMode=this.entryMode===`game`?`note`:`game`,this.onChange?.({kind:`assist`,row:this.activeCell?.row??-1,col:this.activeCell?.col??-1}),this.entryMode}getActiveCell(){return this.activeCell?{...this.activeCell}:null}setActiveCell(e,t,n=!1){let r=this.activeCell;if(this.activeCell={row:e,col:t},this.revealIncorrect){this.revealIncorrect=!1,this.gridElement&&this.renderGrid(this.gridElement),n&&this.focusCell(e,t);return}this.refreshActiveHighlights(),(!r||r.row!==e||r.col!==t)&&this.onChange?.({kind:`assist`,row:e,col:t}),n&&this.focusCell(e,t)}clearActiveCell(){this.activeCell&&(this.activeCell=null,this.refreshActiveHighlights(),this.onChange?.({kind:`assist`,row:-1,col:-1}))}setCell(e,t,n){this.board&&(this.revealIncorrect&&=!1,this.activeCell={row:e,col:t},this.board.setCellState({row:e,col:t},{value:n,notes:n===``?this.getCellNotesAt(e,t):[]}),this.gridElement&&this.renderGrid(this.gridElement),this.onChange?.({kind:`input`,row:e,col:t}))}undo(){this.board?.canUndo()&&(this.board.undo(),this.gridElement&&this.renderGrid(this.gridElement),this.onChange?.({kind:`undo`,row:-1,col:-1}))}redo(){this.board?.canRedo()&&(this.board.redo(),this.gridElement&&this.renderGrid(this.gridElement),this.onChange?.({kind:`redo`,row:-1,col:-1}))}showIncorrectCells(){return this.revealIncorrect=!0,this.gridElement&&this.renderGrid(this.gridElement),this.onChange?.({kind:`assist`,row:-1,col:-1}),this.countIncorrectCells()>0}clearIncorrectCells(){if(!this.board)return!1;let e=this.getIncorrectCoords().map(({row:e,col:t})=>({coord:{row:e,col:t},updates:{value:``}}));if(e.length===0)return!1;let t=this.board.setCellsState(e,`clear incorrect cells`);return this.revealIncorrect=!1,t&&this.gridElement&&this.renderGrid(this.gridElement),t&&this.onChange?.({kind:`assist`,row:-1,col:-1}),t}showCell(e,t){if(!this.board)return!1;let n=this.getYakazuCells()?.[e]?.[t];if(!n||n.isBlack||n.isInitial||typeof n.solution!=`string`)return!1;this.activeCell={row:e,col:t};let r=this.board.setCellState({row:e,col:t},{value:n.solution,notes:[]},`show cell`);return r&&this.gridElement&&this.renderGrid(this.gridElement),r&&this.onChange?.({kind:`assist`,row:e,col:t}),r}showSolution(){if(!this.board)return!1;let e=this.getYakazuCells(),t=this.board.getDimensions();if(!e)return!1;let n=[];for(let r=0;r<t.rows;r++)for(let i=0;i<t.cols;i++){let t=e[r]?.[i];!t||t.isBlack||t.isInitial||typeof t.solution!=`string`||t.value===t.solution||n.push({coord:{row:r,col:i},updates:{value:t.solution,notes:[]}})}if(n.length===0)return!1;let r=this.board.setCellsState(n,`show solution`);return r&&this.gridElement&&this.renderGrid(this.gridElement),r&&this.onChange?.({kind:`assist`,row:-1,col:-1}),r}resetGame(){if(this.initialPuzzle===``)return!1;let n=t(this.initialPuzzle);return this.board=new e({rows:9,cols:9},n),this.revealIncorrect=!1,this.activeCell=null,this.entryMode=`game`,this.gridElement&&this.renderGrid(this.gridElement),this.onChange?.({kind:`assist`,row:-1,col:-1}),!0}hideIncorrectCells(){this.revealIncorrect=!1,this.gridElement&&this.renderGrid(this.gridElement)}getYakazuCells(){let e=this.board?.getState();return e?e.cells:null}getIncorrectCoords(){let e=this.getYakazuCells();return e?this.getValidation().conflicts.map(({coord:e})=>e).filter(({row:t,col:n})=>!e[t]?.[n]?.isInitial):[]}attachKeyboardNavigation(e){e.dataset.yakazuNavAttached!==`true`&&(e.dataset.yakazuNavAttached=`true`,e.addEventListener(`keydown`,e=>{if(!(e.target instanceof HTMLInputElement))return;let t=Number.parseInt(e.target.dataset.row??`0`,10),n=Number.parseInt(e.target.dataset.col??`0`,10);switch(e.key){case`ArrowUp`:e.preventDefault(),this.revealIncorrect&&this.hideIncorrectCells(),this.moveByDirection(t,n,-1,0);return;case`ArrowDown`:e.preventDefault(),this.revealIncorrect&&this.hideIncorrectCells(),this.moveByDirection(t,n,1,0);return;case`ArrowLeft`:e.preventDefault(),this.revealIncorrect&&this.hideIncorrectCells(),this.moveByDirection(t,n,0,-1);return;case`ArrowRight`:e.preventDefault(),this.revealIncorrect&&this.hideIncorrectCells(),this.moveByDirection(t,n,0,1);return;case`Delete`:e.preventDefault(),e.target.readOnly||(this.entryMode===`note`?(this.clearNotes(t,n),this.setActiveCell(t,n,!0)):(this.setCell(t,n,``),this.setActiveCell(t,n,!0)));return;case`Backspace`:if(e.preventDefault(),this.entryMode===`note`){this.clearNotes(t,n),this.setActiveCell(t,n,!0);return}this.setCell(t,n,``),this.setActiveCell(t,n,!0);return;default:return}}))}moveByDirection(e,t,n,r){let i=this.findNextEditableCellWithWrap(e,t,n,r);i&&this.setActiveCell(i.row,i.col,!0)}findNextEditableCellWithWrap(e,t,n,r){let i=this.getYakazuCells(),a=this.board?.getDimensions();if(!i||!a)return null;let o=e,s=t;for(let e=1;e<Math.max(a.rows,a.cols);e++){o=(o+n+a.rows)%a.rows,s=(s+r+a.cols)%a.cols;let e=i[o]?.[s];if(e&&e.isEditable&&!e.isBlack)return{row:o,col:s}}return null}focusCell(e,t){if(!this.gridElement)return;let n=this.gridElement.querySelector(`input[data-row="${e}"][data-col="${t}"]`);n&&requestAnimationFrame(()=>n.focus())}refreshActiveHighlights(){if(!this.gridElement)return;let e=this.gridElement.querySelectorAll(`.tp-yakazu-cell`);for(let t of e)t.classList.remove(`current-line`,`current-cell`);if(!this.activeCell)return;for(let e of this.getHighlightedWordCells()){let t=this.gridElement.querySelector(`input[data-row="${e.row}"][data-col="${e.col}"]`)?.closest(`.tp-yakazu-cell`);t&&t.classList.add(`current-line`)}let t=this.gridElement.querySelector(`input[data-row="${this.activeCell.row}"][data-col="${this.activeCell.col}"]`)?.closest(`.tp-yakazu-cell`);t&&t.classList.add(`current-cell`)}isHighlightedCell(e,t){return this.getHighlightedWordCells().some(n=>n.row===e&&n.col===t)}getHighlightedWordCells(){let e=new Map;for(let t of this.getWordCellsForOrientation(`across`))e.set(`${t.row}:${t.col}`,t);for(let t of this.getWordCellsForOrientation(`down`))e.set(`${t.row}:${t.col}`,t);return[...e.values()]}getWordCellsForOrientation(e){let t=this.activeCell,n=this.getYakazuCells(),r=this.board?.getDimensions();if(!t||!n||!r)return[];let i=n[t.row]?.[t.col];if(!i||i.isBlack)return[];let a=e===`across`?0:1,o=+(e===`across`),s=t.row,c=t.col;for(;s-a>=0&&c-o>=0;){let e=s-a,t=c-o,r=n[e]?.[t];if(!r||r.isBlack)break;s=e,c=t}let l=[],u=s,d=c;for(;u<r.rows&&d<r.cols;){let e=n[u]?.[d];if(!e||e.isBlack)break;l.push({row:u,col:d}),u+=a,d+=o}return l}restoreActiveCellFocus(){!this.gridElement||!this.activeCell||this.focusCell(this.activeCell.row,this.activeCell.col)}getCellNotes(e){return[...e.notes??[]].sort()}getCellNotesAt(e,t){let n=this.getYakazuCells()?.[e]?.[t];return n?this.getCellNotes(n):[]}clearNotes(e,t){this.board&&this.board.setCellState({row:e,col:t},{notes:[]},`clear notes`)&&(this.activeCell={row:e,col:t},this.gridElement&&this.renderGrid(this.gridElement),this.onChange?.({kind:`input`,row:e,col:t}))}toggleNote(e,t,n){if(!this.board)return;let r=this.getYakazuCells()?.[e]?.[t];if(!r||r.isBlack||r.value!==``)return;this.revealIncorrect&&=!1;let i=this.getCellNotes(r),a=i.includes(n)?i.filter(e=>e!==n):[...i,n].sort();this.board.setCellState({row:e,col:t},{notes:a},`toggle note ${n}`)&&(this.activeCell={row:e,col:t},this.gridElement&&this.renderGrid(this.gridElement),this.onChange?.({kind:`input`,row:e,col:t}))}createNotesElement(e){let t=document.createElement(`div`);t.className=`tp-yakazu-notes`;for(let n of a){let r=document.createElement(`span`);r.textContent=e.includes(n)?n:``,t.appendChild(r)}return t}},s={id:`yakazu`,async render(e){let t=e.querySelectorAll(`.tp-yakazu[data-yakazu-puzzle]`);for(let e of t){if(!(e instanceof HTMLElement))continue;let t=e.getAttribute(`data-yakazu-puzzle`);if(t)try{l();let n=null;e.innerHTML=`
          <div class="tp-yakazu-container">
            <div class="tp-yakazu-header">
              <div class="tp-yakazu-title">Yakazu</div>
              <div class="tp-yakazu-controls">
                <button class="tp-yakazu-mode" type="button">Game</button>
                <button class="tp-yakazu-undo" disabled>Undo</button>
                <button class="tp-yakazu-redo" disabled>Redo</button>
                <select class="tp-yakazu-assist">
                  <option value="">Assist…</option>
                  <option value="reset-game">Reset the game</option>
                  <option value="show-incorrect">Show all incorrect boxes</option>
                  <option value="clear-incorrect">Clear the incorrect boxes</option>
                  <option value="show-cell">Show the box</option>
                  <option value="show-solution">Show the solution</option>
                </select>
              </div>
            </div>

            <div class="tp-yakazu-grid"></div>
            <div class="tp-yakazu-status"></div>
          </div>
        `;let r=e.querySelector(`.tp-yakazu-grid`),i=e.querySelector(`.tp-yakazu-status`),a=e.querySelector(`.tp-yakazu-mode`),s=e.querySelector(`.tp-yakazu-undo`),u=e.querySelector(`.tp-yakazu-redo`),d=e.querySelector(`.tp-yakazu-assist`),f=new o({onChange:()=>c(f,i,a,s,u)});f.initialize(t),f.renderGrid(r),s.disabled=!f.canUndo(),u.disabled=!f.canRedo(),a.addEventListener(`click`,()=>{f.toggleEntryMode(),c(f,i,a,s,u)}),s.addEventListener(`click`,()=>{f.undo(),c(f,i,a,s,u)}),u.addEventListener(`click`,()=>{f.redo(),c(f,i,a,s,u)}),d.addEventListener(`change`,()=>{switch(d.value){case`reset-game`:f.resetGame(),n=null;break;case`show-incorrect`:f.showIncorrectCells();break;case`clear-incorrect`:f.clearIncorrectCells();break;case`show-cell`:n&&f.showCell(n.row,n.col);break;case`show-solution`:f.showSolution();break;default:break}d.value=``,c(f,i,a,s,u)});for(let e of[a,s,u])e.addEventListener(`mousedown`,e=>{e.preventDefault()});r.addEventListener(`focus`,e=>{e.target instanceof HTMLInputElement&&(n={row:Number.parseInt(e.target.dataset.row??`0`,10),col:Number.parseInt(e.target.dataset.col??`0`,10)})},!0),c(f,i,a,s,u)}catch(t){console.error(`Failed to initialize yakazu:`,t),e.innerHTML=`<div class="tp-yakazu-error">Error: ${t instanceof Error?t.message:String(t)}</div>`}}}};function c(e,t,n,r,i){let a=e.getValidation();if(n.textContent=e.getEntryMode()===`game`?`Game`:`Note`,n.setAttribute(`aria-label`,`Current entry mode: ${e.getEntryMode()}`),r.disabled=!e.canUndo(),i.disabled=!e.canRedo(),t.className=`tp-yakazu-status`,a.isComplete)t.textContent=`✓ Solved!`,t.classList.add(`success`);else{let n=e.countIncorrectCells(),r=e.countEmptyCells();e.isShowingIncorrectCells()&&n>0?t.textContent=`${n} incorrect box${n===1?``:`es`} shown`:t.textContent=`${r} empty cell${r===1?``:`s`}`,t.classList.add(`info`)}}function l(){let e=`tp-md-yakazu-styles`;if(document.getElementById(e))return;let t=document.createElement(`style`);t.id=e,t.textContent=`
.tp-yakazu {
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

.tp-yakazu *,
.tp-yakazu *::before,
.tp-yakazu *::after {
  box-sizing: border-box;
}

.tp-yakazu-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tp-yakazu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tp-yakazu-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.tp-yakazu-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: nowrap;
  align-items: center;
}

.tp-yakazu button {
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

.tp-yakazu button:hover:not(:disabled) {
  background: #0056b3;
}

.tp-yakazu button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.tp-yakazu select {
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

.tp-yakazu-grid {
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

.tp-yakazu-cell {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: white;
  min-width: 0;
  min-height: 0;
}

.tp-yakazu-cell.black {
  background: #222;
}

.tp-yakazu-cell.initial .tp-yakazu-input {
  background: #dbe7ff;
  color: #1d4f91;
  font-weight: 800;
}

.tp-yakazu-cell.current-line .tp-yakazu-input {
  background: #e6f0ff;
}

.tp-yakazu-cell.initial.current-line .tp-yakazu-input {
  background: #cfe0ff;
}

.tp-yakazu-cell.incorrect .tp-yakazu-input {
  background: #ffebee;
  color: #c62828;
}

.tp-yakazu-cell.current-cell {
  box-shadow: inset 0 0 0 2px #0b63ce;
}

.tp-yakazu-cell.has-notes .tp-yakazu-input {
  background: transparent;
}

.tp-yakazu-notes {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  padding: 0.12rem;
  pointer-events: none;
  color: #516071;
  font-size: 0.48rem;
  line-height: 1;
  text-align: center;
  align-items: center;
}

.tp-yakazu-input {
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

.tp-yakazu-input:focus {
  outline: 2px solid #0b63ce;
  outline-offset: -2px;
}

.tp-yakazu-status {
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  min-height: 1.5rem;
}

.tp-yakazu-status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.tp-yakazu-status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.tp-yakazu-status.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.tp-yakazu-error {
  padding: 1rem;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
`,document.head.appendChild(t)}export{s as default};
//# sourceMappingURL=yakazu4.js.map