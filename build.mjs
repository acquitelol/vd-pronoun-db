import { rollup } from "rollup";
import { readFile, writeFile, readdir } from "fs/promises";
import { createHash } from "crypto";
import esbuild from "rollup-plugin-esbuild";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const manifest = JSON.parse(await readFile(`./manifest.json`));
const outPath = `./dist/index.js`;

try {
  const bundle = await rollup({
    input: `./${manifest.main}`,
    onwarn: () => {},
    plugins: [
      nodeResolve(),
      commonjs(),
      esbuild({
        target: "esnext",
        minify: true,
      }),
    ],
  });

  await bundle.write({
    file: outPath,
    globals(id) {
      if (id.startsWith("@vendetta"))
        return id.substring(1).replace(/\//g, ".");
      const map = {
        react: "window.React",
      };

      return map[id] || null;
    },
    format: "iife",
    compact: true,
    exports: "named",
  });
  await bundle.close();

  const toHash = await readFile(outPath);
  manifest.hash = createHash("sha256").update(toHash).digest("hex");
  manifest.main = "index.js";
  await writeFile(`./dist/manifest.json`, JSON.stringify(manifest));

  console.log(`Successfully built ${manifest.name}!`);
} catch (e) {
  console.error("Failed to build plugin...", e);
  process.exit(1);
}
