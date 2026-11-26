import {chromium,firefox} from '@playwright/test';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync} from 'node:fs';
import {extname,resolve} from 'node:path';
const name=process.env.BROWSER||'chrome';
const root=resolve('dist');
const server=createServer((req,res)=>{
 const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(path==='/fixture'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><body></body>');return;}
 const file=resolve(root,'.'+path);
 if(!file.startsWith(root+'/')){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.json':'application/json','.wasm':'application/wasm','.css':'text/css','.svg':'image/svg+xml'})[extname(file)]||'text/plain');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const driver=process.env.SAFARI_DRIVER_URL||'http://127.0.0.1:4445';
async function command(path,data,method='POST'){
 const r=await fetch(driver+path,{method,headers:{'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data),signal:AbortSignal.timeout(180000)});const j=await r.json();if(j.value?.error)throw Error(JSON.stringify(j.value));return j.value;
}
let browser,page,session,version;
async function evaluate(fn,arg){
 if(page)return page.evaluate(fn,arg);
 const r=await command('/session/'+session+'/execute/async',{script:`const done=arguments[arguments.length-1];Promise.resolve((${fn.toString()})(arguments[0])).then(result=>done({result}),e=>done({error:String(e.stack||e)}));`,args:[arg]});if(r.error)throw Error(r.error);return r.result;
}
const report={browser:name,checkedAt:new Date().toISOString(),checks:[]};
const samples={
 javascript:{ext:'js',values:[8,8,16,48,3,9,57],effects:'let n=0; function tick(){n++;return n;} false && tick(); true || tick(); console.log(tick()+tick(), n);',output:'3 2'},
 typescript:{ext:'ts',values:[8,8,16,48,3,9,57],effects:'let n:number=0; function tick():number {n++;return n;} false && tick(); true || tick(); console.log(tick()+tick(), n);',output:'3 2'},
 scheme:{ext:'scm',values:[8,8,16,48,3,9,57],effects:'(define n 0) (define (tick) (set! n (+ n 1)) n) (and #f (tick)) (or #t (tick)) (+ (tick) (tick)) n',output:'#f\n#t\n3\n2'},
 ocaml:{ext:'ml',values:[3,9,8,8,16,48,57],effects:'let n = ref 0;;\nlet tick () = incr n; !n;;\nignore (false && (tick () > 0));;\nignore (true || (tick () > 0));;\nprint_int (tick () + tick ());;\nprint_string " ";; print_int !n;;',output:'3 2'}
};
try{
 if(name==='safari'){const r=await command('/session',{capabilities:{alwaysMatch:{browserName:'safari'}}});session=r.sessionId;version=r.capabilities.browserVersion;await command('/session/'+session+'/timeouts',{script:120000,pageLoad:60000});}
 else{browser=await(name==='firefox'?firefox:chromium).launch(name==='chrome'?{channel:'chrome'}:{});version=browser.version();page=await browser.newPage({viewport:{width:1440,height:1000}});}
 report.version=version;
 for(const [language,sample] of Object.entries(samples)){
  const begin=performance.now();const row={language};
  try{
   if(page)await page.goto(base+'/fixture');else await command('/session/'+session+'/url',{url:base+'/fixture'});
   Object.assign(row,await evaluate(async ({language,sample})=>{
    const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
    const until=async f=>{const end=Date.now()+90000;while(!f()){if(Date.now()>end)throw Error('Timeout');await new Promise(r=>setTimeout(r,50));}};
    await import(`/components/${language}-tracer/${language}-tracer.js`);
    const t=document.createElement(`tp-${language}-tracer`);t.src=`/docs/components/${language}-tracer/examples/constant-expressions.${sample.ext}`;document.body.append(t);await t.refresh();t.record();
    await until(()=>JSON.parse(t.getCode()).trace.length>0);
    const saved=t.getCode(),data=JSON.parse(saved);
    assert(!data.trace.some(s=>s.exception_msg),'Recording error: '+JSON.stringify(data.trace.at(-1)));
    const number=v=>Array.isArray(v)&&v[0]==='SCHEME'&&/^-?\d+$/.test(v[1])?Number(v[1]):v;
    const expressions=data.trace.map((s,i)=>({s,i})).filter(({s})=>s.expression && typeof number(s.expression.value)==='number');
    const values=expressions.map(({s})=>number(s.expression.value));
    assert(JSON.stringify(values)===JSON.stringify(sample.values),'Expression order: '+JSON.stringify(values));
    assert(data.trace.at(-1).stdout.trim()==='57','Wrong output');
    const inspect=()=>{
     for(const theme of ['light','dark']){
      t.setAttribute('theme',theme);
      for(const {s,i} of expressions){
       t.goTo(i);
       const expected=data.code.slice(s.source_range.start,s.source_range.end);
       const marks=[...t.querySelectorAll('[data-role=recorded] mark')].map(x=>x.textContent).join('\n');
       assert(marks===expected,'Wrong source highlight');
       const panel=t.querySelector('[data-role=expression]');
       assert(!panel.hidden&&panel.getBoundingClientRect().height>0,'Hidden expression');
       assert(panel.textContent.includes(String(number(s.expression.value))),'Missing expression value');
       t.previousStep();t.nextStep();
       assert(panel.textContent.includes(String(number(s.expression.value))),'Previous/Next lost value');
      }
     }
    };
    inspect();assert(t.getCode()===saved,'Navigation altered recording');
    let ocamlExamples;
    if(language==='ocaml') {
     ocamlExamples=[];
     for(const [file,output,error] of [['recursion.ml','120',false],['same-line.ml','30',false],['shared.ml','9 1',false],['closures.ml','1\n2',false],['patterns.ml','6',false],['caught.ml','42',true],['error.ml','',true]]) {
      t.src='/docs/components/ocaml-tracer/examples/'+file;await t.refresh();t.record();
      await until(()=>JSON.parse(t.getCode()).trace.length>0);
      const trace=JSON.parse(t.getCode()).trace;
      assert(trace.at(-1).stdout.trim()===output,'OCaml regression: '+file);
      assert(trace.some(s=>Boolean(s.exception_msg))===error,'OCaml exception regression: '+file);
      ocamlExamples.push(file);
     }
    }
    // Side effects and lazy Boolean operands must stay native.
    t.removeAttribute('src');t.value=sample.effects;await t.refresh();t.record();
    await until(()=>JSON.parse(t.getCode()).trace.length>0);
    const effects=JSON.parse(t.getCode());assert(!effects.trace.some(s=>s.exception_msg),'Side-effect error');
    assert(effects.trace.at(-1).stdout.trim()===sample.output,'Side effects repeated: '+effects.trace.at(-1).stdout);
    window.Worker=class{constructor(){throw Error('Replay started a Worker');}};
    const url=URL.createObjectURL(new Blob([saved],{type:'application/json'}));t.trace=url;await t.refresh();
    assert(t.getCode()===saved,'Replay changed recording');inspect();URL.revokeObjectURL(url);
    return {passed:true,values,...(ocamlExamples?{ocamlExamples}:{}),sourceHighlights:true,previousNext:true,sideEffects:true,replayWithoutWorker:true,lightDark:true,steps:data.trace.length};
   },{language,sample}));
  }catch(e){row.passed=false;row.error=String(e.stack||e);}
  row.milliseconds=Math.round(performance.now()-begin);report.checks.push(row);console.log(language,row);
  writeFileSync(`config/tracer-expression-values-${name}.json`,JSON.stringify(report,null,2)+'\n');
 }
}finally{if(browser)await browser.close();if(session)await command('/session/'+session,undefined,'DELETE').catch(()=>{});server.closeAllConnections();server.close();}
if(report.checks.some(r=>!r.passed))process.exitCode=1;
