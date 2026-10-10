/** Binds each uninitialized documentation board, including repeated page loads. */
customElements.whenDefined("tp-dragdrop").then(() => {
  for (const board of document.querySelectorAll("[data-dragdrop-demo]")) {
    if (board.hasAttribute("data-demo-ready")) continue;
    const controller = board.querySelector("tp-dragdrop");
    const status = board.querySelector("[data-demo-status]");
    const zones = [...board.querySelectorAll("[data-zone]")];
    if (!controller || !status || zones.length !== 2) continue;
    board.setAttribute("data-demo-ready", "");
    let pointerZone = null;
    let dragging = false;

    /** Moves a task without cloning it, keeping its controls and focus intact. */
    function move(source, zone, target = null, position = null) {
      const list = zone?.querySelector("[data-tasks]");
      if (!list || !board.contains(source) || source === target) return;
      if (target && target.closest("[data-zone]") === zone) {
        if (position === "before") target.before(source);
        else target.after(source);
      } else {
        list.append(source);
      }
      source.focus();
      status.textContent = `${source.getAttribute("aria-label")} moved to ${zone.getAttribute("data-zone")}.`;
    }

    controller.addEventListener("tp-dragdrop-start", () => {
      dragging = true;
      pointerZone = null;
    });
    // Empty columns are not draggable items: the example supplies their drop behavior.
    board.addEventListener("dragover", (event) => {
      if (!dragging) return;
      pointerZone = event.target.closest?.("[data-zone]") ?? null;
      if (pointerZone && board.contains(pointerZone)) event.preventDefault();
    });
    board.addEventListener("dragleave", (event) => {
      if (!board.contains(event.relatedTarget)) pointerZone = null;
    });
    controller.addEventListener("tp-dragdrop-drop", (event) => {
      const { source, target, position } = event.detail;
      move(source, target?.closest("[data-zone]") ?? pointerZone, target, position);
      dragging = false;
      pointerZone = null;
    });
    controller.addEventListener("tp-dragdrop-end", () => {
      dragging = false;
      pointerZone = null;
    });
    board.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-move]");
      const source = button?.closest("[data-task]");
      if (!source) return;
      move(source, zones.find(zone => !zone.contains(source)));
    });
  }
});
