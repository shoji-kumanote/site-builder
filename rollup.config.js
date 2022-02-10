import typescript from "@rollup/plugin-typescript";
import externals from "rollup-plugin-node-externals";

const config = {
  input: "./src/index.ts",
  plugins: [
    externals({
      builtins: true,
      deps: true,
      devDeps: true,
    }),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],
};

export default [
  {
    ...config,
    output: {
      file: "./lib/index.js",
      format: "cjs",
      inlineDynamicImports: true,
    },
  },
  {
    ...config,
    output: {
      file: "./lib/index.mjs",
      format: "es",
      inlineDynamicImports: true,
    },
  },
];
