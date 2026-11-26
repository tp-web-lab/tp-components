function fact(n: number): number {
	if (n === 0) return 1;
	return n * fact(n - 1);
}

const _warmup: number = fact(2);
