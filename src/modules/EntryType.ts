import path from "path";

import micromatch from "micromatch";

/** 定義: エントリ種別 */
export const ENTRY_TYPES = {
  /** エントリ種別: vendor css */
  vendorCss: "vendorCss",
  /** エントリ種別: vendor ファイル */
  vendorFile: "vendorFile",

  /** エントリ種別: sass ライブラリ */
  sassLib: "sassLib",
  /** エントリ種別: hbs ライブラリ */
  hbsLib: "hbsLib",
  /** エントリ種別: mjs ライブラリ */
  mjsLib: "mjsLib",
  /** エントリ種別: ts ライブラリ */
  tsLib: "tsLib",

  /** エントリ種別: css */
  css: "css",
  /** エントリ種別: sass */
  sass: "sass",
  /** エントリ種別: hbs */
  hbs: "hbs",
  /** エントリ種別: tpl */
  tpl: "tpl",
  /** エントリ種別: html */
  html: "html",
  /** エントリ種別: js */
  js: "js",
  /** エントリ種別: mjs */
  mjs: "mjs",
  /** エントリ種別: ts */
  ts: "ts",
  /** エントリ種別: jpeg */
  jpeg: "jpeg",
  /** エントリ種別: png */
  png: "png",
  /** エントリ種別: gif */
  gif: "gif",
  /** エントリ種別: svg */
  svg: "svg",
  /** エントリ種別: file */
  file: "file",
} as const;

/** タイプ: エントリ種別 */
export type EntryType = typeof ENTRY_TYPES[keyof typeof ENTRY_TYPES];

export const getEntryType = (vendor: string[], filePath: string): EntryType => {
  const extName = path.extname(filePath);
  const lib = /^_/.test(path.basename(filePath));

  if (micromatch([filePath], vendor).length === 1) {
    return extName === ".css" ? ENTRY_TYPES.vendorCss : ENTRY_TYPES.vendorFile;
  }

  switch (extName) {
    case ".css":
      return ENTRY_TYPES.css;

    case ".sass":
    case ".scss":
      return lib ? ENTRY_TYPES.sassLib : ENTRY_TYPES.sass;

    case ".hbs":
      return lib ? ENTRY_TYPES.hbsLib : ENTRY_TYPES.hbs;

    case ".tpl":
      return lib ? ENTRY_TYPES.hbsLib : ENTRY_TYPES.tpl;

    case ".html":
      return lib ? ENTRY_TYPES.hbsLib : ENTRY_TYPES.html;

    case ".js":
      return ENTRY_TYPES.js;

    case ".mjs":
      return lib ? ENTRY_TYPES.mjsLib : ENTRY_TYPES.mjs;

    case ".ts":
      return lib ? ENTRY_TYPES.tsLib : ENTRY_TYPES.ts;

    case ".jpeg":
    case ".jpg":
      return ENTRY_TYPES.jpeg;

    case ".png":
      return ENTRY_TYPES.png;

    case ".gif":
      return ENTRY_TYPES.gif;

    case ".svg":
      return ENTRY_TYPES.svg;

    default:
      return ENTRY_TYPES.file;
  }
};
