import { registerTpIconLibraryFromGlob } from "./icon-vite.js";

const screenIcons = import.meta.glob(
	"/src/components/icon/icons/screens/*.svg",
	{
		query: "?raw",
		import: "default",
		eager: true,
	},
) as Record<string, string>;

registerTpIconLibraryFromGlob("screens", screenIcons, {
	stripPrefix: "/src/components/icon/icons/screens/",
	stripSuffix: ".svg",
	namePrefix: "",
	normalize: "none",
});
