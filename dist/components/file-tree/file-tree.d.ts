/**
 * @module components/file-tree
 * @summary Displays an interactive file and folder tree.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-tree
 * @summary Generic tree component for interactive hierarchical editing.
 */
import { TpBase } from "../base/base.js";
import "../tree/tree.js";
import "../icon/icon.js";
/**
 * Type logique d’un nœud de fichier.
 *
 * @summary Représente un fichier ou un dossier.
 */
export type TpFileTreeNodeKind = "file" | "directory";
/**
 * Nœud logique du file tree.
 *
 * @summary Représente un nœud rendu par `<tp-file-tree>`.
 */
export interface TpFileTreeNode {
    /**
     * Type du nœud.
     */
    kind: TpFileTreeNodeKind;
    /**
     * Nom local du nœud.
     */
    name: string;
    /**
     * Chemin logique absolu du nœud.
     */
    path: string;
    /**
     * Enfants directs.
     */
    children: TpFileTreeNode[];
}
export interface TpFileTreeState {
    nodes: readonly TpFileTreeNode[];
    selectedPath?: string | null;
    activePath?: string | null;
    openPaths?: readonly string[];
    dirtyPaths?: readonly string[];
}
/**
 * Détail d’un événement portant un chemin.
 *
 * @summary Représente une action ciblant un chemin.
 */
export interface TpFileTreePathDetail {
    /**
     * Chemin logique concerné.
     */
    path: string;
}
/**
 * Détail d’une demande de renommage.
 *
 * @summary Représente un renommage demandé sur un chemin.
 */
export interface TpFileTreeRenameRequestDetail {
    /**
     * Ancien chemin.
     */
    path: string;
    /**
     * Nouveau nom local demandé.
     */
    newName: string;
}
/**
 * Détail d’une demande d’ajout.
 *
 * @summary Représente un ajout demandé sous un chemin.
 */
export interface TpFileTreeAddRequestDetail {
    /**
     * Chemin cible ou `null` pour la racine.
     */
    path: string | null;
    /**
     * Type de nœud demandé.
     */
    kind: TpFileTreeNodeKind;
}
/**
 * Détail d’une action globale.
 *
 * @summary Représente une action de menu global.
 */
export interface TpFileTreeGlobalActionDetail {
    /**
     * Identifiant de l’action choisie.
     */
    actionId: "expand-all" | "collapse-all" | "toggle-guides";
}
/**
 * Détail d’une demande de déplacement.
 *
 * @summary Représente un déplacement demandé entre deux chemins.
 */
export interface TpFileTreeMoveRequestDetail {
    /**
     * Chemin source.
     */
    sourcePath: string;
    /**
     * Chemin destination ou `null`.
     */
    destinationPath: string | null;
    /**
     * Position relative.
     */
    position: "inside" | "before" | "after";
}
/**
 * `<tp-file-tree>` affiche une arborescence de fichiers via `<tp-tree>`.
 *
 * Ce composant est un adaptateur spécialisé :
 *
 * - `<tp-tree>` fournit l’UI générique d’arbre
 * - `<tp-file-tree>` traduit cette UI en concepts fichier/dossier
 * - `<tp-filesystem>` reste responsable de la logique métier réelle
 *
 * Le composant rend toujours une racine logique `/`, trie les dossiers avant
 * les fichiers, ajoute des icônes de fichiers, puis réémet des événements
 * spécialisés contenant des chemins.
 *
 * Il ne modifie pas lui-même le projet : les actions comme rename, delete,
 * clone, move ou add sont converties en événements afin qu’un composant parent
 * applique les changements.
 *
 * @summary Arbre spécialisé pour fichiers et dossiers.
 * @tagname tp-file-tree
 *
 *




















 * @example
 * <tp-file-tree></tp-file-tree>
 * @cssprop [--tp-file-tree-active-color=inherit] Text color of the active file row.
 * @cssprop [--tp-file-tree-dirty-color=#d97706] Color of the dot marking a file with unsaved changes.
 * @cssprop [--tp-file-tree-icon-size=1rem] Width and height of file and directory icons.
 * @cssprop [--tp-file-tree-open-color=inherit] Text color of rows whose paths are marked as open.
 * @cssprop [--tp-file-tree-selected-bg=color-mix(in srgb, currentColor 8%, transparent)] Background color of the selected path row.
 * @eventdetail tp-file-tree-active { path: string }
 * @event tp-file-tree-active Emitted when selecting a file makes it active; path identifies the file. Selecting an already active file can emit it again.
 * @eventdetail tp-file-tree-open { path: string }
 * @event tp-file-tree-open Emitted when a file is selected for opening; path identifies the file. Selecting an already open file can emit it again.
 * @eventdetail tp-file-tree-select { path: string }
 * @event tp-file-tree-select Emitted after a file or directory row is selected; path identifies the selected entry.
 * @eventdetail tp-file-tree-add-request { path: string | null; kind: "file" | "directory" }
 * @event tp-file-tree-add-request Requests creation of a file or directory; path is the target path, or null for the root, and kind specifies the entry type. The consumer performs the creation.
 * @eventdetail tp-file-tree-clone-request { path: string }
 * @event tp-file-tree-clone-request Requests duplication of the entry at path; the consumer performs the copy.
 * @eventdetail tp-file-tree-copy-request { path: string }
 * @event tp-file-tree-copy-request Requests copying the selected path to the clipboard; the consumer performs the copy.
 * @eventdetail tp-file-tree-delete-request { path: string }
 * @event tp-file-tree-delete-request Requests deletion of the entry at path; the consumer performs the deletion.
 * @eventdetail tp-file-tree-global-action { actionId: "expand-all" | "collapse-all" | "toggle-guides" }
 * @event tp-file-tree-global-action Emitted when a global context-menu action is chosen; actionId contains its identifier.
 * @eventdetail tp-file-tree-move-request { sourcePath: string; destinationPath: string | null; position: "inside" | "before" | "after" }
 * @event tp-file-tree-move-request Requests moving sourcePath relative to destinationPath at position; a null destination denotes the root. The consumer performs the move.
 * @eventdetail tp-file-tree-rename-request { path: string; newName: string }
 * @event tp-file-tree-rename-request Requests renaming the entry at path to newName; the consumer performs the rename.
 */
export declare class TpFileTree extends TpBase {
    /**
     * Identifiant unique de la feuille de styles globale.
     *
     * @summary Identifiant du style injecté.
     * @internal
     */
    private static readonly styleId;
    /**
     * Nœuds racine actuellement rendus sous `/`.
     *
     * @summary Représente l’arborescence racine.
     * @internal
     */
    private nodes;
    /**
     * Chemin actuellement sélectionné.
     *
     * @summary Référence vers le chemin sélectionné.
     * @internal
     */
    private selectedPath;
    /**
     * Chemin actuellement actif.
     *
     * @summary Référence vers le chemin actif.
     * @internal
     */
    private activePath;
    /**
     * Ensemble des chemins ouverts.
     *
     * @summary Mémorise les chemins ouverts.
     * @internal
     */
    private readonly openPaths;
    private readonly dirtyPaths;
    /**
     * Référence vers l’arbre interne.
     *
     * @summary Référence vers `<tp-tree>`.
     * @internal
     */
    private treeEl;
    /**
     * Initialise le composant.
     *
     * @summary Injecte les styles, rend l’arbre initial et lie les événements.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Nettoie le composant.
     *
     * @summary Supprime les abonnements internes.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @summary Replaces the displayed nodes and selected, active, open and dirty paths together; rerenders the tree and expands its directories.
     */
    setState(state: TpFileTreeState): void;
    /**
     * @summary Replaces the root nodes with a recursively sorted copy while retaining selected, active, open and dirty paths.
     */
    setNodes(nodes: readonly TpFileTreeNode[]): void;
    /**
     * @summary Returns a detached, recursively sorted copy of the root nodes, with directories before files.
     */
    getNodes(): TpFileTreeNode[];
    /**
     * @summary Sets the highlighted selected path; null clears selection. Retains the active path and file states.
     */
    setSelectedPath(path: string | null): void;
    /**
     * @summary Sets the active-file path; null clears the active marker without changing selection.
     */
    setActivePath(path: string | null): void;
    /**
     * @summary Replaces the set of file paths marked as open; does not change the active or selected path.
     */
    setOpenPaths(paths: readonly string[]): void;
    /**
     * @summary Replaces the set of file paths marked as modified; an empty array removes every modified marker.
     */
    setDirtyPaths(paths: readonly string[]): void;
    /**
     * @summary Expands every directory in the displayed tree; has no effect before the internal tree is created.
     */
    expandAll(): void;
    /**
     * @summary Collapses every directory in the displayed tree; has no effect before the internal tree is created.
     */
    collapseAll(): void;
    /**
     * @summary Starts inline renaming for the tree item matching path; does nothing for an empty or missing path.
     */
    beginRenamePath(path: string): void;
    /**
     * Injecte la feuille de styles spécifique à `<tp-file-tree>` si nécessaire.
     *
     * Le style est ajouté une seule fois dans le document afin de conserver
     * un rendu light DOM sans dupliquer les règles CSS à chaque instance.
     *
     * @summary Injecte le CSS du composant.
     * @internal
     */
    private ensureStyles;
    /**
     * Lie les événements internes.
     *
     * @summary Abonne l’arbre interne aux événements utiles.
     * @internal
     */
    private bindEvents;
    /**
     * Supprime les événements internes.
     *
     * @summary Nettoie les abonnements internes.
     * @internal
     */
    private unbindEvents;
    /**
     * Réagit à la sélection d’un nœud dans l’arbre.
     *
     * Sur un fichier, un simple clic entraîne sélection, activation et ouverture.
     * Sur un dossier, seul l’événement de sélection est émis.
     *
     * @summary Traduit la sélection générique en événements spécialisés.
     * @param event Événement de sélection du tree.
     * @internal
     */
    private readonly handleTreeSelect;
    /**
     * Réagit aux actions du menu contextuel.
     *
     * Les actions globales sont réémises.
     * L’action locale `copy` est convertie en événement spécialisé.
     *
     * @summary Traduit les actions de menu utiles au file tree.
     * @param event Événement d’action du tree.
     * @internal
     */
    private readonly handleTreeContextAction;
    /**
     * Réagit à une action globale.
     *
     * @summary Réémet les actions globales utiles du file tree.
     * @param actionId Identifiant de l’action globale.
     * @internal
     */
    private handleGlobalContextAction;
    /**
     * Réagit aux demandes d’ajout génériques.
     *
     * @summary Réémet une demande d’ajout spécialisée fichier.
     * @param event Demande d’ajout du tree.
     * @internal
     */
    private readonly handleTreeAddRequest;
    /**
     * Réagit aux demandes de clonage génériques.
     *
     * @summary Réémet une demande de clonage spécialisée fichier.
     * @param event Demande de clonage du tree.
     * @internal
     */
    private readonly handleTreeCloneRequest;
    /**
     * Réagit aux demandes de suppression génériques.
     *
     * @summary Réémet une demande de suppression spécialisée fichier.
     * @param event Demande de suppression du tree.
     * @internal
     */
    private readonly handleTreeDeleteRequest;
    /**
     * Réagit aux demandes de renommage génériques.
     *
     * @summary Réémet une demande de renommage spécialisée fichier.
     * @param event Demande de renommage du tree.
     * @internal
     */
    private readonly handleTreeRenameRequest;
    /**
     * Réagit aux demandes de déplacement génériques.
     *
     * @summary Réémet une demande de déplacement spécialisée fichier.
     * @param event Demande de déplacement du tree.
     * @internal
     */
    private readonly handleTreeMoveRequest;
    /**
     * Rend complètement le composant.
     *
     * @summary Reconstruit le `tp-tree` interne.
     * @internal
     */
    private render;
    /**
     * Rend la racine logique `/`.
     *
     * @summary Produit le nœud racine du file tree.
     * @returns Élément `<li>` racine.
     * @internal
     */
    private renderRootNode;
    /**
     * Rend un nœud logique en élément `<li>`.
     *
     * @summary Produit un nœud DOM pour l’arbre.
     * @param node Nœud logique à rendre.
     * @param isRoot Indique s’il s’agit de la racine `/`.
     * @returns Élément `<li>` correspondant.
     * @internal
     */
    private renderNode;
}
/**
 * Extension des types DOM pour TypeScript.
 *
 * `HTMLElementTagNameMap` associe la balise `<tp-file-tree>` à la classe
 * `TpFileTree`.
 *
 * `HTMLElementEventMap` déclare les événements spécialisés émis par le
 * composant, afin d’obtenir l’autocomplétion et un typage strict de
 * `event.detail`.
 */
declare global {
    interface HTMLElementTagNameMap {
        "tp-file-tree": TpFileTree;
    }
    interface HTMLElementEventMap {
        "tp-file-tree-select": CustomEvent<TpFileTreePathDetail>;
        "tp-file-tree-open": CustomEvent<TpFileTreePathDetail>;
        "tp-file-tree-active": CustomEvent<TpFileTreePathDetail>;
        "tp-file-tree-global-action": CustomEvent<TpFileTreeGlobalActionDetail>;
        "tp-file-tree-add-request": CustomEvent<TpFileTreeAddRequestDetail>;
        "tp-file-tree-clone-request": CustomEvent<TpFileTreePathDetail>;
        "tp-file-tree-delete-request": CustomEvent<TpFileTreePathDetail>;
        "tp-file-tree-copy-request": CustomEvent<TpFileTreePathDetail>;
        "tp-file-tree-rename-request": CustomEvent<TpFileTreeRenameRequestDetail>;
        "tp-file-tree-move-request": CustomEvent<TpFileTreeMoveRequestDetail>;
    }
}
