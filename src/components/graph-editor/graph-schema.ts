/** @module components/graph-editor/graph-schema @summary Runtime schema for tp/graph documents. */

import { z } from 'zod';

const GraphPointSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
});

const GraphPortSchema = z.enum(['north', 'east', 'south', 'west']);
const GraphMeasurementSchema = z.object({
  id: z.string().min(1),
  label: z.string().optional(),
  position: z.number().finite().min(0).max(1),
}).passthrough();

const GraphNodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  x: z.number().finite(),
  y: z.number().finite(),
  label: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  state: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

const GraphEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1).optional(),
  target: z.string().min(1).optional(),
  sourcePoint: GraphPointSchema.optional(),
  targetPoint: GraphPointSchema.optional(),
  sourcePort: GraphPortSchema.optional(),
  targetPort: GraphPortSchema.optional(),
  type: z.string().optional(),
  direction: z.enum(['none', 'forward', 'backward', 'both']).optional(),
  routing: z.enum(['straight', 'orthogonal']).optional(),
  elbows: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  departure: z.enum(['horizontal', 'vertical']).optional(),
  turns: z.enum(['alternating', 'same']).optional(),
  bendX: z.number().finite().optional(),
  bendY: z.number().finite().optional(),
  label: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  state: z.record(z.string(), z.unknown()).optional(),
}).passthrough().superRefine((edge, context) => {
  if (edge.data?.measurements !== undefined) {
    const result = z.array(GraphMeasurementSchema).safeParse(edge.data.measurements);
    if (!result.success) context.addIssue({
      code: 'custom', path: ['data', 'measurements'], message: 'Measurements must have a unique id and a position between 0 and 1.',
    });
    else if (new Set(result.data.map((measurement) => measurement.id)).size !== result.data.length) context.addIssue({
      code: 'custom', path: ['data', 'measurements'], message: 'Measurement ids must be unique on an edge.',
    });
  }
  if (edge.source === undefined && edge.sourcePoint === undefined) {
    context.addIssue({ code: 'custom', path: ['source'], message: 'A source node or sourcePoint is required.' });
  }
  if (edge.target === undefined && edge.targetPoint === undefined) {
    context.addIssue({ code: 'custom', path: ['target'], message: 'A target node or targetPoint is required.' });
  }
});

export const TpGraphDocumentSchema = z.object({
  version: z.literal(1),
  title: z.string().optional(),
  nodes: z.array(GraphNodeSchema),
  edges: z.array(GraphEdgeSchema),
  data: z.record(z.string(), z.unknown()).optional(),
}).passthrough().superRefine((graph, context) => {
  const ids = new Set<string>();
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  for (const [index, node] of graph.nodes.entries()) {
    if (ids.has(node.id)) context.addIssue({ code: 'custom', path: ['nodes', index, 'id'], message: `Duplicate id: ${node.id}` });
    ids.add(node.id);
  }
  for (const [index, edge] of graph.edges.entries()) {
    if (ids.has(edge.id)) context.addIssue({ code: 'custom', path: ['edges', index, 'id'], message: `Duplicate id: ${edge.id}` });
    ids.add(edge.id);
    if (edge.source !== undefined && !nodes.has(edge.source)) {
      context.addIssue({ code: 'custom', path: ['edges', index, 'source'], message: `Unknown node: ${edge.source}` });
    }
    if (edge.target !== undefined && !nodes.has(edge.target)) {
      context.addIssue({ code: 'custom', path: ['edges', index, 'target'], message: `Unknown node: ${edge.target}` });
    }
    if (edge.source !== undefined && edge.source === edge.target && nodes.get(edge.source)?.type === 'hub') {
      context.addIssue({ code: 'custom', path: ['edges', index], message: 'Self-links are not allowed on hubs.' });
    }
  }
});

export function formatGraphSchemaError(error: z.ZodError): string {
  return error.issues.map((issue) => {
    const path = issue.path.length === 0 ? 'graph' : issue.path.join('.');
    return `${path}: ${issue.message}`;
  }).join('\n');
}
