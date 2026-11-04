/**
 * @module components/audio-playlist
 * @summary Plays a list of audio tracks sequentially or in shuffled order.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import "../button-group/button-group.js";
import "../typewriting/typewriting.js";
/**
 * Audio playlist with playback controls and an elapsed-time seek bar.
 * @tagname tp-audio-playlist
 * @attr {boolean} random = false - Shuffle tracks without repetition; changing this attribute preserves the current track.
 * @attr {string} src = "" - HTML file containing a ul or ol playlist; overrides inline content. Track URLs resolve relative to the file.
 * @example
 * <tp-audio-playlist>
 * <ol>
 * <li>
 * <a href="/docs/components/audio-playlist/examples/track-1.wav">Morning melody</a>
 * </li>
 * <li>
 * <a href="/docs/components/audio-playlist/examples/track-2.wav">Evening melody</a>
 * </li>
 * </ol>
 * </tp-audio-playlist>
 * @accessibility Preserves list semantics and keyboard-operable track links, marks the current track with aria-current, and announces status changes.
 * @accessibilityresponsibility Supply meaningful track titles and transcripts for spoken content.
 */
export declare class TpAudioPlaylist extends TpBase {
    static get observedAttributes(): string[];
    private audio;
    private status;
    private transport;
    private playback;
    private muteButton;
    private position;
    private volumeControl;
    private timeLabel;
    private trackTitle;
    private modes;
    private previous;
    private next;
    private tracks;
    private order;
    private current;
    private generation;
    private remoteList;
    private request;
    private sourceGeneration;
    private loading;
    private hiddenLists;
    private observer;
    get src(): string;
    set src(value: string);
    private syncInlineVisibility;
    private loadSource;
    private onClick;
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    private render;
    private renderTransport;
    private updateTransport;
    private refresh;
    private reorder;
    private move;
    private select;
    private message;
    private update;
}
