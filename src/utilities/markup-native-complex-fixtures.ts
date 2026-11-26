export const nativeComplexCases = [
	{
		name: "multiple figure images",
		html: '<figure class="gallery"><img src="/medias/image/canoe.svg" alt="First"><figcaption id="caption">Two <strong>views</strong>.</figcaption><img src="/medias/image/canoe.svg" alt="Second"><ul><li>Detail</li></ul></figure>',
		selectors: [
			'figure.gallery > img[alt="First"]',
			'figure.gallery > img[alt="Second"]',
			"figure > figcaption#caption strong",
			"figure > ul > li",
		],
	},
	{
		name: "attributed span",
		html: '<p>Read <span id="term" class="note" lang="fr" data-kind="term" hidden>the <strong>term</strong></span>.</p>',
		selectors: ['span#term.note[lang="fr"][data-kind="term"][hidden] strong'],
	},
	{
		name: "compound figure",
		html: '<figure id="plot" class="wide"><img src="/medias/image/canoe.svg" alt="Boat"><figcaption class="description"><p>A <strong>boat</strong>.</p><p>Second paragraph.</p></figcaption><p>Legend with <em>details</em>.</p></figure>',
		selectors: [
			'figure#plot.wide > img[alt="Boat"]',
			"figure > figcaption.description > p strong",
			"figure > figcaption.description > p + p",
			"figure > p em",
		],
	},
	{
		name: "rich markers",
		html: '<ol data-tp-list-label="@1."><li><span data-tp-list-marker data-tp-list-override><strong>A</strong></span>First</li><li><span data-tp-list-marker data-tp-list-override><em>B</em></span>Second</li></ol>',
		selectors: [
			"ol > li > [data-tp-list-override] strong",
			"ol > li + li > [data-tp-list-override] em",
		],
	},
	{
		name: "case-sensitive anchors",
		html: '<p id="Part_A">Upper.</p><p id="part_a">Lower.</p><p><a href="#Part_A">Upper</a> <a href="#part_a">Lower</a></p>',
		selectors: ["#Part_A", "#part_a", 'a[href="#Part_A"]', 'a[href="#part_a"]'],
	},
];
