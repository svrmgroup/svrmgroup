import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";
import { PRERENDER_ROUTES, PRERENDER_CONTACT } from "./src/seo/prerenderRoutes.ts";

const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Writes dist/<route>/index.html with that page's head and a readable summary in #root
// (React replaces it on load), so non-JS crawlers see real content per page.
function prerenderPlugin(): Plugin {
  let outDir = "";
  return {
    name: "svrm-static-route-heads",
    apply: "build",
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir); },
    closeBundle() {
      const dist = outDir;
      const file = path.join(dist, "index.html");
      if (!fs.existsSync(file)) return;
      const base = fs.readFileSync(file, "utf8");
      for (const r of PRERENDER_ROUTES) {
        const url = `https://svrm.group${r.path === "/" ? "/" : r.path}`;
        let html = base
          .replace(/<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`)
          .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(r.description)}" />`)
          .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(r.title)}" />`)
          .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(r.description)}" />`)
          .replace("</head>", `  <link rel="canonical" href="${url}" data-rh="true" />\n  <meta property="og:url" content="${url}" data-rh="true" />\n</head>`)
          .replace('<div id="root"></div>', `<div id="root"><main><h1>${esc(r.heading)}</h1><p>${esc(r.summary)}</p><p>${esc(PRERENDER_CONTACT)}</p></main></div>`);
        const out = r.path === "/" ? file : path.join(dist, r.path.slice(1), "index.html");
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, html);
      }
    },
  };
}

function buildVersionPlugin(buildVersion: string): Plugin {
  return {
    name: "svrm-build-version",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "build-version.json",
        source: JSON.stringify({ version: buildVersion }),
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const buildVersion = `${Date.now()}`;

  return ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    buildVersionPlugin(buildVersion),
    prerenderPlugin(),
  ].filter(Boolean),
  define: {
    __BUILD_VERSION__: JSON.stringify(buildVersion),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  });
});
