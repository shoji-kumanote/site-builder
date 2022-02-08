/**
 * 値を文字列の配列として解釈
 *
 * @param value - 値
 * @param strict - 厳密モード / trueの場合は不正データについて例外を投げる
 */
export const getStringArray = (value: unknown, strict = false): string[] => {
  if (value === undefined) return [];

  if (Array.isArray(value)) {
    const array = value.filter((x) => typeof x === "string");

    if (strict && value.length !== array.length) {
      throw new Error("配列に文字列以外が含まれています");
    }

    return array;
  }

  if (typeof value === "string") return [value];

  if (strict) {
    throw new Error("文字列または文字列の配列ではありません");
  }

  return [];
};
