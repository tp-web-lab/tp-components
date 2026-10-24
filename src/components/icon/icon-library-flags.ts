import { registerTpIconLibraryFromGlob } from "./icon-vite.js";

const flagIcons = import.meta.glob("/src/components/icon/icons/flags/*.svg", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

registerTpIconLibraryFromGlob("flags", flagIcons, {
	stripPrefix: "/src/components/icon/icons/flags/",
	stripSuffix: ".svg",
	namePrefix: "cif-",
	normalize: "none",
});
