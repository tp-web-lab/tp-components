/**
 * @module components/markdown-multi-pages
 * @summary Multi-page Markdown documentation.
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
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
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
 * @tp-dependency tp-post-it-editor
 * @summary creates and edits persistent personal annotations attached to document elements.
 */
/**
 * @tp-dependency tp-screen
 * @summary Responsive page preview in selectable device viewports.
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
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
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
import "../button/button.js";
import "../icon/icon.js";
import "../calculator/calculator.js";
import { TpBase } from "../base/base.js";
import "../toolbar/toolbar.js";
import "../icon-button/icon-button.js";
import "../clock/clock.js";
import "../color/color.js";
import "../lang/lang.js";
import "../source/source.js";
import "../fullscreen/fullscreen.js";
import "../screen/screen.js";
import "../theme/theme.js";
import "../tree/tree.js";
import "../splitter/splitter.js";
import "../markdown/markdown.js";
import type { TpMarkdownMultiPagesTheme } from "./markdown-multi-pages.types.js";
/**
 * The custom `<tp-markdown-multi-pages>` element presents Markdown documents with navigation between pages.
 *
 * @summary Presents Markdown documents with navigation between pages.
 * @tagname tp-markdown-multi-pages
 * @attr {string} repository = "/docs" - Root path containing sidebar.md, cover.md and the linked Markdown pages.
 * @attr {string | null} toolbar = null - Comma-separated controls: home, menu, code, calc, postit, clock, lang, color, theme, screen, fullscreen. Absent or empty keeps all controls; none hides commands. Updates immediately.
 * @attr {boolean} menu = false - Opens the navigation sidebar when present; the toolbar Menu button toggles this attribute.
 * @attr {string} label = "" - Title displayed in the center of the document toolbar.
 * @attr {string} git = "" - Repository URL assigned to the toolbar source link when the document shell is created. Set before connecting the component.
 * @attr {TpMarkdownMultiPagesTheme} theme = "" - Legacy light, dark or auto property. Attribute-driven styling is currently inactive; use the toolbar theme control.
 * @attr {string} brand = "tp-default" - Legacy brand preset property, such as tp-default. Attribute-driven styling is currently inactive; use the toolbar color control.
 * @example
 * <tp-markdown-multi-pages></tp-markdown-multi-pages>
 *  @cssprop [--tp-markdown-multi-pages-sidebar-width=12rem] Width of the overlay navigation sidebar on narrow screens, capped at 85% of its container; desktop sizing is controlled by the splitter.
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
    private stopOrientationObserver;
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
     * Website opened in the current tab when activating the toolbar logo. Defaults to ./ when omitted or empty.
     * @attr logo-href
     */
    get logoHref(): string;
    set logoHref(value: string);
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
    /** Selects toolbar controls; null restores the full default toolbar. */
    get toolbar(): string | null;
    set toolbar(value: string | null);
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
