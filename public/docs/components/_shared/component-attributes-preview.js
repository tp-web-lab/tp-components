/** Isolate author content and initialization-only effects from the controls. */
const config = JSON.parse(
	document.querySelector("#attributes-config").textContent,
);
const notify = (type, detail = {}) =>
	parent.postMessage(
		{ type, generation: config.generation, channel: config.channel, ...detail },
		"*",
	);
try {
	if (!config.fullWindow) {
		document.documentElement.style.minHeight = "0";
		document.body.style.minHeight = "0";
		document.body.style.height = "auto";
		// Reserve room for animated halos and focus rings outside component bounds.
		document.body.style.padding =
			"calc(var(--tp-content-spacing, 1.75rem) / 2)";
	}
	const template = document.createElement("template");
	template.innerHTML = config.source;
	const target = template.content.querySelector("[data-attributes-preview]");
	if (!target) throw new Error("Missing preview component");
	const apply = (name, value) => {
		const setting = config.settings.find((item) => item.name === name);
		if (setting.kind === "boolean")
			target.toggleAttribute(name, Boolean(value));
		else if (String(value) === String(setting.value) || value === "")
			target.removeAttribute(name);
		else target.setAttribute(name, String(value));
	};
	config.settings.forEach((setting) => {
		apply(setting.name, config.values[setting.name]);
	});
	// Activate author scripts after inserting their markup, just as the HTML viewer does.
	const scripts = [...template.content.querySelectorAll("script")];
	document.body.append(template.content);
	scripts
		.filter(
			(script) =>
				!script.type ||
				["module", "text/javascript", "application/javascript"].includes(
					script.type,
				),
		)
		.forEach((script) => {
			const executable = document.createElement("script");
			[...script.attributes].forEach((attribute) => {
				executable.setAttribute(attribute.name, attribute.value);
			});
			executable.textContent = script.textContent;
			script.replaceWith(executable);
		});
	await import("/docs/components/_shared/component-preview.js");
	await customElements.whenDefined(`tp-${config.component}`);
	const snapshot = () =>
		Object.fromEntries(
			config.settings.map((setting) => [
				setting.name,
				setting.kind === "boolean"
					? target.hasAttribute(setting.name)
					: (target.getAttribute(setting.name) ?? setting.value),
			]),
		);
	const publish = () => notify("tp-attributes-state", { values: snapshot() });
	const observer = new MutationObserver(publish);
	observer.observe(target, {
		attributes: true,
		attributeFilter: config.settings.map((setting) => setting.name),
	});
	target.addEventListener("input", publish);
	target.addEventListener("change", publish);
	// Keep preview changes inside the preview's event loop.
	const receive = (event) => {
		if (
			event.source !== parent ||
			event.data?.channel !== config.channel ||
			event.data?.generation !== config.generation ||
			event.data.type !== "tp-attributes-set"
		)
			return;
		const setting = config.settings.find(
			(item) => item.name === event.data.name,
		);
		if (!setting) return;
		if (
			setting.kind === "file" &&
			!setting.choices.some(
				(choice) => String(choice.value) === String(event.data.value),
			)
		)
			return;
		apply(setting.name, event.data.value);
	};
	window.addEventListener("message", receive);
	const resize = new ResizeObserver(() => {
		if (!config.fullWindow)
			notify("tp-attributes-height", {
				height: Math.ceil(document.body.getBoundingClientRect().height + 32),
			});
	});
	resize.observe(document.body);
	window.addEventListener(
		"pagehide",
		() => {
			window.removeEventListener("message", receive);
			observer.disconnect();
			resize.disconnect();
		},
		{
			once: true,
		},
	);
	notify("tp-attributes-ready", {
		values: snapshot(),
		observed: target.constructor.observedAttributes ?? [],
	});
} catch (error) {
	notify("tp-attributes-error", { message: error.message });
}
