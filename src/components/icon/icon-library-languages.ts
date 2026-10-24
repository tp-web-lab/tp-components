import { registerTpIconLibraryFromGlob } from "./icon-vite.js";

const languageIcons = import.meta.glob(
	"/src/components/icon/icons/languages/*.svg",
	{
		query: "?raw",
		import: "default",
		eager: true,
	},
) as Record<string, string>;

registerTpIconLibraryFromGlob("languages", languageIcons, {
	stripPrefix: "/src/components/icon/icons/languages/",
	stripSuffix: ".svg",
	namePrefix: "",
	normalize: "none",
});
