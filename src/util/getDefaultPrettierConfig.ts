import prettier from "prettier";

/** prettierのデフォルトオプション取得 */
export const getDefaultPrettierConfig = (): prettier.Options => ({
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "css",
  printWidth: 80,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "none",
  useTabs: false,
});
