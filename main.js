// ---------- Settings ----------
const SINGLE_OPEN_DESKTOP = true;

// ---------- Dropdowns (desktop + mobile) ----------
const toggles = document.querySelectorAll("[data-toggle]");

function setDropdown(button, open) {
  const panel = document.getElementById(button.getAttribute("aria-controls"));
  const arrow = button.querySelector("[data-arrow]");
  button.setAttribute("aria-expanded", String(open));
  panel.classList.toggle("hidden", !open);
  arrow.classList.toggle("rotate-180", open);
}

function closeDesktopDropdowns(except = null) {
  document.querySelectorAll("[data-dropdown] [data-toggle]").forEach((btn) => {
    if (btn !== except) setDropdown(btn, false);
  });
}

toggles.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = button.getAttribute("aria-expanded") !== "true";
    const isDesktop = button.closest("[data-dropdown]") !== null;

    if (isDesktop && SINGLE_OPEN_DESKTOP && willOpen) {
      closeDesktopDropdowns(button);
    }
    setDropdown(button, willOpen);
  });
});

// Click outside closes desktop dropdowns
document.addEventListener("click", (event) => {
  if (!event.target.closest("[data-dropdown]")) closeDesktopDropdowns();
});

// ---------- Mobile menu ----------
const menu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");
const openBtn = document.getElementById("menu-open");
const closeBtn = document.getElementById("menu-close");

function setMenu(open) {
  menu.classList.toggle("translate-x-full", !open);
  menu.classList.toggle("invisible", !open);
  overlay.classList.toggle("invisible", !open);
  overlay.classList.toggle("opacity-0", !open);
  document.body.classList.toggle("overflow-hidden", open);
  openBtn.setAttribute("aria-expanded", String(open));

  if (open) {
    closeBtn.focus();
  } else if (menu.contains(document.activeElement)) {
    openBtn.focus();
  }
}

openBtn.addEventListener("click", () => setMenu(true));
closeBtn.addEventListener("click", () => setMenu(false));
overlay.addEventListener("click", () => setMenu(false));

// ---------- Escape key ----------
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  setMenu(false);

  const openDesktop = document.querySelector(
    '[data-dropdown] [data-toggle][aria-expanded="true"]',
  );
  if (openDesktop) {
    closeDesktopDropdowns();
    openDesktop.focus();
  }
});

// ---------- Reset when resizing up to desktop ----------
window.matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});
