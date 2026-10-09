/**
 * @module components/restructuredtext-playground
 * @summary reStructuredText playground component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-console
 * @summary Displays structured console output.
 */
/**
 * @tp-dependency tp-drawer
 * @summary Displays a sliding drawer panel.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-file-tree
 * @summary Displays an interactive file and folder tree.
 */
/**
 * @tp-dependency tp-filesystem
 * @summary In-memory file system component.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-iframe
 * @summary Controlled iframe component.
 */
/**
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-splitter
 * @summary Splitter component with two resizable panels.
 */
/**
 * @tp-dependency tp-switcher
 * @summary Switches between horizontal and vertical layouts based on available space.
 */
/**
 * @tp-dependency tp-tabs
 * @summary Accessible tabs component with keyboard and reorder support.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
/**
 * @credit es-module-lexer https://github.com/guybedford/es-module-lexer
 * @summary ECMAScript module import analysis.
 */
/**
 * @credit Pyodide https://pyodide.org/
 * @summary Python execution in the browser.
 */
/**
 * @credit TypeScript https://www.typescriptlang.org/
 * @summary TypeScript transpilation and language services.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
// tp-docgen:dependencies:end

import "../playground/playground.js";

import type { TpFile } from "../filesystem/filesystem.types.js";
import type { TpMarkupExtensionId } from "../markup-playground/markup-extension.types.js";
import {
	getMarkupExtensionIdFromAction,
	isMarkupExtensionAction,
	renderMarkupExtensionMenu,
	syncMarkupExtensionMenuChecks,
} from "../markup-playground/markup-extension-menu.js";
import {
	createMarkupExtensionMenuItems,
	toggleMarkupExtensionId,
	toMarkupRuntimeExtensions,
} from "../markup-playground/markup-extension-registry.js";
import type { TpExecutionDocument } from "../playground/playground.js";
import { TpPlayground } from "../playground/playground.js";
import type { TpExampleProjectMetadata } from "../playground/playground-example-loader.js";
import { buildRestructuredTextExecutionDocument } from "./restructuredtext-execution-document.js";
import {
	type TpRestructuredTextExtension,
	TpRestructuredTextProject,
} from "./restructuredtext-project.js";

export { TpRestructuredTextProject } from "./restructuredtext-project.js";

/**
 * reStructuredText playground component.
 *
 * Provides a file-based playground that renders reStructuredText documents in the browser.
 *
 * @summary Edits and renders a reStructuredText project.
 * @tagname tp-restructuredtext-playground
 *
 * @attr {string} repository = "" - Directory containing a reStructuredText playground project to load at initialization.
 * @attr {string} src = "" - JSON project or restructuredtext source file to load.
 *
 * @example
 * <tp-restructuredtext-playground></tp-restructuredtext-playground>
 */
export class TpRestructuredTextPlayground extends TpPlayground<TpRestructuredTextProject> {
	protected override createEmptyProject(): TpRestructuredTextProject {
		return new TpRestructuredTextProject({
			name: "reStructuredText project",
			entry: "/index.rst",
			files: [
				{
					path: "/index.rst",
					language: "restructuredtext",
					content: `
reStructuredText playground
===========================
.. tp-callout::
   :variant: info
   :heading: About this playground

   This \`reStructuredText <https://docutils.sourceforge.io/rst.html>\`_ document is rendered in the browser with \`Pyodide <https://pyodide.org/>\`_ and \`docutils <https://docutils.sourceforge.io/>\`_.

.. contents:: Contents
   :depth: 2
   :local:


Lists
-----

Unordered list
^^^^^^^^^^^^^^

- HTML
- CSS
- JavaScript

  - DOM
  - Events
  - Fetch API

Ordered list
^^^^^^^^^^^^

1. Install dependencies
2. Start the dev server
3. Open the browser

Definition list
^^^^^^^^^^^^^^^

HTML
  Structures the document.

CSS
  Styles the document.

JavaScript
  Adds behavior to the document.



Tables
------

Simple table
^^^^^^^^^^^^

=========  ===========
Language   Role
=========  ===========
HTML       Structure
CSS        Style
Python     Rendering
=========  ===========

List table
^^^^^^^^^^

.. list-table:: Languages
   :header-rows: 1

   * - Language
     - Role
   * - HTML
     - Structure
   * - CSS
     - Style

CSV table
^^^^^^^^^

.. csv-table:: Languages
   :header: "Language", "Role"

   "HTML", "Structure"
   "CSS", "Style"
   "Python", "Runtime"


Codes
-----

Load the highlight.js extension to add syntax highlighting to code blocks.

Literal block
^^^^^^^^^^^^^

::

  print("Hello reStructuredText")


Javascript
^^^^^^^^^^

.. code-block:: javascript

   function greet(name) {
       console.log(\`Hello \${name}\`);
   }

   greet('world');


Python
^^^^^^

.. code-block:: python

   def greet(name: str) -> None:
       print(f"Hello {name}")

   greet("world")

HTML
^^^^

.. code-block:: html

   <section class="card">
     <h2>Hello</h2>
   </section>


Bash
^^^^

.. code-block:: bash

   pnpm install
   pnpm dev
`.trim(),
				},
			],
		});
	}

	protected override createNewProject(): TpRestructuredTextProject {
		return this.createEmptyProject();
	}

	protected override createClearProject(): TpRestructuredTextProject {
		return new TpRestructuredTextProject({
			name: "Untitled project",
			files: [],
		});
	}

	protected override normalizeProject(
		project: TpRestructuredTextProject,
	): TpRestructuredTextProject {
		const nextProject = project.clone();

		if (nextProject.entry === undefined || nextProject.entry === "") {
			nextProject.entry =
				nextProject.files.find((file) => file.path.endsWith(".rst"))?.path ??
				nextProject.files.find((file) => file.path.endsWith(".rest"))?.path ??
				nextProject.files[0]?.path;
		}

		return nextProject;
	}

	protected override resolveEntry(
		project: TpRestructuredTextProject,
	): string | null {
		if (
			typeof project.entry === "string" &&
			project.findFile(project.entry) !== undefined
		) {
			return project.entry;
		}

		return (
			project.files.find((file) => file.path === "/index.rst")?.path ??
			project.files.find((file) => file.path === "/main.rst")?.path ??
			project.files.find((file) => file.path.endsWith(".rst"))?.path ??
			project.files.find((file) => file.path.endsWith(".rest"))?.path ??
			null
		);
	}

	protected override getPlaygroundKind(): string {
		return "restructuredtext";
	}

	protected override getLanguageIconName(): string {
		return "file_type_restructuredtext";
	}

	protected override getLanguageHelp(): string {
		return `
      <h2>reStructuredText</h2>
      <p>reStructuredText est rendu avec docutils dans Pyodide.</p>
      <ul>
        <li><a href="https://docutils.sourceforge.io/rst.html" target="_blank" rel="noreferrer">reStructuredText</a></li>
        <li><a href="https://docutils.sourceforge.io/" target="_blank" rel="noreferrer">docutils</a></li>
        <li><a href="https://pyodide.org/" target="_blank" rel="noreferrer">Pyodide</a></li>
      </ul>
    `;
	}

	protected override createProjectFromExample(
		metadata: TpExampleProjectMetadata,
		files: readonly TpFile[],
	): TpRestructuredTextProject {
		const candidate = metadata as TpExampleProjectMetadata & {
			libs?: unknown;
			extensions?: unknown;
		};
		return new TpRestructuredTextProject({
			name:
				metadata.name ??
				metadata.label ??
				metadata.id ??
				"reStructuredText project",
			entry: metadata.entry ?? "/index.rst",
			test: metadata.test,
			libs: Array.isArray(candidate.libs)
				? candidate.libs.filter(
						(item): item is string => typeof item === "string",
					)
				: undefined,
			extensions: Array.isArray(candidate.extensions)
				? candidate.extensions.filter(
						(extension): extension is TpRestructuredTextExtension =>
							typeof extension === "object" &&
							extension !== null &&
							typeof (extension as { id?: unknown }).id === "string" &&
							typeof (extension as { label?: unknown }).label === "string" &&
							typeof (extension as { url?: unknown }).url === "string",
					)
				: undefined,
			files,
		});
	}

	protected override async buildExecutionDocument(
		project: TpRestructuredTextProject,
	): Promise<TpExecutionDocument> {
		return buildRestructuredTextExecutionDocument(project, {
			entry: this.resolveEntry(project) ?? undefined,
			libs: project.libs,
		});
	}

	protected override getAdditionalToolbarMenuItems(): string {
		return renderMarkupExtensionMenu(
			createMarkupExtensionMenuItems(
				"restructuredtext",
				this.getActiveMarkupExtensionIds(),
			),
		);
	}

	protected override handleAdditionalToolbarAction(action: string): boolean {
		if (!isMarkupExtensionAction(action)) {
			return false;
		}

		const id = getMarkupExtensionIdFromAction(action);

		if (id === null) {
			return false;
		}

		const activeIds = toggleMarkupExtensionId(
			this.getActiveMarkupExtensionIds(),
			id,
		);

		this.applyMarkupExtensions(activeIds);
		return true;
	}

	private getActiveMarkupExtensionIds(): Set<TpMarkupExtensionId> {
		return new Set(
			this.getProject().extensions?.map((extension) => extension.id) ?? [],
		);
	}

	private applyMarkupExtensions(
		activeIds: ReadonlySet<TpMarkupExtensionId>,
	): void {
		this.toolbarStartMenuEl?.closeAll?.();

		this.syncProjectFromFilesystem();

		const project = this.getProject();

		this.setProject(
			new TpRestructuredTextProject({
				name: project.name,
				entry: project.entry,
				test: project.test,
				libs: project.libs,
				files: project.files,
				extensions: toMarkupRuntimeExtensions("restructuredtext", activeIds),
			}),
		);

		queueMicrotask(() => {
			this.syncToolbarExtensionChecks();
			void this.run();
		});
	}

	private syncToolbarExtensionChecks(): void {
		syncMarkupExtensionMenuChecks(this, this.getActiveMarkupExtensionIds());
	}

	protected override get exampleCategory(): string {
		return "playgrounds";
	}

	protected override get exampleGroup(): string {
		return "restructuredtext";
	}

	protected override afterProjectLoaded(): void {
		queueMicrotask(() => {
			this.syncToolbarExtensionChecks();
		});
	}
}

if (!customElements.get("tp-restructuredtext-playground")) {
	customElements.define(
		"tp-restructuredtext-playground",
		TpRestructuredTextPlayground,
	);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-restructuredtext-playground": TpRestructuredTextPlayground;
	}
}
