import { dedent as e } from "../utilities/code.js";
import { t } from "./base.js";
import { getComponentSourceBaseUrl as n, resolveComponentSourceUrl as r } from "../utilities/source-url.js";
//#region ../tp-restructuredtext/dist/extensions/web-component.js
var i = /* @__PURE__ */ new Set(/* @__PURE__ */ "a.abbr.address.area.article.aside.audio.b.base.bdi.bdo.blockquote.body.button.canvas.caption.cite.code.col.colgroup.data.datalist.dd.del.details.dfn.dialog.div.dl.dt.em.embed.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.head.hgroup.i.iframe.ins.kbd.label.legend.li.main.map.mark.menu.meter.nav.object.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.script.section.select.slot.small.span.strong.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.u.ul.var.video.input.img.br.hr.html.link.meta.noscript.param.source.style.track.title.wbr".split(".")), a = /* @__PURE__ */ new Set(/* @__PURE__ */ "a.abbr.audio.b.bdi.bdo.br.button.canvas.cite.code.data.datalist.del.dfn.em.embed.i.iframe.img.input.ins.kbd.label.map.mark.meter.noscript.object.output.picture.progress.q.rp.rt.ruby.s.samp.select.slot.small.source.span.strong.sub.sup.template.textarea.time.track.u.var.video.wbr".split(".")), o = /* @__PURE__ */ new Set(/* @__PURE__ */ "admonition.attention.caution.class.code.code-block.compound.container.contents.csv-table.danger.date.default-role.epigraph.error.figure.footer.header.highlights.hint.image.important.include.line-block.list-table.math.meta.note.parsed-literal.pull-quote.raw.replace.role.rubric.sectnum.sidebar.table.tip.title.topic.unicode.warning".split(".")), s = /^\s*\.\.\s+([a-z][a-z\d.-]*)::/gim, c = /:([a-z][a-z\d.-]*):`/gi, l = /^\s*\.\.\s+role::\s+[a-z][a-z\d.-]*\(([a-z][a-z\d.-]*)\)/gim;
function u(e) {
	return i.has(e) || !o.has(e) && e.includes("-");
}
function d(e) {
	return a.has(e) || e.includes("-");
}
function f(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.matchAll(s)) {
		let e = n[1]?.toLowerCase();
		e !== void 0 && u(e) && t.add(e);
	}
	return [...t];
}
function p(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of [c, l]) for (let r of e.matchAll(n)) {
		let e = r[1]?.toLowerCase();
		e !== void 0 && d(e) && t.add(e);
	}
	return [...t];
}
//#endregion
//#region ../tp-restructuredtext/dist/python.js
var m = "\nimport html\nimport json\nimport re\nimport doctest\nfrom io import StringIO\n\nfrom docutils import nodes, utils\nfrom docutils.core import publish_doctree, publish_parts\nfrom docutils.writers.html5_polyglot import HTMLTranslator, Writer\nfrom docutils.parsers.rst import Directive, directives, roles\nfrom docutils.parsers.rst.directives.body import MathBlock\n\nsource = tp_rst_source\nsettings = json.loads(tp_rst_settings)\ncomponent_names = json.loads(tp_rst_component_names)\ncomponent_role_names = json.loads(tp_rst_component_role_names)\n\n# Keep native Docutils semantics (including MathML overrides) for LaTeX.\nroles.register_local_role(\"latexmath\", roles.math_role)\ndirectives.register_directive(\"latexmath\", MathBlock)\n\n\ndef asciimath_node(rawtext, text, display, options):\n    tag = \"div\" if display else \"span\"\n    options = dict(options)\n    if \"class\" in options:\n        options[\"classes\"] = options.pop(\"class\")\n    attributes = serialize_attributes({\n        **options,\n        \"data-mathjax-asciimath\": text,\n        \"data-mathjax-display\": str(display).lower(),\n    })\n    return nodes.raw(rawtext, f\"<{tag}{attributes}></{tag}>\", format=\"html\")\n\n\ndef asciimath_role(name, rawtext, text, lineno, inliner, options=None, content=None):\n    return [asciimath_node(rawtext, utils.unescape(text, restore_backslashes=True), False, options or {})], []\n\n\nasciimath_role.options = {\"class\": directives.class_option}\nroles.register_local_role(\"asciimath\", asciimath_role)\n\n\nclass AsciiMathDirective(Directive):\n    has_content = True\n    optional_arguments = 1\n    final_argument_whitespace = True\n    option_spec = {\"class\": directives.class_option}\n\n    def run(self):\n        if not self.arguments:\n            self.assert_has_content()\n        text = \"\\n\".join(self.arguments + list(self.content))\n        return [asciimath_node(self.block_text, text, True, self.options)]\n\n\ndirectives.register_directive(\"asciimath\", AsciiMathDirective)\n\nVOID_ELEMENTS = {\n    \"area\", \"base\", \"br\", \"col\", \"embed\", \"hr\", \"img\", \"input\", \"link\",\n    \"meta\", \"param\", \"source\", \"track\", \"wbr\",\n}\nRAW_TEXT_ELEMENTS = {\"script\", \"style\", \"textarea\", \"template\"}\nATTRIBUTE_NAME = re.compile(r\"^[A-Za-z_:][A-Za-z0-9_.:-]*$\")\n\n\ndef option_value(argument):\n    return True if argument is None else argument\n\n\nclass AnyOptionSpec(dict):\n    def __bool__(self):\n        return True\n\n    def __contains__(self, key):\n        return True\n\n    def __getitem__(self, key):\n        return option_value\n\n\ndef serialize_attributes(options):\n    attributes = []\n    for name, value in options.items():\n        if name == \"classes\":\n            name = \"class\"\n            value = \" \".join(value)\n        if not ATTRIBUTE_NAME.fullmatch(name):\n            continue\n        escaped_name = html.escape(name, quote=True)\n        if value is True:\n            attributes.append(escaped_name)\n        else:\n            escaped_value = html.escape(str(value), quote=True)\n            attributes.append(f'{escaped_name}=\"{escaped_value}\"')\n    return \" \" + \" \".join(attributes) if attributes else \"\"\n\n\nclass WebComponentDirective(Directive):\n    has_content = True\n    optional_arguments = 0\n    final_argument_whitespace = False\n    option_spec = AnyOptionSpec()\n\n    def run(self):\n        tag_name = self.name.lower()\n        suffix = serialize_attributes(self.options)\n        opening = nodes.raw(\"\", f\"<{tag_name}{suffix}>\", format=\"html\")\n\n        if tag_name in VOID_ELEMENTS:\n            return [opening]\n\n        if tag_name in RAW_TEXT_ELEMENTS:\n            source_text = \"\\n\".join(self.content)\n            content = nodes.raw(\"\", source_text, format=\"html\")\n            closing = nodes.raw(\"\", f\"</{tag_name}>\", format=\"html\")\n            return [opening, content, closing]\n\n        content = nodes.container()\n        self.state.nested_parse(self.content, self.content_offset, content)\n        closing = nodes.raw(\"\", f\"</{tag_name}>\", format=\"html\")\n        return [opening, *content.children, closing]\n\n\nfor component_name in component_names:\n    directives.register_directive(component_name, WebComponentDirective)\n\n\nclass RstViewerDirective(Directive):\n    has_content = True\n    option_spec = {\n        \"allow-script\": directives.flag,\n        \"data-tp-source\": directives.unchanged,\n        \"label\": directives.unchanged,\n        \"layout\": directives.unchanged,\n    }\n\n    def run(self):\n        layout = self.options.get(\"layout\", \"both\")\n        if layout not in {\"both\", \"source\", \"output\"}:\n            layout = \"both\"\n        allow_script = \"allow-script\" in self.options\n        source_context = self.options.get(\"data-tp-source\", \"\")\n        label = self.options.get(\"label\", \"\")\n        source_text = \"\\n\".join(self.content)\n        source_attribute = (\n            ' data-tp-source=\"' + html.escape(source_context, quote=True) + '\"'\n            if source_context else \"\"\n        )\n\n        output = (\n            '<div class=\"tp-rstviewer\"'\n            + ' data-rstviewer-layout=\"' + layout + '\"'\n            + ' data-rstviewer-allow-script=\"' + str(allow_script).lower() + '\"'\n            + ' data-rstviewer-label=\"' + html.escape(label, quote=True) + '\"'\n            + source_attribute\n            + '>'\n            + '<template class=\"tp-rstviewer-source\">'\n            + html.escape(source_text)\n            + '</template>'\n            + '<div class=\"tp-rstviewer-toolbar\">'\n            + '<label><select class=\"tp-rstviewer-layout\" aria-label=\"Layout\">'\n            + '<option value=\"both\"' + (' selected' if layout == 'both' else '') + '>Both</option>'\n            + '<option value=\"source\"' + (' selected' if layout == 'source' else '') + '>Source only</option>'\n            + '<option value=\"output\"' + (' selected' if layout == 'output' else '') + '>Output only</option>'\n            + '</select></label>'\n            + '<label><select class=\"tp-rstviewer-mode\" aria-label=\"Output mode\">'\n            + '<option value=\"render\">Rendered HTML</option>'\n            + '<option value=\"html\">HTML code</option>'\n            + '</select></label></div>'\n            + '<div class=\"tp-rstviewer-start\">'\n            + '<div class=\"tp-rstviewer-start-controls\"></div>'\n            + '<div class=\"tp-rstviewer-source-output\"></div></div>'\n            + '<div class=\"tp-rstviewer-end\">'\n            + '<div class=\"tp-rstviewer-output\"></div></div></div>'\n        )\n        return [nodes.raw(\"\", output, format=\"html\")]\n\n\ndirectives.register_directive(\"rstviewer\", RstViewerDirective)\n\n\ndef create_web_component_role(tag_name):\n    def web_component_role(\n        name,\n        rawtext,\n        text,\n        lineno,\n        inliner,\n        options=None,\n        content=None,\n    ):\n        attributes = serialize_attributes(options or {})\n        if tag_name in VOID_ELEMENTS:\n            output = f\"<{tag_name}{attributes}>\"\n        else:\n            escaped_text = html.escape(text)\n            output = f\"<{tag_name}{attributes}>{escaped_text}</{tag_name}>\"\n        return [nodes.raw(rawtext, output, format=\"html\")], []\n\n    web_component_role.options = AnyOptionSpec()\n    return web_component_role\n\n\nfor component_role_name in component_role_names:\n    roles.register_local_role(\n        component_role_name,\n        create_web_component_role(component_role_name),\n    )\n\n\ndef node_to_data(node):\n    if isinstance(node, nodes.Text):\n        return {\"type\": node.__class__.__name__, \"source\": str(node)}\n    data = {\n        \"type\": node.__class__.__name__,\n        \"attributes\": dict(node.attributes),\n    }\n    children = [node_to_data(child) for child in node.children]\n    if children:\n        data[\"children\"] = children\n    if not children and node.astext():\n        data[\"source\"] = node.astext()\n    return data\n\n\nclass FragmentHTMLTranslator(HTMLTranslator):\n    def depart_document(self, node):\n        super().depart_document(node)\n        # Omit only the document wrapper appended by Docutils. Keep titles,\n        # document information, decorations, and any author-provided main tag.\n        self.html_body = (\n            self.body_prefix[1:-1] + self.body_pre_docinfo + self.docinfo\n            + self.body + self.body_suffix[1:-1]\n        )\n\n\nfragment_writer = Writer()\nfragment_writer.translator_class = FragmentHTMLTranslator\ndocument = publish_doctree(source=source, settings_overrides=settings)\nhtml_output = publish_parts(\n    source=source,\n    writer=fragment_writer,\n    settings_overrides={**settings, \"output_encoding\": \"unicode\"},\n)[\"html_body\"]\n\ndoctest_result = None\nif tp_rst_doctest:\n    doctest_globals = {}\n    block_results = []\n    for index, block in enumerate(document.findall(nodes.doctest_block)):\n        output = StringIO()\n        test = doctest.DocTestParser().get_doctest(\n            block.astext(), doctest_globals, f\"block-{index + 1}\", \"<restructuredtext>\", 0\n        )\n        runner = doctest.DocTestRunner(verbose=False)\n        result = runner.run(test, out=output.write, clear_globs=False)\n        block_results.append({\n            \"index\": index,\n            \"attempted\": result.attempted,\n            \"passed\": result.attempted - result.failed,\n            \"failed\": result.failed,\n            \"output\": output.getvalue(),\n        })\n\n    attempted = sum(block[\"attempted\"] for block in block_results)\n    failed = sum(block[\"failed\"] for block in block_results)\n    doctest_result = {\n        \"attempted\": attempted,\n        \"passed\": attempted - failed,\n        \"failed\": failed,\n        \"blocks\": block_results,\n    }\n\nresult_data = {\n    \"html\": html_output,\n    \"ast\": node_to_data(document),\n}\nif doctest_result is not None:\n    result_data[\"doctest\"] = doctest_result\n\ntp_rst_result = json.dumps(result_data, default=str)\n", h = "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/", g = `${h}pyodide.js`, _, v, y = Promise.resolve();
function b(e) {
	return typeof document > "u" ? Promise.reject(/* @__PURE__ */ Error("Pyodide requires a browser document.")) : window.loadPyodide === void 0 ? (_ === void 0 && (_ = new Promise((t, n) => {
		let r = document.createElement("script");
		r.src = e, r.addEventListener("load", () => t(), { once: !0 }), r.addEventListener("error", () => n(/* @__PURE__ */ Error(`Unable to load Pyodide from ${e}.`)), { once: !0 }), document.head.append(r);
	})), _) : Promise.resolve();
}
async function x(e) {
	return v === void 0 && (v = (async () => {
		await b(e.pyodideUrl ?? g);
		let t = window.loadPyodide;
		if (t === void 0) throw Error("Pyodide did not initialize.");
		return t({ indexURL: e.indexURL ?? h });
	})()), v;
}
function S(e) {
	if (typeof e == "string") return e;
	if (typeof e == "object" && e && "toJs" in e && typeof e.toJs == "function") {
		let t = e.toJs();
		if ("destroy" in e && typeof e.destroy == "function" && e.destroy(), typeof t == "string") return t;
	}
	throw TypeError("Docutils conversion did not return a JSON string.");
}
var C = class {
	options;
	constructor(e = {}) {
		this.options = { ...e };
	}
	configure(e) {
		this.options = {
			...this.options,
			...e
		};
	}
	async process(e) {
		let t = this.options, n = y.then(async () => {
			let n = await x(t);
			await n.loadPackage([
				"docutils",
				"pygments",
				...t.packages ?? []
			]);
			let r = {
				report_level: 2,
				halt_level: 5,
				raw_enabled: !0,
				file_insertion_enabled: !1,
				syntax_highlight: "none",
				math_output: "MathJax https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js",
				...t.settings
			}, i = t.webComponents === !1 ? [] : f(e), a = t.webComponents === !1 ? [] : p(e);
			n.globals.set("tp_rst_source", e), n.globals.set("tp_rst_settings", JSON.stringify(r)), n.globals.set("tp_rst_component_names", JSON.stringify(i)), n.globals.set("tp_rst_component_role_names", JSON.stringify(a)), n.globals.set("tp_rst_doctest", t.doctest === !0);
			try {
				await n.runPythonAsync(m);
				let e = S(n.globals.get("tp_rst_result"));
				return JSON.parse(e);
			} finally {
				n.globals.delete("tp_rst_source"), n.globals.delete("tp_rst_settings"), n.globals.delete("tp_rst_component_names"), n.globals.delete("tp_rst_component_role_names"), n.globals.delete("tp_rst_doctest"), n.globals.delete("tp_rst_result");
			}
		});
		return y = n.then(() => void 0, () => void 0), n;
	}
	async renderDocument(e) {
		return this.process(e);
	}
	async parse(e) {
		return (await this.process(e)).ast;
	}
	async render(e) {
		return (await this.process(e)).html;
	}
	async convert(e) {
		return this.render(e);
	}
};
//#endregion
//#region ../tp-restructuredtext/dist/renderers/math.js
async function w(e) {
	let t = e.querySelectorAll(".math, [data-mathjax-tex], [data-mathjax-asciimath]");
	if (t.length === 0) return;
	for (let e of t) {
		if (e.hasAttribute("data-mathjax-tex") || e.hasAttribute("data-mathjax-asciimath") || e.querySelector("math, mjx-container")) continue;
		let t = e.textContent?.trim() ?? "";
		e.setAttribute("data-mathjax-tex", t.replace(/^\\[([]|\\[)\]]$/g, "")), e.setAttribute("data-mathjax-display", String(e.localName === "div")), e.replaceChildren();
	}
	let { default: n } = await import("./math.js").then((e) => e.t);
	await n.render(e);
}
//#endregion
//#region ../tp-restructuredtext/dist/renderers/rstviewer.js
var T = "tp-rstviewer-styles", E = "\n.tp-rstviewer {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  gap: 0.5rem;\n  margin-block: 1rem;\n  overflow: visible;\n  align-items: start;\n}\n.tp-rstviewer-toolbar {\n  grid-column: 1 / -1;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.5rem;\n  align-items: end;\n}\n.tp-rstviewer-toolbar label,\n.tp-rstviewer-start-controls label { display: grid; gap: 0.15rem; margin: 0; }\n.tp-rstviewer-toolbar select,\n.tp-rstviewer-start-controls select { width: 100%; height: 2.25rem; box-sizing: border-box; }\n.tp-rstviewer-start,\n.tp-rstviewer-end,\n.tp-rstviewer-source-output,\n.tp-rstviewer-output { min-inline-size: 0; max-inline-size: 100%; box-sizing: border-box; }\n.tp-rstviewer-start,\n.tp-rstviewer-end { grid-row: 2; align-self: start; }\n.tp-rstviewer-start,\n.tp-rstviewer-end {\n  display: grid;\n  gap: 0.5rem;\n  align-content: start;\n  border: 1px solid #d0d7de;\n  border-radius: 0.75rem;\n  background: #fff;\n  overflow: hidden;\n  padding: 0.5rem;\n}\n.tp-rstviewer-start-controls:empty { display: none; }\n.tp-rstviewer pre { max-inline-size: 100%; margin: 0; overflow: auto; padding: 0; border-radius: 0.75rem; }\n.tp-rstviewer pre,\n.tp-rstviewer code { white-space: pre; }\n.tp-rstviewer pre code { display: block; min-inline-size: max-content; white-space: inherit; }\n.tp-rstviewer[data-rstviewer-layout='source'] { grid-template-columns: 1fr; }\n.tp-rstviewer[data-rstviewer-layout='source'] .tp-rstviewer-end { display: none; }\n.tp-rstviewer[data-rstviewer-layout='source'] .tp-rstviewer-start { grid-column: 1 / -1; inline-size: 100%; }\n.tp-rstviewer[data-rstviewer-layout='output'] { grid-template-columns: 1fr; }\n.tp-rstviewer[data-rstviewer-layout='output'] .tp-rstviewer-start { display: none; }\n.tp-rstviewer[data-rstviewer-layout='output'] .tp-rstviewer-end { grid-column: 1 / -1; inline-size: 100%; }\n@media (max-width: 60rem) {\n  .tp-rstviewer { grid-template-columns: 1fr; }\n  .tp-rstviewer-toolbar { grid-template-columns: 1fr; }\n}\n";
async function D(e, t = {}) {
	P(e);
	let n = t.parser ?? new C();
	for (let t of e.querySelectorAll(".tp-rstviewer")) t instanceof HTMLElement && await O(t, n);
}
async function O(e, t) {
	if (e.dataset.rstviewerRendered === "true") return;
	let n = e.querySelector(".tp-rstviewer-source"), r = e.querySelector(".tp-rstviewer-start-controls"), i = e.querySelector(".tp-rstviewer-source-output"), a = e.querySelector(".tp-rstviewer-output"), o = e.querySelector(".tp-rstviewer-layout"), s = e.querySelector(".tp-rstviewer-mode");
	if (!(n instanceof HTMLTemplateElement) || !(r instanceof HTMLElement) || !(i instanceof HTMLElement) || !(a instanceof HTMLElement) || !(o instanceof HTMLSelectElement) || !(s instanceof HTMLSelectElement)) return;
	e.dataset.rstviewerRendered = "true";
	let c = n.content.textContent ?? "", l = k(c), u = l[0] ?? {
		label: "Example",
		source: c
	};
	if (l.length > 1) {
		let e = j(l);
		r.append(e), e.addEventListener("change", () => {
			let t = l[Number(e.value)];
			t !== void 0 && (u = t, d());
		});
	}
	let d = async () => {
		i.replaceChildren(M(u.source, "restructuredtext"));
		let n = await t.render(u.source);
		if (s.value === "html") a.replaceChildren(M(n, "html"));
		else {
			let t = document.createElement("template");
			t.innerHTML = n, await w(t.content), a.replaceChildren(t.content), e.dataset.rstviewerAllowScript === "true" && N(a);
		}
	};
	o.addEventListener("change", () => {
		e.dataset.rstviewerLayout = F(o.value);
	}), s.addEventListener("change", () => void d()), e.dataset.rstviewerLayout = F(o.value), await d();
}
function k(e) {
	let t = e.split("\n"), n = [], r = 0;
	for (; r < t.length;) {
		let e = (t[r] ?? "").match(/^\.\.\s+example::\s*(.+?)\s*$/);
		if (e === null) {
			r += 1;
			continue;
		}
		let i = [];
		for (r += 1; r < t.length && !/^\.\.\s+example::/.test(t[r] ?? "");) i.push(t[r] ?? ""), r += 1;
		n.push({
			label: e[1] ?? "Example",
			source: A(i)
		});
	}
	return n.length > 0 ? n : [{
		label: "Example",
		source: e.trim()
	}];
}
function A(e) {
	for (; e[0]?.trim() === "";) e.shift();
	for (; e.at(-1)?.trim() === "";) e.pop();
	let t = Math.min(...e.filter((e) => e.trim() !== "").map((e) => e.match(/^\s*/)?.[0].length ?? 0));
	return e.map((e) => e.slice(Math.min(t, e.length))).join("\n");
}
function j(e) {
	let t = document.createElement("select");
	t.className = "tp-rstviewer-example", t.setAttribute("aria-label", "Example");
	for (let [n, r] of e.entries()) {
		let e = document.createElement("option");
		e.value = String(n), e.textContent = r.label, t.append(e);
	}
	return t;
}
function M(e, t) {
	let n = document.createElement("pre"), r = document.createElement("code");
	return r.className = `language-${t}`, r.textContent = e, n.append(r), n;
}
function N(e) {
	for (let t of e.querySelectorAll("script")) {
		if (t.type.trim().toLowerCase().startsWith("tp/")) continue;
		let e = document.createElement("script");
		for (let n of t.attributes) e.setAttribute(n.name, n.value);
		let n = t.textContent ?? "";
		e.textContent = e.type === "module" ? n : `{\n${n}\n}`, t.replaceWith(e);
	}
}
function P(e) {
	let t = e instanceof Document ? e : e.ownerDocument ?? document;
	if (t.getElementById(T) !== null) return;
	let n = t.createElement("style");
	n.id = T, n.textContent = E, t.head.append(n);
}
function F(e) {
	return e === "source" || e === "output" ? e : "both";
}
new C();
//#endregion
//#region src/components/restructuredtext/restructuredtext.css?inline
var I = ".tp-restructuredtext{display:block}.tp-restructuredtext-output{min-inline-size:0}.tp-restructuredtext-output span.math,.tp-restructuredtext-output .math mjx-container>svg{display:inline-block}.tp-restructuredtext-output table{inline-size:auto;max-inline-size:100%;display:block;overflow-x:auto}.tp-restructuredtext-output .hljs{color:var(--tp-syntax-foreground,#d4d4d4);background:var(--tp-syntax-surface,#1e1e1e);display:block;overflow-x:auto}.tp-restructuredtext-output .hljs-comment,.tp-restructuredtext-output .hljs-quote{color:var(--tp-syntax-token-comment,#6a9955);font-style:italic}.tp-restructuredtext-output .hljs-keyword,.tp-restructuredtext-output .hljs-selector-tag,.tp-restructuredtext-output .hljs-literal,.tp-restructuredtext-output .hljs-name{color:var(--tp-syntax-token-keyword,#569cd6)}.tp-restructuredtext-output .hljs-string,.tp-restructuredtext-output .hljs-attr,.tp-restructuredtext-output .hljs-regexp{color:var(--tp-syntax-token-string,#ce9178)}.tp-restructuredtext-output .hljs-number,.tp-restructuredtext-output .hljs-symbol,.tp-restructuredtext-output .hljs-bullet{color:var(--tp-syntax-token-number,#b5cea8)}.tp-restructuredtext-output .hljs-variable,.tp-restructuredtext-output .hljs-params,.tp-restructuredtext-output .hljs-selector-class,.tp-restructuredtext-output .hljs-selector-id{color:var(--tp-syntax-token-variable,#9cdcfe)}.tp-restructuredtext-output .hljs-property,.tp-restructuredtext-output .hljs-attribute,.tp-restructuredtext-output .hljs-tag,.tp-restructuredtext-output .hljs-selector-attr,.tp-restructuredtext-output .hljs-selector-pseudo{color:var(--tp-syntax-token-property,#9cdcfe)}.tp-restructuredtext-output .hljs-type{color:var(--tp-syntax-token-type,#4ec9b0)}.tp-restructuredtext-output .hljs-title,.tp-restructuredtext-output .hljs-title.function_,.tp-restructuredtext-output .hljs-function .hljs-title{color:var(--tp-syntax-token-function,#dcdcaa)}.tp-restructuredtext-output .hljs-class .hljs-title,.tp-restructuredtext-output .hljs-title.class_{color:var(--tp-syntax-token-type,#4ec9b0)}.tp-restructuredtext-output .hljs-link{color:var(--tp-syntax-token-link,#4fc1ff);text-decoration:underline}.tp-restructuredtext-output .hljs-emphasis{font-style:italic}.tp-restructuredtext-output .hljs-strong{font-weight:700}.tp-restructuredtext-error{color:#8a1c2c;background:#fff3f5;border:1px solid #f1b7bf;border-radius:.5rem;margin:0;padding:.9rem;overflow:auto}.tp-restructuredtext-output pre.doctest[data-tp-doctest],.tp-restructuredtext-output pre.doctest-block[data-tp-doctest]{border-inline-start:.25rem solid;padding-inline-start:.75rem}.tp-restructuredtext-output pre.doctest[data-tp-doctest=passed],.tp-restructuredtext-output pre.doctest-block[data-tp-doctest=passed]{border-inline-start-color:var(--tp-color-success,#237a43)}.tp-restructuredtext-output pre.doctest[data-tp-doctest=failed],.tp-restructuredtext-output pre.doctest-block[data-tp-doctest=failed]{border-inline-start-color:var(--tp-color-error,#b42335)}.tp-restructuredtext-doctest-result{margin-block:.25rem 1rem;font-size:.875em}.tp-restructuredtext-doctest-result.is-passed{color:var(--tp-color-success,#237a43)}.tp-restructuredtext-doctest-result.is-failed{color:var(--tp-color-error,#b42335)}.tp-restructuredtext-doctest-result.is-failed>pre{color:inherit;margin-block:.5rem 0;overflow:auto}", L = "tp-restructuredtext-styles", R = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js", z = /* @__PURE__ */ new WeakMap();
function B(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function V(t) {
	return e(t);
}
function H(e = {}) {
	return new C(e);
}
async function U(e, t) {
	let n = document.createElement("template");
	n.innerHTML = e, await w(n.content), t.replaceChildren(n.content);
}
async function W(e) {
	return H().render(e);
}
async function G(e) {
	return H().parse(e);
}
async function K(e, t) {
	let n = H();
	await U(await n.render(e), t), await D(t, { parser: n }), await q(t);
}
async function q(e) {
	let t = Array.from(e.querySelectorAll("pre code"));
	if (t.length === 0) return;
	for (let e of t) {
		if (Array.from(e.classList).some((e) => e.startsWith("language-"))) continue;
		let t = e.closest("pre"), n = t === null ? void 0 : Array.from(t.classList).find((e) => e !== "code" && e !== "literal-block" && e !== "number-lines");
		n !== void 0 && e.classList.add(`language-${n}`);
	}
	let n = await J(e.ownerDocument);
	for (let e of t) n.highlightElement(e);
}
function J(e) {
	let t = e.defaultView;
	if (t?.hljs !== void 0) return Promise.resolve(t.hljs);
	let n = z.get(e);
	if (n !== void 0) return n;
	let r = new Promise((n, r) => {
		let i = e.createElement("script");
		i.src = R, i.dataset.tpRestructuredtextAsset = "highlight", i.addEventListener("load", () => {
			if (t?.hljs === void 0) {
				r(/* @__PURE__ */ Error("Highlight.js did not initialize."));
				return;
			}
			n(t.hljs);
		}, { once: !0 }), i.addEventListener("error", () => r(/* @__PURE__ */ Error("Unable to load Highlight.js.")), { once: !0 }), e.head.append(i);
	});
	return z.set(e, r), r;
}
var Y = class extends t {
	static get observedAttributes() {
		return ["src", "doctest"];
	}
	outputElement = document.createElement("div");
	renderToken = 0;
	inlineSourceSnapshot = "";
	connectedCallback() {
		super.connectedCallback(), this.classList.add("tp-restructuredtext"), this.outputElement.className = "tp-restructuredtext-output", this.inlineSourceSnapshot = this.readInlineSource(), this.ensureGlobalStyle(L, I), this.replaceChildren(this.outputElement), this.renderRestructuredText();
	}
	attributeChangedCallback() {
		this.isConnected && this.renderRestructuredText();
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		e.trim() === "" ? this.removeAttribute("src") : this.setAttribute("src", e);
	}
	get doctest() {
		return this.hasAttribute("doctest");
	}
	set doctest(e) {
		this.toggleAttribute("doctest", e);
	}
	async renderRestructuredText() {
		let e = ++this.renderToken;
		this.removeAttribute("data-tp-restructuredtext-rendered");
		try {
			let { source: t, currentUrl: n } = await this.getRestructuredTextSource();
			if (e !== this.renderToken) return;
			this.setAttribute("data-tp-restructuredtext-source", n.pathname);
			let r = H({ doctest: this.doctest }), i = await r.renderDocument(t);
			await U(i.html, this.outputElement), await D(this.outputElement, { parser: r }), await q(this.outputElement), i.doctest != null && (this.renderDoctestResults(i.doctest), this.dispatchEvent(new CustomEvent("tp-restructuredtext-doctest", {
				bubbles: !0,
				detail: i.doctest
			})));
		} catch (t) {
			if (e !== this.renderToken) return;
			let n = t instanceof Error ? t.message : String(t);
			this.outputElement.innerHTML = `<pre class="tp-restructuredtext-error" role="alert"><code>${B(n)}</code></pre>`;
		}
		e === this.renderToken && (this.setAttribute("data-tp-restructuredtext-rendered", ""), this.dispatchEvent(new CustomEvent("tp-restructuredtext-rendered", { bubbles: !0 })));
	}
	renderDoctestResults(e) {
		let t = this.outputElement.querySelectorAll("pre.doctest, pre.doctest-block");
		for (let n of e.blocks) {
			let e = t.item(n.index);
			if (e === null) continue;
			let r = n.failed === 0;
			e.dataset.tpDoctest = r ? "passed" : "failed";
			let i = document.createElement(r ? "p" : "details");
			i.className = `tp-restructuredtext-doctest-result ${r ? "is-passed" : "is-failed"}`;
			let a = `Doctest ${r ? "passed" : "failed"} (${String(n.passed)}/${String(n.attempted)}).`;
			if (r) i.textContent = `✓ ${a}`, i.setAttribute("role", "status");
			else {
				let e = document.createElement("summary");
				e.textContent = `✕ ${a}`;
				let t = document.createElement("pre"), r = document.createElement("code");
				r.textContent = n.output, t.append(r), i.append(e, t);
			}
			e.after(i);
		}
	}
	async getRestructuredTextSource() {
		let e = this.src.trim();
		if (e === "") return {
			source: this.inlineSourceSnapshot,
			currentUrl: new URL(n(this))
		};
		let t = r(this, e), i = await fetch(t.href, { cache: "no-store" });
		if (!i.ok) throw Error(`Unable to load reStructuredText file: ${t.pathname} (${String(i.status)})`);
		return {
			source: await i.text(),
			currentUrl: t
		};
	}
	readInlineSource() {
		let e = this.querySelector(":scope > script[type=\"tp/restructuredtext\"]");
		if (e instanceof HTMLScriptElement && e.textContent !== null) return V(e.textContent);
		let t = this.querySelector(":scope > pre > code");
		return t instanceof HTMLElement && t.textContent !== null ? V(t.textContent) : this.innerHTML.trim();
	}
};
customElements.get("tp-restructuredtext") || customElements.define("tp-restructuredtext", Y);
//#endregion
export { K as a, G as i, H as n, W as o, V as r, k as s, Y as t };

//# sourceMappingURL=restructuredtext.js.map