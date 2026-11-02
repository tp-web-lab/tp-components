import{t as e}from"./base.js";function t(e){return e.trim().toUpperCase().replace(/\s+/g,` `).replace(/\s*\+\s*/g,` + `).replace(/\s*=\s*/g,` = `)}function n(e){return e.trim().replace(/\s+/g,` `).replace(/\s*\+\s*/g,` + `).replace(/\s*=\s*/g,` = `)}function r(e){let[n,r,i]=t(e).split(`=`).map(e=>e?.trim()??``);if(!n||!r||i!==void 0)throw Error(`Cryptarithm equation must contain exactly one = sign`);let a=n.split(`+`).map(e=>e.trim());if(a.length<2||a.some(e=>!/^[A-Z]+$/.test(e)))throw Error(`Cryptarithm equation must be an addition of letter words`);if(!/^[A-Z]+$/.test(r))throw Error(`Cryptarithm result must be a letter word`);return{addends:a,result:r}}function i(e){let t=``,n=[];for(let r=0;r<e.length;r++){let i=e.charAt(r);if(!/\d/.test(i))throw Error(`Cryptarithm solution must be an addition of numbers`);t+=i,e.charAt(r+1)===`!`&&(n.push(t.length-1),r+=1)}return{digits:t,initialIndexes:n}}function a(e){let[t,r,a]=n(e).split(`=`).map(e=>e?.trim()??``);if(!t||!r||a!==void 0)throw Error(`Cryptarithm solution must contain exactly one = sign`);let o=t.split(`+`).map(e=>i(e.trim()));if(o.length<2)throw Error(`Cryptarithm solution must be an addition of numbers`);return{addends:o,result:i(r)}}function o(e,i){let o=r(e),s=a(i);if(o.addends.length!==s.addends.length)throw Error(`Cryptarithm solution must have the same number of addends as the equation`);let c={},l=new Map,u=[],d=new Set,f=new Set;for(let e=0;e<o.addends.length;e++){let t=o.addends[e]??``,n=s.addends[e];if(!n)throw Error(`Cryptarithm solution must have the same number of addends as the equation`);if(t.length!==n.digits.length)throw Error(`Each solution addend must match the corresponding word length`);for(let e=0;e<t.length;e++){let r=t.charAt(e),i=n.digits.charAt(e),a=c[r],o=l.get(i);if(a&&a!==i)throw Error(`Letter ${r} maps to inconsistent digits`);if(o&&o!==r)throw Error(`Digit ${i} is reused by both ${o} and ${r}`);c[r]=i,l.set(i,r),d.has(r)||(d.add(r),u.push(r)),n.initialIndexes.includes(e)&&f.add(r)}}if(o.result.length!==s.result.digits.length)throw Error(`The solution result must match the result word length`);for(let e=0;e<o.result.length;e++){let t=o.result.charAt(e),n=s.result.digits.charAt(e),r=c[t],i=l.get(n);if(r&&r!==n)throw Error(`Letter ${t} maps to inconsistent digits`);if(i&&i!==t)throw Error(`Digit ${n} is reused by both ${i} and ${t}`);c[t]=n,l.set(n,t),d.has(t)||(d.add(t),u.push(t)),s.result.initialIndexes.includes(e)&&f.add(t)}if(u.length>10)throw Error(`Cryptarithm puzzles can use at most 10 distinct letters`);let p=[...new Set([...o.addends.map(e=>e.charAt(0)),o.result.charAt(0)])];if(p.some(e=>c[e]===`0`))throw Error(`Leading letters cannot map to 0`);if(s.addends.reduce((e,t)=>e+BigInt(t.digits),0n)!==BigInt(s.result.digits))throw Error(`Cryptarithm solution does not satisfy the equation`);return{equation:t(e),solution:n(i),addends:o.addends,result:o.result,solutionAddends:s.addends.map(e=>e.digits),solutionResult:s.result.digits,letters:u,leadingLetters:p,solutionByLetter:c,initialLetters:u.filter(e=>f.has(e))}}var s=class{onChange;puzzle=null;boardElement=null;assignments={};history=[];historyIndex=0;showingIncorrect=!1;activeLetter=null;constructor(e={}){this.onChange=e.onChange}initialize(e,t){this.puzzle=o(e,t),this.assignments=c(this.getInitialAssignments()),this.history=[c(this.assignments)],this.historyIndex=0,this.showingIncorrect=!1,this.activeLetter=this.getFirstEditableLetter()}renderBoard(e){this.boardElement=e,this.rerenderBoard(!1)}canUndo(){return this.historyIndex>0}canRedo(){return this.historyIndex<this.history.length-1}undo(){this.canUndo()&&(--this.historyIndex,this.assignments=c(this.history[this.historyIndex]),this.rerenderBoard(!0),this.onChange?.())}redo(){this.canRedo()&&(this.historyIndex+=1,this.assignments=c(this.history[this.historyIndex]),this.rerenderBoard(!0),this.onChange?.())}resetGame(){return this.puzzle?(this.assignments=c(this.getInitialAssignments()),this.history=[c(this.assignments)],this.historyIndex=0,this.showingIncorrect=!1,this.activeLetter=this.getFirstEditableLetter(),this.rerenderBoard(!1),this.onChange?.(),!0):!1}getActiveLetter(){return this.activeLetter}setActiveLetter(e,t=!1){this.activeLetter!==e&&(this.activeLetter=e,this.showingIncorrect&&=!1,this.rerenderBoard(t),this.onChange?.())}setAssignment(e,t){if(!this.puzzle||!this.puzzle.letters.includes(e)||this.puzzle.initialLetters.includes(e))return!1;let n=t===``?``:t.charAt(t.length-1);if(n!==``&&!/^\d$/.test(n)||(this.assignments[e]??``)===n)return!1;let r=c(this.assignments);return n===``?delete r[e]:r[e]=n,this.assignments=r,this.pushHistory(r),this.rerenderBoard(!0),this.onChange?.(),!0}showIncorrectAssignments(){return this.showingIncorrect=!0,this.rerenderBoard(!1),this.onChange?.(),this.countIncorrectLetters()>0}hideIncorrectAssignments(){return this.showingIncorrect?(this.showingIncorrect=!1,this.rerenderBoard(!1),this.onChange?.(),!0):!1}isShowingIncorrectAssignments(){return this.showingIncorrect}clearIncorrectAssignments(){let e=this.puzzle;if(!e)return!1;let t=c(this.assignments),n=!1;for(let r of e.letters){let i=t[r];if(i!==void 0&&i!==e.solutionByLetter[r]){if(e.initialLetters.includes(r))continue;delete t[r],n=!0}}return n?(this.assignments=t,this.pushHistory(t),this.showingIncorrect=!1,this.rerenderBoard(!0),this.onChange?.(),!0):!1}showLetter(e=this.activeLetter){let t=this.puzzle;if(!t)return!1;let n=e&&t.letters.includes(e)&&!t.initialLetters.includes(e)?e:t.letters.find(e=>!t.initialLetters.includes(e)&&this.assignments[e]!==t.solutionByLetter[e])??null;return n?this.setAssignment(n,t.solutionByLetter[n]??``):!1}showSolution(){let e=this.puzzle;if(!e)return!1;let t={...c(this.getInitialAssignments()),...c(e.solutionByLetter)};return l(this.assignments,t,e.letters)?!1:(this.assignments=t,this.pushHistory(t),this.showingIncorrect=!1,this.rerenderBoard(!1),this.onChange?.(),!0)}countEmptyLetters(){let e=this.puzzle;return e?e.letters.filter(t=>!e.initialLetters.includes(t)&&(this.assignments[t]??``)===``).length:0}countIncorrectLetters(){let e=this.puzzle;return e?e.letters.filter(t=>{let n=this.assignments[t];return!e.initialLetters.includes(t)&&n!==void 0&&n!==``&&n!==e.solutionByLetter[t]}).length:0}getValidation(){let e=this.puzzle;if(!e)return{isComplete:!1,isSolved:!1,hasDuplicateDigits:!1,hasLeadingZero:!1,equationMatches:!1};let t=e.letters.map(e=>this.assignments[e]??``).filter(e=>e!==``),n=new Set(t).size!==t.length,r=e.leadingLetters.some(e=>this.assignments[e]===`0`),i=e.letters.every(e=>(this.assignments[e]??``)!==``),a=i&&!r&&e.addends.reduce((e,t)=>e+BigInt(this.resolveTerm(t)),0n)===BigInt(this.resolveTerm(e.result));return{isComplete:i,isSolved:i&&!n&&!r&&a&&e.letters.every(t=>this.assignments[t]===e.solutionByLetter[t]),hasDuplicateDigits:n,hasLeadingZero:r,equationMatches:a}}rerenderBoard(e){let t=this.puzzle,n=this.boardElement;if(!t||!n)return;let r=Math.max(t.result.length,...t.addends.map(e=>e.length)),i=t.addends.map((e,t)=>this.renderEquationRow(e,r,t===0?``:`+`)),a=this.renderEquationRow(t.result,r,`=`),o=`${t.addends.map(e=>this.resolveTerm(e,`_`)).join(` + `)} = ${this.resolveTerm(t.result,`_`)}`,s=t.letters.map(e=>{let n=this.assignments[e]??``,r=[`tp-cryptarithm-assignment`];return this.activeLetter===e&&r.push(`current-letter`),t.initialLetters.includes(e)&&r.push(`initial`),this.showingIncorrect&&n!==``&&n!==t.solutionByLetter[e]&&r.push(`incorrect`),`
          <label class="${r.join(` `)}">
            <span class="tp-cryptarithm-assignment-label">${e}</span>
            <input
              class="tp-cryptarithm-assignment-input"
              type="text"
              inputmode="numeric"
              maxlength="1"
              data-letter="${e}"
              value="${u(n)}"
              ${t.initialLetters.includes(e)?`readonly`:``}
              aria-label="Digit for ${e}"
            >
          </label>
        `}).join(``);n.innerHTML=`
      <div class="tp-cryptarithm-equation" style="--tp-cryptarithm-cols: ${r};">
        ${i.join(``)}
        <div class="tp-cryptarithm-result-separator"></div>
        ${a}
      </div>
      <div class="tp-cryptarithm-preview">${u(o)}</div>
      <div class="tp-cryptarithm-assignments">${s}</div>
    `;for(let e of n.querySelectorAll(`.tp-cryptarithm-assignment-input`))e.addEventListener(`focus`,()=>{let t=e.dataset.letter??null;this.setActiveLetter(t,!0)}),e.addEventListener(`click`,()=>{let t=e.dataset.letter??null;this.setActiveLetter(t,!0)}),e.addEventListener(`input`,()=>{let n=e.dataset.letter??``;if(t.initialLetters.includes(n)){e.value=this.assignments[n]??``;return}let r=e.value.trim(),i=r===``?``:r.charAt(r.length-1);if(!/^\d?$/.test(i)){e.value=``,this.setAssignment(n,``);return}this.setAssignment(n,i)}),e.addEventListener(`keydown`,n=>{let r=e.dataset.letter??``,i=t.letters.indexOf(r);if(n.key===`ArrowLeft`||n.key===`ArrowUp`){n.preventDefault();let e=t.letters.at((i-1+t.letters.length)%t.letters.length)??null;this.setActiveLetter(e,!0)}else if(n.key===`ArrowRight`||n.key===`ArrowDown`){n.preventDefault();let e=t.letters.at((i+1)%t.letters.length)??null;this.setActiveLetter(e,!0)}else n.key===`Delete`&&(n.preventDefault(),this.setAssignment(r,``))});if(e&&this.activeLetter){let e=n.querySelector(`.tp-cryptarithm-assignment-input[data-letter="${this.activeLetter}"]`);e?.focus(),e&&e.value!==``&&e.select()}}renderEquationRow(e,t,n){let r=t-e.length,i=Array.from({length:r},()=>`<div class="tp-cryptarithm-spacer"></div>`).join(``),a=e.split(``).map(e=>{let t=this.assignments[e]??``,n=[`tp-cryptarithm-char`];return e===this.activeLetter&&n.push(`current-letter`),`
          <div class="${n.join(` `)}">
            <span class="tp-cryptarithm-char-symbol">${e}</span>
            <span class="tp-cryptarithm-char-digit">${u(t||` `)}</span>
          </div>
        `}).join(``);return`
      <div class="tp-cryptarithm-equation-row">
        <span class="tp-cryptarithm-operator">${u(n)}</span>
        ${i}
        ${a}
      </div>
    `}resolveTerm(e,t=``){return e.split(``).map(e=>this.assignments[e]??t).join(``)}pushHistory(e){this.history=this.history.slice(0,this.historyIndex+1),this.history.push(c(e)),this.historyIndex=this.history.length-1}getInitialAssignments(){let e=this.puzzle;if(!e)return{};let t={};for(let n of e.initialLetters){let r=e.solutionByLetter[n];r!==void 0&&(t[n]=r)}return t}getFirstEditableLetter(){let e=this.puzzle;return e?e.letters.find(t=>!e.initialLetters.includes(t))??e.letters[0]??null:null}};function c(e){return{...e??{}}}function l(e,t,n){return n.every(n=>(e[n]??``)===(t[n]??``))}function u(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}var d=`tp-md-cryptarithm-styles`,f=`
.tp-cryptarithm {
  box-sizing: border-box;
  display: block;
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 760px;
  margin: 1rem 0;
  padding: 1rem;
  background: #f9f9fb;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.tp-cryptarithm *,
.tp-cryptarithm *::before,
.tp-cryptarithm *::after {
  box-sizing: border-box;
}

.tp-cryptarithm-container {
  display: grid;
  gap: 1rem;
}

.tp-cryptarithm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tp-cryptarithm-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #223;
}

.tp-cryptarithm-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: nowrap;
  max-width: 100%;
  overflow-x: auto;
}

.tp-cryptarithm-controls > * {
  flex: 0 0 auto;
}

.tp-cryptarithm button {
  appearance: none;
  height: 2.25rem;
  padding: 0 0.9rem;
  background: #0b63ce;
  color: white;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  font: inherit;
}

.tp-cryptarithm button:disabled {
  background: #c3c7cf;
  cursor: not-allowed;
}

.tp-cryptarithm select {
  width: auto;
  min-width: 0;
  max-width: none;
  height: 2.25rem;
  padding: 0 0.7rem;
  border: 1px solid #c7d2e0;
  border-radius: 4px;
  background: white;
  color: #223;
  font: inherit;
}

.tp-cryptarithm-board {
  display: grid;
  gap: 1rem;
}

.tp-cryptarithm-equation {
  display: grid;
  gap: 0.2rem;
  justify-content: start;
}

.tp-cryptarithm-equation-row {
  display: grid;
  grid-template-columns: 1.5rem repeat(var(--tp-cryptarithm-cols), minmax(2.4rem, 1fr));
  gap: 0.3rem;
  align-items: stretch;
}

.tp-cryptarithm-operator {
  display: flex;
  align-items: center;
  justify-content: center;
  font: 700 1.2rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  color: #334155;
}

.tp-cryptarithm-char,
.tp-cryptarithm-spacer {
  min-height: 3.2rem;
}

.tp-cryptarithm-char {
  display: grid;
  grid-template-rows: 1fr 1fr;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  background: white;
}

.tp-cryptarithm-char.current-letter {
  box-shadow: inset 0 0 0 2px #0b63ce;
}

.tp-cryptarithm-char-symbol,
.tp-cryptarithm-char-digit {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.tp-cryptarithm-char-symbol {
  background: #eef4ff;
  font-weight: 700;
  color: #1e3a8a;
}

.tp-cryptarithm-char-digit {
  color: #1f2937;
  font-weight: 600;
}

.tp-cryptarithm-result-separator {
  height: 0;
  border-top: 2px solid #334155;
  margin: 0.15rem 0 0.2rem 1.8rem;
}

.tp-cryptarithm-preview {
  padding: 0.65rem 0.8rem;
  border-radius: 6px;
  background: #eef4ff;
  color: #1e3a8a;
  font: 600 1rem/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
}

.tp-cryptarithm-assignments {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: flex-start;
}

.tp-cryptarithm-assignment {
  display: grid;
  grid-template-rows: 1rem 2.4rem;
  flex: 0 0 72px;
  width: 72px;
  gap: 0.35rem;
  padding: 0.65rem;
  border: 1px solid #d6deea;
  border-radius: 6px;
  background: white;
  align-content: start;
}

.tp-cryptarithm-assignment.current-letter {
  border-color: #0b63ce;
  box-shadow: inset 0 0 0 1px #0b63ce;
}

.tp-cryptarithm-assignment.initial {
  background: #dbe7ff;
  border-color: #bfd3fb;
}

.tp-cryptarithm-assignment.incorrect {
  background: #ffebee;
  border-color: #f3b0b7;
}

.tp-cryptarithm-assignment-label {
  font: 700 1rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  color: #1f2937;
  text-align: center;
}

.tp-cryptarithm-assignment-input {
  width: 100%;
  height: 2.4rem;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  outline: none;
  text-align: center;
  font: 700 1.1rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  color: #111827;
}

.tp-cryptarithm-assignment.initial .tp-cryptarithm-assignment-input {
  background: #f4f8ff;
  color: #1d4f91;
  font-weight: 800;
}

.tp-cryptarithm-assignment-input:focus {
  border-color: #0b63ce;
  box-shadow: 0 0 0 2px rgba(11, 99, 206, 0.18);
}

.tp-cryptarithm-status {
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  min-height: 1.5rem;
}

.tp-cryptarithm-status.success {
  background: #d4edda;
  color: #155724;
}

.tp-cryptarithm-status.info {
  background: #dbeafe;
  color: #1e3a8a;
}

.tp-cryptarithm-error {
  padding: 1rem;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
`;function p(){return`
    <div class="tp-cryptarithm-container">
      <div class="tp-cryptarithm-header">
        <div class="tp-cryptarithm-title">Cryptarithm</div>
        <div class="tp-cryptarithm-controls">
          <button class="tp-cryptarithm-undo" disabled>Undo</button>
          <button class="tp-cryptarithm-redo" disabled>Redo</button>
          <select class="tp-cryptarithm-assist">
            <option value="">Assist…</option>
            <option value="reset-game">Reset the game</option>
            <option value="show-incorrect">Show all incorrect letters</option>
            <option value="clear-incorrect">Clear the incorrect letters</option>
            <option value="show-letter">Show the letter</option>
            <option value="show-solution">Show the solution</option>
          </select>
        </div>
      </div>

      <div class="tp-cryptarithm-board"></div>
      <div class="tp-cryptarithm-status"></div>
    </div>
  `}var m=`tp-cryptarithm.tp-cryptarithm{box-sizing:border-box;color:var(--tp-fg,inherit);display:flow-root}.tp-cryptarithm-shell{gap:1rem;display:grid}.tp-cryptarithm-board{gap:.75rem;display:grid;overflow:auto}.tp-cryptarithm-status{min-height:1.25rem}.tp-cryptarithm-status.success{color:var(--tp-success,#1a7f37)}.tp-cryptarithm-status.info{color:var(--tp-info-text-on-soft,#173b65);background:var(--tp-info-fill-soft,#eff6ff)}.tp-cryptarithm-error{color:var(--tp-danger-text-on-soft,#721c24);background:var(--tp-danger-fill-softer,#f8d7da);font-weight:600}.tp-cryptarithm-shell button,.tp-cryptarithm-shell select,.tp-cryptarithm-shell input{font:inherit}`,h=class t extends e{static styleId=d;engine=null;boardElement=null;statusElement=null;undoButton=null;redoButton=null;assistSelect=null;connectedCallback(){super.connectedCallback(),this.ensureGlobalStyle(t.styleId,f),this.ensureGlobalStyle(`${t.styleId}-component`,m),this.classList.add(`tp-cryptarithm`);let e=this.readPuzzleDefinition();if(!e){this.renderError(`Empty cryptarithm puzzle`);return}if(new Set(e.equation.toUpperCase().match(/[A-Z]/g)??[]).size>10){this.renderError(`Cryptarithm puzzles can use at most 10 distinct letters`);return}try{this.engine=new s({onChange:()=>this.updateStatus()}),this.engine.initialize(e.equation,e.solution),this.render()}catch(e){this.renderError(e instanceof Error?e.message:String(e))}}readPuzzleDefinition(){let e=this.getAttribute(`equation`)?.trim()||this.dataset.cryptarithmEquation?.trim()||``,t=this.getAttribute(`solution`)?.trim()||this.dataset.cryptarithmSolution?.trim()||``;if(e!==``&&t!==``)return{equation:e,solution:t};let n=this.querySelector(`dl`);if(!n)return null;let r=``,i=``,a=``;for(let e of n.children)if(e.tagName===`DT`)a=e.textContent?.trim().toLowerCase()??``;else if(e.tagName===`DD`){let t=e.textContent?.trim()??``;a===`equation`?r=t:a===`solution`&&(i=t)}return r===``||i===``?null:{equation:r,solution:i}}render(){this.innerHTML=`
      ${p()}
    `,this.boardElement=this.querySelector(`.tp-cryptarithm-board`),this.statusElement=this.querySelector(`.tp-cryptarithm-status`),this.undoButton=this.querySelector(`.tp-cryptarithm-undo`),this.redoButton=this.querySelector(`.tp-cryptarithm-redo`),this.assistSelect=this.querySelector(`.tp-cryptarithm-assist`),this.assistSelect?.setAttribute(`aria-label`,`Assistance actions`),!(!this.engine||!this.boardElement)&&(this.engine.renderBoard(this.boardElement),this.attachEventListeners(),this.updateStatus())}attachEventListeners(){if(!(!this.engine||!this.boardElement||!this.undoButton||!this.redoButton||!this.assistSelect)){this.boardElement.addEventListener(`click`,e=>{let t=e.target;if(!(t instanceof Element))return;let n=t.closest(`.tp-cryptarithm-char`)?.querySelector(`.tp-cryptarithm-char-symbol`)?.textContent?.trim()??``;n!==``&&(this.engine?.setActiveLetter(n,!0),this.boardElement?.querySelector(`.tp-cryptarithm-assignment-input[data-letter="${n}"]`)?.focus())}),this.undoButton.addEventListener(`click`,()=>{this.engine?.undo(),this.updateStatus()}),this.redoButton.addEventListener(`click`,()=>{this.engine?.redo(),this.updateStatus()}),this.assistSelect.addEventListener(`change`,()=>{if(!(!this.engine||!this.assistSelect)){switch(this.assistSelect.value){case`reset-game`:this.engine.resetGame();break;case`show-incorrect`:this.engine.showIncorrectAssignments();break;case`clear-incorrect`:this.engine.clearIncorrectAssignments();break;case`show-letter`:this.engine.showLetter();break;case`show-solution`:this.engine.showSolution();break;default:break}this.assistSelect.value=``,this.updateStatus()}});for(let e of[this.undoButton,this.redoButton])e.addEventListener(`mousedown`,e=>{e.preventDefault()})}}updateStatus(){if(!this.engine||!this.statusElement||!this.undoButton||!this.redoButton)return;let e=this.engine.getValidation();if(this.undoButton.disabled=!this.engine.canUndo(),this.redoButton.disabled=!this.engine.canRedo(),this.statusElement.className=`tp-cryptarithm-status`,e.isSolved){this.statusElement.textContent=`✓ Solved!`,this.statusElement.classList.add(`success`);return}let t=[],n=this.engine.countEmptyLetters(),r=this.engine.countIncorrectLetters();this.engine.isShowingIncorrectAssignments()&&r>0?t.push(`${r} incorrect letter${r===1?``:`s`} shown`):t.push(`${n} empty letter${n===1?``:`s`}`),e.hasDuplicateDigits&&t.push(`duplicate digits`),e.hasLeadingZero&&t.push(`leading digit cannot be 0`),e.isComplete&&!e.equationMatches&&t.push(`equation mismatch`),this.statusElement.textContent=t.join(` · `),this.statusElement.classList.add(`info`)}renderError(e){this.innerHTML=`<div class="tp-cryptarithm-error">Error: ${e}</div>`}};customElements.get(`tp-cryptarithm`)||customElements.define(`tp-cryptarithm`,h);export{h as t};
//# sourceMappingURL=cryptarithm.js.map