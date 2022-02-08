/** 定義: フィルタ種別 */
export const FILTER_TYPES = {
  /** フィルタ種別: 何もしない */
  thru: "thru",

  /** フィルタ種別: Smarty変換 */
  smarty: "smarty",

  /** フィルタ種別: Handlebars 変換 */
  hbsTransform: "hbsTransform",

  /** フィルタ種別: HTML 整形 */
  htmlFormat: "htmlFormat",

  /** フィルタ種別: CSS 最適化 */
  cssOptimize: "cssOptimize",

  /** フィルタ種別: CSS 整形 */
  cssFormat: "cssFormat",

  /** フィルタ種別: CSS 縮小 */
  cssMinify: "cssMinify",

  /** フィルタ種別: Sass コンパイル */
  sassCompile: "sassCompile",

  /** フィルタ種別: JavaScript 最適化 */
  jsOptimize: "jsOptimize",

  /** フィルタ種別: JavaScript 整形 */
  jsFormat: "jsFormat",

  /** フィルタ種別: JavaScript 縮小 */
  jsMinify: "jsMinify",

  /** フィルタ種別: CommonJS バンドル */
  mjsBundle: "mjsBundle",

  /** フィルタ種別: TypeScript コンパイル＋バンドル */
  tsBundle: "tsBundle",

  /** フィルタ種別: JPEG 最適化 */
  jpegOptimize: "jpegOptimize",

  /** フィルタ種別: PNG 最適化 */
  pngOptimize: "pngOptimize",

  /** フィルタ種別: GIF 最適化 */
  gifOptimize: "gifOptimize",

  /** フィルタ種別: SVG 最適化 */
  svgOptimize: "svgOptimize",
} as const;

/** タイプ: フィルタ種別 */
export type FilterType = typeof FILTER_TYPES[keyof typeof FILTER_TYPES];

/**
 * 文字列からフィルタ種別を取得
 *
 * @param value - 文字列
 */
export const getFilterType = (value: string): FilterType => {
  if (value in FILTER_TYPES) return value as FilterType;

  throw new Error(`フィルタ種別: ${value} は存在しません`);
};
