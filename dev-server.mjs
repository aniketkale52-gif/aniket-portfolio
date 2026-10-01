// Local dev server for this static site. No dependencies, just Node.js 18+.
// Run with:  npm run dev   (then open the link it prints)
// Serves the folder, and reloads the browser automatically when you save a file.

import { createServer } from "node:http";
import { createReadStream, statSync, watch, readFileSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";

const ROOT = resolve(".");
const START_PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};

// Small script added to every HTML page while developing; reloads on file changes.
const RELOAD_SNIPPET =
  '<script>(function(){var s=new EventSource("/__reload");s.onmessage=function(){location.reload()};})();</script>';

const clients = new Set();

function resolvePath(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  if (p.endsWith("/")) p += "index.html";
  const full = normalize(join(ROOT, p));
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null; // stay inside the folder
  try {
    const st = statSync(full);
    if (st.isDirectory()) return resolvePath(p + "/");
    return { full, size: st.size };
  } catch {
    // Clean URLs, like Vercel: /case-roar -> /case-roar.html
    if (!extname(full)) {
      try { const st = statSync(full + ".html"); return { full: full + ".html", size: st.size }; } catch {}
    }
    return null;
  }
}

const server = createServer((req, res) => {
  if (req.url === "/__reload") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    res.write("retry: 1000\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  const file = resolvePath(req.url || "/");
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found: " + req.url);
    return;
  }

  const type = TYPES[extname(file.full).toLowerCase()] || "application/octet-stream";

  if (type.startsWith("text/html")) {
    let html = readFileSync(file.full, "utf8");
    html = html.includes("</body>") ? html.replace("</body>", RELOAD_SNIPPET + "</body>") : html + RELOAD_SNIPPET;
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
    res.end(html);
    return;
  }

  // Byte ranges, so videos play, loop and seek properly (Safari requires this)
  const range = req.headers.range;
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    let start = m && m[1] ? parseInt(m[1], 10) : 0;
    let end = m && m[2] ? parseInt(m[2], 10) : file.size - 1;
    if (m && !m[1] && m[2]) { start = Math.max(0, file.size - parseInt(m[2], 10)); end = file.size - 1; }
    if (start >= file.size || end >= file.size || start > end) {
      res.writeHead(416, { "Content-Range": `bytes */${file.size}` });
      res.end();
      return;
    }
    res.writeHead(206, {
      "Content-Type": type,
      "Content-Range": `bytes ${start}-${end}/${file.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Cache-Control": "no-store",
    });
    createReadStream(file.full, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, { "Content-Type": type, "Content-Length": file.size, "Accept-Ranges": "bytes", "Cache-Control": "no-store" });
  createReadStream(file.full).pipe(res);
});

// Watch for saves and tell open pages to reload (debounced)
let timer = null;
try {
  watch(ROOT, { recursive: true }, (_event, name) => {
    if (!name || /(^|[\\/])(\.git|node_modules|\.vercel)([\\/]|$)/.test(name)) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      for (const c of clients) c.write("data: reload\n\n");
      console.log("  changed: " + name + " -> reloading");
    }, 120);
  });
} catch (e) {
  console.log("  (auto reload unavailable here: " + e.message + ")");
}

function listen(port) {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && port < START_PORT + 20) listen(port + 1);
    else { console.error(err); process.exit(1); }
  });
  server.listen(port, () => {
    console.log("\n  Portfolio running at  http://localhost:" + port + "\n  Saves reload the page automatically. Press Ctrl+C to stop.\n");
  });
}
listen(START_PORT);
