import { getCodeFromFile, getCodeFromScript } from "../../utilities/code.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";

/** Shared source loading for interactive language sessions. */
export async function readInterpreterSource(
	host: HTMLElement,
	language: string,
): Promise<string> {
	const src = host.getAttribute("src")?.trim();
	if (src)
		return (
			await getCodeFromFile(resolveComponentSourceUrl(host, src).href, language)
		).value;
	return (
		host.getAttribute("value") ?? getCodeFromScript(language, host)?.value ?? ""
	);
}
