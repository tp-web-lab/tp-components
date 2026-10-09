import "../code-editor/code-editor.js";
import "../radio-list/radio-list.js";
import "../textfield/textfield.js";
import "../button/button.js";
import "../callout/callout.js";
import "../cluster/cluster.js";
import "../stack/stack.js";
/** Lazily loaded, instance-local editor for a declarative graph. */
export declare class XYPlotSettings {
    private readonly initialSource;
    private readonly apply;
    readonly element: HTMLElement;
    private readonly controls;
    private readonly generated;
    private readonly status;
    private updating;
    private timer;
    private readonly sampleLimit;
    constructor(initialSource: string, apply: (source: string) => void);
    private field;
    private radio;
    initialize(source: string): void;
    private setFields;
    private syncKind;
    private update;
    private report;
    destroy(): void;
}
