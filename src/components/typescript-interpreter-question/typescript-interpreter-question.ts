/** @module components/typescript-interpreter-question */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-console
 * @summary Displays structured console output.
 */
/**
 * @tp-dependency tp-iframe
 * @summary Controlled iframe component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
/**
 * @tp-dependency tp-typescript
 * @summary Provides an interactive TypeScript interpreter.
 */
/**
 * @tp-dependency tp-typescript-playground
 * @summary TypeScript playground component.
 */
// tp-docgen:dependencies:end

import { TpInterpreterQuestion } from "../interpreter-question/interpreter-question.js";
import { TpTypescript } from "../typescript/typescript.js";
import { TpTypescriptPlayground } from "../typescript-playground/typescript-playground.js";
/**
 * The custom `<tp-typescript-interpreter-question>` element presents and grades TypeScript exercises in an interactive interpreter.
 *
 * @summary Presents and grades TypeScript exercises in an interactive interpreter.
 * @tagname tp-typescript-interpreter-question
 * @attr {string} query = "" - Initial query for exploring the program; required to run the interpreter.
 * @attr {string} value = "" - Initial program when src is absent.
 * @keyboard {Enter / Shift+Enter} Reloads changed source and executes the query from its input.
 * @example
 * <tp-typescript-interpreter-question query="double(3)" open="" src="/docs/components/typescript-interpreter-question/examples/double.ts">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.</dd>
 *     <dt>Feedback</dt><dd>/docs/components/typescript-interpreter-question/examples/double.test.ts</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-typescript-interpreter-question>
 */
export class TpTypescriptInterpreterQuestion extends TpInterpreterQuestion<TpTypescript> {
	protected readonly language = "typescript";
	protected override createInterpreter(): TpTypescript {
		return new TpTypescript();
	}
	protected override createTestRunner(): TpTypescriptPlayground {
		return new TpTypescriptPlayground();
	}
}
if (!customElements.get("tp-typescript-interpreter-question"))
	customElements.define(
		"tp-typescript-interpreter-question",
		TpTypescriptInterpreterQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-typescript-interpreter-question": TpTypescriptInterpreterQuestion;
	}
}
