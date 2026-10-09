import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

interface ColorPair {
  name: string;
  foreground: string;
  background: string;
  minimum: number;
}

const contract = JSON.parse(readFileSync(
  resolve(import.meta.dirname, '../../config/accessibility-color-contract.json'),
  'utf8',
)) as { themes: string[]; pairs: ColorPair[] };

test('semantic color-token contrast contract', async ({ page }) => {
  await page.goto('/accessibility-test.html');
  await page.locator('#fixture').evaluate(async (fixture) => {
    await customElements.whenDefined('tp-base');
    fixture.append(document.createElement('tp-base'));
  });
  await page.locator('#fixture').evaluate((fixture, { themes, pairs }) => {
    for (const theme of themes) {
      const themeFixture = document.createElement('section');
      themeFixture.className = theme;
      themeFixture.style.background = 'var(--tp-background-color)';
      pairs.forEach((pair, index) => {
        const sample = document.createElement('span');
        sample.id = `${theme}-${index}`;
        sample.style.display = 'block';
        sample.style.fontSize = pair.minimum >= 4.5 ? '16px' : '24px';
        sample.style.color = `var(${pair.foreground})`;
        sample.style.backgroundColor = `var(${pair.background})`;
        sample.textContent = pair.name;
        themeFixture.append(sample);
      });
      fixture.append(themeFixture);
    }
  }, contract);

  const results = await new AxeBuilder({ page })
    .include('#fixture')
    .withRules(['color-contrast'])
    .analyze();
  const failures = results.violations.flatMap((violation) =>
    violation.nodes.map((node) => `${node.target.join(' ')}: ${node.failureSummary ?? violation.help}`));

  expect(failures, failures.join('\n')).toEqual([]);
});
