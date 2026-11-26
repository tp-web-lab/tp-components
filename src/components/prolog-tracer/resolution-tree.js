/** Build only explored attempts, never hypothetical clauses or pruned branches. */
export function resolutionTree(recording, position) {
	const nodes = [
			{
				id: 0,
				parent: null,
				goal: recording.query,
				port: "query",
				step: 0,
				attempt: 1,
				backtracked: false,
				line: 0,
			},
		],
		frames = new Map();
	let active = 0;
	for (
		let step = 0;
		step <= position && step < recording.events.length;
		step++
	) {
		const event = recording.events[step],
			port = event.port.split("(")[0];
		if (port === "solution") continue;
		let node = nodes[frames.get(event.frame)];
		if (port === "call" || port === "redo" || !node) {
			const previous = node;
			if (port === "redo" && previous) previous.backtracked = true;
			node = {
				id: nodes.length,
				parent:
					port === "redo" && previous
						? previous.parent
						: (frames.get(event.parent) ?? 0),
				goal: event.goal,
				port,
				step,
				attempt: port === "redo" && previous ? previous.attempt + 1 : 1,
			};
			nodes.push(node);
			frames.set(event.frame, node.id);
		}
		node.goal = event.goal;
		node.port = port;
		node.line = event.line;
		active = node.id;
	}
	return {
		nodes,
		active,
		solutions: recording.events
			.slice(0, position + 1)
			.filter((e) => e.port === "solution")
			.map((e) => e.goal),
	};
}
export function parseResolutionTrace(text) {
	const data = JSON.parse(text);
	if (
		data?.version !== 1 ||
		data.language !== "prolog" ||
		typeof data.code !== "string" ||
		typeof data.query !== "string" ||
		!Array.isArray(data.events) ||
		data.events.length > 5000 ||
		data.events.some(
			(e) =>
				!e ||
				typeof e.goal !== "string" ||
				typeof e.port !== "string" ||
				!Number.isFinite(e.frame) ||
				!Number.isFinite(e.parent) ||
				!Number.isFinite(e.level),
		)
	)
		throw Error("Invalid Prolog resolution trace");
	return data;
}
