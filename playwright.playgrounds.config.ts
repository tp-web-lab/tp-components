import { defineConfig, devices } from "@playwright/test";

/** Focused functional regressions; no accessibility or coverage reports. */
export default defineConfig({
	testDir: "./tests/playgrounds",
	outputDir: "test-results/playgrounds",
	timeout: 120_000,
	expect: { timeout: 30_000 },
	workers: 1,
	reporter: "list",
	use: { baseURL: "http://127.0.0.1:4198" },
	webServer: {
		command:
			"pnpm vite --config vite.playwright.config.ts --host 127.0.0.1 --port 4198",
		url: "http://127.0.0.1:4198",
		reuseExistingServer: !process.env.CI,
	},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
		{ name: "firefox", use: { ...devices["Desktop Firefox"] } },
		{ name: "webkit", use: { ...devices["Desktop Safari"] } },
	],
});
