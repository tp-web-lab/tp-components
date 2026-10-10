import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/source/source.css?inline
var t = "tp-source{vertical-align:middle;display:inline-flex}tp-source[hidden]{display:none}tp-source>tp-icon-button{--tp-icon-button-size:2rem;--tp-icon-button-icon-size:1.15rem}tp-source>tp-icon-button>button{border:1px solid var(--tp-neutral-stroke-mid,#9ca3af);background:var(--tp-paper-color,#fff)}tp-source>tp-icon-button>button:hover{background:var(--tp-neutral-fill-soft,#e5e7eb)}", n = "tp-source-styles";
function r(e) {
	let t = e.toLowerCase();
	return t.includes("github") ? "github" : t.includes("gitlab") ? "gitlab" : t.includes("bitbucket") ? "bitbucket" : "git";
}
var i = class extends e {
	static get observedAttributes() {
		return ["url"];
	}
	get url() {
		return this.getAttribute("url") ?? "";
	}
	set url(e) {
		if (e.trim() === "") {
			this.removeAttribute("url");
			return;
		}
		this.setAttribute("url", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(n, t), this.render();
	}
	attributeChangedCallback() {
		this.isConnected && this.render();
	}
	render() {
		let e = this.url.trim();
		if (this.toggleAttribute("hidden", e === ""), e === "") {
			this.replaceChildren();
			return;
		}
		let t = r(e), n = `Source: ${e}`, i = this.querySelector(":scope > tp-icon-button");
		i instanceof HTMLElement || (i = document.createElement("tp-icon-button"), i.addEventListener("click", this.handleButtonClick), this.replaceChildren(i)), i.setAttribute("name", t), i.setAttribute("label", n), i.setAttribute("title", n), i.setAttribute("variant", "neutral"), i.setAttribute("size", "m");
	}
	handleButtonClick = () => {
		let e = this.url.trim();
		e !== "" && window.open(e, "_blank", "noopener,noreferrer");
	};
};
customElements.get("tp-source") || customElements.define("tp-source", i);
//#endregion
export { i as t };

//# sourceMappingURL=source.js.map