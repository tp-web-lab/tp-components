/** Defers expensive rendering until its panel is exposed and near the viewport. */
export class DeferredVisibility {
	private observer: MutationObserver | null = null;
	private revision = 0;
	private intersection: IntersectionObserver | null = null;
	private approached = false;

	constructor(
		private readonly host: HTMLElement,
		private readonly resume: () => void,
	) {}

	defer(): boolean {
		this.disconnect();
		const revision = this.revision;
		if (this.host.closest("tp-tabs:not(:defined)")) {
			void customElements.whenDefined("tp-tabs").then(() => {
				if (this.host.isConnected && revision === this.revision) this.resume();
			});
			return true;
		}
		const hidden = this.host.closest("[hidden]");
		if (!hidden) {
			if (this.approached || typeof IntersectionObserver === "undefined")
				return false;
			const rect = this.host.getBoundingClientRect();
			if (rect.top <= window.innerHeight + 600 && rect.bottom >= -600) {
				this.approached = true;
				return false;
			}
			this.intersection = new IntersectionObserver(
				(entries) => {
					if (revision !== this.revision || !this.host.isConnected) return;
					if (entries.some((entry) => entry.isIntersecting)) {
						this.approached = true;
						this.resume();
					}
				},
				{ rootMargin: "600px" },
			);
			this.intersection.observe(this.host);
			return true;
		}
		this.observer = new MutationObserver(() => {
			if (!hidden.hasAttribute("hidden") && this.host.isConnected)
				this.resume();
		});
		this.observer.observe(hidden, {
			attributes: true,
			attributeFilter: ["hidden"],
		});
		return true;
	}

	disconnect(): void {
		this.revision++;
		this.intersection?.disconnect();
		this.intersection = null;
		this.observer?.disconnect();
		this.observer = null;
	}
}
