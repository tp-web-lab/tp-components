import { afterEach, expect, it, vi } from "vitest";
import "./console.js";

afterEach(() => document.body.replaceChildren());

it("defaults to dark and changes only the selected console's theme", async () => {
	const first = document.createElement("tp-console");
	const second = document.createElement("tp-console");
	document.body.append(first, second);
	const theme = first.querySelector("tp-theme");
	expect(theme).not.toBeNull();
	await vi.waitFor(() =>
		expect(first.classList.contains("tp-dark")).toBe(true),
	);
	expect(second.classList.contains("tp-dark")).toBe(true);
	theme?.setAttribute("mode", "light");
	await vi.waitFor(() =>
		expect(first.classList.contains("tp-light")).toBe(true),
	);
	expect(first.classList.contains("tp-dark")).toBe(false);
	expect(second.classList.contains("tp-dark")).toBe(true);
	expect(document.body.classList.contains("tp-dark")).toBe(false);
	first.remove();
	document.body.append(first);
	expect(
		first.querySelectorAll("[data-tp-console-header] tp-theme"),
	).toHaveLength(1);
	await vi.waitFor(() =>
		expect(first.classList.contains("tp-light")).toBe(true),
	);
});
