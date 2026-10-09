/**
 * @module components/file-tree
 * @summary Displays an interactive file and folder tree.
 */

// tp-docgen:dependencies:start
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
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./file-tree.css?inline";

import "../tree/tree.js";
import "../icon/icon.js";

import type {
	TpTree,
	TpTreeContextActionDetail,
	TpTreeContextMenuConfig,
	TpTreeNodeAddRequestDetail,
	TpTreeNodeCloneRequestDetail,
	TpTreeNodeDeleteRequestDetail,
	TpTreeNodeMoveRequestDetail,
	TpTreeNodeRenameRequestDetail,
	TpTreeSelectDetail,
} from "../tree/tree.js";

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
 * Indique si un nœud est un dossier.
 *
 * @summary Type guard pour dossier.
 * @param node Nœud à tester.
 * @returns `true` si le nœud est un dossier.
 * @internal
 */
function isDirectoryNode(node: TpFileTreeNode): boolean {
	return node.kind === "directory";
}

/**
 * Compare deux nœuds de file tree.
 *
 * Les dossiers sont triés avant les fichiers, puis l’ordre alphabétique est appliqué.
 *
 * @summary Trie deux nœuds de fichier.
 * @param left Nœud de gauche.
 * @param right Nœud de droite.
 * @returns Valeur de comparaison standard.
 * @internal
 */
function compareFileTreeNodes(
	left: TpFileTreeNode,
	right: TpFileTreeNode,
): number {
	if (left.kind !== right.kind) {
		return left.kind === "directory" ? -1 : 1;
	}

	return left.name.localeCompare(right.name, undefined, {
		sensitivity: "base",
		numeric: true,
	});
}

/**
 * Retourne une copie triée récursivement d’un nœud.
 *
 * @summary Trie récursivement un sous-arbre de fichiers.
 * @param node Nœud source.
 * @returns Nœud trié.
 * @internal
 */
function sortFileTreeNode(node: TpFileTreeNode): TpFileTreeNode {
	return {
		...node,
		children: node.children
			.map((child) => sortFileTreeNode(child))
			.sort(compareFileTreeNodes),
	};
}

/**
 * Retourne une copie triée récursivement d’une liste de nœuds.
 *
 * @summary Trie récursivement une liste de nœuds racine.
 * @param nodes Nœuds source.
 * @returns Nœuds triés.
 * @internal
 */
function sortFileTreeNodes(nodes: readonly TpFileTreeNode[]): TpFileTreeNode[] {
	return [...nodes]
		.map((node) => sortFileTreeNode(node))
		.sort(compareFileTreeNodes);
}

/**
 * Retourne le nom d’icône à utiliser pour un fichier.
 *
 * Les dossiers n’ont volontairement pas d’icône propre : les marqueurs
 * d’ouverture/fermeture de `<tp-tree>` suffisent à les distinguer.
 *
 * @summary Déduit l’icône d’un fichier depuis son extension.
 * @param path Chemin du fichier.
 * @returns Nom d’icône ou `null`.
 * @internal
 */
function getFileIconName(path: string): string | null {
	const lowerPath = path.toLowerCase();

	if (lowerPath.endsWith(".abc")) {
		return "file_type_abc";
	}

	if (lowerPath.endsWith(".adoc") || lowerPath.endsWith(".asciidoc")) {
		return "file_type_asciidoc";
	}

	if (lowerPath.endsWith(".html") || lowerPath.endsWith(".htm")) {
		return "file_type_html";
	}

	if (
		lowerPath.endsWith(".js") ||
		lowerPath.endsWith(".mjs") ||
		lowerPath.endsWith(".cjs")
	) {
		return "file_type_javascript";
	}

	if (lowerPath.endsWith(".ts") || lowerPath.endsWith(".tsx")) {
		return "file_type_typescript";
	}

	if (lowerPath.endsWith(".css")) {
		return "file_type_css";
	}

	if (lowerPath.endsWith(".json")) {
		return "file_type_json";
	}

	if (lowerPath.endsWith(".md")) {
		return "file_type_markdown";
	}

	if (lowerPath.endsWith(".pl") || lowerPath.endsWith(".prolog")) {
		return "file_type_prolog";
	}

	if (lowerPath.endsWith(".py")) {
		return "file_type_python";
	}

	if (lowerPath.endsWith(".rst") || lowerPath.endsWith(".rest")) {
		return "file_type_restructuredtext";
	}

	if (lowerPath.endsWith(".sql")) {
		return "file_type_sql";
	}

	return "file_type_default";
}

/**
 * Configuration du menu contextuel de `<tp-file-tree>`.
 *
 * `<tp-file-tree>` adapte le menu générique de `<tp-tree>` au vocabulaire fichier :
 * - `add-leaf` devient "Add file"
 * - `add-node` devient "Add folder"
 * - `sort-all` n’est pas exposé dans le menu global car l’arbre de fichiers est
 *   déjà trié récursivement par défaut
 *
 * @summary Décrit les actions globales et locales du file tree.
 * @internal
 */
const FILE_TREE_CONTEXT_MENU_CONFIG: TpTreeContextMenuConfig = {
	globalActions: [
		{ id: "expand-all", label: "Expand all" },
		{ id: "collapse-all", label: "Collapse all" },
		{ id: "toggle-guides", label: "Toggle guides" },
	],
	getNodeActions: (target) => {
		if (target.kind === "directory") {
			return [
				{ id: "add-leaf", label: "Add file" },
				{ id: "add-node", label: "Add folder" },
				{ id: "clone", label: "Clone" },
				{ id: "copy", label: "Copy path" },
				{ id: "rename", label: "Rename" },
				{ id: "delete", label: "Delete", tone: "danger" },
			];
		}

		if (target.kind === "file") {
			return [
				{ id: "clone", label: "Clone" },
				{ id: "copy", label: "Copy path" },
				{ id: "rename", label: "Rename" },
				{ id: "delete", label: "Delete", tone: "danger" },
			];
		}

		return [];
	},
	getNodeCapabilities: (target) => ({
		renamable: target.nodeId !== "/",
		draggable: target.nodeId !== "/",
		droppable: target.kind === "directory",
		addable: target.kind === "directory",
		clonable: target.nodeId !== "/",
		deletable: target.nodeId !== "/",
	}),
};

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
 * @cssprop --tp-file-tree-selected-bg Couleur de fond du chemin sélectionné.
 * @cssprop --tp-file-tree-active-color Couleur du fichier actif.
 * @cssprop --tp-file-tree-open-color Couleur des fichiers ouverts.
 * @cssprop --tp-file-tree-dirty-color Couleur du marqueur dirty.
 * @cssprop --tp-file-tree-icon-size Taille des icônes de fichiers.
 *
 * @event tp-file-tree-select Émis lorsqu’un chemin est sélectionné.
 * @eventdetail tp-file-tree-select { path: string }
 * @event tp-file-tree-open Émis lorsqu’un fichier est ouvert.
 * @eventdetail tp-file-tree-open { path: string }
 * @event tp-file-tree-active Émis lorsqu’un fichier devient actif.
 * @eventdetail tp-file-tree-active { path: string }
 * @event tp-file-tree-global-action Émis lorsqu’une action globale est choisie.
 * @eventdetail tp-file-tree-global-action { action: string }
 * @event tp-file-tree-add-request Émis lorsqu’un ajout de fichier ou dossier est demandé.
 * @eventdetail tp-file-tree-add-request { path: string | null; kind: "file" | "directory" }
 * @event tp-file-tree-clone-request Émis lorsqu’un clonage est demandé.
 * @eventdetail tp-file-tree-clone-request { path: string }
 * @event tp-file-tree-copy-request Émis lorsqu’une copie de chemin est demandée.
 * @eventdetail tp-file-tree-copy-request { path: string }
 * @event tp-file-tree-delete-request Émis lorsqu’une suppression est demandée.
 * @eventdetail tp-file-tree-delete-request { path: string }
 * @event tp-file-tree-rename-request Émis lorsqu’un renommage est demandé.
 * @eventdetail tp-file-tree-rename-request { path: string; newName: string }
 * @event tp-file-tree-move-request Émis lorsqu’un déplacement est demandé.
 * @eventdetail tp-file-tree-move-request { sourcePath: string; destinationPath: string | null; position: "inside" | "before" | "after" }
 * @example
 * <tp-file-tree></tp-file-tree>
 */
export class TpFileTree extends TpBase {
	/**
	 * Identifiant unique de la feuille de styles globale.
	 *
	 * @summary Identifiant du style injecté.
	 * @internal
	 */
	private static readonly styleId = "tp-file-tree-styles";

	/**
	 * Nœuds racine actuellement rendus sous `/`.
	 *
	 * @summary Représente l’arborescence racine.
	 * @internal
	 */
	private nodes: TpFileTreeNode[] = [];

	/**
	 * Chemin actuellement sélectionné.
	 *
	 * @summary Référence vers le chemin sélectionné.
	 * @internal
	 */
	private selectedPath: string | null = null;

	/**
	 * Chemin actuellement actif.
	 *
	 * @summary Référence vers le chemin actif.
	 * @internal
	 */
	private activePath: string | null = null;

	/**
	 * Ensemble des chemins ouverts.
	 *
	 * @summary Mémorise les chemins ouverts.
	 * @internal
	 */
	private readonly openPaths = new Set<string>();

	private readonly dirtyPaths = new Set<string>();

	/**
	 * Référence vers l’arbre interne.
	 *
	 * @summary Référence vers `<tp-tree>`.
	 * @internal
	 */
	private treeEl: TpTree | null = null;

	/**
	 * Initialise le composant.
	 *
	 * @summary Injecte les styles, rend l’arbre initial et lie les événements.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.render();
		this.bindEvents();
	}

	/**
	 * Nettoie le composant.
	 *
	 * @summary Supprime les abonnements internes.
	 * @internal
	 */
	public disconnectedCallback(): void {
		super.connectedCallback();
		this.unbindEvents();
	}

	/**
	 * Définit complètement l’état affiché par le file tree.
	 *
	 * Cette méthode est le point d’entrée recommandé pour synchroniser
	 * `<tp-file-tree>` depuis `<tp-filesystem>`, car elle évite plusieurs rendus
	 * successifs (`setNodes`, puis `setSelectedPath`, etc.).
	 *
	 * @summary Synchronise en une fois les nœuds et états visuels.
	 * @param state État complet à afficher.
	 */
	public setState(state: TpFileTreeState): void {
		this.nodes = sortFileTreeNodes(state.nodes);
		this.selectedPath = state.selectedPath ?? null;
		this.activePath = state.activePath ?? null;

		this.openPaths.clear();

		for (const path of state.openPaths ?? []) {
			this.openPaths.add(path);
		}

		this.dirtyPaths.clear();

		for (const path of state.dirtyPaths ?? []) {
			this.dirtyPaths.add(path);
		}

		this.render();
		this.bindEvents();
		this.treeEl?.expandAll();
	}

	/**
	 * Définit complètement l’arborescence à afficher.
	 *
	 * @summary Charge une nouvelle liste de nœuds racine.
	 * @param nodes Nœuds racine.
	 */
	public setNodes(nodes: readonly TpFileTreeNode[]): void {
		this.setState({
			nodes,
			selectedPath: this.selectedPath,
			activePath: this.activePath,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: Array.from(this.dirtyPaths),
		});
	}

	/**
	 * Retourne les nœuds racine courants.
	 *
	 * @summary Retourne une copie triée des nœuds racine.
	 * @returns Nœuds courants.
	 */
	public getNodes(): TpFileTreeNode[] {
		return this.nodes.map((node) => sortFileTreeNode(node));
	}

	/**
	 * Définit le chemin sélectionné.
	 *
	 * @summary Met à jour la sélection logique.
	 * @param path Chemin sélectionné ou `null`.
	 */
	public setSelectedPath(path: string | null): void {
		this.setState({
			nodes: this.nodes,
			selectedPath: path,
			activePath: this.activePath,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: Array.from(this.dirtyPaths),
		});
	}

	/**
	 * Définit le chemin actif.
	 *
	 * @summary Met à jour l’état actif logique.
	 * @param path Chemin actif ou `null`.
	 */
	public setActivePath(path: string | null): void {
		this.setState({
			nodes: this.nodes,
			selectedPath: this.selectedPath,
			activePath: path,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: Array.from(this.dirtyPaths),
		});
	}

	/**
	 * Définit l’ensemble des chemins ouverts.
	 *
	 * @summary Met à jour l’état logique des chemins ouverts.
	 * @param paths Chemins ouverts.
	 */
	public setOpenPaths(paths: readonly string[]): void {
		this.setState({
			nodes: this.nodes,
			selectedPath: this.selectedPath,
			activePath: this.activePath,
			openPaths: paths,
			dirtyPaths: Array.from(this.dirtyPaths),
		});
	}

	/**
	 * Définit l’ensemble des chemins modifiés.
	 *
	 * @summary Met à jour l’état dirty des fichiers.
	 * @param paths Chemins modifiés.
	 */
	public setDirtyPaths(paths: readonly string[]): void {
		this.setState({
			nodes: this.nodes,
			selectedPath: this.selectedPath,
			activePath: this.activePath,
			openPaths: Array.from(this.openPaths),
			dirtyPaths: paths,
		});
	}

	/**
	 * Déplie complètement l’arbre.
	 *
	 * @summary Ouvre tous les nœuds.
	 */
	public expandAll(): void {
		this.treeEl?.expandAll();
	}

	/**
	 * Replie complètement l’arbre.
	 *
	 * @summary Ferme tous les nœuds.
	 */
	public collapseAll(): void {
		this.treeEl?.collapseAll();
	}

	/**
	 * Démarre le renommage inline d’un chemin.
	 *
	 * @summary Démarre le renommage d’un chemin.
	 * @param path Chemin à renommer.
	 */
	public beginRenamePath(path: string): void {
		const normalizedPath = path.trim();

		if (normalizedPath === "") {
			return;
		}

		const item = this.querySelector(
			`li[data-node-id="${CSS.escape(normalizedPath)}"]`,
		);

		if (!(item instanceof HTMLLIElement)) {
			return;
		}

		this.treeEl?.beginRename(item);
	}

	/**
	 * Injecte la feuille de styles spécifique à `<tp-file-tree>` si nécessaire.
	 *
	 * Le style est ajouté une seule fois dans le document afin de conserver
	 * un rendu light DOM sans dupliquer les règles CSS à chaque instance.
	 *
	 * @summary Injecte le CSS du composant.
	 * @internal
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpFileTree.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpFileTree.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	/**
	 * Lie les événements internes.
	 *
	 * @summary Abonne l’arbre interne aux événements utiles.
	 * @internal
	 */
	private bindEvents(): void {
		this.unbindEvents();

		this.treeEl?.addEventListener(
			"tp-tree-select",
			this.handleTreeSelect as EventListener,
		);
		this.treeEl?.addEventListener(
			"tp-tree-context-action",
			this.handleTreeContextAction as EventListener,
		);
		this.treeEl?.addEventListener(
			"tp-tree-node-add-request",
			this.handleTreeAddRequest as EventListener,
		);
		this.treeEl?.addEventListener(
			"tp-tree-node-clone-request",
			this.handleTreeCloneRequest as EventListener,
		);
		this.treeEl?.addEventListener(
			"tp-tree-node-delete-request",
			this.handleTreeDeleteRequest as EventListener,
		);
		this.treeEl?.addEventListener(
			"tp-tree-node-rename-request",
			this.handleTreeRenameRequest as EventListener,
		);
		this.treeEl?.addEventListener(
			"tp-tree-node-move-request",
			this.handleTreeMoveRequest as EventListener,
		);
	}

	/**
	 * Supprime les événements internes.
	 *
	 * @summary Nettoie les abonnements internes.
	 * @internal
	 */
	private unbindEvents(): void {
		this.treeEl?.removeEventListener(
			"tp-tree-select",
			this.handleTreeSelect as EventListener,
		);
		this.treeEl?.removeEventListener(
			"tp-tree-context-action",
			this.handleTreeContextAction as EventListener,
		);
		this.treeEl?.removeEventListener(
			"tp-tree-node-add-request",
			this.handleTreeAddRequest as EventListener,
		);
		this.treeEl?.removeEventListener(
			"tp-tree-node-clone-request",
			this.handleTreeCloneRequest as EventListener,
		);
		this.treeEl?.removeEventListener(
			"tp-tree-node-delete-request",
			this.handleTreeDeleteRequest as EventListener,
		);
		this.treeEl?.removeEventListener(
			"tp-tree-node-rename-request",
			this.handleTreeRenameRequest as EventListener,
		);
		this.treeEl?.removeEventListener(
			"tp-tree-node-move-request",
			this.handleTreeMoveRequest as EventListener,
		);
	}

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
	private readonly handleTreeSelect = (
		event: CustomEvent<TpTreeSelectDetail>,
	): void => {
		const { target } = event.detail;
		const path = target.nodeId;

		if (typeof path !== "string" || path === "") {
			return;
		}

		this.selectedPath = path;

		this.dispatchEvent(
			new CustomEvent<TpFileTreePathDetail>("tp-file-tree-select", {
				bubbles: true,
				detail: {
					path,
				},
			}),
		);

		if (target.kind !== "file") {
			return;
		}

		this.activePath = path;
		this.openPaths.add(path);

		this.dispatchEvent(
			new CustomEvent<TpFileTreePathDetail>("tp-file-tree-active", {
				bubbles: true,
				detail: {
					path,
				},
			}),
		);

		this.dispatchEvent(
			new CustomEvent<TpFileTreePathDetail>("tp-file-tree-open", {
				bubbles: true,
				detail: {
					path,
				},
			}),
		);
	};

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
	private readonly handleTreeContextAction = (
		event: CustomEvent<TpTreeContextActionDetail>,
	): void => {
		if (event.detail.scope === "global") {
			this.handleGlobalContextAction(event.detail.actionId);
			return;
		}

		if (event.detail.actionId !== "copy") {
			return;
		}

		const path = event.detail.target?.nodeId;

		if (typeof path !== "string" || path === "") {
			return;
		}

		this.dispatchEvent(
			new CustomEvent<TpFileTreePathDetail>("tp-file-tree-copy-request", {
				bubbles: true,
				detail: {
					path,
				},
			}),
		);
	};

	/**
	 * Réagit à une action globale.
	 *
	 * @summary Réémet les actions globales utiles du file tree.
	 * @param actionId Identifiant de l’action globale.
	 * @internal
	 */
	private handleGlobalContextAction(actionId: string): void {
		if (
			actionId !== "expand-all" &&
			actionId !== "collapse-all" &&
			actionId !== "toggle-guides"
		) {
			return;
		}

		this.dispatchEvent(
			new CustomEvent<TpFileTreeGlobalActionDetail>(
				"tp-file-tree-global-action",
				{
					bubbles: true,
					detail: {
						actionId,
					},
				},
			),
		);
	}

	/**
	 * Réagit aux demandes d’ajout génériques.
	 *
	 * @summary Réémet une demande d’ajout spécialisée fichier.
	 * @param event Demande d’ajout du tree.
	 * @internal
	 */
	private readonly handleTreeAddRequest = (
		event: CustomEvent<TpTreeNodeAddRequestDetail>,
	): void => {
		const path =
			event.detail.target?.nodeId !== null &&
			typeof event.detail.target?.nodeId === "string"
				? event.detail.target.nodeId
				: null;

		const kind: TpFileTreeNodeKind =
			event.detail.actionId === "add-node" ? "directory" : "file";

		this.dispatchEvent(
			new CustomEvent<TpFileTreeAddRequestDetail>("tp-file-tree-add-request", {
				bubbles: true,
				detail: {
					path,
					kind,
				},
			}),
		);
	};

	/**
	 * Réagit aux demandes de clonage génériques.
	 *
	 * @summary Réémet une demande de clonage spécialisée fichier.
	 * @param event Demande de clonage du tree.
	 * @internal
	 */
	private readonly handleTreeCloneRequest = (
		event: CustomEvent<TpTreeNodeCloneRequestDetail>,
	): void => {
		const path = event.detail.target.nodeId;

		if (typeof path !== "string" || path === "") {
			return;
		}

		this.dispatchEvent(
			new CustomEvent<TpFileTreePathDetail>("tp-file-tree-clone-request", {
				bubbles: true,
				detail: {
					path,
				},
			}),
		);
	};

	/**
	 * Réagit aux demandes de suppression génériques.
	 *
	 * @summary Réémet une demande de suppression spécialisée fichier.
	 * @param event Demande de suppression du tree.
	 * @internal
	 */
	private readonly handleTreeDeleteRequest = (
		event: CustomEvent<TpTreeNodeDeleteRequestDetail>,
	): void => {
		const path = event.detail.target.nodeId;

		if (typeof path !== "string" || path === "") {
			return;
		}

		this.dispatchEvent(
			new CustomEvent<TpFileTreePathDetail>("tp-file-tree-delete-request", {
				bubbles: true,
				detail: {
					path,
				},
			}),
		);
	};

	/**
	 * Réagit aux demandes de renommage génériques.
	 *
	 * @summary Réémet une demande de renommage spécialisée fichier.
	 * @param event Demande de renommage du tree.
	 * @internal
	 */
	private readonly handleTreeRenameRequest = (
		event: CustomEvent<TpTreeNodeRenameRequestDetail>,
	): void => {
		const path = event.detail.target.nodeId;

		if (typeof path !== "string" || path === "") {
			return;
		}

		this.dispatchEvent(
			new CustomEvent<TpFileTreeRenameRequestDetail>(
				"tp-file-tree-rename-request",
				{
					bubbles: true,
					detail: {
						path,
						newName: event.detail.newLabel,
					},
				},
			),
		);
	};

	/**
	 * Réagit aux demandes de déplacement génériques.
	 *
	 * @summary Réémet une demande de déplacement spécialisée fichier.
	 * @param event Demande de déplacement du tree.
	 * @internal
	 */
	private readonly handleTreeMoveRequest = (
		event: CustomEvent<TpTreeNodeMoveRequestDetail>,
	): void => {
		const sourcePath = event.detail.source.nodeId;
		const destinationPath = event.detail.destination?.nodeId ?? null;

		if (typeof sourcePath !== "string" || sourcePath === "") {
			return;
		}

		this.dispatchEvent(
			new CustomEvent<TpFileTreeMoveRequestDetail>(
				"tp-file-tree-move-request",
				{
					bubbles: true,
					detail: {
						sourcePath,
						destinationPath,
						position: event.detail.position,
					},
				},
			),
		);
	};

	/**
	 * Rend complètement le composant.
	 *
	 * @summary Reconstruit le `tp-tree` interne.
	 * @internal
	 */
	private render(): void {
		this.unbindEvents();
		this.innerHTML = "";

		const tree = document.createElement("tp-tree") as TpTree;
		tree.setAttribute("selectable", "");
		tree.setAttribute("guides", "");

		tree.setContextMenuConfig(FILE_TREE_CONTEXT_MENU_CONFIG);

		const ul = document.createElement("ul");
		ul.append(this.renderRootNode());

		tree.append(ul);
		this.append(tree);

		this.treeEl = tree;
		this.bindEvents();
		tree.expandAll();
	}

	/**
	 * Rend la racine logique `/`.
	 *
	 * @summary Produit le nœud racine du file tree.
	 * @returns Élément `<li>` racine.
	 * @internal
	 */
	private renderRootNode(): HTMLLIElement {
		const rootNode: TpFileTreeNode = {
			kind: "directory",
			name: "/",
			path: "/",
			children: this.nodes,
		};

		return this.renderNode(rootNode, true);
	}

	/**
	 * Rend un nœud logique en élément `<li>`.
	 *
	 * @summary Produit un nœud DOM pour l’arbre.
	 * @param node Nœud logique à rendre.
	 * @param isRoot Indique s’il s’agit de la racine `/`.
	 * @returns Élément `<li>` correspondant.
	 * @internal
	 */
	private renderNode(node: TpFileTreeNode, isRoot = false): HTMLLIElement {
		const li = document.createElement("li");
		li.setAttribute("data-node-id", node.path);
		li.setAttribute("data-kind", node.kind);
		li.setAttribute("data-label", node.name);

		if (this.selectedPath === node.path) {
			li.setAttribute("data-selected-path", "");
		}

		if (this.activePath === node.path) {
			li.setAttribute("data-active-path", "");
		}

		if (this.openPaths.has(node.path)) {
			li.setAttribute("data-open-path", "");
		}

		if (this.dirtyPaths.has(node.path)) {
			li.setAttribute("data-dirty-path", "");
		}

		const row = document.createElement("span");
		row.setAttribute("data-tp-file-tree-row", "");

		if (isRoot) {
			const label = document.createElement("span");
			label.setAttribute("data-tp-file-tree-label", "");
			label.textContent = "/";
			row.append(label);
		} else {
			if (!isDirectoryNode(node)) {
				const iconName = getFileIconName(node.path);

				if (iconName !== null) {
					const icon = document.createElement("tp-icon");
					icon.setAttribute("library", "languages");
					icon.setAttribute("name", iconName);
					icon.setAttribute("fallback-icon", "crosshairs-unknown");
					icon.setAttribute("data-tp-file-tree-icon", "");
					row.append(icon);
				}
			}

			const label = document.createElement("span");
			label.setAttribute("data-tp-file-tree-label", "");
			label.textContent = node.name;
			row.append(label);
		}

		li.append(row);

		if (node.children.length > 0) {
			const ul = document.createElement("ul");

			for (const child of node.children) {
				ul.append(this.renderNode(child));
			}

			li.append(ul);
		}

		return li;
	}
}

/**
 * Enregistre le custom element `<tp-file-tree>` s’il n’est pas déjà défini.
 *
 * Cette vérification évite une erreur lors du rechargement du module,
 * notamment avec Vite en mode HMR.
 */
if (!customElements.get("tp-file-tree")) {
	customElements.define("tp-file-tree", TpFileTree);
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
