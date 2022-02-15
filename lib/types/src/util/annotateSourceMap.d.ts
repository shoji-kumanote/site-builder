/**
 * ソースマップの注釈追加・削除
 *
 * @param data - 元データ
 * @param sourceMapFileName - ソースマップのファイル名 / 省略時は注釈削除
 */
export declare const annotateSourceMap: (data: string, sourceMapFileName?: string | undefined) => string;
