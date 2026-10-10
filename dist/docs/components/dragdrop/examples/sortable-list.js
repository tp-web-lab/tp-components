/** Adds application-level reordering to the controller's drag-and-drop events. */
customElements.whenDefined("tp-dragdrop").then(() => {
  for (const root of document.querySelectorAll("[data-sortable-demo]")) {
    if (root.hasAttribute("data-sortable-ready")) continue;
    const list = root.querySelector("ol");
    const controller = root.querySelector("tp-dragdrop");
    const status = root.querySelector("[data-sort-status]");
    if (!list || !controller || !status) continue;
    root.setAttribute("data-sortable-ready", "");
    const initialOrder = [...list.children];
    let highlighted = null;
    let restoreStyle = null;
    let highlightedSide = null;

    /** Restores the item's original styling when the drag finishes or is cancelled. */
    function clearInsertion() {
      if (!highlighted) return;
      const box = highlighted.querySelector("tp-box");
      if (restoreStyle === null) box.removeAttribute("style");
      else box.setAttribute("style", restoreStyle);
      highlighted.removeAttribute("data-sort-insert-after");
      highlighted.removeAttribute("data-sort-insert-before");
      highlighted = null;
      highlightedSide = null;
    }

    /** Uses the same before/after decision for the preview and the actual move. */
    function insertion(source, target, position) {
      if (source === target || source?.parentElement !== list || target?.parentElement !== list) return null;
      const entries = [...list.children];
      const before = position === "before" || (position === "inside" && entries.indexOf(source) > entries.indexOf(target));
      let predecessor = before ? target.previousElementSibling : target;
      if (predecessor === source) predecessor = source.previousElementSibling;
      return { before, predecessor };
    }

    /** Keeps the insertion predecessor highlighted until another position is chosen. */
    function showInsertion(source, target, position) {
      const destination = insertion(source, target, position);
      if (!destination) return;
      const item = destination.predecessor ?? target;
      const side = destination.predecessor ? "after" : "before";
      if (highlighted === item && highlightedSide === side) return;
      clearInsertion();
      highlighted = item;
      highlightedSide = side;
      const box = item.querySelector("tp-box");
      restoreStyle = box.getAttribute("style");
      item.setAttribute(`data-sort-insert-${side}`, "");
      box.style.outline = "2px solid var(--tp-brand-500)";
      box.style.outlineOffset = "-2px";
      // An inset line marks the exact edge without moving the drop targets.
      box.style.boxShadow = `inset 0 ${side === "after" ? "-4px" : "4px"} 0 var(--tp-brand-500)`;
      status.textContent = destination.predecessor
        ? `Insert ${source.getAttribute("aria-label")} after ${item.getAttribute("aria-label")}.`
        : `Insert ${source.getAttribute("aria-label")} at the beginning of the list.`;
    }

    /** Disables controls that would move an entry beyond a list boundary. */
    function updateButtons() {
      for (const item of list.children) {
        item.querySelector('[data-direction="up"]').toggleAttribute("disabled", item === list.firstElementChild);
        item.querySelector('[data-direction="down"]').toggleAttribute("disabled", item === list.lastElementChild);
      }
    }

    /** Moves existing list entries without nesting or cloning their content. */
    function move(source, target, position) {
      const destination = insertion(source, target, position);
      clearInsertion();
      if (!destination) return;
      if (destination.before) target.before(source);
      else target.after(source);
      updateButtons();
      source.focus();
      status.textContent = `${source.getAttribute("aria-label")} is now item ${[...list.children].indexOf(source) + 1} of ${list.children.length}.`;
    }

    controller.addEventListener("tp-dragdrop-start", clearInsertion);
    controller.addEventListener("tp-dragdrop-over", (event) => {
      const { source, target, position } = event.detail;
      showInsertion(source, target, position);
    });
    controller.addEventListener("tp-dragdrop-end", clearInsertion);
    controller.addEventListener("tp-dragdrop-drop", (event) => {
      const { source, target, position } = event.detail;
      move(source, target, position);
    });
    root.addEventListener("click", (event) => {
      const reset = event.target.closest?.("[data-reset]");
      if (reset) {
        clearInsertion();
        list.append(...initialOrder);
        updateButtons();
        status.textContent = "The original order has been restored.";
        return;
      }
      const button = event.target.closest?.("[data-direction]");
      if (!button || button.hasAttribute("disabled")) return;
      const source = button.closest("li");
      const up = button.getAttribute("data-direction") === "up";
      move(source, up ? source.previousElementSibling : source.nextElementSibling, up ? "before" : "after");
    });
    updateButtons();
  }
});
