const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');

function replayShadow() {
  const shadow = document.querySelector(".portrait-shadow");
  if (!shadow) return;
  shadow.style.animation = "none";
  void shadow.offsetWidth;
  shadow.style.animation = "";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const isDark = theme === "dark";
  toggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
  themeColor?.setAttribute("content", isDark ? "#121110" : "#F4F1EB");
}

applyTheme(root.getAttribute("data-theme") || "light");

toggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  replayShadow();
});

document.querySelector(".scroll-down").addEventListener("click", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollBy({
    top: window.innerHeight,
    behavior: reduce ? "auto" : "smooth",
  });
});

const cursor = document.querySelector(".cursor");
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (cursor && finePointer) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const trail = cursor.querySelector(".cursor-trail");
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  let frame = 0;

  root.classList.add("has-cursor");

  const place = () => {
    cursor.style.opacity = "1";
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    if (reduceMotion) {
      trail.style.transform = "none";
      frame = 0;
      return;
    }
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    trail.style.transform = `translate(${ringX - mouseX}px, ${ringY - mouseY}px)`;
    const settled =
      Math.abs(mouseX - ringX) < 0.4 && Math.abs(mouseY - ringY) < 0.4;
    frame = settled ? 0 : requestAnimationFrame(place);
  };

  const queue = () => {
    if (!frame) frame = requestAnimationFrame(place);
  };

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    const target = event.target;
    const element = target instanceof Element ? target : null;
    const overButton = Boolean(element?.closest("button, .cta, .links a"));
    const overLink = Boolean(element?.closest("a, button"));
    root.classList.toggle("cursor-button", overButton);
    root.classList.toggle("cursor-hot", overLink && !overButton);
    queue();
  });

  window.addEventListener("pointerout", (event) => {
    if (event.relatedTarget) return;
    cursor.style.opacity = "0";
  });
}
