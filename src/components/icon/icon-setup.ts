/**
 * @module components/icon/icon-setup
 * @summary Registers the internal library `tp`.
 */

import { tpInternalIcons } from './icon-internal.js';
import { hasTpIcon, registerTpIconLibrary } from './icon-registry.js';

/**
 * Registers the internal library `tp`.
 */
export function setupTpIcons(): void {
  if (hasTpIcon('close', 'tp') && hasTpIcon('check', 'tp')) {
    return;
  }

  registerTpIconLibrary('tp', tpInternalIcons);
}