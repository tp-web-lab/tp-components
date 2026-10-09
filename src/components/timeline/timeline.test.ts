import { afterEach, describe, expect, it, vi } from "vitest";
import { TpTimeline } from "./timeline.js";

/** Creates an event with optional rich content. */
function event(content = ""): string {
	return `<dl><dt>Time</dt><dd>09:00</dd><dt>Title</dt><dd>Welcome</dd>${content}</dl>`;
}

/** Connects a timeline with declarative source. */
function mount(source = event()): TpTimeline {
	const element = document.createElement("tp-timeline");
	element.innerHTML = source;
	document.body.append(element);
	return element;
}

afterEach(() => document.body.replaceChildren());

describe("tp-timeline", () => {
	it("scrolls the horizontal list with arrows without handling nested controls", () => {
		const element = mount(
			event("<dt>Content</dt><dd><button>Action</button></dd>"),
		);
		element.orientation = "horizontal";
		const list = element.querySelector("ol");
		if (!list) throw new Error("Missing list");
		list.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "ArrowRight",
				bubbles: true,
				cancelable: true,
			}),
		);
		expect(list.scrollLeft).toBe(80);
		list.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
		);
		expect(list.scrollLeft).toBe(0);
		list.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
		);
		list.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "ArrowRight",
				ctrlKey: true,
				bubbles: true,
			}),
		);
		element
			.querySelector("button")
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
			);
		expect(list.scrollLeft).toBe(0);
		element.orientation = "vertical";
		list.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
		);
		expect(list.scrollLeft).toBe(0);
		element.orientation = "horizontal";
		element.remove();
		list.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
		);
		expect(list.scrollLeft).toBe(0);
	});
	it("splits repeated Time groups emitted by native markup parsers", () => {
		const element = mount(
			`<dl>${event().replace(/<\/?dl>/g, "")}${event().replace(/<\/?dl>/g, "")}</dl>`,
		);
		expect(element.querySelectorAll("ol > li")).toHaveLength(2);
	});
	it("does not consume a partially invalid grouped source or blank required fields", () => {
		const element = mount(
			"<dl><dt>Time</dt><dd>Today</dd><dt>Title</dt><dd>First</dd><dt>Time</dt><dd>Tomorrow</dd><dt>Title</dt><dd> </dd></dl>",
		);
		expect(element.querySelector("ol")).toBeNull();
		expect(element.querySelectorAll("dl dd")).toHaveLength(4);
	});
	it("registers and defaults to vertical with inherited attributes", () => {
		expect(customElements.get("tp-timeline")).toBe(TpTimeline);
		expect(TpTimeline.observedAttributes).toEqual([
			"dir",
			"lang",
			"orientation",
		]);
		const element = mount();
		expect(element.orientation).toBe("vertical");
		expect(element.dataset.orientation).toBe("vertical");
		expect(element.querySelector("ol")?.hasAttribute("tabindex")).toBe(false);
		expect(element.querySelectorAll("ol > li")).toHaveLength(1);
		expect(element.querySelector("dl")).toBeNull();
	});

	it("places times and content in separate areas and supplies an empty circle", () => {
		const element = mount(
			event("<dt>Content</dt><dd><strong>Meet the team.</strong></dd>") +
				event(),
		);
		expect(element.querySelectorAll("ol > li")).toHaveLength(2);
		expect(element.querySelector(".tp-timeline-time")?.textContent).toBe(
			"09:00",
		);
		expect(element.querySelector(".tp-timeline-title")?.textContent).toBe(
			"Welcome",
		);
		expect(
			element.querySelector(".tp-timeline-content strong")?.textContent,
		).toBe("Meet the team.");
		expect(element.querySelector(".tp-timeline-icon")?.childNodes).toHaveLength(
			0,
		);
		expect(
			element.querySelector(".tp-timeline-marker")?.getAttribute("aria-hidden"),
		).toBe("true");
		expect(element.querySelectorAll(".tp-timeline-content")).toHaveLength(1);
	});

	it("preserves original nodes, nested lists and event listeners", () => {
		const element = document.createElement("tp-timeline");
		element.innerHTML = event(
			'<dt>Icon</dt><dd><tp-icon name="home"></tp-icon></dd><dt>Content</dt><dd><button>Try</button><dl><dt>Nested</dt><dd>Kept</dd></dl></dd>',
		);
		const button = element.querySelector("button");
		const clicked = vi.fn();
		button?.addEventListener("click", clicked);
		document.body.append(element);
		expect(element.querySelector("button")).toBe(button);
		button?.click();
		expect(clicked).toHaveBeenCalledOnce();
		expect(
			element.querySelector(".tp-timeline-icon tp-icon")?.getAttribute("name"),
		).toBe("home");
		expect(element.querySelector(".tp-timeline-content dl")?.textContent).toBe(
			"NestedKept",
		);
		expect(element.getAttribute("data-source")).toContain("<dt>Time</dt>");
	});

	it("changes orientation before and after connection without replacing events", () => {
		const element = document.createElement("tp-timeline");
		element.orientation = "horizontal";
		element.innerHTML = event();
		document.body.append(element);
		const item = element.querySelector("li");
		expect(element.querySelector("ol")?.tabIndex).toBe(0);
		element.orientation = "vertical";
		expect(element.querySelector("li")).toBe(item);
		expect(element.querySelector("ol")?.hasAttribute("tabindex")).toBe(false);
		element.setAttribute("orientation", "unknown");
		expect(element.orientation).toBe("vertical");
		element.removeAttribute("orientation");
		expect(element.dataset.orientation).toBe("vertical");
	});

	it("accepts trimmed case-insensitive field names and multiple descriptions", () => {
		const element = mount(
			"<dl><dd>Ignored</dd><dt> TITLE </dt><dd>First</dd><dd> second</dd><dt> time </dt><dd>Today</dd><dt>Unknown</dt><dd>Ignored</dd></dl>",
		);
		expect(element.querySelector(".tp-timeline-title")?.textContent).toBe(
			"First second",
		);
		expect(element.querySelector(".tp-timeline-time")?.textContent).toBe(
			"Today",
		);
	});

	it("handles empty content and late insertion without duplicate events", async () => {
		const element = mount("");
		expect(element.querySelector("ol")).toBeNull();
		element.insertAdjacentHTML("beforeend", event());
		await Promise.resolve();
		expect(element.querySelectorAll("li")).toHaveLength(1);
		element.insertAdjacentHTML("beforeend", event());
		await Promise.resolve();
		expect(element.querySelectorAll("li")).toHaveLength(2);
	});

	it("retains invalid source with an informative warning", () => {
		const element = mount("<dl><dt>Title</dt><dd>Missing time</dd></dl>");
		expect(element.querySelector("dl")).not.toBeNull();
		expect(element.querySelector("tp-callout")?.textContent).toContain(
			"requires Time and Title",
		);
		expect(element.querySelector("ol")).toBeNull();
	});

	it("resumes after reconnection and clears resolved diagnostics", async () => {
		const element = mount("<dl><dt>Time</dt><dd>Today</dd></dl>");
		element.remove();
		element
			.querySelector("dl")
			?.insertAdjacentHTML("beforeend", "<dt>Title</dt><dd>Fixed</dd>");
		await Promise.resolve();
		expect(element.querySelector("ol")).toBeNull();
		document.body.append(element);
		expect(element.querySelector("tp-callout")).toBeNull();
		expect(element.querySelectorAll("li")).toHaveLength(1);
		element.remove();
		document.body.append(element);
		expect(element.querySelectorAll("li")).toHaveLength(1);
	});

	it("shares one stylesheet between instances", () => {
		mount();
		mount();
		expect(document.querySelectorAll("#tp-timeline-styles")).toHaveLength(1);
	});
});
