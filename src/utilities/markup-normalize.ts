/** Remove parser scaffolding, retaining author attributes and document semantics. */
export function normalizeMarkupHtml(root: ParentNode, language: string): void {
	// Keep resolved numbers as text; parser-only spans must not force element fallbacks.
	// Authored attributes have already been protected by the pivot provenance layer.
	if (
		language === "markdown" &&
		!root.querySelector("template[data-tp-numbering]")
	) {
		for (const marker of root.querySelectorAll(
			"span[data-section-number], span[data-object-number]",
		)) {
			marker.replaceWith(...marker.childNodes);
		}
	}

	if (language === "latex")
		for (const heading of root.querySelectorAll(
			"h1.continue,h2.continue,h3.continue,h4.continue,h5.continue,h6.continue",
		)) {
			heading.classList.remove("continue");
			if (!heading.className) heading.removeAttribute("class");
		}

	for (const paragraph of root.querySelectorAll("p")) {
		if (
			paragraph.attributes.length ||
			!paragraph.children.length ||
			[...paragraph.children].some((child) => !child.matches("audio,video"))
		)
			continue;
		if (
			[...paragraph.childNodes].some(
				(node) => node.nodeType === 3 && node.textContent?.trim(),
			)
		)
			continue;
		paragraph.replaceWith(...paragraph.childNodes);
	}
	const removeClasses = (selector: string, names: RegExp) => {
		for (const node of root.querySelectorAll(selector)) {
			for (const name of [...node.classList])
				if (names.test(name)) node.classList.remove(name);
			if (!node.className) node.removeAttribute("class");
		}
	};
	if (language === "asciidoc") {
		removeClasses("aside", /^sidebarblock$/);
		for (const figure of root.querySelectorAll(
			"td figure.imageblock,th figure.imageblock",
		))
			if (
				figure.attributes.length === 1 &&
				figure.children.length === 1 &&
				figure.firstElementChild?.localName === "img"
			)
				figure.replaceWith(...figure.childNodes);
		removeClasses(
			"figure",
			/^(imageblock|quoteblock|listingblock|literalblock|stemblock)$/,
		);
		removeClasses("pre", /^(highlight|listingblock|literalblock)$/);
		for (const code of root.querySelectorAll("pre > code[data-lang]")) {
			if (code.classList.contains(`language-${code.getAttribute("data-lang")}`))
				code.removeAttribute("data-lang");
		}
		for (const figure of root.querySelectorAll("figure")) {
			if (
				!figure.attributes.length &&
				figure.children.length === 1 &&
				["blockquote", "tp-math"].includes(
					figure.firstElementChild?.localName ?? "",
				)
			)
				figure.replaceWith(...figure.childNodes);
		}
		for (const group of root.querySelectorAll("colgroup")) {
			if (
				!group.attributes.length &&
				[...group.children].every(
					(col) => col.localName === "col" && !col.attributes.length,
				)
			)
				group.remove();
		}
		for (const wrapper of root.querySelectorAll(
			"td > div.content,th > div.content",
		))
			if (wrapper.attributes.length === 1)
				wrapper.replaceWith(...wrapper.childNodes);

		for (const section of root.querySelectorAll("section[class]"))
			if (
				/^sect[1-6]$/.test(section.className) &&
				section.attributes.length === 1
			)
				section.replaceWith(...section.childNodes);
		removeClasses(
			"table,th,td,caption,p",
			/^(tableblock|frame-all|grid-all|stretch|fit-content|title|halign-(left|right|center)|valign-(top|middle|bottom))$/,
		);
	}
	if (language === "restructuredtext") {
		removeClasses("a", /^(reference|external|internal)$/);
		removeClasses("hr", /^docutils$/);
		for (const pre of root.querySelectorAll("pre.code")) {
			const languageClass = [
				...(pre.querySelector("code")?.classList ?? []),
			].find((name) => name.startsWith("language-"));
			pre.classList.remove("code", "literal-block");
			if (languageClass) pre.classList.remove(languageClass.slice(9));
			if (!pre.className) pre.removeAttribute("class");
		}
		removeClasses("pre", /^literal-block$/);
		for (const section of [...root.querySelectorAll("section")].reverse()) {
			const heading = section.firstElementChild;
			if (
				!heading?.matches("h1,h2,h3,h4,h5,h6") ||
				[...section.attributes].some((attr) => attr.name !== "id")
			)
				continue;
			if (section.id && section.id !== heading.id) {
				const alias = section.ownerDocument.createElement("span");
				alias.id = section.id;
				heading.prepend(alias);
			}
			section.replaceWith(...section.childNodes);
		}
		// Flat Docutils line blocks inside cells represent explicit line breaks.
		// Nested line blocks retain their indentation and remain untouched.
		for (const block of root.querySelectorAll(".line-block")) {
			const parent = block.parentElement;
			const authored = JSON.parse(
				parent?.getAttribute("data-tp-pivot-authored") || "{}",
			) as Record<string, string>;
			if (
				!parent?.matches("td,th,.tp-verse") &&
				!(authored.class || "").split(/\s+/).includes("tp-verse")
			)
				continue;
			const lines = [...block.children];
			if (
				block.attributes.length !== 1 ||
				block.className !== "line-block" ||
				!lines.length ||
				lines.some(
					(line) =>
						line.className !== "line" ||
						line.attributes.length !== 1 ||
						line.querySelector(".line-block"),
				)
			)
				continue;
			const paragraph = block.ownerDocument.createElement("p");
			lines.forEach((line, index) => {
				if (index) paragraph.append(block.ownerDocument.createElement("br"));
				if (
					line.childNodes.length === 1 &&
					line.firstElementChild?.localName === "br"
				)
					return;
				paragraph.append(...line.childNodes);
			});
			block.replaceWith(paragraph);
		}

		removeClasses("th", /^head$/);
		removeClasses("h1", /^title$/);
		for (const heading of root.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
			const anchor = heading.querySelector(
				":scope > span[id]:empty:last-of-type",
			);
			if (anchor && !heading.id) {
				heading.id = anchor.id;
				anchor.remove();
			}
		}
	}
	if (language === "asciidoc" || language === "restructuredtext") {
		for (const list of root.querySelectorAll("ol")) {
			const type = [...list.classList]
				.map(
					(name) =>
						({
							upperalpha: "A",
							loweralpha: "a",
							upperroman: "I",
							lowerroman: "i",
						})[name as "upperalpha"],
				)
				.find(Boolean);
			if (type && !list.hasAttribute("type")) list.setAttribute("type", type);
		}
		removeClasses(
			"ol,ul",
			/^(upperalpha|loweralpha|upperroman|lowerroman|arabic|simple)$/,
		);
		for (const paragraph of root.querySelectorAll("td > p, th > p, li > p"))
			if (
				!paragraph.attributes.length &&
				paragraph.parentElement?.children.length === 1
			)
				paragraph.replaceWith(...paragraph.childNodes);
	}
	if (language === "latex") {
		for (const node of root.querySelectorAll("[data-tp-latex-listing]"))
			node.removeAttribute("data-tp-latex-listing");
		for (const cell of root.querySelectorAll("td,th")) {
			for (const attr of ["rowspan", "colspan"])
				if (cell.getAttribute(attr) === "1") cell.removeAttribute(attr);
		}
		for (const br of root.querySelectorAll(
			"figure > figcaption + br:last-child",
		))
			if (!br.attributes.length) br.remove();
		for (const cell of root.querySelectorAll<HTMLElement>("td,th")) {
			if (cell.localName === "th" && cell.style.fontWeight === "bold")
				cell.style.removeProperty("font-weight");
			if (
				cell.style.borderColor === "var(--tp-neutral-stroke-soft)" &&
				![...cell.style].some((name) =>
					/border.*(?:width|style)$|^border$/.test(name),
				)
			)
				cell.style.removeProperty("border-color");
			for (const side of ["top", "right", "bottom", "left"]) {
				if (
					cell.style.getPropertyValue(`border-${side}`) ===
					"1px solid var(--tp-neutral-stroke-soft)"
				)
					cell.style.removeProperty(`border-${side}`);
			}
			if (!cell.getAttribute("style")) cell.removeAttribute("style");
		}
	}
	// Native image dimensions represent these declarations without a component.
	for (const img of root.querySelectorAll<HTMLImageElement>("img")) {
		for (const dimension of ["width", "height"]) {
			const match = /^(\d+(?:\.\d+)?)px$/.exec(
				img.style.getPropertyValue(dimension),
			);
			if (
				match &&
				(!img.hasAttribute(dimension) ||
					img.getAttribute(dimension) === match[1])
			) {
				img.setAttribute(dimension, match[1] ?? "");
				img.style.removeProperty(dimension);
			}
		}
		if (!img.getAttribute("style")) img.removeAttribute("style");
	}
}
