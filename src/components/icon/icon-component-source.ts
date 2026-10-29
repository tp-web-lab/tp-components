import { getTpIcon, registerTpIcon } from "./icon-registry.js";

const sources = import.meta.glob<string>(
	"/src/components/icon/icons/components/*.svg",
	{
		query: "?raw",
		import: "default",
	},
);
const pending = new Map<string, Promise<void>>();

/** Load only the requested component icon; the full library remains available to pickers. */
export function loadComponentIcon(name: string): Promise<void> {
	if (getTpIcon(name, "components") !== null) return Promise.resolve();
	const load = sources[`/src/components/icon/icons/components/${name}.svg`];
	if (!load) return Promise.resolve();
	let request = pending.get(name);
	if (!request) {
		request = load()
			.then((svg) => {
				if (getTpIcon(name, "components") === null)
					registerTpIcon(name, svg, "components");
			})
			.finally(() => pending.delete(name));
		pending.set(name, request);
	}
	return request;
}
