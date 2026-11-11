export function gameCommand(host: Element, id: string): void {
	const b = host.querySelector<HTMLElement>(`[data-game-command="${id}"]`);
	if (!b) throw new Error(`Missing game command: ${id}`);
	b.click();
}
export function gameHelpItem(host: Element, id: string): HTMLElement {
	if (host.querySelector(".tp-game-help")?.hasAttribute("open"))
		gameCommand(host, "help");
	gameCommand(host, "help");
	const item = Array.from(
		host.querySelectorAll<HTMLElement>("[data-game-help]"),
	).find((el) => el.dataset.gameHelp === id);
	if (!item) throw new Error(`Missing game help: ${id}`);
	return item;
}
export function gameHelp(host: Element, id: string): void {
	if (id === "reset-game") gameCommand(host, "reset");
	else gameHelpItem(host, id).click();
}
