/** A named geographic point, with plain-text content only. */
export interface MapLocation {
    /** Latitude in decimal degrees. */
    lat: number;
    /** Longitude in decimal degrees. */
    lon: number;
    /** Human-readable marker title. */
    title: string;
}
/** Geometry extracted from GPX without executing or inserting its XML. */
export interface GpxData {
    /** Named waypoints. */
    locations: MapLocation[];
    /** Independent track segments and routes; gaps are never joined. */
    segments: [number, number][][];
    /** Continuous runs of altitude samples; distance is cumulative kilometres without inter-segment jumps. */
    elevationSegments: {
        x: number;
        y: number;
    }[][];
}
/** Discrete elevation statistics; gaps never contribute to ascent or descent. */
export declare function elevationStatistics(segments: GpxData["elevationSegments"]): {
    /** Sum of positive consecutive elevation differences, in metres. */
    ascent: number;
    /** Absolute sum of negative consecutive elevation differences, in metres. */
    descent: number;
    /** Arithmetic mean of all recorded elevations, in metres. */
    mean: number;
    /** Median of all recorded elevations, in metres. */
    median: number;
} | null;
/** Great-circle distance in kilometres, using Leaflet's mean Earth radius. */
export declare function geographicDistance(a: [number, number], b: [number, number]): number;
/** Parses GPX 1.0/1.1 geometry; rejects unsafe XML and invalid coordinates. */
export declare function parseGpx(source: string): GpxData;
