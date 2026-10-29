const port = Number(process.env.TP_LIGHTHOUSE_PORT ?? 4174);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('TP_LIGHTHOUSE_PORT must be an integer between 1 and 65535.');
}
const baseUrl = `http://127.0.0.1:${port}`;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `pnpm exec vite build && pnpm exec vite preview --host 127.0.0.1 --port ${port} --strictPort`,
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      numberOfRuns: process.env.CI ? 3 : 1,
      isSinglePageApplication: true,
      url: [
        `${baseUrl}/lighthouse/single-page-accessibility.html`,
        `${baseUrl}/lighthouse/single-page-code-editor.html`,
        `${baseUrl}/lighthouse/single-page-markup-multi-pages.html`,
      ],
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        maxWaitForLoad: 90000,
        chromeFlags: '--headless=new --no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8, aggregationMethod: 'median' }],
        'categories:accessibility': ['warn', { minScore: 0.95, aggregationMethod: 'median' }],
        'categories:best-practices': ['warn', { minScore: 0.9, aggregationMethod: 'median' }],
        'categories:seo': ['warn', { minScore: 0.9, aggregationMethod: 'median' }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci/reports',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%.report.%%EXTENSION%%',
    },
  },
};
