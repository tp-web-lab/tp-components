import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
	codeCommentMarkers,
	findCodeCommentMarkers,
} from "./code-comment-markers.js";

/** Editor instances created by each focused decoration test. */
const views: EditorView[] = [];
beforeEach(() =>
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	),
);
afterEach(() => {
	for (const view of views.splice(0)) view.destroy();
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it("recognizes only explicit numbered markers inside parsed comments", () => {
	const doc =
		'const text = "// <1>";\nconst n = 1; // <1> <2> <100> <0>\n/* <2> */\nconst x = a < 1;';
	const state = EditorState.create({
		doc,
		extensions: [javascript({ typescript: true })],
	});
	const markers = findCodeCommentMarkers(state, new Set([1, 2]));
	expect(markers.map((marker) => marker.number)).toEqual([1, 2, 2]);
	expect(markers.map((marker) => doc.slice(marker.from, marker.to))).toEqual([
		"<1>",
		"<2>",
		"<2>",
	]);
	expect(findCodeCommentMarkers(state, new Set([3]))).toEqual([]);
	expect(
		findCodeCommentMarkers(EditorState.create({ doc }), new Set([1])),
	).toEqual([]);
});

it("supports Python and HTML comment syntax without decorating ordinary content", () => {
	const py = EditorState.create({
		doc: 'x = "<1>" # <2>',
		extensions: [python()],
	});
	const markup = EditorState.create({
		doc: "<p>&lt;1&gt;</p><!-- <2> -->",
		extensions: [html()],
	});
	for (const state of [py, markup])
		expect(
			findCodeCommentMarkers(state, new Set([1, 2])).map(
				(marker) => marker.number,
			),
		).toEqual([2]);
});

it("updates SVG replacements on edits without changing the document or selection", () => {
	const doc = "const x = 1; // <1>";
	const view = new EditorView({
		parent: document.body,
		state: EditorState.create({
			doc,
			extensions: [javascript(), codeCommentMarkers(new Set([1, 2]))],
		}),
	});
	views.push(view);
	expect(
		view.dom
			.querySelector(".tp-code-comment-marker")
			?.getAttribute("aria-label"),
	).toBe("Comment 1");
	expect(view.dom.querySelector("tp-icon")?.getAttribute("library")).toBe(
		"numbers",
	);
	expect(view.state.doc.toString()).toBe(doc);
	view.dispatch({ selection: { anchor: 0 } });
	view.dispatch({ changes: { from: 0, to: 0, insert: " " } });
	expect(view.dom.querySelectorAll(".tp-code-comment-marker")).toHaveLength(1);
	view.dispatch({
		changes: { from: 0, to: view.state.doc.length, insert: "// <2>" },
	});
	expect(view.dom.querySelector("tp-icon")?.getAttribute("name")).toBe("2");
	view.dispatch({
		changes: { from: 0, to: view.state.doc.length, insert: '"<2>"' },
	});
	expect(view.dom.querySelector(".tp-code-comment-marker")).toBeNull();
});
