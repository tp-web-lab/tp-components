import { afterEach, describe, expect, it, vi } from "vitest";
import { parseCsv } from "./csv.js";
import { TpCsvTable } from "./csv-table.js";

/** Creates a connected component with inert CSV source. */
function fixture(source = "Name,Score\nAda,12", attributes = ""): TpCsvTable {
	const wrapper = document.createElement("div");
	wrapper.innerHTML = `<tp-csv-table ${attributes}><script type="tp/csv-table">${source}</script></tp-csv-table>`;
	const element = wrapper.firstElementChild;
	if (!(element instanceof TpCsvTable)) throw new Error("Missing CSV table");
	document.body.append(element);
	return element;
}
/** Waits for deferred source reading and rendering. */
async function settle(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 20));
}
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("CSV parser", () => {
	it("handles BOM, quotes, escaped quotes, embedded separators and line breaks", () => {
		expect(
			parseCsv(
				'\uFEFFName,Note\r\nAda,"Hello, ""world""\nagain"\r\n\r\nBob,"ok" \t\rEnd,',
				",",
			),
		).toEqual([
			["Name", "Note"],
			["Ada", 'Hello, "world"\nagain'],
			["Bob", "ok"],
			["End", ""],
		]);
		expect(parseCsv("a;b\nc;d", ";")).toEqual([
			["a", "b"],
			["c", "d"],
		]);
		expect(parseCsv('""\n', ",")).toEqual([[""]]);
		expect(parseCsv("\n\r\n", ",")).toEqual([]);
		expect(parseCsv("a\tb\r", "\t")).toEqual([["a", "b"]]);
	});
	it("rejects invalid separators and malformed quoted fields", () => {
		for (const separator of ["", "::", '"', "\n", "\r"])
			expect(() => parseCsv("x", separator)).toThrow("separator");
		expect(() => parseCsv('a,"unfinished', ",")).toThrow("Unclosed");
		expect(() => parseCsv('a,b"c', ",")).toThrow("must start");
		expect(() => parseCsv('"a"b,c', ",")).toThrow("Unexpected text");
	});
});
describe("tp-csv-table", () => {
	it("renders native cells, pads short rows, and changes heading semantics", async () => {
		const element = fixture("Name,Score\nAda,12\nBob");
		expect(element.src).toBe("");
		expect(element.separator).toBe(",");
		expect(element.heading).toBe(false);
		await vi.waitFor(() =>
			expect(element.querySelectorAll("td")).toHaveLength(6),
		);
		expect(
			element.querySelector("tbody tr:last-child td:last-child")?.textContent,
		).toBe("");
		element.heading = true;
		await vi.waitFor(() =>
			expect(element.querySelectorAll('thead th[scope="col"]')).toHaveLength(2),
		);
		element.setAttribute("heading", "false");
		expect(element.heading).toBe(true);
		element.heading = false;
		await vi.waitFor(() => expect(element.querySelector("thead")).toBeNull());
		element.remove();
		document.body.append(element);
		await settle();
		expect(element.querySelectorAll("td")).toHaveLength(6);
	});
	it("uses the declared separator and never interprets HTML in cells", async () => {
		const element = fixture(
			"Name;Note\nAda;<img src=x onerror=alert(1)>",
			'separator=";"',
		);
		await vi.waitFor(() =>
			expect(element.querySelectorAll("td")).toHaveLength(4),
		);
		expect(element.querySelector("img")).toBeNull();
		expect(element.textContent).toContain("<img src=x onerror=alert(1)>");
		element.separator = "|";
		await vi.waitFor(() =>
			expect(element.querySelectorAll("td")).toHaveLength(2),
		);
		element.separator = "::";
		await vi.waitFor(() =>
			expect(element.querySelector("tp-callout")?.textContent).toContain(
				"separator",
			),
		);
		element.separator = ";";
		await vi.waitFor(() =>
			expect(element.querySelector("table")).not.toBeNull(),
		);
	});
	it("reads src before inline scripts, reports errors and restores inline input", async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValue({ ok: true, text: async () => "A\tB\n1\t2" });
		vi.stubGlobal("fetch", fetcher);
		const element = fixture("Inline,Source", 'src="/data.csv" separator="\\t"');
		await vi.waitFor(() =>
			expect(element.querySelectorAll("td")).toHaveLength(4),
		);
		expect(fetcher).toHaveBeenCalledWith(
			expect.stringContaining("/data.csv"),
			expect.objectContaining({ signal: expect.any(AbortSignal) }),
		);
		fetcher.mockResolvedValueOnce({ ok: false, status: 404 });
		element.src = "/missing.csv";
		await vi.waitFor(() => expect(element.textContent).toContain("404"));
		fetcher.mockRejectedValueOnce("network failure");
		element.src = "/failed.csv";
		await vi.waitFor(() =>
			expect(element.textContent).toContain("Unable to load"),
		);
		element.src = "";
		element.separator = "";
		await vi.waitFor(() =>
			expect(element.querySelector("td")?.textContent).toBe("Inline"),
		);
	});
	it("waits for late source, supports direct text and inert script aliases", async () => {
		const element = new TpCsvTable();
		document.body.append(element);
		await vi.waitFor(() =>
			expect(element.querySelector("tp-callout")).not.toBeNull(),
		);
		element.insertAdjacentHTML(
			"beforeend",
			'<script type="tp/csv">x,y</script>',
		);
		await vi.waitFor(() =>
			expect(element.querySelectorAll("td")).toHaveLength(2),
		);
		const direct = new TpCsvTable();
		direct.textContent = "one,two";
		document.body.append(direct);
		await vi.waitFor(() =>
			expect(direct.querySelectorAll("td")).toHaveLength(2),
		);
	});
	it("ignores stale successes and failures and cancels pending disconnected work", async () => {
		let finish:
			| ((response: { ok: boolean; text: () => Promise<string> }) => void)
			| undefined;
		let fail: ((reason: Error) => void) | undefined;
		const fetcher = vi.fn(
			() =>
				new Promise((resolve, reject) => {
					finish = resolve;
					fail = reject;
				}),
		);
		vi.stubGlobal("fetch", fetcher);
		const element = fixture("current,row", 'src="/slow.csv"');
		await vi.waitFor(() => expect(finish).toBeDefined());
		element.src = "";
		finish?.({ ok: true, text: async () => "stale" });
		await vi.waitFor(() =>
			expect(element.querySelector("td")?.textContent).toBe("current"),
		);
		element.src = "/slow-again.csv";
		await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
		element.remove();
		fail?.(new Error("obsolete"));
		await settle();
		expect(element.querySelector("tp-callout")).toBeNull();
		element.src = "";
		document.body.append(element);
		element.remove();
		await settle();
		expect(fetcher).toHaveBeenCalledTimes(2);
	});
});
