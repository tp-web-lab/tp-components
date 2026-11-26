import type { PlaygroundTestResult } from "../playground/test-results.js";

/** JSON representation of a query result; BLOB cells use byte arrays. */
export interface SqlTestResultSet {
	columns: string[];
	values: unknown[][];
}
interface SqlStatement {
	getColumnNames(): string[];
	step(): boolean;
	get(): unknown[];
}
interface SqlTestDatabase {
	run(sql: string): void;
	iterateStatements(sql: string): Iterable<SqlStatement>;
	close(): void;
}
export interface SqlTestEngine {
	Database: new (bytes?: Uint8Array) => SqlTestDatabase;
}
export interface SqlTestConfig {
	source: string;
	files: Record<string, string>;
	entry?: string;
	setup?: string;
	storedDatabase?: string;
}
interface SqlTestReporter {
	add(result: PlaygroundTestResult): void;
	finish(): void;
	error(error: unknown): void;
}

/** Exact columns and typed values; unordered rows are multisets, not sets. */
export function compareSqlResults(
	actual: SqlTestResultSet[],
	expected: SqlTestResultSet[],
	ordered: boolean,
): boolean {
	if (actual.length !== expected.length) return false;
	return actual.every((result, index) => {
		const wanted = expected[index];
		if (
			!wanted ||
			JSON.stringify(result.columns) !== JSON.stringify(wanted.columns)
		)
			return false;
		const rows = (values: unknown[][]) => {
			const encoded = values.map((row) => JSON.stringify(row));
			return ordered ? encoded : encoded.sort();
		};
		return (
			JSON.stringify(rows(result.values)) ===
			JSON.stringify(rows(wanted.values))
		);
	});
}

/** Self-contained runner embedded in previews. No writes to persistent databases. */
export function runSqlTests(
	SQL: SqlTestEngine,
	config: SqlTestConfig,
	reporter: SqlTestReporter,
	compare: typeof compareSqlResults,
	log: (text: string) => void,
): void {
	const record = (value: unknown): value is Record<string, unknown> =>
		typeof value === "object" && value !== null && !Array.isArray(value);
	const suite: unknown = JSON.parse(config.source);
	if (!record(suite) || !Array.isArray(suite.tests))
		throw new Error("SQL tests must contain a tests array.");
	if (suite.name !== undefined && typeof suite.name !== "string")
		throw new Error("Suite name must be a string.");
	const suiteName = typeof suite.name === "string" ? suite.name : "SQL queries";
	const file = (path: string) => {
		const normalized = path.startsWith("/") ? path : `/${path}`;
		const source = config.files[normalized];
		if (source === undefined)
			throw new Error(`SQL project file not found: ${path}`);
		return source;
	};
	const setup = config.setup ? file(config.setup) : "";
	const bytes =
		config.storedDatabase === undefined
			? undefined
			: Uint8Array.from(atob(config.storedDatabase), (char) =>
					char.charCodeAt(0),
				);
	const valueValid = (value: unknown): boolean =>
		value === null ||
		typeof value === "string" ||
		(typeof value === "number" && Number.isFinite(value)) ||
		(Array.isArray(value) &&
			value.every(
				(byte) => Number.isInteger(byte) && byte >= 0 && byte <= 255,
			));
	const expectedValid = (value: unknown): value is SqlTestResultSet[] =>
		Array.isArray(value) &&
		value.every((result) => {
			if (!record(result)) return false;
			const { columns, values } = result;
			return (
				Array.isArray(columns) &&
				columns.every((column) => typeof column === "string") &&
				Array.isArray(values) &&
				values.every(
					(row) =>
						Array.isArray(row) &&
						row.length === columns.length &&
						row.every(valueValid),
				)
			);
		});
	for (const [index, test] of suite.tests.entries()) {
		const name =
			record(test) && typeof test.name === "string"
				? test.name
				: `Test ${index + 1}`;
		let db: SqlTestDatabase | undefined;
		const report = (status: PlaygroundTestResult["status"], details = "") => {
			reporter.add({ suite: suiteName, name, status, details });
			log(`${status}: ${name}${details ? `\n${details}` : ""}`);
		};
		try {
			if (!record(test)) throw new Error("Each SQL test must be an object.");
			const unknown = Object.keys(test).filter(
				(key) =>
					![
						"name",
						"query",
						"src",
						"expected",
						"error",
						"ordered",
						"skip",
					].includes(key),
			);
			if (unknown.length)
				throw new Error(`Unknown test fields: ${unknown.join(", ")}`);
			if (test.name !== undefined && typeof test.name !== "string")
				throw new Error("Test name must be a string.");
			if (
				test.skip !== undefined &&
				typeof test.skip !== "boolean" &&
				typeof test.skip !== "string"
			)
				throw new Error("skip must be a boolean or reason string.");
			if (test.skip) {
				report(
					"skipped",
					typeof test.skip === "string" ? test.skip : "Skipped",
				);
				continue;
			}
			if (test.ordered !== undefined && typeof test.ordered !== "boolean")
				throw new Error("ordered must be a boolean.");
			if (test.query !== undefined && test.src !== undefined)
				throw new Error("Choose query or src, not both.");
			if (test.query !== undefined && typeof test.query !== "string")
				throw new Error("query must be a string.");
			if (test.src !== undefined && typeof test.src !== "string")
				throw new Error("src must be a project file path.");
			const expectsError = test.error !== undefined;
			if (
				expectsError
					? typeof test.error !== "string" ||
						!test.error.length ||
						test.expected !== undefined
					: !expectedValid(test.expected)
			)
				throw new Error(
					"Provide expected result sets or a nonempty error substring.",
				);
			const query =
				typeof test.query === "string"
					? test.query
					: file(
							typeof test.src === "string"
								? test.src
								: (config.entry ?? "/query.sql"),
						);
			db = new SQL.Database(bytes);
			// Setup errors are configuration failures, never expected query errors.
			if (setup.trim()) {
				try {
					db.run(setup);
				} catch (error) {
					throw new Error(`Database setup failed: ${String(error)}`);
				}
			}
			const actual: SqlTestResultSet[] = [];
			let queryError: string | undefined;
			try {
				for (const statement of db.iterateStatements(query)) {
					const columns = statement.getColumnNames();
					const values: unknown[][] = [];
					while (statement.step())
						values.push(
							statement
								.get()
								.map((value) =>
									value instanceof Uint8Array
										? Array.from(value)
										: typeof value === "number" && !Number.isFinite(value)
											? { nonFinite: String(value) }
											: value,
								),
						);
					if (columns.length) actual.push({ columns, values });
				}
			} catch (error) {
				queryError = error instanceof Error ? error.message : String(error);
			}
			if (expectsError) {
				const ok = queryError?.includes(test.error as string);
				report(
					ok ? "passed" : "failed",
					ok
						? `Expected SQL error: ${queryError}`
						: "Expected error: " +
								test.error +
								"\nActual: " +
								(queryError ?? "Query succeeded"),
				);
			} else if (queryError !== undefined)
				report("failed", `Unexpected SQL error: ${queryError}`);
			else {
				const ok = compare(
					actual,
					test.expected as SqlTestResultSet[],
					test.ordered !== false,
				);
				report(
					ok ? "passed" : "failed",
					ok
						? ""
						: "Expected: " +
								JSON.stringify(test.expected, null, 2) +
								"\nActual: " +
								JSON.stringify(actual, null, 2),
				);
			}
		} catch (error) {
			report("failed", String(error));
		} finally {
			db?.close();
		}
	}
	reporter.finish();
}
