import { readdirSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import { build } from "esbuild";

const pluginsDir = "./plugins";
const distDir = "./dist";

if (!existsSync(distDir)) mkdirSync(distDir);

const plugins = readdirSync(pluginsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

for (const plugin of plugins) {
  const pluginPath = join(pluginsDir, plugin);
  const outPath = join(distDir, plugin);

  if (!existsSync(outPath)) mkdirSync(outPath, { recursive: true });

  if (existsSync(join(pluginPath, "manifest.json"))) {
    copyFileSync(join(pluginPath, "manifest.json"), join(outPath, "manifest.json"));
  }
  
  const entryFile = existsSync(join(pluginPath, "index.ts")) ? join(pluginPath, "index.ts") : join(pluginPath, "index.js");

  if (existsSync(entryFile)) {
    await build({
      entryPoints: [entryFile],
      bundle: true,
      outfile: join(outPath, "index.js"),
      format: "esm",
      minify: true,
      external: ["@vendetta/*", "react", "react-native"],
    });
  }
}
