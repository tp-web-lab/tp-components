import "../button/button.js";
import "../button-group/button-group.js";
import "../callout/callout.js";
import "../sidebar/sidebar.js";
import "../dragdrop/dragdrop.js";
import "../divider/divider.js";
/** Manages a shuffled answer bank without changing question scoring. */
export declare class ClosedAnswers {
    private readonly form;
    /** Unique DOM root identifiers keep simultaneous questions isolated. */
    private static nextId;
    /** Responsive layout containing the original blanks and their answer bank. */
    private readonly layout;
    /** Root for drag events and announcements, outside the two-column layout. */
    private readonly container;
    /** Existing drag-and-drop controller, including its keyboard workflow. */
    private readonly dragdrop;
    /** Original author readonly settings, restored when leaving closed mode. */
    private readonly fields;
    /** Answer identities are independent of their shuffled display positions. */
    private readonly choices;
    /** Current click/touch selection. */
    private selected;
    /** Blank retained while keyboard focus is in the answer bank. */
    private targetField;
    /** Persistent usage help beneath the feedback output. */
    private readonly instructions;
    /** Mounts the bank next to the existing form after its fields have upgraded. */
    constructor(form: HTMLElement, answers: string[], feedbackOutput: HTMLElement | null, contents?: Node[], closedIndices?: number[]);
    /** Restores the author form and removes all listeners and generated controls. */
    destroy(): void;
    /** Selects an answer, or assigns the selected answer to a clicked blank. */
    private readonly onClick;
    /** Routes keyboard assignment between answers and blanks, not unrelated bank items. */
    private readonly onKeyDown;
    /** Releases the assigned token when a rich blank is cleared through its own control. */
    private readonly onFieldInput;
    /** Focuses a rich blank itself, or the native control of a text field. */
    private focusField;
    /** Keeps exactly one destination visibly marked while browsing answers. */
    private setTargetField;
    /** Handles both pointer drops and the keyboard events emitted by tp-dragdrop. */
    private readonly onDrop;
    /** Moves an answer identity, returning any displaced answer to the bank. */
    private assign;
    /** Marks assigned cities visually and describes their destination to assistive tools. */
    private updateAssignedChoices;
    /** Updates the library field and notifies the existing form/feedback machinery. */
    private write;
}
