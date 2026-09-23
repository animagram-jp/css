// example Javascript for animagram-jp/css/index.html demonstration and test

// indeterminate
document.querySelectorAll('input[type="checkbox"][data-indeterminate]').forEach((input) => { input.indeterminate = true; });

// === color scheme ===

(() => {
    const root = document.documentElement;
    const radios = document.querySelectorAll('input[name="color-scheme"]');
    if (!radios.length) return;

    const scheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const contrast = window.matchMedia("(prefers-contrast: more)").matches ? "-high-contrast"
        : window.matchMedia("(prefers-contrast: less)").matches ? "-less-contrast"
        : "";
    const initial = `${scheme}${contrast}`;

    const setColorScheme = (value) => root.setAttribute("data-color-scheme", value);

    const initialRadio = document.querySelector(`input[name="color-scheme"][value="${initial}"]`);
    if (initialRadio) initialRadio.checked = true;
    setColorScheme(initial);

    radios.forEach((radio) => radio.addEventListener("change", () => {
        setColorScheme(document.querySelector('input[name="color-scheme"]:checked').value);
    }));
})();

// === icon badge ===

const ICON_BADGE = {
    active:      { fill: "rgb(44,134,89)",  stroke: "rgb(255,255,255)" },
    information: { fill: "rgb(127,135,143)", stroke: "rgb(255,255,255)" },
};

const ICON_BADGE_RADIUS_RATIO = 5 / 32; // 
const ICON_BADGE_STROKE_RATIO = 0.3; // stroke width against radius

function drawIconBadge(name, badges, radiusRatio, strokeRatio, link, canvas, context, base, originalHref) {
    if (name === "none" || !base.complete) {
        link.href = originalHref;
        return;
    }

    const badge = badges[name];
    const size = Math.min(base.naturalWidth, base.naturalHeight);
    if (!badge || !size) return;

    const radius = size * radiusRatio;
    const stroke = radius * strokeRatio;
    const center = size - radius - stroke;
    canvas.width = canvas.height = size;

    context.clearRect(0, 0, size, size);
    context.imageSmoothingQuality = "high";
    context.drawImage(base, 0, 0, size, size);

    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.strokeStyle = badge.stroke;
    context.lineWidth = stroke * 2;
    context.stroke();

    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.fillStyle = badge.fill;
    context.fill();

    try {
        link.href = canvas.toDataURL("image/png");
    } catch (err) {
        console.warn("icon-badge: canvas is tainted, skipping badge overlay.", err);
        link.href = originalHref;
    }
}

function bindIconBadge(link, radios, badges, radiusRatio, strokeRatio) {
    if (!link || !radios.length) return;

    const originalHref = link.href;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const base = new Image();
    base.crossOrigin = "anonymous";

    const checkedValue = () => document.querySelector('input[name="icon-badge"]:checked')?.value;
    const draw = () => drawIconBadge(checkedValue(), badges, radiusRatio, strokeRatio, link, canvas, context, base, originalHref);

    base.addEventListener("load", draw);
    base.addEventListener("error", () => {
        console.warn("icon-badge: failed to load base icon image.");
    });
    base.src = link.href;

    radios.forEach((radio) => radio.addEventListener("change", draw));
}

bindIconBadge(
    [...document.querySelectorAll('link[rel~="icon"]')].find((link) => link.href && !link.href.startsWith("data:,")),
    document.querySelectorAll('input[name="icon-badge"]'),
    ICON_BADGE,
    ICON_BADGE_RADIUS_RATIO,
    ICON_BADGE_STROKE_RATIO
);

// === password ===

document.querySelectorAll('label > input[type="password"]').forEach((input) => {
    const button = input.parentElement.querySelector(":scope > button[aria-controls]");
    if (!button) return;
    button.hidden = false;
    button.addEventListener("click", () => {
        const revealed = button.getAttribute("aria-pressed") === "true";
        button.setAttribute("aria-pressed", String(!revealed));
        input.type = revealed ? "password" : "text";
    });
    input.form?.addEventListener("submit", () => {
        input.type = "password";
        button.setAttribute("aria-pressed", "false");
    });
});

// === step button ===

document.querySelectorAll('input[role="spinbutton"]').forEach((input) => {
    const label = input.closest("label");
    if (!label) return;

    const step = Number(input.step) || 1;
    const min = input.min === "" ? -Infinity : Number(input.min);
    const max = input.max === "" ? Infinity : Number(input.max);

    label.querySelectorAll(":scope > button[data-sign]").forEach((button) => {
        const sign = button.dataset.sign === "plus" ? 1 : -1;
        button.addEventListener("click", () => {
            const next = (Number(input.value) || 0) + sign * step;
            input.value = Math.min(max, Math.max(min, next));
            input.dispatchEvent(new Event("input", { bubbles: true }));
        });
    });
});

// === toast ===

const toast_cycles = new WeakMap();

const cancel_toast_cycle = (el) => {
    const cycle = toast_cycles.get(el);
    if (!cycle) return;
    clearTimeout(cycle.timer);
    cycle.controller.abort();
};

const js_fn = {
    show_toast: (el) => {
        cancel_toast_cycle(el);
        el.classList.remove("hidden", "hide");
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.classList.add("show");
            const timer = setTimeout(() => js_fn.hide_toast(el), 3000);
            toast_cycles.set(el, { timer, controller: new AbortController() });
        }));
    },
    hide_toast: (el) => {
        cancel_toast_cycle(el);
        const controller = new AbortController();
        const finish = () => {
            clearTimeout(fallback);
            el.classList.replace("hide", "hidden");
        };
        el.classList.replace("show", "hide");
        el.addEventListener("transitionend", finish, { once: true, signal: controller.signal });
        const fallback = setTimeout(finish, 250);
        toast_cycles.set(el, { timer: fallback, controller });
    },
};

window.js_fn = js_fn;