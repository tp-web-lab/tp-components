import { mergeConfig } from "vite";
import config from "./vite.config.js";

/** Keep browser-test optimization and reloads independent from the development server. */
export default mergeConfig(config, {
	cacheDir: "node_modules/.vite-playwright",
	server: { hmr: false, port: 4198, strictPort: true },
});
