/** @module components/interpreter-question */
import { getCodeFromScript } from "../../utilities/code.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import { TpEditorQuestion } from "../editor-question/editor-question.js";
import type { TpFile } from "../filesystem/filesystem.types.js";
import type {
	TpExecutionDocument,
	TpPlayground,
} from "../playground/playground.js";
import type { TpProject } from "../playground/project.js";

/** Public operations shared by the six language interpreters. */
export interface QuestionInterpreter extends HTMLElement {
	src: string;
	value: string;
	query: string;
	filename: string;
	mode: "default" | "lite" | "simple";
	getSource(): Promise<string>;
	reset(): Promise<void>;
}
/**
 * Shares question submission and isolated test execution with programming questions.
 * @attr {string} src = "" - Program file or Markdown exercise defining Title, Prompt and Solution. JSON projects are not supported.
 */
export abstract class TpInterpreterQuestion<
	T extends QuestionInterpreter,
> extends TpEditorQuestion<T> {
	protected abstract readonly language: string;
	protected abstract createInterpreter(): T;
	protected abstract createTestRunner(): TpPlayground<TpProject>;
	protected readonly sourceLoadedEvent = "tp-interpreter-question-source-load";
	private interpreter: T | null = null;
	public static override get observedAttributes(): string[] {
		return [...TpEditorQuestion.observedAttributes, "query", "value"];
	}
	/** Initial query used to explore the program before submitting it. */
	public get query(): string {
		return this.getAttribute("query") ?? "";
	}
	public set query(value: string) {
		this.setAttribute("query", value);
	}
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		super.attributeChangedCallback(name, oldValue, newValue);
		if (this.interpreter && (name === "query" || name === "value"))
			this.interpreter.setAttribute(name, newValue ?? "");
	}
	protected override createEditor(): T {
		const control = this.createInterpreter();
		this.interpreter = control;
		control.mode = "simple";
		control.query = this.query;
		control.value =
			this.getAttribute("value") ??
			getCodeFromScript(this.language, this)?.value ??
			"";
		// The shared question assigns src after this factory returns.
		queueMicrotask(() => {
			void control
				.getSource()
				.then(() => {
					if (control === this.interpreter && control.isConnected)
						control.dispatchEvent(new Event(this.sourceLoadedEvent));
				})
				.catch((error: unknown) => {
					if (control !== this.interpreter || !control.isConnected) return;
					const message = document.createElement("p");
					message.setAttribute("role", "alert");
					message.textContent =
						error instanceof Error ? error.message : "Unable to load source.";
					control.after(message);
				});
		});
		return control;
	}
	protected override responseValue(control: T): unknown {
		return {
			source:
				control.querySelector<TpCodeEditor>("tp-code-editor")?.getValue() ??
				control.value,
			query:
				control.querySelector<{ value: string } & HTMLElement>("tp-textfield")
					?.value ?? control.query,
		};
	}
	/** Captures the edited program before fetching tests; the exploratory query is not the test suite. */
	protected override captureTests(
		control: T,
	): (file: TpFile) => Promise<TpExecutionDocument> {
		const source = control.getSource();
		// Retain rejection for the report without an unhandled rejection during the fetch.
		void source.catch(() => {});
		const filename = control.filename;
		return async (file) => this.buildSourceTests(await source, filename, file);
	}

	protected override async buildTests(
		control: T,
		file: TpFile,
	): Promise<TpExecutionDocument> {
		return this.buildSourceTests(
			await control.getSource(),
			control.filename,
			file,
		);
	}
	private async buildSourceTests(
		source: string,
		filename: string,
		file: TpFile,
	): Promise<TpExecutionDocument> {
		const runner = this.createTestRunner();
		const project = runner.getProject();
		project.entry = `/${filename}`;
		project.files = [
			{ path: project.entry, language: this.language, content: source },
		];
		runner.setProject(project);
		// Browser tests share the program's lexical scope without requiring module exports.
		const testFile =
			this.language === "javascript" || this.language === "typescript"
				? { ...file, content: `${source}\n\n${file.content}` }
				: file;
		return runner.createTestDocument(testFile);
	}
}
