/** @module components/icon/chess
 * @summary Lazily registered chess SVG icons.
 */
import { registerTpIconLibraryFromGlob } from "./icon-vite.js";

const chessIcons = import.meta.glob("/src/components/icon/icons/chess/*.svg", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

registerTpIconLibraryFromGlob("chess", chessIcons, {
	stripPrefix: "/src/components/icon/icons/chess/",
	stripSuffix: ".svg",
	namePrefix: "",
	normalize: "none",
});
