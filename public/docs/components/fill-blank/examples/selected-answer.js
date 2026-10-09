// Wait for the controls before assigning answers to the rich blank.
(async () => {
	await Promise.all([
		customElements.whenDefined("tp-fill-blank"),
		customElements.whenDefined("tp-blank"),
		customElements.whenDefined("tp-button"),
		customElements.whenDefined("tp-dragdrop"),
	]);
	const demo = document.getElementById("selected-answer-demo");
	const blank = demo?.querySelector("tp-blank");
	if (!demo || !blank) return;
	const output = demo.querySelector("[data-event-output]");
	const code = document.createElement("code");
	const pre = document.createElement("pre");
	pre.append(code);
	code.textContent = "No change event yet.";
	output?.replaceChildren(pre);
	let changeCount = 0;
	demo.addEventListener("tp-fill-blank-change", (event) => {
		changeCount += 1;
		// FormData is not JSON-serializable; show its entries without losing duplicate names.
		code.textContent = JSON.stringify(
			{
				change: changeCount,
				type: event.type,
				detail: {
					value: event.detail.value,
					formData: Array.from(event.detail.formData.entries()),
				},
			},
			null,
			2,
		);
	});
	const assign = (button) => {
		const value = button.getAttribute("data-answer") ?? "";
		const image = button.querySelector("img");
		// Keep the SVG image as the displayed answer, independently of its value.
		if (image) blank.setAnswer(value, image);
	};
	for (const button of demo.querySelectorAll("tp-button[data-answer]")) {
		button.addEventListener("click", () => assign(button));
	}
	demo.querySelector("tp-dragdrop")?.addEventListener("tp-dragdrop-drop", (event) => {
		const { source, target } = event.detail;
		if (target === blank && source.matches("tp-button[data-answer]")) assign(source);
	});
})();
