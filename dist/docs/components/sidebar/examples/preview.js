// Match the documented child order while keeping each panel's content unchanged.
(() => {
	const preview = document.querySelector("tp-sidebar[data-attributes-preview]");
	if (!preview) return;
	const [sidebar, content] = preview.children;
	if (!sidebar || !content) return;
	const synchronize = () => {
		const right = preview.hasAttribute("right-sidebar");
		const first = right ? content : sidebar;
		if (preview.firstElementChild !== first)
			preview.insertBefore(first, preview.firstElementChild);
	};
	const observer = new MutationObserver(synchronize);
	observer.observe(preview, {
		attributes: true,
		attributeFilter: ["right-sidebar"],
	});
	window.addEventListener("pagehide", () => observer.disconnect(), {
		once: true,
	});
	synchronize();
})();
