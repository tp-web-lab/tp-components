/** Server-only bridge for local Vite development and preview. */
import { dirname, resolve } from 'node:path';
import { explanationTarget, saveExplanation } from './ai-explanation-files.mjs';
import { loadEnv } from 'vite';
import { providerSettings, providerRequest, providerResult } from './ai-providers.mjs';

export function questionAiPlugin() {
  let settings = {};
  let fileConfig;
  const install = (server, development = false) => {
    server.middlewares.use('/api/tp-question-ai', async (req, res) => {
      const send = (status, body) => {
        res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify(body));
      };
      if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) return send(403, { error: 'Local access only.' });
      if (req.headers.origin) {
        try { if (new URL(req.headers.origin).host !== req.headers.host) return send(403, { error: 'Invalid origin.' }); }
        catch { return send(403, { error: 'Invalid origin.' }); }
      }
      if (req.method === 'GET') {
        const assistant = new URL(req.url || '/', 'http://localhost').searchParams.get('assistant') || 'openai';
        if (!Object.hasOwn(settings, assistant)) return send(400, { error: 'Invalid assistant.' });
        return send(200, { available: Boolean(settings[assistant].key) });
      }
      if (req.method !== 'POST') return send(405, { error: 'Method not allowed.' });
      if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'JSON required.' });
      try {
        let body = '';
        for await (const chunk of req) {
          body += chunk;
          if (body.length > 60000) return send(413, { error: 'Question is too long.' });
        }
        let input;
        try { input = JSON.parse(body); } catch { return send(400, { error: 'Invalid JSON.' }); }
        if (typeof input.prompt !== 'string' || !input.prompt.trim() || input.prompt.length > 50000) return send(400, { error: 'Invalid prompt.' });
        if (input.aiApi !== true) return send(403, { error: 'API transmission is disabled.' });
        const assistant = input.assistant ?? 'openai';
        if (typeof assistant !== 'string' || !Object.hasOwn(settings, assistant)) return send(400, { error: 'Invalid assistant.' });
        if (input.model !== undefined && (typeof input.model !== 'string' || input.model.length > 256 || /[\s\x00-\x1f]/.test(input.model))) return send(400, { error: 'Invalid model.' });
        let target;
        if (development && input.explanationUrl !== undefined) {
          try { target = await explanationTarget(fileConfig, input.explanationUrl, `http://${req.headers.host}`); }
          catch { return send(400, { error: 'Invalid explanation destination.' }); }
        }
        const selected = { ...settings[assistant], ...(input.model ? { model: input.model } : {}) };
        if (!selected.key) return send(200, { available: false });
        const { url, headers, body: providerBody } = providerRequest(assistant, selected, input.prompt);
        const upstream = await fetch(url, {
          method: 'POST', headers,
          body: JSON.stringify(providerBody), signal: AbortSignal.timeout(60000),
        });
        if (!upstream.ok) return send(502, { error: `AI service returned HTTP ${upstream.status}.` });
        const data = await upstream.json();
        const { text, model } = providerResult(assistant, selected, data);
        if (typeof text !== 'string' || !text.trim()) return send(502, { error: 'AI returned no explanation.' });
        let saveWarning;
        if (target) {
          try {
            await explanationTarget(fileConfig, input.explanationUrl, `http://${req.headers.host}`);
            await saveExplanation(target, input.prompt, text);
          } catch { saveWarning = 'The explanation was generated, but its files could not be saved.'; }
        }
        send(200, { text, model, ...(saveWarning ? { saveWarning } : {}) });
      } catch { send(502, { error: 'AI service unavailable. Please try again.' }); }
    });
  };
  return {
    name: 'tp-question-ai',
    configResolved(config) {
      fileConfig = { publicDir: config.publicDir === false ? false : resolve(config.root, config.publicDir || "public"), base: config.base || "/" };
      const directories = [];
      for (let dir = resolve(config.root); ; dir = dirname(dir)) {
        directories.unshift(dir);
        if (dirname(dir) === dir) break;
      }
      const env = Object.assign({}, ...directories.map(dir => loadEnv(config.mode, dir, '')), process.env);
      settings = providerSettings(env);
    },
    configureServer: server => install(server, true),
    configurePreviewServer: server => install(server, false),
  };
}
