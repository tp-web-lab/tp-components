/** Targeted component imports, without document observers or startup side effects. */
const TP_TAG_PREFIX = "tp-";
const loadedModules = new Set<string>();
const failedModules = new Set<string>();
const loadingModules = new Map<string, Promise<void>>();

function getComponentBaseName(tagName: string): string | null {
	const normalizedTagName = tagName.toLowerCase();

	if (!/^tp-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedTagName)) {
		return null;
	}

	return normalizedTagName.slice(TP_TAG_PREFIX.length);
}

export function getTpComponentModuleUrl(
	baseName: string,
	moduleUrl = import.meta.url,
): string {
	const originUrl = new URL(moduleUrl);
	const isSourceModule = originUrl.pathname.endsWith(".ts");
	const extension = isSourceModule ? "ts" : "js";
	const componentRoot = "../components";
	const modulePath = [componentRoot, baseName, `${baseName}.${extension}`].join(
		"/",
	);

	return new URL(modulePath, moduleUrl).href;
}

function isInternalTpTag(baseName: string): boolean {
	return baseName === "loader" || baseName.endsWith("-backdrop");
}

export async function importTpComponent(tagName: string): Promise<void> {
	const normalizedTagName = tagName.toLowerCase();
	const baseName = getComponentBaseName(normalizedTagName);

	if (baseName === null || isInternalTpTag(baseName)) {
		return;
	}

	if (customElements.get(normalizedTagName) !== undefined) {
		return;
	}

	const moduleUrl = getTpComponentModuleUrl(baseName);

	if (loadedModules.has(moduleUrl) || failedModules.has(moduleUrl)) {
		return;
	}

	const pendingLoad = loadingModules.get(moduleUrl);

	if (pendingLoad !== undefined) {
		await pendingLoad;
		return;
	}

	const loadPromise = import(/* @vite-ignore */ moduleUrl)
		.then(() => {
			loadedModules.add(moduleUrl);
			console.info(
				`[tp-components] loaded <${normalizedTagName}> from ${moduleUrl}`,
			);
		})
		.catch((error: unknown) => {
			failedModules.add(moduleUrl);
			console.warn(
				`[tp-components] skipped <${normalizedTagName}> from ${moduleUrl}`,
				error,
			);
		})
		.finally(() => {
			loadingModules.delete(moduleUrl);
		});

	loadingModules.set(moduleUrl, loadPromise);
	await loadPromise;
}

export function collectTpComponentTags(root: ParentNode): Set<string> {
	const isImportable = (element: Element): boolean => {
		const baseName = getComponentBaseName(element.localName);
		return (
			baseName !== null &&
			!isInternalTpTag(baseName) &&
			!element.hasAttribute("data-tp-editor-pending")
		);
	};
	const tagNames = new Set<string>();

	if (root instanceof Element && isImportable(root)) {
		tagNames.add(root.localName);
	}

	for (const element of root.querySelectorAll("*")) {
		if (isImportable(element)) {
			tagNames.add(element.localName);
		}
	}

	return tagNames;
}

/** Import only the components requested by this root, leaving the rest of the page alone. */
export async function importTpComponentsIn(
	root: ParentNode,
	importer: (tag: string) => Promise<void> = importTpComponent,
): Promise<void> {
	await Promise.all([...collectTpComponentTags(root)].map(importer));
}
