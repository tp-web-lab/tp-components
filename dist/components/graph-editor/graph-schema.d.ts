/** @module components/graph-editor/graph-schema @summary Runtime schema for tp/graph documents. */
import { z } from 'zod';
export declare const TpGraphDocumentSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    title: z.ZodOptional<z.ZodString>;
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        label: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        state: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$loose>>;
    edges: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodOptional<z.ZodString>;
        target: z.ZodOptional<z.ZodString>;
        sourcePoint: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strip>>;
        targetPoint: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strip>>;
        sourcePort: z.ZodOptional<z.ZodEnum<{
            north: "north";
            east: "east";
            south: "south";
            west: "west";
        }>>;
        targetPort: z.ZodOptional<z.ZodEnum<{
            north: "north";
            east: "east";
            south: "south";
            west: "west";
        }>>;
        type: z.ZodOptional<z.ZodString>;
        direction: z.ZodOptional<z.ZodEnum<{
            none: "none";
            both: "both";
            forward: "forward";
            backward: "backward";
        }>>;
        routing: z.ZodOptional<z.ZodEnum<{
            straight: "straight";
            orthogonal: "orthogonal";
        }>>;
        elbows: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>>;
        departure: z.ZodOptional<z.ZodEnum<{
            horizontal: "horizontal";
            vertical: "vertical";
        }>>;
        turns: z.ZodOptional<z.ZodEnum<{
            alternating: "alternating";
            same: "same";
        }>>;
        bendX: z.ZodOptional<z.ZodNumber>;
        bendY: z.ZodOptional<z.ZodNumber>;
        label: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        state: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$loose>>;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$loose>;
export declare function formatGraphSchemaError(error: z.ZodError): string;
