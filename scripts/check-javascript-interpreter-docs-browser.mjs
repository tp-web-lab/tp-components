import {expect, chromium} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {viewerSource} from './component-basic-examples.mjs';
const component=process.env.INTERPRETER??'javascript';
const displayName=component==='python'?'Python':component==='typescript'?'TypeScript':'JavaScript';
const python=component==='python';
const base=process.env.TP_EXAMPLES_URL??'http://127.0.0.1:4174';
const browser=await chromium.launch();
try { const page=await browser.newPage();
	await page.route("**/__javascript-test", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: "<!doctype html><body></body>",
		}),
	);
	for (const [language, extension] of [["html", "html"], ["asciidoc", "adoc"], ["latex", "tex"], ["markdown", "md"], ["restructuredtext", "rst"]]) {
		console.log("Checking real viewer", language);
		await page.goto(base + "/__javascript-test");
		const fixture = await readFile(new URL(`../public/docs/components/${component}/examples/examples.${extension}`, import.meta.url), "utf8");
		const source = extension === "tex" ? fixture : viewerSource(extension, fixture);
		await page.evaluate(async ({language,source}) => {
			await import(`/src/components/${language}-viewer/${language}-viewer.js`);
			const viewer = document.createElement(`tp-${language}-viewer`);
			viewer.setAttribute("allow-script", "");
			if (language === "html") {
				viewer.setAttribute("preserve-source", "");
				const template = document.createElement("template");
				template.innerHTML = source;
				viewer.append(template);
			} else {
				const script = document.createElement("script");
				script.type = `tp/${language}`;
				script.textContent = source;
				viewer.append(script);
			}
			document.body.replaceChildren(viewer);
		}, {language,source});

 const viewer=page.locator(`tp-${language}-viewer`).first();
 const chooser=viewer.locator('select[aria-label="Example"]').first();
 const host=viewer.frameLocator('iframe').first().locator(`tp-${component}`);
 for(const [label,query,result] of [['Basic usage','square(7)','49'],['Javascript API','square(7)','49'],['Persistent session',python?'next(counter)':'++count','1'],[python?'Async functions and output':'Promises and console','await answer()','42'],[`External ${displayName} file`,'square(9)','81']]) {
  await chooser.selectOption({label},{timeout:60000});
  await expect(host.locator('tp-textfield input')).toHaveValue(query,{timeout:60000});
  await expect(host).toHaveAttribute('aria-busy','false',{timeout:120000});
 await host.locator('[data-command="run"]').click();
  await expect(host.locator('[role=log]')).toContainText(result,{timeout:60000});
 }
 await chooser.selectOption({label:'DOM elements and click events'});
 await expect(host.locator('tp-textfield input')).toHaveValue(python?'setup_dom()':'setupDom()', {timeout:60000});
 await expect(host).toHaveAttribute('aria-busy','false',{timeout:120000});
 await host.locator('[data-command="run"]').click();
 const frame=viewer.frameLocator('iframe').first();
 await expect(host.locator('[role=log]')).toContainText('Button ready');
 await frame.locator(`#${component}-dom-demo tp-button button`).click();
 await expect(frame.locator(`#${component}-dom-demo p`)).toHaveText(`${displayName} handled 1 click(s).`);
 await expect(host.locator('[role=log]')).toContainText('Clicks: 1');
 await expect(host).toHaveAttribute('aria-busy','false',{timeout:120000});
 await host.locator('[data-command="run"]').click();
 await expect(frame.locator(`#${component}-dom-demo p`)).toHaveText('Waiting for a click.');
 await chooser.selectOption({label:'Errors and recovery'});
 const input=host.locator('tp-textfield input');
 await expect(input).toHaveValue('divide(12, 0)', {timeout:60000});
 await expect(host).toHaveAttribute('aria-busy','false',{timeout:120000});
 await host.locator('[data-command="run"]').click();
 await expect(host.locator('[role=log]')).toContainText(python?/ZeroDivisionError/:/ERROR:.*The denominator must not be zero\./);
 await input.fill('divide(12, 3)');
 await expect(host).toHaveAttribute('aria-busy','false',{timeout:120000});
 await host.locator('[data-command="run"]').click();
 await expect(host.locator('[role=log]')).toContainText(python?'> divide(12, 3)\n4.0':'> divide(12, 3)\n4');
 console.log(language+': all seven documented examples execute correctly, including DOM events and error recovery');
 }
} finally {await browser.close();}
