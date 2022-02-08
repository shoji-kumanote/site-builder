import fs from "fs";
import esbuild from "esbuild";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const external = [...Object.keys(pkg?.dependencies ?? {}), "fs"];

esbuild
  .build({
    watch: process.argv.includes("--watch")
      ? {
          onRebuild() {
            console.info("rebuild");
          },
        }
      : false,
    bundle: true,
    format: "esm",

    platform: "node",
    target: ["node16"],
    outfile: "lib/index.mjs",
    entryPoints: ["src/index.ts"],
    external,
  })
  .then(() => {
    console.info("done");
  })
  .catch(console.error);
