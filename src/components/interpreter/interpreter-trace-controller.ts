import type { TpDrawer } from "../drawer/drawer.js";
import type { TpTextfield } from "../textfield/textfield.js";

interface ExecutionTracer extends HTMLElement {
	filename: string;
	query?: string;
	value: string;
	refresh(): Promise<void>;
	record(): void;
	stop(): void;
}

interface TraceHost extends HTMLElement {
	tracer: boolean;
	mode: string;
	filename: string;
	query: string;
	getSource(): Promise<string>;
}
/** Shared optional drawer for interpreters, including Prolog's independent session UI. */
export class InterpreterTraceController {
	private traceDrawer?: TpDrawer;
	private executionTrace?: ExecutionTracer;
	private traceRequest = 0;
	constructor(
		private readonly host: TraceHost,
		private readonly options: {
			language: string;
			languageName: string;
			loadTracer(): Promise<void>;
			composeSource(source: string, query: string): string;
		},
	) {}
	private get traceButton(): Element | null {
		return this.host.querySelector(
			':scope > .tp-interpreter-panel > .tp-interpreter-toolbar [data-command="trace"], :scope > .tp-interpreter-panel > .tp-interpreter-prompt > [data-command="trace"]',
		);
	}
	cancelTrace(): void {
		++this.traceRequest;
		this.traceButton?.removeAttribute("disabled");
		this.executionTrace?.stop();
		this.traceDrawer?.remove();
		this.executionTrace = undefined;
		this.traceDrawer = undefined;
	}
	updateTraceCommand(): void {
		if (!this.host.tracer) {
			this.cancelTrace();
			this.traceButton?.remove();
			return;
		}
		if (!this.host.isConnected) return;
		const divider = this.host.querySelector(
			":scope > .tp-interpreter-panel > .tp-interpreter-toolbar [data-document-navbar-divider]",
		);
		if (!divider) return;
		const existing = this.traceButton;
		if (existing) {
			this.placeTraceButton(existing, divider);
			return;
		}
		const button = document.createElement("tp-icon-button");
		button.setAttribute("name", `${this.options.language}-tracer`);
		button.setAttribute("library", "components");
		button.setAttribute("label", "Trace execution");
		button.setAttribute("section", "end");
		button.setAttribute("data-command", "trace");
		button.addEventListener("click", () => void this.openTrace());
		this.placeTraceButton(button, divider);
	}
	private placeTraceButton(button: Element, divider: Element): void {
		if (this.host.mode === "simple") {
			this.host
				.querySelector(
					":scope > .tp-interpreter-panel > .tp-interpreter-prompt",
				)
				?.append(button);
		} else divider.before(button);
	}

	/** Records current source and query in a drawer initially 75% wide; requires tracer. */
	async openTrace(): Promise<void> {
		if (!this.host.tracer || !this.host.isConnected) return;
		const request = ++this.traceRequest,
			button = this.traceButton;
		button?.setAttribute("disabled", "");
		const current = () =>
			this.host.tracer &&
			this.host.isConnected &&
			request === this.traceRequest;
		try {
			const source = await this.host.getSource();
			if (!current()) return;
			const query =
				this.host.querySelector<TpTextfield>(
					":scope > .tp-interpreter-panel > .tp-interpreter-prompt > tp-textfield",
				)?.value ?? this.host.query;
			const [{ TpDrawer }] = await Promise.all([
				import("../drawer/drawer.js"),
				this.options.loadTracer(),
			]);
			if (!current()) return;
			if (!this.traceDrawer) {
				const drawer = new TpDrawer();
				this.traceDrawer = drawer;
				drawer.setAttribute("width", "75%");
				drawer.setAttribute("placement", "end");
				drawer.setAttribute("backdrop", "");
				drawer.setAttribute(
					"label",
					`${this.options.languageName} execution trace`,
				);
				drawer.setAttribute(`data-${this.options.language}-tracer-drawer`, "");
				drawer.setAttribute("data-tp-generated", "");
				drawer.addEventListener("tp-drawer-toggle", () => {
					if (!drawer.open) this.executionTrace?.stop();
				});
				this.host.append(drawer);
			}
			this.executionTrace?.stop();
			const trace = document.createElement(
				`tp-${this.options.language}-tracer`,
			) as ExecutionTracer;
			trace.filename = this.host.filename;
			trace.value = this.options.composeSource(source, query);
			if (["scheme", "prolog"].includes(this.options.language)) {
				trace.value = source;
				trace.query =
					this.options.language === "prolog"
						? query.trim().replace(/^\?-\s*/, "")
						: query.trim();
			}
			this.executionTrace = trace;
			this.traceDrawer.setContent(trace);
			this.traceDrawer.show();
			await trace.refresh();
			if (current() && this.traceDrawer?.open) trace.record();
		} catch (error) {
			if (current())
				this.host
					.querySelector(
						":scope > .tp-interpreter-panel > .tp-interpreter-output",
					)
					?.append(
						document.createTextNode(
							`Trace error: ${error instanceof Error ? error.message : String(error)}\n`,
						),
					);
		} finally {
			if (current()) button?.removeAttribute("disabled");
		}
	}
}
