# Creating a component

<tp-toc position="end" expand-all open brand></tp-toc>

This procedure turns a component idea into a documented, testable and accessible public `tp-*` element. It is exercised with two new components: `tp-text-to-speech`, and `tp-abc-music-viewer`.


component authoring

## Procedure

### Contract

Start with the author’s markup, not the implementation. Choose one canonical custom-element tag whose name begins with the mandatory `tp-` prefix, document every attribute with its type and default, define public methods and events, and state accessibility responsibilities. Prefer progressive enhancement: useful content must remain available when an optional browser API is absent.

The contract should immediately identify every supported declarative form, including an attribute value, an internal script and an external source when applicable. Equivalent forms must provide the same content and behavior.

The `script` element is used as a parser-safe container for raw textual data: the browser preserves its contents without interpreting them as HTML and, because its type is not a JavaScript MIME type, does not execute them. Its `type` identifies the format expected by the component and must follow the library convention by beginning with `tp/`. This also distinguishes component input from executable scripts and lets the component select only the content intended for it.

Every `<tp-NAME>` component that accepts an internal script must support `type="tp/NAME"`. A format-specific type such as `tp/txt` or `tp/abc` may also be accepted; it is an alternative, not a legacy version.

Source precedence is not chosen component by component: the library imposes the same order everywhere. A non-empty `src` takes precedence over `value`, which takes precedence over an internal `script`, which in turn takes precedence over direct text when that fallback is supported. Loading errors must remain visible and must not silently fall back to another source.

<details>
<summary><code>tp-text-to-speech</code>: contract</summary>

The component’s primary purpose is to make text audible, not necessarily to display it. It therefore defines the boolean `show-text` attribute with a default of `false`, and exposes `speak()`, `pause()`, `resume()`, and `stop()`. Its three principal declarative forms contain the same text and produce the same behavior:

```html
<tp-text-to-speech value="Welcome to the tp-components documentation."></tp-text-to-speech>
```

```html
<tp-text-to-speech>
  <script type="tp/txt">
    Welcome to the tp-components documentation.
  </script>
</tp-text-to-speech>
```

```html
<tp-text-to-speech src="./welcome.txt"></tp-text-to-speech>
```

The file `welcome.txt` contains the same sentence. The script type follows the mandatory `tp/` convention, and the common `src` → `value` → script precedence applies.

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: contract</summary>
`tp-abc-music-viewer` belongs to **Viewers**. It pairs editable ABC source with its rendered score, following the shared source/output viewer workflow. It is not a standalone player renamed as a viewer.

There are two existing foundations: executable-language viewers such as `TpJavascriptViewer` specialize their playground with `viewerMode`; single-document viewers such as `TpHtmlViewer` derive from `TpMarkupViewer`. ABC needs the latter, not a project/file-tree runtime. It inherits `TpBase` indirectly. A future multi-file ABC playground would be a separate contract, not a reason to duplicate the viewer UI today.

The shared foundation supplies `tp-code-editor`, source/output toggles, Run, Reset and editor tools. The specialized output adds optional Play/Pause/Resume/Stop controls through `tp-button-group`. Run renders the edited notation; it never starts audio. The source pane replaces the former `show-source` attribute.

The new attributes are `value` (empty by default), `playback` and `tablature` (both false), and `instrument` (`"guitar"`). Inherited `src` and `lite` retain the viewer conventions. This first version accepts one ABC document through `src`, not a project JSON file or comma-separated files. Responsive rendering is always enabled; there is no redundant `responsive` attribute.

```html
<tp-abc-music-viewer value="X:1&#10;K:C&#10;C D E F G A B c|B A G F E D C2|"></tp-abc-music-viewer>
```

```html
<tp-abc-music-viewer>
  <script type="tp/abc">
    X:1
    K:C
    C D E F G A B c|B A G F E D C2|
  </script>
</tp-abc-music-viewer>
```

```html
<tp-abc-music-viewer src="./scale.abc"></tp-abc-music-viewer>
```

`scale.abc` contains the same tune. The shared reader enforces `src` → `value` → script → direct text. Public `play()`, `pause()`, `resume()` and `stop()` affect the current rendered tune, independently of source editing.

</details>

### First version

Create one directory named after the component without the `tp-` prefix. Three files in it are developer-maintained:

- `COMPONENT.ts` defines the public contract, behavior, lifecycle, registration and TSDoc metadata;
- `COMPONENT.css` contains only styles specific to the component and consumes existing global styles and design tokens;
- `COMPONENT.test.ts` provides the dedicated behavioral tests and starts with 100% function coverage.

`COMPONENT.json` must not be written or maintained by hand. It is generated from the TSDoc contract in `COMPONENT.ts` and is then used to synchronize API documentation. Generated files must be refreshed through the library scripts whenever their source changes.

Outside this directory, the developer must also add the public export to `src/index.ts`. This file is the package’s public entry point: exporting the component there makes its class available through `import { TpComponent } from '@tp/tp-components'`, exposes its TypeScript type in the generated package declarations, and ensures consumers do not depend on an internal source path that may change. Component exports are kept in alphabetical order by component name so the entry point remains predictable and duplicates or omissions are easier to review.

Documentation pages, examples, family navigation and quality configuration are integration sources maintained by the developer; API tables and transversal reports are generated from those sources. Extend `TpBase`, register exactly one canonical custom element, and add its tag and class to `HTMLElementTagNameMap`.

<details>
<summary><code>tp-text-to-speech</code>: first version</summary>

The developer initially creates this structure; the JSON manifest appears only after generation:

```text
src/components/text-to-speech/
├── text-to-speech.ts       # defined by the developer
├── text-to-speech.css      # defined by the developer
├── text-to-speech.test.ts  # defined by the developer
└── text-to-speech.json     # generated from TSDoc
```

The initial TypeScript file establishes the tag, base class, public contract and stylesheet connection before behavior is added. Local TypeScript modules are imported from `FILE.js`, not `FILE.ts`: the source refers to the JavaScript module path that will exist after compilation, while TypeScript resolves it to the corresponding source file during development.

```ts
import { TpBase } from '../base/base.js';
import style from './text-to-speech.css?inline';

/**
 * @tagname tp-text-to-speech
 * @summary Reads text aloud with browser speech synthesis.
 * @attr {string} src = "" - External text source.
 * @attr {string} value = "" - Text supplied as an attribute.
 * @attr {boolean} show-text = false - Displays the source text.
 * @attr {string} voice = "" - Preferred installed voice name or language tag.
 * @attr {number} rate = 1 - Speech rate from 0.1 to 10.
 * @attr {number} pitch = 1 - Speech pitch from 0 to 2.
 * @attr {number} volume = 1 - Speech volume from 0 to 1.
 * @attr {boolean} autoplay = false - Starts speaking after text resolution.
 */
export class TpTextToSpeech extends TpBase {
  /** Attributes whose changes must be observed by this component. */
  public static get observedAttributes(): string[] {
    // Preserve TpBase observation of lang and dir, then add local attributes.
    return [
      ...TpBase.observedAttributes,
      'src',
      'value',
      'show-text',
      'voice',
      'rate',
      'pitch',
      'volume',
      'autoplay',
    ];
  }

  // The browser calls this lifecycle hook each time the element is connected.
  protected override connectedCallback(): void {
    // Always retain the initialization performed by TpBase.
    super.connectedCallback();
    this.ensureGlobalStyle('tp-text-to-speech-styles', style);
    this.classList.add('tp-text-to-speech');
  }

  /** Starts reading the current text. */
  public async speak(): Promise<void> {
    // Implemented in a later step.
  }

  /** Pauses the current reading. */
  public pause(): void {
    // Implemented in a later step.
  }

  /** Resumes a paused reading. */
  public resume(): void {
    // Implemented in a later step.
  }

  /** Stops the current reading. */
  public stop(): void {
    // Implemented in a later step.
  }
}

// Avoid redefining the same tag after a repeated import or development reload.
if (!customElements.get('tp-text-to-speech')) {
  customElements.define('tp-text-to-speech', TpTextToSpeech);
}

// Associate the tag name with its class for typed document.createElement() calls.
declare global {
  interface HTMLElementTagNameMap {
    'tp-text-to-speech': TpTextToSpeech;
  }
}
```

Spreading `TpBase.observedAttributes` is important: it preserves the inherited observation of `lang` and `dir`. `tp-text-to-speech` uses the inherited `lang` value as the language requested from the speech engine instead of defining another language attribute. The four public methods already belong to this initial class because they were promised by the contract. Their comments establish their intent, while their empty bodies make it explicit that behavior has not been implemented yet.

Finally, the developer inserts the component export at its alphabetical position in `src/index.ts`:

```ts
// ...
export { TpTextfield, type TpTextfieldLabelPosition, type TpTextfieldType } from './components/textfield/textfield.js';
export { TpTextToSpeech } from './components/text-to-speech/text-to-speech.js';
export { TpTheme } from './components/theme/theme.js';
// ...
```

An explicit named export shows exactly which public class belongs to the package API. The generated manifest is never used as the place to edit an attribute, method or event: such changes always begin in the TypeScript TSDoc and implementation.

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: first version</summary>
The developer creates the same file roles, this time under `src/components/abc-music-viewer/`:

```text
src/components/abc-music-viewer/
├── abc-music-viewer.ts       # developer: specialized viewer
├── abc-music-viewer.css      # developer: only ABC output styles, if needed
├── abc-music-viewer.test.ts  # developer: dedicated tests
└── abc-music-viewer.json     # generated from TSDoc
```

The first class implements the abstract viewer hooks with placeholders. Do not import buttons or abcjs yet: their behavior is introduced later.

```ts
import {
  TpMarkupViewer,
  type MarkupViewerExample,
} from '../markup-viewer/markup-viewer.js';

/**
 * @tagname tp-abc-music-viewer
 * @summary Edits ABC notation and renders a score with optional audio playback.
 * @attr {string} src = "" - URL of one ABC document.
 * @attr {string} value = "" - Inline ABC notation.
 * @attr {boolean} lite = false - Uses the compact viewer interface.
 * @attr {boolean} playback = false - Enables audio controls.
 * @attr {boolean} tablature = false - Adds instrument tablature.
 * @attr {string} instrument = "guitar" - Tablature instrument.
 */
export class TpAbcMusicViewer extends TpMarkupViewer<'score'> {
  /** ABC initially uses the editor's plain-text mode. */
  protected readonly sourceLanguage = 'text';
  /** The first version has one rendered output mode. */
  protected readonly outputModes = [{ value: 'score', label: 'Score' }] as const;
  /** Identifies the viewer for scoped styles and its component toolbar icon. */
  protected readonly viewerClassName = 'tp-abc-music-viewer';

  /** Extends the source and layout attributes inherited from the viewer. */
  public static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'value', 'playback', 'tablature', 'instrument'];
  }

  /** Lets the foundation create the editor, toolbar and output panel. */
  protected override connectedCallback(): void {
    super.connectedCallback();
  }

  /** Placeholder replaced by the shared source reader in the next step. */
  protected readInlineSource(): MarkupViewerExample {
    return { label: 'ABC music', source: '', context: undefined };
  }

  /** ABC has no relative document assets in this first version. */
  protected createExternalContext(_url: URL): undefined {
    return undefined;
  }

  /** Placeholder for the abcjs score renderer. */
  protected async renderOutput(
    _source: string,
    _mode: 'score',
    container: HTMLElement,
    _context: undefined,
  ): Promise<void> {
    container.replaceChildren();
  }

  /** Starts audio from the beginning; implemented in the functionality step. */
  public async play(): Promise<void> {}
  /** Pauses audio; implemented in the functionality step. */
  public pause(): void {}
  /** Resumes paused audio; implemented in the functionality step. */
  public resume(): void {}
  /** Stops audio; implemented in the functionality step. */
  public stop(): void {}
}

// The guard prevents duplicate registration.
if (!customElements.get('tp-abc-music-viewer')) {
  customElements.define('tp-abc-music-viewer', TpAbcMusicViewer);
}

// Associate the canonical tag with its TypeScript class.
declare global {
  interface HTMLElementTagNameMap {
    'tp-abc-music-viewer': TpAbcMusicViewer;
  }
}
```

Export the class from the public entry point, in component-name order:

```ts
// ...
export { TpAbcMusicViewer } from './components/abc-music-viewer/abc-music-viewer.js';
export { TpAccordion, type TpAccordionAppearance } from './components/accordion/accordion.js';
// ...
```

The connection hook delegates to `TpMarkupViewer`, which calls `TpBase`. The registration guard and `declare global` have exactly the same purpose as in the text-to-speech example. The shared toolbar derives its component icon from `viewerClassName`: `tp-abc-music-viewer` selects `abc-music-viewer` from the `components` icon library, including when the demo uses a different HTML tag.

</details>

#### Styles

Every component extends `TpBase` and calls `super.connectedCallback()`. The base class installs the shared design tokens and, unless the target document explicitly preserves its own styles, the library reset and base rules. `TpBase.ensureGlobalStyle(STYLE_ID, CSS_TEXT)` then provides the same idempotent mechanism for component CSS: it looks for `STYLE_ID` in the target document and creates the `<style>` element only when it is absent. Ten instances of a component therefore share one stylesheet per document rather than injecting ten copies.

Use a stable, globally unique identifier such as `tp-COMPONENT-styles`. Keep selectors scoped by the component class, consume existing semantic tokens, and do not recreate a reset, token, or global rule that already belongs to the library. The optional document argument allows the same mechanism to initialize another browsing context, such as a viewer iframe.

<details>
<summary><code>tp-text-to-speech</code>: styles</summary>

The TypeScript module imports its CSS as text, while connection delegates both shared and component-specific style initialization to `TpBase`:

```ts
import style from './text-to-speech.css?inline';

protected override connectedCallback(): void {
  // Installs the shared TpBase styles once in this document.
  super.connectedCallback();
  // Installs this component stylesheet once, regardless of instance count.
  this.ensureGlobalStyle('tp-text-to-speech-styles', style);
  this.classList.add('tp-text-to-speech');
}
```

Its stylesheet remains component-scoped and uses the existing spacing token:

```css
.tp-text-to-speech {
  display: grid;
  gap: var(--tp-space-s);
}
```

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: styles</summary>
`TpMarkupViewer` already installs its shared stylesheet once through `ensureGlobalStyle()`, and `TpBase` installs the library foundations. Do not copy the viewer toolbar, editor, source/output layout, focus styles, or height synchronization into this component.

Only the ABC output may need a scoped rule, for example:

```css
.tp-abc-music-viewer [data-role="music-controls"][hidden] {
  display: none;
}
```

If this stylesheet is needed, import `./abc-music-viewer.css?inline` and call `this.ensureGlobalStyle('tp-abc-music-viewer-styles', style)` after `super.connectedCallback()`. The score uses normal document flow, so its output panel grows with it. No iframe or fixed height is needed for an SVG score. A viewer that does render an iframe should use the foundation's existing iframe sizing lifecycle rather than a new resize loop.

</details>

#### Tests

Test files follow the same Biome rules as implementation files: every `.ts` file, including `.test.ts`, must pass both formatting and lint checks. Passing Vitest or TypeScript alone is not sufficient. Do not exclude tests or suppress rules merely to obtain a passing check.

Add the dedicated test file with the first implementation and grow it in the same change as each behavior. Use `pnpm test:component COMPONENT` for a fast Vitest run without coverage while editing. Use `pnpm test:coverage:component COMPONENT` to run the same dedicated tests with isolated coverage, then `pnpm test:a11y:component COMPONENT` to scan its documented HTML examples with axe-core in Chromium, Firefox, and WebKit. All three commands accept either `COMPONENT` or `tp-COMPONENT`; none regenerates family or transversal reports.

<details>
<summary><code>tp-text-to-speech</code>: first tests</summary>

The first test checks registration and connection, then grows alongside every public behavior:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import './text-to-speech.js';

describe('<tp-text-to-speech>', () => {
  beforeEach(() => document.body.replaceChildren());

  it('registers and connects the canonical component', () => {
    const element = document.createElement('tp-text-to-speech');
    document.body.append(element);

    expect(customElements.get('tp-text-to-speech')).toBeDefined();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('tp-text-to-speech')).toBe(true);
  });
});
```

During the first iteration, run its dedicated tests without collecting coverage:

```bash
pnpm test:component text-to-speech
```

As soon as the initial contract is implemented, verify coverage and accessibility separately:

```bash
pnpm test:coverage:component text-to-speech
pnpm test:a11y:component text-to-speech
```

Browser APIs such as `speechSynthesis` are replaced by deterministic test doubles in unit tests: the suite verifies behavior and events without producing real audio. New component tests must cover 100% of functions from their first version.

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: first tests</summary>
Create the tests alongside the first class. The registration test needs no real audio. As abcjs is introduced, mock it so tests remain deterministic:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import abcjs from 'abcjs';

vi.mock('abcjs', () => ({
  default: {
    renderAbc: vi.fn(() => [{}]),
    synth: { CreateSynth: vi.fn() },
  },
}));

await import('./abc-music-viewer.js');

describe('<tp-abc-music-viewer>', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.clearAllMocks();
  });

  it('connects through the common viewer foundation', () => {
    const viewer = document.createElement('tp-abc-music-viewer');
    document.body.append(viewer);
    expect(viewer.classList.contains('tp-markup-viewer')).toBe(true);
    expect(viewer.classList.contains('tp-abc-music-viewer')).toBe(true);
  });
});
```

Run `pnpm test:component abc-music-viewer` during development. Run `pnpm test:coverage:component abc-music-viewer` to measure the dedicated implementation. New component functions must reach 100%; inherited viewer code has its own tests and is not magically re-covered by a thin specialization.

</details>

### Main functionality

Implement the component’s central behavior as a small sequence of responsibilities derived from the contract. Separate input acquisition from the operation performed on that input: each part then has a clear failure state, can evolve independently, and can be tested without exercising the whole component. Prefer existing library utilities for cross-component responsibilities such as declarative source loading.

<details>
<summary><code>tp-text-to-speech</code>: main functionality</summary>

The main functionality has two successive parts: obtain the text, then speak it. Text acquisition is delegated to `TpDeclarativeTextSource`, which already implements the source contract. `getText()` has one responsibility: resolve the current source and return its text. Its name does not imply that the source is necessarily a file:

```ts
import { TpDeclarativeTextSource } from '../../utilities/declarative-text-source.js';

/** Reads every supported textual source using the library precedence. */
private readonly source = new TpDeclarativeTextSource(this, {
  scriptTypes: ['tp/txt', 'tp/text-to-speech'],
  textContentFallback: true,
});
/** Text currently ready to be spoken. */
private text = '';

/** Strong reference retained for the complete browser utterance lifecycle. */
private utterance: SpeechSynthesisUtterance | null = null;

/** Obtains text from `src`, `value`, script or direct content. */
private async getText(): Promise<string> {
  return (await this.source.read({ cache: 'no-store' })).trim();
}
```

`getText()` neither changes component state nor calls `render()`. The call is deliberately `this.source.read()`, not `read(this.src)`: the shared reader inspects the component itself and applies `src` → `value` → script → direct-text precedence. The optional argument contains only network options used if `src` wins. Asynchronous race protection, state assignment and rendering belong to a separate orchestration method introduced with lifecycle and failure handling.

The first functional version must now connect text acquisition to speech. It defines the boolean property announced by the contract, observes parser-safe inline content, obtains the text on connection, stores it, and invokes `speak()` when `autoplay` is present:

```ts
/** Whether speech starts automatically after text resolution. */
public get autoplay(): boolean {
  return this.hasAttribute('autoplay');
}

/** Enables or disables automatic speech. */
public set autoplay(value: boolean) {
  this.setBooleanAttribute('autoplay', value);
}

/** Initializes the component and resolves its first textual source. */
protected override connectedCallback(): void {
  super.connectedCallback();
  this.ensureGlobalStyle('tp-text-to-speech-styles', style);
  this.classList.add('tp-text-to-speech');
  this.source.observe(() => { void this.updateText(); });
  void this.updateText();
}

/** Stores the resolved text and starts speech when requested. */
private async updateText(): Promise<void> {
  this.text = await this.getText();
  if (this.autoplay) void this.speak();
}
```

At this point, `<tp-text-to-speech value="Welcome" autoplay></tp-text-to-speech>` can speak. Browsers may nevertheless block audio started without a user gesture; the playback controls and explicit failure handling are added in the following steps. `updateText()` will also gain race protection and rendering later, while `getText()` will continue to return text without side effects.

Once the text has been obtained, `speak()` creates a `SpeechSynthesisUtterance`. This is the object expected by `speechSynthesis.speak()`: it contains both the text and the instructions the browser needs to pronounce it. The component maps its public contract to the Web Speech API as follows:

- `this.lang` supplies the BCP 47 language tag inherited from `TpBase`, such as `en-US` or `fr-FR`;
- `this.rate` supplies the speaking rate expected by the API, from `0.1` to `10`, with `1` as the normal rate;
- `this.pitch` supplies the voice pitch, from `0` to `2`, with `1` as the normal pitch;
- `this.volume` supplies the output volume, from `0` to `1`, with `1` as full volume;
- `await this.selectVoice(...)` converts the component’s author-friendly `voice` string into the `SpeechSynthesisVoice` object expected by `utterance.voice` after the browser has populated its voice list.

The browser exposes installed voices through `speechSynthesis.getVoices()`, but Safari and Chromium may initially return an empty list and populate it later. The component therefore waits for `voiceschanged`, then searches by explicit voice name, exact locale, and finally base language. It returns `null` when no match is found, allowing the browser to choose its default voice. This follows the already proven design of the `@tp/tp-markdown` text-to-speech extension. The component defines the corresponding properties and validates numeric ranges before their values reach the API:

```ts
/** Preferred installed voice name or language tag. */
public get voice(): string {
  return this.getAttribute('voice') ?? '';
}

/** Updates the preferred voice. */
public set voice(value: string) {
  this.setStringAttribute('voice', value);
}

/** Speech rate from 0.1 to 10, or the normal rate when invalid. */
public get rate(): number {
  return this.numberAttribute('rate', 1, 0.1, 10);
}

/** Updates the speech rate. */
public set rate(value: number) {
  this.setAttribute('rate', String(value));
}

/** Speech pitch from 0 to 2, or the normal pitch when invalid. */
public get pitch(): number {
  return this.numberAttribute('pitch', 1, 0, 2);
}

/** Updates the speech pitch. */
public set pitch(value: number) {
  this.setAttribute('pitch', String(value));
}

/** Speech volume from 0 to 1, or full volume when invalid. */
public get volume(): number {
  return this.numberAttribute('volume', 1, 0, 1);
}

/** Updates the speech volume. */
public set volume(value: number) {
  this.setAttribute('volume', String(value));
}

/** Returns a finite attribute value inside its accepted range. */
private numberAttribute(
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  const attribute = this.getAttribute(name);
  if (attribute === null || attribute.trim() === '') return fallback;
  const value = Number(attribute);
  return Number.isFinite(value) && value >= minimum && value <= maximum
    ? value
    : fallback;
}

/** Finds an installed voice by name, exact locale, then base language. */
private async selectVoice(
  synthesis: SpeechSynthesis,
): Promise<SpeechSynthesisVoice | null> {
  const voices = await this.loadVoices(synthesis);
  const requested = this.voice.trim().toLowerCase();
  const language = this.lang.trim().toLowerCase();

  return (requested === ''
    ? undefined
    : voices.find((voice) => (
      voice.name.toLowerCase() === requested
      || voice.lang.toLowerCase() === requested
    )))
    ?? voices.find((voice) => voice.lang.toLowerCase() === language)
    ?? voices.find((voice) => (
      language !== ''
      && voice.lang.toLowerCase().startsWith(language.slice(0, 2))
    ))
    ?? null;
}

/** Waits for browsers that populate their voice list asynchronously. */
private async loadVoices(
  synthesis: SpeechSynthesis,
): Promise<SpeechSynthesisVoice[]> {
  const available = synthesis.getVoices();
  if (available.length > 0) return available;

  return await new Promise((resolve) => {
    const handleVoicesChanged = (): void => {
      const voices = synthesis.getVoices();
      if (voices.length === 0) return;
      synthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      resolve(voices);
    };
    synthesis.addEventListener('voiceschanged', handleVoicesChanged);
  });
}
```

With those settings established, `speak()` hands the utterance to the browser speech queue:

```ts
/** Speaks the text previously obtained by getText(). */
public async speak(): Promise<void> {
  const speechWindow = this.ownerDocument.defaultView;
  const synthesis = speechWindow?.speechSynthesis;
  const Utterance = speechWindow?.SpeechSynthesisUtterance;
  if (
    synthesis === undefined
    || Utterance === undefined
    || this.text === ''
  ) return;

  synthesis.cancel();
  const utterance = new Utterance(this.text);
  utterance.lang = this.lang;
  utterance.rate = this.rate;
  utterance.pitch = this.pitch;
  utterance.volume = this.volume;
  const voice = await this.selectVoice(synthesis);
  if (voice !== null) utterance.voice = voice;
  this.utterance = utterance;
  synthesis.speak(utterance);
}
```

Using `ownerDocument.defaultView` is important in a viewer: the click and the speech engine remain in the same iframe browsing context, so the browser can associate the call with the user activation. Reaching for `window.top` crosses that boundary and was the main conceptual difference from the working `tp-markdown` implementation.

Keeping `this.utterance` is intentional. Safari and Chromium may garbage-collect an utterance that exists only as a local variable before speech completes, resulting in no audible output. The component clears this reference on `end`, `error`, and `stop()`.

This first implementation deliberately keeps loading and speech separate. Rendering, events, detailed failures and playback state are added in the following steps without changing the public contract.

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: main functionality</summary>
Import the shared reader from `../../utilities/declarative-text-source.js` and abcjs from `abcjs`. When implementing the component, declare abcjs as a direct package dependency; do not depend implicitly on the installation used by `@tp/tp-markdown`.

The source reader supplies the initial example. The viewer then owns the editable working copy: `renderOutput(source, …)` must render its argument, not reread the original script, otherwise Run would discard the user's edits.

```ts
import abcjs, { type MidiBuffer, type TablatureInstrument } from 'abcjs';
import { TpDeclarativeTextSource } from '../../utilities/declarative-text-source.js';

/** Preserves author input before the viewer creates its own light DOM. */
private readonly source = new TpDeclarativeTextSource(this, {
  scriptTypes: ['tp/abc', 'tp/abc-music-viewer'],
  textContentFallback: true,
});
/** First tune returned by abcjs for the current output. */
private visual: ReturnType<typeof abcjs.renderAbc>[number] | undefined;
/** Audio synthesizer for the current tune. */
private synth: MidiBuffer | null = null;
/** Audio context owned by this viewer alone. */
private audioContext: AudioContext | null = null;
/** Whether audio is paused and can be resumed. */
private paused = false;

/** Whether the output includes audio controls. */
public get playback(): boolean { return this.hasAttribute('playback'); }
/** Whether abcjs should add tablature. */
public get tablature(): boolean { return this.hasAttribute('tablature'); }
/** Validated tablature instrument; not a MIDI sound program. */
public get instrument(): TablatureInstrument {
  const value = this.getAttribute('instrument');
  return value === 'mandolin' || value === 'fiddle' || value === 'violin'
    ? value : 'guitar';
}

/** Resolves initial notation without rendering anything. */
private async getNotation(): Promise<string> {
  return (await this.source.read({ cache: 'no-store' })).trim();
}

/** Adapts the shared source contract to the viewer's example format. */
protected async readInlineSource(): Promise<MarkupViewerExample> {
  return { label: 'ABC music', source: await this.getNotation(), context: undefined };
}

/** Uses the common source precedence for one ABC document. */
protected override async loadExamples(): Promise<MarkupViewerExample[]> {
  return [await this.readInlineSource()];
}

/** Replaces a score with the edited notation received from the viewer. */
private renderNotation(source: string, container: HTMLElement): void {
  container.replaceChildren();
  this.visual = undefined;
  if (source.trim() === '') return;
  const [visual] = abcjs.renderAbc(container, source, {
    responsive: 'resize',
    add_classes: true,
    tablature: this.tablature ? [{ instrument: this.instrument }] : undefined,
  });
  if (visual === undefined) throw new Error('No readable ABC tune was found.');
  this.visual = visual;
}
```

`loadExamples()` deliberately replaces the foundation's multiple-file loader with the library's single-document reader. This avoids competing precedence rules and duplicate fetching. `createExternalContext()` remains the no-context hook shown in the first version.

abcjs renders the score synchronously. Audio is separate: `CreateSynth.init({ visualObj, audioContext })` initializes a tune, `prime()` prepares buffers, and `start()` plays them. `instrument` selects tablature, not a MIDI timbre. Seeking, note-following animation and MIDI program selection are outside this first contract.

</details>

#### Content

Custom elements can be connected before the HTML parser has added their children. Capture declarative content before replacing light DOM and observe late parser additions. Do not implement source selection locally: use [`TpDeclarativeTextSource`](/api/classes/utilities_declarative-text-source.TpDeclarativeTextSource.html), which enforces the common `src` → `value` → internal `script` → direct-text precedence, rejects script types outside the `tp/` namespace, resolves contextual URLs and prevents parser timing from losing inline content.

<details>
<summary><code>tp-text-to-speech</code>: author content</summary>

The component configures the shared reader for its accepted script types and direct-text fallback. It starts observation before its first asynchronous read, so an inline script added later by the HTML parser is captured before `render()` replaces the light DOM:

```ts
/** Shared reader for src, value, script and direct-text sources. */
private readonly source = new TpDeclarativeTextSource(this, {
  scriptTypes: ['tp/txt', 'tp/text-to-speech'],
  textContentFallback: true,
});

/** Initializes source observation before resolving the first text. */
protected override connectedCallback(): void {
  super.connectedCallback();
  this.ensureGlobalStyle('tp-text-to-speech-styles', style);
  this.classList.add('tp-text-to-speech');
  this.source.observe(() => { void this.updateText(); });
  void this.updateText();
}

/** Returns text from the highest-priority declarative source. */
private async getText(): Promise<string> {
  return (await this.source.read({ cache: 'no-store' })).trim();
}
```

The reusable plain-text type `tp/txt` is preferred, while `tp/text-to-speech` remains a compatible component-specific alias. The self-contained demonstration likewise accepts `tp/txt` and `tp/text-to-speech-demo`.

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: author content</summary>
Start source observation before calling the viewer connection hook. The foundation will replace light DOM with its editor and panels, so the original script must already be preserved.

```ts
/** Preserves parser-late source before the foundation builds the viewer UI. */
protected override connectedCallback(): void {
  this.source.observe(() => this.requestViewerRender());
  super.connectedCallback();
}

/** Stops obsolete audio before a source or display attribute reloads the viewer. */
protected override attributeChangedCallback(): void {
  this.stop();
  super.attributeChangedCallback();
}
```

`TpDeclarativeTextSource` preserves the author's script, observes late parser additions, and resolves contextual URLs. `requestViewerRender()` asks the foundation to reload the example. Do not replace the host with a custom `render()`: that would destroy the shared editor and toolbar.

Run uses the editor's working copy; Reset restores the source captured by the viewer. The reader is for initial input and explicit source changes, not for each Run action.

</details>

#### Lifecycle

Disconnect observers, timers and browser services in `disconnectedCallback()`. Treat missing browser capabilities and network failures as ordinary states with visible, announced messages. Prevent an older request or callback from replacing newer state.

<details>
<summary><code>tp-text-to-speech</code>: lifecycle and failure</summary>

One monotonically increasing token identifies the latest text update. Both a newer update and disconnection invalidate earlier asynchronous reads:

```ts
/** Sequence used to discard stale asynchronous loads. */
private updateToken = 0;

/** Refreshes component state after resolving its current text. */
private async updateText(): Promise<void> {
  const token = ++this.updateToken;
  try {
    const text = await this.getText();
    if (token !== this.updateToken) return;
    this.text = text;
    this.render();
    if (this.autoplay) void this.speak();
  } catch (error) {
    if (token !== this.updateToken) return;
    this.text = '';
    this.render();
    this.reportError(error instanceof Error ? error.message : String(error));
  }
}

/** Releases source observation and speech synthesis when disconnected. */
public disconnectedCallback(): void {
  this.source.disconnect();
  this.stop();
  this.updateToken += 1;
}
```

`source.disconnect()` stops the `MutationObserver` and releases its callback. `stop()` cancels queued or active speech and releases the retained utterance. The final increment ensures that a pending `getText()` cannot render detached content or start playback. Missing speech synthesis disables the controls with an announced message; HTTP and synthesis failures are displayed and emitted as component events.

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: lifecycle and failure</summary>
The viewer already owns source-load invalidation and iframe/observer cleanup. Keep its `disconnectedCallback()`; implement the intended `disposeViewer()` extension hook instead. Audio still needs its own token because initialization can finish after Stop, a new score, or disconnection.

```ts
/** Invalidates pending audio preparation. */
private playbackToken = 0;
/** Prevents simultaneous audio preparation on repeated clicks. */
private preparing = false;

/** Starts audio from the beginning only while this request is still current. */
public async play(): Promise<void> {
  if (!this.playback || !this.visual || this.preparing) return;
  const token = ++this.playbackToken;
  try {
    this.synth?.stop();
    this.paused = false;
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) throw new Error('Audio playback is unavailable.');
    this.audioContext ??= new AudioContextClass();
    this.preparing = true;
    this.setStatus('Preparing audio.');
    // Resume directly from the click, before awaiting other initialization.
    await this.audioContext.resume();
    if (token !== this.playbackToken) return;
    const synth = new abcjs.synth.CreateSynth();
    this.synth = synth;
    await synth.init({ visualObj: this.visual, audioContext: this.audioContext });
    if (token !== this.playbackToken) return;
    await synth.prime();
    if (token !== this.playbackToken || !this.isConnected) return;
    synth.start();
    this.setStatus('Playback started.');
  } catch (error) {
    if (token === this.playbackToken) this.reportError(error);
  } finally {
    if (token === this.playbackToken) this.preparing = false;
  }
}

/** Pauses a prepared synthesizer without rebuilding the score. */
public pause(): void {
  if (!this.synth || this.preparing) return;
  this.synth.pause();
  this.paused = true;
  this.setStatus('Paused.');
}

/** Resumes paused audio without restarting the tune. */
public resume(): void {
  if (!this.synth || !this.paused || this.preparing) return;
  try {
    this.synth.resume();
    this.paused = false;
    this.setStatus('Playing.');
  } catch (error) {
    this.reportError(error);
  }
}

/** Cancels playback and invalidates asynchronous initialization. */
public stop(): void {
  this.playbackToken += 1;
  this.synth?.stop();
  this.synth = null;
  this.paused = false;
  this.preparing = false;
  this.setStatus('Ready.');
}

/** Releases resources owned by this component when it leaves the document. */
protected override disposeViewer(): void {
  this.source.disconnect();
  this.stop();
  this.visual = undefined;
  const context = this.audioContext;
  this.audioContext = null;
  if (context && context.state !== 'closed') {
    void context.close().catch(() => {
      // The document may already have released its audio context.
    });
  }
}
```

Only the owned audio context is closed. Stop invalidates pending initialization; `renderOutput()` also calls it before replacing the score. The inherited viewer reports source-loading failures, while the specialized status reports audio and notation errors. A failed audio request must not remove a successfully rendered score.

</details>

### User interaction

Once the main functionality works programmatically, expose the actions authors and users need. Define the possible states, choose controls whose semantics match each action, connect their events to the public methods, and keep programmatic and visual state synchronized. Interaction must work with keyboard, pointer and assistive technologies; detailed accessibility behavior is reviewed in a dedicated following step.

Library rule: use an existing `tp-*` component whenever it already owns the required behavior. Do not recreate a global style, reset, colour, spacing scale, typography rule, focus treatment, surface, or other design primitive that the library already provides. Consume the existing global styles and semantic design tokens first. Add a new global primitive only when the need is genuinely shared, no equivalent exists, and its contract is documented in the Design tokens appendix. Component-specific CSS must remain scoped by the component class and should express its values through existing tokens whenever possible.

<details>
<summary><code>tp-text-to-speech</code>: user interaction</summary>

The four public methods become four visible controls. Because these controls form one related set, the component reuses `tp-button-group` rather than recreating a group with a generic `div`. `tp-button-group` loads the `tp-button` elements and supplies the library’s established grouping layout; each button retains its native semantics, keyboard activation and focus behavior:

```ts
import '../button-group/button-group.js';

/** Whether the resolved source is also displayed visually. */
public get showText(): boolean {
  return this.hasAttribute('show-text');
}

/** Shows or hides the resolved source text. */
public set showText(value: boolean) {
  this.setBooleanAttribute('show-text', value);
}

/** Renders the playback controls and connects them to the public API. */
private render(): void {
  this.innerHTML = `
    <p data-role="text"${this.showText ? '' : ' hidden'}></p>
    <tp-button-group class="tp-text-to-speech-controls"
                     role="group"
                     aria-label="Text-to-speech controls">
      <tp-button data-action="speak">Speak</tp-button>
      <tp-button data-action="pause">Pause</tp-button>
      <tp-button data-action="resume">Resume</tp-button>
      <tp-button data-action="stop">Stop</tp-button>
    </tp-button-group>`;

  // Assign text as text, never as author-provided HTML.
  const textElement = this.querySelector('[data-role="text"]');
  if (textElement !== null) textElement.textContent = this.text;

  for (const action of ['speak', 'pause', 'resume', 'stop'] as const) {
    this.querySelector(`[data-action="${action}"]`)
      ?.addEventListener('click', () => { void this[action](); });
  }
}
```

At this step, the earlier `updateText()` implementation is modified explicitly so the controls are rendered after the resolved text is assigned and before optional playback starts:

```ts
/** Stores the resolved text, renders its controls and starts speech when requested. */
private async updateText(): Promise<void> {
  this.text = await this.getText();
  this.render();
  if (this.autoplay) void this.speak();
}
```

The optional paragraph is always created so `render()` has one stable structure; `hidden` follows `show-text`. Assigning through `textContent` preserves the author’s text without interpreting it as HTML. The click handlers invoke the same `speak()`, `pause()`, `resume()` and `stop()` methods available to JavaScript consumers, so the component does not maintain two competing implementations of its behavior.

The component adds only scoped layout styles and expresses their values through existing semantic tokens; it introduces no duplicate global style or design primitive.

The accumulated code can now be exercised in an isolated HTML viewer. This demonstration deliberately defines `tp-text-to-speech-demo`, not the real `tp-text-to-speech`: the result proves that the code written up to this step works without importing the finished component. Its source is enclosed in `template` so the page-level `tp-loader` cannot mistake the tutorial-only tag for a library component before the viewer transfers it into its iframe.

<tp-html-viewer label="Text-to-speech first interactive version" lite allow-script no-loader>
  <template>
    <tp-text-to-speech-demo
      value="This text is spoken by the component created inside the viewer."
      lang="en-US"
      show-text>
    </tp-text-to-speech-demo>

    <script type="module">
    import { TpDeclarativeTextSource } from '/src/utilities/declarative-text-source.js';
    import { TpBase } from '/src/components/base/base.js';
    import '/src/components/button-group/button-group.js';

    class TpTextToSpeechDemo extends TpBase {
      /** Attributes whose changes are relevant to the demonstration. */
      static get observedAttributes() {
        return [
          ...TpBase.observedAttributes,
          'src',
          'value',
          'show-text',
          'voice',
          'rate',
          'pitch',
          'volume',
          'autoplay',
        ];
      }

      /** Resolves the four supported declarative text sources. */
      source = new TpDeclarativeTextSource(this, {
        scriptTypes: ['tp/txt', 'tp/text-to-speech-demo'],
        textContentFallback: true,
      });

      /** Text currently ready to be spoken. */
      text = '';

      /** Strong reference retained until speech ends or is stopped. */
      utterance = null;

      /** Preferred installed voice name or language tag. */
      get voice() {
        return this.getAttribute('voice') ?? '';
      }

      /** Whether the resolved source is also displayed visually. */
      get showText() {
        return this.hasAttribute('show-text');
      }

      /** Validated speech rate. */
      get rate() {
        return this.numberAttribute('rate', 1, 0.1, 10);
      }

      /** Validated speech pitch. */
      get pitch() {
        return this.numberAttribute('pitch', 1, 0, 2);
      }

      /** Validated speech volume. */
      get volume() {
        return this.numberAttribute('volume', 1, 0, 1);
      }

      /** Whether speech starts after text resolution. */
      get autoplay() {
        return this.hasAttribute('autoplay');
      }

      /** Resolves the initial source when the element is connected. */
      connectedCallback() {
        super.connectedCallback();
        this.source.observe(() => { void this.updateText(); });
        void this.updateText();
      }

      /** Returns text without changing state or rendering. */
      async getText() {
        return (await this.source.read({ cache: 'no-store' })).trim();
      }

      /** Stores the text, renders controls and applies autoplay. */
      async updateText() {
        this.text = await this.getText();
        this.render();
        if (this.autoplay) void this.speak();
      }

      /** Renders controls and connects them to the public methods. */
      render() {
        this.innerHTML = `
          <p data-role="text"${this.showText ? '' : ' hidden'}></p>
          <tp-button-group role="group" aria-label="Text-to-speech controls">
            <tp-button data-action="speak">Speak</tp-button>
            <tp-button data-action="pause">Pause</tp-button>
            <tp-button data-action="resume">Resume</tp-button>
            <tp-button data-action="stop">Stop</tp-button>
          </tp-button-group>`;

        this.querySelector('[data-role="text"]').textContent = this.text;

        for (const action of ['speak', 'pause', 'resume', 'stop']) {
          this.querySelector(`[data-action="${action}"]`)
            ?.addEventListener('click', () => { void this[action](); });
        }
      }

      /** Creates and queues an utterance for the current text. */
      async speak() {
        const synthesis = window.speechSynthesis;
        const Utterance = window.SpeechSynthesisUtterance;
        if (
          synthesis === undefined
          || Utterance === undefined
          || this.text === ''
        ) return;

        synthesis.cancel();
        const utterance = new Utterance(this.text);
        utterance.lang = this.lang;
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;
        const voice = await this.selectVoice(synthesis);
        if (voice !== null) utterance.voice = voice;
        utterance.addEventListener('end', () => {
          if (this.utterance === utterance) this.utterance = null;
        });
        utterance.addEventListener('error', () => {
          if (this.utterance === utterance) this.utterance = null;
        });
        this.utterance = utterance;
        synthesis.speak(utterance);
      }

      /** Pauses active speech. */
      pause() {
        const synthesis = window.speechSynthesis;
        if (synthesis?.speaking) {
          synthesis.pause();
        }
      }

      /** Resumes paused speech. */
      resume() {
        const synthesis = window.speechSynthesis;
        if (synthesis?.paused) {
          synthesis.resume();
        }
      }

      /** Cancels queued and active speech. */
      stop() {
        window.speechSynthesis?.cancel();
        this.utterance = null;
      }

      /** Finds an installed voice by name, exact locale, then base language. */
      async selectVoice(synthesis) {
        const voices = await this.loadVoices(synthesis);
        const requested = this.voice.trim().toLowerCase();
        const language = this.lang.trim().toLowerCase();
        return (requested === ''
          ? undefined
          : voices.find((voice) => (
            voice.name.toLowerCase() === requested
            || voice.lang.toLowerCase() === requested
          )))
          ?? voices.find((voice) => voice.lang.toLowerCase() === language)
          ?? voices.find((voice) => (
            language !== ''
            && voice.lang.toLowerCase().startsWith(language.slice(0, 2))
          ))
          ?? null;
      }

      /** Waits until the browser has populated its installed voices. */
      async loadVoices(synthesis) {
        const available = synthesis.getVoices();
        if (available.length > 0) return available;
        return await new Promise((resolve) => {
          const handleVoicesChanged = () => {
            const voices = synthesis.getVoices();
            if (voices.length === 0) return;
            synthesis.removeEventListener('voiceschanged', handleVoicesChanged);
            resolve(voices);
          };
          synthesis.addEventListener('voiceschanged', handleVoicesChanged);
        });
      }

      /** Returns an in-range numeric attribute or its fallback. */
      numberAttribute(name, fallback, minimum, maximum) {
        const attribute = this.getAttribute(name);
        if (attribute === null || attribute.trim() === '') return fallback;
        const value = Number(attribute);
        return Number.isFinite(value) && value >= minimum && value <= maximum
          ? value
          : fallback;
      }
    }

    if (!customElements.get('tp-text-to-speech-demo')) {
      customElements.define('tp-text-to-speech-demo', TpTextToSpeechDemo);
    }

    </script>
  </template>
</tp-html-viewer>

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: user interaction</summary>
The foundation supplies editing, Run, Reset, pane toggles and editor tools. Do not rebuild those controls. Add only the audio toolbar inside the output container, using existing `tp-button-group` and `tp-button` components.

Replace the placeholder `renderOutput()` with this implementation. It consumes the source passed by the viewer, so source editing and Reset work without a separate `updateNotation()` method.

```ts
import '../button-group/button-group.js';

/** Renders edited notation and the optional audio controls into the shared panel. */
protected async renderOutput(
  source: string,
  _mode: 'score',
  container: HTMLElement,
  _context: undefined,
): Promise<void> {
  this.stop();
  container.innerHTML = `
    <div data-role="score" role="img" aria-label="Music score"></div>
    <tp-button-group data-role="music-controls" role="group"
      aria-label="Music playback">
      <tp-button data-action="play">Play</tp-button>
      <tp-button data-action="pause">Pause</tp-button>
      <tp-button data-action="resume">Resume</tp-button>
      <tp-button data-action="stop">Stop</tp-button>
    </tp-button-group>
    <p data-role="music-status" role="status" aria-live="polite"></p>`;
  const controls = container.querySelector('[data-role="music-controls"]');
  if (!this.playback) controls?.remove();
  for (const action of ['play', 'pause', 'resume', 'stop'] as const) {
    container.querySelector(`[data-action="${action}"]`)
      ?.addEventListener('click', () => { void this[action](); });
  }
  try {
    const score = container.querySelector<HTMLElement>('[data-role="score"]');
    if (score) this.renderNotation(source, score);
    this.setStatus(this.visual ? 'Score ready.' : 'No score.');
  } catch (error) {
    this.reportError(error);
  }
  for (const button of container.querySelectorAll('tp-button')) {
    button.toggleAttribute('disabled', !this.visual || !window.AudioContext);
  }
}

/** Updates audio status without rebuilding the editor or score. */
private setStatus(message: string): void {
  const status = this.querySelector('[data-role="music-status"]');
  if (status) status.textContent = message;
}

/** Announces a specialized failure and exposes it to consumers. */
private reportError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  this.setStatus(`Error: ${message}`);
  this.dispatchEvent(new CustomEvent('tp-abc-music-viewer-error', {
    bubbles: true,
    detail: { error: message },
  }));
}
```

ABC is passed as data to abcjs, never interpolated into HTML. The output stays in normal document flow and grows with the score and controls. Editing does not play music: users explicitly activate Play after Run. As with text-to-speech, the four buttons have distinct roles: Play starts from the beginning, Pause suspends playback, Resume continues from the paused position, and Stop cancels playback. Resume does nothing unless playback is paused.

The isolated demonstration below embeds the accumulated class, not a finished component. The outer HTML viewer is only the tutorial sandbox; the inner ABC viewer inherits the real shared source/output interface. Its tutorial-only tag is protected from the page loader by `template` and registered locally with `no-loader`. The outer source panel starts closed. abcjs and its audio samples require network access.

<tp-html-viewer label="ABC music viewer first interactive version" lite allow-script no-loader>
  <template>
    <tp-abc-music-viewer-demo playback>
      <script type="tp/abc">
X:1
K:C
C D E F G A B c|B A G F E D C2|
      </script>
    </tp-abc-music-viewer-demo>
    <script src="https://cdn.jsdelivr.net/npm/abcjs@6.6.4/dist/abcjs-basic-min.js"></script>
    <script type="module">
    import { TpMarkupViewer } from '/src/components/markup-viewer/markup-viewer.js';
    import { TpDeclarativeTextSource } from '/src/utilities/declarative-text-source.js';
    import '/src/components/button-group/button-group.js';

    // The pinned browser bundle exposes the package API.
    const abcjs = window.ABCJS;

    "use strict";
    class TpAbcMusicViewerDemo extends TpMarkupViewer {
        /** Source editor mode. */
        sourceLanguage = 'text';
        /** Available output mode. */
        outputModes = [{ value: 'score', label: 'Score' }];
        /** Component-specific style scope. */
        viewerClassName = 'tp-abc-music-viewer';
        /** Attributes observed in addition to the shared viewer contract. */
        static get observedAttributes() { return [...super.observedAttributes, 'value', 'playback', 'tablature', 'instrument']; }
        /** No relative assets are resolved for this ABC document. */
        createExternalContext(_url) { return undefined; }
        /** Preserves author input before the viewer creates its own light DOM. */
        source = new TpDeclarativeTextSource(this, {
            scriptTypes: ['tp/abc', 'tp/abc-music-viewer', 'tp/abc-music-viewer-demo'],
            textContentFallback: true,
        });
        /** First tune returned by abcjs for the current output. */
        visual;
        /** Audio synthesizer for the current tune. */
        synth = null;
        /** Audio context owned by this viewer alone. */
        audioContext = null;
        /** Whether audio is paused and can be resumed. */
        paused = false;
        /** Whether the output includes audio controls. */
        get playback() { return this.hasAttribute('playback'); }
        /** Whether abcjs should add tablature. */
        get tablature() { return this.hasAttribute('tablature'); }
        /** Validated tablature instrument; not a MIDI sound program. */
        get instrument() {
            const value = this.getAttribute('instrument');
            return value === 'mandolin' || value === 'fiddle' || value === 'violin'
                ? value : 'guitar';
        }
        /** Resolves initial notation without rendering anything. */
        async getNotation() {
            return (await this.source.read({ cache: 'no-store' })).trim();
        }
        /** Adapts the shared source contract to the viewer's example format. */
        async readInlineSource() {
            return { label: 'ABC music', source: await this.getNotation(), context: undefined };
        }
        /** Uses the common source precedence for one ABC document. */
        async loadExamples() {
            return [await this.readInlineSource()];
        }
        /** Replaces a score with the edited notation received from the viewer. */
        renderNotation(source, container) {
            container.replaceChildren();
            this.visual = undefined;
            if (source.trim() === '')
                return;
            const [visual] = abcjs.renderAbc(container, source, {
                responsive: 'resize',
                add_classes: true,
                tablature: this.tablature ? [{ instrument: this.instrument }] : undefined,
            });
            if (visual === undefined)
                throw new Error('No readable ABC tune was found.');
            this.visual = visual;
        }
        /** Preserves parser-late source before the foundation builds the viewer UI. */
        connectedCallback() {
            this.source.observe(() => this.requestViewerRender());
            super.connectedCallback();
        }
        /** Stops obsolete audio before a source or display attribute reloads the viewer. */
        attributeChangedCallback() {
            this.stop();
            super.attributeChangedCallback();
        }
        /** Invalidates pending audio preparation. */
        playbackToken = 0;
        /** Prevents simultaneous audio preparation on repeated clicks. */
        preparing = false;
        /** Starts audio from the beginning only while this request is still current. */
        async play() {
            if (!this.playback || !this.visual || this.preparing)
                return;
            const token = ++this.playbackToken;
            try {
                this.synth?.stop();
                this.paused = false;
                const AudioContextClass = window.AudioContext;
                if (!AudioContextClass)
                    throw new Error('Audio playback is unavailable.');
                this.audioContext ??= new AudioContextClass();
                this.preparing = true;
                this.setStatus('Preparing audio.');
                // Resume directly from the click, before awaiting other initialization.
                await this.audioContext.resume();
                if (token !== this.playbackToken)
                    return;
                const synth = new abcjs.synth.CreateSynth();
                this.synth = synth;
                await synth.init({ visualObj: this.visual, audioContext: this.audioContext });
                if (token !== this.playbackToken)
                    return;
                await synth.prime();
                if (token !== this.playbackToken || !this.isConnected)
                    return;
                synth.start();
                this.setStatus('Playback started.');
            }
            catch (error) {
                if (token === this.playbackToken)
                    this.reportError(error);
            }
            finally {
                if (token === this.playbackToken)
                    this.preparing = false;
            }
        }
        /** Pauses a prepared synthesizer without rebuilding the score. */
        pause() {
            if (!this.synth || this.preparing)
                return;
            this.synth.pause();
            this.paused = true;
            this.setStatus('Paused.');
        }
        /** Resumes paused audio without restarting the tune. */
        resume() {
          if (!this.synth || !this.paused || this.preparing) return;
          try {
            this.synth.resume();
            this.paused = false;
            this.setStatus('Playing.');
          } catch (error) {
            this.reportError(error);
          }
        }
        /** Cancels playback and invalidates asynchronous initialization. */
        stop() {
            this.playbackToken += 1;
            this.synth?.stop();
            this.synth = null;
            this.paused = false;
            this.preparing = false;
            this.setStatus('Ready.');
        }
        /** Releases resources owned by this component when it leaves the document. */
        disposeViewer() {
            this.source.disconnect();
            this.stop();
            this.visual = undefined;
            const context = this.audioContext;
            this.audioContext = null;
            if (context && context.state !== 'closed') {
                void context.close().catch(() => {
                    // The document may already have released its audio context.
                });
            }
        }
        /** Renders edited notation and the optional audio controls into the shared panel. */
        async renderOutput(source, _mode, container, _context) {
            this.stop();
            container.innerHTML = `
        <div data-role="score" role="img" aria-label="Music score"></div>
        <tp-button-group data-role="music-controls" role="group"
          aria-label="Music playback">
          <tp-button data-action="play">Play</tp-button>
          <tp-button data-action="pause">Pause</tp-button>
          <tp-button data-action="resume">Resume</tp-button>
          <tp-button data-action="stop">Stop</tp-button>
        </tp-button-group>
        <p data-role="music-status" role="status" aria-live="polite"></p>`;
            const controls = container.querySelector('[data-role="music-controls"]');
            if (!this.playback)
                controls?.remove();
            for (const action of ['play', 'pause', 'resume', 'stop']) {
                container.querySelector(`[data-action="${action}"]`)
                    ?.addEventListener('click', () => { void this[action](); });
            }
            try {
                const score = container.querySelector('[data-role="score"]');
                if (score)
                    this.renderNotation(source, score);
                this.setStatus(this.visual ? 'Score ready.' : 'No score.');
            }
            catch (error) {
                this.reportError(error);
            }
            for (const button of container.querySelectorAll('tp-button')) {
                button.toggleAttribute('disabled', !this.visual || !window.AudioContext);
            }
        }
        /** Updates audio status without rebuilding the editor or score. */
        setStatus(message) {
            const status = this.querySelector('[data-role="music-status"]');
            if (status)
                status.textContent = message;
        }
        /** Announces a specialized failure and exposes it to consumers. */
        reportError(error) {
            const message = error instanceof Error ? error.message : String(error);
            this.setStatus(`Error: ${message}`);
            this.dispatchEvent(new CustomEvent('tp-abc-music-viewer-error', {
                bubbles: true,
                detail: { error: message },
            }));
        }
    }

    // Register only the tutorial tag in this iframe.
    if (!customElements.get('tp-abc-music-viewer-demo')) {
      customElements.define('tp-abc-music-viewer-demo', TpAbcMusicViewerDemo);
    }
    </script>
  </template>
</tp-html-viewer>

Open the inner source pane, change the notes, activate Run, then Play. Reset should restore the original tune. This is an executable tutorial example, not a claim of verified audio output or public component registration.


</details>

### Accessibility

Use native semantics or accessible `tp-*` controls, ensure keyboard equivalence, expose state changes, respect reduced motion and focus indicators, and keep text large enough. Document what the component guarantees and what remains the consumer’s responsibility. Never make an optional sensory output the sole carrier of information and avoid unexpected autoplay.

<details>
<summary><code>tp-text-to-speech</code>: accessibility</summary>

With `show-text`, the component can expose the source visually beside its controls. When it remains at its default `false`, authors must provide equivalent information in the surrounding content for people who cannot hear the synthesis. Keyboard-accessible `tp-button` controls, organized by `tp-button-group`, operate playback, and a polite status region announces ready, speaking, paused and error states. Authors are warned that `autoplay` can be unexpected and may be rejected by browser policy.

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: accessibility</summary>
Reuse the foundation's keyboard-operable source/output controls and editor rather than making a second toolbar. The music toolbar uses labelled library buttons, and the status region announces readiness and errors. Run must not trigger audio automatically.

The generic “Music score” label identifies the graphic but does not describe the music. Authors must supply an equivalent explanation when musical meaning matters; raw ABC in the source editor is not by itself an adequate alternative for every reader.

```ts
/**
 * @event tp-abc-music-viewer-error Emitted when notation or audio preparation fails.
 * @eventdetail tp-abc-music-viewer-error { error: string }
 * @accessibility Reuses the shared source/output viewer and labelled audio controls.
 * @accessibilityresponsibility Provide an equivalent explanation of the score.
 * @keyboard {Enter / Space} Activates the focused toolbar or audio button.
 */
```

Check the combined editor/score/audio UI, not only abcjs SVG. Verify focus after Run and Reset, visible focus, status announcements, narrow layouts and all three browser engines. No animated cursor is introduced; any later cursor must respect reduced motion.

</details>

### Tests

Create dedicated tests at the same time as the component. Exercise its public API, attributes, rendering, keyboard-operable controls, events, unavailable API, loading errors, asynchronous races and cleanup. New components start with 100% function coverage; line, statement and branch results remain visible and should satisfy the library’s 90/90/90/80 targets. Run `pnpm test:component COMPONENT` for simple unit tests, `pnpm test:coverage:component COMPONENT` for isolated coverage, and `pnpm test:a11y:component COMPONENT` for the documented HTML examples in Chromium, Firefox and WebKit. Either `COMPONENT` or `tp-COMPONENT` is accepted. These targeted commands write only temporary test results and do not regenerate family or transversal reports.

<details>
<summary><code>tp-text-to-speech</code>: tests</summary>

The speech engine and utterance are deterministic test doubles, so tests produce no real audio. They verify the three source forms and their precedence, voice selection, numeric fallbacks, autoplay, all four controls, lifecycle cleanup, unavailable APIs and speech events. The component was created with 100% function coverage.

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: tests</summary>
Test the integration as well as the music methods: loading the three source forms, precedence, late scripts, editor changes followed by Run, Reset, source/output toggles, `lite`, empty notation, tablature, unavailable audio, rejected initialization and disconnection.

For example, extend the registration suite with this regression test. It proves that Run renders the edited source, not the preserved script:

```ts
it('renders the edited ABC when Run is activated', async () => {
  const viewer = document.createElement('tp-abc-music-viewer');
  viewer.setAttribute('value', 'X:1\nK:C\nC D E F G A B c|B A G F E D C2|');
  document.body.append(viewer);
  await vi.waitFor(() => expect(abcjs.renderAbc).toHaveBeenCalled());

  const editor = viewer.querySelector('tp-code-editor');
  expect(editor).not.toBeNull();
  editor?.setValue('X:1\nK:C\nG A B c|');
  const run = viewer.querySelector<HTMLElement>('[data-role="run"]');
  expect(run).not.toBeNull();
  run?.click();

  await vi.waitFor(() => {
    expect(abcjs.renderAbc).toHaveBeenLastCalledWith(
      expect.any(HTMLElement),
      'X:1\nK:C\nG A B c|',
      expect.objectContaining({ responsive: 'resize' }),
    );
  });
});
```

Add a Reset assertion back to the original tune and a source-load failure test. Mock `AudioContext` and `CreateSynth` with controllable promises; verify that Stop or a new render before `prime()` completes prevents `start()`. Check that disconnection closes only the owned context and still invokes the shared viewer cleanup. Restore mocked browser globals after every test.

Measure 100% of new functions and the 90/90/90/80 thresholds. Keep the inherited foundation's tests separate, but exercise its integration points here. No passing or coverage result is claimed for the tutorial until the real component and tests exist.

</details>

### Documentation

Immediately before the language tabs in **Examples**, add a native Markdown definition list, rendered as `dl` with `dt`/`dd` pairs. Each term must match an example title exactly, in selector order; its definition must explain in one or two English sentences what to try and what to observe. Describe static results honestly and do not imply that an example implements controls it does not provide. Add or update the editorial objectives in `scripts/component-example-descriptions.mjs`, then run `pnpm examples:sync-descriptions` and `pnpm examples:check-descriptions`. The synchronizer preserves other explanatory prose and fails when an example has no description; it does not invent objectives for new example titles.

Write the live introduction in pure HTML, with CSS or JavaScript only when needed. Keep it simple and give it a meaningful visible result: an iframe must load a document, an include must insert a fragment, and a button group must contain usable buttons. Empty tags are not suitable demonstrations for components that require content. Reproduce this introduction as the first **Basic usage** example in HTML and its equivalent native forms in the other three languages.

Use the same example order in all four languages: **Basic usage**, then one **Attributes** example grouping all local attributes in this component's API table, then requested complementary examples. Components without local attributes do not need an empty Attributes panel; inherited attributes are demonstrated on their declaring base class. Remove all old **Attribute: NAME** examples.

Run `pnpm examples:sync-structure` to regenerate the grouped controls, their external `examples/attributes.js` modules and descriptions. Each module is shared by all four language variants. `pnpm examples:check-structure` checks the ordering and complete attribute coverage. Test the rendered behavior as well.

Place all boolean attributes in one horizontal `tp-checkbox-list`, each enum in its own horizontal `tp-radio-list`, and other values in `tp-textfield` controls. Set group labels at top and initialize from published defaults. Controls stay outside the single preview, including for disabled and fullscreen components. Reset defaults restores the initial state; Reload preview restarts initialization with the current settings. Keep state synchronized after direct interaction. File-loading settings offer only Default, file1, file2 and file-unknown: use verified local fixtures, never arbitrary user-entered URLs.

For example, `tp-accordion` uses a radio list for `appearance`, a single checkbox for `multiple`, and a three-item checkbox list for `open-indexes`. The latter converts the checkbox list's one-based positions to the accordion's zero-based indexes and follows direct panel interactions. Keep the controls and behavior equivalent in all four markup languages.

Remove every old per-attribute example. Retain complementary scenarios only when they demonstrate a distinct use case. Enumeration choices come from the TypeScript contract or a reviewed list. Some defaults intentionally produce no output; explain how to supply content with the controls instead of silently overriding the defaults.

Write Markdown, AsciiDoc and reStructuredText examples in the native syntax of `@tp/tp-markdown`, `@tp/tp-asciidoc` and `@tp/tp-restructuredtext`: prose, emphasis, lists, images, and component directives or inline roles. Do not use raw HTML or HTML passthrough blocks to construct these examples. Use directives when attributes are needed, and extract inline SVG illustrations to shared image assets. Literal HTML is appropriate only as explicitly displayed code or as source data supplied to an HTML viewer/editor. Run `pnpm examples:check-native-markup` to check all component example sets; the introduction and example generators follow the same rule.

Generate the component JSON manifest from its TSDoc annotations, then synchronize the API table. Provide an introductory live example, identical examples for HTML, Markdown, AsciiDoc and reStructuredText, accessibility guidance, imports and dependencies. Add the component to its family, sidebar, index, quality configuration and accessibility inventory.

Use exactly **15 colons** for both delimiters of the `tp-tabs` containing the four markup-language example files. Every colon fence inside the included Markdown examples must be shorter than 15, so it cannot close the surrounding tabs. The introduction synchronizer maintains this convention; the generator rejects examples whose nesting would exceed it.

Every **Usage** section must contain two level-three subsections, in this order: **User interactions** and **Author directives**. User interactions addresses the end user: explain visible buttons, menus, keyboard actions, status messages and the result of each action, without requiring knowledge of tags, attributes, scripts or APIs. If the component has no interaction of its own, say so explicitly. Put command tables here. Author directives addresses the content author: show how to declare and configure the component in HTML and in the chosen `@tp/tp-markdown`, `@tp/tp-asciidoc` or `@tp/tp-restructuredtext` language, including content sources, attribute precedence and relevant constraints. Keep existing content-source tabs here. Nested topics use level-four headings. Do not confuse a user's action, such as pressing Play, with an author's directive, such as adding an attribute.

Under User interactions, provide exactly two tables: **Mouse interactions** (control or gesture / result) and **Keyboard interactions** (key or gesture / result). Explain the visible buttons and palette commands individually, using their displayed labels. Include **Ctrl+?** in every keyboard table: it opens help for the hovered component, falling back to the focused component; Shift may be needed to type ?. A static component has no dedicated controls, but still supports this shared help shortcut.

Run `node scripts/sync-component-doc-usage.mjs --check` to check the Usage structure, then `pnpm docs:check-user-interactions` after regenerating the manifests to verify the two tables and their help metadata. The synchronizer preserves already separated sections; their descriptions must still be reviewed against the actual interface whenever controls change. New components must supply their own interaction instructions, not inherit generic placeholder text.

Display the introductory component directly in the page, without a `tp-html-viewer` wrapper. **Basic usage is that introductory example**, reproduced as the **first selectable example in each of the four markup-language tabs** under Examples. Do not add a separate Basic usage heading or viewer before the language tabs. Keep the same content, attributes and behavior in all four versions. Full-window multi-page and multi-slide components are an exception: isolate their introduction in `tp-iframe` so they cannot take over the host documentation. A component that is itself a viewer remains a live viewer, without a second viewer around it. Run `node scripts/sync-component-doc-introductions.mjs` to synchronize introductions and the four Basic usage examples; use `--check` to verify the rule without rewriting files. This command preserves the page's introductory prose and frontmatter.

<details>
<summary><code>tp-text-to-speech</code>: documentation</summary>

Its TSDoc generates `text-to-speech.json` and the documentation API table. The documentation includes a live introduction and equivalent HTML, Markdown, AsciiDoc and reStructuredText examples. The component is exported publicly and registered in Utilities, the sidebar, component index and quality configuration.

In **User interactions**, use a **Mouse interactions** table to explain Speak, Pause, Resume, Stop, voice selection and the compact speaker/stop control, and a **Keyboard interactions** table for focus, button activation and Ctrl+? help. In **Author directives**, show `value`, the typed internal script and `src`, then explain `lang`, `show-text`, `lite` and the source precedence.

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: documentation</summary>
Create `public/docs/components/abc-music-viewer/index.md` and its four example files. Use the viewer directly as the introductory example; do not wrap a finished viewer inside another viewer.

```html
<tp-abc-music-viewer playback>
  <script type="tp/abc">
    X:1
    K:C
    C D E F G A B c|B A G F E D C2|
  </script>
</tp-abc-music-viewer>
```

In **Usage → User interactions**, explain Run versus Play, Pause, Resume, Stop, Reset and the source/output toggles. In **Usage → Author directives**, show `value`, script and `src` in `tp-tabs` and explain `lite` and playback configuration. Keep musical examples identical across HTML, `@tp/tp-markdown`, `@tp/tp-asciidoc` and `@tp/tp-restructuredtext`.

Register the public component in **Viewers**, its sidebar, index, accessibility inventory and quality configuration. Document the inherited `TpMarkupViewer` dependencies and abcjs; do not classify it as a standalone player or create an ABC playground implicitly.

Generate the JSON from TSDoc using the command in Prompt AI, then synchronize:

```bash
node scripts/sync-component-api-docs.mjs
node scripts/sync-component-accessibility-docs.mjs
pnpm examples:manifest
pnpm docs:api
```

The API is generated into `public/api`, with authored documentation under `public/docs`. The guide itself does not register a finished public component.

</details>

### Reports

During implementation, use `pnpm test:component COMPONENT`, `pnpm test:coverage:component COMPONENT`, and `pnpm test:a11y:component COMPONENT` independently. Run the complete coverage and accessibility reports only when explicitly reviewing those reports; when they run, commit their synchronized transversal summaries. Review the live documentation in a real browser before considering the component complete.

<details>
<summary><code>tp-text-to-speech</code>: verification</summary>

Only its focused unit tests and focused coverage were run while it was being implemented. The complete accessibility and component-quality reports were deliberately left for an explicit transversal review. Its live documentation is available on the [`tp-text-to-speech` component page](../../components/text-to-speech/index.md).

</details>

<details>
<summary><code>tp-abc-music-viewer</code>: verification</summary>
Once the component and examples exist:

```bash
pnpm test:component abc-music-viewer
pnpm test:coverage:component abc-music-viewer
pnpm test:a11y:component abc-music-viewer
```

Check source editing → Run → changed score → Reset in a real browser, then pane toggles, compact mode and responsive height. Check audible Play/Pause/Resume/Stop in Safari, Chrome and Firefox, including Stop or removal during preparation. Automated mocks and axe cannot prove audible output.

Refresh the Viewers and transversal reports only when explicitly requested, using the commands in Prompt AI. Report measured results, never assume that inheriting a well-tested base establishes full coverage of a new specialization.

</details>

## Checklist

### Completion checklist

- one canonical custom-element tag with the mandatory `tp-` prefix, and one public export;
- typed attributes with explicit JSON defaults;
- existing `tp-*` primitives reused;
- existing global styles and design tokens reused, with no duplicate global primitive;
- parser-safe inline content and context-aware `src` when applicable;
- keyboard, focus, status, reduced-motion and failure behavior considered;
- dedicated tests with 100% functions for a new component;
- four equivalent markup-language examples;
- the introductory example first in every language's example selector, labelled Basic usage, with no standalone viewer before the language tabs;
- Usage split into User interactions (end-user controls) and Author directives (markup declarations and configuration);
- component, family, sidebar, API and appendix documentation synchronized.

### Prompt AI

The following prompt is intended for an AI coding assistant that has no prior knowledge of `tp-components`. Replace the bracketed fields with the component specification. Give the assistant access to the repository and ask it to complete the implementation rather than merely describe one.

```text
You are working in the @tp monorepo, composed of these packages:
- @tp/tp-utilities provides shared browser and source-processing utilities used
  by the markup parsers and web components;
- @tp/tp-markdown parses Markdown for interactive documentation and educational
  content, and provides optional extensions that make web components easy to
  manipulate;
- @tp/tp-asciidoc parses AsciiDoc for the same interactive documentation and
  educational use cases;
- @tp/tp-restructuredtext parses reStructuredText in the browser through Pyodide and Docutils, 
  for the same interactive documentation and educational use cases;
- @tp/tp-components provides the TypeScript web-component library, its loaders,
  viewers, editors, educational controls, documentation, and tests;
- @tp/tp-doc-generator generates documentation tables for tp-* web components.

The monorepo is developed and managed in a Node.js environment with Git for
version control, pnpm for packages and scripts, TypeScript for source code,
TypeDoc for API documentation, Biome for formatting and static code rules,
Vite for development and builds, Vitest for unit tests and code coverage,
Playwright for browser tests across Chromium, Firefox, and WebKit, and axe-core
for automated accessibility checks.

More specifically, you will work in @tp/tp-components to create and integrate a
new public web component named <tp-[NAME]>.

Purpose:
[Describe what the component does and why authors need it.]

Target component family:
[Specify the existing documentation and quality family in which it belongs,
for example Utilities, Forms, Quizzes, Editors, or Plots. Do not leave this
decision to the assistant.]

Question component:
[Answer yes or no. If yes, the component must extend TpQuestion rather than
TpBase and follow the contracts shared by the existing question components.]

Required author-facing contract:
[List the supported markup forms, attributes with their types and defaults,
public properties and methods, emitted events, slots or content, and expected
fallback behavior. Include equivalent examples when useful.]

Before changing files:
1. Read the repository instructions and the complete component-authoring guide at
   public/docs/appendices/component-authoring/index.md.
2. Inspect TpBase, the components in the same family, and any existing tp-*
   component or utility that could provide part of the required behavior.
   If this is a question component, inspect TpQuestion and representative
   question components before defining the subclass.
3. Inspect the current testing, documentation, API-generation, accessibility,
   design-token, and family-registration conventions. Do not guess conventions
   that can be learned from the repository.
4. Preserve unrelated and pre-existing working-tree changes.

Implementation requirements:
- The canonical custom-element tag must begin with tp-. Create only one canonical
  tag unless an alias is explicitly requested.
- Extend TpBase, or TpQuestion when "Question component" is yes. Call
  super.connectedCallback(), preserve inherited observed attributes, and use
  inherited helpers such as lang, dir, boolean attributes, and
  ensureGlobalStyle() where appropriate.
- Boolean HTML attributes always use presence semantics: present means true and
  absent means false. The string value "false" still means true while the
  attribute is present. Use the inherited boolean-attribute helpers rather than
  parsing strings locally.
- Reuse existing tp-* components whenever they already implement the required
  semantics or interaction. Do not recreate an existing library component.
- Do not introduce a new reset, global style, colour, spacing, typography rule,
  focus treatment, or design token when a suitable library primitive exists.
  Keep component CSS scoped and load it once with a unique style identifier.
- If the component accepts textual declarative content, reuse
  TpDeclarativeTextSource and the library precedence src -> value -> internal
  script -> direct text. Always accept tp/NAME for <tp-NAME> when scripts are
  supported; also accept a suitable existing tp/* format type. Preserve
  parser-late content and resolve external sources in their document context.
- Treat lifecycle cleanup, stale asynchronous work, unavailable browser APIs,
  loading failures, and user-visible error/status feedback as part of the main
  functionality.
- Prefer native semantics and accessible tp-* controls. Provide keyboard
  equivalence, visible focus, reduced-motion handling, sufficient text size,
  accessible names and state announcements where relevant. Document both the
  component guarantees and the author responsibilities.
- Comment every public or private property and method whose role is not already
  self-evident. Keep the implementation focused and avoid unrelated refactoring.
- All TypeScript, CSS, JSON, and other supported source files must satisfy the
  repository's Biome rules, including every .test.ts file without exception.
  Run both formatting and lint checks; passing Vitest or TypeScript is not enough.
  Do not exclude test files or weaken their rules. Do not use explicit any. Follow Biome's preferred
  iteration form, including for...of instead of Array.forEach() when requested,
  and do not silence a rule merely to make the check pass.

After implementing or changing source files, run:
    pnpm exec biome check src/components/[NAME]
Fix every issue before continuing; use --write only for safe formatting fixes
and review the resulting changes.

Files and integration:
- Create src/components/[NAME]/[NAME].ts, [NAME].css, and [NAME].test.ts.
- Define the public TSDoc contract in the TypeScript source. Do not hand-edit the
  generated [NAME].json manifest.
- Guard customElements.define(), extend HTMLElementTagNameMap, and export the
  class from src/index.ts at its alphabetical position.
- Add the component documentation under public/docs/components/[NAME], an
  introductory example, identical examples for HTML and for the three supported
  tp markup-language packages: @tp/tp-markdown, @tp/tp-asciidoc, and
  @tp/tp-restructuredtext. Keep accessibility reporting in the transversal appendix; add dependencies, the
  user-specified family navigation, component index, quality configuration, and
  any other registration required by the repository.
- Reproduce the live introductory example as Basic usage, first in each of the
  four language example selectors. Never place a separate Basic usage viewer
  before the language tabs. Preserve equivalent content and behavior.
- Follow Basic usage with one grouped Attributes example for all local API
  attributes, then complementary examples. Remove every legacy Attribute: NAME
  example. Keep the same order in all four languages. Use one horizontal
  checkbox-list for booleans, one horizontal radio-list per enum, and textfields
  for other settings, with top labels and documented defaults. File loaders
  offer only Default, file1, file2 and file-unknown using verified local fixtures.
  Keep controls outside a single preview, synchronize direct interactions, and
  provide Reset defaults and Reload preview where necessary. Put JavaScript in
  examples/attributes.js shared by all languages and maintained by the generator.
  Components without local attributes need no empty Attributes panel.
  Run pnpm examples:check-structure and pnpm examples:check-descriptions.
- Before the Examples language tabs, add a native definition list with the exact
  example titles in selector order and one or two English sentences per example
  explaining what to try and observe. Maintain the editorial objectives in
  scripts/component-example-descriptions.mjs; do not invent unsupported behavior.
- Use native prose, lists, images, directives and inline roles in the three
  markup languages, never raw HTML or passthrough HTML for their layout.
  Keep HTML only as explicit code or HTML viewer/editor source data.
  Run pnpm examples:check-native-markup after editing examples or generators.
- Split Usage into exactly two subsections: User interactions, explaining the
  rendered controls and their effects to end users without construction details;
  and Author directives, showing markup declarations, content sources and
  configuration. In User interactions, provide exactly two tables, under
  Mouse interactions and Keyboard interactions. Identify every button, menu
  command and gesture, and explain its effect. Include Ctrl+? in every keyboard
  table: open help for the hovered component, falling back to the focused
  component; Shift may be needed to type ?. Distinguish toolbar buttons from
  palette commands and verify shortcuts against the implementation.
  Keep source tabs in Author directives.
  Explicitly state when the component adds no interaction. Use level-four
  headings for nested topics and review descriptions against the actual controls.

After the TSDoc contract is complete, generate the component JSON manifest:
    pnpm exec tsx --tsconfig tsconfig.node.json -e "import { generateComponentApiFiles } from './scripts/component-api-plugin.ts'; await generateComponentApiFiles(process.cwd(), 'src/components');"

After writing public/docs/components/[NAME], synchronize generated documentation
inside public/docs and verify it:
    node scripts/sync-component-api-docs.mjs
    node scripts/sync-component-accessibility-docs.mjs
    pnpm examples:manifest
    pnpm examples:check-labels
    pnpm examples:sync-descriptions
    pnpm examples:check-descriptions
    pnpm examples:check-markdown-fences
    node scripts/sync-component-doc-usage.mjs --check
    node scripts/check-component-api.mjs
    node scripts/sync-component-api-docs.mjs --check
    node scripts/sync-component-accessibility-docs.mjs --check

Generate the TypeDoc API in public/api (the repository path is lowercase) and
synchronize the "More details" links with:
    pnpm docs:api

Tests and verification:
- Write dedicated tests alongside the first implementation. A new component must
  begin with 100% function coverage and should meet at least 90% statements,
  90% lines, 90% functions, and 80% branches.
- Exercise the public contract, source precedence where applicable, rendering,
  interaction, events, keyboard behavior, lifecycle cleanup, asynchronous races,
  failures, unsupported APIs, and accessibility-relevant states.
- Run these targeted commands, using either [NAME] or tp-[NAME]:
    pnpm test:component [NAME]
    pnpm test:coverage:component [NAME]
    pnpm test:a11y:component [NAME]
- After the targeted tests, run the final Biome check for the component:
    pnpm exec biome check src/components/[NAME]
- Do not run or regenerate complete family, coverage, accessibility, Lighthouse,
  or other transversal reports unless I explicitly request them. When I do
  request report regeneration, use the family slug selected above and run:
    pnpm quality:[FAMILY-SLUG]
  This replaces the corresponding family report and refreshes the global
  component-quality synthesis in public/docs/appendices/component-quality.
  Then run:
    pnpm test:a11y
  This performs the complete three-browser axe matrix and replaces the
  accessibility synthesis in public/docs/appendices/accessibility. If a
  Lighthouse appendix refresh is also explicitly requested, run:
    pnpm lighthouse
  and verify the generated files under public/docs/appendices before finishing.
- Inspect the live documentation in a real browser when possible.

Complete the implementation autonomously when the repository provides enough
evidence. Ask me only if a missing product decision would materially change the
public contract. At the end, summarize the files and behavior added, targeted
test results, coverage percentages, accessibility results per browser engine,
and any remaining limitation or required manual verification.
```
