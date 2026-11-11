### User interactions

Personal annotations are saved per document in this browser's localStorage, without account synchronization. Clearing site data removes them. The [Post-it editor](../post-it-editor/index.md) offers an Annotation language dropdown: adoc, html, md, rst or txt (default). Source and language are saved together; rendered markup is sanitized and scripts are not executed. If a target changes or disappears, use Reattach from the annotations list; no guessed replacement is silently selected. Storage errors are displayed in the editor. Elements inside embedded iframes are outside this page's annotation scope.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Logo (toolbar left, when present) | Open the associated website. |
| Home (toolbar left) | Return to the first page of the documentation from any chapter. |
| Menu (toolbar left) | Show or hide the table of contents used to choose a page. |
| Code (toolbar left) | Display the source of the current page; click again to return to the rendered document. |
| Source repository (toolbar left, when present) | Open the source repository. |
| Language (toolbar right, when available) | Switch to the selected translation of the documentation. |
| Color (toolbar right) | Choose the accent color used by the document controls and highlighted elements. |
| Theme (toolbar right) | Choose a light or dark appearance, or follow the system setting with the automatic theme. |
| Screen (toolbar right) | Preview the layout at a phone, tablet or desktop screen size; choose default to restore the available window size. |
| Fullscreen (toolbar right) | Expand the document to fill the screen, or return to the normal window. |
| Previous page / Next page (bottom of page) | Open the previous or next page in the navigation order. Only available directions are shown. |
| Top of page (bottom of page) | Scroll to the top of the current page. |
| Local navigation link (right of the toolbar) | Open the linked document or website. The local navigation stays available when changing pages in a multipage document. |
| Expand/Collapse branch | Reveal or hide the child entries of a heading without changing the current page. |
| Expand all / Collapse all (sidebar) | Open or close every branch of the global table of contents. Page order stays unchanged. |
| Widen/Restore width | Fit the sidebar to the longest title, including nested titles, on one line. Click again to restore the previous divider position. On small screens, width is limited to the viewport and long titles can scroll horizontally. |
| Search (left of the sidebar controls) | Show or hide a clearable search field. Matching titles are highlighted, their ancestor branches open automatically, and the sidebar scrolls to the first result below the search controls; the displayed page does not change. Search ignores case and accents. A search with no matches displays “0 results” in the danger color. |
| Clear search | Remove highlights and the result count; branches opened by the search remain open. |
| Calculator (between Code and Personal annotations) | Open or close the scientific calculator. Calculations are retained when closing the panel or navigating between pages. |
| Personal annotations (comment with pencil in the toolbar) | Open the annotation list. The button is immediately after Calculator. Use the large + button to add an annotation, select a document element, enter text and Save. The close icon is at the right of the panel title. |
| Annotation pin | Click to open the note, or drag it to another document element. Its attachment is saved. |
| Edit / Reattach / Delete | Update the selected annotation, choose a new target, or remove it from this browser. Each note has pencil (Edit) and delete-outline (Delete) icon buttons in its bottom-right footer. |
| Annotation appearance | Choose color, heading, opacity (0–1) and rotation (−12–12°). Save stores these settings with the text; Cancel discards edits. Reset appearance defaults restores yellow, an empty heading, opacity 1 and rotation 0 without changing the text. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on a sidebar button | Expand/collapse branches, toggle the sidebar width, or open/close search. |
| Typing in sidebar search | Update matching titles and open their ancestors. |
| <kbd>Enter</kbd> in sidebar search | Scroll to the next result, wrapping to the first. |
| <kbd>Escape</kbd> in sidebar search | Close and clear search, then return focus to its button. |
| Selecting an annotation target | <kbd>Tab</kbd> to a paragraph, heading or other available target, then <kbd>Enter</kbd> to select it. <kbd>Escape</kbd> cancels. |
| Annotation pin arrows | Move the folded annotation; <kbd>Shift</kbd> uses smaller steps. <kbd>Enter</kbd> or <kbd>Space</kbd> opens it. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
