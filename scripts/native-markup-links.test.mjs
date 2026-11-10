import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {parseFragment} from 'parse5';
import {TpAsciidocParser} from '@tp/tp-asciidoc';
import {nativeMarkup} from './native-markup.mjs';
import {namedExamples,viewerSource} from './component-basic-examples.mjs';

function links(html) {
 const result=[];
 const visit=node=>{if(node.tagName==='a')result.push(node.attrs.find(a=>a.name==='href')?.value);for(const child of node.childNodes??[])visit(child);};
 visit(parseFragment(html));return result;
}
test('AsciiDoc conversion renders local, relative and external URLs as links', async()=>{
 const urls=['/tracks/first.wav','tracks/second.wav','#track','https://example.com/audio.wav'];
 const source=nativeMarkup('adoc',`<ol>${urls.map((url,i)=>`<li><a href="${url}">Track ${i+1}</a></li>`).join('')}</ol>`);
 const html=await new TpAsciidocParser().render(source);
 assert.deepEqual(links(html),urls);
});
test('audio playlist AsciiDoc Basic usage contains two playable track links',async()=>{
 const file=readFileSync(new URL('../public/docs/components/audio-playlist/examples/examples.adoc',import.meta.url),'utf8');
 const basic=namedExamples('adoc',viewerSource('adoc',file)).find(e=>e.label==='Basic usage');
 const html=await new TpAsciidocParser().render(basic.source);
 assert.match(html,/<tp-audio-playlist>/);
 assert.deepEqual(links(html),['/docs/components/audio-playlist/examples/track-1.wav','/docs/components/audio-playlist/examples/track-2.wav']);
});
