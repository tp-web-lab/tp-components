/**
 * Initialise les triggers externes de tp-animation.
 *
 * Attributs attendus :
 * - `data-tp-animation-action="play-in|play-out|pause|cancel|restart"`
 * - `data-tp-animation-target="<sélecteur CSS>"`
 */
export declare function setupTpAnimationTriggers(root?: ParentNode): void;
export declare function teardownTpAnimationTriggers(root?: ParentNode): void;
