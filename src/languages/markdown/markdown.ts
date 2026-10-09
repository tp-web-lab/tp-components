/**
 * @module markdown
 * @summary High-level Markdown rendering and parsing API based on markdown-it.
 *
 * This module exposes the {@link TpMarkdown} class, which provides synchronous
 * and asynchronous parsing/rendering utilities with support for:
 *
 * - markdown-it plugins
 * - dynamically loaded extensions
 * - YAML front matter
 * - custom rendering environments
 * - asynchronous extension loading
 */

import MarkdownIt from 'markdown-it';
import { registerDefaultMarkdownPlugins } from './markdown-default-plugins.js';
import { registerDefaultMarkdownExtensions } from './markdown-default-extensions.js';
import { loadMarkdownExtension } from './extensions/markdown-extension-loader.js';
import { parseMarkdownFrontMatter } from './markdown-frontmatter.js';

import type {
  TpMarkdownEnvironment,
  TpMarkdownExtension,
  TpMarkdownOptions,
  TpMarkdownParseResult,
  TpMarkdownPlugin,
} from './markdown.types.js';

/**
 * Merges extension options with configuration values extracted from
 * Markdown front matter attributes.
 *
 * Explicit extension options always override front matter values.
 *
 * @param extension - Extension descriptor.
 * @param attributes - Parsed front matter attributes.
 * @returns Extension descriptor with merged options.
 */
function mergeExtensionOptions(
  extension: TpMarkdownExtension,
  attributes: Record<string, unknown>,
): TpMarkdownExtension {
  return {
    ...extension,
    options: {
      ...readFrontMatterExtensionOptions(extension, attributes),
      ...(extension.options ?? {}),
    },
  };
}

/**
 * Reads extension-specific options from front matter attributes.
 *
 * The extension identifier is inferred from the extension descriptor and
 * used as a lookup key inside the front matter attributes object.
 *
 * @param extension - Extension descriptor.
 * @param attributes - Parsed front matter attributes.
 * @returns Front matter options for the extension.
 */
function readFrontMatterExtensionOptions(
  extension: TpMarkdownExtension,
  attributes: Record<string, unknown>,
): Record<string, unknown> {
  const id = getExtensionId(extension);

  if (id === null) {
    return {};
  }

  const value = attributes[id];

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

/**
 * Resolves the identifier associated with an extension.
 *
 * The identifier is either explicitly defined on the extension object or
 * inferred from the parent directory name of the extension URL.
 *
 * @param extension - Extension descriptor.
 * @returns Extension identifier or `null` if unavailable.
 */
function getExtensionId(extension: TpMarkdownExtension): string | null {
  if ('id' in extension && typeof extension.id === 'string') {
    return extension.id;
  }

  const parts = extension.url.split('/').filter((part) => part !== '');

  return parts.at(-2) ?? null;
}

/**
 * High-level Markdown renderer and parser built on top of markdown-it.
 *
 * The class provides utilities for:
 *
 * - rendering Markdown to HTML
 * - parsing Markdown into tokens
 * - loading synchronous or asynchronous extensions
 * - handling YAML front matter
 * - configuring markdown-it plugins
 */
export class TpMarkdown {
  /**
   * Internal markdown-it instance.
   */
  readonly md: MarkdownIt;

  /**
   * Renderer configuration options.
   */
  readonly options: TpMarkdownOptions;

  /**
   * Creates a new Markdown renderer instance.
   *
   * Default markdown-it plugins and built-in extensions are automatically
   * registered during construction.
   *
   * @param options - Markdown renderer configuration.
   * @param extensions - Initial extensions to register.
   */
  public constructor(
    options: TpMarkdownOptions = {},
    extensions: readonly TpMarkdownExtension[] = [],
  ) {
    this.options = {
      html: true,
      linkify: true,
      typographer: true,
      ...options,
    };

    this.md = new MarkdownIt({
      html: this.options.html,
      linkify: this.options.linkify,
      typographer: this.options.typographer,
    });

    registerDefaultMarkdownPlugins(this.md);
    registerDefaultMarkdownExtensions(this.md);

    for (const extension of extensions) {
      void this.useExtension(extension);
    }
  }

  /**
   * Registers a markdown-it plugin.
   *
   * @param plugin - markdown-it plugin function.
   * @param options - Plugin configuration options.
   * @returns Current renderer instance.
   */
  public use(
    plugin: TpMarkdownPlugin,
    options: Record<string, unknown> = {},
  ): this {
    this.md.use(plugin, options);
    return this;
  }

  /**
   * Loads and registers a Markdown extension dynamically.
   *
   * @param extension - Extension descriptor.
   * @returns Current renderer instance.
   */
  public async useExtension(
    extension: TpMarkdownExtension,
  ): Promise<this> {
    const plugin = await loadMarkdownExtension(extension.url);

    this.use(plugin, extension.options ?? {});

    return this;
  }

  /**
   * Loads and registers multiple Markdown extensions sequentially.
   *
   * @param extensions - Extension descriptors.
   * @returns Current renderer instance.
   */
  public async useExtensions(
    extensions: readonly TpMarkdownExtension[],
  ): Promise<this> {
    for (const extension of extensions) {
      await this.useExtension(extension);
    }

    return this;
  }

  /**
   * Parses Markdown into markdown-it tokens.
   *
   * This method only supports already registered extensions.
   * Use {@link parseAsync} when dynamic extension loading is required.
   *
   * @param source - Markdown source content.
   * @param extensions - Additional extensions.
   * @returns Parsed tokens and rendering environment.
   * @throws Error if asynchronous extensions are provided.
   */
  public parse(
    source: string,
    extensions: readonly TpMarkdownExtension[] = [],
  ): TpMarkdownParseResult {
    if (extensions.length > 0) {
      throw new Error(
        'TpMarkdown.parse() cannot load async extensions. Use parseAsync().',
      );
    }

    const frontMatter = parseMarkdownFrontMatter(source);

    const env: TpMarkdownEnvironment = {
      attributes: {
        ...(this.options.attributes ?? {}),
        ...frontMatter.attributes,
      },
    };

    const tokens = this.md.parse(frontMatter.body, env);

    return {
      tokens,
      env,
    };
  }

  /**
   * Asynchronously parses Markdown into markdown-it tokens.
   *
   * Extensions are dynamically loaded before parsing.
   *
   * @param source - Markdown source content.
   * @param extensions - Extensions to load.
   * @returns Parsed tokens and rendering environment.
   */
  public async parseAsync(
    source: string,
    extensions: readonly TpMarkdownExtension[] = [],
  ): Promise<TpMarkdownParseResult> {
    await this.useExtensions(extensions);

    return this.parse(source);
  }

  /**
   * Renders Markdown into HTML.
   *
   * This method only supports already registered extensions.
   * Use {@link renderAsync} when dynamic extension loading is required.
   *
   * @param source - Markdown source content.
   * @param extensions - Additional extensions.
   * @returns Rendered HTML string.
   * @throws Error if asynchronous extensions are provided.
   */
  public render(
    source: string,
    extensions: readonly TpMarkdownExtension[] = [],
  ): string {
    if (extensions.length > 0) {
      throw new Error(
        'TpMarkdown.render() cannot load async extensions. Use renderAsync().',
      );
    }

    const frontMatter = parseMarkdownFrontMatter(source);

    const env: TpMarkdownEnvironment = {
      attributes: {
        ...(this.options.attributes ?? {}),
        ...frontMatter.attributes,
      },
    };

    return this.md.render(frontMatter.body, env);
  }

  /**
   * Asynchronously renders Markdown into HTML.
   *
   * Extensions are dynamically loaded before rendering and may receive
   * configuration values from YAML front matter attributes.
   *
   * @param source - Markdown source content.
   * @param extensions - Extensions to load.
   * @returns Rendered HTML string.
   */
  public async renderAsync(
    source: string,
    extensions: readonly TpMarkdownExtension[] = [],
  ): Promise<string> {
    const frontMatter = parseMarkdownFrontMatter(source);

    await this.useExtensions(
      extensions.map((extension) =>
        mergeExtensionOptions(extension, frontMatter.attributes),
      ),
    );

    const env: TpMarkdownEnvironment = {
      attributes: {
        ...(this.options.attributes ?? {}),
        ...frontMatter.attributes,
      },
    };

    return this.md.render(frontMatter.body, env);
  }
}
