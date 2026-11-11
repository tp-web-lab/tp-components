/** @module components/latex-single-page @summary Single-page LaTeX renderer. */
/**
 * @tp-dependency tp-markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
import { TpMarkupSinglePage, type TpMarkupSinglePageLanguage } from "../markup-single-page/markup-single-page.js";
/**
 * The custom `<tp-latex-single-page>` element displays a single LaTeX document.
 *
 * @summary Displays a single LaTeX document.
 * @tagname tp-latex-single-page
 * @event tp-latex-single-page-rendered Emitted after this page finishes rendering, immediately after tp-markup-single-page-rendered. language identifies the renderer and src is the resolved source used for this render.
 * @eventdetail tp-latex-single-page-rendered { language: "html" | "markdown" | "asciidoc" | "restructuredtext" | "latex"; src: string }
 * @example
 * <tp-latex-single-page label="A short guide">
 *   <script type="tp/latex">
 * \section*{A short guide}
 * This document is rendered as a single page.
 * \subsection*{Getting started}
 * \begin{itemize}
 *   \item Read the introduction
 *   \item Try a component
 * \end{itemize}
 *   </script>
 * </tp-latex-single-page>
 */
export declare class TpLatexSinglePage extends TpMarkupSinglePage {
    protected get fixedLanguage(): TpMarkupSinglePageLanguage;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-latex-single-page": TpLatexSinglePage;
    }
}
