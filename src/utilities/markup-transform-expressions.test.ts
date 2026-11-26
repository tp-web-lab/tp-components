import { imageOptionStyles, validImageTransform } from "@tp/tp-utilities";
import { expect, it } from "vitest";

it("accepts balanced 3D transforms and CSS expressions without evaluating variables", () => {
	for (const transform of [
		"translateZ(2rem) rotateY(0.5turn)",
		"perspective(800px) rotate3d(1,0,0,45deg)",
		"translateX(calc(100% - var(--gap, 10px)))",
		"scale(clamp(0.5, var(--zoom, 1), 2))",
		"translate3d(min(10px, 2vw), max(0px, 2vh), 3px)",
	]) {
		expect(validImageTransform(transform), transform).toBe(true);
		expect(imageOptionStyles({ "image-transform": transform })).toBe(
			`transform:${transform}`,
		);
	}
});
it("rejects malformed transforms and declaration injection", () => {
	for (const transform of [
		"translate3d(1px,2px)",
		"matrix3d(1,2)",
		"rotateX(20px)",
		"rotateX(calc(1deg)",
		"translateX(var(color))",
		"translateX(url(example))",
		"rotateX(20deg); color:red",
	])
		expect(validImageTransform(transform), transform).toBe(false);
});
