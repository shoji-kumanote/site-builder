import { CliOption } from "../types/CliOption";
import { PageData } from "../types/PageData";
import { ConfigFileData } from "./ConfigFile";
import { FilterType } from "./FilterType";
/** タイプ: 設定データ */
declare type ConfigData = Omit<CliOption & ConfigFileData, "data">;
/** クラス: 設定 */
export declare class Config implements ConfigData {
    #private;
    readonly dryRun: boolean;
    readonly dev: boolean;
    readonly base: string;
    readonly dist: string;
    /**
     * 設定を作成
     *
     * @param cliOption - コマンドラインオプション
     */
    static create(cliOption: CliOption): Promise<Config>;
    private constructor();
    get config(): string[];
    get src(): string[];
    get vendor(): string[];
    get ignore(): string[];
    get disabled(): FilterType[];
    get externalModules(): string[];
    /**
     * ページデータ取得
     *
     * @param entryPath - 対象のファイルパス
     */
    getData(entryPath?: string): PageData;
}
export {};
