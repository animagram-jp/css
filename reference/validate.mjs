import { validatePath, reporters } from "csstree-validator";
import path from "node:path";

const TARGET = path.resolve(import.meta.dirname, "..", "css");

const IGNORED = [
    { property: "clip-path", value: /^shape\(/ },
    { property: "-webkit-line-break", value: /^after-white-space$/ },
];

const is_ignored = (error) => IGNORED.some(
    (rule) => error.property === rule.property && rule.value.test((error.css ?? "").trim())
);

const result = new Map();
let ignored = 0;

for (const [filename, error_list] of validatePath(TARGET)) {
    const kept = error_list.filter((error) => !is_ignored(error));
    ignored += error_list.length - kept.length;
    if (kept.length > 0) {
        result.set(path.relative(process.cwd(), filename), kept);
    }
}

const failing = [...result.values()].reduce((n, error_list) => n + error_list.length, 0);

if (failing > 0) {
    console.error(reporters.console(result));
}
console.log(`done: ${path.relative(process.cwd(), TARGET)} (${failing} failing, ${ignored} ignored)`);
process.exit(failing > 0 ? 1 : 0);
