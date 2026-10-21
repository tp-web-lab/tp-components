export type MathTransformation = "normalization" | "simplification" | "equivalence";
export type MathChecker = (answer: string, expected: string, reportTransformation?: (transformation: MathTransformation) => void) => boolean | undefined;
/** Each question owns its engine; this module is imported only for math grading. */
export declare function createMathChecker(): MathChecker;
