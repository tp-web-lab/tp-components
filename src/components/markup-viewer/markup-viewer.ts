/**
 * @module components/markup-viewer
 * @summary Shared foundation for interactive markup viewers.
 */

import { IframeOverlayBridge } from "../../utilities/iframe-overlay-bridge.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import "../code-editor/code-editor.js";
import "../divider/divider.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../switcher/switcher.js";
import style from "./markup-viewer.css?inline";
import { sharedViewerExample, shareViewerExample } from "./shared-example.js";

/** Pane layouts supported by every markup viewer. */
export type MarkupViewerLayout = "both" | "source" | "output";

/** Description of an output mode exposed by a markup viewer. */
export interface MarkupViewerMode<TMode extends string> {
	/** Stable value used by the mode selector. */
	value: TMode;
	/** Human-readable selector label. */
	label: string;
}

/** One named source example and its language-specific rendering context. */
export interface MarkupViewerExample<TContext = undefined> {
	label: string;
	source: string;
	context: TContext;
}

const STYLE_ID = "tp-markup-viewer-styles";
const fullscreenObservedDocuments = new WeakSet<Document>();

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function basename(pathname: string): string {
	const cleaned = pathname.trim().replace(/\/+$/, "");
	if (cleaned === "") return "Example";
	return cleaned.split("/").at(-1) ?? "Example";
}

function languageLabel(language: string): string {
	switch (language.toLowerCase()) {
		case "html":
			return "HTML";
		case "markdown":
			return "Markdown";
		case "asciidoc":
			return "AsciiDoc";
		case "restructuredtext":
			return "reStructuredText";
		default:
			return language;
	}
}

function resyncEditorHeight(editor: TpCodeEditor): void {
	editor.syncHeightToContent();
	queueMicrotask(() => editor.syncHeightToContent());
	requestAnimationFrame(() => editor.syncHeightToContent());
	setTimeout(() => editor.syncHeightToContent(), 0);
}

function measureIframeContentHeight(iframe: HTMLIFrameElement): number {
	const documentNode = iframe.contentDocument;
	if (
		documentNode === null ||
		documentNode.body === null ||
		documentNode.documentElement === null
	)
		return 0;

	// Measure the complete rendered subtree, not only direct body children.
	// A custom-element host can remain inline or report a smaller box while its
	// internal controls extend below it; measuring descendants prevents clipping.
	const renderedContentHeight = Array.from(
		documentNode.body.querySelectorAll("*"),
	).reduce((height, element) => {
		const rect = element.getBoundingClientRect();
		const elementStyle = documentNode.defaultView?.getComputedStyle(element);
		if (
			elementStyle?.display === "none" ||
			elementStyle?.position === "absolute" ||
			elementStyle?.position === "fixed"
		)
			return height;
		const marginBottom =
			elementStyle === undefined
				? 0
				: Number.parseFloat(elementStyle.marginBottom) || 0;
		let visibleTop = rect.top;
		let visibleBottom = rect.bottom + marginBottom;
		// Transformed descendants (for example Leaflet's SVG paths) can extend
		// far outside a fixed-size viewport. Their clipped geometry is not page
		// content and must not enlarge the iframe. Keep measuring genuinely
		// visible overflow, such as controls extending below an inline host.
		for (
			let ancestor = element.parentElement;
			ancestor &&
			ancestor !== documentNode.body &&
			ancestor !== documentNode.documentElement;
			ancestor = ancestor.parentElement
		) {
			// Closed details retain layout boxes for their skipped contents in
			// browsers. Only the first summary participates in visible layout.
			if (ancestor.localName === "details" && !ancestor.hasAttribute("open")) {
				const summary = Array.from(ancestor.children).find(
					(child) => child.localName === "summary",
				);
				if (!summary?.contains(element)) return height;
			}
			const ancestorStyle =
				documentNode.defaultView?.getComputedStyle(ancestor);
			// An overlay's descendants are out of document flow too. In
			// particular, a fixed drawer follows the iframe viewport height;
			// counting its children would grow that viewport on every resize.
			if (
				ancestorStyle?.display === "none" ||
				ancestorStyle?.position === "fixed" ||
				ancestorStyle?.position === "absolute"
			)
				return height;
			const overflow = ancestorStyle?.overflowY || ancestorStyle?.overflow;
			if (overflow && ["hidden", "clip", "auto", "scroll"].includes(overflow)) {
				const bounds = ancestor.getBoundingClientRect();
				visibleTop = Math.max(visibleTop, bounds.top);
				visibleBottom = Math.min(visibleBottom, bounds.bottom);
				if (visibleBottom <= visibleTop) return height;
			}
		}
		return Math.max(height, visibleBottom);
	}, 0);
	const bodyStyle = documentNode.defaultView?.getComputedStyle(
		documentNode.body,
	);
	const bodyPadding =
		(bodyStyle === undefined
			? 0
			: Number.parseFloat(bodyStyle.paddingTop) || 0) +
		(bodyStyle === undefined
			? 0
			: Number.parseFloat(bodyStyle.paddingBottom) || 0);
	const height =
		renderedContentHeight > 0
			? renderedContentHeight + bodyPadding
			: documentNode.body.getBoundingClientRect().height + bodyPadding;

	return Math.ceil(height);
}

function syncIframeHeight(iframe: HTMLIFrameElement): void {
	if (iframe.hasAttribute("popover")) return;
	const height = measureIframeContentHeight(iframe);
	const nextHeight = height > 0 ? `${String(height)}px` : "";
	if (iframe.style.height === nextHeight) return;
	if (nextHeight !== "") iframe.style.height = nextHeight;
	else iframe.style.removeProperty("height");
}

function resyncIframeHeight(iframe: HTMLIFrameElement): void {
	const sync = (): void => {
		if (iframe.isConnected) syncIframeHeight(iframe);
	};
	sync();
	queueMicrotask(sync);
	requestAnimationFrame(sync);
	setTimeout(sync, 0);
	setTimeout(sync, 100);
}

/**
 * Abstract base class for interactive source/output markup viewers.
 *
 * It owns the common user interface and editing workflow. Concrete viewers
 * provide language-specific source extraction, example discovery, and output
 * rendering.
 *
 * @summary Shared implementation for markup viewer components.
 */
export abstract class TpMarkupViewer<
	TMode extends string,
	TContext = undefined,
> extends TpBase {
	private renderToken = 0;
	/** Current source editor, including while its pane is hidden. */
	private responseEditor: TpCodeEditor | null = null;
	/** Renders a snapshot without changing the visible preview. */
	private renderResponse: (() => Promise<string>) | null = null;
	/** Restores the selected example's initial source. */
	private resetResponse: (() => void) | null = null;

	/** Returns the current editable source, including unsaved preview changes. */
	public getValue(): string {
		return this.responseEditor?.getValue() ?? "";
	}
	/** Restores the selected example and refreshes its preview. */
	public reset(): void {
		this.resetResponse?.();
	}
	/** Creates an independent HTML document from the current source for testing. */
	public async createRenderedDocument(): Promise<string> {
		if (!this.renderResponse) throw new Error("Wait for the source to load.");
		return this.renderResponse();
	}
	private iframeMutationObserver: MutationObserver | null = null;
	private iframeResizeObserver: ResizeObserver | null = null;
	private iframeVisibilityObserver:
		| MutationObserver
		| IntersectionObserver
		| null = null;
	private iframeOverlayBridge: IframeOverlayBridge | null = null;
	private iframeSyncFrame: number | null = null;

	/** Code editor language used for the source pane. */
	protected abstract readonly sourceLanguage: string;

	/** Output modes offered by the viewer. The first mode is selected initially. */
	protected abstract readonly outputModes: readonly MarkupViewerMode<TMode>[];

	/** CSS class added to the concrete viewer host. */
	protected abstract readonly viewerClassName: string;

	/** Whether initial source capture must wait for nested elements to initialize. */
	protected readonly deferInitialRender: boolean = false;

	public static override get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "lite", "src"];
	}

	/** Uses the compact, single-example viewer interface. */
	public get lite(): boolean {
		return this.hasAttribute("lite");
	}

	public set lite(value: boolean) {
		this.toggleAttribute("lite", value);
	}

	/** URL or comma-separated URLs of external source examples. */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}

	public set src(value: string) {
		if (value.trim() === "") {
			this.removeAttribute("src");
			return;
		}
		this.setAttribute("src", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.classList.add("tp-markup-viewer", this.viewerClassName);
		this.ensureGlobalStyle(STYLE_ID, style);
		if (this.deferInitialRender) {
			setTimeout(() => this.requestViewerRender(), 0);
		} else {
			void this.renderViewer();
		}
	}

	protected override attributeChangedCallback(): void {
		if (this.isConnected) void this.renderViewer();
	}

	/** Reads and normalizes source declared inside the component. */
	protected abstract readInlineSource():
		| Promise<MarkupViewerExample<TContext>>
		| MarkupViewerExample<TContext>;

	/**
	 * Extracts named examples from one source document.
	 *
	 * The default implementation treats the document as a single example.
	 */
	protected extractExamples(
		example: MarkupViewerExample<TContext>,
	): MarkupViewerExample<TContext>[] {
		return [example];
	}

	/** Creates context associated with an externally loaded source file. */
	protected abstract createExternalContext(
		url: URL,
	): Promise<TContext> | TContext;

	/** Renders one output mode into the output panel. */
	protected abstract renderOutput(
		source: string,
		mode: TMode,
		container: HTMLElement,
		context: TContext,
	): Promise<void>;

	/** Called when the viewer is disconnected, for language-specific cleanup. */
	protected disposeViewer(): void {}

	/** Synchronizes a code editor height after DOM and layout updates. */
	protected resyncEditorHeight(editor: TpCodeEditor): void {
		resyncEditorHeight(editor);
	}

	/** Returns the source used by Reset for an initialized example. */
	protected getResetSource(example: MarkupViewerExample<TContext>): string {
		return example.source;
	}

	/** Requests a complete reload after programmatic source changes. */
	protected requestViewerRender(): void {
		if (this.isConnected) void this.renderViewer();
	}

	protected disconnectedCallback(): void {
		this.renderToken += 1;
		this.disconnectIframeResizeObserver();
		this.disposeViewer();
	}

	private async renderViewer(): Promise<void> {
		const token = ++this.renderToken;
		this.responseEditor = null;
		this.renderResponse = null;
		this.resetResponse = null;

		try {
			const loadedExamples = await this.loadExamples();
			if (token !== this.renderToken) return;

			const examples = this.lite ? loadedExamples.slice(0, 1) : loadedExamples;

			const sharedLabel = sharedViewerExample(
				this,
				examples.map((example) => example.label),
			);
			let currentExample =
				examples.find((example) => example.label === sharedLabel) ??
				examples[0] ??
				(await this.readInlineSource());
			const initialSourceByLabel = new Map(
				examples.map((example) => [
					example.label,
					this.getResetSource(example),
				]),
			);
			const initialMode = this.outputModes[0];
			if (initialMode === undefined) {
				throw new Error(
					"A markup viewer must define at least one output mode.",
				);
			}

			this.dataset.layout = "output";
			this.innerHTML = this.createViewerMarkup(initialMode.value);

			const startControls = this.querySelector<HTMLElement>(
				'[data-role="start-controls"]',
			);
			const sourceContainer = this.querySelector<HTMLElement>(
				'[data-role="source"]',
			);
			const outputContainer = this.querySelector<HTMLElement>(
				'[data-role="output"]',
			);
			const sourceButton = this.querySelector<HTMLElement>(
				'[data-role="toggle-source"]',
			);
			const outputButton = this.querySelector<HTMLElement>(
				'[data-role="toggle-output"]',
			);
			const outputActions = this.querySelector<HTMLElement>(
				'[data-role="output-actions"]',
			);
			const modeButtons = Array.from(
				this.querySelectorAll<HTMLElement>('[data-role="output-mode"]'),
			);
			const editorToolbarButton = this.querySelector<HTMLElement>(
				'[data-role="toggle-editor-toolbar"]',
			);
			const editorActions = this.querySelector<HTMLElement>(
				'[data-role="editor-actions"]',
			);
			const runButton = this.querySelector<HTMLElement>('[data-role="run"]');
			const resetButton = this.querySelector<HTMLElement>(
				'[data-role="reset"]',
			);
			if (
				startControls === null ||
				sourceContainer === null ||
				outputContainer === null ||
				runButton === null ||
				resetButton === null ||
				sourceButton === null ||
				outputButton === null
			)
				return;

			let currentMode = initialMode.value;

			const editor = document.createElement("tp-code-editor") as TpCodeEditor;
			editor.language = this.sourceLanguage;
			editor.lineNumbers = false;
			editor.wordWrap = true;
			editor.readonly = false;
			editor.setValue(currentExample.source);
			this.responseEditor = editor;
			this.renderResponse = async () => {
				const container = document.createElement("div");
				await this.renderOutput(
					editor.getValue(),
					initialMode.value,
					container,
					currentExample.context,
				);
				return container.querySelector("iframe")?.srcdoc ?? container.innerHTML;
			};

			const syncSourceEditor = (): void => {
				if (this.dataset.layout === "output") {
					editor.remove();
					return;
				}
				if (editor.parentElement !== sourceContainer)
					sourceContainer.replaceChildren(editor);
				resyncEditorHeight(editor);
			};
			const updateLayout = (): void => {
				const showSource =
					sourceButton?.getAttribute("aria-pressed") === "true";
				const showOutput =
					outputButton?.getAttribute("aria-pressed") !== "false";
				this.dataset.layout =
					showSource && showOutput ? "both" : showSource ? "source" : "output";
				editorActions?.toggleAttribute("hidden", !showSource);
				outputActions?.toggleAttribute("hidden", !showOutput);
				syncSourceEditor();
				queueMicrotask(syncEditorToolbarControl);
			};
			const updateOutput = async (): Promise<void> => {
				this.disconnectIframeResizeObserver();
				const mode = this.lite ? initialMode.value : currentMode;
				await this.renderOutput(
					currentExample.source,
					mode,
					outputContainer,
					currentExample.context,
				);
				this.activateOutputScripts(outputContainer);
				this.initializeOutputIframe(outputContainer);
				syncEditorToolbarControl();
			};
			const visibleEditors = (): TpCodeEditor[] =>
				Array.from(
					this.querySelectorAll<TpCodeEditor>("tp-code-editor"),
				).filter((candidate) =>
					candidate === editor
						? this.dataset.layout !== "output"
						: this.dataset.layout !== "source",
				);
			const syncEditorToolbarControl = (): void => {
				const editors = visibleEditors();
				editorToolbarButton?.toggleAttribute("hidden", editors.length === 0);
				editorToolbarButton?.setAttribute(
					"aria-pressed",
					String(editors.some((candidate) => candidate.toolbar)),
				);
			};
			const update = async (): Promise<void> => {
				updateLayout();
				await updateOutput();
			};

			if (examples.length > 1) {
				const exampleSelect = document.createElement("select");
				exampleSelect.setAttribute("aria-label", "Example");
				for (const example of examples) {
					const option = document.createElement("option");
					option.value = example.label;
					option.textContent = example.label;
					exampleSelect.append(option);
				}
				exampleSelect.value = currentExample.label;
				const label = document.createElement("label");
				label.append(exampleSelect);
				startControls.append(label);
				exampleSelect.addEventListener("change", () => {
					const selected = examples.find(
						(example) => example.label === exampleSelect.value,
					);
					if (selected === undefined) return;
					shareViewerExample(this, exampleSelect);
					currentExample = { ...selected };
					editor.setValue(currentExample.source);
					void update();
				});
			}

			for (const button of modeButtons) {
				button.addEventListener("click", () => {
					currentMode = this.readMode(
						button.dataset.mode ?? "",
						initialMode.value,
					);
					for (const candidate of modeButtons) {
						candidate.setAttribute(
							"aria-pressed",
							String(candidate === button),
						);
					}
					void updateOutput();
				});
			}
			const togglePane = (
				button: HTMLElement,
				otherButton: HTMLElement,
			): void => {
				const pressed = button.getAttribute("aria-pressed") === "true";
				if (pressed && otherButton.getAttribute("aria-pressed") !== "true")
					return;
				button.setAttribute("aria-pressed", String(!pressed));
				updateLayout();
			};
			if (sourceButton !== null && outputButton !== null) {
				sourceButton.addEventListener("click", () =>
					togglePane(sourceButton, outputButton),
				);
				outputButton.addEventListener("click", () =>
					togglePane(outputButton, sourceButton),
				);
			}
			editorToolbarButton?.addEventListener("click", () => {
				const editors = visibleEditors();
				const next = !editors.some((candidate) => candidate.toolbar);
				for (const candidate of editors) {
					candidate.toolbar = next;
				}
				syncEditorToolbarControl();
			});
			runButton.addEventListener("click", () => {
				currentExample.source = editor.getValue();
				void updateOutput();
			});
			this.resetResponse = () => {
				currentExample.source =
					initialSourceByLabel.get(currentExample.label) ?? "";
				editor.setValue(currentExample.source);
				void update();
			};
			resetButton.addEventListener("click", () => this.reset());

			await update();
			if (token === this.renderToken)
				this.dispatchEvent(new CustomEvent("tp-markup-viewer-src-load"));
		} catch (error) {
			if (token !== this.renderToken) return;
			const message = error instanceof Error ? error.message : String(error);
			this.innerHTML = `<pre class="tp-markup-viewer-error"><code>${escapeHtml(message)}</code></pre>`;
		}
	}

	/**
	 * Recreates rendered scripts so the browser executes them when explicitly
	 * allowed. Scripts produced through `innerHTML` are otherwise inert.
	 */
	private activateOutputScripts(container: HTMLElement): void {
		if (!this.hasAttribute("allow-script")) return;

		for (const source of Array.from(container.querySelectorAll("script"))) {
			const script = document.createElement("script");
			for (const attribute of Array.from(source.attributes)) {
				script.setAttribute(attribute.name, attribute.value);
			}
			script.textContent = source.textContent;
			source.replaceWith(script);
		}
	}

	private initializeOutputIframe(container: HTMLElement): void {
		const iframe = container.querySelector(":scope > iframe");
		if (!(iframe instanceof HTMLIFrameElement)) return;

		const deferredDocument = iframe.srcdoc;
		let waitingForVisibility = false;
		const hiddenAncestor = iframe.closest<HTMLElement>("[hidden]");

		const initialize = (): void => {
			if (waitingForVisibility) return;
			const documentNode = iframe.contentDocument;
			if (documentNode !== null) {
				this.ensureBaseStyles(documentNode);
				if (
					typeof documentNode.addEventListener === "function" &&
					!fullscreenObservedDocuments.has(documentNode)
				) {
					fullscreenObservedDocuments.add(documentNode);
					documentNode.addEventListener("fullscreenchange", () => {
						if (documentNode.fullscreenElement !== null) return;
						iframe.style.removeProperty("height");
						requestAnimationFrame(() => {
							requestAnimationFrame(() => {
								if (iframe.isConnected) syncIframeHeight(iframe);
							});
						});
					});
				}
			}
			resyncIframeHeight(iframe);
			this.observeIframeDocument(iframe);
			this.iframeOverlayBridge?.disconnect();
			this.iframeOverlayBridge = new IframeOverlayBridge(iframe);
			this.iframeOverlayBridge.connect();
		};
		iframe.addEventListener("load", initialize);

		if (
			deferredDocument !== "" &&
			iframe.getClientRects().length === 0 &&
			(hiddenAncestor !== null || typeof IntersectionObserver !== "undefined")
		) {
			waitingForVisibility = true;
			iframe.removeAttribute("srcdoc");
			const show = (): void => {
				this.iframeVisibilityObserver?.disconnect();
				this.iframeVisibilityObserver = null;
				waitingForVisibility = false;
				iframe.srcdoc = deferredDocument;
			};
			if (hiddenAncestor !== null) {
				this.iframeVisibilityObserver = new MutationObserver(() => {
					if (!hiddenAncestor.hidden) show();
				});
				this.iframeVisibilityObserver.observe(hiddenAncestor, {
					attributeFilter: ["hidden"],
					attributes: true,
				});
			} else {
				this.iframeVisibilityObserver = new IntersectionObserver((entries) => {
					if (entries.some((entry) => entry.isIntersecting)) show();
				});
				this.iframeVisibilityObserver.observe(iframe);
			}
			return;
		}

		initialize();
	}

	private observeIframeDocument(iframe: HTMLIFrameElement): void {
		this.disconnectIframeResizeObserver();
		const documentNode = iframe.contentDocument;
		const ElementConstructor = documentNode?.defaultView?.Element;
		if (
			documentNode === null ||
			documentNode.body === null ||
			documentNode.documentElement === null ||
			ElementConstructor === undefined
		)
			return;

		const synchronizeCustomElements = (root: ParentNode): void => {
			const registry = documentNode.defaultView?.customElements;
			if (registry === undefined) return;
			const tags = new Set(
				Array.from(root.querySelectorAll("*"))
					.map((element) => element.localName)
					.filter((tagName) => tagName.includes("-")),
			);
			for (const tagName of tags) {
				void registry
					.whenDefined(tagName)
					.then(() => resyncIframeHeight(iframe));
			}
		};

		synchronizeCustomElements(documentNode);
		this.iframeMutationObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of Array.from(mutation.addedNodes)) {
					if (node instanceof ElementConstructor) {
						synchronizeCustomElements(node);
					}
				}
			}
			this.scheduleIframeHeightSync(iframe);
		});
		this.iframeMutationObserver.observe(documentNode.body, {
			attributes: true,
			characterData: true,
			childList: true,
			subtree: true,
		});

		if (typeof ResizeObserver !== "undefined") {
			this.iframeResizeObserver = new ResizeObserver(() => {
				this.scheduleIframeHeightSync(iframe);
			});
			this.iframeResizeObserver.observe(documentNode.body);
		}
	}

	private scheduleIframeHeightSync(iframe: HTMLIFrameElement): void {
		if (this.iframeSyncFrame !== null) return;
		this.iframeSyncFrame = requestAnimationFrame(() => {
			this.iframeSyncFrame = null;
			if (iframe.isConnected) syncIframeHeight(iframe);
		});
	}

	private disconnectIframeResizeObserver(): void {
		if (this.iframeSyncFrame !== null)
			cancelAnimationFrame(this.iframeSyncFrame);
		this.iframeSyncFrame = null;
		this.iframeMutationObserver?.disconnect();
		this.iframeMutationObserver = null;
		this.iframeResizeObserver?.disconnect();
		this.iframeResizeObserver = null;
		this.iframeVisibilityObserver?.disconnect();
		this.iframeVisibilityObserver = null;
		this.iframeOverlayBridge?.disconnect();
		this.iframeOverlayBridge = null;
	}

	private createViewerMarkup(initialMode: TMode): string {
		const prefix = escapeHtml(this.viewerClassName);
		// A demo or subclass tag still uses its canonical viewer's component icon.
		const iconName = escapeHtml(this.viewerClassName.replace(/^tp-/, ""));
		if (this.lite) {
			return `
        <div class="tp-markup-viewer-lite-toolbar ${prefix}-toolbar" role="toolbar" aria-label="Viewer controls">
          <span class="tp-markup-viewer-toolbar-start">
            <tp-icon class="tp-markup-viewer-language" library="components" name="${iconName}" size="1.5em" role="img" aria-label="${escapeHtml(languageLabel(this.sourceLanguage))}" title="${escapeHtml(languageLabel(this.sourceLanguage))}"></tp-icon>
            <tp-icon-button data-role="toggle-source" name="code" label="Show code" title="Show code" size="s" aria-pressed="false"></tp-icon-button>
            <tp-icon-button data-role="toggle-output" name="eye-outline" label="Show output" title="Show output" size="s" aria-pressed="true"></tp-icon-button>
          </span>
          <span class="tp-markup-viewer-start-controls ${prefix}-start-controls" data-role="start-controls"></span>
          <span class="tp-markup-viewer-toolbar-end">
            <span class="tp-markup-viewer-editor-actions" data-role="editor-actions" hidden>
              <tp-icon-button data-role="toggle-editor-toolbar" name="keyboard-f1" label="Toggle editor toolbar" title="Toggle editor toolbar (F1)" size="s"></tp-icon-button>
              <tp-icon-button data-role="reset" name="refresh" label="Reset" title="Reset" size="s"></tp-icon-button>
              <tp-icon-button data-role="run" name="play" label="Run" title="Run" size="s"></tp-icon-button>
            </span>
          </span>
        </div>
        <tp-switcher class="tp-markup-viewer-layout ${prefix}-layout" gap="0" threshold="60rem">
          <div class="tp-markup-viewer-start ${prefix}-start ${prefix}-panel ${prefix}-panel-code">
            <div class="tp-markup-viewer-source ${prefix}-source ${prefix}-source-output" data-role="source"></div>
          </div>
          <div class="tp-markup-viewer-end ${prefix}-end ${prefix}-panel ${prefix}-panel-preview">
            <div class="tp-markup-viewer-output ${prefix}-output" data-role="output"></div>
          </div>
        </tp-switcher>
      `;
		}
		const structuralMode = this.outputModes.at(-1) ?? this.outputModes[0];
		const htmlCodeMode = this.outputModes.find((mode) => mode.value === "html");

		return `
      <div class="tp-markup-viewer-toolbar ${prefix}-toolbar" role="toolbar" aria-label="Viewer controls">
        <span class="tp-markup-viewer-toolbar-start">
          <tp-icon class="tp-markup-viewer-language" library="components" name="${iconName}" size="1.5em" role="img" aria-label="${escapeHtml(languageLabel(this.sourceLanguage))}" title="${escapeHtml(languageLabel(this.sourceLanguage))}"></tp-icon>
          <tp-icon-button data-role="toggle-source" name="code" label="Show code" title="Show code" size="s" aria-pressed="false"></tp-icon-button>
          <tp-icon-button data-role="toggle-output" name="eye-outline" label="Show output" title="Show output" size="s" aria-pressed="true"></tp-icon-button>
        </span>
        <span class="tp-markup-viewer-start-controls ${prefix}-start-controls" data-role="start-controls"></span>
        <span class="tp-markup-viewer-toolbar-end">
          <span class="tp-markup-viewer-output-actions" data-role="output-actions">
            <tp-icon-button data-role="output-mode" data-mode="${escapeHtml(initialMode)}" name="language-html" library="tp" label="Rendered HTML" title="Rendered HTML" size="s" aria-pressed="true"></tp-icon-button>
            ${htmlCodeMode ? `<tp-icon-button data-role="output-mode" data-mode="${escapeHtml(htmlCodeMode.value)}" name="code" library="tp" label="Generated HTML" title="Generated HTML" size="s" aria-pressed="false"></tp-icon-button>` : ""}
            <tp-icon-button data-role="output-mode" data-mode="${escapeHtml(structuralMode?.value ?? initialMode)}" name="tree" library="components" label="${escapeHtml(structuralMode?.label ?? "AST")}" title="${escapeHtml(structuralMode?.label ?? "AST")}" size="s" aria-pressed="false"></tp-icon-button>
            <tp-divider orientation="vertical"></tp-divider>
          </span>
          <span class="tp-markup-viewer-editor-actions" data-role="editor-actions">
            <tp-icon-button data-role="toggle-editor-toolbar" name="keyboard-f1" label="Toggle editor toolbar" title="Toggle editor toolbar (F1)" size="s"></tp-icon-button>
            <tp-icon-button data-role="reset" name="refresh" label="Reset" title="Reset" size="s"></tp-icon-button>
            <tp-icon-button data-role="run" name="play" label="Run" title="Run" size="s"></tp-icon-button>
          </span>
        </span>
      </div>
      <tp-switcher class="tp-markup-viewer-layout ${prefix}-layout" gap="0" threshold="60rem">
        <div class="tp-markup-viewer-start ${prefix}-start ${prefix}-panel ${prefix}-panel-code">
          <div class="tp-markup-viewer-source ${prefix}-source ${prefix}-source-output" data-role="source"></div>
        </div>
        <div class="tp-markup-viewer-end ${prefix}-end ${prefix}-panel ${prefix}-panel-preview">
          <div class="tp-markup-viewer-output ${prefix}-output" data-role="output"></div>
        </div>
      </tp-switcher>
    `;
	}

	private readMode(value: string, fallback: TMode): TMode {
		return (
			this.outputModes.find((mode) => mode.value === value)?.value ?? fallback
		);
	}

	protected async loadExamples(): Promise<MarkupViewerExample<TContext>[]> {
		const paths = this.src
			.split(",")
			.map((value) => value.trim())
			.filter(Boolean);
		if (paths.length === 0) {
			return this.extractExamples(await this.readInlineSource());
		}

		const examples: MarkupViewerExample<TContext>[] = [];
		for (const path of paths) {
			const url = resolveComponentSourceUrl(this, path);
			const response = await fetch(url.href, { cache: "no-store" });
			if (!response.ok) {
				throw new Error(
					`Unable to load example: ${url.pathname} (${String(response.status)})`,
				);
			}
			const externalExample = {
				label: basename(path),
				source: await response.text(),
				context: await this.createExternalContext(url),
			};
			examples.push(...this.extractExamples(externalExample));
		}
		return examples;
	}
}
