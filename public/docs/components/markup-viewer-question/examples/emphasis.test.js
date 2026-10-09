import { describe, expect, it } from "@tp/test";

describe("Semantic HTML", () => {
  it("contains exactly one strong-emphasis element", () => {
    expect(document.querySelectorAll("strong").length).to.equal(1);
  });
  it("keeps Hello as the emphasized text", () => {
    expect(document.querySelector("strong")?.textContent.trim()).to.equal("Hello");
  });
});
