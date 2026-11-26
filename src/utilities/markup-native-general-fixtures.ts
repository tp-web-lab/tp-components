export const nativeGeneralCases: {
	name: string;
	html: string;
	selectors: string[];
	attributes: [string, string, string][];
	texts?: [string, string][];
}[] = [
	{
		name: "empty figure",
		html: '<figure id="empty"></figure>',
		selectors: ["figure#empty:empty"],
		attributes: [],
	},
	{
		name: "empty caption",
		html: '<figure id="empty-caption"><p>Before.</p><figcaption class="blank"></figcaption><p>After.</p></figure>',
		selectors: [
			"figure > p:first-child",
			"figure > figcaption.blank:empty:nth-child(2)",
			"figure > p:nth-child(3)",
		],
		attributes: [],
	},
	{
		name: "nested figures",
		html: '<figure id="outer"><p>Before.</p><figure id="inner"><p>Inner.</p><figcaption>Inner caption.</figcaption></figure><figcaption>Outer caption.</figcaption></figure>',
		selectors: [
			"figure#outer > figure#inner > figcaption",
			"figure#outer > figcaption",
		],
		texts: [
			["#inner > figcaption", "Inner caption."],
			["#outer > figcaption", "Outer caption."],
		],
		attributes: [],
	},
	{
		name: "nested empty figures",
		html: '<figure id="outer"><figure id="inner"><figcaption></figcaption></figure><figcaption></figcaption></figure>',
		selectors: [
			"#outer > #inner > figcaption:empty",
			"#outer > figcaption:empty",
		],
		attributes: [],
	},
	{
		name: "media child attributes and order",
		html: '<video controls><track src="/captions.vtt" kind="captions" default data-role="primary" title="First&#10;second"><source src="/movie.mp4" type="video/mp4" id="movie-source" data-quality="high"><p>First fallback.</p><source src="/movie.webm" type="video/webm"><p>Last fallback.</p></video>',
		selectors: [
			"video > track:first-child",
			"video > source:nth-child(2)",
			"video > p:nth-child(3)",
			"video > source:nth-child(4)",
			"video > p:nth-child(5)",
		],
		attributes: [
			["track", "data-role", "primary"],
			["track", "title", "First\nsecond"],
			["track", "default", ""],
			["source", "id", "movie-source"],
			["source", "data-quality", "high"],
		],
		texts: [
			["p:nth-child(3)", "First fallback."],
			["p:nth-child(5)", "Last fallback."],
		],
	},
	{
		name: "media interleaved inline fallback",
		html: '<audio>Before <strong>audio</strong>.<source src="/sound.wav" type="audio/wav">After <em>audio</em>.<track src="/captions.vtt" kind="captions"></audio>',
		selectors: [
			"audio > strong:first-child",
			"audio > source:nth-child(2)",
			"audio > em:nth-child(3)",
			"audio > track:nth-child(4)",
		],
		attributes: [],
		texts: [["audio", "Before audio.After audio."]],
	},

	{
		name: "mixed heading contexts",
		html: '<h2 id="main">Main</h2><blockquote><h3 id="quotation">Quote</h3><p>Quoted text.</p></blockquote><ul><li><h4 id="item">Item</h4><p>Item text.</p></li></ul><h2 id="next">Next</h2>',
		selectors: ["h2#main", "blockquote h3#quotation", "li h4#item", "h2#next"],
		attributes: [],
	},
	{
		name: "figure without image",
		texts: [
			["code", "print(1)"],
			["figcaption", "A listing."],
		],
		html: '<figure id="example"><pre><code class="language-python">print(1)</code></pre><figcaption>A <strong>listing</strong>.</figcaption><ul><li>Detail</li></ul></figure>',
		selectors: [
			"figure#example > pre > code",
			"figure > figcaption strong",
			"figure > ul > li",
		],
		attributes: [],
	},
	{
		name: "mixed caption",
		html: '<figure><img src="/medias/image/canoe.svg" alt="Boat"><figcaption>Before <strong>caption</strong>.<p>A paragraph.</p>After <em>caption</em>.</figcaption></figure>',
		selectors: [
			"figure > figcaption > strong",
			"figure > figcaption > p",
			"figure > figcaption > em",
		],
		attributes: [],
	},
	{
		name: "multiline attributes",
		html: '<h2 id="title" title="First&#10;Second">Title</h2><p title="Line 1&#10;&#10;Line 3&#9;tab">A <span class="note" data-value="a&#13;&#10;b">term</span>.</p>',
		selectors: ["h2#title", "p[title] span.note"],
		attributes: [
			["h2", "title", "First\nSecond"],
			["p", "title", "Line 1\n\nLine 3\ttab"],
			["span", "data-value", "a\r\nb"],
		],
	},
	{
		name: "heading in quotation",
		html: '<blockquote cite="https://example.org/"><h3 id="quoted" class="note">Quoted heading</h3><p>Explanation.</p></blockquote>',
		selectors: ["blockquote[cite] h3#quoted.note", "blockquote p"],
		attributes: [],
	},
	{
		name: "heading in list",
		html: '<ul><li><h4 id="listed" class="note">Nested heading</h4><p>Explanation.</p></li></ul>',
		selectors: ["ul > li h4#listed.note", "li p"],
		attributes: [],
	},
	{
		name: "inline media fallback",
		texts: [["video", "Read the video transcript."]],
		html: '<video class="sample" title="Line 1&#10;Line 2" src="clip.mp4" controls>Read the <a href="clip.mp4">video</a> <strong>transcript</strong>.</video>',
		selectors: ['video.sample[title] > a[href$="clip.mp4"]', "video > strong"],
		attributes: [],
	},
	{
		name: "block media fallback",
		texts: [
			["audio > p", "Read the transcript."],
			["audio li", "Download"],
		],
		html: '<audio controls><source src="audio.ogg" type="audio/ogg"><p>Read the <strong>transcript</strong>.</p><ul><li><a href="audio.ogg">Download</a></li></ul></audio>',
		selectors: [
			'audio[controls] > source[type="audio/ogg"]',
			"audio > p > strong",
			"audio > ul > li > a",
		],
		attributes: [],
	},
];
