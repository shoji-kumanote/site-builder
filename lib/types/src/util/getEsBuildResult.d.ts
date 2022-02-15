import { BuildResult, OutputFile } from "esbuild";
declare type EsBuildResult = BuildResult & {
    outputFiles: OutputFile[];
};
/**
 * esbuild の出力からコードとソースマップを抽出
 *
 * @param outputFiles - 出力ファイルリスト
 * @returns コード, ソースマップ, 依存ファイルの配列
 */
export declare const getEsBuildResult: (esBuildResult: EsBuildResult, srcDirPath: string) => [string, string | undefined, string[]];
export {};
