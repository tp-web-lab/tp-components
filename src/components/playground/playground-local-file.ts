/**
 * @module components/playground/playground-local-file
 * @summary Helper for choosing local files in the playground.
 */

/** Opens a local text file without requiring the File System Access API. 
 * @param host The host element to attach the file input to.
 * @param accept The accepted file types (e.g., "text/plain").
 * @param signal An AbortSignal to cancel the file selection.
 * @returns A promise that resolves with the selected file or null if canceled.
 */
export function choosePlaygroundFile(
	host: HTMLElement,
	accept: string,
	signal: AbortSignal,
): Promise<File | null> {
	if (signal.aborted) return Promise.resolve(null);
	return new Promise((resolve) => {
		const input = host.ownerDocument.createElement("input");
		input.type = "file";
		input.accept = accept;
		input.hidden = true;
		input.setAttribute("data-tp-playground-file-input", "");
		const finish = (file: File | null) => {
			input.remove();
			signal.removeEventListener("abort", cancel);
			resolve(file);
		};
		const cancel = () => finish(null);
		input.addEventListener("change", () => finish(input.files?.[0] ?? null), {
			once: true,
		});
		input.addEventListener("cancel", cancel, { once: true });
		signal.addEventListener("abort", cancel, { once: true });
		host.append(input);
		input.click();
	});
}
