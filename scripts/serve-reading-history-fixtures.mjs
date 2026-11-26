import { createServer } from "vite";
const stalledLoads = new Set();
const restoredWasm = new Set();
const restoredPackages = new Set();
const packageRequests = new Map();
const heldPackageResponses = new Map();
const formats = {
	html: "html",
	markdown: "md",
	asciidoc: "adoc",
	latex: "tex",
	restructuredtext: "rst",
	markup: "md",
};
function source(lang, title) {
	const paragraphs = Array.from(
		{ length: 90 },
		(_, i) =>
			`Reading paragraph ${i + 1}: text for checking the saved reading position.`,
	);
	if (lang === "html")
		return (
			`<h1 id="heading">${title}</h1>` +
			paragraphs.map((p) => `<p>${p}</p>`).join("")
		);
	if (lang === "asciidoc")
		return `[[heading]]\n== ${title}\n\n` + paragraphs.join("\n\n");
	if (lang === "latex")
		return (
			`\\usepackage{hyperref}\n\\hypertarget{heading}{}\\section*{${title}}\n\n` +
			paragraphs.join("\n\n")
		);
	if (lang === "restructuredtext")
		return (
			`.. _heading:\n\n${title}\n${"=".repeat(title.length)}\n\n` +
			paragraphs.join("\n\n")
		);
	return `# ${title} {#heading}\n\n` + paragraphs.join("\n\n");
}
const server = await createServer({
	server: { port: Number(process.env.PORT || 4376), strictPort: true },
	plugins: [
		{
			name: "history-fixtures",
			configureServer(server) {
				server.middlewares.use((req, res, next) => {
					const u = new URL(req.url, "http://localhost");
					if (u.pathname.startsWith("/__rst-package/")) {
						const [, , token, target, file] = u.pathname.split("/");
						res.setHeader("Cache-Control", "no-store");
						if (file === "cleanup") {
							for (const pending of heldPackageResponses.get(token) || [])
								pending.destroy();
							heldPackageResponses.delete(token);
							res.end("cleaned");
							return;
						}
						if (file === "restore") {
							restoredPackages.add(token);
							res.end("restored");
							return;
						}
						if (file === "requests") {
							res.setHeader("Content-Type", "application/json");
							res.end(JSON.stringify(packageRequests.get(token) || []));
							return;
						}
						if (file?.endsWith(".whl")) {
							const events = packageRequests.get(token) || [];
							events.push({
								file,
								interrupted:
									file.startsWith(target + "-") && !restoredPackages.has(token),
								at: Date.now(),
							});
							packageRequests.set(token, events);
						}
						if (
							file?.startsWith(target + "-") &&
							!restoredPackages.has(token)
						) {
							res.writeHead(200, {
								"Content-Type": "application/octet-stream",
								"Content-Length": "100000",
							});
							res.write(Buffer.from([80, 75, 3, 4]));
							if (token.startsWith("stall-")) {
								const event = packageRequests.get(token).at(-1);
								event.responseOpen = true;
								res.on("close", () => {
									event.responseOpen = false;
								});
								const held = heldPackageResponses.get(token) || [];
								held.push(res);
								heldPackageResponses.set(token, held);
							} else setTimeout(() => res.destroy(), 100);
							return;
						}
						res.writeHead(302, {
							Location: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/" + file,
						});
						res.end();
						return;
					}
					if (u.pathname === "/__rst-package-test/") {
						res.setHeader("Content-Type", "text/html");
						res.end(`<!doctype html><div id="result"></div><script type="module">
import { createTpRestructuredTextParser } from "/src/components/restructuredtext/restructuredtext.ts";
const params=new URL(location.href).searchParams;
const target=params.get("package");
const stalled=params.has("stall");
const indexURL="/__rst-package/"+(stalled?"stall-":"")+params.get("token")+"/"+target+"/";
const parser=createTpRestructuredTextParser({indexURL:new URL(indexURL,location.href).href,packageTimeout:params.has("timeout")?Number(params.get("timeout")):undefined,settings:{syntax_highlight:"short"}});
const source="Recovered\\n=========\\n\\n.. code:: python\\n\\n   print(42)";
const start=performance.now();
try {
 let firstError;
 try {await parser.render(source);}catch(error){firstError=String(error);}
 const failureMilliseconds=performance.now()-start;
 window.loadDebug={firstError,failureMilliseconds,indexURL,stage:"recovery"};
 await fetch(indexURL+"restore");
 const restart=performance.now();
 document.querySelector("#result").innerHTML=await parser.render(source);
 const recoveryMilliseconds=performance.now()-restart;
 const openDuringRecovery=(await fetch(indexURL+"requests").then(r=>r.json())).filter(r=>r.responseOpen).length;
 await fetch(indexURL+"cleanup");
 await new Promise(resolve=>setTimeout(resolve,300));
 const further=await parser.render(source);
 const requests=await fetch(indexURL+"requests").then(r=>r.json());
 const code=document.querySelector("#result pre");
 window.loadResult={passed:!!firstError&&(!stalled||(firstError.includes("package loading timed out")&&openDuringRecovery>0))&&document.querySelector("#result h1")?.textContent==="Recovered"&&!!code?.querySelector("span")&&further.includes("print"),firstError: firstError||null,failureMilliseconds,recoveryMilliseconds,highlighted:!!code?.querySelector("span"),openDuringRecovery,requests,totalMilliseconds:performance.now()-start};
}catch(error){window.loadResult={passed:false,error:String(error),debug:window.loadDebug,requests:await fetch(indexURL+"requests").then(r=>r.json()),totalMilliseconds:performance.now()-start};}
</script>`);
						return;
					}
					if (u.pathname.startsWith("/__rst-wasm/")) {
						const [, , token, file] = u.pathname.split("/");
						res.setHeader("Cache-Control", "no-store");
						if (file === "restore") {
							restoredWasm.add(token);
							res.end("restored");
							return;
						}
						if (file === "pyodide.asm.wasm" && !restoredWasm.has(token)) {
							res.writeHead(200, {
								"Content-Type": "application/wasm",
								"Content-Length": "100000",
							});
							res.write(Buffer.from([0, 97, 115, 109, 1, 0, 0, 0]));
							setTimeout(() => res.destroy(), 100);
							return;
						}
						res.writeHead(302, {
							Location: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/" + file,
						});
						res.end();
						return;
					}
					if (u.pathname === "/__rst-wasm-test/") {
						res.setHeader("Content-Type", "text/html");
						res.end(`<!doctype html><div id="result"></div><script type="module">
import { createTpRestructuredTextParser } from "/src/components/restructuredtext/restructuredtext.ts";
const indexURL = "/__rst-wasm/" + new URL(location.href).searchParams.get("token") + "/";
const parser = createTpRestructuredTextParser({indexURL:new URL(indexURL,location.href).href});
const start = performance.now();
try {
 let firstError;
 try { await parser.render("Interrupted"); } catch (error) { firstError=String(error); }
 const failureMilliseconds=performance.now()-start;
 if (!firstError?.includes("initialization timed out")) throw Error("Expected initialization timeout: "+firstError);
 await fetch(indexURL+"restore");
 const restart=performance.now();
 document.querySelector("#result").innerHTML = await parser.render("Recovered\\n=========\\n\\nThe same parser works after the interrupted download.");
 const recoveryMilliseconds=performance.now()-restart;
 await parser.render("A further conversion on the same runtime.");
 window.loadResult={passed:document.querySelector("#result h1")?.textContent==="Recovered",firstError,failureMilliseconds,recoveryMilliseconds,totalMilliseconds:performance.now()-start};
} catch(error) {window.loadResult={passed:false,error:String(error),totalMilliseconds:performance.now()-start};}
</script>`);
						return;
					}
					if (u.pathname === "/__rst-load/pyodide.js") {
						const token = u.searchParams.get("token");
						console.log(
							"RST bootstrap request",
							Date.now(),
							u.href,
							stalledLoads.has(token),
						);
						if (!stalledLoads.has(token)) {
							stalledLoads.add(token);
							setTimeout(() => {
								res.statusCode = 504;
								res.end();
							}, 20000);
						} else {
							res.writeHead(302, {
								Location:
									"https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js",
							});
							res.end();
						}
						return;
					}
					if (u.pathname === "/__rst-load/") {
						res.setHeader("Content-Type", "text/html");
						res.end(`<!doctype html><div id="result"></div><script type="module">
import { createTpRestructuredTextParser } from "/src/components/restructuredtext/restructuredtext.ts";
const start = performance.now();
const stall = new URL(location.href).searchParams.get("stall");
const parser = createTpRestructuredTextParser(stall ? { pyodideUrl: "/__rst-load/pyodide.js?token=" + encodeURIComponent(stall) } : {});
try {
 document.querySelector("#result").innerHTML = await parser.render("Ready\\n=====\\n\\nA real Docutils conversion.");
 window.loadResult = { passed: !!document.querySelector("#result h1"), milliseconds: performance.now()-start };
} catch (error) { window.loadResult = { passed:false, error:String(error), milliseconds:performance.now()-start }; }
</script>`);
						return;
					}
					if (!u.pathname.startsWith("/__reading/")) return next();
					const [, , lang, site, file] = u.pathname.split("/");
					const ext = formats[lang];
					if (!ext) {
						res.statusCode = 404;
						res.end();
						return;
					}
					res.setHeader("Cache-Control", "no-store");
					if (site.startsWith("outer-")) {
						res.setHeader("Content-Type", "text/plain");
						if (file === "cover.html")
							res.end(
								`<h1 id="parent-heading">Parent page</h1><p>The embedded guide has independent navigation.</p><tp-${lang}-multi-pages id="guide" repository="/__reading/${lang}/${site.slice(6)}" menu style="display:block;height:500px;position:relative"></tp-${lang}-multi-pages><p style="block-size:200px">Parent continuation</p>`,
							);
						else if (file === "sidebar.html")
							res.end('<ul><li><a href="cover.html">Parent page</a></li></ul>');
						else {
							res.statusCode = 404;
							res.end();
						}
						return;
					}
					if (!file) {
						res.setHeader("Content-Type", "text/html");
						if (u.searchParams.has("nested")) {
							res.end(
								`<!doctype html><html><body><a id="leave" href="/__reading/${lang}/${site === "a" ? "b" : "a"}/?nested=1#/cover.html#parent-heading">Other document</a><tp-html-multi-pages id="parent" repository="/__reading/${lang}/outer-${site}" menu style="display:block;height:560px;position:relative"></tp-html-multi-pages><script type="module">import "/src/components/html-multi-pages/html-multi-pages.ts";import "/src/components/${lang}-multi-pages/${lang}-multi-pages.ts";</script></body></html>`,
							);
							return;
						}
						res.end(
							`<!doctype html><html><body><a id="leave" href="/__reading/${lang}/${site === "a" ? "b" : "a"}/">Other document</a><tp-${lang}-multi-pages id="guide" repository="/__reading/${lang}/${site}" menu style="display:block;height:500px;position:relative"></tp-${lang}-multi-pages><script type="module" src="/src/components/${lang}-multi-pages/${lang}-multi-pages.ts"></script></body></html>`,
						);
						return;
					}
					res.setHeader("Content-Type", "text/plain");
					if (file === `cover.${ext}` || file === `chapter.${ext}`) {
						res.end(
							source(lang, file.startsWith("cover") ? "Cover" : "Chapter"),
						);
						return;
					}
					if (file === `sidebar.${ext}`) {
						const links = [
							["cover." + ext, "Cover"],
							["chapter." + ext, "Chapter"],
						];
						res.end(
							lang === "html"
								? `<ul>${links.map(([p, t]) => `<li><a href="${p}">${t}</a></li>`).join("")}</ul>`
								: lang === "latex"
									? `\\usepackage{hyperref}\n\\begin{itemize}${links.map(([p, t]) => `\\item \\href{${p}}{${t}}`).join("\n")}\\end{itemize}`
									: links
											.map(([p, t]) =>
												lang === "asciidoc"
													? `* link:${p}[${t}]`
													: lang === "restructuredtext"
														? `* \`${t} <${p}>\`_`
														: `- [${t}](${p})`,
											)
											.join("\n"),
						);
						return;
					}
					res.statusCode = 404;
					res.end();
				});
			},
		},
	],
});
await server.listen();
console.log(`History fixtures: http://127.0.0.1:${process.env.PORT || 4376}`);
