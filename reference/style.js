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
