/** Shared game header: commands, assistance and locally scoped display controllers. */
import "../components/icon/icon.js";
import "../components/icon-button/icon-button.js";
import "../components/chronometer/chronometer.js";
import "../components/dropdown/dropdown.js";
import "../components/color/color.js";
import "../components/theme/theme.js";
import "../components/fullscreen/fullscreen.js";
import type { TpChronometer } from "../components/chronometer/chronometer.js";
import type { TpIconButton } from "../components/icon-button/icon-button.js";
import "../components/divider/divider.js";
import "../components/drawer/drawer.js";
export interface GameHelpAction {
    id?: string;
    label: string;
    run: () => void;
    disabled?: () => boolean;
}
export interface GameHeaderOptions {
    name: string;
    icon: string;
    target: HTMLElement;
    reset: () => void;
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    help: () => GameHelpAction[];
    controls?: {
        reset?: TpIconButton;
        undo?: TpIconButton;
        redo?: TpIconButton;
    };
    chronometer?: TpChronometer;
}
/** Reuses one header and chronometer when a game rebuilds its board. */
export declare function mountGameHeader(host: HTMLElement, options: GameHeaderOptions): void;
/** Refreshes command availability after a game-state change. */
export declare function updateGameHeader(host: HTMLElement): void;
/** Tracks active play without resetting elapsed time during undo or rerendering. */
export declare function gameActivity(host: HTMLElement, active: boolean, complete?: boolean): void;
export declare function resetGameClock(host: HTMLElement): void;
/** Adapts existing select-based assistance while retaining its game-specific actions and live restrictions. */
export declare function mountLegacyGameHeader(host: HTMLElement, slug: string): void;
