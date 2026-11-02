function e(e){return e.trim().toUpperCase().replace(/\s+/g,` `).replace(/\s*\+\s*/g,` + `).replace(/\s*=\s*/g,` = `)}function t(e){return e.trim().replace(/\s+/g,` `).replace(/\s*\+\s*/g,` + `).replace(/\s*=\s*/g,` = `)}function n(t){let[n,r,i]=e(t).split(`=`).map(e=>e?.trim()??``);if(!n||!r||i!==void 0)throw Error(`Cryptarithm equation must contain exactly one = sign`);let a=n.split(`+`).map(e=>e.trim());if(a.length<2||a.some(e=>!/^[A-Z]+$/.test(e)))throw Error(`Cryptarithm equation must be an addition of letter words`);if(!/^[A-Z]+$/.test(r))throw Error(`Cryptarithm result must be a letter word`);return{addends:a,result:r}}function r(e){let t=``,n=[];for(let r=0;r<e.length;r++){let i=e.charAt(r);if(!/\d/.test(i))throw Error(`Cryptarithm solution must be an addition of numbers`);t+=i,e.charAt(r+1)===`!`&&(n.push(t.length-1),r+=1)}return{digits:t,initialIndexes:n}}function i(e){let[n,i,a]=t(e).split(`=`).map(e=>e?.trim()??``);if(!n||!i||a!==void 0)throw Error(`Cryptarithm solution must contain exactly one = sign`);let o=n.split(`+`).map(e=>r(e.trim()));if(o.length<2)throw Error(`Cryptarithm solution must be an addition of numbers`);return{addends:o,result:r(i)}}function a(e){let t=e.split(`
`).map(e=>e.trimEnd()).filter(e=>e.trim().length>0),n=``,r=``,i=null;for(let e of t){let t=e.trim(),a=/^(equation|solution)\s*:\s*(.+)$/i.exec(t);if(!a){let e=/^(equation|solution)\s*$/i.exec(t),a=/^:\s*(.+)$/i.exec(t);if(e){i=e[1]?.toLowerCase()??null;continue}if(a&&i){let e=a[1]?.trim()??``;i===`equation`?n=e:r=e,i=null;continue}throw Error(`Cryptarithm blocks must use either "equation: ..." / "solution: ..." lines or definition-list pairs`)}let o=a[1]?.toLowerCase(),s=a[2]?.trim()??``;o===`equation`?n=s:o===`solution`&&(r=s),i=null}if(n===``||r===``)throw Error(`Cryptarithm blocks require both equation and solution`);return{equation:n,solution:r}}function o(r,a){let o=n(r),s=i(a);if(o.addends.length!==s.addends.length)throw Error(`Cryptarithm solution must have the same number of addends as the equation`);let c={},l=new Map,u=[],d=new Set,f=new Set;for(let e=0;e<o.addends.length;e++){let t=o.addends[e]??``,n=s.addends[e];if(!n)throw Error(`Cryptarithm solution must have the same number of addends as the equation`);if(t.length!==n.digits.length)throw Error(`Each solution addend must match the corresponding word length`);for(let e=0;e<t.length;e++){let r=t.charAt(e),i=n.digits.charAt(e),a=c[r],o=l.get(i);if(a&&a!==i)throw Error(`Letter ${r} maps to inconsistent digits`);if(o&&o!==r)throw Error(`Digit ${i} is reused by both ${o} and ${r}`);c[r]=i,l.set(i,r),d.has(r)||(d.add(r),u.push(r)),n.initialIndexes.includes(e)&&f.add(r)}}if(o.result.length!==s.result.digits.length)throw Error(`The solution result must match the result word length`);for(let e=0;e<o.result.length;e++){let t=o.result.charAt(e),n=s.result.digits.charAt(e),r=c[t],i=l.get(n);if(r&&r!==n)throw Error(`Letter ${t} maps to inconsistent digits`);if(i&&i!==t)throw Error(`Digit ${n} is reused by both ${i} and ${t}`);c[t]=n,l.set(n,t),d.has(t)||(d.add(t),u.push(t)),s.result.initialIndexes.includes(e)&&f.add(t)}if(u.length>10)throw Error(`Cryptarithm puzzles can use at most 10 distinct letters`);let p=[...new Set([...o.addends.map(e=>e.charAt(0)),o.result.charAt(0)])];if(p.some(e=>c[e]===`0`))throw Error(`Leading letters cannot map to 0`);if(s.addends.reduce((e,t)=>e+BigInt(t.digits),0n)!==BigInt(s.result.digits))throw Error(`Cryptarithm solution does not satisfy the equation`);return{equation:e(r),solution:t(a),addends:o.addends,result:o.result,solutionAddends:s.addends.map(e=>e.digits),solutionResult:s.result.digits,letters:u,leadingLetters:p,solutionByLetter:c,initialLetters:u.filter(e=>f.has(e))}}var s=`tp-md-cryptarithm-styles`,c=`
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
`;function l(){return`
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
  `}export{s as a,o as i,c as n,l as r,a as t};
//# sourceMappingURL=cryptarithm-ui.js.map