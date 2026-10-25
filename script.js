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
  paintWash();
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

const glowPath = [
  [30, 34],
  [40, 26],
  [52, 32],
  [62, 44],
  [56, 56],
  [44, 64],
  [32, 50],
];
const glowPath2 = [
  [72, 68],
  [64, 74],
  [54, 70],
  [44, 60],
  [36, 50],
  [30, 42],
  [40, 36],
];
const glowColor = {
  dark: ["rgba(232, 176, 72, 0.28)", "rgba(214, 112, 52, 0.16)"],
  light: ["rgba(232, 176, 72, 0.55)", "rgba(214, 112, 52, 0.36)"],
};

function mix(a, b, t) {
  return a + (b - a) * t;
}

const glowPlace = { x: 30, y: 34, x2: 72, y2: 68 };
let glowLoop = false;

function glowTarget() {
  const y = window.scrollY;
  let index = glowPath.length - 1;
  let t = 0;
  for (let i = 0; i < slides.length - 1; i++) {
    const start = slides[i].getBoundingClientRect().top + y;
    const end = slides[i + 1].getBoundingClientRect().top + y;
    if (y < end) {
      index = i;
      const span = end - start;
      t = span === 0 ? 0 : Math.min(Math.max((y - start) / span, 0), 1);
      break;
    }
  }
  const ease = t * t * (3 - 2 * t);
  const next = Math.min(index + 1, glowPath.length - 1);
  return {
    x: mix(glowPath[index][0], glowPath[next][0], ease),
    y: mix(glowPath[index][1], glowPath[next][1], ease),
    x2: mix(glowPath2[index][0], glowPath2[next][0], ease),
    y2: mix(glowPath2[index][1], glowPath2[next][1], ease),
  };
}

function paintWash() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const step = (k) => {
    const theme = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const goal = glowTarget();
    glowPlace.x += (goal.x - glowPlace.x) * k;
    glowPlace.y += (goal.y - glowPlace.y) * k;
    glowPlace.x2 += (goal.x2 - glowPlace.x2) * k;
    glowPlace.y2 += (goal.y2 - glowPlace.y2) * k;
    root.style.setProperty("--glow", glowColor[theme][0]);
    root.style.setProperty("--glow-2", glowColor[theme][1]);
    root.style.setProperty("--glow-x", `${glowPlace.x}%`);
    root.style.setProperty("--glow-y", `${glowPlace.y}%`);
    root.style.setProperty("--glow-x2", `${glowPlace.x2}%`);
    root.style.setProperty("--glow-y2", `${glowPlace.y2}%`);
  };
  if (reduce) {
    step(1);
    return;
  }
  if (glowLoop) return;
  glowLoop = true;
  const follow = () => {
    step(0.055);
    requestAnimationFrame(follow);
  };
  follow();
}

window.addEventListener("scroll", () => {
  syncScrollButton();
  paintWash();
}, { passive: true });
syncScrollButton();
paintWash();

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
