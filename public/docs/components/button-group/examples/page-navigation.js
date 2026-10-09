/** Wait for the group to prepare its children before attaching listeners. */
Promise.all([
	customElements.whenDefined("tp-button-group"),
	customElements.whenDefined("tp-button"),
]).then(() => {
	for (const root of document.querySelectorAll("[data-page-navigation]")) {
		if (root.hasAttribute("data-navigation-ready")) continue;
		const previous = root.querySelector("[data-previous]");
		const next = root.querySelector("[data-next]");
		const status = root.querySelector("[data-page-status]");
		if (!previous || !next || !status) continue;
		root.setAttribute("data-navigation-ready", "");
		let page = 1;
		const update = () => {
			status.textContent = `Page ${page} of 5`;
			previous.toggleAttribute("disabled", page === 1);
			next.toggleAttribute("disabled", page === 5);
		};
		previous.addEventListener("click", () => {
			page = Math.max(1, page - 1);
			update();
		});
		next.addEventListener("click", () => {
			page = Math.min(5, page + 1);
			update();
		});
	}
});
