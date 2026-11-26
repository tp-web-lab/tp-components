/** The source/state actually displayed by the shared trace visualizer.
 * Event names alone are not a pedagogical change. Calls/returns remain distinct
 * whenever their stack, locals or returned value changes.
 */
export function traceVisibleState(step) {
 return JSON.stringify([step.source_range ?? step.line, step.globals ?? {}, step.ordered_globals,
  step.stack_to_render ?? [], step.heap ?? {}, step.stdout ?? "", step.exception_msg]);
}
export function compactTraceSteps(steps) {
 const result=[];
 let previous;
 for (const step of steps) {
  const key=traceVisibleState(step), last=result.at(-1);
  const important=s=>s && (s.exception_msg || ["exception","uncaught_exception","instruction_limit_reached"].includes(s.event));
  if(last && key===previous && !important(last) && !important(step)) {
   const count=(last.grouped_steps ?? 1)+(step.grouped_steps ?? 1);
   result[result.length-1]={...step,grouped_steps:count};
  } else result.push({...step});
  previous=key;
 }
 return result;
}
