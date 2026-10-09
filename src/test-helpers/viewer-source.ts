import { expect, vi } from "vitest";

/** Opens the source pane as a user would before testing its editable contents. */
export async function openViewerSource(root: ParentNode): Promise<void> {
	await vi.waitFor(() => {
		const buttons = root.querySelectorAll<HTMLElement>(
			'[data-role="toggle-source"]',
		);
		expect(buttons.length).toBeGreaterThan(0);
		for (const button of buttons) {
			if (button.getAttribute("aria-pressed") !== "true") button.click();
		}
		expect(
			root.querySelector('[data-role="source"] tp-code-editor'),
		).not.toBeNull();
	});
}
