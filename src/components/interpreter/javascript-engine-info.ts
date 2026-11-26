/** Informational browser identification only; never used to select execution behavior. */
export function javascriptEngineDescription(
	userAgent = navigator.userAgent,
): string {
	const browsers: readonly [string, RegExp][] = [
		["Edge", /(?:Edg|EdgA|EdgiOS)\/([\d.]+)/],
		["Opera", /(?:OPR|OPiOS)\/([\d.]+)/],
		["Firefox", /(?:Firefox|FxiOS)\/([\d.]+)/],
		["Chrome", /(?:HeadlessChrome|Chrome|CriOS)\/([\d.]+)/],
		["Safari", /Version\/([\d.]+).*Safari\//],
	];
	for (const [name, pattern] of browsers) {
		const version = pattern.exec(userAgent)?.[1];
		if (version) return `JavaScript · Browser: ${name} ${version}`;
	}
	return "JavaScript · Browser version unavailable";
}
