import { afterEach, describe, expect, it, vi } from "vitest";
import { TpListTable } from "./list-table.js";

/** Creates a connected list table without serializing its later generated content. */
function fixture(content: string): TpListTable {
	const element = new TpListTable();
	element.innerHTML = content;
	document.body.append(element);
	return element;
}
/** Waits for batched DOM observation. */
async function settle(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 20));
}
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});

describe("tp-list-table", () => {
	it("accepts all ul/ol combinations and promotes the first row when heading is present", async () => {
		for (const outer of ["ul", "ol"])
			for (const inner of ["ul", "ol"]) {
				const element = fixture(
					`<${outer}><li><${inner}><li>Name</li><li>Score</li></${inner}></li><li><${inner}><li>Ada</li><li>12</li></${inner}></li><li><${inner}><li>Bob</li></${inner}></li></${outer}>`,
				);
				expect(element.heading).toBe(false);
				await vi.waitFor(() =>
					expect(element.querySelectorAll("td")).toHaveLength(6),
				);
				element.heading = true;
				await vi.waitFor(() =>
					expect(
						element.querySelectorAll('thead th[scope="col"]'),
					).toHaveLength(2),
				);
				expect(
					element.querySelector("tbody tr:last-child td:last-child")
						?.textContent,
				).toBe("");
				element.setAttribute("heading", "false");
				expect(element.heading).toBe(true);
				element.heading = false;
				await vi.waitFor(() =>
					expect(element.querySelector("thead")).toBeNull(),
				);
				element.remove();
			}
	});
	it("preserves rich content nodes and listeners across heading changes and reconnection", async () => {
		const element = fixture(
			'<ul><li><ul><li>Action</li><li>Formula</li></ul></li><li><ol><li><tp-button>Try</tp-button></li><li><svg aria-label="Triangle"><path d="M0 0L10 0L5 10Z"/></svg></li></ol></li></ul>',
		);
		const button = element.querySelector("tp-button");
		const svg = element.querySelector("svg");
		const click = vi.fn();
		button?.addEventListener("click", click);
		await vi.waitFor(() =>
			expect(element.querySelector("table")).not.toBeNull(),
		);
		element.heading = true;
		await settle();
		expect(element.querySelector("tp-button")).toBe(button);
		expect(element.querySelector("svg")).toBe(svg);
		button?.dispatchEvent(new MouseEvent("click"));
		expect(click).toHaveBeenCalledOnce();
		element.remove();
		document.body.append(element);
		await settle();
		expect(element.querySelector("tp-button")).toBe(button);
		expect(element.querySelectorAll("table")).toHaveLength(1);
	});
	it("converts a flat list to one column and retains nested lists inside cells", async () => {
		const flat = fixture("<ol><li>One</li><li>Two</li></ol>");
		await vi.waitFor(() => expect(flat.querySelectorAll("tr")).toHaveLength(2));
		expect(flat.querySelectorAll("td")).toHaveLength(2);
		const nested = fixture(
			"<ul><li><ol><li><ul><li>A</li><li>B</li></ul></li></ol></li></ul>",
		);
		await vi.waitFor(() =>
			expect(nested.querySelector("td ul li")?.textContent).toBe("A"),
		);
	});
	it("warns on missing or malformed input and recovers when valid lists arrive", async () => {
		const element = fixture("");
		await vi.waitFor(() =>
			expect(element.querySelector("tp-callout")).not.toBeNull(),
		);
		element.append(document.createElement("span"));
		await settle();
		expect(element.querySelectorAll("tp-callout")).toHaveLength(1);
		element.insertAdjacentHTML("afterbegin", "<ul></ul>");
		await settle();
		expect(element.querySelectorAll("tp-callout")).toHaveLength(1);
		element
			.querySelector("ul")
			?.insertAdjacentHTML("beforeend", "<li>Ready</li>");
		await vi.waitFor(() =>
			expect(element.querySelector("td")?.textContent).toBe("Ready"),
		);
		for (const source of [
			"<ul><li>A</li></ul><ol><li>B</li></ol>",
			"<ul><li>Label<ul><li>A</li></ul></li></ul>",
			"<ul><li><ul><li>A</li></ul><ol><li>B</li></ol></li></ul>",
			"<ul><li><ul></ul></li></ul>",
		]) {
			const bad = fixture(source);
			await vi.waitFor(() =>
				expect(bad.querySelector("tp-callout")).not.toBeNull(),
			);
			expect(bad.querySelector("ul")).not.toBeNull();
		}
	});
	it("does not render while disconnected, then accepts late content on reconnect", async () => {
		const element = fixture("<ul><li>Late</li></ul>");
		element.remove();
		element.heading = true;
		await settle();
		expect(element.querySelector("table")).toBeNull();
		document.body.append(element);
		await vi.waitFor(() =>
			expect(element.querySelector("th")?.textContent).toBe("Late"),
		);
		expect(document.querySelectorAll("#tp-content-table-styles")).toHaveLength(
			1,
		);
	});
});
