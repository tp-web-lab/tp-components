import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const componentsRoot = join(root, 'src/components');
const docsRoot = join(root, 'public/docs/components');
const reportPath = join(root, 'public/docs/appendices/accessibility/index.md');
const browserResultsPath = join(root, 'config/accessibility-browser-results.json');
const checkOnly = process.argv.includes('--check');

function oneLine(value) {
  return value.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '').split('\n')[0].replaceAll('|', '\\|');
}

function collectTestFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTestFiles(path);
    return entry.name.endsWith('.test.ts') ? [{ path, source: readFileSync(path, 'utf8') }] : [];
  });
}

const testFiles = collectTestFiles(componentsRoot);

function testCoverage(directory) {
  const componentPath = `${join(componentsRoot, directory)}/`;
  const tagName = `tp-${directory}`;
  return testFiles.some((test) =>
    test.path.startsWith(componentPath) || test.source.includes(tagName));
}

function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function classComment(source) {
  const classIndex = source.search(/export\s+class\s+\w+/);
  if (classIndex < 0) return '';
  const start = source.lastIndexOf('/**', classIndex);
  const end = source.indexOf('*/', start);
  return start < 0 || end < 0 ? '' : source.slice(start, end + 2);
}

function hasTag(source, tag) {
  return new RegExp(`^\\s*\\*\\s*@${tag}\\s+`, 'm').test(classComment(source));
}

const CONTROL_PATTERN = /<(?:button|input|select|textarea|details|summary|dialog|tp-button|tp-icon-button)\b|createElement\(['"](?:button|input|select|textarea|details|summary|dialog|tp-button|tp-icon-button)['"]\)|HTML(?:Button|Input|Select|TextArea)Element/;
const POINTER_HANDLER_PATTERN = /addEventListener\(\s*['"](?:click|pointerdown|pointerup|mousedown|mouseup|dragstart|drop)['"]|\.on(?:click|pointerdown|pointerup|mousedown|mouseup|dragstart|drop)\s*=/;
const KEYBOARD_HANDLER_PATTERN = /addEventListener\(\s*['"](?:keydown|keyup|keypress)['"]|\.on(?:keydown|keyup|keypress)\s*=|KeyboardEvent/;

function inspect(directory) {
  const source = read(join(componentsRoot, directory, `${directory}.ts`));
  const css = read(join(componentsRoot, directory, `${directory}.css`));
  const hasTests = source !== '' && testCoverage(directory);
  const nativeControls = CONTROL_PATTERN.test(source);
  const pointer = POINTER_HANDLER_PATTERN.test(source);
  const keyboard = KEYBOARD_HANDLER_PATTERN.test(source);
  const aria = /aria-[a-z-]+|role=["'`]|setAttribute\(['"]role/.test(source);
  const motion = /(?:^|[;{]\s*)(?:animation(?:-[a-z-]+)?|transition(?:-[a-z-]+)?)\s*:/.test(css)
    || /\.animate\s*\(/.test(source);
  const reducedMotion = /prefers-reduced-motion/.test(css)
    || /prefers-reduced-motion/.test(source);
  const outlineRemoval = /outline\s*:\s*none/.test(css);
  const focusReplacement = /:focus-visible|:focus-within/.test(css);
  const smallText = /font-size\s*:\s*(?:0\.(?:[0-6]\d*|7[0-4])rem|(?:[0-9]|1[01](?:\.\d+)?)px)/.test(css);
  const signals = [];

  if (source === '') signals.push('documentation alias');
  if (pointer && !keyboard && !nativeControls) signals.push('keyboard equivalence');
  if (motion && !reducedMotion) signals.push('reduced motion');
  if (outlineRemoval && !focusReplacement) signals.push('focus indicator');
  if (smallText) signals.push('small text');
  if (source !== '' && !hasTests) signals.push('no detected test coverage');

  return {
    aria,
    contract: hasTag(source, 'accessibility') ? 'Detailed' : 'Static',
    directory,
    hasSource: source !== '',
    hasTests,
    keyboard,
    nativeControls,
    pointer,
    signals,
  };
}

function componentLink(directory) {
  return `[\`tp-${directory}\`](../../components/${directory}/index.md)`;
}

function listForSignal(components, signal) {
  const matches = components.filter((item) => item.signals.includes(signal));
  if (matches.length === 0) return 'None identified.';
  return matches.map((item) => componentLink(item.directory)).join(', ');
}

const components = readdirSync(docsRoot)
  .filter((directory) => existsSync(join(docsRoot, directory, 'index.md')))
  .sort()
  .map(inspect);
const detailed = components.filter((item) => item.contract === 'Detailed').length;
const tested = components.filter((item) => item.hasTests).length;
const native = components.filter((item) => item.nativeControls).length;
const aria = components.filter((item) => item.aria).length;
const keyboard = components.filter((item) => item.keyboard).length;
const nativeWithoutAria = components.filter(
  (item) => !item.aria && item.nativeControls,
).length;
const interactionWithoutDetectedSemantics = components.filter(
  (item) => item.hasSource && !item.aria && !item.nativeControls && item.pointer,
).length;
const noDirectInteraction = components.filter(
  (item) => item.hasSource && !item.aria && !item.nativeControls && !item.pointer,
).length;
const aliases = components.filter((item) => !item.hasSource).length;
const browserResults = existsSync(browserResultsPath)
  ? JSON.parse(read(browserResultsPath))
  : null;
const browserAutomationFinding = browserResults === null
  || !browserResults.browsers.every((result) => result.complete)
  ? '- The axe browser matrix has not completed for every component example in Chromium, Firefox, and WebKit.\n'
  : '';

const colorManagementSection = `### Color and contrast management

The base theme derives color scales from seed tokens, but components consume semantic tokens describing a role and a surface rather than using an arbitrary palette step as text color. For example, a soft brand surface uses the paired \`--tp-brand-fill-soft\` and \`--tp-brand-text-on-soft\` tokens; buttons use the guaranteed \`fill-loud\` / \`text-on-loud\` pairs. Inline code inherits the surrounding semantic foreground so that it remains valid inside callouts, cards, buttons, and inverted surfaces.

The foreground/background pairs that form the library contract are declared in \`config/accessibility-color-contract.json\`. A dedicated [Playwright](https://playwright.dev/docs/accessibility-testing) test renders every pair in both \`tp-light\` and \`tp-dark\`, then delegates the assessment of the computed browser colors to [axe-core](https://github.com/dequelabs/axe-core). The full component matrix separately checks composed states such as CodeMirror active lines, placeholders, buttons, callouts, graphs, and nested themes.

Text pairs target the [WCAG 2.2 contrast minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum) of 4.5:1 for ordinary text. Essential graphical objects and user-interface boundaries target the [non-text contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast) threshold of 3:1. The color and icon inspectors choose the higher-contrast black or white foreground for arbitrary preview swatches. The library does not otherwise alter author colors dynamically at runtime: a failing shared pair must be corrected in its semantic token and visually reviewed.

Run \`pnpm test:a11y:colors\` for the color-token contract or \`pnpm test:a11y\` for the contract plus every documented component example. The latter also regenerates this transversal report.
`;

const incompleteChecksExplanation = `### Understanding incomplete checks

An incomplete check is a rule for which axe-core found relevant content but could not determine a pass or failure with sufficient certainty. Typical causes include contrast over images or gradients, content hidden behind another element, complex stacking or clipping, and conditions that require visual or semantic judgement. It is not a confirmed violation, but it is also not a pass.

The number in the table is the sum of incomplete axe rule results across all component-example scans for that browser engine, not a count of inaccessible components. Different rendering engines can therefore report slightly different totals. These items form a manual-review queue: inspect the affected node and rule, decide whether it passes, fails, or is not applicable, record the evidence, and fix confirmed failures. A complete browser scan can legitimately contain incomplete checks; \`Complete\` only means that every expected example ran without a scan error.
`;

function browserResultsSection() {
  if (browserResults === null) {
    return `## Automated browser checks

The browser matrix uses [Playwright](https://playwright.dev/docs/accessibility-testing) with [axe-core](https://github.com/dequelabs/axe-core). No result has been recorded yet. Run \`pnpm test:a11y\` to scan every component example in Chromium, Firefox, and WebKit and update this report.

${colorManagementSection}
${incompleteChecksExplanation}`;
  }

  const browserRows = [...browserResults.browsers].sort((left, right) => left.browser.localeCompare(right.browser)).map((result) =>
    `| ${result.browser} | ${result.components}/${browserResults.expectedComponents} | ${result.complete ? 'Yes' : 'No'} | ${result.violations} | ${result.incomplete} | ${result.scanErrors ?? 0} |`).join('\n');
  const complete = browserResults.browsers.every((result) => result.complete);
  const browserLabel = (browser) => browser === 'webkit'
    ? 'WebKit'
    : `${browser[0]?.toUpperCase() ?? ''}${browser.slice(1)}`;
  const violationTabs = [...browserResults.browsers].sort((left, right) => left.browser.localeCompare(right.browser)).map(({ browser }) => {
    const violations = browserResults.violations
      .filter((violation) => violation.browser === browser)
      .sort((left, right) => left.component.localeCompare(right.component));
    const rows = violations.length === 0
      ? 'No automated WCAG A or AA violations were detected.'
      : `| Component | Rule | Impact |\n  | --- | --- | --- |\n${violations.map((violation) =>
        `  | \`${violation.component}\` | [${violation.id}](${violation.helpUrl}) | ${violation.impact ?? 'unknown'} |`).join('\n')}`;
    return `${browserLabel(browser)}\n: ${rows}`;
  }).join('\n\n');
  const violationRows = browserResults.violations.length === 0 && complete
    ? 'No automated WCAG A or AA violations were detected.'
    : browserResults.violations.length === 0
      ? 'No violation was detected in the completed scans, but the browser matrix is incomplete.'
      : `::::::::: tp-tabs\n${violationTabs}\n:::::::::`;
  const scanErrorRows = (browserResults.scanErrors ?? []).length === 0
    ? ''
    : `\n\n### Scan errors\n\n| Component | Browser | Error |\n| --- | --- | --- |\n${[...browserResults.scanErrors].sort((left, right) => left.component.localeCompare(right.component)).map((error) =>
      `| \`${error.component}\` | ${error.browser} | ${oneLine(error.message)} |`).join('\n')}`;

  return `## Automated browser checks

The browser matrix uses [Playwright](https://playwright.dev/docs/accessibility-testing) with [axe-core](https://github.com/dequelabs/axe-core).

Semantic foreground/background pairs are declared in \`config/accessibility-color-contract.json\` and checked in the light and dark themes by the same three browser engines. This prevents a shared token change from silently introducing contrast regressions across multiple components.

Last axe scan: ${browserResults.generatedAt}  
${browserResults.validationWarning ? `\n> **Invalid component scan:** ${browserResults.validationWarning}\n` : ""}
${browserResults.rechecks ? `\n${browserResults.rechecks.passed} WebKit checks affected by browser navigation/teardown timeouts were rerun successfully in a fresh, single-worker process at ${browserResults.rechecks.generatedAt}: ${browserResults.rechecks.components.map((component) => `\`${component}\``).join(", ")}. Their actual axe results replace the missing scans.\n` : ""}
Ruleset: ${browserResults.standard}. WebKit approximates Safari's rendering engine but does not replace periodic testing in Safari on macOS.

| Browser engine | Component examples | Complete | Violations | Incomplete checks | Scan errors |
| --- | ---: | --- | ---: | ---: | ---: |
${browserRows}

${incompleteChecksExplanation}

${colorManagementSection}

### Detected violations\n\n${violationRows}${scanErrorRows}`;
}

const rows = components.map((item) => {
  const evidence = [
    item.nativeControls ? 'native or library controls' : '',
    item.aria ? 'ARIA' : '',
    item.keyboard ? 'keyboard handling' : '',
  ].filter(Boolean).join(', ') || 'no component-owned interaction detected';
  const followUp = item.signals.length > 0 ? item.signals.join(', ') : 'browser and human validation';
  const testCoverage = !item.hasSource ? 'N/A' : item.hasTests ? 'Yes' : 'No';
  return `| ${componentLink(item.directory)} | ${item.contract} | ${testCoverage} | ${evidence} | ${followUp} |`;
}).join('\n');

const report = `# Accessibility review

<tp-toc position="end" expand-all open brand></tp-toc>

This report is the transversal accessibility inventory for the \`tp-components\` library. It targets the Standard profile of [A11Y.md](https://github.com/fecarrico/A11Y.md/blob/main/docs/en/A11Y.md), based on [WCAG 2.2](https://www.w3.org/TR/WCAG22/) Level AA.

It records static implementation evidence, not a certification. Keyboard paths, accessible names in context, 200% zoom, 320 CSS px reflow, computed contrast, voice control, screen readers, and other assistive technologies still require browser and human validation.

## Coverage

| Measure | Result |
| --- | --- |
| Documented component pages | ${components.length} |
| Detailed accessibility contracts | ${detailed} |
| Static implementation reviews | ${components.length} |
| Component implementations with detected dedicated or shared test coverage | ${tested} |
| Components containing keyboard handling | ${keyboard} |

### Source of semantics

These categories are mutually exclusive and cover all ${components.length} documented entries. Components in the first category may also use native or library controls.

| Static classification | Components |
| --- | ---: |
| Explicit ARIA markup or state in the primary source | ${aria} |
| Native HTML or accessible library controls, without local ARIA | ${nativeWithoutAria} |
| Component-owned pointer interaction without detected semantics | ${interactionWithoutDetectedSemantics} |
| No direct component-owned pointer interaction or exposed control detected | ${noDirectInteraction} |
| Documentation aliases without a primary implementation file | ${aliases} |

For context, ${native} components use a detected native HTML control or an accessible library control, including ${native - nativeWithoutAria} that also contain explicit ARIA. ARIA is not a compliance score: native semantics should be preferred when sufficient, and delegated semantics may live in a composed component or dependency.

Accessibility reporting is centralized in this appendix. Component pages do not repeat a generic Accessibility section. Source metadata retains implementation guarantees, consumer responsibilities, and keyboard behavior; automated checks do not replace human validation.

## Method

The review inspects each primary TypeScript source, component stylesheet, dedicated unit test, and generated documentation page. It records native and library controls, explicit ARIA, keyboard and focus handling, live feedback, motion, focus-outline removal, small text, and missing component tests. The static classification does not inspect the rendered accessibility tree and cannot by itself distinguish a deliberately non-interactive component from every form of delegated interaction. Pattern-specific guarantees are documented only when confirmed directly in the implementation.

The signals below are triage indicators. They identify where targeted inspection or tests are required; they are not, by themselves, confirmed WCAG failures.

${browserResultsSection()}

## Cross-cutting findings

### High priority

${browserAutomationFinding}- Image insertion in \`tp-prose-editor\` permits an empty alternative without recording a human-confirmed decorative decision.
- Audio and video insertion does not establish captions, transcript, audio-description, or autoplay evidence.

### Triage queues

Each queue groups components where the static review still detects a specific risk pattern: missing keyboard equivalence, unmitigated motion, a removed focus outline without a visible replacement, undersized text, or missing test coverage. An empty queue means that no corresponding source-code pattern remains detected; it does not replace browser, assistive-technology, or human validation.

- Keyboard-equivalence review: ${listForSignal(components, 'keyboard equivalence')}
- Reduced-motion review: ${listForSignal(components, 'reduced motion')}
- Focus-indicator review: ${listForSignal(components, 'focus indicator')}
- Small-text review: ${listForSignal(components, 'small text')}
- Missing detected component test coverage: ${listForSignal(components, 'no detected test coverage')}

## Future components

Authors should add repeatable \`@accessibility\`, \`@accessibilityresponsibility\`, and \`@keyboard {Key}\` tags to the component class. Keep reporting in this appendix and explain relevant user interactions in Usage rather than adding a generic Accessibility section to each component page.

Author-facing \`ul\`, \`ol\`, and \`dl\` structures are treated as a simple declarative input format. A component may transform that source into a different runtime structure when required by the accessible interaction pattern, while preserving content, order, and relationships. Runtime controls must reuse an existing \`tp-*\` component whenever one provides the required semantics; a native element is introduced directly only when no suitable library component exists.

A new interactive component is not considered accessibility-reviewed until its detailed contract replaces the static observations and its browser and human verification requirements are recorded here or in the project accessibility report.

## Component inventory

| Component | Contract | Tests | Static evidence | Required follow-up |
| --- | --- | --- | --- | --- |
${rows}
`;

const current = read(reportPath);
if (current !== report) {
  if (checkOnly) {
    console.error(`Outdated accessibility report: ${reportPath}`);
    process.exitCode = 1;
  } else {
    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, report);
    console.log(`Generated accessibility report for ${components.length} components.`);
  }
} else if (checkOnly) {
  console.log('The transversal accessibility report matches the component sources.');
}
