/** Validate complete recordings before replacing the displayed trace. */
export function parseTrace(source) {
	if (source.length > 10000000) throw new Error("File limit: 10 MB.");
	const data = JSON.parse(source);
	const object = (value) =>
		value !== null && typeof value === "object" && !Array.isArray(value);
	const names = (value) =>
		value === undefined ||
		(Array.isArray(value) && value.every((name) => typeof name === "string"));
	const optionalObject = (value) => value === undefined || object(value);
	const optionalText = (value) =>
		value === undefined || typeof value === "string";
	if (
		!object(data) ||
		(data.version !== undefined && data.version !== 1) ||
		typeof data.code !== "string" ||
		data.code.length > 20000 ||
		!Array.isArray(data.trace) ||
		!data.trace.length ||
		data.trace.length > 1001
	)
		throw new Error(
			"Expected a complete trace: version 1 (optional), code and 1–1,001 snapshots.",
		);
	for (const [index, step] of data.trace.entries()) {
		if (
			!object(step) ||
			typeof step.event !== "string" ||
			!optionalObject(step.globals) ||
			!optionalObject(step.heap) ||
			!names(step.ordered_globals) ||
			!optionalText(step.stdout) ||
			!optionalText(step.func_name) ||
			!optionalText(step.exception_msg) ||
			(step.line != null && (!Number.isInteger(step.line) || step.line < 0))
		)
			throw new Error(`Invalid snapshot ${index + 1}.`);
		if (
			step.stack_to_render !== undefined &&
			(!Array.isArray(step.stack_to_render) ||
				!step.stack_to_render.every(
					(frame) =>
						object(frame) &&
						optionalObject(frame.encoded_locals) &&
						names(frame.ordered_varnames),
				))
		)
			throw new Error(`Invalid call stack in snapshot ${index + 1}.`);
		for (const entry of Object.values(step.heap ?? {})) {
			if (
				!Array.isArray(entry) ||
				typeof entry[0] !== "string" ||
				(entry[0] === "DICT" &&
					!entry
						.slice(1)
						.every((pair) => Array.isArray(pair) && pair.length === 2))
			)
				throw new Error(`Invalid heap in snapshot ${index + 1}.`);
		}
	}
	return data;
}
