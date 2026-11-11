/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-checkbox-list
 * @summary Transforms a list into a group of checkboxes.
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
 * @tp-dependency tp-dir
 * @summary Reading-direction controller (`ltr`/`rtl`/`auto`) with embedded UI.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
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
 * @tp-dependency tp-screen
 * @summary Responsive page preview in selectable device viewports.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
import { TpBase } from "../base/base.js";
import "../checkbox-list/checkbox-list.js";
import "../dropdown/dropdown.js";
import "../icon-button/icon-button.js";
import "../divider/divider.js";
import "../toolbar/toolbar.js";
import "../clock/clock.js";
import "../color/color.js";
import "../dir/dir.js";
import "../fullscreen/fullscreen.js";
import "../lang/lang.js";
import "../theme/theme.js";
import "../screen/screen.js";
/**
 * The custom `<tp-control>` element selects which interface controllers appear in a compact toolbar.
 *
 * @summary Selects which interface controllers appear in a compact toolbar.
 * @tagname tp-control
 * @attr {string} value = "" - Comma-separated visible controllers: clock, lang, dir, color, theme, screen and fullscreen. Empty hides all controllers.
 * @attr {string} langs = "en" - Comma-separated languages forwarded to the language controller.
 * @attr {string} repository = "" - Documentation repository root forwarded to the language controller.
 * @event tp-control-change Emitted when the reader changes the visible controllers.
 * @eventdetail tp-control-change { value: string; controllers: string[] }
 * @keyboard {Enter / Space} Opens or closes the dropdown when the Controllers button is focused.
 * @keyboard {Space} Toggles a focused checkbox.
 * @keyboard {Tab / Shift+Tab} Moves between the visible controllers, the trigger and the dropdown checkboxes.
 * @keyboard {Escape} Closes the dropdown and returns focus to its trigger.
 * @accessibility Uses a labelled trigger, a labelled toolbar and native checkboxes; the All controllers checkbox exposes partial selection.
 * @example
 * <tp-box data-tp-color-scope="">
 *   <tp-control value="color,theme"></tp-control>
 *   <p>Change the color or theme of this box. The inline code <code>hello(world)</code> uses the selected brand color.</p>
 * </tp-box>
 */
export declare class TpControl extends TpBase {
    private static nextId;
    private toolbar;
    private trigger;
    private dropdown;
    private all;
    private choices;
    private readonly instances;
    static get observedAttributes(): string[];
    get value(): string;
    set value(value: string);
    get langs(): string;
    set langs(value: string);
    get repository(): string;
    set repository(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    disconnectedCallback(): void;
    private createControls;
    private choose;
    private syncTrigger;
    private sync;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-control": TpControl;
    }
}
