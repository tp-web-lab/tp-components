/**
 * @module components/playground
 * @summary Shared playground base for interactive execution components.
 */
import "../base/base.js";
import "../button/button.js";
import "../console/console.js";
import "../code-editor/code-editor.js";
import "../drawer/drawer.js";
import "../dropdown/dropdown.js";
import "../filesystem/filesystem.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../iframe/iframe.js";
import "../menu/menu.js";
import "../splitter/splitter.js";
import "../switcher/switcher.js";
import "../tabs/tabs.js";
import "../toolbar/toolbar.js";
import { TpBase } from "../base/base.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import type { TpConsole } from "../console/console.js";
import type { TpDrawer } from "../drawer/drawer.js";
import type { TpFilesystem } from "../filesystem/filesystem.js";
import type { TpFile } from "../filesystem/filesystem.types.js";
import type { TpIframe } from "../iframe/iframe.js";
import type { TpMenu } from "../menu/menu.js";
import type { TpTabs } from "../tabs/tabs.js";
import { type TpExampleProjectMetadata } from "./playground-example-loader.js";
import { type TpPlaygroundProjectData, type TpPlaygroundProjectMetadata } from "./playground-project-loader.js";
import { TpProject } from "./project.js";
export interface TpExecutionDocument {
    html: string;
    cleanup?: () => void;
}
export interface TpPlaygroundSrcLoadDetail<TProject extends TpProject = TpProject> {
    src: string;
    project: TProject;
}
export interface TpPlaygroundRepositoryLoadDetail<TProject extends TpProject = TpProject> {
    repository: string;
    project: TProject;
}
export declare abstract class TpPlayground<TProject extends TpProject = TpProject> extends TpBase {
    private static readonly styleId;
    private isSyncingEditor;
    /** Invalidates source requests when a newer configuration is selected. */
    private configuredProjectRevision;
    /** Last successful disk destination for each logical project file. */
    private readonly fileSaveTargets;
    /** Cancels a pending disk chooser when another is opened or the host disconnects. */
    private fileChooserController;
    private cleanupExecution;
    private viewerIframeResizeObserver;
    private viewerIframeMutationObserver;
    private exampleLoader;
    protected project: TProject;
    protected initialProject: TProject;
    protected filesystemEl: TpFilesystem | null;
    protected editorEl: TpCodeEditor | null;
    protected iframeEl: TpIframe | null;
    protected tabsEl: TpTabs | null;
    protected consoleEl: TpConsole | null;
    protected toolbarStartMenuEl: TpMenu | null;
    protected languageDrawerEl: TpDrawer | null;
    private viewerCodeVisible;
    private viewerOutputVisible;
    private viewerConsoleVisible;
    protected openFiles: string[];
    protected activeFile: string | null;
    static get observedAttributes(): string[];
    get repository(): string;
    set repository(value: string);
    get src(): string;
    set src(value: string);
    protected getLanguageIconName(): string;
    /** Use the compact, single-project viewer interface instead of the IDE interface. */
    protected get viewerMode(): boolean;
    protected getViewerLanguageLabel(): string;
    /** Additional project files displayed as editors below the entry file. */
    protected getViewerAdditionalFilePaths(_project: TProject): readonly string[];
    /** Display the primary and additional viewer files as tabs. */
    protected get usesViewerEditorTabs(): boolean;
    protected getLanguageHelp(): string;
    protected getAdditionalToolbarMenuItems(): string;
    protected getExampleMenuItems(): string;
    protected get supportsTestExecution(): boolean;
    protected get exampleCategory(): string;
    protected get exampleGroup(): string;
    protected getPlaygroundKind(): string;
    protected createProjectFromExample(metadata: TpExampleProjectMetadata, files: readonly TpFile[]): TProject;
    private getExampleLoader;
    protected afterProjectLoaded(): void;
    private syncExamplesMenu;
    protected loadExample(id: string): Promise<void>;
    protected handleAdditionalToolbarAction(_action: string): boolean;
    constructor();
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    getProject(): TProject;
    setProject(project: TProject): void;
    reset(): void;
    run(): Promise<void>;
    test(): Promise<void>;
    /** Builds an isolated test run from the current edits without changing the project or preview. */
    createTestDocument(testFile: TpFile): Promise<TpExecutionDocument>;
    openFile(path: string): void;
    closeFile(path: string): void;
    protected abstract createEmptyProject(): TProject;
    protected attributeChangedCallback(name: string, _oldValue: string | null, _newValue: string | null): void;
    protected createNewProject(): TProject;
    protected createClearProject(): TProject;
    protected createInitialProject(): TProject;
    protected createProjectFromData(data: TpPlaygroundProjectData): TProject;
    protected createProjectFromRepository(metadata: TpPlaygroundProjectMetadata, files: readonly TpFile[]): TProject;
    protected normalizeProject(project: TProject): TProject;
    protected loadConfiguredProject(restoreDefault?: boolean): Promise<boolean>;
    protected resolveEntry(project: TProject): string | null;
    protected resolveViewerPrimaryFile(project: TProject): string | null;
    protected abstract buildExecutionDocument(project: TProject): Promise<TpExecutionDocument>;
    protected buildTestDocument(_project: TProject): Promise<TpExecutionDocument>;
    protected syncProjectFromFilesystem(): void;
    protected hasAvailableTestFile(project?: TProject): boolean;
    protected syncToolbar(): void;
    protected syncFilesystemFromProject(): void;
    protected createConsoleBridgeScript(): string;
    private ensureLayout;
    private ensureViewerLayout;
    private syncViewerAdditionalEditors;
    private createViewerAdditionalEditor;
    private createViewerButton;
    private updateViewerLayout;
    /** Keeps every visible programming-viewer editor at its intrinsic height. */
    private syncViewerEditorHeights;
    private readonly handleViewerCodeClick;
    private readonly handleViewerOutputClick;
    private readonly handleViewerConsoleClick;
    private readonly handleViewerConsoleEntry;
    private readonly handleViewerConsoleClear;
    private readonly handleEditorToolbarClick;
    /** Fits both viewer and playground output to live content, including subsequent shrinking. */
    private readonly handleViewerIframeLoad;
    private createToolbarIconButton;
    private syncTestButton;
    private bindEvents;
    private unbindEvents;
    private readonly handleRunClick;
    private readonly handleTestClick;
    private readonly handleResetClick;
    private readonly handleFilesystemOpen;
    private readonly handleFilesystemActive;
    private readonly handleFilesystemChange;
    private readonly handleFilesystemRename;
    private readonly handleEditorChange;
    private readonly handleTabsSelect;
    private readonly handleTabsClose;
    private readonly handleToolbarMenuSelect;
    /** Opens a JSON project or wraps a local source exactly as the src loader does. */
    private openLocalProject;
    /** Saves the active file, reusing only a destination selected for this project. */
    private saveActiveFile;
    /** Exports every project file and its language-specific metadata as JSON. */
    private exportLocalProject;
    private syncEditorFromActiveFile;
    private syncTabs;
    private readonly handleWindowMessage;
    private reportError;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-playground": TpPlayground;
    }
}
