import base64
import functools
import html
import http.server
import io
import json
import math
import re
import socket
import subprocess
import threading
import time
import urllib.error
import urllib.request
from pathlib import Path

import numpy as np
import pypdfium2
from PIL import Image, ImageChops
from scipy import ndimage

SAFARI_PRINT = Path(__file__).resolve().with_name("safari_print.applescript")
PX_PER_MM = 96 / 25.4

SIZES_IN_MM = {
    "a3": (297, 420),
    "a4": (210, 297),
    "a5": (148, 210),
    "b4": (250, 353),
    "b5": (176, 250),
    "jis-b4": (257, 364),
    "jis-b5": (182, 257),
    "letter": (215.9, 279.4),
    "legal": (215.9, 355.6),
    "ledger": (279.4, 431.8),
}
UNITS_IN_MM = {"mm": 1, "cm": 10, "in": 25.4, "pt": 25.4 / 72, "pc": 25.4 / 6, "px": 25.4 / 96, "q": 0.25}

PAGE_RULE_SCRIPT = """
const flatten = (rules) => [...rules].flatMap((rule) => [rule, ...(rule.styleSheet ? flatten(rule.styleSheet.cssRules) : rule.cssRules ? flatten(rule.cssRules) : [])]);
const rules = [...document.styleSheets].flatMap((sheet) => {
    try { return flatten(sheet.cssRules); } catch { return []; }
}).filter((rule) => rule instanceof CSSPageRule && !rule.selectorText);
const rule = rules.at(-1);
if (!rule) return null;
const style = rule.style;
return {
    size: style.getPropertyValue("size"),
    margin: ["margin-top", "margin-right", "margin-bottom", "margin-left"].map((name) => style.getPropertyValue(name)),
};
"""

SHEET_SCRIPT = """
const probe = document.createElement("div");
probe.style.backgroundColor = "var(--color-paper)";
document.body.append(probe);
const paper = getComputedStyle(probe).backgroundColor;
probe.remove();
const [minimum, maximum] = arguments;
const candidates = [document.body, ...document.body.querySelectorAll("*")].filter((element) => {
    const rect = element.getBoundingClientRect();
    return getComputedStyle(element).backgroundColor === paper && rect.width >= minimum && rect.width <= maximum;
});
return candidates
    .filter((element) => !candidates.some((other) => other !== element && other.contains(element)))
    .map((element) => {
        const rect = element.getBoundingClientRect();
        return [rect.left + scrollX, rect.top + scrollY, rect.width, rect.height];
    });
"""

PRINT_ROOT_SCRIPT = """
const flatten = (rules) => [...rules].flatMap((rule) => [rule, ...(rule.styleSheet ? flatten(rule.styleSheet.cssRules) : rule.cssRules ? flatten(rule.cssRules) : [])]);
const media = [...document.styleSheets].flatMap((sheet) => {
    try { return flatten(sheet.cssRules); } catch { return []; }
}).filter((rule) => rule instanceof CSSMediaRule).map((rule) => [rule, rule.media.mediaText]);
for (const [rule, text] of media) {
    rule.media.mediaText = text.replace(/\\bscreen\\b/g, "tty").replace(/\\bprint\\b/g, "screen");
}
const size = getComputedStyle(document.documentElement).fontSize;
for (const [rule, text] of media) rule.media.mediaText = text;
const style = document.createElement("style");
style.textContent = `@media screen { html { font-size: ${size} !important; } }`;
document.head.append(style);
return size;
"""

READY_SCRIPT = """
return document.readyState === "complete" && !document.body.hidden && document.fonts.status === "loaded";
"""


class WebDriver:
    def __init__(self, url, capabilities):
        self.url = url
        value = self.request("POST", "/session", {"capabilities": {"alwaysMatch": capabilities}})
        self.session = value["sessionId"]

    def request(self, method, path, body=None):
        data = None if body is None else json.dumps(body).encode()
        request = urllib.request.Request(
            self.url + path, data=data, method=method, headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(request, timeout=300) as response:
                return json.load(response)["value"]
        except urllib.error.HTTPError as error:
            raise RuntimeError(f"{method} {path}: {error.read().decode()}") from None

    def command(self, method, path, body=None):
        return self.request(method, f"/session/{self.session}{path}", body)

    def execute(self, script, *args):
        return self.command("POST", "/execute/sync", {"script": script, "args": list(args)})

    def navigate(self, url):
        self.command("POST", "/url", {"url": url})

    def screenshot(self):
        data = base64.b64decode(self.command("GET", "/screenshot"))
        return Image.open(io.BytesIO(data)).convert("RGB")

    def quit(self):
        try:
            self.command("DELETE", "")
        except Exception:
            pass


class Server:
    def __init__(self, root):
        self.root = Path(root).resolve()
        handler = functools.partial(Quiet, directory=str(self.root))
        self.httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
        self.base = f"http://127.0.0.1:{self.httpd.server_address[1]}/"
        threading.Thread(target=self.httpd.serve_forever, daemon=True).start()

    def url(self, path):
        if isinstance(path, Path):
            return self.base + path.resolve().relative_to(self.root).as_posix()
        return self.base + path.lstrip("/")

    def close(self):
        self.httpd.shutdown()


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def free_port():
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def start_driver(browser):
    port = free_port()
    command = {"firefox": ["geckodriver", "--port", str(port)], "safari": ["safaridriver", "-p", str(port)]}[browser]
    process = subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    url = f"http://127.0.0.1:{port}"
    for _ in range(100):
        try:
            with urllib.request.urlopen(url + "/status", timeout=1):
                break
        except Exception:
            time.sleep(0.1)
    else:
        process.kill()
        raise RuntimeError(f"{command[0]} did not start")
    capabilities = {"browserName": browser}
    if browser == "firefox":
        capabilities["moz:firefoxOptions"] = {"args": ["-headless"]}
    return process, WebDriver(url, capabilities)


def wait(predicate, timeout, interval=0.25):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if predicate():
            return True
        time.sleep(interval)
    return False


def length_in_mm(token):
    match = re.fullmatch(r"(-?[\d.]+)([a-z]*)", token.strip().lower())
    if not match:
        raise ValueError(f"unsupported length: {token}")
    value, unit = match.groups()
    if value == "0" and unit == "":
        return 0.0
    return float(value) * UNITS_IN_MM[unit]


def page_size_in_mm(size):
    tokens = size.lower().split()
    orientation = next((token for token in tokens if token in ("portrait", "landscape")), None)
    tokens = [token for token in tokens if token not in ("portrait", "landscape")]
    if not tokens or tokens == ["auto"]:
        raise ValueError(f"@page size is not fixed: {size!r}")
    if tokens[0] in SIZES_IN_MM:
        width, height = SIZES_IN_MM[tokens[0]]
    else:
        lengths = [length_in_mm(token) for token in tokens]
        width, height = lengths[0], lengths[-1]
    if orientation == "landscape" and width < height or orientation == "portrait" and width > height:
        width, height = height, width
    return width, height


def capture(driver, rect):
    x, y, width, height = rect
    view_width, view_height = driver.execute("return [innerWidth, innerHeight]")
    canvas = None
    top = y
    while top < y + height - 0.5:
        scroll_x, scroll_y = driver.execute(
            "window.scrollTo({left: arguments[0], top: arguments[1], behavior: 'instant'});"
            "return [scrollX, scrollY];",
            max(0, x - 8),
            top,
        )
        shot = driver.screenshot()
        scale = shot.width / view_width
        if canvas is None:
            canvas = Image.new("RGB", (round(width * scale), round(height * scale)), "white")
        bottom = min(y + height, scroll_y + view_height)
        if bottom <= top:
            raise RuntimeError("viewport does not reach the requested rect")
        piece = shot.crop(
            (
                round((x - scroll_x) * scale),
                round((top - scroll_y) * scale),
                round((x + width - scroll_x) * scale),
                round((bottom - scroll_y) * scale),
            )
        )
        canvas.paste(piece, (0, round((top - y) * scale)))
        top = bottom
    return canvas


def capture_screen(driver, page_mm):
    rects = driver.execute(SHEET_SCRIPT, page_mm[0] * PX_PER_MM / 2, page_mm[0] * PX_PER_MM * 1.02)
    sheets = [capture(driver, rect) for rect in rects]
    sizes = [[round(width / PX_PER_MM, 2), round(height / PX_PER_MM, 2)] for _, _, width, height in rects]
    return sheets, sizes


def paginate(sheets, page_mm):
    images = []
    for sheet in sheets:
        page_height = round(sheet.width * page_mm[1] / page_mm[0])
        count = max(1, math.ceil(sheet.height / page_height - 0.02))
        for index in range(count):
            canvas = Image.new("RGB", (sheet.width, page_height), "white")
            canvas.paste(sheet.crop((0, index * page_height, sheet.width, min(sheet.height, (index + 1) * page_height))))
            images.append(canvas)
    return images


def print_firefox(driver, page_mm, margin_mm):
    data = driver.command(
        "POST",
        "/print",
        {
            "orientation": "portrait",
            "page": {"width": page_mm[0] / 10, "height": page_mm[1] / 10},
            "margin": dict(zip(("top", "right", "bottom", "left"), (value / 10 for value in margin_mm))),
            "background": True,
            "shrinkToFit": False,
        },
    )
    return base64.b64decode(data)


def print_safari(url, path, delay):
    path.unlink(missing_ok=True)
    subprocess.run(
        ["osascript", str(SAFARI_PRINT), url, str(path), str(delay)],
        check=True,
        timeout=180,
    )
    if not wait(lambda: path.exists() and path.stat().st_size > 0, 60):
        raise RuntimeError(f"Safari did not write {path}")


def detect_pages(shot, aspect):
    pixels = np.asarray(shot).astype(np.int16)
    height, width, _ = pixels.shape
    edge = pixels[height // 4 : height * 3 // 4, :4].reshape(-1, 3)
    colors, counts = np.unique(edge, axis=0, return_counts=True)
    background = colors[counts.argmax()]
    mask = np.abs(pixels - background).max(axis=2) > 6
    labels, _ = ndimage.label(mask)
    pages = []
    for found in ndimage.find_objects(labels):
        top, bottom = found[0].start, found[0].stop
        left, right = found[1].start, found[1].stop
        box_width, box_height = right - left, bottom - top
        if box_width < width / 5 or abs(box_width / box_height - aspect) > aspect * 0.04:
            continue
        pages.append(((top, left), trim(shot.crop((left, top, right, bottom)))))
    return [image for _, image in sorted(pages, key=lambda page: page[0])]


def trim(image, limit=12):
    gray = np.asarray(image.convert("L")).astype(np.float32)
    top, bottom, left, right = 0, gray.shape[0], 0, gray.shape[1]
    for _ in range(limit):
        if gray[top].mean() < 250:
            top += 1
        if gray[bottom - 1].mean() < 250:
            bottom -= 1
        if gray[:, left].mean() < 250:
            left += 1
        if gray[:, right - 1].mean() < 250:
            right -= 1
    return image.crop((left, top, right, bottom))


def capture_viewer(driver, url, aspect):
    driver.navigate(url)
    previous = None

    def settled():
        nonlocal previous
        shot = driver.screenshot()
        same = previous is not None and ImageChops.difference(shot, previous).getbbox() is None
        previous = shot
        return same

    wait(settled, 30, 1)
    return detect_pages(previous, aspect)


def register(image, reference, reach=4):
    if image is None or reference is None:
        return image
    image = image.resize(reference.size, Image.Resampling.LANCZOS)
    moving = 255 - np.asarray(image.convert("L")).astype(np.float32)
    fixed = 255 - np.asarray(reference.convert("L")).astype(np.float32)
    shifts = [(dx, dy) for dx in range(-reach, reach + 1) for dy in range(-reach, reach + 1)]
    dx, dy = min(shifts, key=lambda shift: np.abs(np.roll(moving, shift[::-1], axis=(0, 1)) - fixed).mean())
    canvas = Image.new("RGB", image.size, "white")
    canvas.paste(image, (dx, dy))
    return canvas


def rasterize(pdf, scale):
    document = pypdfium2.PdfDocument(pdf)
    images, sizes = [], []
    for page in document:
        width, height = page.get_size()
        sizes.append([round(width * 25.4 / 72, 2), round(height * 25.4 / 72, 2)])
        image = page.render(scale=4 * scale * 96 / 72, draw_annots=False).to_pil().convert("RGB")
        size = (round(width * scale * 96 / 72), round(height * scale * 96 / 72))
        images.append(image.resize(size, Image.Resampling.BOX))
    return images, sizes


def difference(first, second, threshold):
    if first is None or second is None:
        return None, None
    second = second.resize(first.size, Image.Resampling.LANCZOS)
    ink = [255 - ndimage.gaussian_filter(np.asarray(image.convert("L")).astype(np.float32), 1) for image in (first, second)]
    near = [ndimage.maximum_filter(layer, size=3) for layer in ink]
    mask = np.maximum(ink[0] - near[1], ink[1] - near[0]) > threshold
    overlay = Image.blend(first.convert("L").convert("RGB"), Image.new("RGB", first.size, "white"), 0.6)
    overlay.paste(Image.new("RGB", first.size, (220, 0, 0)), mask=Image.fromarray(mask.astype(np.uint8) * 255))
    return float(mask.mean()), overlay


def content(image, page_mm, margin_mm):
    px_per_mm = image.width / page_mm[0]
    top, right, bottom, left = (round(value * px_per_mm) for value in margin_mm)
    return image.crop((left, top, image.width - right, image.height - bottom))


def stack(images, width=None):
    width = width or max(image.width for image in images)
    canvas = Image.new("RGB", (width, sum(image.height for image in images)), "white")
    top = 0
    for image in images:
        canvas.paste(image, (0, top))
        top += image.height
    return canvas


def bands(image):
    gray = np.asarray(image.convert("L")).astype(np.int16)
    background = np.bincount(gray.ravel()).argmax()
    ink = np.abs(gray - background)
    inked = (ink > 24).any(axis=1)
    edges = np.flatnonzero(np.diff(np.concatenate(([0], inked.astype(np.int8), [0]))))
    result = []
    for start, end in zip(edges[::2].tolist(), edges[1::2].tolist()):
        profile = ink[start:end].sum(axis=0).astype(np.float64)
        profile = np.add.reduceat(profile, np.linspace(0, len(profile), 65, dtype=int)[:-1])
        result.append((start, end, profile))
    return result


def similar(first, second, tolerance):
    if abs((first[1] - first[0]) - (second[1] - second[0])) > tolerance:
        return False
    a, b = first[2] - first[2].mean(), second[2] - second[2].mean()
    norm = np.linalg.norm(a) * np.linalg.norm(b)
    return norm == 0 or float(a @ b) / norm > 0.9


def align(first, second, tolerance):
    rows, columns = len(first), len(second)
    same = np.array([[similar(a, b, tolerance) for b in second] for a in first], dtype=bool).reshape(rows, columns)
    score = np.zeros((rows + 1, columns + 1), dtype=np.int32)
    for i in range(rows - 1, -1, -1):
        for j in range(columns - 1, -1, -1):
            score[i, j] = max(score[i + 1, j], score[i, j + 1], score[i + 1, j + 1] + 1 if same[i, j] else 0)
    pairs, i, j = [], 0, 0
    while i < rows and j < columns:
        if same[i, j] and score[i, j] == score[i + 1, j + 1] + 1:
            pairs.append((i, j))
            i, j = i + 1, j + 1
        elif score[i + 1, j] >= score[i, j + 1]:
            i += 1
        else:
            j += 1
    return pairs


def flow(sheets, pages, layout, page_mm, margin_mm, threshold):
    screen = stack([content(sheet, page_mm, margin_mm) for sheet in sheets])
    parts = [content(page, page_mm, margin_mm) for page in pages]
    paged = stack(parts, screen.width)
    reference = stack([content(page, page_mm, margin_mm) for page in layout], screen.width)
    joins = np.cumsum([part.height for part in parts])[:-1].tolist()
    tolerance = round(0.5 * screen.width / (page_mm[0] - margin_mm[1] - margin_mm[3]))
    screen_bands, paged_bands = bands(screen), bands(reference)
    pairs = align(screen_bands, paged_bands, tolerance)
    rebuilt = Image.new("RGB", screen.size, "white")
    for i, j in pairs:
        start, end, _ = paged_bands[j]
        rebuilt.paste(paged.crop((0, start, paged.width, end)), (0, screen_bands[i][0]))
    notes = []
    split = [join for join in joins if any(start < join < end for start, end, _ in paged_bands)]
    if split:
        notes.append(f"content crosses page break at {len(split)} join(s)")
    if len(pairs) < max(len(screen_bands), len(paged_bands)):
        notes.append(f"unmatched bands: screen {len(screen_bands) - len(pairs)}, paged {len(paged_bands) - len(pairs)}")
    spacing = 0
    for (i, j), (k, l) in zip(pairs, pairs[1:]):
        if k != i + 1 or l != j + 1:
            continue
        gap_start, gap_end = paged_bands[j][1], paged_bands[l][0]
        if any(gap_start <= join <= gap_end for join in joins):
            continue
        if abs((screen_bands[k][0] - screen_bands[i][1]) - (gap_end - gap_start)) > tolerance:
            spacing += 1
    if spacing:
        notes.append(f"spacing differs at {spacing} gap(s)")
    ratio, overlay = difference(screen, rebuilt, threshold)
    return ratio, overlay, rebuilt, notes


def output(out, target, browser):
    directory = Path(out) / slug(target) / browser
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def slug(target):
    return re.sub(r"[^0-9A-Za-z]+", "_", target).strip("_")


def run_target(driver, server, browser, target, out, threshold, tolerance):
    directory = output(out, target, browser)
    for stale in directory.glob("*.png"):
        stale.unlink()
    url = server.url(target)
    driver.navigate(url)
    if not wait(lambda: driver.execute(READY_SCRIPT), 30):
        raise RuntimeError(f"{target} did not become ready")
    root_font_size = driver.execute(PRINT_ROOT_SCRIPT)
    driver.execute("return document.fonts.ready.then(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))")
    rule = driver.execute(PAGE_RULE_SCRIPT)
    if rule is None:
        raise RuntimeError(f"{target} has no @page rule")
    page_mm = page_size_in_mm(rule["size"])
    margin_mm = [length_in_mm(value) if value else 0.0 for value in rule["margin"]]
    driver.execute("dispatchEvent(new Event('beforeprint'))")
    sheets, sheet_sizes = capture_screen(driver, page_mm)
    driver.execute("dispatchEvent(new Event('afterprint'))")
    screens = paginate(sheets, page_mm)
    flowing = any(sheet.height > sheet.width * page_mm[1] / page_mm[0] * 1.02 for sheet in sheets)
    scale = driver.execute("return devicePixelRatio")

    pdf_path = directory / "output.pdf"
    if browser == "firefox":
        pdf_path.write_bytes(print_firefox(driver, page_mm, margin_mm))
    pdfs, pdf_sizes = rasterize(pdf_path, scale)

    page_height = max(page.height for page in pdfs) / scale if pdfs else 0
    driver.command("POST", "/window/rect", {"width": 1280, "height": round(len(pdfs) * (page_height + 16) + 200)})
    viewers = capture_viewer(driver, server.url(pdf_path) + "#zoom=100", page_mm[0] / page_mm[1])
    driver.command("POST", "/window/rect", {"width": 1280, "height": 1200})

    viewers = [register(image, pdfs[index] if index < len(pdfs) else None) for index, image in enumerate(viewers)]
    sources = {"screen": screens, "pdf": pdfs, "viewer": viewers}
    pairs = [("viewer", "pdf")] if flowing else [("screen", "pdf"), ("viewer", "pdf"), ("screen", "viewer")]
    pages = []
    for index in range(max(len(images) for images in sources.values())):
        page = {"index": index + 1, "images": {}, "diffs": {}}
        reference = pdfs[index] if index < len(pdfs) else None
        for name, images in sources.items():
            image = images[index] if index < len(images) else None
            if image is not None and reference is not None:
                image = image.resize(reference.size, Image.Resampling.LANCZOS)
            if image is not None:
                file = f"{name}-{index + 1}.png"
                image.save(directory / file)
                page["images"][name] = file
        for first, second in pairs:
            a = sources[first][index] if index < len(sources[first]) else None
            b = sources[second][index] if index < len(sources[second]) else None
            if reference is not None:
                a = a and a.resize(reference.size, Image.Resampling.LANCZOS)
                b = b and b.resize(reference.size, Image.Resampling.LANCZOS)
            ratio, overlay = difference(a, b, threshold)
            file = None
            if overlay is not None:
                file = f"diff-{first}-{second}-{index + 1}.png"
                overlay.save(directory / file)
            page["diffs"][f"{first}-{second}"] = {"ratio": ratio, "image": file}
        pages.append(page)

    flows = {}
    if flowing:
        for name in ("pdf", "viewer"):
            pair = f"screen-{name}"
            if len(sources[name]) != len(pdfs) or not pdfs:
                flows[pair] = {"ratio": None, "image": None, "notes": [f"{name} pages missing"]}
                continue
            ratio, overlay, rebuilt, notes = flow(sheets, sources[name], pdfs, page_mm, margin_mm, threshold)
            overlay.save(directory / f"diff-{pair}-flow.png")
            rebuilt.save(directory / f"{name}-flow.png")
            flows[pair] = {"ratio": ratio, "image": f"diff-{pair}-flow.png", "notes": notes}
        stack([content(sheet, page_mm, margin_mm) for sheet in sheets]).save(directory / "screen-flow.png")

    counts = {name: len(images) for name, images in sources.items()}
    issues = []
    if not flowing and len(set(counts.values())) > 1:
        issues.append(f"page count differs: {counts}")
    if counts["viewer"] != counts["pdf"]:
        issues.append(f"viewer page count {counts['viewer']} differs from pdf {counts['pdf']}")
    for pair, result in flows.items():
        issues.extend(f"flow {pair}: {note}" for note in result["notes"])
        if result["ratio"] is not None and result["ratio"] > tolerance:
            issues.append(f"flow {pair}: {result['ratio']:.4%}")
    for size in pdf_sizes:
        if abs(size[0] - page_mm[0]) > 0.5 or abs(size[1] - page_mm[1]) > 0.5:
            issues.append(f"pdf page size {size} differs from @page {list(page_mm)}")
            break
    for size in sheet_sizes:
        if abs(size[0] - page_mm[0]) > 0.5:
            issues.append(f"screen sheet width {size[0]} differs from @page {page_mm[0]}")
            break
    for page in pages:
        for pair, diff in page["diffs"].items():
            if diff["ratio"] is not None and diff["ratio"] > tolerance:
                issues.append(f"page {page['index']} {pair}: {diff['ratio']:.4%}")

    report = {
        "target": target,
        "browser": browser,
        "page": {"size": rule["size"], "mm": list(page_mm), "margin_mm": margin_mm},
        "screen_sheets_mm": sheet_sizes,
        "screen_root_font_size": root_font_size,
        "pdf_pages_mm": pdf_sizes,
        "counts": counts,
        "flow": flows,
        "pages": pages,
        "issues": issues,
    }
    return report


def write_index(out, reports):
    rows = []
    for report in reports:
        base = f"{slug(report['target'])}/{report['browser']}"
        rows.append(
            f"<h2>{html.escape(report['target'])} / {report['browser']}</h2>"
            f"<p>{html.escape(json.dumps(report['counts']))} @page {html.escape(report['page']['size'])}</p>"
            f"<ul>{''.join(f'<li>{html.escape(issue)}</li>' for issue in report['issues']) or '<li>no difference</li>'}</ul>"
        )
        for pair, result in report.get("flow", {}).items():
            ratio = "-" if result["ratio"] is None else f"{result['ratio']:.4%}"
            rows.append(f"<h3>flow {pair} {ratio}</h3><div>{img(base, result['image'])}</div>")
        for page in report["pages"]:
            cells = []
            for name in ("screen", "pdf", "viewer"):
                file = page["images"].get(name)
                cells.append(f"<figure><figcaption>{name}</figcaption>{img(base, file)}</figure>")
            for pair, diff in page["diffs"].items():
                ratio = "-" if diff["ratio"] is None else f"{diff['ratio']:.4%}"
                cells.append(f"<figure><figcaption>{pair} {ratio}</figcaption>{img(base, diff['image'])}</figure>")
            rows.append(f"<h3>page {page['index']}</h3><div>{''.join(cells)}</div>")
    style = (
        "body{font-family:sans-serif;margin:1rem}div{display:flex;gap:.5rem;overflow-x:auto}"
        "figure{margin:0}img{inline-size:20rem;border:1px solid #888}figcaption{font-size:.8rem}"
    )
    (Path(out) / "index.html").write_text(
        f'<!DOCTYPE html><html lang="ja"><meta charset="UTF-8"><title>print compare</title>'
        f"<style>{style}</style>{''.join(rows)}</html>"
    )


def img(base, file):
    return f'<a href="{base}/{file}"><img src="{base}/{file}" alt=""></a>' if file else "<p>missing</p>"


def compare(root, targets, out, browser, threshold=64, tolerance=0.002, safari_delay=5):
    Path(out).mkdir(parents=True, exist_ok=True)
    server = Server(root)
    if browser == "safari":
        for target in targets:
            print(f"[safari] print {target}", flush=True)
            try:
                print_safari(server.url(target), output(out, target, "safari") / "output.pdf", safari_delay)
            except Exception as error:
                print(f"  error: {error}", flush=True)
    process, driver = start_driver(browser)
    reports = []
    try:
        driver.command("POST", "/window/rect", {"width": 1280, "height": 1200})
        for target in targets:
            print(f"[{browser}] {target}", flush=True)
            try:
                report = run_target(driver, server, browser, target, out, threshold, tolerance)
            except Exception as error:
                report = {"target": target, "browser": browser, "counts": {}, "page": {"size": ""}, "pages": [], "issues": [f"error: {error}"]}
            reports.append(report)
            for issue in report["issues"]:
                print(f"  {issue}", flush=True)
    finally:
        driver.quit()
        process.terminate()
        process.wait(timeout=30)
        server.close()
    return reports
