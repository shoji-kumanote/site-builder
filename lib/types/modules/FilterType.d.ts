/** 定義: フィルタ種別 */
export declare const FILTER_TYPES: {
    /** フィルタ種別: 何もしない */
    readonly thru: "thru";
    /** フィルタ種別: Smarty変換 */
    readonly smarty: "smarty";
    /** フィルタ種別: Handlebars 変換 */
    readonly hbsTransform: "hbsTransform";
    /** フィルタ種別: HTML 整形 */
    readonly htmlFormat: "htmlFormat";
    /** フィルタ種別: CSS 最適化 */
    readonly cssOptimize: "cssOptimize";
    /** フィルタ種別: CSS 整形 */
    readonly cssFormat: "cssFormat";
    /** フィルタ種別: CSS 縮小 */
    readonly cssMinify: "cssMinify";
    /** フィルタ種別: Sass コンパイル */
    readonly sassCompile: "sassCompile";
    /** フィルタ種別: JavaScript 最適化 */
    readonly jsOptimize: "jsOptimize";
    /** フィルタ種別: JavaScript 整形 */
    readonly jsFormat: "jsFormat";
    /** フィルタ種別: JavaScript 縮小 */
    readonly jsMinify: "jsMinify";
    /** フィルタ種別: CommonJS バンドル */
    readonly mjsBundle: "mjsBundle";
    /** フィルタ種別: TypeScript コンパイル＋バンドル */
    readonly tsBundle: "tsBundle";
    /** フィルタ種別: JPEG 最適化 */
    readonly jpegOptimize: "jpegOptimize";
    /** フィルタ種別: PNG 最適化 */
    readonly pngOptimize: "pngOptimize";
    /** フィルタ種別: GIF 最適化 */
    readonly gifOptimize: "gifOptimize";
    /** フィルタ種別: SVG 最適化 */
    readonly svgOptimize: "svgOptimize";
};
/** タイプ: フィルタ種別 */
export declare type FilterType = typeof FILTER_TYPES[keyof typeof FILTER_TYPES];
/**
 * 文字列からフィルタ種別を取得
 *
 * @param value - 文字列
 */
export declare const getFilterType: (value: string) => FilterType;
