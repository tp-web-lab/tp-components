/**
 * @module components/playground/playground-project-loader
 * @summary Shared project loading helpers for playground components.
 */

import { z } from "zod";

import type { TpFile } from "../filesystem/filesystem.types.js";
import { inferLanguage } from "./playground-example-loader.js";

const PlaygroundFileSchema = z.object({
	path: z.string().min(1),
	content: z.string(),
	language: z.string().optional(),
	readonly: z.boolean().optional(),
});

const PlaygroundProjectSchema = z
	.object({
		id: z.string().optional(),
		label: z.string().optional(),
		name: z.string().optional(),
		entry: z.string().optional(),
		test: z.string().optional(),
		files: z.array(PlaygroundFileSchema),
	})
	.passthrough();

const PlaygroundProjectMetadataSchema = PlaygroundProjectSchema.omit({
	files: true,
}).passthrough();

const PlaygroundFilesManifestSchema = z.object({
	files: z.array(z.string()).default([]),
});

export type TpPlaygroundProjectData = z.infer<typeof PlaygroundProjectSchema>;

export type TpPlaygroundProjectMetadata = z.infer<
	typeof PlaygroundProjectMetadataSchema
>;

export interface TpPlaygroundRepositoryData {
	metadata: TpPlaygroundProjectMetadata;
	files: TpFile[];
}

function joinUrl(baseUrl: string, path: string): string {
	return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function toProjectPath(path: string): string {
	return path.startsWith("/") ? path : `/${path}`;
}

async function fetchJson(url: string): Promise<unknown> {
	const response = await fetch(url, { cache: "no-store" });

	if (!response.ok) {
		throw new Error(`Unable to load JSON: ${url} (${String(response.status)})`);
	}

	try {
		return await response.json();
	} catch (cause: unknown) {
		// Development servers can return their HTML fallback with HTTP 200 for a
		// missing JSON file. Keep the URL visible instead of Safari's vague error.
		throw new Error(
			`Unable to read JSON: ${url}. The file is missing or does not contain valid JSON.`,
			{ cause },
		);
	}
}

async function fetchText(url: string): Promise<string> {
	const response = await fetch(url, { cache: "no-store" });

	if (!response.ok) {
		throw new Error(`Unable to load file: ${url} (${String(response.status)})`);
	}

	return response.text();
}

export function parsePlaygroundProjectJson(
	value: unknown,
): TpPlaygroundProjectData {
	return PlaygroundProjectSchema.parse(value);
}

export function parsePlaygroundProjectMetadata(
	value: unknown,
): TpPlaygroundProjectMetadata {
	return PlaygroundProjectMetadataSchema.parse(value);
}

export async function loadPlaygroundProjectJson(
	url: string,
): Promise<TpPlaygroundProjectData> {
	return parsePlaygroundProjectJson(await fetchJson(url));
}

export function readInlinePlaygroundProjectJson(
	host: ParentNode,
): TpPlaygroundProjectData | null {
	const script = host.querySelector<HTMLScriptElement>(
		':scope > script[type="tp/json"]',
	);

	if (script === null) {
		return null;
	}

	const source = script.textContent?.trim() ?? "";
	if (source === "") {
		return null;
	}

	return parsePlaygroundProjectJson(JSON.parse(source));
}

export async function loadPlaygroundRepository(
	baseUrl: string,
): Promise<TpPlaygroundRepositoryData> {
	const metadata = parsePlaygroundProjectMetadata(
		await fetchJson(joinUrl(baseUrl, "project.json")),
	);
	const manifest = PlaygroundFilesManifestSchema.parse(
		await fetchJson(joinUrl(baseUrl, ".files.json")),
	);
	const files: TpFile[] = [];

	for (const path of manifest.files) {
		const projectPath = toProjectPath(path);
		files.push({
			path: projectPath,
			content: await fetchText(joinUrl(baseUrl, path)),
			language: inferLanguage(projectPath),
		});
	}

	return { metadata, files };
}
