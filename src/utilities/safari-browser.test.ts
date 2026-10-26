import { expect, it } from "vitest";
import { isSafariBrowser } from "./safari-browser.js";

it.each([
	"Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
	"Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
])("recognizes Safari: %s", (ua) => expect(isSafariBrowser(ua)).toBe(true));
it.each([
	"Mozilla/5.0 AppleWebKit/537.36 Chrome/130.0 Safari/537.36",
	"Mozilla/5.0 AppleWebKit/605.1.15 CriOS/130.0 Mobile/15E148 Safari/604.1",
	"Mozilla/5.0 AppleWebKit/605.1.15 Version/18.0 FxiOS/130.0 Safari/604.1",
	"Mozilla/5.0 AppleWebKit/537.36 Version/4.0 Chrome/130.0 Edg/130.0 Safari/537.36",
	"Mozilla/5.0 Firefox/130.0",
	"",
])("does not enable Safari-only features for %s", (ua) =>
	expect(isSafariBrowser(ua)).toBe(false),
);
