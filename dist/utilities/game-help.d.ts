/** Separates game commands from gestures while keeping one documentation source. */
export declare function isGameComponent(tag: string): boolean;
export declare function isGameButtonLabel(label: string): boolean;
/** The Mouse panel contains only gestures; button descriptions stay in Buttons. */
export declare function gameMouseInstructions(tag: string, source: string): string;
