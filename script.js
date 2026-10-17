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

const sky = document.querySelector(".shooting-stars");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function launchStar() {
  const star = document.createElement("span");
  star.className = "shooting-star";
  const leftward = Math.random() > 0.5;
  const startY = Math.random() * window.innerHeight * 0.7;
  const drop = 70 + Math.random() * 180;
  const startX = leftward ? window.innerWidth + 40 : -170;
  const endX = leftward ? -190 : window.innerWidth + 40;
  const endY = startY + drop;
  const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;
  const from = `translate(${startX}px, ${startY}px) rotate(${angle}deg)`;
  const to = `translate(${endX}px, ${endY}px) rotate(${angle}deg)`;
  sky.appendChild(star);
  const motion = star.animate(
    [
      { transform: from, opacity: 0 },
      { transform: from, opacity: 0.95, offset: 0.12 },
      { transform: to, opacity: 0 },
    ],
    { duration: 2200, easing: "ease-in", fill: "forwards" }
  );
  motion.onfinish = () => star.remove();
}

function scheduleStar() {
  const wait = 2600 + Math.random() * 4800;
  window.setTimeout(() => {
    if (!document.hidden) launchStar();
    scheduleStar();
  }, wait);
}

if (sky && !reduceMotion) {
  window.setTimeout(launchStar, 1200);
  scheduleStar();
}

const about = document.querySelector("#about");
const scrollButton = document.querySelector(".scroll-down");

function viewingAbout() {
  return about.getBoundingClientRect().top < window.innerHeight * 0.45;
}

function syncScrollButton() {
  const up = viewingAbout();
  scrollButton.classList.toggle("is-up", up);
  scrollButton.setAttribute("aria-label", up ? "Scroll to top" : "Scroll down");
}

function smoothScrollTo(target) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  const page = document.documentElement;
  page.style.scrollSnapType = "none";
  target.scrollIntoView({ behavior: "smooth", block: "start" });

  const restore = () => {
    page.style.scrollSnapType = "";
    window.removeEventListener("scrollend", restore);
  };
  window.addEventListener("scrollend", restore);
  window.setTimeout(restore, 900);
}

const home = document.querySelector("#home");

document.querySelector(".wordmark").addEventListener("click", (event) => {
  event.preventDefault();
  smoothScrollTo(home);
  history.pushState(null, "", "#home");
});

document.querySelector(".cta").addEventListener("click", (event) => {
  event.preventDefault();
  smoothScrollTo(about);
  history.pushState(null, "", "#about");
});

scrollButton.addEventListener("click", () => {
  const goingHome = viewingAbout();
  smoothScrollTo(goingHome ? home : about);
  history.pushState(null, "", goingHome ? "#home" : "#about");
});

window.addEventListener("scroll", syncScrollButton, { passive: true });
syncScrollButton();

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
