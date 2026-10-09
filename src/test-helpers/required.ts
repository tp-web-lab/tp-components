/** Fails at the missing fixture instead of relying on an unchecked assertion. */
export function required<T>(value: T | null | undefined): T {
	if (value === null || value === undefined)
		throw new Error("Expected test fixture value");
	return value;
}
