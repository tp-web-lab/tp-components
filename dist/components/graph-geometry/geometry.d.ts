export declare const GEOMETRY_COLORS: string[];
export declare const GEOMETRY_STYLES: readonly ["hidden", "dotted", "dashed", "solid"];
export type GeometryStroke = "dotted" | "dashed" | "solid";
export interface GeometryPoint {
    x: number;
    y: number;
}
export declare const GEOMETRY_TRANSFORMATIONS: readonly ["axialSymmetry", "centralSymmetry", "homothety", "rotation", "translation"];
export type GeometryTransformation = (typeof GEOMETRY_TRANSFORMATIONS)[number];
export type GeometryDefinition = {
    kind: "measure";
    offset?: GeometryPoint;
    operation: "length" | "area" | "angle";
    inputs: string[];
} | {
    kind: "transform";
    operation: GeometryTransformation;
    object: string | GeometryDefinition;
    support: string;
    output: GeometryValue["kind"];
    amount: number;
} | {
    kind: "polygon";
    vertices: string[];
} | {
    kind: "regularPolygon";
    first: string;
    second: string;
    sides: number;
} | {
    kind: "point";
    x: number;
    y: number;
} | {
    kind: "on";
    object: string;
    parameter: number;
} | {
    kind: "intersection";
    first: string;
    second: string;
    branch: number;
} | {
    kind: "line" | "ray" | "vector";
    first: string;
    second: string;
} | {
    kind: "segment";
    first: string;
    second: string;
    length?: number;
} | {
    kind: "midpoint" | "perpendicularBisector";
    segment: string;
} | {
    kind: "parallel" | "perpendicular";
    point: string;
    support: string;
} | {
    kind: "bisector";
    first: string;
    vertex: string;
    second: string;
} | {
    kind: "tangent";
    point: string;
    circle: string;
    branch: number;
} | {
    kind: "comment";
    point: string;
    text: string;
} | {
    kind: "circle";
    center: string;
    radius: number | {
        through: string;
    } | {
        distance: [string, string];
    };
} | {
    kind: "arc" | "sector";
    circle: string;
    start: number;
    end: number;
    clockwise: boolean;
    relativeTo?: string;
};
export interface GeometryObject {
    id: string;
    hidden: boolean;
    stroke?: GeometryStroke;
    color?: string;
    definition: GeometryDefinition;
}
export type GeometryValue = {
    kind: "polygon";
    vertices: GeometryPoint[];
} | {
    kind: "point";
    point: GeometryPoint;
} | {
    kind: "line" | "segment" | "ray" | "vector";
    first: GeometryPoint;
    second: GeometryPoint;
} | {
    kind: "comment";
    point: GeometryPoint;
    text: string;
    angleMark?: {
        vertex: GeometryPoint;
        start: number;
        sweep: number;
        right: boolean;
    };
} | {
    kind: "circle";
    center: GeometryPoint;
    radius: number;
} | {
    kind: "arc" | "sector";
    center: GeometryPoint;
    radius: number;
    start: number;
    sweep: number;
};
export interface GeometryResult {
    values: Map<string, GeometryValue | null>;
    errors: Map<string, string>;
}
export declare const distance: (a: GeometryPoint, b: GeometryPoint) => number;
/** Parses construction commands and validates their dependency graph. */
export declare function parseGeometry(source: string): GeometryObject[];
/** Geometric kind produced by a construction, independent of its recipe. */
export declare function constructionKind(d: GeometryDefinition): GeometryValue["kind"];
export declare function dependencies(d: GeometryDefinition): string[];
export declare function isLinear(value: GeometryValue): value is Extract<GeometryValue, {
    kind: "line" | "segment" | "ray" | "vector";
}>;
export declare function contains(value: GeometryValue, p: GeometryPoint): boolean;
/** Returns stable oriented branches, keeping absent branches null after arc/segment clipping. */
export declare function intersections(a: GeometryValue, b: GeometryValue): (GeometryPoint | null)[];
export declare function evaluateGeometry(objects: readonly GeometryObject[]): GeometryResult;
export declare function parameterAt(support: GeometryValue, p: GeometryPoint): number;
export declare function serializeGeometry(objects: readonly GeometryObject[]): string;
export declare const MEDIATRIX_CONSTRUCTION = "point A = (-3, 0)\npoint B = (3, 0)\nsegment AB = segment(A, B)\ncircle cA = circle(A, distance(A, B)) hidden\ncircle cB = circle(B, distance(A, B)) hidden\narc aC = arc(cA, start=40deg, end=80deg, relative-to=AB)\narc aD = arc(cA, start=280deg, end=320deg, relative-to=AB)\narc bC = arc(cB, start=100deg, end=140deg, relative-to=AB)\narc bD = arc(cB, start=220deg, end=260deg, relative-to=AB)\npoint C = intersection(aC, bC, branch=0)\npoint D = intersection(aD, bD, branch=1)\nline m = line(C, D)";
