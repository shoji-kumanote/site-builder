/**
 * ソースマップの注釈追加・削除
 *
 * @param data - 元データ
 * @param sourceMapFileName - ソースマップのファイル名 / 省略時は注釈削除
 */
export const annotateSourceMap = (
  data: string,
  sourceMapFileName?: string
): string => {
  const removed = data
    .replace(/\s*\/\*# sourceMappingURL.*?\*\/\s*/gm, "")
    .trim();

  if (sourceMapFileName === undefined) return removed;

  return `${removed}
/*# sourceMappingURL=${sourceMapFileName} */`;
};
