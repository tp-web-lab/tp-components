/**
 * @module components/markup-playground/extension-registry
 * @summary Shared registry for markup playground extensions.
 */
import type { TpMarkupExtension, TpMarkupExtensionId, TpMarkupExtensionMenuItem, TpMarkupExtensionState, TpMarkupLanguage, TpMarkupRuntimeExtension } from './markup-extension.types.js';
/** Built-in and optional markup extensions available in the playgrounds. */
export declare const TP_MARKUP_EXTENSIONS: readonly TpMarkupExtension[];
/** Returns the extensions available for a given language. */
export declare function getMarkupExtensionsForLanguage(language: TpMarkupLanguage): TpMarkupExtension[];
/** Returns the optional extensions available for a given language. */
export declare function getOptionalMarkupExtensionsForLanguage(language: TpMarkupLanguage): TpMarkupExtension[];
/** Creates the default enabled state for a language. */
export declare function createDefaultMarkupExtensionState(language: TpMarkupLanguage): TpMarkupExtensionState;
/** Creates menu items for the optional extensions of a language. */
export declare function createMarkupExtensionMenuItems(language: TpMarkupLanguage, activeIds: ReadonlySet<TpMarkupExtensionId>): TpMarkupExtensionMenuItem[];
/** Converts active extensions to runtime descriptors. */
export declare function toMarkupRuntimeExtensions(language: TpMarkupLanguage, activeIds: ReadonlySet<TpMarkupExtensionId>): TpMarkupRuntimeExtension[];
/** Finds an extension by identifier. */
export declare function getMarkupExtensionById(id: TpMarkupExtensionId): TpMarkupExtension | undefined;
/** Toggles an extension identifier in the active set. */
export declare function toggleMarkupExtensionId(activeIds: ReadonlySet<TpMarkupExtensionId>, id: TpMarkupExtensionId): Set<TpMarkupExtensionId>;
