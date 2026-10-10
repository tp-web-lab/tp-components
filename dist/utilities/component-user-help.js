//#region src/utilities/component-user-help.ts
function e(e, t) {
	return {
		displayName: e.match(/^#\s+(.+)$/m)?.[1]?.replace(/<tp-icon\b[^>]*>[\s\S]*?<\/tp-icon>/g, "").replace(/:tp-icon:\{[^}]*\}/g, "").replace(/[*`]/g, "").trim() ?? "",
		introduction: e.match(/^The custom[^\n]*(?:\n(?!\s*\n|## |<)[^\n]+)*/m)?.[0]?.trim() ?? "",
		interactions: e.match(/^### User interactions\s*\n([\s\S]*?)(?=^### Author directives|^## |$(?![\s\S]))/m)?.[1]?.trim() ?? "",
		keyboard: [...t.matchAll(/^\s*\*\s*@keyboard\s+\{([^}]+)\}\s+([^\n]+)/gm)].map((e) => ({
			key: e[1] ?? "",
			description: e[2]?.trim() ?? ""
		}))
	};
}
//#endregion
export { e as extractComponentUserHelp };

//# sourceMappingURL=component-user-help.js.map