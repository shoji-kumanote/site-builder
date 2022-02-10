import fs from "fs";
import path from "path";

import jsYaml from "js-yaml";

import { PageData } from "../types/PageData";
import { getStringArray } from "../util/getStringArray";
import { mergeArray } from "../util/mergeArray";

import { FilterType, getFilterType } from "./FilterType";

/** タイプ: 設定ファイルデータ */
export type ConfigFileData = {
  /** ベースディレクトリ */
  readonly base: string;

  /** 出力ディレクトリ */
  readonly dist: string;

  /** ソースファイルのパターン */
  readonly src: string[];

  /** vendor 判定パターン */
  readonly vendor: string[];

  /** 無視ファイルのパターン */
  readonly ignore: string[];

  /** 無効フィルタ */
  readonly disabled: FilterType[];

  /** ページデータ */
  readonly data: PageData;
};

/**
 * 設定ファイル読み込み
 *
 * @param filePath - ファイルパス
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const load = async (filePath: string): Promise<any> => {
  try {
    return jsYaml.load(await fs.promises.readFile(filePath, "utf8"));
  } catch {
    throw new Error(`設定ファイルの読み込みに失敗しました: ${filePath}`);
  }
};

/**
 * 設定ファイルから設定ファイルデータを生成
 *
 * @param filePath - ファイルパス
 */
export const loadConfigFile = async (
  filePath: string
): Promise<ConfigFileData> => {
  const configFileData = await load(filePath);
  const configBaseDir = path.dirname(filePath);

  if (typeof configFileData !== "object" || configFileData === null) {
    throw new Error("設定ファイルの形式が正しくありません");
  }

  for (const key of ["base", "dist"]) {
    if (typeof configFileData[key] !== "string") {
      throw new Error(`設定ファイルに ${key} がないか、文字列ではありません`);
    }
  }

  for (const key of ["src", "vendor", "ignore"]) {
    if (key in configFileData) {
      try {
        getStringArray(configFileData[key], true);
      } catch (e) {
        throw new Error(
          `設定ファイルの ${key} が文字列または文字列の配列ではありません`
        );
      }
    }
  }

  const disabled: FilterType[] = [];

  if ("disabled" in configFileData) {
    try {
      for (const x of getStringArray(configFileData.disabled, true)) {
        try {
          disabled.push(getFilterType(x));
        } catch {
          throw new Error(
            `設定ファイルの disabled に不明なフィルタ種別: ${x} が指定されています`
          );
        }
      }
    } catch (e) {
      throw new Error(
        `設定ファイルの disabled が文字列または文字列の配列ではありません`
      );
    }
  }

  const base = path.resolve(configBaseDir, configFileData.base);

  return {
    base,
    dist: path.resolve(configBaseDir, configFileData.dist),
    src:
      "src" in configFileData
        ? getStringArray(configFileData.src).map((x) =>
            path.resolve(configBaseDir, x)
          )
        : [base],
    vendor:
      "vendor" in configFileData
        ? getStringArray(configFileData.vendor).map((x) =>
            path.resolve(configBaseDir, x)
          )
        : ["**/vendor/**/*"],
    ignore: getStringArray(configFileData.ignore).map((x) =>
      path.resolve(configBaseDir, x)
    ),
    disabled,
    data: configFileData.data,
  };
};

/** 複数設定で同一かどうかをチェックするキー */
const CHECK_KEYS: (keyof ConfigFileData)[] = ["base", "dist"];

/**
 * 複数の設定ファイルデータを合成
 *
 * @param args - 設定ファイルデータ
 */
export const mergeConfigFile = (...args: ConfigFileData[]): ConfigFileData => {
  if (args.length === 0) throw new Error("設定ファイルのデータがありません");

  if (args.length === 1) return args[0];

  const [a, b] = args;

  for (const key of CHECK_KEYS) {
    if (a[key] !== b[key]) {
      throw new Error(
        `複数の設定ファイルを使用する場合, ${key}の値は同じである必要があります`
      );
    }
  }

  return mergeConfigFile(
    {
      base: a.base,
      dist: a.dist,
      src: mergeArray(getStringArray(a.src), getStringArray(b.src)),
      vendor: mergeArray(getStringArray(a.vendor), getStringArray(b.vendor)),
      ignore: mergeArray(getStringArray(a.ignore), getStringArray(b.ignore)),
      disabled: mergeArray(
        getStringArray(a.disabled).map(getFilterType),
        getStringArray(b.disabled).map(getFilterType)
      ),
      data: { ...a.data, ...b.data },
    },
    ...args.slice(2)
  );
};
