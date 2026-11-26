/** Pure navigation: snapshots are never deleted or rewritten by a jump. */
export function activeFrames(step) {
 return (step?.stack_to_render ?? []).filter(f => !f.is_zombie && f.frame_id !== undefined && !/^(scope-|closure-)/.test(String(f.frame_id)));
}
const id = frame => frame?.continuation_id ?? frame?.frame_id;
export function currentFrame(step) {
 const frames = activeFrames(step);
 return frames.find(f => f.is_highlighted) ?? frames.at(-1);
}
const interrupted = step => Boolean(step.exception_msg) || /exception|limit/.test(step.event);
export function stepOutIndex(steps, position) {
 const frame = currentFrame(steps[position]);
 if (!frame) return position;
 const key = id(frame);
 for (let i=position+1;i<steps.length;i++) {
  if (interrupted(steps[i]) || !activeFrames(steps[i]).some(f=>id(f)===key)) return i;
 }
 return steps.length-1;
}
export function stepOverIndex(steps, position) {
 if (!steps[position]) return position;
 if (steps[position].event === 'call') return stepOutIndex(steps,position);
 const key = id(currentFrame(steps[position]));
 for (let i=position+1;i<steps.length;i++) {
  const next = steps[i], active = currentFrame(next);
  if (interrupted(next) || id(active)===key || (key!==undefined && !activeFrames(next).some(f=>id(f)===key))) return i;
 }
 return steps.length-1;
}
export function queryStepIndex(steps, source, query) {
 if (typeof source!=='string' || typeof query!=='string' || !query.trim()) return -1;
 const offset=source.trimEnd().length+2;
 const line=(source.trimEnd()+'\n\n').split('\n').length;
 return steps.findIndex(s => s.source_range ? s.source_range.start>=offset : s.line>=line);
}
