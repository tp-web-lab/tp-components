import { access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import process from 'node:process';
import { chromium } from '@playwright/test';

const environment = { ...process.env };
const playwrightChromium = chromium.executablePath();

try {
  await access(playwrightChromium);
  environment.CHROME_PATH = playwrightChromium;
} catch {
  // Lighthouse CI will use the Chrome installation provided by the host.
}

const executable = process.platform === 'win32'
  ? 'node_modules/.bin/lhci.cmd'
  : 'node_modules/.bin/lhci';
const child = spawn(executable, ['autorun'], {
  env: environment,
  stdio: 'inherit',
});

child.once('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.once('exit', (code) => {
  process.exitCode = code ?? 1;
});
