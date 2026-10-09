// Keep documentation navigation in the main page, including inside a viewer.
document
	.querySelectorAll('tp-menu a[href^="/#/components/"]')
	.forEach((link) => {
		link.setAttribute("target", "_top");
	});
