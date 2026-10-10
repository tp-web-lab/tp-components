/**
 * @module components/markup-playground/extension-menu
 * @summary Rendering and update helpers for the shared markup extension menu.
 */
import type { TpMarkupExtensionId, TpMarkupExtensionMenuItem } from './markup-extension.types.js';
/** Selector for the shared markup extension menu. */
export declare const TP_MARKUP_EXTENSION_MENU_SELECTOR = "[data-tp-markup-extension-menu]";
/** Selector for markup extension items. */
export declare const TP_MARKUP_EXTENSION_ITEM_SELECTOR = "[data-tp-markup-extension-id]";
/** Builds the action name for a markup extension. */
export declare function createMarkupExtensionAction(id: TpMarkupExtensionId): string;
/** Returns whether an action targets a markup extension. */
export declare function isMarkupExtensionAction(action: string): boolean;
/** Extracts a markup extension identifier from an action name. */
export declare function getMarkupExtensionIdFromAction(action: string): TpMarkupExtensionId | null;
/** Renders the shared markup extension menu. */
export declare function renderMarkupExtensionMenu(items: readonly TpMarkupExtensionMenuItem[]): string;
/** Renders a single markup extension menu item. */
export declare function renderMarkupExtensionMenuItem(item: TpMarkupExtensionMenuItem): string;
/** Synchronizes checked states in the markup extension menu. */
export declare function syncMarkupExtensionMenuChecks(root: ParentNode, activeIds: ReadonlySet<TpMarkupExtensionId>): void;
