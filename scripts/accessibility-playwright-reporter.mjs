import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const results = new Map();
const componentsRoot = join(root, 'public/docs/components');
const expectedComponentNames = new Set(readdirSync(componentsRoot).filter((component) =>
  existsSync(join(componentsRoot, component, 'examples/examples.html'))).map((component) => `tp-${component}`));
const expectedComponents = expectedComponentNames.size;

export default class AccessibilityReporter {
  onTestEnd(test, result) {
    const browser = test.parent.project()?.name;
    const component = test.title;
    if (!expectedComponentNames.has(component)) return;
    let recorded = false;
    for (const attachment of result.attachments) {
      if (attachment.name !== 'axe-result' || attachment.body === undefined) continue;
      const scan = JSON.parse(attachment.body.toString('utf8'));
      results.set(`${scan.browser}/${scan.component}`, scan);
      recorded = true;
    }
    if (!recorded && browser !== undefined) {
      results.set(`${browser}/${component}`, {
        browser,
        component,
        incomplete: 0,
        scanError: result.error?.message ?? `Playwright ended with status ${result.status}`,
        violations: [],
      });
    }
  }

  onEnd() {
    if (results.size === 0) return;

    const scans = [...results.values()];
    if (scans.length < expectedComponents * 3) return;

    const browsers = ['chromium', 'firefox', 'webkit'].map((browser) => {
      const browserScans = scans.filter((result) => result.browser === browser);
      return {
        browser,
        components: browserScans.length,
        complete: browserScans.length === expectedComponents
          && browserScans.every((scan) => scan.scanError === undefined),
        scanErrors: browserScans.filter((scan) => scan.scanError !== undefined).length,
        incomplete: browserScans.reduce((total, scan) => total + scan.incomplete, 0),
        violations: browserScans.reduce((total, scan) => total + scan.violations.length, 0),
      };
    });
    const violations = scans.flatMap((result) =>
      result.violations.map((violation) => ({
        browser: result.browser,
        component: result.component,
        ...violation,
      })));
    const scanErrors = scans.filter((result) => result.scanError !== undefined).map((result) => ({
      browser: result.browser,
      component: result.component,
      message: result.scanError,
    }));
    const payload = {
      generatedAt: new Date().toISOString(),
      expectedComponents,
      standard: 'WCAG 2.2 A and AA',
      browsers,
      scanErrors,
      violations,
    };
    const output = join(root, 'config/accessibility-browser-results.json');
    mkdirSync(join(root, 'config'), { recursive: true });
    writeFileSync(output, `${JSON.stringify(payload, null, 2)}\n`);
    execFileSync(process.execPath, [join(root, 'scripts/generate-accessibility-report.mjs')], {
      cwd: root,
      stdio: 'inherit',
    });
  }
}
