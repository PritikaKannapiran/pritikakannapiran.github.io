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

applyTheme(root.getAttribute("data-theme") || "dark");

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

const homeLayer = document.querySelector(".bg-home");
const aboutLayer = document.querySelector(".bg-about");
const aiGlyphs = [
  '<circle cx="5" cy="7" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="5" cy="17" r="1.5"/><circle cx="12" cy="9.5" r="1.5"/><circle cx="12" cy="14.5" r="1.5"/><circle cx="19" cy="12" r="1.5"/><path d="M6.5 7 10.5 9.5M6.5 12h4M6.5 17 10.5 14.5M13.5 9.5 17.5 12M13.5 14.5 17.5 12"/>',
  '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9.5 4.5V7M12 4.5V7M14.5 4.5V7M9.5 17v2.5M12 17v2.5M14.5 17v2.5M4.5 9.5H7M4.5 12H7M4.5 14.5H7M17 9.5h2.5M17 12h2.5M17 14.5h2.5"/>',
  '<rect x="6" y="8" width="12" height="9" rx="3"/><circle cx="10" cy="12.5" r="1.1"/><circle cx="14" cy="12.5" r="1.1"/><path d="M12 8V5M9.5 17v2M14.5 17v2M8 5h8"/>',
  '<path d="m12 4 8 4-8 4-8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 16 8 4 8-4"/>',
  '<path d="M5.5 6.5h13a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H11l-3.5 3v-3H5.5A1.5 1.5 0 0 1 4 14V8a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M8 10h8M8 13h5"/>',
  '<path d="M3 12h2.2l1.6-4.2 2.2 8.2 2-5.6 1.8 3.4 1.4-1.8H21"/>',
  '<path d="M2.8 12S6.4 7 12 7s9.2 5 9.2 5-3.6 5-9.2 5-9.2-5-9.2-5Z"/><circle cx="12" cy="12" r="2.2"/>',
  '<circle cx="12" cy="12" r="2"/><path d="M12 4.5a7.5 7.5 0 0 1 6.8 4.4"/><path d="M17.2 5.2 19.2 4.6 18.4 6.6"/><path d="M12 19.5a7.5 7.5 0 0 1-6.8-4.4"/><path d="M6.8 18.8 4.8 19.4 5.6 17.4"/>',
  '<ellipse cx="12" cy="7" rx="6" ry="2.3"/><path d="M6 7v10c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3V7"/><path d="M6 12c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3"/>',
  '<circle cx="6.5" cy="8" r="1.8"/><circle cx="17" cy="6.5" r="1.8"/><circle cx="18" cy="16" r="1.8"/><circle cx="8" cy="17" r="1.8"/><path d="M8.2 8.4 15.2 7M7.6 15.4 16.3 15.6M7.4 9.6 7.8 15.2M16.4 8.2 17.4 14.2"/>',
  '<rect x="3.5" y="9" width="4.2" height="6" rx="1"/><rect x="9.9" y="9" width="4.2" height="6" rx="1"/><rect x="16.3" y="9" width="4.2" height="6" rx="1"/>',
  '<path d="M12 3 13.1 8.8 19 10 13.1 11.2 12 17 10.9 11.2 5 10 10.9 8.8Z"/>',
  '<path d="M5 7h14v10H5Z"/><path d="M8 11.2 10.2 13 8 14.8M12.2 15H16"/>',
  '<circle cx="12" cy="12" r="2.1"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1"/>',
];

if (homeLayer && aboutLayer) {
  homeLayer.querySelectorAll(".bg-icon").forEach((icon, index) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "bg-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("style", icon.getAttribute("style") || "");
    svg.innerHTML = aiGlyphs[(index * 5 + 1) % aiGlyphs.length];
    aboutLayer.appendChild(svg);
  });

  const aboutSection = document.querySelector("#about");
  let layerFrame = 0;

  const syncIconLayers = () => {
    layerFrame = 0;
    const span = window.innerHeight || 1;
    const raw = 1 - aboutSection.getBoundingClientRect().top / span;
    const t = Math.min(1, Math.max(0, raw));
    const eased = t * t * (3 - 2 * t);
    homeLayer.style.opacity = String(1 - eased);
    aboutLayer.style.opacity = String(eased);
  };

  window.addEventListener(
    "scroll",
    () => {
      if (layerFrame) return;
      layerFrame = window.requestAnimationFrame(syncIconLayers);
    },
    { passive: true }
  );
  syncIconLayers();
}

const about = document.querySelector("#about");
const work = document.querySelector("#work");
const papers = document.querySelector("#papers");
const stack = document.querySelector("#stack");
const projects = document.querySelector("#projects");
const contact = document.querySelector("#contact");
const scrollButton = document.querySelector(".scroll-down");
const slides = [document.querySelector("#home"), about, work, papers, projects, stack, contact];

function replayDraw(section) {
  section.classList.remove("is-drawn");
  void section.offsetWidth;
  section.classList.add("is-drawn");
}

function watchDraw(section) {
  if (!section) return;
  if (!("IntersectionObserver" in window)) {
    section.classList.add("is-drawn");
    return;
  }
  let drawn = false;
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible && !drawn) {
        replayDraw(section);
        drawn = true;
      } else if (!visible && drawn) {
        section.classList.remove("is-drawn");
        drawn = false;
      }
    },
    { threshold: 0.35 }
  );
  observer.observe(section);
}

watchDraw(stack);
watchDraw(contact);

function currentSlide() {
  const line = window.innerHeight * 0.45;
  let current = slides[0];
  for (const slide of slides) {
    if (slide.getBoundingClientRect().top < line) current = slide;
  }
  return current;
}

function syncScrollButton() {
  const up = currentSlide() === contact;
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

  let done = false;
  const arrived = () => Math.abs(target.getBoundingClientRect().top) < 2;
  const restore = () => {
    if (done || !arrived()) return;
    done = true;
    page.style.scrollSnapType = "";
    window.removeEventListener("scrollend", restore);
    window.clearInterval(watch);
    window.clearTimeout(giveUp);
  };
  const watch = window.setInterval(restore, 80);
  const giveUp = window.setTimeout(() => {
    done = true;
    page.style.scrollSnapType = "";
    window.removeEventListener("scrollend", restore);
    window.clearInterval(watch);
  }, 4000);
  window.addEventListener("scrollend", restore);
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
  const here = currentSlide();
  const next = here === contact ? home : slides[slides.indexOf(here) + 1];
  smoothScrollTo(next);
  history.pushState(null, "", `#${next.id}`);
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
