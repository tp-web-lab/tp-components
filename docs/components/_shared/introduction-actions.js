// Shared behavior for the live introductions and their four markup equivalents.
(() => {
	async function initialize(root) {
		if (root.dataset.introReady) return;
		root.dataset.introReady = "pending";
		const action = root.dataset.introAction;
		// Wait for public controls only: overlays also create unregistered layout tags.
		const tags = new Set([
			action === "counter" ? "tp-icon-button" : `tp-${action}`,
			...Array.from(
				root.querySelectorAll("[data-demo-trigger], [data-demo-close]"),
				(node) => node.localName,
			),
		]);
		await Promise.all(
			[...tags].map((name) => customElements.whenDefined(name)),
		);
		const trigger = root.querySelector("[data-demo-trigger]");
		const status = root.querySelector("[data-demo-status]");
		const component = root.querySelector(`tp-${action}`);
		if (action === "counter") {
			let count = 0;
			trigger.addEventListener("click", () => {
				status.textContent = `Likes: ${++count}`;
			});
		} else if (action === "console") {
			component.log("Hello from tp-console!", { answer: 42 });
			component.warn("This is an example warning.");
		} else if (action === "file-tree") {
			component.setNodes([
				{
					kind: "directory",
					name: "project",
					path: "/project",
					children: [
						{
							kind: "file",
							name: "index.html",
							path: "/project/index.html",
							children: [],
						},
						{
							kind: "directory",
							name: "src",
							path: "/project/src",
							children: [
								{
									kind: "file",
									name: "main.js",
									path: "/project/src/main.js",
									children: [],
								},
							],
						},
					],
				},
			]);
			component.setOpenPaths(["/", "/project", "/project/src"]);
			component.addEventListener("tp-file-tree-select", (event) => {
				status.textContent = event.detail.path;
			});
		} else if (action === "filesystem") {
			component.setFiles([
				{ path: "/index.html", language: "html", content: "<h1>Hello!</h1>" },
				{
					path: "/tp-components/main.js",
					language: "javascript",
					content: 'console.log("Hello!");',
				},
			]);
			component.addEventListener("tp-filesystem-open", (event) => {
				status.textContent = event.detail.path;
			});
		} else if (action === "lang") {
			component.addEventListener("tp-lang-change", (event) => {
				root.querySelector("[data-demo-translation]").textContent =
					event.detail.lang.startsWith("fr")
						? "Bienvenue dans cet exemple."
						: "Welcome to this example.";
			});
		} else if (component && trigger) {
			const button = trigger.querySelector("button") ?? trigger;
			if (component.hasAttribute("anchor")) {
				button.id = `${trigger.id}-control`;
				component.setAttribute("anchor", `#${button.id}`);
			}
			if (action === "dialog") {
				const paragraph = document.createElement("p");
				paragraph.textContent =
					"Confirm this example action. No files will be changed.";
				component.setContent({
					title: "Confirm the example",
					body: [paragraph],
					confirmText: "Confirm",
					cancelText: "Cancel",
				});
				component.addEventListener("tp-dialog-close", (event) => {
					status.textContent = `Dialog result: ${event.detail.action}.`;
				});
			}
			if (action !== "tooltip" && action !== "contextmenu") {
				trigger.addEventListener("click", () => component.show());
			}
			root
				.querySelector("[data-demo-close]")
				?.addEventListener("click", () => component.hide());
		}
		root.dataset.introReady = "true";
	}
	for (const root of document.querySelectorAll("[data-intro-action]")) {
		void initialize(root);
	}
})();
