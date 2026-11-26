/** Keep the Components subtree alphabetical without changing links or parents. */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const collator = new Intl.Collator("en", {
	sensitivity: "base",
	numeric: true,
});

export function sortComponentsSidebar(source) {
	const newline = source.includes("\r\n") ? "\r\n" : "\n";
	const lines = source.split(newline);
	const roots = lines.flatMap((line, index) =>
		/^( *)- \[Components\]\(components\/index\.md\)\s*$/.test(line)
			? [index]
			: [],
	);
	if (roots.length !== 1)
		throw new Error("Expected exactly one Components sidebar entry.");
	const start = roots[0];
	const indent = lines[start].match(/^ */)[0].length;
	const root = { indent, children: [] };
	const stack = [root];
	const leading = [];
	let end = start + 1;
	for (; end < lines.length; end++) {
		const line = lines[end];
		if (!line.trim()) {
			// Keep blank lines with the preceding entry, including trailing blanks.
			if (stack.length > 1) stack.at(-1).lines.push(line);
			else leading.push(line);
			continue;
		}
		if (line.match(/^ */)[0].length <= indent) break;
		const entry = /^( *)- \[([^\]]+)\]\([^)]*\).*$/u.exec(line);
		if (!entry)
			throw new Error(
				`Unsupported Components sidebar line ${end + 1}: ${line}`,
			);
		const node = {
			indent: entry[1].length,
			label: entry[2].replace(/[*`]/g, ""),
			lines: [line],
			children: [],
		};
		while (stack.at(-1).indent >= node.indent) stack.pop();
		stack.at(-1).children.push(node);
		stack.push(node);
	}
	function sortedLines(node) {
		node.children.sort((a, b) => collator.compare(a.label, b.label));
		return node.children.flatMap((child) => [
			...child.lines,
			...sortedLines(child),
		]);
	}
	return [
		...lines.slice(0, start + 1),
		...leading,
		...sortedLines(root),
		...lines.slice(end),
	].join(newline);
}

export function syncComponentsSidebar(file, { check = false } = {}) {
	const source = readFileSync(file, "utf8");
	const sorted = sortComponentsSidebar(source);
	const changed = sorted !== source;
	if (changed && !check) writeFileSync(file, sorted);
	return changed;
}

/** Also sort edits made while the documentation development server is running. */
export function componentsSidebarPlugin() {
	let file;
	return {
		name: "tp-components-sidebar-order",
		configResolved(config) {
			file = resolve(config.root, "public/docs/sidebar.md");
		},
		buildStart() {
			syncComponentsSidebar(file);
		},
		configureServer(server) {
			const sync = (changedFile) => {
				if (resolve(changedFile) !== file) return;
				try {
					if (syncComponentsSidebar(file))
						server.config.logger.info("Sorted the Components sidebar.");
				} catch (error) {
					server.config.logger.error(String(error));
				}
			};
			const ready = () => sync(file);
			server.watcher.once("ready", ready);
			server.watcher.add(file);
			server.watcher.on("change", sync);
			server.watcher.on("add", sync);
			server.httpServer?.once("close", () => {
				server.watcher.off("ready", ready);
				server.watcher.off("change", sync);
				server.watcher.off("add", sync);
			});
		},
	};
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
	const check = process.argv.includes("--check");
	const changed = syncComponentsSidebar(
		resolve(import.meta.dirname, "../public/docs/sidebar.md"),
		{ check },
	);
	if (check && changed) {
		console.error(
			"Components sidebar is not alphabetical. Run pnpm docs:sync-sidebar.",
		);
		process.exitCode = 1;
	} else
		console.log(
			changed
				? "Sorted the Components sidebar."
				: "Components sidebar is alphabetical.",
		);
}
