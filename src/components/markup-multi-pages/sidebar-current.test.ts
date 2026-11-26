import { afterEach, expect, it, vi } from "vitest";
import "../tree/tree.js";
import {
	observeCurrentSidebarPage,
	revealCurrentSidebarPage,
} from "./sidebar-current.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});
function fixture() {
	const host = document.createElement("div");
	host.innerHTML =
		'<aside style="overflow-x:auto;overflow-y:auto"><tp-tree level="0"><ul><li id="parent">Parent<ul><li id="nested">Nested<ul><li><a href="#page">Current</a></li></ul></li></ul></li><li id="other" data-expanded="true">Other<ul><li>Other child</li></ul></li></ul></tp-tree></aside><main>Reading pane</main>';
	document.body.append(host);
	const sidebar = host.querySelector("aside");
	const tree = host.querySelector("tp-tree");
	const link = host.querySelector("a");
	const parent = host.querySelector<HTMLLIElement>("#parent");
	if (!sidebar || !tree || !link || !parent) throw Error("Missing fixture");
	return { host, sidebar, tree, link, parent };
}
it("opens the current path while preserving other branches", () => {
	const { host, sidebar, link } = fixture();
	link.setAttribute("aria-current", "page");
	revealCurrentSidebarPage(sidebar);
	expect(host.querySelectorAll('li[data-expanded="true"]')).toHaveLength(3);
});
it("scrolls only overflowing navigation containers by the necessary distance", () => {
	const { host, sidebar, link } = fixture();
	link.setAttribute("aria-current", "page");
	vi.spyOn(sidebar, "getClientRects").mockReturnValue([
		new DOMRect(0, 0, 200, 100),
	] as unknown as DOMRectList);
	vi.spyOn(sidebar, "getBoundingClientRect").mockReturnValue(
		new DOMRect(0, 0, 200, 100),
	);
	vi.spyOn(link, "getBoundingClientRect").mockReturnValue(
		new DOMRect(300, 160, 40, 20),
	);
	for (const [key, value] of Object.entries({
		clientWidth: 200,
		clientHeight: 100,
		scrollWidth: 500,
		scrollHeight: 500,
	}))
		Object.defineProperty(sidebar, key, { value, configurable: true });
	const main = host.querySelector("main");
	if (!main) throw Error("Missing reading pane");
	main.scrollTop = 42;
	revealCurrentSidebarPage(sidebar);
	expect(sidebar.scrollTop).toBe(80);
	expect(sidebar.scrollLeft).toBe(140);
	expect(main.scrollTop).toBe(42);
});
it("does not scroll a hidden sidebar", () => {
	const { sidebar, link } = fixture();
	link.setAttribute("aria-current", "page");
	sidebar.scrollTop = 20;
	revealCurrentSidebarPage(sidebar);
	expect(sidebar.scrollTop).toBe(20);
});
it("tracks selection and menu reopening and stops after disconnect", async () => {
	const { host, sidebar, tree, link, parent } = fixture();
	const stop = observeCurrentSidebarPage(host, sidebar);
	try {
		link.setAttribute("aria-current", "page");
		await vi.waitFor(() =>
			expect(parent.getAttribute("data-expanded")).toBe("true"),
		);
		tree.collapseAll();
		host.setAttribute("menu", "");
		await vi.waitFor(() =>
			expect(parent.getAttribute("data-expanded")).toBe("true"),
		);
	} finally {
		stop();
	}
	tree.collapseAll();
	link.removeAttribute("aria-current");
	link.setAttribute("aria-current", "page");
	await new Promise((resolve) => setTimeout(resolve, 40));
	expect(parent.getAttribute("data-expanded")).toBe("false");
});
