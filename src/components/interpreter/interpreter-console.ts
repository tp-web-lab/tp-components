/** Console calls from language interop belong to the interpreter transcript. */
export function interpreterConsole(write: (text: string) => void): Console {
	const result = Object.create(console) as Console;
	for (const name of ["log", "info", "warn", "error", "debug"] as const) {
		result[name] = (...values: unknown[]) =>
			write(
				`${values
					.map((value) => {
						if (typeof value === "string") return value;
						if (Object.prototype.toString.call(value) === "[object Error]")
							return String(value);
						try {
							return JSON.stringify(value) ?? String(value);
						} catch {
							return String(value);
						}
					})
					.join(" ")}\n`,
			);
	}
	return result;
}
