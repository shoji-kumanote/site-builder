import { PageData } from "../types/PageData";
import { FilterType } from "./FilterType";
/** タイプ: 設定ファイルデータ */
export declare type ConfigFileData = {
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
 * 設定ファイルから設定ファイルデータを生成
 *
 * @param filePath - ファイルパス
 */
export declare const loadConfigFile: (filePath: string) => Promise<ConfigFileData>;
/**
 * 複数の設定ファイルデータを合成
 *
 * @param args - 設定ファイルデータ
 */
export declare const mergeConfigFile: (...args: ConfigFileData[]) => ConfigFileData;
