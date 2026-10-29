import { promises as fs } from "node:fs";
import path, { resolve } from "node:path";
import { glob } from "glob";
import type { PreRenderedChunk } from "rolldown";
import { searchForWorkspaceRoot } from "vite";
import { defineConfig } from "vitest/config";
import { componentApiPlugin } from "./scripts/component-api-plugin.js";
// import dts from "unplugin-dts/vite";
import { documentPreloadPlugin } from "./scripts/document-preload-plugin.mjs";
import { questionAiPlugin } from "./server/question-ai.mjs";

function sanitizeChunkName(name: string): string {
	return name
		.replaceAll("\\", "/")
		.replace(/^(\.\.\/)+/g, "")
		.replace(/^\/+/g, "")
		.replace(/[:]/g, "_")
		.replace(/\0/g, "");
}

function rewriteDistDemoLoaderPlugin() {
	return {
		name: "rewrite-dist-demo-loader",
		async closeBundle() {
			const demoPath = resolve(__dirname, "dist/demo.html");

			try {
				const source = await fs.readFile(demoPath, "utf8");
				const nextSource = source
					.replace('src="/src/tp-loader.ts"', 'src="tp-loader.js"')
					.replace('src="../dist/tp-loader.js"', 'src="tp-loader.js"');

				if (nextSource !== source) {
					await fs.writeFile(demoPath, nextSource);
				}
			} catch (error: unknown) {
				if (
					error instanceof Error &&
					"code" in error &&
					error.code === "ENOENT"
				) {
					return;
				}

				throw error;
			}
		},
	};
}

function copyComponentApiManifestsPlugin() {
	return {
		name: "copy-component-api-manifests",
		async closeBundle() {
			const files = await glob("src/components/**/*.json", {
				cwd: __dirname,
				posix: true,
			});

			await Promise.all(
				files.map(async (file) => {
					const relativeFromComponents = path.posix.relative(
						"src/components",
						file,
					);
					const outputPath = resolve(
						__dirname,
						"dist/components",
						relativeFromComponents,
					);

					await fs.mkdir(path.dirname(outputPath), { recursive: true });
					await fs.copyFile(resolve(__dirname, file), outputPath);
				}),
			);
		},
	};
}

function previewIndexPlugin() {
	return {
		name: "tp-preview-index",
		async closeBundle() {
			const sourcePath = resolve(__dirname, "index.html");
			const outputPath = resolve(__dirname, "dist/index.html");
			const source = await fs.readFile(sourcePath, "utf8");
			const previewSource = source
				.replace(
					"<title>DEV : tp-components</title>",
					"<title>PREVIEW : tp-components</title>",
				)
				.replace(
					'<script type="module" src="/src/tp-loader.ts"></script>',
					'<script type="module" src="/tp-loader.js"></script>',
				);

			await fs.mkdir(path.dirname(outputPath), { recursive: true });
			await fs.writeFile(outputPath, previewSource);
		},
	};
}

const sourceFiles = await glob("src/**/*.ts", {
	posix: true,
	ignore: [
		"src/**/*.d.ts",
		"src/**/*.test.ts",
		"src/**/*.spec.ts",
		"src/**/*.stories.ts",
		"src/test-helpers/**",
	],
});

const entries = Object.fromEntries(
	sourceFiles.map((file) => {
		const withoutExt = file.replace(/\.ts$/, "");
		const relativeFromSrc = path.posix.relative("src", withoutExt);
		return [relativeFromSrc, resolve(file)];
	}),
);

// Linked @tp packages can live outside this checkout's detected workspace.
const linkedPackageRoots = await Promise.all(
	[
		"@tp/tp-asciidoc",
		"@tp/tp-markdown",
		"@tp/tp-restructuredtext",
		"@tp/tp-utilities",
	].map((name) => fs.realpath(resolve(__dirname, "node_modules", name))),
);

export default defineConfig({
	root: resolve(__dirname),
	plugins: [
		componentApiPlugin(),
		documentPreloadPlugin(),
		questionAiPlugin(),
		rewriteDistDemoLoaderPlugin(),
		copyComponentApiManifestsPlugin(),
		previewIndexPlugin(),
		// dts({
		//   entryRoot: "src",
		//   tsconfigPath: "./tsconfig.json",
		//   insertTypesEntry: true,
		//   exclude: [
		//     "src/**/*.test.ts",
		//     "src/**/*.spec.ts",
		//     "src/**/*.stories.ts",
		//   ],
		//   async afterBuild() {
		//   const from = resolve(__dirname, "dist/index.d.ts");
		//   const to = resolve(__dirname, "dist/tp-lib.d.ts");

		//   try {
		//     await fs.rm(to, { force: true });
		//     await fs.rename(from, to);
		//   } catch (error: unknown) {
		//     if (error instanceof Error) {
		//       console.error(`Rename d.ts failed: ${error.message}`);
		//     } else {
		//       console.error("Rename d.ts failed.");
		//     }
		//   }
		// },
		// }),
	],
	build: {
		copyPublicDir: true,
		cssCodeSplit: false,
		lib: {
			entry: entries,
			name: "tp-lib",
			formats: ["es"],
			cssFileName: "tp-lib",
		},
		outDir: resolve(__dirname, "dist"),
		rolldownOptions: {
			checks: {
				ineffectiveDynamicImport: false,
				pluginTimings: false,
			},
			external: [/^node:.*/],
			output: {
				// These ES modules are also served directly to browsers. Compact the
				// output while retaining annotations for downstream tree shaking.
				minify: true,
				comments: { annotation: true, legal: true },
				format: "es",
				entryFileNames: (chunk: PreRenderedChunk) =>
					chunk.name === "index"
						? "tp-lib.js"
						: `${sanitizeChunkName(chunk.name)}.js`,
				chunkFileNames: (chunk: PreRenderedChunk) =>
					`chunks/${sanitizeChunkName(chunk.name)}.js`,
				// Keep automatic chunk boundaries: broad vendor groups can merge
				// lazy renderers and compilers into the core component graph.
			},
		},
		sourcemap: true,
	},
	optimizeDeps: {
		// Static playground examples use their own import maps, not package dependencies.
		entries: ["**/*.html", "!public/**", "!dist/**", "!node_modules/**"],
		exclude: ["node:fs/promises", "node:path"],
	},
	server: {
		fs: {
			allow: [searchForWorkspaceRoot(__dirname), ...linkedPackageRoots],
		},
		host: "127.0.0.1",
		open: "index.html",
		port: 4173,
		strictPort: false,
		forwardConsole: {
			unhandledErrors: true,
			logLevels: ["warn", "error"],
		},
	},
	preview: {
		host: "127.0.0.1",
		open: "/index.html",
		port: 4173,
		strictPort: false,
	},
	test: {
		// Full DOM editors are integration tests; instrumented runs need headroom
		// without competing for an unbounded number of jsdom workers.
		maxWorkers: 2,
		testTimeout: 20_000,
		environment: "jsdom",
		css: true,
		include: ["src/**/*.test.ts", "server/**/*.test.mjs"],
		exclude: [
			"src/**/*.browser.test.ts",
			"src/**/*.playwright.test.ts",
			"public/**",
			"dist/**",
		],
	},
});
