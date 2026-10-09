# Playgrounds

::: tp-callout { variant="info" style="margin-bottom: 2em" }
Playground components combine project files, source editing, execution and preview tools into interactive workspaces for experimenting with code and markup.
:::

:::::: tp-grid { min-width="10rem" gap="1.5rem" }

::: tp-center { intrinsic }
:tp-icon:{name="asciidoc-playground" library="components" size="4em" aria-hidden="true"}

[tp-asciidoc-playground](asciidoc-playground/index.md)
:::

::: tp-center { intrinsic }
:tp-icon:{name="html-playground" library="components" size="4em" aria-hidden="true"}

[tp-html-playground](html-playground/index.md)
:::

::: tp-center { intrinsic }
:tp-icon:{name="javascript-playground" library="components" size="4em" aria-hidden="true"}

[tp-javascript-playground](javascript-playground/index.md)
:::

::: tp-center { intrinsic }
:tp-icon:{name="markdown-playground" library="components" size="4em" aria-hidden="true"}

[tp-markdown-playground](markdown-playground/index.md)
:::

::: tp-center { intrinsic }
:tp-icon:{name="prolog-playground" library="components" size="4em" aria-hidden="true"}

[tp-prolog-playground](prolog-playground/index.md)
:::

::: tp-center { intrinsic }
:tp-icon:{name="python-playground" library="components" size="4em" aria-hidden="true"}

[tp-python-playground](python-playground/index.md)
:::

::: tp-center { intrinsic }
:tp-icon:{name="restructuredtext-playground" library="components" size="4em" aria-hidden="true"}

[tp-restructuredtext-playground](restructuredtext-playground/index.md)
:::

::: tp-center { intrinsic }
:tp-icon:{name="sql-playground" library="components" size="4em" aria-hidden="true"}

[tp-sql-playground](sql-playground/index.md)
:::

::: tp-center { intrinsic }
:tp-icon:{name="typescript-playground" library="components" size="4em" aria-hidden="true"}

[tp-typescript-playground](typescript-playground/index.md)
:::

::::::

<!-- family-introduction:end -->

## Further reading

<tp-toc position="end" open expand-all></tp-toc>

Playgrounds are interactive workspaces for editing a small project and running it in an isolated preview.
They all share the same structure: a file tree, file tabs, a code editor, a preview iframe and a console.

The available playgrounds are:

| Playground | Main file type | Default entry file |
| --- | --- | --- |
| [`<tp-asciidoc-playground>`](asciidoc-playground/index.md) | AsciiDoc | `/index.adoc` |
| [`<tp-html-playground>`](html-playground/index.md) | HTML, CSS, JavaScript | `/tp-components/index.html` |
| [`<tp-javascript-playground>`](javascript-playground/index.md) | JavaScript modules | `/main.js` |
| [`<tp-markdown-playground>`](markdown-playground/index.md) | Markdown | `/index.md` |
| [`<tp-prolog-playground>`](prolog-playground/index.md) | Prolog | `/program.pl` |
| [`<tp-python-playground>`](python-playground/index.md) | Python | `/main.py` |
| [`<tp-restructuredtext-playground>`](restructuredtext-playground/index.md) | reStructuredText | `/index.rst` |
| [`<tp-sql-playground>`](sql-playground/index.md) | SQL | `/main.sql` |
| [`<tp-typescript-playground>`](typescript-playground/index.md) | TypeScript modules | `/main.ts` |
[Playground components]

## Project files

A playground project is an in-memory file system.
Every file has an absolute project path, beginning with `/`.
The same JSON structure can be loaded with the `src` attribute or embedded in a direct `<script type="tp/json">` child.

``` json
{
  "name": "HTML with tests",
  "entry": "/tp-components/index.html",
  "test": "/main.test.js",
  "files": [
    {
      "path": "/tp-components/index.html",
      "language": "html",
      "content": "<h1 id=\"title\">Hello HTML</h1>"
    },
    {
      "path": "/main.js",
      "language": "javascript",
      "content": "console.log('Hello');"
    },
    {
      "path": "/main.test.js",
      "language": "javascript",
      "content": "import { describe, expect, it } from '@tp/test';"
    }
  ]
}
```

The `entry` property tells the playground which file to run by default.
The `test` property tells it which file to run when the test button is used.

If `test` is not provided, the playground looks for a test file with a conventional name such as:

| Playground | Default test file | Also detected |
| --- | --- | --- |
| HTML | `/main.test.js` | `*.test.js`, `*.tests.js`, `*.spec.js` |
| JavaScript | `/main.test.js` | `*.test.js`, `*.tests.js`, `*.spec.js` |
| TypeScript | `/main.test.ts` | `*.test.ts`, `*.tests.ts`, `*.spec.ts`, `*.test.tsx`, `*.tests.tsx`, `*.spec.tsx`, JavaScript test files |
| Python | `/main.test.py` | `*.test.py`, `*.tests.py`, `*.spec.py` |
[Test file conventions]

When no test file is present, the test button is disabled and uses the `test-tube-off` icon.

## Passing content

### Default content

Without external content, each playground creates a small default project.
The content of the custom element itself is not interpreted as project source.

``` html
<tp-python-playground></tp-python-playground>
```

### Loading a project from JSON

All playgrounds can load a complete project JSON file with the `src` attribute.
The JSON is validated before it is loaded.

``` html
<tp-html-playground src="/tp-components/examples/playgrounds/html-playground/09-html-tests/project.full.json"></tp-html-playground>
```

The JSON file contains the metadata and the source files:

``` json
{
  "name": "HTML with tests",
  "entry": "/tp-components/index.html",
  "test": "/main.test.js",
  "files": [
    {
      "path": "/tp-components/index.html",
      "language": "html",
      "content": "<h1>Hello HTML</h1>"
    },
    {
      "path": "/main.test.js",
      "language": "javascript",
      "content": "import { describe, expect, it } from '@tp/test';"
    }
  ]
}
```

### Passing inline JSON

A project can also be passed as a direct child script.

``` html
<tp-python-playground>
  <script type="tp/json">
    {
      "name": "Inline Python",
      "entry": "/main.py",
      "files": [
        {
          "path": "/main.py",
          "content": "print('Hello Python')"
        }
      ]
    }
  </script>
</tp-python-playground>
```

If a file language is not specified, it is inferred from the file extension.

### Passing a project with JavaScript

A project can be provided programmatically with `setProject()`.
This is the most direct way to pass content when the project is already available in JavaScript.

``` html
<tp-javascript-playground id="demo"></tp-javascript-playground>

<script type="module">
  import '/tp-components/components/javascript-playground/javascript-playground.js';
  import { TpJavascriptProject } from '/tp-components/components/javascript-playground/javascript-project.js';

  const playground = document.querySelector('#demo');

  playground.setProject(
    new TpJavascriptProject({
      name: 'DOM demo',
      entry: '/main.js',
      test: '/main.test.js',
      files: [
        {
          path: '/tp-components/index.html',
          language: 'html',
          content: '<button id="button">Click</button>',
        },
        {
          path: '/main.js',
          language: 'javascript',
          content: 'document.querySelector("#button")?.click();',
        },
        {
          path: '/main.test.js',
          language: 'javascript',
          content: 'import { describe, it, expect } from "@tp/test";',
        },
      ],
    }),
  );
</script>
```

The same pattern applies to the other project classes: `TpHtmlProject`, `TpPrologProject`, `TpPythonProject`, `TpTypescriptProject`, `TpMarkdownProject`, and the base `TpProject`.

### Loading a project repository

All playgrounds can load a project directory with the `repository` attribute.

``` html
<tp-html-playground repository="/tp-components/examples/playgrounds/html-playground/09-html-tests"></tp-html-playground>
```

The directory contains a `project.json` metadata file, a `.files.json` manifest and the source files:

``` json
{
  "id": "09-html-tests",
  "label": "HTML with tests",
  "name": "HTML with tests",
  "entry": "/tp-components/index.html",
  "test": "/main.test.js"
}
```

``` text
09-html-tests/
  project.json
  .files.json
  index.html
  main.js
  main.test.js
```

The source files are loaded from the same directory and keep their project paths.

### Loading examples from the toolbar

The `Examples` menu uses the catalog under `/tp-components/examples/playgrounds`.
Each playground group has an `index.json` file listing the available examples:

``` json
{
  "examples": [
    "01-html-basic",
    "09-html-tests"
  ]
}
```

Each example directory contains:

| File | Purpose |
| --- | --- |
| `project.json` | Metadata: `id`, `label`, `name`, `entry`, `test`, and optional playground-specific settings. |
| Source files | Files loaded into the in-memory project. |
| `.files.json` | Generated file list used by the examples loader. |
[Example directory files]

## Entry files

The entry file is the file executed by the run button.
If `entry` is missing, the playground falls back to its default entry convention or to the first compatible file.

Examples:

``` json
{
  "entry": "/tp-components/index.html"
}
```

``` json
{
  "entry": "/main.py"
}
```

``` json
{
  "entry": "/main.ts"
}
```

Relative imports inside source files are resolved from the importing file.

``` js
import { add } from './math.js';
```

``` py
from pkg.helper import format_message
```

## Test files

### JavaScript and TypeScript tests

JavaScript and TypeScript tests run with the browser test API exposed as `@tp/test`.

``` js
import { describe, expect, it } from '@tp/test';
import { add } from './main.js';

describe('add()', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).to.equal(5);
  });
});
```

TypeScript tests use the same API.

``` ts
import { describe, expect, it } from '@tp/test';
import { multiply } from './main.js';

describe('multiply()', () => {
  it('multiplies numbers', () => {
    expect(multiply(2, 3)).to.equal(6);
  });
});
```

### Python tests

Python tests use `unittest`.

``` py
import unittest

from main import add


class MathTests(unittest.TestCase):
    def test_adds_numbers(self):
        self.assertEqual(add(2, 3), 5)
```

The Python playground runs in Pyodide.
Pyodide is loaded once and then reused by subsequent runs.
Before each run, the `/project` directory is rewritten from the current file tree.

### DOM-based examples

HTML, JavaScript, TypeScript and Python projects can use an `index.html` file to prepare the preview DOM.

``` html
<h1 id="title">Python DOM</h1>
<button id="btn">Click me</button>
<div id="output"></div>
```

Python can access the preview document through `from js import document`.

``` py
from js import document
from pyodide.ffi import create_proxy

title = document.getElementById("title")
button = document.getElementById("btn")
output = document.getElementById("output")


def on_click(event):
    title.textContent = "Clicked from Python!"
    output.textContent = "Button clicked"


button.addEventListener("click", create_proxy(on_click))
```

## Optional project settings

Some playgrounds support additional settings in `project.json`.

### Import maps

HTML, JavaScript and TypeScript projects can define an import map.

``` json
{
  "entry": "/main.ts",
  "importmap": {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3/+esm",
      "lit/": "https://cdn.jsdelivr.net/npm/lit@3/"
    }
  }
}
```

### Python libraries

Python projects can preload Pyodide packages with `libs`.

``` json
{
  "entry": "/main.py",
  "libs": ["numpy"]
}
```

### Markdown and reStructuredText extensions

Markup playgrounds can declare extensions.

``` json
{
  "entry": "/index.md",
  "extensions": [
    {
      "id": "web-component",
      "label": "Web component",
      "url": "/tp-components/extensions/markdown/web-component/index.js",
      "enabled": true
    }
  ]
}
```

## Common workflow

1. Choose or create a project from the `Project` menu.
2. Open files from the file tree or the tabs.
3. Edit the active file in the code editor.
4. Run the project with the `play` button.
5. Run tests with the `test-tube` button when a test file exists.
6. Read runtime logs and errors in the console.

The `refresh` button restores the initial project loaded in the playground.
