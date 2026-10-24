import { registerTpIconLibraryFromGlob } from "./icon-vite.js";

const letterIcons = import.meta.glob(
	"/src/components/icon/icons/letters/*.svg",
	{
		query: "?raw",
		import: "default",
		eager: true,
	},
) as Record<string, string>;

registerTpIconLibraryFromGlob("letters", letterIcons, {
	stripPrefix: "/src/components/icon/icons/letters/",
	stripSuffix: ".svg",
	namePrefix: "",
	normalize: "none",
});
