import type { Terrain } from "./motion.js";
/** A cycling profile with [distance in kilometres, altitude in metres] points. */
export interface TpSlopeProfile {
    id: string;
    name: string;
    points: readonly (readonly [number, number])[];
}
/** Input shared by src, inline JSON and setProfiles(). */
export interface TpSlopeProfiles {
    "speed-base"?: number;
    profiles: readonly TpSlopeProfile[];
}
export interface NormalizedProfile {
    speedBase?: number;
    source: TpSlopeProfile;
    id: string;
    name: string;
    points: Terrain;
}
/** Validate the entire document before returning independent normalized profiles. */
export declare function parseProfiles(input: unknown): NormalizedProfile[];
