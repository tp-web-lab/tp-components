import assert from "node:assert/strict";
import { chromium, firefox, webkit } from "@playwright/test";
const browser = await { chromium, firefox, webkit }[
	process.env.BROWSER ?? "chromium"
].launch();
// Run against the source Vite server; BROWSER and LANGUAGE select a subset; CONTROLS_ONLY skips content links.
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4174";
const formats = {
	html: "html",
	markdown: "md",
	asciidoc: "adoc",
	latex: "tex",
	restructuredtext: "rst",
	markup: "md",
};
const paragraphs = Array.from(
	{ length: 30 },
	(_, i) => `Reading paragraph ${i + 1}.`,
).join("\n\n");
function source(language, title, next) {
	const links = [
		["#destination", "Local anchor"],
		[next, "Other page"],
		[`${next}#destination`, "Other page anchor"],
	];
	if (language === "html")
		return `<h1>${title}</h1>${paragraphs
			.split("\n\n")
			.map((p) => `<p>${p}</p>`)
			.join(
				"",
			)}${links.map(([href, text]) => `<p><a href="${href}">${text}</a></p>`).join("")}${"<p>Further reading.</p>".repeat(30)}<h2 id="destination">Destination</h2>${"<p>Last paragraph.</p>".repeat(30)}`;
	if (language === "asciidoc")
		return `== ${title}\n\n${paragraphs}\n\n${links.map(([href, text]) => `link:${href}[${text}]`).join("\n\n")}\n\n${paragraphs}\n\n[[destination]]\n=== Destination\n\n${paragraphs}`;
	if (language === "latex")
		return `\\usepackage{hyperref}\n\\section*{${title}}\n${paragraphs}\n\n${links.map(([href, text]) => `\\href{${href}}{${text}}`).join("\n\n")}\n\n${paragraphs}\n\n\\hypertarget{destination}{}\\section*{Destination}\n${paragraphs}`;
	if (language === "restructuredtext")
		return `${title}\n${"=".repeat(title.length)}\n\n${paragraphs}\n\n${links.map(([href, text]) => `\`${text} <${href}>\`_`).join("\n\n")}\n\n${paragraphs}\n\n.. _destination:\n\nDestination\n-----------\n\n${paragraphs}`;
	return `# ${title}\n\n${paragraphs}\n\n${links.map(([href, text]) => `[${text}](${href})`).join("\n\n")}\n\n${paragraphs}\n\n## Destination {#destination}\n\n${paragraphs}`;
}
try {
	for (const [language, ext] of Object.entries(formats).filter(
		([name]) => !process.env.LANGUAGE || name === process.env.LANGUAGE,
	))
		for (const nested of [false, true]) {
			const page = await browser.newPage({
				viewport: { width: 1100, height: 750 },
			});
			page.setDefaultTimeout(60000);
			page.on("pageerror", (error) => console.error(language, error.message));
			const nextLanguage = language === "markup" ? "asciidoc" : language;
			const next = `chapter.${formats[nextLanguage]}`;
			const files = {
				[`cover.${ext}`]: source(language, "Cover", next),
				[next]: source(nextLanguage, "Chapter", `cover.${ext}`),
			};
			const sidebarLinks = [
				["cover." + ext, "Cover"],
				[next, "Chapter"],
			];
			files[`sidebar.${ext}`] =
				language === "html"
					? `<ul>${sidebarLinks.map(([href, text]) => `<li><a href="${href}">${text}</a></li>`).join("")}</ul>`
					: language === "latex"
						? `\\usepackage{hyperref}\n\\begin{itemize}\n${sidebarLinks.map(([href, text]) => `\\item \\href{${href}}{${text}}`).join("\n")}\n\\end{itemize}`
						: sidebarLinks
								.map(([href, text]) =>
									language === "asciidoc"
										? `* link:${href}[${text}]`
										: language === "restructuredtext"
											? `* \`${text} <${href}>\`_`
											: `- [${text}](${href})`,
								)
								.join("\n");
			await page.route("**/__links-guide/**", (route) => {
				const file = new URL(route.request().url()).pathname.split("/").at(-1);
				return route.fulfill({
					status: file in files ? 200 : 404,
					contentType: "text/plain",
					body: files[file] ?? "",
				});
			});
			await page.route("**/__links-history", (route) =>
				route.fulfill({
					contentType: "text/html",
					body: "<!doctype html><body></body>",
				}),
			);
			await page.goto(
				`${baseUrl}/__links-history${nested ? "#/outer.md" : ""}`,
			);
			await page.evaluate(
				async ({ language, nested }) => {
					await import(
						`/src/components/${language}-multi-pages/${language}-multi-pages.ts`
					);
					const host = document.createElement(`tp-${language}-multi-pages`);
					host.setAttribute("repository", "/__links-guide");
					host.setAttribute("menu", "");
					host.style.cssText = "display:block;height:650px;position:relative";
					const wrapper = document.createElement("div");
					if (nested) wrapper.className = "tp-markdown-multi-pages-host";
					wrapper.append(host);
					document.body.append(wrapper);
				},
				{ language, nested },
			);
			const content = page
				.locator(
					".tp-markup-multi-pages-content,.tp-markdown-multi-pages-content",
				)
				.first();
			await content
				.getByRole("link", { name: "Local anchor", exact: true })
				.waitFor()
				.catch(async (error) => {
					console.error(await content.innerText());
					throw error;
				});
			for (const name of process.env.CONTROLS_ONLY
				? []
				: ["Local anchor", "Other page", "Other page anchor"]) {
				const link = content.getByRole("link", { name, exact: true });
				await link.scrollIntoViewIfNeeded();
				await link.evaluate((link) =>
					link.addEventListener(
						"click",
						() => {
							window.previousReadingPosition = link.closest(
								".tp-markup-multi-pages-content,.tp-markdown-multi-pages-content",
							).scrollTop;
						},
						{ once: true, capture: true },
					),
				);
				await link.click();
				if (name === "Local anchor")
					await page.waitForFunction(
						() =>
							document.querySelector(
								".tp-markup-multi-pages-content,.tp-markdown-multi-pages-content",
							).scrollTop >
							window.previousReadingPosition + 300,
					);
				else
					await content
						.getByRole("heading", { name: "Chapter", exact: true })
						.waitFor();
				if (name.endsWith("anchor"))
					await page.waitForFunction(
						() =>
							document.querySelector(
								".tp-markup-multi-pages-content,.tp-markdown-multi-pages-content",
							).scrollTop >
							window.previousReadingPosition + 300,
					);
				await page.goBack();
				await content
					.getByRole("heading", { name: "Cover", exact: true })
					.waitFor();
				await page.waitForFunction(
					() =>
						Math.abs(
							document.querySelector(
								".tp-markup-multi-pages-content,.tp-markdown-multi-pages-content",
							).scrollTop - window.previousReadingPosition,
						) < 3,
				);
				await page.goForward();
				if (name === "Local anchor")
					await page.waitForFunction(
						() =>
							document.querySelector(
								".tp-markup-multi-pages-content,.tp-markdown-multi-pages-content",
							).scrollTop >
							window.previousReadingPosition + 300,
					);
				else
					await content
						.getByRole("heading", { name: "Chapter", exact: true })
						.waitFor();
				await page.goBack();
				await content
					.getByRole("heading", { name: "Cover", exact: true })
					.waitFor();
				await page.waitForFunction(
					() =>
						Math.abs(
							document.querySelector(
								".tp-markup-multi-pages-content,.tp-markdown-multi-pages-content",
							).scrollTop - window.previousReadingPosition,
						) < 3,
				);
				if (nested) assert.equal(new URL(page.url()).hash, "#/outer.md");
			}
			const host = page.locator(`tp-${language}-multi-pages`).first();
			const sidebarChapter = host
				.locator('[data-role="sidebar"] a')
				.filter({ hasText: /^Chapter$/ });
			const showSidebar = async () => {
				if (!(await sidebarChapter.isVisible()))
					await host.locator('[data-action="menu"]').click();
			};
			const roundTrip = async (control, origin, destination) => {
				await content.evaluate((element) => {
					element.scrollTop = 700;
				});
				await control.scrollIntoViewIfNeeded();
				await control.evaluate((element) =>
					element.addEventListener(
						"click",
						() => {
							window.controlReadingPosition = document.querySelector(
								".tp-markup-multi-pages-content,.tp-markdown-multi-pages-content",
							).scrollTop;
						},
						{ capture: true, once: true },
					),
				);
				await control.click();
				await content
					.getByRole("heading", { name: destination, exact: true })
					.waitFor();
				await content.evaluate((element) => {
					element.scrollTop = 450;
				});
				await page.goBack();
				await content
					.getByRole("heading", { name: origin, exact: true })
					.waitFor();
				await page.waitForFunction(
					() =>
						Math.abs(
							document.querySelector(
								".tp-markup-multi-pages-content,.tp-markdown-multi-pages-content",
							).scrollTop - window.controlReadingPosition,
						) < 3,
				);
				await page.goForward();
				await content
					.getByRole("heading", { name: destination, exact: true })
					.waitFor();
				await page.waitForFunction(
					() =>
						Math.abs(
							document.querySelector(
								".tp-markup-multi-pages-content,.tp-markdown-multi-pages-content",
							).scrollTop - 450,
						) < 3,
				);
				await page.goBack();
				await content
					.getByRole("heading", { name: origin, exact: true })
					.waitFor();
				await page.waitForFunction(
					() =>
						Math.abs(
							document.querySelector(
								".tp-markup-multi-pages-content,.tp-markdown-multi-pages-content",
							).scrollTop - window.controlReadingPosition,
						) < 3,
				);
				if (nested) assert.equal(new URL(page.url()).hash, "#/outer.md");
			};
			await showSidebar();
			await roundTrip(sidebarChapter, "Cover", "Chapter");
			await roundTrip(
				content.locator('[data-direction="next"] a'),
				"Cover",
				"Chapter",
			);
			await showSidebar();
			await sidebarChapter.click();
			await content
				.getByRole("heading", { name: "Chapter", exact: true })
				.waitFor();
			await roundTrip(
				content.locator('[data-direction="previous"] a'),
				"Chapter",
				"Cover",
			);
			await roundTrip(host.locator('[data-action="home"]'), "Chapter", "Cover");
			console.log(
				`${language} ${nested ? "embedded" : "standalone"}: sidebar, Home, Previous, Next; Back/Forward restore both reading positions.`,
			);
			if (!process.env.CONTROLS_ONLY)
				console.log(
					`${language} ${nested ? "embedded" : "standalone"}: local anchor, other page, other page anchor; Back/Forward and reading position restored.`,
				);
			await page.close();
		}
} finally {
	await browser.close();
}
