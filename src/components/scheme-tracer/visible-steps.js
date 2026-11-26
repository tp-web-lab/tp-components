export { traceVisibleState as schemeVisibleState, compactTraceSteps as compactSchemeSteps } from "../trace/visible-steps.js";
/** Use LIPS lexical tokens, so strings, characters and comments cannot be
 * mistaken for delimiters. Positions are keyed by line/column because a query
 * is parsed separately with its original line numbers.
 */
export function schemeSourceRanges(tokens, code) {
 const offsets=[0];
 for(const char of code) offsets.push(offsets.at(-1)+char.length);
 const ranges=new Map(), stack=[];
 const significant=t=>t.token.trim() && !t.token.startsWith(';') && !t.token.startsWith('#|');
 const items=tokens.filter(significant);
 for(const t of items) {
  const start=offsets[t.offset];
  const range={start,end:start+t.token.length};
  ranges.set(`${t.line}:${t.col}`,range);
  if(t.token==='(' || t.token==='[' || /^#.*\($/.test(t.token)) stack.push(range);
  else if(t.token===')'||t.token===']') {const opening=stack.pop();if(opening)opening.end=range.end;}
 }
 for(let i=items.length-2;i>=0;i--) {
  if(["'","`",",",",@","#;"].includes(items[i].token)) {
   ranges.get(`${items[i].line}:${items[i].col}`).end=ranges.get(`${items[i+1].line}:${items[i+1].col}`).end;
  }
 }
 return ranges;
}
