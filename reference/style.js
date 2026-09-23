// example Javascript for animagram-jp/css/index.html demonstration and test

// for :indeterminate

document.querySelectorAll('input[type="checkbox"][data-indeterminate]')
    .forEach((input) => { input.indeterminate = true; });

// radio event for color scheme (light/dark x less/normal/more contrast)
(() => {
    const root = document.documentElement;
    const radios = document.querySelectorAll('input[name="color-scheme"]');
    if (!radios.length) return;

    // reflect the user's OS-level prefers-* settings as the initial radio position
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

// --- radio event for icon badge at the bottom right corner ---

const ICON_BADGE = {
    active:      { fill: "rgb(44,134,89)",  stroke: "rgb(255,255,255)" }, // --color-success (rgb(var(--rgb-accent-green)) mixed 83% with rgb(0,0,0))
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
    const link = document.querySelector('link[rel~="icon"]');
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
    showToast: (el) => {
        cancelToastCycle(el);
        el.classList.remove("hidden", "hide");
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.classList.add("show");
            const timer = setTimeout(() => jsFn.hideToast(el), 3000);
            toastCycles.set(el, { timer, controller: new AbortController() });
        }));
    },
    hideToast: (el) => {
        cancelToastCycle(el);
        const controller = new AbortController();
        const finish = () => {
            clearTimeout(fallback);
            el.classList.replace("hide", "hidden");
        };
        el.classList.replace("show", "hide");
        el.addEventListener("transitionend", finish, { once: true, signal: controller.signal });
        // fallback for prefers-reduced-motion
        const fallback = setTimeout(finish, 250);
        toastCycles.set(el, { timer: fallback, controller });
    },
};


/*  Password reveal. The button is markup-hidden so a page without this script
    keeps a plain password field; unhiding it here is what enables the toggle.
    The label stays put and aria-pressed carries the state, per the toggle
    button rule in InterfaceDesign.md: a control that holds its place should
    not restyle its own sign. Assistive technology announces the pressed
    change on its own, so no live region is needed. */
document.querySelectorAll('label > input[type="password"]').forEach((input) => {
    const button = input.parentElement.querySelector(":scope > button[aria-controls]");
    if (!button) return;
    button.hidden = false;
    button.addEventListener("click", () => {
        const revealed = button.getAttribute("aria-pressed") === "true";
        button.setAttribute("aria-pressed", String(!revealed));
        input.type = revealed ? "password" : "text";
    });
    /*  A submitted form must not leave the value as a plain text field, or the
        browser may remember it and offer it as autofill elsewhere. */
    input.form?.addEventListener("submit", () => {
        input.type = "password";
        button.setAttribute("aria-pressed", "false");
    });
});

/*  Step buttons are tabindex="-1" so the spinbutton input is the sole Tab
    stop; this binds them as its click/tap-only increment/decrement. */
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

window.jsFn = jsFn;
