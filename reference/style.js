(() => {
    const root = document.documentElement;
    const toggle = document.getElementById("theme-toggle");

    toggle.checked = window.matchMedia("(prefers-color-scheme: dark)").matches;

    toggle.addEventListener("change", () => {
        root.setAttribute("data-theme", toggle.checked ? "dark" : "light");
    });
})();

/* :indeterminate は IDL プロパティのみで HTML 属性が存在しないため、
   サンプル表示用に data-indeterminate 属性から付与する */

document.querySelectorAll('input[type="checkbox"][data-indeterminate]')
    .forEach((input) => { input.indeterminate = true; });

/* favicon にステータスを重ねるサンプル。
   色は base.css の CUD 配色に合わせた実値で持つ（canvas は CSS 変数を解決できないため）。
   色覚特性に依存しないよう、色相だけでなく塗り/抜きの形でも状態を区別している。 */

(() => {
    const STATUS = {
        active:      { color: "rgb(53,161,107)", filled: true  }, /* --rgb-accent-green */
        information: { color: "rgb(119,119,119)", filled: false },
    };

    const SIZE = 32;   /* 16 では点が 2〜3px となり潰れる */
    const CENTER = 24; /* 右下。多くのロゴは中央に重心があり四隅で最も情報が薄い */
    const RADIUS = 5;
    const EDGE = 1.5;  /* 下地から輪郭を立てるための縁取り */

    const link = document.querySelector("link[rel~='icon']");
    const text = document.getElementById("favicon-status-text");
    const radios = document.querySelectorAll('input[name="favicon-status"]');
    if (!link || !radios.length) return;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
    const context = canvas.getContext("2d");

    const base = new Image();
    base.src = link.href;

    const draw = (name) => {
        const status = STATUS[name];
        if (!status || !base.complete) return;

        context.clearRect(0, 0, SIZE, SIZE);
        context.imageSmoothingQuality = "high"; /* 512px から 16 倍縮小するため */
        context.drawImage(base, 0, 0, SIZE, SIZE);

        context.beginPath();
        context.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
        context.strokeStyle = "rgb(255,255,255)";
        context.lineWidth = EDGE * 2; /* 半分は円の内側に描かれる */
        context.stroke();

        context.fillStyle = status.filled ? status.color : "rgb(255,255,255)";
        context.fill();

        if (!status.filled) {
            context.strokeStyle = status.color;
            context.lineWidth = EDGE;
            context.stroke();
        }

        link.href = canvas.toDataURL("image/png");
        if (text) text.textContent = name;
    };

    const current = () => document.querySelector('input[name="favicon-status"]:checked')?.value;

    base.addEventListener("load", () => draw(current()));
    radios.forEach((radio) => radio.addEventListener("change", () => draw(current())));
})();

const jsFn = {
    show: (el) => {
        el.classList.remove("hidden");
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.classList.add("show");
            setTimeout(() => {
                el.classList.replace("show", "hide");
                el.addEventListener("transitionend", () => el.classList.remove("hide"), { once: true });
            }, 3000);
        }));
    },
    hide: (el) => {
        el.classList.replace("show", "hide");
        el.addEventListener("transitionend", () => el.classList.remove("hide"), { once: true });
    },
};
