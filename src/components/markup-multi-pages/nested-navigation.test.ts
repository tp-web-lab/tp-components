import { afterEach, expect, it, vi } from "vitest";
import { TpMarkdownMultiPages } from "../markdown-multi-pages/markdown-multi-pages.js";
import { TpMarkupMultiPages } from "./markup-multi-pages.js";

interface Navigation {
	readCurrentHref(): string | null;
	goTo(href: string): void;
	goToCurrentFragment(fragment: string): void;
	handleHashChange(): void;
	navigate(href: string): Promise<void>;
	scrollToFragment(fragment: string): void;
}
afterEach(() => {
	vi.restoreAllMocks();
	history.replaceState(null, "", "/");
});
it.each([TpMarkupMultiPages, TpMarkdownMultiPages])(
	"isolates an embedded %s guide from its parent's route",
	(Constructor) => {
		const outer = document.createElement("div");
		outer.className = "tp-markdown-multi-pages-host";
		const inner = new Constructor();
		inner.setAttribute("repository", "/guide");
		outer.append(inner);
		const nav = inner as unknown as Navigation;
		const navigate = vi.spyOn(nav, "navigate").mockResolvedValue();

		history.replaceState(null, "", "/#/components/global-listof/index.md");
		expect(nav.readCurrentHref()).toBeNull();
		nav.handleHashChange();
		expect(navigate).not.toHaveBeenCalled();
		nav.goTo("/guide/first.md#definition");
		expect(navigate).toHaveBeenCalledWith("/guide/first.md#definition");
		nav.goToCurrentFragment("#definition");
		expect(navigate).toHaveBeenLastCalledWith("/guide/cover.md#definition");
		expect(location.hash).toBe("#/components/global-listof/index.md");
		inner.disconnectedCallback();
		outer.removeChild(inner);
		expect(nav.readCurrentHref()).toBe("components/global-listof/index.md");
	},
);

it.each([TpMarkupMultiPages, TpMarkdownMultiPages])(
	"restores the local route of a recreated embedded %s guide",
	async (Constructor) => {
		const parent = document.createElement("div");
		parent.className = "tp-markup-multi-pages-host";
		history.replaceState(null, "", "/#/parent.html#heading");
		const first = new Constructor();
		first.id = "nested-guide";
		first.setAttribute("repository", "/guide");
		parent.append(first);
		const original = first as unknown as Navigation;
		vi.spyOn(original, "navigate").mockResolvedValue();
		original.goTo("/guide/chapter.md#section");
		first.disconnectedCallback();
		first.remove();
		const second = new Constructor();
		second.id = "nested-guide";
		second.setAttribute("repository", "/guide");
		parent.append(second);
		const restored = second as unknown as Navigation & {
			initialize(): Promise<void>;
			loadSidebar(): Promise<void>;
		};
		vi.spyOn(restored, "loadSidebar").mockResolvedValue();
		const navigate = vi.spyOn(restored, "navigate").mockResolvedValue();
		await restored.initialize();
		expect(navigate).toHaveBeenCalledWith("/guide/chapter.md#section");
		expect(location.hash).toBe("#/parent.html#heading");
		second.disconnectedCallback();
		second.remove();
	},
);
