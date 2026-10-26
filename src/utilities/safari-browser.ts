/** Temporary product restriction for simultaneous recording and recognition, not API detection. */
export function isSafariBrowser(userAgent = navigator.userAgent): boolean {
	return (
		/AppleWebKit\//i.test(userAgent) &&
		/Version\/[\d.]+.*Safari\//i.test(userAgent) &&
		!/Android/i.test(userAgent) &&
		!/(Chrome|Chromium|CriOS|Firefox|FxiOS|Edg|OPR|OPiOS|Opera|SamsungBrowser|Electron|DuckDuckGo)\//i.test(
			userAgent,
		)
	);
}
