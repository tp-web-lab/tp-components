/**
 * Regenerates the textfield grouped Attributes example while preserving Basic usage and
 * complementary examples.
 *
 * Run from the tp-components package root with workspace dependencies installed.
 *
 * @example
 * node scripts/sync-textfield-examples.mjs
 */

import { standardizeComponentExamples } from "./standardize-component-examples.mjs";

// Preserve Basic usage and regenerate the grouped pilot.
console.log(standardizeComponentExamples(["textfield"]));
