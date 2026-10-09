const http = require("node:http");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

console.log("⚡ Generating pre-rendered static HTML for static CDN deployment...");

const port = "3999";
const serverProc = spawn("node", [".output/server/index.mjs"], {
  env: { ...process.env, PORT: port },
  stdio: "ignore",
});

let attempts = 0;
const maxAttempts = 20;

function tryFetch() {
  attempts++;
  const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      // Ensure UTF-8 clean string without BOM
      let cleanHtml = data;
      if (cleanHtml.charCodeAt(0) === 0xfeff) {
        cleanHtml = cleanHtml.slice(1);
      }

      // Ensure proper meta charset
      if (!cleanHtml.includes('<meta charset="utf-8">') && !cleanHtml.includes("<meta charSet=\"utf-8\"")) {
        cleanHtml = cleanHtml.replace(/<head>/i, '<head><meta charset="utf-8">');
      }

      const outPath = path.join(".output", "public", "index.html");
      fs.writeFileSync(outPath, Buffer.from(cleanHtml, "utf8"));
      console.log(`✓ Pre-rendered static HTML saved to ${outPath} (${cleanHtml.length} bytes)`);

      serverProc.kill();
      process.exit(0);
    });
  });

  req.on("error", () => {
    if (attempts < maxAttempts) {
      setTimeout(tryFetch, 600);
    } else {
      console.error("❌ Failed to connect to local server for pre-rendering");
      serverProc.kill();
      process.exit(1);
    }
  });
}

setTimeout(tryFetch, 1500);
