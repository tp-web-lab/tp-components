/** Run a grouped attribute panel independently of the component being tested. */
export async function initializeAttributes(config) {
	await Promise.all(
		[
			"tp-iframe",
			"tp-checkbox-list",
			"tp-radio-list",
			"tp-textfield",
			"tp-numberfield",
			"tp-button",
		]
			.filter((tag) => document.querySelector(tag))
			.map((tag) => customElements.whenDefined(tag)),
	);
	const frame = document.querySelector("#attributes-frame");
	const status = document.querySelector("#attributes-status");
	const booleans = document.querySelector("#attributes-booleans");
	const controls = [...document.querySelectorAll("[data-setting]")];
	const booleanSettings = config.settings.filter(
		(setting) => setting.kind === "boolean",
	);
	let values = Object.fromEntries(
		config.settings.map((setting) => [setting.name, setting.value]),
	);
	let bridge;
	let generation = 0;
	let channel;
	let previewUrl;
	const cleared = new Set();
	const synchronize = (snapshot) => {
		values = { ...values, ...snapshot };
		config.settings.forEach((setting) => {
			if (!cleared.has(setting.name)) return;
			const actual = String(values[setting.name] ?? "");
			if (actual === "" || actual === String(setting.value ?? ""))
				values[setting.name] = "";
			else cleared.delete(setting.name);
		});
		if (booleans)
			booleans.value = booleanSettings
				.map((setting, index) => (values[setting.name] ? index + 1 : null))
				.filter(Boolean)
				.join(",");
		controls.forEach((control) => {
			const setting = config.settings.find(
				(item) => item.name === control.dataset.setting,
			);
			const value = values[setting.name];
			if (setting.kind === "indexes")
				control.value = String(value)
					.split(/\s+/)
					.filter(Boolean)
					.map((index) => Number(index) + 1)
					.join(",");
			else if (setting.kind === "enum" || setting.kind === "file") {
				const choices =
					setting.choices ?? setting.values.map((value) => ({ value }));
				control.value = String(
					choices.findIndex(
						(choice) => String(choice.value) === String(value),
					) + 1,
				);
			} else if (control.value !== String(value))
				control.value = String(value ?? "");
		});
	};
	const render = () => {
		generation++;
		channel = crypto.randomUUID();
		bridge = undefined;
		status.textContent = "Loading preview…";
		const data = JSON.stringify({
			...config,
			values,
			generation,
			channel,
		}).replaceAll("<", "\\u003c");
		// location.origin is "null" inside srcdoc; resolve against its inherited base.
		const base = new URL(
			`/tp-components/docs/components/${config.component}/examples/`,
			document.baseURI,
		);
		const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="${base.href}"></head><body><script id="attributes-config" type="application/json">${data}</script><script type="module" src="/tp-components/docs/components/_shared/component-attributes-preview.js"></script></body></html>`;
		// Safari can leave a third nested about:srcdoc document at about:blank.
		// Give the Attributes preview its own URL so components can embed their
		// normal srcdoc renderers. Keep the same origin and explicit resource base.
		const previousUrl = previewUrl;
		previewUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));
		frame.src = previewUrl;
		if (previousUrl) URL.revokeObjectURL(previousUrl);
	};
	const receive = (event) => {
		// Components can execute callbacks from a shared ancestor realm in WebKit.
		// Authenticate the preview with its private, per-render token rather than
		// event.source, which can then identify that ancestor instead of this iframe.
		if (
			event.data?.channel !== channel ||
			event.data?.generation !== generation
		)
			return;
		if (event.data.type === "tp-attributes-ready") {
			bridge = { observed: event.data.observed ?? [] };
			synchronize(event.data.values);
			status.textContent =
				"Ready. Edit the controls or interact with the preview. Changes to initialization-only attributes reload the preview; Reload preview is also available.";
		} else if (event.data.type === "tp-attributes-state")
			synchronize(event.data.values);
		else if (
			event.data.type === "tp-attributes-height" &&
			!config.fullWindow &&
			Number.isFinite(event.data.height)
		)
			frame.style.height = `${Math.min(640, Math.max(96, event.data.height))}px`;
		else if (event.data.type === "tp-attributes-error")
			status.textContent = `Preview error: ${event.data.message}`;
	};
	window.addEventListener("message", receive);
	window.addEventListener(
		"pagehide",
		() => {
			window.removeEventListener("message", receive);
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		},
		{ once: true },
	);
	const apply = (setting, value) => {
		if (
			setting.kind === "file" &&
			!setting.choices.some((choice) => String(choice.value) === String(value))
		)
			return;
		values[setting.name] = value;
		if (!setting.kind && value === "") cleared.add(setting.name);
		else cleared.delete(setting.name);
		if (bridge?.observed.includes(setting.name))
			frame.querySelector("iframe").contentWindow.postMessage(
				{
					type: "tp-attributes-set",
					generation,
					channel,
					name: setting.name,
					value,
				},
				"*",
			);
		else render();
	};
	booleans?.addEventListener("tp-checkbox-list-change", (event) => {
		const selected = event.detail.value.split(",");
		booleanSettings.forEach((setting, index) => {
			const value = selected.includes(String(index + 1));
			if (values[setting.name] !== value) apply(setting, value);
		});
	});
	controls.forEach((control) => {
		const setting = config.settings.find(
			(item) => item.name === control.dataset.setting,
		);
		control.addEventListener("tp-clear", (event) => {
			if (event.target !== control || control.localName !== "tp-textfield")
				return;
			control.value = "";
			apply(setting, "");
		});
		const eventName =
			setting.kind === "indexes"
				? "tp-checkbox-list-change"
				: setting.kind
					? "tp-radio-list-change"
					: "input";
		control.addEventListener(eventName, (event) => {
			if (event.target !== control) return;
			let value = control.value;
			if (setting.kind === "indexes")
				value = event.detail.value
					.split(",")
					.filter(Boolean)
					.map((index) => Number(index) - 1)
					.join(" ");
			else if (setting.kind)
				value = (setting.choices ?? setting.values.map((value) => ({ value })))[
					Number(event.detail.value) - 1
				]?.value;
			if (value !== undefined) apply(setting, value);
		});
	});
	document.querySelector("#attributes-reset").addEventListener("click", () => {
		cleared.clear();
		values = Object.fromEntries(
			config.settings.map((setting) => [setting.name, setting.value]),
		);
		synchronize(values);
		render();
	});
	document
		.querySelector("#attributes-reload")
		.addEventListener("click", render);
	synchronize(values);
	render();
}
