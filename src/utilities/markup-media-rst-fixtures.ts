export const mediaRstCases = [
	{
		name: "Simple media",
		html: '<video src="/medias/video/chute-eau.mp4" controls preload="metadata" aria-label="Waterfall" width="240" poster="/medias/image/canoe.svg" muted loop></video><audio src="/medias/audio/glass-break.mp3" controls preload="none" aria-label="Sound"></audio>',
	},
	{
		name: "Sources and tracks",
		html: '<video controls width="240"><source src="/medias/video/chute-eau.mp4" type="video/mp4"><source src="/medias/video/chute-eau.mp4?alternative" type="video/mp4"><track kind="subtitles" srclang="en" label="English" default src="/docs/components/markup-converter/examples/comparison-captions.vtt"><track kind="captions" srclang="fr" label="French" src="/docs/components/markup-converter/examples/comparison-captions.vtt?fr"></video>',
	},
	{
		name: "Literal code",
		html: '<pre class="tp-dark"><code class="language-python">  if ready:\n\tprint("ready")\n  \n</code></pre>',
	},
	{
		name: "Numbered literal code",
		html: '<tp-code-editor readonly line-numbers line-number-start="20" language="python" value="  if ready:&#10;&#9;print(1)&#10;  "></tp-code-editor>',
	},
	{
		name: "Heading levels",
		html: '<h2 id="a">First</h2><p>Text.</p><h4 id="b">Child</h4><h3 id="c">Sibling</h3><h6 id="d">Deep</h6><p><a href="#b">Child</a></p>',
	},
] as const;
export function mediaRstSignature(html: string) {
	const root = document.createElement("div");
	root.innerHTML = html;
	const url = (value: string | null) =>
		value ? new URL(value, document.baseURI).href : "";
	return {
		media: [...root.querySelectorAll<HTMLMediaElement>("video,audio")].map(
			(media) => ({
				tag: media.localName,
				src: url(media.getAttribute("src")),
				label: media.getAttribute("aria-label"),
				preload: media.getAttribute("preload"),
				poster: url(media.getAttribute("poster")),
				width:
					media.getAttribute("width") || media.style.width.replace(/px$/, ""),
				controls: media.hasAttribute("controls"),
				muted: media.hasAttribute("muted"),
				loop: media.hasAttribute("loop"),
				children: [...media.querySelectorAll("source,track")].map((e) => ({
					tag: e.localName,
					attrs: Object.fromEntries(
						[...e.attributes]
							.map((a) => [a.name, a.name === "src" ? url(a.value) : a.value])
							.sort(([a], [b]) => (a || "").localeCompare(b || "")),
					),
				})),
			}),
		),
		anchors: ["a", "b", "c", "d"].filter((id) =>
			root.querySelector(`[id="${id}"]`),
		),
		code: [...root.querySelectorAll("pre,tp-code-editor")].map((e) => ({
			text: e.getAttribute("value") ?? e.textContent,
			start: e.getAttribute("line-number-start"),
			theme: e.closest(".tp-dark")
				? "dark"
				: e.closest(".tp-light")
					? "light"
					: "",
		})),
		headings: [...root.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((e) => ({
			tag: e.localName,
			text: e.textContent,
		})),
	};
}
