// @vitest-environment node
import { mkdtemp, readFile, realpath, rm, mkdir, writeFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { afterEach, expect, it, vi } from 'vitest';
vi.mock('vite', () => ({ loadEnv: vi.fn() }));
import { loadEnv } from 'vite';
import { questionAiPlugin } from './question-ai.mjs';

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
async function request(env, method, payload, origin = 'http://localhost:4316', url = '/', config = {}, preview = false) {
  for (const key of ['AI_API_KEY','OPENAI_API_KEY','AI_MODEL','OPENAI_MODEL','AI_BASE_URL','OPENAI_BASE_URL', ...['ANTHROPIC','GOOGLE','GEMINI','MISTRAL'].flatMap(prefix => ['API_KEY','MODEL','BASE_URL'].map(suffix => `${prefix}_${suffix}`))]) vi.stubEnv(key, env[key] || '');
  loadEnv.mockReturnValue(env);
  const plugin = questionAiPlugin();
  plugin.configResolved({ root: '/test/project', mode: 'test', ...config });
  let handle;
  (preview ? plugin.configurePreviewServer : plugin.configureServer)({ middlewares: { use: (_path, handler) => { handle = handler; } } });
  const req = Readable.from([JSON.stringify(payload)]);
  req.method = method;
  req.url = url;
  req.socket = { remoteAddress: '127.0.0.1' };
  req.headers = { host: 'localhost:4316', origin, 'content-type': 'application/json' };
  const result = {};
  await handle(req, { writeHead: status => { result.status = status; }, end: body => { result.body = JSON.parse(body); } });
  return result;
}
it('reports absence without calling AI', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  expect((await request({}, 'GET', {})).body).toEqual({ available: false });
  expect(fetch).not.toHaveBeenCalled();
});
it('sends the prompt only on POST, using server settings without returning the key', async () => {
  const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: 'Reasoning.' } }] }) });
  vi.stubGlobal('fetch', fetch);
  const env = { AI_API_KEY: 'test-secret', AI_BASE_URL: 'https://example.test/v1', AI_MODEL: 'test-model' };
  expect((await request(env, 'GET', {})).body).toEqual({ available: true });
  expect(fetch).not.toHaveBeenCalled();
  const response = await request(env, 'POST', { aiApi: true, prompt: 'Educational question' });
  expect(response.body).toEqual({ text: 'Reasoning.', model: 'test-model' });
  expect(fetch.mock.calls[0][0]).toBe('https://example.test/v1/chat/completions');
  const body = JSON.parse(fetch.mock.calls[0][1].body);
  expect(body.model).toBe('test-model');
  expect(body.messages[1].content).toBe('Educational question');
  expect(JSON.stringify(response)).not.toContain('test-secret');
});
it('rejects cross-origin requests before contacting AI', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  expect((await request({ AI_API_KEY: 'test' }, 'POST', { aiApi: true, prompt: 'Question' }, 'https://other.test')).status).toBe(403);
  expect(fetch).not.toHaveBeenCalled();
});
it('does not return upstream errors or credentials', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }));
  expect((await request({ AI_API_KEY: 'test-secret' }, 'POST', { aiApi: true, prompt: 'Question' })).body).toEqual({ error: 'AI service returned HTTP 401.' });
});

it('returns the actual model reported by the provider', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ model: 'actual-model-version', choices: [{ message: { content: 'Explanation.' } }] }) }));
  const response = await request({ AI_API_KEY: 'test', AI_MODEL: 'requested-alias' }, 'POST', { aiApi: true, prompt: 'Question' });
  expect(response.body.model).toBe('actual-model-version');
});

it('requires explicit API authorization', async () => {
 const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
 expect((await request({ AI_API_KEY: 'test' }, 'POST', { prompt: 'Question' })).status).toBe(403);
 expect(fetch).not.toHaveBeenCalled();
});
it.each([
 ['anthropic', 'ANTHROPIC', '/messages', 'x-api-key', { content: [{ type: 'text', text: 'Explanation.' }] }],
 ['google', 'GOOGLE', '/models/test-model:generateContent', 'x-goog-api-key', { candidates: [{ content: { parts: [{ text: 'Explanation.' }] } }] }],
 ['mistral', 'MISTRAL', '/chat/completions', 'Authorization', { choices: [{ message: { content: 'Explanation.' } }] }],
])('uses the %s protocol and its own credentials', async (assistant, prefix, path, header, output) => {
 const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => output }); vi.stubGlobal('fetch', fetch);
 const result = await request({ [`${prefix}_API_KEY`]: 'provider-key', [`${prefix}_MODEL`]: 'test-model', [`${prefix}_BASE_URL`]: 'https://provider.test/v1', OPENAI_API_KEY: 'other-key' }, 'POST', { aiApi: true, assistant, prompt: 'Question' });
 expect(result.body).toEqual({ text: 'Explanation.', model: 'test-model' });
 expect(fetch.mock.calls[0][0]).toBe(`https://provider.test/v1${path}`);
 expect(fetch.mock.calls[0][1].headers[header]).toContain('provider-key');
 expect(fetch.mock.calls[0][1].body).toContain('Question');
 expect(JSON.stringify(fetch.mock.calls)).not.toContain('other-key');
});
it('never reuses the OpenAI key for another assistant', async () => {
 const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
 expect((await request({ OPENAI_API_KEY: 'secret' }, 'POST', { aiApi: true, assistant: 'anthropic', prompt: 'Question' })).body).toEqual({ available: false });
 expect(fetch).not.toHaveBeenCalled();
});

it('checks availability for the selected provider only', async () => {
 const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
 expect((await request({ OPENAI_API_KEY: 'test' }, 'GET', {}, 'http://localhost:4316', '/?assistant=anthropic')).body).toEqual({ available: false });
 expect((await request({ ANTHROPIC_API_KEY: 'test' }, 'GET', {}, 'http://localhost:4316', '/?assistant=anthropic')).body).toEqual({ available: true });
 expect((await request({}, 'GET', {}, 'http://localhost:4316', '/?assistant=invalid')).status).toBe(400);
 expect(fetch).not.toHaveBeenCalled();
});

it('uses a per-question model without changing the configured default', async () => {
 const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: 'Explanation.' } }] }) }); vi.stubGlobal('fetch', fetch);
 const env = { OPENAI_API_KEY: 'test', AI_MODEL: 'configured-model' };
 expect((await request(env, 'POST', { aiApi: true, assistant: 'openai', model: 'gpt-6-luna', prompt: 'Question' })).body.model).toBe('gpt-6-luna');
 expect(JSON.parse(fetch.mock.calls[0][1].body).model).toBe('gpt-6-luna');
 expect((await request(env, 'POST', { aiApi: true, assistant: 'openai', prompt: 'Question' })).body.model).toBe('configured-model');
});
it.each([{}, 'model with spaces', 'x'.repeat(257)])('rejects malformed model overrides', async (model) => {
 const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
 expect((await request({ OPENAI_API_KEY: 'test' }, 'POST', { aiApi: true, model, prompt: 'Question' })).status).toBe(400);
 expect(fetch).not.toHaveBeenCalled();
});

const temporary = [];
afterEach(async () => { await Promise.all(temporary.splice(0).map(path => rm(path, { recursive: true, force: true }))); });
async function fixture() {
 const root = await realpath(await mkdtemp(join(tmpdir(), 'tp-ai-files-')));
 temporary.push(root);
 return { root, publicDir: join(root, 'public'), base: '/course/' };
}
const explanationPayload = { aiApi: true, prompt: 'Exact prompt.\n', explanationUrl: 'http://localhost:4316/course/docs/explanations/slope.md' };
it('writes both Markdown files after success in development, and refreshes them', async () => {
 const config = await fixture();
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: 'Saved explanation.' } }] }) }));
 const call = payload => request({ OPENAI_API_KEY: 'test' }, 'POST', payload, 'http://localhost:4316', '/', config);
 expect((await call(explanationPayload)).status).toBe(200);
 const target = join(config.publicDir, 'docs/explanations/slope');
 expect(await readFile(target + '.md', 'utf8')).toBe('Saved explanation.');
 expect(await readFile(target + '.prompt.md', 'utf8')).toBe(explanationPayload.prompt);
 await call({ ...explanationPayload, prompt: 'Changed prompt.' });
 expect(await readFile(target + '.prompt.md', 'utf8')).toBe('Changed prompt.');
});
it('does not write in preview', async () => {
 const config = await fixture();
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: 'Explanation.' } }] }) }));
 expect((await request({ OPENAI_API_KEY: 'test' }, 'POST', explanationPayload, 'http://localhost:4316', '/', config, true)).status).toBe(200);
 await expect(readFile(join(config.publicDir, 'docs/explanations/slope.md'))).rejects.toThrow();
});
it('preserves existing files when the API fails', async () => {
 const config = await fixture();
 const target = join(config.publicDir, 'docs/explanations/slope');
 await mkdir(join(config.publicDir, 'docs/explanations'), { recursive: true });
 await writeFile(target + '.md', 'Old explanation'); await writeFile(target + '.prompt.md', 'Old prompt');
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
 expect((await request({ OPENAI_API_KEY: 'test' }, 'POST', explanationPayload, 'http://localhost:4316', '/', config)).status).toBe(502);
 expect(await readFile(target + '.md', 'utf8')).toBe('Old explanation');
 expect(await readFile(target + '.prompt.md', 'utf8')).toBe('Old prompt');
});
it.each(['http://other.test/course/explanations/x.md', 'http://localhost:4316/course/x.md', 'http://localhost:4316/course/explanations/%2e%2e%2fsecret.md', 'http://localhost:4316/course/explanations/x.prompt.md'])('rejects unsafe destinations %s', async explanationUrl => {
 const config = await fixture(); const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
 expect((await request({ OPENAI_API_KEY: 'test' }, 'POST', { ...explanationPayload, explanationUrl }, 'http://localhost:4316', '/', config)).status).toBe(400);
 expect(fetch).not.toHaveBeenCalled();
});
it('rejects symlinked explanation directories', async () => {
 const config = await fixture();
 await mkdir(join(config.publicDir, 'docs'), { recursive: true });
 await symlink(config.root, join(config.publicDir, 'docs/explanations'));
 const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
 expect((await request({ OPENAI_API_KEY: 'test' }, 'POST', explanationPayload, 'http://localhost:4316', '/', config)).status).toBe(400);
 expect(fetch).not.toHaveBeenCalled();
});
