/**
 * @module components/graph-query-tree
 * @summary Relational query-tree editor with equivalent SQL generation.
 */
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
import { type TpGraphDocument, type TpGraphEdge, type TpGraphEdgeDirection, TpGraphEditor, type TpGraphNode, type TpGraphPoint, type TpGraphPort } from "../graph-editor/graph-editor.js";
export declare const TP_QUERY_RELATION = "query-relation";
export declare const TP_QUERY_SELECTION = "query-selection";
export declare const TP_QUERY_PROJECTION = "query-projection";
export declare const TP_QUERY_RENAME = "query-rename";
export declare const TP_QUERY_AGGREGATION = "query-aggregation";
export declare const TP_QUERY_SORT = "query-sort";
export declare const TP_QUERY_JOIN = "query-join";
export declare const TP_QUERY_PRODUCT = "query-product";
export declare const TP_QUERY_UNION = "query-union";
export declare const TP_QUERY_INTERSECTION = "query-intersection";
export declare const TP_QUERY_DIFFERENCE = "query-difference";
export declare const TP_QUERY_EDGE = "query-edge";
export declare function validateQueryTree(graph: Readonly<TpGraphDocument>): void;
export declare function queryTreeToSql(graph: Readonly<TpGraphDocument>): string;
/**
 * Relational query-tree specialization of `<tp-graph-editor>`.
 * @summary Edits relational algebra trees and generates equivalent SQL.
 * @tagname tp-graph-query-tree
 * @example
 * <tp-graph-query-tree></tp-graph-query-tree>
 */
export declare class TpGraphQueryTree extends TpGraphEditor {
    private static readonly queryStyleId;
    private selectedQueryId;
    constructor();
    protected connectedCallback(): void;
    /**
     * @summary Validates the specialized graph before replacing the editor graph; retains the base editor cloning and undo-history behavior. Invalid data throws without replacing the graph.
     */
    setGraph(graph: TpGraphDocument): void;
    /**
     * @summary Adds a query operator or comment at graph coordinates point with the optional label; returns a detached node record. Unsupported types throw TypeError.
     */
    addNode(type: string, point: TpGraphPoint, nodeLabel?: string): TpGraphNode;
    /**
     * @summary Adds a forward query-tree edge between compatible existing nodes and returns its record; unsupported directions or invalid connections throw.
     */
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection): TpGraphEdge;
    /**
     * @summary Returns the SQL query generated from the current query tree; invalid tree structure raises a validation error.
     */
    toSql(): string;
    protected edgeDirections(): readonly TpGraphEdgeDirection[];
    protected validateConnection(source: string, target: string, type: string): void;
    protected renderToolbarActions(): string;
    protected bindExtensionEvents(): void;
    protected renderResults(): string;
    private selectedNode;
    private expressionKey;
    private updateSelectedData;
    private updateQueryControls;
}
