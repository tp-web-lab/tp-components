/** Defers expensive rendering until its panel is exposed and near the viewport. */
export declare class DeferredVisibility {
    private readonly host;
    private readonly resume;
    private observer;
    private revision;
    private intersection;
    private approached;
    constructor(host: HTMLElement, resume: () => void);
    defer(): boolean;
    disconnect(): void;
}
