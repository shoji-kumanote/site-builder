/** 定義: エントリ種別 */
export declare const ENTRY_TYPES: {
    /** エントリ種別: vendor css */
    readonly vendorCss: "vendorCss";
    /** エントリ種別: vendor ファイル */
    readonly vendorFile: "vendorFile";
    /** エントリ種別: sass ライブラリ */
    readonly sassLib: "sassLib";
    /** エントリ種別: hbs ライブラリ */
    readonly hbsLib: "hbsLib";
    /** エントリ種別: mjs ライブラリ */
    readonly mjsLib: "mjsLib";
    /** エントリ種別: ts ライブラリ */
    readonly tsLib: "tsLib";
    /** エントリ種別: css */
    readonly css: "css";
    /** エントリ種別: sass */
    readonly sass: "sass";
    /** エントリ種別: hbs */
    readonly hbs: "hbs";
    /** エントリ種別: tpl */
    readonly tpl: "tpl";
    /** エントリ種別: html */
    readonly html: "html";
    /** エントリ種別: js */
    readonly js: "js";
    /** エントリ種別: mjs */
    readonly mjs: "mjs";
    /** エントリ種別: ts */
    readonly ts: "ts";
    /** エントリ種別: jpeg */
    readonly jpeg: "jpeg";
    /** エントリ種別: png */
    readonly png: "png";
    /** エントリ種別: gif */
    readonly gif: "gif";
    /** エントリ種別: svg */
    readonly svg: "svg";
    /** エントリ種別: file */
    readonly file: "file";
};
/** タイプ: エントリ種別 */
export declare type EntryType = typeof ENTRY_TYPES[keyof typeof ENTRY_TYPES];
export declare const getEntryType: (vendor: string[], filePath: string) => EntryType;
