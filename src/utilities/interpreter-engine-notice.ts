/** Engine banners are announced once per language in each page document. */
const announced = new WeakMap<Document, Set<string>>();

export function claimInterpreterEngineNotice(
	host: HTMLElement,
	language: string,
): boolean {
	let languages = announced.get(host.ownerDocument);
	if (!languages) {
		languages = new Set<string>();
		announced.set(host.ownerDocument, languages);
	}
	if (languages.has(language)) return false;
	languages.add(language);
	return true;
}
