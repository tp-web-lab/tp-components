import { r as e } from "./rolldown-runtime.js";
//#region ../tp-markdown/dist/markdown/extensions/lorem-ipsum/dictionary.js
var t = "ab ac accumsan accusamus accusantium ad adipisci adipiscing adipisicing aenean alias aliqua aliquam aliquet aliquid aliquip amet amicitia amor anim animi ante aperiam aptent architecto arcu asperiores aspernatur assumenda at atque auctor augue aut aute autem ave beatae benignus bibendum blandit blanditiis brest breizh cillum class commodi commodo condimentum congue consectetur consequat consequatur consequuntur conubia convallis corporis corrupti cras cubilia culpa cum cumque cupidatat cupiditate curabitur curae cursus dapibus debitis delectus deleniti deserunt diam dicta dictum dictumst dignissim dignissimos dis distinctio do dolor dolore dolorem doloremque dolores doloribus dolorum donec ducimus dui duis ea eaque earum efficitur egestas eget eius eiusmod eleifend elementum eligendi elit enib enim enise enit eos erat eros error esse est et etiam eu euismod eum eveniet ex excepteur excepturi exercitation exercitationem expedita explicabo facere facilis facilisi facilisis fames faucibus felicitas felis fermentum feugiat finibus fringilla fuga fugiat fugit fusce gratias gravida habitant habitasse hac hamburgefons hamburgefonstiv hamburgevons harum hendrerit hic himenaeos homo iaculis id illo illum impedit imperdiet in inceptos incididunt incidunt integer interdum inventore ipsa ipsam ipsum irure iste itaque ite iure iusto justo labore laboriosam laboris laborum lacinia lacus laoreet laudantium lectus leo libero ligula litora lobortis lorem luctus maecenas magna magnam magni magnis maiores malesuada massa mattis mauris maxime maximus metus mi minim minima minus modi molestiae molestias molestie mollis mollit mollitia montes morbi mus nam nascetur natoque natus nec necessitatibus nemo neque nesciunt netus nibh nihil nisi nisl nobis non nostra nostrud nostrum nulla nullam numquam nunc obcaecati occaecat odio odit officia officiis omnis onu optio orci ornare pariatur parturient pax pellentesque penatibus per perferendis perspiciatis pharetra phasellus placeat placerat platea porro porta porttitor possimus posuere praesent praesentium pretium primis proident proin provident pulvinar purus quae quaerat quam quas quasi qui quia quibusdam quidem quis quisquam quisque quo quod quos ratione recusandae reiciendis rem repellat repellendus reprehenderit repudiandae rerum rhoncus ridiculus risus rutrum saepe sagittis salus salve sapien sapiente scelerisque sed sem semper senectus sequi similique sint sit sociis sociosqu sodales sollicitudin soluta sunt suscipit suspendisse taciti tellus tempor tempora tempore temporibus tempus tenetur tincidunt torquent tortor totam tristique turpis ubo ullam ullamco ullamcorper ultrices ultricies unde unesco urna ut vale varius vehicula vel velit venenatis veniam veritatis vero vestibulum vitae vivamus viverra voluptas voluptate voluptatem voluptates voluptatibus voluptatum volutpat vulputate".split(" "), n = /* @__PURE__ */ e({ default: () => i }), r = {
	type: "p",
	length: "3-5",
	wordsPerSentence: "4-16",
	sentencesPerParagraph: "3-6"
};
function i(e) {
	e.block.ruler.before("paragraph", "lorem_ipsum", (e, t, n, r) => {
		let i = e.bMarks[t] ?? 0, o = e.eMarks[t] ?? i, c = e.src.slice(i, o).trim().match(/^::lorem\{(.*)\}\s*$/);
		if (c === null) return !1;
		if (r) return !0;
		let l = a(c[1] ?? ""), u = e.push("html_block", "", 0);
		return u.content = s(l), u.map = [t, t + 1], e.line = t + 1, !0;
	});
}
function a(e) {
	let t = { ...r }, n = o(e);
	return t.type = m(n.type ?? t.type), t.length = n.length ?? t.length, t.wordsPerSentence = n["words-per-sentence"] ?? n.wordsPerSentence ?? t.wordsPerSentence, t.sentencesPerParagraph = n["sentences-per-paragraph"] ?? n.sentencesPerParagraph ?? t.sentencesPerParagraph, t.seed = _(n.seed), t;
}
function o(e) {
	let t = {};
	for (let n of e.matchAll(/([a-zA-Z][\w-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s}]+)/g)) {
		let e = n[1] ?? "";
		t[e] = (n[2] ?? "").replace(/^["']|["']$/g, "");
	}
	return t;
}
function s(e) {
	let t = e.seed === void 0 ? Math.random : v(e.seed);
	switch (e.type) {
		case "sentence": return b(d(t, e));
		case "title": return b(f(t, e));
		case "dl": return u(t, e);
		case "ol": return l(t, e, "ol");
		case "ul": return l(t, e, "ul");
		default: return c(t, e);
	}
}
function c(e, t) {
	let n = h(t.length, e);
	return Array.from({ length: n }, () => {
		let n = h(t.sentencesPerParagraph, e);
		return `<p>${b(Array.from({ length: n }, () => d(e, t)).join(" "))}</p>`;
	}).join("\n");
}
function l(e, t, n) {
	let r = h(t.length, e);
	return `<${n}>\n${Array.from({ length: r }, () => `  <li>${b(d(e, t))}</li>`).join("\n")}\n</${n}>`;
}
function u(e, t) {
	let n = h(t.length, e);
	return `<dl>\n${Array.from({ length: n }, () => {
		let n = f(e, {
			...t,
			wordsPerSentence: "1-3"
		}), r = d(e, t);
		return [`  <dt>${b(n)}</dt>`, `  <dd>${b(r)}</dd>`].join("\n");
	}).join("\n")}\n</dl>`;
}
function d(e, t) {
	return `${y(p(e, h(t.wordsPerSentence, e)).join(" "))}.`;
}
function f(e, t) {
	return p(e, h(t.wordsPerSentence, e)).map(y).join(" ");
}
function p(e, n) {
	return Array.from({ length: n }, () => t[Math.floor(e() * t.length)] ?? "lorem");
}
function m(e) {
	return e === "sentence" || e === "title" || e === "p" || e === "dl" || e === "ol" || e === "ul" ? e : "p";
}
function h(e, t) {
	if (typeof e == "number") return Math.max(0, Math.floor(e));
	let n = e.match(/^(\d+)\s*-\s*(\d+)$/);
	if (n !== null) {
		let e = Number.parseInt(n[1] ?? "0", 10), r = Number.parseInt(n[2] ?? String(e), 10), i = Math.min(e, r), a = Math.max(e, r);
		return i + Math.floor(t() * (a - i + 1));
	}
	return g(e, 1);
}
function g(e, t) {
	if (typeof e == "number") return Number.isFinite(e) ? Math.floor(e) : t;
	if (typeof e != "string") return t;
	let n = Number.parseInt(e, 10);
	return Number.isFinite(n) ? n : t;
}
function _(e) {
	if (e === void 0) return;
	if (typeof e == "number") return Number.isFinite(e) ? Math.floor(e) : void 0;
	let t = Number.parseInt(e, 10);
	return Number.isFinite(t) ? t : void 0;
}
function v(e) {
	let t = e >>> 0;
	return () => {
		t += 1831565813;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function y(e) {
	return e.charAt(0).toUpperCase() + e.slice(1);
}
function b(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
export { i as n, n as t };

//# sourceMappingURL=lorem-ipsum.js.map