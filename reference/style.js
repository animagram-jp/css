// example Javascript for animagram-jp/css/index.html demonstration and test

// for :indeterminate

document.querySelectorAll('input[type="checkbox"][data-indeterminate]')
    .forEach((input) => { input.indeterminate = true; });

// radio event for color theme (light/dark x less/normal/more contrast)
(() => {
    const root = document.documentElement;
    const radios = document.querySelectorAll('input[name="color-theme"]');
    if (!radios.length) return;

    // reflect the user's OS-level prefers-* settings as the initial radio position
    const scheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const contrast = window.matchMedia("(prefers-contrast: more)").matches ? "-high-contrast"
        : window.matchMedia("(prefers-contrast: less)").matches ? "-less-contrast"
        : "";
    const initial = `${scheme}${contrast}`;

    const setColorTheme = (value) => root.setAttribute("data-color-theme", value);

    const initialRadio = document.querySelector(`input[name="color-theme"][value="${initial}"]`);
    if (initialRadio) initialRadio.checked = true;
    setColorTheme(initial);

    radios.forEach((radio) => radio.addEventListener("change", () => {
        setColorTheme(document.querySelector('input[name="color-theme"]:checked').value);
    }));
})();

// --- radio event for icon badge at the bottom right corner ---

const ICON_BADGE = {
    active:      { fill: "rgb(53,161,107)",  stroke: "rgb(255,255,255)" }, // --rgb-accent-green
    information: { fill: "rgb(127,135,143)", stroke: "rgb(255,255,255)" }, // --rgb-grey
};

// ratio of badge for each icon
const ICON_BADGE_RADIUS_RATIO = 5 / 32;
const ICON_BADGE_STROKE_RATIO = 0.3; // outline width (color: stroke)

// compute location and size of badge for each icon data
function computeIconBadgeGeometry(icon) {
    const size = Math.min(icon.naturalWidth, icon.naturalHeight);
    if (!size) return null;

    const radius = size * ICON_BADGE_RADIUS_RATIO;
    const stroke = radius * ICON_BADGE_STROKE_RATIO;
    const center = size - radius - stroke;

    return { size, radius, stroke, center };
}

function drawIconBadge(name, { link, canvas, context, base, geometry, originalHref }) {
    if (name === "none" || !base.complete) {
        link.href = originalHref;
        return;
    }

    const badge = ICON_BADGE[name];
    if (!badge || !geometry) return;

    const { size, radius, stroke, center } = geometry;
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

(() => {
    const link = document.querySelector("link[rel~='icon']");
    const radios = document.querySelectorAll('input[name="icon-badge"]');
    if (!link || !radios.length) return;

    const originalHref = link.href;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const base = new Image();
    base.crossOrigin = "anonymous";

    let geometry = null;

    const current = () => document.querySelector('input[name="icon-badge"]:checked')?.value;
    const draw = (name) => drawIconBadge(name, { link, canvas, context, base, geometry, originalHref });

    base.addEventListener("load", () => {
        geometry = computeIconBadgeGeometry(base);
        if (!geometry) {
            console.warn("icon-badge: base icon has no size, skipping.");
            return;
        }
        draw(current());
    });
    base.addEventListener("error", () => {
        console.warn("icon-badge: failed to load base icon image.");
    });
    base.src = link.href;

    radios.forEach((radio) => radio.addEventListener("change", () => draw(current())));
})();

// role="alert" (assertive) for urgent statuses; info/success rely on output's implicit role="status" (polite).
const TOAST_ALERT_STATUSES = new Set(["warning", "error"]);
const TOAST_LABELS = { info: "Information", success: "Success", warning: "Warning", error: "Error" };

// Tracks each toast element's pending auto-hide timer and transitionend listener, so reusing a
// slot mid-animation (e.g. clicking again before the 3s auto-hide finishes) cancels the old cycle
// instead of stacking a second one on top of it — which otherwise leaves conflicting show/hide
// classes and orphaned listeners that permanently wedge the slot.
const toastCycles = new WeakMap();

const cancelToastCycle = (el) => {
    const cycle = toastCycles.get(el);
    if (!cycle) return;
    clearTimeout(cycle.timer);
    cycle.controller.abort();
};

const jsFn = {
    show: (el) => {
        cancelToastCycle(el);
        el.classList.remove("hidden", "hide");
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.classList.add("show");
            const timer = setTimeout(() => jsFn.hide(el), 3000);
            toastCycles.set(el, { timer, controller: new AbortController() });
        }));
    },
    hide: (el) => {
        cancelToastCycle(el);
        const controller = new AbortController();
        toastCycles.set(el, { timer: undefined, controller });
        el.classList.replace("show", "hide");
        el.addEventListener("transitionend", () => el.classList.replace("hide", "hidden"), { once: true, signal: controller.signal });
    },
    // Fills a free [data-type="toast"] output slot and shows it. Slots are reused, not bound
    // to a fixed status, so the slot count (not the status) caps how many toasts show at once.
    toast: (status, message, { style, size } = {}) => {
        const slots = document.querySelectorAll('[data-type="toast"] > output');
        const slot = [...slots].find((el) => el.classList.contains("hidden")) ?? slots[0];
        if (!slot) return;

        slot.dataset.status = status;
        if (style) slot.dataset.style = style; else delete slot.dataset.style;
        if (size) slot.dataset.size = size; else delete slot.dataset.size;

        if (TOAST_ALERT_STATUSES.has(status)) slot.setAttribute("role", "alert");
        else slot.removeAttribute("role");

        slot.replaceChildren();
        const span = document.createElement("span");
        const strong = document.createElement("strong");
        strong.textContent = `${TOAST_LABELS[status] ?? status}:`;
        span.append(strong, ` ${message}`);

        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", "Dismiss notification");
        button.addEventListener("click", () => jsFn.hide(slot));

        slot.append(span, button);
        jsFn.show(slot);
    },
};
