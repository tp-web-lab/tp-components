/**
 * @module components/markdown-multi-pages
 * @summary Multi-page Markdown documentation.
 */
import "../calculator/calculator.js";
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
 * @attr {string} repository = "/docs" - Root path containing sidebar.md, cover.md and the linked Markdown pages.
 * @attr {boolean} menu = false - Opens the navigation sidebar when present; the toolbar Menu button toggles this attribute.
 * @attr {string} label = "" - Title displayed in the center of the document toolbar.
 * @attr {string} git = "" - Repository URL assigned to the toolbar source link when the document shell is created. Set before connecting the component.
 * @attr {TpMarkdownMultiPagesTheme} theme = "" - Legacy light, dark or auto property. Attribute-driven styling is currently inactive; use the toolbar theme control.
 * @attr {string} brand = "tp-default" - Legacy brand preset property, such as tp-default. Attribute-driven styling is currently inactive; use the toolbar color control.
 * @example
 * <tp-markdown-multi-pages></tp-markdown-multi-pages>
 * @cssprop [--tp-markdown-multi-pages-sidebar-width=12rem] Width of the overlay navigation sidebar on narrow screens, capped at 85% of its container; desktop sizing is controlled by the splitter.
 */
export declare class TpMarkdownMultiPages extends TpBase {
    static get observedAttributes(): string[];
    private sidebarElement;
    private contentElement;
    private currentHref;
    private annotations;
    private calculatorDrawer;
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
    /**
     * @summary Logo URL displayed at the start of the toolbar, at the default icon-button size. Empty hides the logo.
     * @attr logo
     * @default ""
     */
    get logo(): string;
    set logo(value: string);
    get label(): string;
    set label(value: string);
    get git(): string;
    set git(value: string);
    /** Comma-separated language codes. The selector is hidden unless at least two distinct codes are declared. */
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
