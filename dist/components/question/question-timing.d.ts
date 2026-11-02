import "../button/button.js";
/** Parse a strict two-digit hours, minutes and seconds duration. */
export declare function questionTimingSeconds(value: string): number;
/** Coordinates the shared timer and mask without changing question answers. */
export declare class QuestionTiming {
    private readonly host;
    private readonly kind;
    private static readonly sessions;
    private startedAt;
    private pending;
    private solved;
    private readonly exerciseLocks;
    private readonly notifiedQuestions;
    /** Applies an exercise deadline without creating a question timer. */
    setExerciseTiming(exercise: HTMLElement, pending: boolean): void;
    private refreshSolutionLock;
    private publishExerciseTiming;
    private timer;
    private mask;
    private configured;
    private layout;
    private solutionPanel;
    private releaseSolution;
    constructor(host: HTMLElement, kind?: "question" | "exercise");
    configure(): void;
    /** Returns elapsed time from the nearest started question or exercise timer. */
    static elapsedFor(host: HTMLElement): string | null;
    /** Releases the timed solution gate after a verified correct answer. */
    unlockSolution(): void;
    private lockSolution;
    private message;
    private focusContent;
    dispose(): void;
}
