import { describe, expect, it } from 'vitest';
import { TpProject } from '../playground/project.js';
import { buildPythonExecutionDocument } from './python-execution-document.js';

describe('buildPythonExecutionDocument', () => {
  it('reloads Matplotlib modules for each preview document', async () => {
    const document = await buildPythonExecutionDocument(new TpProject({
      files: [{ path: '/main.py', content: 'from matplotlib import pyplot as plt\nplt.show()' }],
    }), { scope: 'notebook-1' });

    expect(document.html).toContain('module_name == \\"matplotlib\\"');
    expect(document.html).toContain('module_name.startswith(\\"matplotlib.\\")');
    expect(document.html).toContain('sys.modules.pop(module_name, None)');
    expect(document.html).toContain('window.tpRunWithPyodide');
    expect(document.html).toContain('already loaded from|No new packages to load');
    expect(document.html).toContain("console.info('Loading Pyodide...')");
    expect(document.html).not.toContain("console.info('Loading Python libraries:'");
    expect(document.html).toContain('matplotlib.use(\\"svg\\", force=True)');
    expect(document.html).toContain('plt.show = tp_show_matplotlib');
    expect(document.html).toContain('tp_window.document.body.appendChild(container)');
    expect(document.html).not.toContain('querySelector(\\"[data-tp-python-plots]\\")');
    expect(document.html).toContain('tp_execution_namespaces.setdefault');
    expect(document.html).toContain(`pyodide.globals.set('tp_execution_scope', "notebook-1")`);
    expect(document.html).not.toContain('runpy.run_path');
  });
});
