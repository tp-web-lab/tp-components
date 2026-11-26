import { afterEach, expect, it, vi } from "vitest";
import { DocumentHistory } from "./document-history.js";
import { preserveReadingHistory } from "./multi-pages-reading-history.js";
import { restoreElementScroll } from "./restore-element-scroll.js";

const cleanups: (() => void)[] = [];
afterEach(() => {
	for (const stop of cleanups.splice(0)) stop();
	document.body.replaceChildren();
	history.replaceState(null, "", "/");
	vi.restoreAllMocks();
	vi.useRealTimers();
});
function guide(id: string) {
	const host = document.createElement("div");
	host.id = id;
	host.innerHTML = "<main><p>Reading</p></main>";
	document.body.append(host);
	const main = host.querySelector("main");
	if (!main) throw Error("Missing main");
	cleanups.push(preserveReadingHistory(host));
	return { host, main };
}
it("saves independent instances without replacing other history state", () => {
	history.scrollRestoration = "auto";
	history.replaceState({ router: 42 }, "", "/#/chapter.md#heading");
	const a = guide("a"),
		b = guide("b");
	a.main.scrollTop = 1400;
	b.main.scrollTop = 220;
	window.dispatchEvent(new Event("pagehide"));
	expect(history.state.router).toBe(42);
	expect(history.state.tpMultiPagesReadingPosition["id:a"].top).toBe(1400);
	expect(history.state.tpMultiPagesReadingPosition["id:b"].top).toBe(220);
	a.main.scrollTop = 1700;
	window.dispatchEvent(new Event("pagehide"));
	expect(history.state.tpMultiPagesReadingPosition["id:a"].top).toBe(1700);
	expect(history.scrollRestoration).toBe("manual");
	cleanups.shift()?.();
	expect(history.scrollRestoration).toBe("manual");
	cleanups.shift()?.();
	expect(history.scrollRestoration).toBe("auto");
});
it("restores after pageshow, stops fragment tracking and yields to reader input", async () => {
	vi.useFakeTimers();
	vi.spyOn(window, "scrollTo").mockImplementation(() => {});
	vi.spyOn(window, "requestAnimationFrame").mockReturnValue(0);
	const { host, main } = guide("a");
	main.scrollTop = 1400;
	window.dispatchEvent(new Event("pagehide"));
	main.scrollTop = 0;
	const restored = vi.fn();
	main.addEventListener("tp-scroll-restoration", restored);
	window.dispatchEvent(
		new PageTransitionEvent("pageshow", { persisted: true }),
	);
	await vi.advanceTimersByTimeAsync(40);
	expect(main.scrollTop).toBe(1400);
	expect(restored).toHaveBeenCalled();
	window.dispatchEvent(new Event("touchstart"));
	main.scrollTop = 1800;
	host.append(document.createElement("p"));
	await vi.advanceTimersByTimeAsync(100);
	expect(main.scrollTop).toBe(1800);
});
it("disconnect removes page lifecycle listeners", () => {
	const { main } = guide("a");
	main.scrollTop = 42;
	for (const stop of cleanups.splice(0)) stop();
	window.dispatchEvent(new Event("pagehide"));
	expect(history.state).toBeNull();
});

it("restores an internal entry created before the document was recreated", async () => {
	vi.useFakeTimers();
	vi.spyOn(window, "scrollTo").mockImplementation(() => {});
	vi.spyOn(window, "requestAnimationFrame").mockReturnValue(0);
	history.replaceState(null, "", "/#/cover.md");
	const { host, main } = guide("guide");
	main.scrollTop = 500;
	const replace = vi.spyOn(history, "replaceState");
	const first = new DocumentHistory(host, async () => {});
	first.go("chapter.md", "cover.md", "/#/chapter.md");
	const coverState = structuredClone(replace.mock.calls.at(-1)?.[0]);
	main.scrollTop = 1400;
	window.dispatchEvent(new Event("pagehide"));
	const chapterState = structuredClone(history.state);
	first.disconnect();
	main.scrollTop = 0;
	const navigate = vi.fn(async () => {});
	const recreated = new DocumentHistory(host, navigate);
	cleanups.push(() => recreated.disconnect());
	history.replaceState(coverState, "", "/#/cover.md");
	window.dispatchEvent(new PopStateEvent("popstate"));
	await vi.advanceTimersByTimeAsync(50);
	expect(navigate).toHaveBeenCalledWith("cover.md");
	expect(main.scrollTop).toBe(500);
	await vi.advanceTimersByTimeAsync(12000);
	main.scrollTop = 0;
	main.append(document.createElement("p"));
	await vi.advanceTimersByTimeAsync(50);
	expect(main.scrollTop).toBe(500);
	history.replaceState(chapterState, "", "/#/chapter.md");
	window.dispatchEvent(new PopStateEvent("popstate"));
	await vi.advanceTimersByTimeAsync(50);
	expect(navigate).toHaveBeenLastCalledWith("chapter.md");
});

it("does not accumulate WebKit fractional-zoom rounding", () => {
	const element = document.createElement("div");
	let position = 0;
	const assign = vi.fn((value: number) => {
		position = value - 1;
	});
	Object.defineProperty(element, "scrollTop", {
		get: () => position,
		set: assign,
	});
	for (let index = 0; index < 5; index++) restoreElementScroll(element, 0, 29);
	expect(position).toBe(29);
	expect(assign).toHaveBeenCalledTimes(2);
});
