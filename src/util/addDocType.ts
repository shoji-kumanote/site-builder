/**
 * htmlのdoctype宣言を追加 / すでにある分は削除
 *
 * @param data - 元データ
 * @param docType - 追加するdoctype
 */
export const addDocType = (
  data: string,
  docType = "<!DOCTYPE html>"
): string => `${docType}
${data.replace(/^\s*<!doctype html[^>]*>\s*/im, "")}`;
