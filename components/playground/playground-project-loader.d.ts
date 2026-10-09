/**
 * @module components/playground/playground-project-loader
 * @summary Shared project loading helpers for playground components.
 */
import { z } from "zod";
import type { TpFile } from "../filesystem/filesystem.types.js";
declare const PlaygroundProjectSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    entry: z.ZodOptional<z.ZodString>;
    test: z.ZodOptional<z.ZodString>;
    files: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
        language: z.ZodOptional<z.ZodString>;
        readonly: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$loose>;
declare const PlaygroundProjectMetadataSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    entry: z.ZodOptional<z.ZodString>;
    test: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export type TpPlaygroundProjectData = z.infer<typeof PlaygroundProjectSchema>;
export type TpPlaygroundProjectMetadata = z.infer<typeof PlaygroundProjectMetadataSchema>;
export interface TpPlaygroundRepositoryData {
    metadata: TpPlaygroundProjectMetadata;
    files: TpFile[];
}
export declare function parsePlaygroundProjectJson(value: unknown): TpPlaygroundProjectData;
export declare function parsePlaygroundProjectMetadata(value: unknown): TpPlaygroundProjectMetadata;
export declare function loadPlaygroundProjectJson(url: string): Promise<TpPlaygroundProjectData>;
export declare function readInlinePlaygroundProjectJson(host: ParentNode): TpPlaygroundProjectData | null;
export declare function loadPlaygroundRepository(baseUrl: string): Promise<TpPlaygroundRepositoryData>;
export {};
