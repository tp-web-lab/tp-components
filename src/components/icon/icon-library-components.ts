import { registerTpIconLibraryFromGlob } from "./icon-vite.js";

const componentsIcons = import.meta.glob(
	"/src/components/icon/icons/components/*.svg",
	{
		query: "?raw",
		import: "default",
		eager: true,
	},
) as Record<string, string>;

registerTpIconLibraryFromGlob("components", componentsIcons, {
	stripPrefix: "/src/components/icon/icons/components/",
	stripSuffix: ".svg",
	namePrefix: "",
	normalize: "none",
});
