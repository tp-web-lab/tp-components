function e(e, n = {}) {
	let r = window.hljs;
	if (r === void 0) {
		console.warn("highlight.js is not loaded");
		return;
	}
	n.loadTheme === !0 && t(n.theme ?? "github"), e.set({ highlight(t, n) {
		try {
			if (n !== "" && r.getLanguage(n)) {
				let i = r.highlight(t, { language: n }).value;
				return `<pre><code class="hljs language-${e.utils.escapeHtml(n)}">${i}</code></pre>`;
			}
			return `<pre><code class="hljs">${r.highlightAuto(t).value}</code></pre>`;
		} catch (n) {
			return console.error(n), `<pre><code>${e.utils.escapeHtml(t)}</code></pre>`;
		}
	} });
}
function t(e) {
	let t = "tp-markdown-highlight-theme", r = document.getElementById(t);
	if (r instanceof HTMLLinkElement) {
		r.href = n(e);
		return;
	}
	let i = document.createElement("link");
	i.id = t, i.rel = "stylesheet", i.href = n(e), document.head.append(i);
}
function n(e) {
	return `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/${e}.min.css`;
}
//#endregion
export { e as default };

