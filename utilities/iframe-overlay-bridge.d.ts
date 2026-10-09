/**
 * Lets same-origin iframe overlays use the top layer of the outer document.
 *
 * An element in an iframe can never paint outside that iframe. Instead of
 * cloning or moving the interactive overlay, this bridge temporarily places
 * the iframe itself in the outer document's top layer while preserving a
 * placeholder at its original position.
 */
export declare class IframeOverlayBridge {
    private readonly iframe;
    private mutationObserver;
    private placeholder;
    private transparencyStyle;
    private originalStyle;
    private promoted;
    private readonly handleLoad;
    private readonly handleViewportChange;
    constructor(iframe: HTMLIFrameElement);
    connect(): void;
    disconnect(): void;
    private observeDocument;
    private sync;
    private promote;
    private updatePlacement;
    /** Keeps the original preview area opaque while the extra overlay area is transparent. */
    private prepareTransparentExtension;
    private measureRequiredHeight;
    private restore;
}
