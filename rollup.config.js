import typescript from "@rollup/plugin-typescript";
import externals from "rollup-plugin-node-externals";

export default {
  plugins: [
    externals({
      builtins: true,
      deps: true,
      devDeps: true,
    }),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],
  input: "./src/index.ts",
  output: {
    file: "./lib/index.mjs",
    format: "es",
    inlineDynamicImports: true,
  },
};
