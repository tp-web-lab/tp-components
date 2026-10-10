/**
 * @module components/markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-calculator
 * @summary Scientific calculator with an editable expression and degree/radian modes.
 */
/**
 * @tp-dependency tp-clock
 * @summary Live clock component with digital or analogic display and date tooltip.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-drawer
 * @summary Drawer overlay component.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-lang
 * @summary Documentation language selector.
 */
/**
 * @tp-dependency tp-post-it-editor
 * @summary creates and edits persistent personal annotations attached to document elements.
 */
/**
 * @tp-dependency tp-source
 * @summary Source repository link button.
 */
/**
 * @tp-dependency tp-splitter
 * @summary Splitter component with two resizable panels.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
/**
 * @tp-dependency tp-tree
 * @summary Generic tree component for interactive hierarchical editing.
 */
import { TpBase } from "../base/base.js";
import "../toolbar/toolbar.js";
import "../calculator/calculator.js";
import "../icon-button/icon-button.js";
import "../clock/clock.js";
import "../color/color.js";
import "../lang/lang.js";
import "../source/source.js";
import "../fullscreen/fullscreen.js";
import "../theme/theme.js";
import "../tree/tree.js";
import "../splitter/splitter.js";
import type { TpMarkupMultiPagesTheme } from "./markup-multi-pages.types.js";
export type TpMarkupMultiPagesLanguage = "html" | "markdown" | "asciidoc" | "restructuredtext";
/**
 * @summary Multi-page documentation with support for multiple markup languages.
 * @tagname tp-markup-multi-pages
 * @example
 * <tp-markup-multi-pages></tp-markup-multi-pages>
 */
export declare class TpMarkupMultiPages extends TpBase {
    static get observedAttributes(): string[];
    private sidebarElement;
    private contentElement;
    private currentHref;
    /** Shared page-scoped personal annotation editor. */
    private annotations;
    private calculatorDrawer;
    private currentSource;
    private navigatingHref;
    private sourceMode;
    private pageLinks;
    private pageNavigationElement;
    private shellRendered;
    /** Language imposed by a format-specific subclass, or automatic detection. */
    protected get fixedLanguage(): TpMarkupMultiPagesLanguage | null;
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    get repository(): string;
    set repository(value: string);
    get theme(): TpMarkupMultiPagesTheme;
    set theme(value: TpMarkupMultiPagesTheme);
    get brand(): string;
    set brand(value: string);
    get label(): string;
    set label(value: string);
    get git(): string;
    set git(value: string);
    get langs(): string;
    set langs(value: string);
    get menu(): boolean;
    set menu(value: boolean);
    private applyLabel;
    private applyLangs;
    private applyDocumentLocale;
    private resolveCurrentLang;
    private initialize;
    private updateLanguageVisibility;
    private renderShell;
    private toggleCalculator;
    private applyInitialSidebarState;
    private applyMenuState;
    private loadSidebar;
    private wrapSidebarListWithTree;
    private createSidebarTreeControls;
    private createSidebarTreeButton;
    private configureSidebarTree;
    private navigate;
    private renderNotFoundPage;
    private toggleSourceMode;
    private createMarkupViewer;
    private createInlineMarkupViewer;
    private renderSourceToHtml;
    private ensureLanguageRenderer;
    private updateDocumentMetadata;
    private setDocumentMeta;
    private extractDocumentTitle;
    private cleanDocumentTitle;
    private extractDocumentDescription;
    /** Build metadata maps original document URLs to pre-rendered HTML. */
    private getRenderedHref;
    private detectLanguage;
    private getViewerTagName;
    private getInlineScriptType;
    private getRenderedAttribute;
    private getRenderedEvent;
    private getOutputSelector;
    private getSourceLanguage;
    private extractSidebarPageLinks;
    private extractSidebarPageLinksFromMarkdown;
    private cleanSidebarMarkdownLabel;
    private readSidebarMarkdownLevel;
    private readSidebarLinkLevel;
    private renderPageNavigation;
    private appendPageNavigationToMultiPages;
    private createPageNavigation;
    private createPageNavigationTopButton;
    private createPageNavigationLink;
    private rewriteSidebarLinks;
    private updateCurrentLink;
    private goTo;
    private goToCurrentFragment;
    private handleHashChange;
    private navigateToCover;
    private goToCover;
    private handleContentClick;
    private readCurrentHref;
    private resolveDocumentHref;
    private stripRepository;
    private normalizeHref;
    private fetchText;
    private isHtmlFallbackResponse;
    private isLikelyApplicationShell;
    private isExternalHref;
    private shouldHandleDocumentLink;
    private shouldHandleDocumentHref;
    private isHashOnlyHref;
    private resolveRelativeHref;
    private splitHrefFragment;
    private scrollToFragmentAfterRender;
    private scrollToFragment;
    private escapeCssIdentifier;
    private isRepositoryHref;
    private applyTheme;
    private applyBrand;
    private get repositoryBasePath();
    private get coverHref();
    private get notFoundHref();
    private get preferredExtension();
    private createDefaultNotFoundSource;
    private fetchSpecialPage;
    private resolveSpecialPageHref;
    private getSpecialPageHrefs;
}
