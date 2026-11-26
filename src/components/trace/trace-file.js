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
		(data.language !== undefined &&
			!["python", "javascript", "typescript", "scheme", "ocaml"].includes(data.language)) ||
		typeof data.code !== "string" ||
		data.code.length > 20000 ||
        ((data.query !== undefined || data.source !== undefined) &&
         (data.language !== "scheme" || typeof data.query !== "string" || typeof data.source !== "string" ||
          data.code !== data.source.trimEnd() + "\n\n" + data.query)) ||
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
            (step.source_range !== undefined && (!object(step.source_range) ||
             !Number.isInteger(step.source_range.start) || !Number.isInteger(step.source_range.end) ||
             step.source_range.start < 0 || step.source_range.end <= step.source_range.start || step.source_range.end > data.code.length)) ||
            (step.grouped_steps !== undefined && (!Number.isInteger(step.grouped_steps) || step.grouped_steps < 1 || step.grouped_steps > 1001)) ||
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
				(["DICT", "PAIR"].includes(entry[0]) &&
					!entry
						.slice(1)
						.every((pair) => Array.isArray(pair) && pair.length === 2))
			)
				throw new Error(`Invalid heap in snapshot ${index + 1}.`);
			if (["INSTANCE", "INSTANCE_PPRINT", "CLASS"].includes(entry[0])) {
				const offset = entry[0] === "INSTANCE" ? 2 : 3;
				const validAttributes = entry
					.slice(offset)
					.every(
						(pair) =>
							Array.isArray(pair) &&
							pair.length === 2 &&
							typeof pair[0] === "string",
					);
				const validMetadata =
					entry[0] === "CLASS"
						? Array.isArray(entry[2]) &&
							entry[2].every((name) => typeof name === "string")
						: entry[0] !== "INSTANCE_PPRINT" || typeof entry[2] === "string";
				if (typeof entry[1] !== "string" || !validMetadata || !validAttributes)
					throw new Error(
						`Invalid class or instance in snapshot ${index + 1}.`,
					);
			}
		}
	}
	return data;
}
