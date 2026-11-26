export const nativeMetadataCases = [
	...[1, 2, 3, 4, 5, 6].map((level) => ({
		name: `heading-${level}`,
		html: `<h${level} id="Part_A" class="note" lang="fr" data-kind="example" hidden>Titre</h${level}>`,
		selector: `h${level}#Part_A.note[lang="fr"][data-kind="example"][hidden]`,
		text: "Titre",
	})),
	{
		name: "paragraph",
		html: '<p id="Part_A" class="note" lang="fr" data-kind="example" hidden>Texte</p>',
		selector: 'p#Part_A.note[lang="fr"][data-kind="example"][hidden]',
		text: "Texte",
	},
	{
		name: "quote",
		html: '<blockquote lang="fr" cite="https://example.org"><p>Texte <strong>cité</strong>.</p></blockquote>',
		selector: 'blockquote[lang="fr"][cite="https://example.org"] strong',
		text: "cité",
	},
	{
		name: "language",
		html: '<p lang="fr">Bonjour <span lang="en"><strong>world</strong></span>.</p>',
		selector: 'p[lang="fr"] span[lang="en"] strong',
		text: "world",
	},
	{
		name: "quotation",
		html: '<p><span lang="fr" data-tp-quotation="outer">« Une citation. »</span></p>',
		selector: 'span[lang="fr"][data-tp-quotation="outer"]',
		text: "« Une citation. »",
	},
	{
		name: "anchor",
		html: '<p id="Part_A">Texte</p><p><a href="#Part_A">Lien</a></p>',
		selector: '[id="Part_A"]',
		text: null,
	},
	{ name: "separator", html: "<hr>", selector: "hr", text: null },
] as const;
