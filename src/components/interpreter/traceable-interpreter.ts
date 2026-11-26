import { TpInterpreter } from "./interpreter.js";
import { InterpreterTraceController } from "./interpreter-trace-controller.js";

/** Optional trace drawer shared by interpreters with a matching recorder. */
export abstract class TpTraceableInterpreter extends TpInterpreter {
	private traceController?: InterpreterTraceController;
	private get controller(): InterpreterTraceController {
		this.traceController ??= new InterpreterTraceController(this, {
			language: this.language,
			languageName: this.languageName,
			loadTracer: () => this.loadTracer(),
			composeSource: (source, query) => this.composeTraceSource(source, query),
		});
		return this.traceController;
	}
	protected abstract loadTracer(): Promise<void>;

	/** Enables the trace command; absent by default. */
	get tracer(): boolean {
		return this.hasAttribute("tracer");
	}
	set tracer(value: boolean) {
		this.toggleAttribute("tracer", value);
	}
	static override get observedAttributes(): string[] {
		return [...TpInterpreter.observedAttributes, "tracer"];
	}
	protected override attributeChangedCallback(name: string): void {
		super.attributeChangedCallback(name);
		if (name === "tracer" || name === "mode")
			this.controller.updateTraceCommand();
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.controller.updateTraceCommand();
	}
	protected override disconnectedCallback(): void {
		this.traceController?.cancelTrace();
		super.disconnectedCallback();
	}
	protected composeTraceSource(source: string, query: string): string {
		return [source.trimEnd(), query.trim()].filter(Boolean).join("\n\n");
	}
	/** Records current source and query in a drawer initially 75% wide; requires tracer. */
	async openTrace(): Promise<void> {
		await this.controller.openTrace();
	}
}
