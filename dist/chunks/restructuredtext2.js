import{dedent as e}from"../utilities/code.js";import{t}from"./base.js";import{DeferredVisibility as n}from"../utilities/deferred-visibility.js";import{getComponentSourceBaseUrl as r,resolveComponentSourceUrl as i}from"../utilities/source-url.js";import{t as a}from"./tool-loading.js";var o=new Set(`a.abbr.address.area.article.aside.audio.b.base.bdi.bdo.blockquote.body.button.canvas.caption.cite.code.col.colgroup.data.datalist.dd.del.details.dfn.dialog.div.dl.dt.em.embed.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.head.hgroup.i.iframe.ins.kbd.label.legend.li.main.map.mark.menu.meter.nav.object.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.script.section.select.slot.small.span.strong.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.u.ul.var.video.input.img.br.hr.html.link.meta.noscript.param.source.style.track.title.wbr`.split(`.`)),s=new Set(`a.abbr.audio.b.bdi.bdo.br.button.canvas.cite.code.data.datalist.del.dfn.em.embed.i.iframe.img.input.ins.kbd.label.map.mark.meter.noscript.object.output.picture.progress.q.rp.rt.ruby.s.samp.select.slot.small.source.span.strong.sub.sup.template.textarea.time.track.u.var.video.wbr`.split(`.`)),c=new Set(`admonition.attention.caution.class.code.code-block.compound.container.contents.csv-table.danger.date.default-role.epigraph.error.figure.footer.header.highlights.hint.image.important.include.line-block.list-table.math.meta.note.parsed-literal.pull-quote.raw.replace.role.rubric.sectnum.sidebar.table.tip.title.topic.unicode.warning`.split(`.`)),l=/^\s*\.\.\s+([a-z][a-z\d.-]*)::/gim,u=/:([a-z][a-z\d.-]*):`/gi,d=/^\s*\.\.\s+role::\s+[a-z][a-z\d.-]*\(([a-z][a-z\d.-]*)\)/gim;function f(e){return o.has(e)||!c.has(e)&&e.includes(`-`)}function p(e){return s.has(e)||e.includes(`-`)}function m(e){let t=new Set;for(let n of e.matchAll(l)){let e=n[1]?.toLowerCase();e!==void 0&&f(e)&&t.add(e)}return[...t]}function h(e){let t=new Set;for(let n of[u,d])for(let r of e.matchAll(n)){let e=r[1]?.toLowerCase();e!==void 0&&p(e)&&t.add(e)}return[...t]}var g=`
import html
import json
import re
import doctest
from io import StringIO

from docutils import nodes, utils
from docutils.core import publish_doctree, publish_parts
from docutils.writers.html5_polyglot import HTMLTranslator, Writer
from docutils.parsers.rst import Directive, directives, roles
from docutils.parsers.rst.directives.body import MathBlock

source = tp_rst_source
settings = json.loads(tp_rst_settings)
component_names = json.loads(tp_rst_component_names)
component_role_names = json.loads(tp_rst_component_role_names)

# Keep native Docutils semantics (including MathML overrides) for LaTeX.
roles.register_local_role("latexmath", roles.math_role)
directives.register_directive("latexmath", MathBlock)


def asciimath_node(rawtext, text, display, options):
    tag = "div" if display else "span"
    options = dict(options)
    if "class" in options:
        options["classes"] = options.pop("class")
    attributes = serialize_attributes({
        **options,
        "data-mathjax-asciimath": text,
        "data-mathjax-display": str(display).lower(),
    })
    return nodes.raw(rawtext, f"<{tag}{attributes}></{tag}>", format="html")


def asciimath_role(name, rawtext, text, lineno, inliner, options=None, content=None):
    return [asciimath_node(rawtext, utils.unescape(text, restore_backslashes=True), False, options or {})], []


asciimath_role.options = {"class": directives.class_option}
roles.register_local_role("asciimath", asciimath_role)


class AsciiMathDirective(Directive):
    has_content = True
    optional_arguments = 1
    final_argument_whitespace = True
    option_spec = {"class": directives.class_option}

    def run(self):
        if not self.arguments:
            self.assert_has_content()
        text = "\\n".join(self.arguments + list(self.content))
        return [asciimath_node(self.block_text, text, True, self.options)]


directives.register_directive("asciimath", AsciiMathDirective)

VOID_ELEMENTS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}
RAW_TEXT_ELEMENTS = {"script", "style", "textarea", "template"}
ATTRIBUTE_NAME = re.compile(r"^[A-Za-z_:][A-Za-z0-9_.:-]*$")


def option_value(argument):
    return True if argument is None else argument


class AnyOptionSpec(dict):
    def __bool__(self):
        return True

    def __contains__(self, key):
        return True

    def __getitem__(self, key):
        return option_value


def serialize_attributes(options):
    attributes = []
    for name, value in options.items():
        if name == "classes":
            name = "class"
            value = " ".join(value)
        if not ATTRIBUTE_NAME.fullmatch(name):
            continue
        escaped_name = html.escape(name, quote=True)
        if value is True:
            attributes.append(escaped_name)
        else:
            escaped_value = html.escape(str(value), quote=True)
            attributes.append(f'{escaped_name}="{escaped_value}"')
    return " " + " ".join(attributes) if attributes else ""


class WebComponentDirective(Directive):
    has_content = True
    optional_arguments = 0
    final_argument_whitespace = False
    option_spec = AnyOptionSpec()

    def run(self):
        tag_name = self.name.lower()
        suffix = serialize_attributes(self.options)
        opening = nodes.raw("", f"<{tag_name}{suffix}>", format="html")

        if tag_name in VOID_ELEMENTS:
            return [opening]

        if tag_name in RAW_TEXT_ELEMENTS:
            source_text = "\\n".join(self.content)
            content = nodes.raw("", source_text, format="html")
            closing = nodes.raw("", f"</{tag_name}>", format="html")
            return [opening, content, closing]

        content = nodes.container()
        self.state.nested_parse(self.content, self.content_offset, content)
        closing = nodes.raw("", f"</{tag_name}>", format="html")
        return [opening, *content.children, closing]


for component_name in component_names:
    directives.register_directive(component_name, WebComponentDirective)


class RstViewerDirective(Directive):
    has_content = True
    option_spec = {
        "allow-script": directives.flag,
        "data-tp-source": directives.unchanged,
        "label": directives.unchanged,
        "layout": directives.unchanged,
    }

    def run(self):
        layout = self.options.get("layout", "both")
        if layout not in {"both", "source", "output"}:
            layout = "both"
        allow_script = "allow-script" in self.options
        source_context = self.options.get("data-tp-source", "")
        label = self.options.get("label", "")
        source_text = "\\n".join(self.content)
        source_attribute = (
            ' data-tp-source="' + html.escape(source_context, quote=True) + '"'
            if source_context else ""
        )

        output = (
            '<div class="tp-rstviewer"'
            + ' data-rstviewer-layout="' + layout + '"'
            + ' data-rstviewer-allow-script="' + str(allow_script).lower() + '"'
            + ' data-rstviewer-label="' + html.escape(label, quote=True) + '"'
            + source_attribute
            + '>'
            + '<template class="tp-rstviewer-source">'
            + html.escape(source_text)
            + '</template>'
            + '<div class="tp-rstviewer-toolbar">'
            + '<label><select class="tp-rstviewer-layout" aria-label="Layout">'
            + '<option value="both"' + (' selected' if layout == 'both' else '') + '>Both</option>'
            + '<option value="source"' + (' selected' if layout == 'source' else '') + '>Source only</option>'
            + '<option value="output"' + (' selected' if layout == 'output' else '') + '>Output only</option>'
            + '</select></label>'
            + '<label><select class="tp-rstviewer-mode" aria-label="Output mode">'
            + '<option value="render">Rendered HTML</option>'
            + '<option value="html">HTML code</option>'
            + '</select></label></div>'
            + '<div class="tp-rstviewer-start">'
            + '<div class="tp-rstviewer-start-controls"></div>'
            + '<div class="tp-rstviewer-source-output"></div></div>'
            + '<div class="tp-rstviewer-end">'
            + '<div class="tp-rstviewer-output"></div></div></div>'
        )
        return [nodes.raw("", output, format="html")]


directives.register_directive("rstviewer", RstViewerDirective)


def create_web_component_role(tag_name):
    def web_component_role(
        name,
        rawtext,
        text,
        lineno,
        inliner,
        options=None,
        content=None,
    ):
        attributes = serialize_attributes(options or {})
        if tag_name in VOID_ELEMENTS:
            output = f"<{tag_name}{attributes}>"
        else:
            escaped_text = html.escape(text)
            output = f"<{tag_name}{attributes}>{escaped_text}</{tag_name}>"
        return [nodes.raw(rawtext, output, format="html")], []

    web_component_role.options = AnyOptionSpec()
    return web_component_role


for component_role_name in component_role_names:
    roles.register_local_role(
        component_role_name,
        create_web_component_role(component_role_name),
    )


def node_to_data(node):
    if isinstance(node, nodes.Text):
        return {"type": node.__class__.__name__, "source": str(node)}
    data = {
        "type": node.__class__.__name__,
        "attributes": dict(node.attributes),
    }
    children = [node_to_data(child) for child in node.children]
    if children:
        data["children"] = children
    if not children and node.astext():
        data["source"] = node.astext()
    return data


class FragmentHTMLTranslator(HTMLTranslator):
    def depart_document(self, node):
        super().depart_document(node)
        # Omit only the document wrapper appended by Docutils. Keep titles,
        # document information, decorations, and any author-provided main tag.
        self.html_body = (
            self.body_prefix[1:-1] + self.body_pre_docinfo + self.docinfo
            + self.body + self.body_suffix[1:-1]
        )


fragment_writer = Writer()
fragment_writer.translator_class = FragmentHTMLTranslator
document = publish_doctree(source=source, settings_overrides=settings)
html_output = publish_parts(
    source=source,
    writer=fragment_writer,
    settings_overrides={**settings, "output_encoding": "unicode"},
)["html_body"]

doctest_result = None
if tp_rst_doctest:
    doctest_globals = {}
    block_results = []
    for index, block in enumerate(document.findall(nodes.doctest_block)):
        output = StringIO()
        test = doctest.DocTestParser().get_doctest(
            block.astext(), doctest_globals, f"block-{index + 1}", "<restructuredtext>", 0
        )
        runner = doctest.DocTestRunner(verbose=False)
        result = runner.run(test, out=output.write, clear_globs=False)
        block_results.append({
            "index": index,
            "attempted": result.attempted,
            "passed": result.attempted - result.failed,
            "failed": result.failed,
            "output": output.getvalue(),
        })

    attempted = sum(block["attempted"] for block in block_results)
    failed = sum(block["failed"] for block in block_results)
    doctest_result = {
        "attempted": attempted,
        "passed": attempted - failed,
        "failed": failed,
        "blocks": block_results,
    }

result_data = {
    "html": html_output,
    "ast": node_to_data(document),
}
if doctest_result is not None:
    result_data["doctest"] = doctest_result

tp_rst_result = json.dumps(result_data, default=str)
`,_=`https://cdn.jsdelivr.net/pyodide/v0.29.3/full/`,v=`${_}pyodide.js`,y,b,x=Promise.resolve();function S(e){return typeof document>`u`?Promise.reject(Error(`Pyodide requires a browser document.`)):window.loadPyodide===void 0?(y===void 0&&(y=new Promise((t,n)=>{let r=document.createElement(`script`);r.src=e,r.addEventListener(`load`,()=>t(),{once:!0}),r.addEventListener(`error`,()=>n(Error(`Unable to load Pyodide from ${e}.`)),{once:!0}),document.head.append(r)})),y):Promise.resolve()}async function C(e){return b===void 0&&(b=(async()=>{await S(e.pyodideUrl??v);let t=window.loadPyodide;if(t===void 0)throw Error(`Pyodide did not initialize.`);return t({indexURL:e.indexURL??_})})()),b}function w(e){if(typeof e==`string`)return e;if(typeof e==`object`&&e&&`toJs`in e&&typeof e.toJs==`function`){let t=e.toJs();if(`destroy`in e&&typeof e.destroy==`function`&&e.destroy(),typeof t==`string`)return t}throw TypeError(`Docutils conversion did not return a JSON string.`)}var T=class{options;constructor(e={}){this.options={...e}}configure(e){this.options={...this.options,...e}}async process(e){let t=this.options,n=x.then(async()=>{let n=await C(t);await n.loadPackage([`docutils`,`pygments`,...t.packages??[]]);let r={report_level:2,halt_level:5,raw_enabled:!0,file_insertion_enabled:!1,syntax_highlight:`none`,math_output:`MathJax https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js`,...t.settings},i=t.webComponents===!1?[]:m(e),a=t.webComponents===!1?[]:h(e);n.globals.set(`tp_rst_source`,e),n.globals.set(`tp_rst_settings`,JSON.stringify(r)),n.globals.set(`tp_rst_component_names`,JSON.stringify(i)),n.globals.set(`tp_rst_component_role_names`,JSON.stringify(a)),n.globals.set(`tp_rst_doctest`,t.doctest===!0);try{await n.runPythonAsync(g);let e=w(n.globals.get(`tp_rst_result`));return JSON.parse(e)}finally{n.globals.delete(`tp_rst_source`),n.globals.delete(`tp_rst_settings`),n.globals.delete(`tp_rst_component_names`),n.globals.delete(`tp_rst_component_role_names`),n.globals.delete(`tp_rst_doctest`),n.globals.delete(`tp_rst_result`)}});return x=n.then(()=>void 0,()=>void 0),n}async renderDocument(e){return this.process(e)}async parse(e){return(await this.process(e)).ast}async render(e){return(await this.process(e)).html}async convert(e){return this.render(e)}};async function E(e){let t=e.querySelectorAll(`.math, [data-mathjax-tex], [data-mathjax-asciimath]`);if(t.length===0)return;for(let e of t){if(e.hasAttribute(`data-mathjax-tex`)||e.hasAttribute(`data-mathjax-asciimath`)||e.querySelector(`math, mjx-container`))continue;let t=e.textContent?.trim()??``;e.setAttribute(`data-mathjax-tex`,t.replace(/^\\[([]|\\[)\]]$/g,``)),e.setAttribute(`data-mathjax-display`,String(e.localName===`div`)),e.replaceChildren()}let{default:n}=await import(`./math2.js`).then(e=>e.t);await n.render(e)}var D=`tp-rstviewer-styles`,O=`
.tp-rstviewer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.5rem;
  margin-block: 1rem;
  overflow: visible;
  align-items: start;
}
.tp-rstviewer-toolbar {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  align-items: end;
}
.tp-rstviewer-toolbar label,
.tp-rstviewer-start-controls label { display: grid; gap: 0.15rem; margin: 0; }
.tp-rstviewer-toolbar select,
.tp-rstviewer-start-controls select { width: 100%; height: 2.25rem; box-sizing: border-box; }
.tp-rstviewer-start,
.tp-rstviewer-end,
.tp-rstviewer-source-output,
.tp-rstviewer-output { min-inline-size: 0; max-inline-size: 100%; box-sizing: border-box; }
.tp-rstviewer-start,
.tp-rstviewer-end { grid-row: 2; align-self: start; }
.tp-rstviewer-start,
.tp-rstviewer-end {
  display: grid;
  gap: 0.5rem;
  align-content: start;
  border: 1px solid #d0d7de;
  border-radius: 0.75rem;
  background: #fff;
  overflow: hidden;
  padding: 0.5rem;
}
.tp-rstviewer-start-controls:empty { display: none; }
.tp-rstviewer pre { max-inline-size: 100%; margin: 0; overflow: auto; padding: 0; border-radius: 0.75rem; }
.tp-rstviewer pre,
.tp-rstviewer code { white-space: pre; }
.tp-rstviewer pre code { display: block; min-inline-size: max-content; white-space: inherit; }
.tp-rstviewer[data-rstviewer-layout='source'] { grid-template-columns: 1fr; }
.tp-rstviewer[data-rstviewer-layout='source'] .tp-rstviewer-end { display: none; }
.tp-rstviewer[data-rstviewer-layout='source'] .tp-rstviewer-start { grid-column: 1 / -1; inline-size: 100%; }
.tp-rstviewer[data-rstviewer-layout='output'] { grid-template-columns: 1fr; }
.tp-rstviewer[data-rstviewer-layout='output'] .tp-rstviewer-start { display: none; }
.tp-rstviewer[data-rstviewer-layout='output'] .tp-rstviewer-end { grid-column: 1 / -1; inline-size: 100%; }
@media (max-width: 60rem) {
  .tp-rstviewer { grid-template-columns: 1fr; }
  .tp-rstviewer-toolbar { grid-template-columns: 1fr; }
}
`;async function k(e,t={}){I(e);let n=t.parser??new T;for(let t of e.querySelectorAll(`.tp-rstviewer`))t instanceof HTMLElement&&await A(t,n)}async function A(e,t){if(e.dataset.rstviewerRendered===`true`)return;let n=e.querySelector(`.tp-rstviewer-source`),r=e.querySelector(`.tp-rstviewer-start-controls`),i=e.querySelector(`.tp-rstviewer-source-output`),a=e.querySelector(`.tp-rstviewer-output`),o=e.querySelector(`.tp-rstviewer-layout`),s=e.querySelector(`.tp-rstviewer-mode`);if(!(n instanceof HTMLTemplateElement)||!(r instanceof HTMLElement)||!(i instanceof HTMLElement)||!(a instanceof HTMLElement)||!(o instanceof HTMLSelectElement)||!(s instanceof HTMLSelectElement))return;e.dataset.rstviewerRendered=`true`;let c=n.content.textContent??``,l=j(c),u=l[0]??{label:`Example`,source:c};if(l.length>1){let e=N(l);r.append(e),e.addEventListener(`change`,()=>{let t=l[Number(e.value)];t!==void 0&&(u=t,d())})}let d=async()=>{i.replaceChildren(P(u.source,`restructuredtext`));let n=await t.render(u.source);if(s.value===`html`)a.replaceChildren(P(n,`html`));else{let t=document.createElement(`template`);t.innerHTML=n,await E(t.content),a.replaceChildren(t.content),e.dataset.rstviewerAllowScript===`true`&&F(a)}};o.addEventListener(`change`,()=>{e.dataset.rstviewerLayout=L(o.value)}),s.addEventListener(`change`,()=>void d()),e.dataset.rstviewerLayout=L(o.value),await d()}function j(e){let t=e.split(`
`),n=[],r=0;for(;r<t.length;){let e=(t[r]??``).match(/^\.\.\s+example::\s*(.+?)\s*$/);if(e===null){r+=1;continue}let i=[];for(r+=1;r<t.length&&!/^\.\.\s+example::/.test(t[r]??``);)i.push(t[r]??``),r+=1;n.push({label:e[1]??`Example`,source:M(i)})}return n.length>0?n:[{label:`Example`,source:e.trim()}]}function M(e){for(;e[0]?.trim()===``;)e.shift();for(;e.at(-1)?.trim()===``;)e.pop();let t=Math.min(...e.filter(e=>e.trim()!==``).map(e=>e.match(/^\s*/)?.[0].length??0));return e.map(e=>e.slice(Math.min(t,e.length))).join(`
`)}function N(e){let t=document.createElement(`select`);t.className=`tp-rstviewer-example`,t.setAttribute(`aria-label`,`Example`);for(let[n,r]of e.entries()){let e=document.createElement(`option`);e.value=String(n),e.textContent=r.label,t.append(e)}return t}function P(e,t){let n=document.createElement(`pre`),r=document.createElement(`code`);return r.className=`language-${t}`,r.textContent=e,n.append(r),n}function F(e){for(let t of e.querySelectorAll(`script`)){if(t.type.trim().toLowerCase().startsWith(`tp/`))continue;let e=document.createElement(`script`);for(let n of t.attributes)e.setAttribute(n.name,n.value);let n=t.textContent??``;e.textContent=e.type===`module`?n:`{\n${n}\n}`,t.replaceWith(e)}}function I(e){let t=e instanceof Document?e:e.ownerDocument??document;if(t.getElementById(D)!==null)return;let n=t.createElement(`style`);n.id=D,n.textContent=O,t.head.append(n)}function L(e){return e===`source`||e===`output`?e:`both`}new T;var R=`.tp-restructuredtext{display:block}.tp-restructuredtext-output{min-inline-size:0}.tp-restructuredtext-output span.math,.tp-restructuredtext-output .math mjx-container>svg{display:inline-block}.tp-restructuredtext-output table{inline-size:auto;max-inline-size:100%;display:block;overflow-x:auto}.tp-restructuredtext-output .hljs{color:var(--tp-syntax-foreground,#d4d4d4);background:var(--tp-syntax-surface,#1e1e1e);display:block;overflow-x:auto}.tp-restructuredtext-output .hljs-comment,.tp-restructuredtext-output .hljs-quote{color:var(--tp-syntax-token-comment,#6a9955);font-style:italic}.tp-restructuredtext-output .hljs-keyword,.tp-restructuredtext-output .hljs-selector-tag,.tp-restructuredtext-output .hljs-literal,.tp-restructuredtext-output .hljs-name{color:var(--tp-syntax-token-keyword,#569cd6)}.tp-restructuredtext-output .hljs-string,.tp-restructuredtext-output .hljs-attr,.tp-restructuredtext-output .hljs-regexp{color:var(--tp-syntax-token-string,#ce9178)}.tp-restructuredtext-output .hljs-number,.tp-restructuredtext-output .hljs-symbol,.tp-restructuredtext-output .hljs-bullet{color:var(--tp-syntax-token-number,#b5cea8)}.tp-restructuredtext-output .hljs-variable,.tp-restructuredtext-output .hljs-params,.tp-restructuredtext-output .hljs-selector-class,.tp-restructuredtext-output .hljs-selector-id{color:var(--tp-syntax-token-variable,#9cdcfe)}.tp-restructuredtext-output .hljs-property,.tp-restructuredtext-output .hljs-attribute,.tp-restructuredtext-output .hljs-tag,.tp-restructuredtext-output .hljs-selector-attr,.tp-restructuredtext-output .hljs-selector-pseudo{color:var(--tp-syntax-token-property,#9cdcfe)}.tp-restructuredtext-output .hljs-type{color:var(--tp-syntax-token-type,#4ec9b0)}.tp-restructuredtext-output .hljs-title,.tp-restructuredtext-output .hljs-title.function_,.tp-restructuredtext-output .hljs-function .hljs-title{color:var(--tp-syntax-token-function,#dcdcaa)}.tp-restructuredtext-output .hljs-class .hljs-title,.tp-restructuredtext-output .hljs-title.class_{color:var(--tp-syntax-token-type,#4ec9b0)}.tp-restructuredtext-output .hljs-link{color:var(--tp-syntax-token-link,#4fc1ff);text-decoration:underline}.tp-restructuredtext-output .hljs-emphasis{font-style:italic}.tp-restructuredtext-output .hljs-strong{font-weight:700}.tp-restructuredtext-error{color:#8a1c2c;background:#fff3f5;border:1px solid #f1b7bf;border-radius:.5rem;margin:0;padding:.9rem;overflow:auto}.tp-restructuredtext-output pre.doctest[data-tp-doctest],.tp-restructuredtext-output pre.doctest-block[data-tp-doctest]{border-inline-start:.25rem solid;padding-inline-start:.75rem}.tp-restructuredtext-output pre.doctest[data-tp-doctest=passed],.tp-restructuredtext-output pre.doctest-block[data-tp-doctest=passed]{border-inline-start-color:var(--tp-color-success,#237a43)}.tp-restructuredtext-output pre.doctest[data-tp-doctest=failed],.tp-restructuredtext-output pre.doctest-block[data-tp-doctest=failed]{border-inline-start-color:var(--tp-color-error,#b42335)}.tp-restructuredtext-doctest-result{margin-block:.25rem 1rem;font-size:.875em}.tp-restructuredtext-doctest-result.is-passed{color:var(--tp-color-success,#237a43)}.tp-restructuredtext-doctest-result.is-failed{color:var(--tp-color-error,#b42335)}.tp-restructuredtext-doctest-result.is-failed>pre{color:inherit;margin-block:.5rem 0;overflow:auto}`,z=`tp-restructuredtext-styles`,B=`https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js`,V=new WeakMap;function H(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function U(t){return e(t)}function W(e={}){return new T(e)}async function G(e,t){let n=document.createElement(`template`);n.innerHTML=e,await E(n.content),t.replaceChildren(n.content)}async function K(e){return W().render(e)}async function q(e){return W().parse(e)}async function J(e,t){let n=W();await G(await n.render(e),t),await k(t,{parser:n}),await Y(t)}async function Y(e){let t=Array.from(e.querySelectorAll(`pre code`));if(t.length===0)return;for(let e of t){if(Array.from(e.classList).some(e=>e.startsWith(`language-`)))continue;let t=e.closest(`pre`),n=t===null?void 0:Array.from(t.classList).find(e=>e!==`code`&&e!==`literal-block`&&e!==`number-lines`);n!==void 0&&e.classList.add(`language-${n}`)}let n=await X(e.ownerDocument);for(let e of t)n.highlightElement(e)}function X(e){let t=e.defaultView;if(t?.hljs!==void 0)return Promise.resolve(t.hljs);let n=V.get(e);if(n!==void 0)return n;let r=new Promise((n,r)=>{let i=e.createElement(`script`);i.src=B,i.dataset.tpRestructuredtextAsset=`highlight`,i.addEventListener(`load`,()=>{if(t?.hljs===void 0){r(Error(`Highlight.js did not initialize.`));return}a(`highlightjs`,`Highlight.js`),n(t.hljs)},{once:!0}),i.addEventListener(`error`,()=>r(Error(`Unable to load Highlight.js.`)),{once:!0}),e.head.append(i)});return V.set(e,r),r}var Z=class extends t{static get observedAttributes(){return[`src`,`doctest`]}outputElement=document.createElement(`div`);renderToken=0;pendingVisibility=new n(this,()=>{this.renderRestructuredText()});disconnectedCallback(){this.renderToken++,this.pendingVisibility.disconnect()}inlineSourceSnapshot=``;connectedCallback(){super.connectedCallback(),this.classList.add(`tp-restructuredtext`),this.outputElement.className=`tp-restructuredtext-output`,this.inlineSourceSnapshot=this.readInlineSource(),this.ensureGlobalStyle(z,R),this.replaceChildren(this.outputElement),this.renderRestructuredText()}attributeChangedCallback(){this.isConnected&&this.renderRestructuredText()}get src(){return this.getAttribute(`src`)??``}set src(e){e.trim()===``?this.removeAttribute(`src`):this.setAttribute(`src`,e)}get doctest(){return this.hasAttribute(`doctest`)}set doctest(e){this.toggleAttribute(`doctest`,e)}async renderRestructuredText(){let e=++this.renderToken;if(await Promise.resolve(),!(e!==this.renderToken||!this.isConnected)&&!this.pendingVisibility.defer()){this.removeAttribute(`data-tp-restructuredtext-rendered`);try{let{source:t,currentUrl:n}=await this.getRestructuredTextSource();if(e!==this.renderToken)return;this.setAttribute(`data-tp-restructuredtext-source`,n.pathname);let r=W({doctest:this.doctest}),i=await r.renderDocument(t);await G(i.html,this.outputElement),await k(this.outputElement,{parser:r}),await Y(this.outputElement),i.doctest!=null&&(this.renderDoctestResults(i.doctest),this.dispatchEvent(new CustomEvent(`tp-restructuredtext-doctest`,{bubbles:!0,detail:i.doctest})))}catch(t){if(e!==this.renderToken)return;let n=t instanceof Error?t.message:String(t);this.outputElement.innerHTML=`<pre class="tp-restructuredtext-error" role="alert"><code>${H(n)}</code></pre>`}e===this.renderToken&&(this.setAttribute(`data-tp-restructuredtext-rendered`,``),this.dispatchEvent(new CustomEvent(`tp-restructuredtext-rendered`,{bubbles:!0})))}}renderDoctestResults(e){let t=this.outputElement.querySelectorAll(`pre.doctest, pre.doctest-block`);for(let n of e.blocks){let e=t.item(n.index);if(e===null)continue;let r=n.failed===0;e.dataset.tpDoctest=r?`passed`:`failed`;let i=document.createElement(r?`p`:`details`);i.className=`tp-restructuredtext-doctest-result ${r?`is-passed`:`is-failed`}`;let a=`Doctest ${r?`passed`:`failed`} (${String(n.passed)}/${String(n.attempted)}).`;if(r)i.textContent=`✓ ${a}`,i.setAttribute(`role`,`status`);else{let e=document.createElement(`summary`);e.textContent=`✕ ${a}`;let t=document.createElement(`pre`),r=document.createElement(`code`);r.textContent=n.output,t.append(r),i.append(e,t)}e.after(i)}}async getRestructuredTextSource(){let e=this.src.trim();if(e===``)return{source:this.inlineSourceSnapshot,currentUrl:new URL(r(this))};let t=i(this,e),n=await fetch(t.href,{cache:`no-store`});if(!n.ok)throw Error(`Unable to load reStructuredText file: ${t.pathname} (${String(n.status)})`);return{source:await n.text(),currentUrl:t}}readInlineSource(){let e=this.querySelector(`:scope > script[type="tp/restructuredtext"]`);if(e instanceof HTMLScriptElement&&e.textContent!==null)return U(e.textContent);let t=this.querySelector(`:scope > pre > code`);return t instanceof HTMLElement&&t.textContent!==null?U(t.textContent):this.innerHTML.trim()}};customElements.get(`tp-restructuredtext`)||customElements.define(`tp-restructuredtext`,Z);export{J as a,q as i,W as n,K as o,U as r,j as s,Z as t};
//# sourceMappingURL=restructuredtext2.js.map