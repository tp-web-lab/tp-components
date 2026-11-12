import { expect, it, vi } from "vitest";
import { connectIframeLinks } from "./iframe-links.js";

it("resolves local and parent anchors without navigating the iframe", () => {
	const host = document.createElement("div");
	const target = document.createElement("h2");
	target.id = "paragraphs";
	target.scrollIntoView = vi.fn();
	document.body.append(host, target);
	const frame = document.implementation.createHTMLDocument();
	frame.body.innerHTML = '<a href="#paragraphs">Paragraphs</a>';
	const stop = connectIframeLinks(host, frame);
	const click = () => {
		const event = new MouseEvent("click", { bubbles: true, cancelable: true });
		frame.querySelector("a")?.dispatchEvent(event);
		return event;
	};
	expect(click().defaultPrevented).toBe(true);
	expect(target.scrollIntoView).toHaveBeenCalledOnce();
	const local = document.createElement("h2");
	local.id = "paragraphs";
	local.scrollIntoView = vi.fn();
	frame.body.append(local);
	click();
	expect(local.scrollIntoView).toHaveBeenCalledOnce();
	expect(target.scrollIntoView).toHaveBeenCalledOnce();
	stop();
	expect(click().defaultPrevented).toBe(false);
	host.remove();
	target.remove();
});
