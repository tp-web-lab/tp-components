/**
 * @module components/markdown-multi-pages
 * @summary Multi-page Markdown documentation.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
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
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
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
import "../icon-button/icon-button.js";
import "../clock/clock.js";
import "../color/color.js";
import "../lang/lang.js";
import "../source/source.js";
import "../fullscreen/fullscreen.js";
import "../theme/theme.js";
import "../tree/tree.js";
import "../splitter/splitter.js";
import "../markdown/markdown.js";
import type { TpMarkdownMultiPagesTheme } from "./markdown-multi-pages.types.js";
/**
 * @summary Multi-page Markdown documentation.
 * @tagname tp-markdown-multi-pages
 * @example
 * <tp-markdown-multi-pages></tp-markdown-multi-pages>
 */
export declare class TpMarkdownMultiPages extends TpBase {
    static get observedAttributes(): string[];
    private sidebarElement;
    private contentElement;
    private currentHref;
    private currentSource;
    private navigatingHref;
    private sourceMode;
    private pageLinks;
    private pageNavigationElement;
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    get repository(): string;
    set repository(value: string);
    get theme(): TpMarkdownMultiPagesTheme;
    set theme(value: TpMarkdownMultiPagesTheme);
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
    private renderShell;
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
    private createMarkdownViewer;
    private extractSidebarPageLinks;
    private extractSidebarPageLinksFromMarkdown;
    private cleanSidebarMarkdownLabel;
    private readSidebarMarkdownLevel;
    private readSidebarLinkLevel;
    private renderPageNavigation;
    private appendPageNavigationToMarkdown;
    private createPageNavigation;
    private createPageNavigationTopButton;
    private createPageNavigationLink;
    private rewriteSidebarLinks;
    private updateCurrentLink;
    private goTo;
    private goToCurrentFragment;
    private handleHashChange;
    private handleContentClick;
    private readCurrentHref;
    private resolveDocumentHref;
    private stripRepository;
    private normalizeHref;
    private fetchText;
    private isHtmlFallbackResponse;
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
    private get sidebarHref();
    private get coverHref();
    private get notFoundHref();
}
