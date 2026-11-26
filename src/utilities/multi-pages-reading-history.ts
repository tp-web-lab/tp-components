import { restoreElementScroll } from "./restore-element-scroll.js";

let activeReaders = 0;
let previousRestoration: ScrollRestoration = "auto";

/** Preserve the reading position across the full-page trip to the collection. */
export function preserveReadingHistory(book: HTMLElement): () => void {
	if (activeReaders++ === 0) {
		previousRestoration = history.scrollRestoration;
		history.scrollRestoration = "manual";
	}
	const key = "tpMultiPagesReadingPosition";
	const identity = book.id
		? `id:${book.id}`
		: `${book.localName}:${[...document.querySelectorAll(book.localName)].indexOf(book)}`;
	let cancelRestore = () => {};
	const savePosition = () => {
		const content = book.querySelector("main");
		if (!content) return;
		const state =
			history.state && typeof history.state === "object" ? history.state : {};
		history.replaceState(
			{
				...state,
				[key]: {
					...state[key],
					[identity]: {
						href: location.href,
						left: content.scrollLeft,
						top: content.scrollTop,
						windowX: window.scrollX,
						windowY: window.scrollY,
					},
				},
			},
			"",
		);
	};
	// Back and Forward leave the document without clicking its toolbar.
	window.addEventListener("pagehide", savePosition);
	const restore = () => {
		cancelRestore();
		const saved = history.state?.[key]?.[identity];
		if (!saved || saved.href !== location.href) return;
		let stopped = false,
			frame = 0;
		const apply = () => {
			frame = 0;
			if (stopped || location.href !== saved.href) return;
			const content = book.querySelector("main");
			if (!content) return;
			// An old URL fragment must not pull the reader away from the saved position.
			content.dispatchEvent(new Event("tp-scroll-restoration"));
			restoreElementScroll(content, saved.left, saved.top);
			window.scrollTo(saved.windowX, saved.windowY);
			for (const child of content.children) resize?.observe(child);
		};
		const schedule = () => {
			if (!stopped && !frame) frame = window.setTimeout(apply, 0);
		};
		const mutations = new MutationObserver(schedule);
		const resize =
			typeof ResizeObserver === "undefined"
				? null
				: new ResizeObserver(schedule);
		const stop = () => {
			stopped = true;
			clearTimeout(frame);
			clearTimeout(timer);
			mutations.disconnect();
			resize?.disconnect();
			book.removeEventListener("tp-markdown-rendered", schedule);
			for (const type of ["wheel", "touchstart", "pointerdown", "keydown"])
				window.removeEventListener(type, stop, true);
			window.removeEventListener("hashchange", stop);
		};
		// Retry while async markup, formulas and images establish the page height.
		// Any reader input immediately takes precedence over restoration.
		const timer = setTimeout(stop, 60000);
		mutations.observe(book, { childList: true, subtree: true });
		resize?.observe(book);
		book.addEventListener("tp-markdown-rendered", schedule);
		for (const type of ["wheel", "touchstart", "pointerdown", "keydown"])
			window.addEventListener(type, stop, { capture: true, passive: true });
		window.addEventListener("hashchange", stop);
		cancelRestore = stop;
		schedule();
	};
	const onPageShow = (event: PageTransitionEvent) => {
		if (
			event.persisted ||
			(
				performance.getEntriesByType("navigation")[0] as
					| PerformanceNavigationTiming
					| undefined
			)?.type === "back_forward"
		)
			restore();
	};
	window.addEventListener("pageshow", onPageShow);
	// The module may finish loading after pageshow.
	if (
		(
			performance.getEntriesByType("navigation")[0] as
				| PerformanceNavigationTiming
				| undefined
		)?.type === "back_forward"
	)
		restore();
	let disconnected = false;
	return () => {
		if (disconnected) return;
		disconnected = true;
		if (--activeReaders === 0) history.scrollRestoration = previousRestoration;
		cancelRestore();
		window.removeEventListener("pagehide", savePosition);
		window.removeEventListener("pageshow", onPageShow);
	};
}
