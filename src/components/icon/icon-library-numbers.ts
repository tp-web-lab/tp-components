import { registerTpIconLibraryFromGlob } from "./icon-vite.js";

const numberIcons = import.meta.glob(
	"/src/components/icon/icons/numbers/*.svg",
	{
		query: "?raw",
		import: "default",
		eager: true,
	},
) as Record<string, string>;

registerTpIconLibraryFromGlob("numbers", numberIcons, {
	stripPrefix: "/src/components/icon/icons/numbers/",
	stripSuffix: ".svg",
	namePrefix: "",
	normalize: "none",
});
