/** Lossless JSON tree interning: shared values are stored once, never evaluated. */
export function packTrace(data) {
 const nodes=[], pool=new Map(), seen=new WeakMap();
 function encode(value) {
  if(value===null||typeof value!=='object')return value;
  if(seen.has(value))return {$:seen.get(value)};
  const node=Array.isArray(value)?{a:value.map(encode)}:{o:Object.entries(value).filter(([,v])=>v!==undefined).map(([k,v])=>[k,encode(v)])};
  const key=JSON.stringify(node);
  let id=pool.get(key);
  if(id===undefined){id=nodes.length;nodes.push(node);pool.set(key,id);}
  seen.set(value,id);return {$:id};
 }
 const root=encode(data);
 return {version:2,encoding:'tp-trace-pool-v1',nodes,root};
}
export function unpackTrace(data) {
 if(data?.version!==2)return data;
 if(data.encoding!=='tp-trace-pool-v1'||!Array.isArray(data.nodes)||data.nodes.length>300000)throw Error('Invalid compact trace.');
 const decoded=[], depths=[], weights=[];
 const value=(v,index)=>{
  if(v===null||['string','number','boolean'].includes(typeof v))return v;
  if(!v||Array.isArray(v)||Object.keys(v).length!==1||!Number.isInteger(v.$)||v.$<0||v.$>=index)throw Error('Invalid compact trace reference.');
  return decoded[v.$];
 };
 let edges=0;
 for(const [index,node] of data.nodes.entries()){
  let depth=1,weight=0;
  const measure=v=>{if(v&&typeof v==='object'){depth=Math.max(depth,1+(depths[v.$]||0));weight+=weights[v.$]||0;}else weight+=typeof v==='string'?v.length:8;return value(v,index);};
  if(!node||typeof node!=='object'||Object.keys(node).length!==1)throw Error('Invalid compact trace node.');
  if(Array.isArray(node.a)){
   edges+=node.a.length;decoded.push(node.a.map(measure));
  }else if(Array.isArray(node.o)){
   edges+=node.o.length;const result={};
   for(const pair of node.o){
    if(!Array.isArray(pair)||pair.length!==2||typeof pair[0]!=='string'||Object.hasOwn(result,pair[0]))throw Error('Invalid compact trace property.');
    Object.defineProperty(result,pair[0],{value:measure(pair[1]),enumerable:true,writable:true,configurable:true});
   }decoded.push(result);
  }else throw Error('Invalid compact trace node.');
  depths.push(depth);weights.push(weight);
  if(depth>100||weight>500000000)throw Error('Compact trace expansion is too large.');
  if(edges>3000000)throw Error('Compact trace is too large.');
 }
 return value(data.root,decoded.length);
}
export function serializeTrace(data) {
 return JSON.stringify(data.language==='scheme'&&data.trace.length>1000?packTrace(data):data,null,data.language==='scheme'&&data.trace.length>1000?undefined:2)+'\n';
}
